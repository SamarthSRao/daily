import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";

// Types
interface Task {
  id: string;
  name: string;
  deadline: string; // ISO / datetime string
  focusTime: number; // minutes
  completed: boolean;
  completedAt?: string;
}

interface ActivityLog {
  time: string;
  activity: string;
}

interface DailyDeadline {
  id: string;
  name: string;
  time: string;
  completed: boolean;
}

interface FocusTimerState {
  endTs: number | null;
  timeLeft: number; // seconds
  isRunning: boolean;
  durationSec: number;
  sessionStartTs: number | null;
}

interface FocusSession {
  id: string;
  startTs: number;
  endTs: number;
  durationSec: number;
}

const DEFAULT_FOCUS_SECONDS = 60 * 60;
const FOCUS_TIMER_KEY = "properrr-focus-timer";
const FOCUS_SESSIONS_KEY = "properrr-focus-sessions";
const LEGACY_FOCUS_TIMER_END_KEY = "focus-timer-end";

const getDefaultTimerState = (): FocusTimerState => ({
  endTs: null,
  timeLeft: DEFAULT_FOCUS_SECONDS,
  isRunning: false,
  durationSec: DEFAULT_FOCUS_SECONDS,
  sessionStartTs: null,
});

const buildTimerStateFromEndTs = (
  endTs: number,
  durationSec: number,
  sessionStartTs: number | null,
): FocusTimerState => {
  const remaining = Math.floor((endTs - Date.now()) / 1000);
  if (remaining > 0) {
    return {
      endTs,
      timeLeft: remaining,
      isRunning: true,
      durationSec,
      sessionStartTs: sessionStartTs ?? endTs - durationSec * 1000,
    };
  }
  return getDefaultTimerState();
};

const normalizeTimerState = (
  state?: Partial<FocusTimerState> | null,
): FocusTimerState => {
  if (!state) return getDefaultTimerState();

  const durationSec =
    typeof state.durationSec === "number" && state.durationSec > 0
      ? Math.floor(state.durationSec)
      : DEFAULT_FOCUS_SECONDS;
  const endTs = typeof state.endTs === "number" ? state.endTs : null;
  const isRunning =
    typeof state.isRunning === "boolean" ? state.isRunning : false;
  const timeLeft =
    typeof state.timeLeft === "number" && state.timeLeft > 0
      ? Math.floor(state.timeLeft)
      : durationSec;
  const sessionStartTs =
    typeof state.sessionStartTs === "number" ? state.sessionStartTs : null;

  if (isRunning && endTs) {
    return buildTimerStateFromEndTs(endTs, durationSec, sessionStartTs);
  }

  if (isRunning && !endTs) {
    return {
      endTs: null,
      timeLeft,
      isRunning: false,
      durationSec,
      sessionStartTs: null,
    };
  }

  return {
    endTs: null,
    timeLeft,
    isRunning: false,
    durationSec,
    sessionStartTs: null,
  };
};

const getInitialTimerState = (): FocusTimerState => {
  if (typeof window === "undefined") return getDefaultTimerState();

  const raw = localStorage.getItem(FOCUS_TIMER_KEY);
  if (raw) {
    try {
      return normalizeTimerState(JSON.parse(raw));
    } catch (e) {
      // Fall through to legacy/local defaults
    }
  }

  const legacyEndTs = localStorage.getItem(LEGACY_FOCUS_TIMER_END_KEY);
  if (legacyEndTs) {
    const parsed = parseInt(legacyEndTs, 10);
    if (!Number.isNaN(parsed)) {
      return buildTimerStateFromEndTs(parsed, DEFAULT_FOCUS_SECONDS, null);
    }
  }

  return getDefaultTimerState();
};

const DEFAULT_MONKEY_QUOTES = [
  "Reddit is just research, right?",
  "One more video won't hurt.",
  "Let's clean the entire desk and organize our sock drawer first.",
  "We work best under pressure anyway!",
  "We can wake up early tomorrow and do it in 1 hour.",
  "Wait, let's read the Wikipedia page for the history of salt.",
  "Let's see what our high school friends are doing on LinkedIn.",
  "I should check my email just in case there's an emergency.",
  "Just 5 minutes of scrolling...",
  "It's 6:02 PM. Better wait until 7:00 PM to start.",
];

// Helper to generate personalized quotes
const getPersonalizedMonkeyQuote = (
  tasks: Task[],
  latestLog: ActivityLog | null,
) => {
  const incompleteTasks = tasks.filter((t) => !t.completed);
  const activeTaskName =
    incompleteTasks.length > 0 ? incompleteTasks[0].name : null;

  const nowMs = Date.now();
  const timeSinceLastLog = latestLog
    ? (nowMs - new Date(latestLog.time).getTime()) / (60 * 1000)
    : Infinity;

  const quotes: string[] = [];

  // 1. Task-based personalization
  if (activeTaskName) {
    quotes.push(
      `Is "${activeTaskName}" really that important? YouTube has a 3-hour video on marbles!`,
    );
    quotes.push(
      `Let's snooze, "${activeTaskName}" can definitely wait until tomorrow.`,
    );
    quotes.push(
      `Maybe we should research the history of salt instead of doing "${activeTaskName}"?`,
    );
    quotes.push(
      `"${activeTaskName}" sounds like a problem for Future Us. Let's play games!`,
    );
    quotes.push(
      `One quick video won't stop us from completing "${activeTaskName}"... right?`,
    );
  } else {
    quotes.push(
      "No tasks in brain? Excellent! Let's browse Reddit for 6 hours!",
    );
    quotes.push(
      "Perfect time to clean the entire room and organize our socks!",
    );
    quotes.push(
      "Let's see what our high school friends are doing on LinkedIn.",
    );
    quotes.push(
      "No goals today? Let's scroll social media until we feel dizzy.",
    );
  }

  // 2. Inactivity/procrastination log-based personalization
  if (latestLog) {
    const isProcrastinationLog =
      latestLog.activity === "Distracted" || latestLog.activity === "Break";
    if (isProcrastinationLog) {
      quotes.push(
        `Yes! We are successfully avoiding work. Let's keep this streak going!`,
      );
      quotes.push(`"Break" time is the best time. Who needs productivity?`);
    } else if (timeSinceLastLog > 20 && timeSinceLastLog < 1440) {
      quotes.push(
        `It's been ${Math.round(timeSinceLastLog)} minutes since our last work. We are on a roll!`,
      );
      quotes.push(
        "We haven't worked in 20+ minutes. Step away from the steering wheel, RDM!",
      );
      quotes.push(
        "Twenty minutes of doing nothing! Let's reward ourselves with a 2-hour nap.",
      );
    }
  }

  // Combine with default classics to keep variety
  const combined = [...quotes, ...DEFAULT_MONKEY_QUOTES];
  return combined[Math.floor(Math.random() * combined.length)];
};

export default function ProcrastinationMatrix() {
  // Local state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskFocusTime, setTaskFocusTime] = useState(60); // Default to 60 min (1 hour)

  // Timer state (Focus hour: 60 mins = 3600 secs)
  // Persisted locally + Redis so it survives refresh and syncs cross-device
  const initialTimerStateRef = useRef<FocusTimerState | null>(null);
  if (!initialTimerStateRef.current) {
    initialTimerStateRef.current = getInitialTimerState();
  }
  const [timeLeft, setTimeLeft] = useState(
    initialTimerStateRef.current.timeLeft,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(
    initialTimerStateRef.current.isRunning,
  );
  const [timerEndTs, setTimerEndTs] = useState<number | null>(
    initialTimerStateRef.current.endTs,
  );
  const [timerSessionStartTs, setTimerSessionStartTs] = useState<number | null>(
    initialTimerStateRef.current.sessionStartTs,
  );
  const [focusDurationSeconds, setFocusDurationSeconds] = useState(
    initialTimerStateRef.current.durationSec,
  );
  const [focusDurationInput, setFocusDurationInput] = useState(
    Math.round(initialTimerStateRef.current.durationSec / 60),
  );
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Driver states
  const [driver, setDriver] = useState<"rational" | "monkey" | "panic">(
    "monkey",
  );
  const [monkeyAlert, setMonkeyAlert] = useState(false);
  const [monkeyQuote, setMonkeyQuote] = useState("Let's check YouTube first.");

  // Scorecard stats
  const [scoreStats, setScoreStats] = useState({
    rational: 15,
    monkey: 80,
    panic: 5,
    isDefault: true,
  });

  // Panic Monster v2 deadlines
  const [panicDeadlines, setPanicDeadlines] = useState<
    {
      id: string;
      name: string;
      date: string;
      time: string;
      completed: boolean;
    }[]
  >([]);

  // Core initialization and polling
  useEffect(() => {
    const fetchData = async () => {
      // 1. Load tasks from Redis
      const remoteTasks = await loadState("properrr-brain-tasks", null);
      if (remoteTasks) {
        setTasks(remoteTasks);
        localStorage.setItem("brain-tasks", JSON.stringify(remoteTasks));
      } else {
        const savedTasks = localStorage.getItem("brain-tasks");
        if (savedTasks) {
          try {
            const parsed = JSON.parse(savedTasks);
            setTasks(parsed);
            await saveState("properrr-brain-tasks", parsed);
          } catch (e) {
            console.error("Error parsing brain-tasks", e);
          }
        } else {
          // Default sample task (10 years far-future deadline placeholder)
          const farFuture = new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16);
          const defaultTask: Task = {
            id: "default-1",
            name: "Read WaitButWhy Procrastination Matrix article",
            deadline: farFuture,
            focusTime: 60,
            completed: false,
          };
          setTasks([defaultTask]);
          localStorage.setItem("brain-tasks", JSON.stringify([defaultTask]));
          await saveState("properrr-brain-tasks", [defaultTask]);
        }
      }

      // 3. Load Panic Monster v2 deadlines from Redis
      const remoteDeadlines = await loadState(
        "properrr-panic-deadlines-v2",
        [],
      );
      if (remoteDeadlines) setPanicDeadlines(remoteDeadlines);

      // 2. Load activity logs from Redis
      const remoteLogs = await loadState("properrr-activity-logs", null);
      if (remoteLogs) {
        setActivityLogs(remoteLogs);
        localStorage.setItem("activity-logs", JSON.stringify(remoteLogs));
      } else {
        const savedLogs = localStorage.getItem("activity-logs");
        if (savedLogs) {
          try {
            const parsed = JSON.parse(savedLogs);
            setActivityLogs(parsed);
            await saveState("properrr-activity-logs", parsed);
          } catch (e) {
            console.error("Error parsing activity logs", e);
          }
        }
      }

      // 4. Load focus sessions from Redis
      const remoteFocusSessions = await loadState(FOCUS_SESSIONS_KEY, []);
      setFocusSessions(remoteFocusSessions || []);

      // 5. Load focus timer from Redis
      const remoteTimerState = await loadState(FOCUS_TIMER_KEY, null);
      let normalizedTimerState = normalizeTimerState(remoteTimerState);

      if (!remoteTimerState) {
        const legacyEndTs = localStorage.getItem(LEGACY_FOCUS_TIMER_END_KEY);
        if (legacyEndTs) {
          const parsed = parseInt(legacyEndTs, 10);
          if (!Number.isNaN(parsed)) {
            normalizedTimerState = buildTimerStateFromEndTs(
              parsed,
              DEFAULT_FOCUS_SECONDS,
              null,
            );
            await saveState(FOCUS_TIMER_KEY, normalizedTimerState);
          }
        }
      }

      if (
        remoteTimerState &&
        remoteTimerState.isRunning &&
        typeof remoteTimerState.endTs === "number" &&
        remoteTimerState.endTs <= Date.now()
      ) {
        const durationSec =
          typeof remoteTimerState.durationSec === "number" &&
          remoteTimerState.durationSec > 0
            ? Math.floor(remoteTimerState.durationSec)
            : DEFAULT_FOCUS_SECONDS;
        const sessionStartTs =
          typeof remoteTimerState.sessionStartTs === "number"
            ? remoteTimerState.sessionStartTs
            : remoteTimerState.endTs - durationSec * 1000;
        const endTs = remoteTimerState.endTs;
        if (endTs > sessionStartTs) {
          const newSession: FocusSession = {
            id: `focus-${endTs}`,
            startTs: sessionStartTs,
            endTs,
            durationSec: Math.floor((endTs - sessionStartTs) / 1000),
          };
          const nextSessions = [...(remoteFocusSessions || []), newSession];
          setFocusSessions(nextSessions);
          await saveState(FOCUS_SESSIONS_KEY, nextSessions);
        }
        const resetState: FocusTimerState = {
          ...getDefaultTimerState(),
          durationSec,
          timeLeft: durationSec,
        };
        normalizedTimerState = resetState;
        localStorage.removeItem(LEGACY_FOCUS_TIMER_END_KEY);
        await saveState(FOCUS_TIMER_KEY, resetState);
      }

      setTimeLeft(normalizedTimerState.timeLeft);
      setIsTimerRunning(normalizedTimerState.isRunning);
      setTimerEndTs(normalizedTimerState.endTs);
      setTimerSessionStartTs(normalizedTimerState.sessionStartTs);
      setFocusDurationSeconds(normalizedTimerState.durationSec);
      setFocusDurationInput(Math.round(normalizedTimerState.durationSec / 60));
    };

    fetchData();

    // Rotate Monkey quote every 12 seconds
    const quoteInterval = setInterval(() => {
      rotateMonkeyQuote();
    }, 12000);

    // Poll to update driver state (re-evaluates daily deadlines)
    const pollInterval = setInterval(() => {
      computeDriverState();
    }, 15000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(pollInterval);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Update dynamic quote based on work state
  const rotateMonkeyQuote = (
    currentTasks = tasks,
    currentLogs = activityLogs,
  ) => {
    const latestLog =
      currentLogs.length > 0 ? currentLogs[currentLogs.length - 1] : null;
    const newQuote = getPersonalizedMonkeyQuote(currentTasks, latestLog);
    setMonkeyQuote(newQuote);
  };

  // Sync state and compute driver on changes
  useEffect(() => {
    computeDriverState();
    rotateMonkeyQuote(tasks, activityLogs);
  }, [
    tasks,
    activityLogs,
    isTimerRunning,
    timeLeft,
    focusSessions,
    timerSessionStartTs,
    timerEndTs,
  ]);

  const persistTimerState = async (nextState: FocusTimerState) => {
    if (nextState.endTs) {
      localStorage.setItem(
        LEGACY_FOCUS_TIMER_END_KEY,
        nextState.endTs.toString(),
      );
    } else {
      localStorage.removeItem(LEGACY_FOCUS_TIMER_END_KEY);
    }
    await saveState(FOCUS_TIMER_KEY, nextState);
  };

  const appendFocusSession = async (startTs: number, endTs: number) => {
    if (!startTs || endTs <= startTs) return;
    const newSession: FocusSession = {
      id: `focus-${endTs}`,
      startTs,
      endTs,
      durationSec: Math.floor((endTs - startTs) / 1000),
    };
    setFocusSessions((prev) => {
      const nextSessions = [...prev, newSession];
      void saveState(FOCUS_SESSIONS_KEY, nextSessions);
      return nextSessions;
    });
  };

  const updateFocusDurationMinutes = async (minutes: number) => {
    if (Number.isNaN(minutes)) return;
    const clampedMinutes = Math.min(Math.max(Math.round(minutes), 5), 300);
    const durationSec = clampedMinutes * 60;
    setFocusDurationSeconds(durationSec);

    if (!isTimerRunning) {
      setTimeLeft(durationSec);
      setTimerEndTs(null);
      setTimerSessionStartTs(null);
      await persistTimerState({
        endTs: null,
        timeLeft: durationSec,
        isRunning: false,
        durationSec,
        sessionStartTs: null,
      });
    }
  };

  useEffect(() => {
    setFocusDurationInput(Math.round(focusDurationSeconds / 60));
  }, [focusDurationSeconds]);

  // countdown timer logic
  useEffect(() => {
    if (!isTimerRunning || !timerEndTs) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      const remaining = Math.floor((timerEndTs - Date.now()) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerEndTs]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft > 0) return;

    const finalizeTimer = async () => {
      const endTs = timerEndTs ?? Date.now();
      const startTs =
        timerSessionStartTs ?? endTs - focusDurationSeconds * 1000;
      await appendFocusSession(startTs, endTs);

      setIsTimerRunning(false);
      setTimerEndTs(null);
      setTimerSessionStartTs(null);
      setTimeLeft(focusDurationSeconds);
      await persistTimerState({
        endTs: null,
        timeLeft: focusDurationSeconds,
        isRunning: false,
        durationSec: focusDurationSeconds,
        sessionStartTs: null,
      });
      // Auto-log a deep work session upon completion
      logActivityDirect("Deep Work (Focus Hour Completed)");
      alert(
        "⏰ Focus Hour completed! The Rational Decision-Maker steering was successful!",
      );
    };

    void finalizeTimer();
  }, [
    isTimerRunning,
    timeLeft,
    timerEndTs,
    timerSessionStartTs,
    focusDurationSeconds,
  ]);

  // Timer controls
  const toggleTimer = async () => {
    if (!isTimerRunning) {
      const effectiveTimeLeft = timeLeft > 0 ? timeLeft : focusDurationSeconds;
      const sessionStartTs = Date.now();
      const endTs = sessionStartTs + effectiveTimeLeft * 1000;
      setTimeLeft(effectiveTimeLeft);
      setIsTimerRunning(true);
      setTimerEndTs(endTs);
      setTimerSessionStartTs(sessionStartTs);
      await persistTimerState({
        endTs,
        timeLeft: effectiveTimeLeft,
        isRunning: true,
        durationSec: focusDurationSeconds,
        sessionStartTs,
      });
    } else {
      const pauseTs = Date.now();
      if (timerSessionStartTs) {
        await appendFocusSession(timerSessionStartTs, pauseTs);
      }
      setIsTimerRunning(false);
      setTimerEndTs(null);
      setTimerSessionStartTs(null);
      await persistTimerState({
        endTs: null,
        timeLeft,
        isRunning: false,
        durationSec: focusDurationSeconds,
        sessionStartTs: null,
      });
    }
  };

  const resetTimer = async () => {
    const resetTs = Date.now();
    if (timerSessionStartTs) {
      await appendFocusSession(timerSessionStartTs, resetTs);
    }
    setIsTimerRunning(false);
    setTimerEndTs(null);
    setTimerSessionStartTs(null);
    setTimeLeft(focusDurationSeconds);
    await persistTimerState({
      endTs: null,
      timeLeft: focusDurationSeconds,
      isRunning: false,
      durationSec: focusDurationSeconds,
      sessionStartTs: null,
    });
  };

  // Logic to determine who is currently driving the wheel
  const computeDriverState = () => {
    // 1. Panic Monster Check
    const now = new Date();
    const nowMs = now.getTime();

    // Check standard brain-tasks deadlines
    const hasUpcomingStandardDeadline = tasks.some((task) => {
      if (task.completed) return false;
      const deadlineMs = new Date(task.deadline).getTime();
      const diffMs = deadlineMs - nowMs;
      return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
    });

    // Check panic deadlines v2 (date+time)
    const hasUpcomingPanicDeadline = panicDeadlines.some((d) => {
      if (d.completed) return false;
      const deadlineMs = new Date(`${d.date}T${d.time}`).getTime();
      const diffMs = deadlineMs - nowMs;
      return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
    });

    if (hasUpcomingStandardDeadline || hasUpcomingPanicDeadline) {
      setDriver("panic");
      setMonkeyAlert(false);
      calculateScorecard();
      return;
    }

    // 2. Pomodoro Active Check
    if (isTimerRunning) {
      setDriver("rational");
      setMonkeyAlert(false);
      calculateScorecard();
      return;
    }

    // 3. Activity Log / Time Since Last Log Check
    const latestLog =
      activityLogs.length > 0 ? activityLogs[activityLogs.length - 1] : null;
    let minsSinceLastLog = 999;
    let isProcrastinatingLog = false;

    if (latestLog) {
      minsSinceLastLog =
        (nowMs - new Date(latestLog.time).getTime()) / (60 * 1000);
      isProcrastinatingLog =
        latestLog.activity === "Distracted" || latestLog.activity === "Break";
    }

    if (minsSinceLastLog > 20 || isProcrastinatingLog) {
      setDriver("monkey");
      setMonkeyAlert(minsSinceLastLog > 20);
    } else {
      setDriver("rational");
      setMonkeyAlert(false);
    }

    calculateScorecard();
  };

  // Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    // Standard task has no manual date; default to 10 years in the future so it doesn't trigger panic monster
    const farFutureDate = new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    const newTask: Task = {
      id: "task-" + Date.now(),
      name: taskName.trim(),
      deadline: farFutureDate,
      focusTime: taskFocusTime,
      completed: false,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem("brain-tasks", JSON.stringify(updated));
    await saveState("properrr-brain-tasks", updated);
    setTaskName("");
    setTaskFocusTime(60); // Reset to 60 mins
  };

  // Toggle Task Completion
  const toggleTask = async (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem("brain-tasks", JSON.stringify(updated));
    await saveState("properrr-brain-tasks", updated);

    if (updated.some((t) => t.id === id && t.completed)) {
      logActivityDirect("Completed Task");
    }
  };

  const updateTaskFocusTimeDraft = (id: string, focusTime: number) => {
    if (Number.isNaN(focusTime)) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, focusTime } : t)),
    );
  };

  const updateTaskFocusTime = async (id: string, focusTime: number) => {
    if (Number.isNaN(focusTime)) return;
    const clamped = Math.min(Math.max(Math.round(focusTime), 5), 300);
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            focusTime: clamped,
          }
        : t,
    );
    setTasks(updated);
    localStorage.setItem("brain-tasks", JSON.stringify(updated));
    await saveState("properrr-brain-tasks", updated);
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("brain-tasks", JSON.stringify(updated));
    await saveState("properrr-brain-tasks", updated);
  };

  // Log activity with direct logging button
  const handleQuickLog = (activityType: string) => {
    logActivityDirect(activityType);
  };

  const logActivityDirect = async (activityType: string) => {
    const logs = JSON.parse(localStorage.getItem("activity-logs") || "[]");
    const newLog: ActivityLog = {
      time: new Date().toISOString(),
      activity: activityType,
    };
    logs.push(newLog);
    localStorage.setItem("activity-logs", JSON.stringify(logs));
    setActivityLogs(logs);

    // Sync to Redis
    await saveState("properrr-activity-logs", logs);

    // Let the parent / main app know there's a new log
    window.dispatchEvent(new Event("storage"));
  };

  // Calculate scorecard metrics
  const calculateScorecard = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayStart = new Date(`${todayStr}T00:00:00`).getTime();
    const nowMs = Date.now();

    const todayLogs = activityLogs
      .filter((l) => l.time.startsWith(todayStr))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const focusIntervals = focusSessions
      .map((session) => ({ start: session.startTs, end: session.endTs }))
      .filter((interval) => interval.end >= todayStart)
      .map((interval) => ({
        start: Math.max(interval.start, todayStart),
        end: Math.min(interval.end, nowMs),
      }));

    if (isTimerRunning && timerSessionStartTs) {
      const activeEnd = timerEndTs && timerEndTs < nowMs ? timerEndTs : nowMs;
      if (activeEnd > timerSessionStartTs) {
        focusIntervals.push({
          start: Math.max(timerSessionStartTs, todayStart),
          end: Math.min(activeEnd, nowMs),
        });
      }
    }

    if (todayLogs.length === 0 && focusIntervals.length === 0) {
      setScoreStats({ rational: 15, monkey: 80, panic: 5, isDefault: true });
      return;
    }

    let rdmCount = 0;
    let monkeyCount = 0;
    let panicCount = 0;

    const startTime = todayStart;
    const endTime = nowMs;
    const step = 5 * 60 * 1000; // 5 min increments

    const isWithinFocus = (t: number) =>
      focusIntervals.some(
        (interval) => t >= interval.start && t <= interval.end,
      );

    for (let t = startTime; t <= endTime; t += step) {
      if (isWithinFocus(t)) {
        rdmCount++;
        continue;
      }

      const activeLog = [...todayLogs]
        .reverse()
        .find((l) => new Date(l.time).getTime() <= t);

      // Check if there was an active deadline at time t
      let isPanic = false;

      // 1. Check standard tasks
      const isStandardPanic = tasks.some((task) => {
        if (task.completed) {
          const compTime = task.completedAt
            ? new Date(task.completedAt).getTime()
            : Infinity;
          if (compTime <= t) return false;
        }
        const deadlineTime = new Date(task.deadline).getTime();
        const diffMs = deadlineTime - t;
        return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
      });

      // 2. Check daily deadlines
      const dbKey = `properrr-daily-deadlines-${todayStr}`;
      const dailyDeadlinesStr = localStorage.getItem(dbKey);
      let isDailyPanic = false;
      if (dailyDeadlinesStr) {
        try {
          const dailyDeadlines = JSON.parse(
            dailyDeadlinesStr,
          ) as DailyDeadline[];
          isDailyPanic = dailyDeadlines.some((d) => {
            if (d.completed) return false;
            const [hours, mins] = d.time.split(":").map(Number);
            const deadlineDate = new Date(todayStr);
            deadlineDate.setHours(hours, mins, 0, 0);
            const diffMs = deadlineDate.getTime() - t;
            return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
          });
        } catch (e) {
          // ignore
        }
      }

      isPanic = isStandardPanic || isDailyPanic;

      if (isPanic) {
        panicCount++;
      } else if (!activeLog) {
        monkeyCount++;
      } else {
        const logTime = new Date(activeLog.time).getTime();
        const timeSinceLog = t - logTime;
        const isProcrastinationLog =
          activeLog.activity === "Distracted" || activeLog.activity === "Break";
        if (timeSinceLog > 20 * 60 * 1000 || isProcrastinationLog) {
          monkeyCount++;
        } else {
          rdmCount++;
        }
      }
    }

    const total = rdmCount + monkeyCount + panicCount;
    if (total === 0) {
      setScoreStats({ rational: 15, monkey: 80, panic: 5, isDefault: true });
    } else {
      setScoreStats({
        rational: Math.round((rdmCount / total) * 100),
        monkey: Math.round((monkeyCount / total) * 100),
        panic: Math.round((panicCount / total) * 100),
        isDefault: false,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="procrastination-matrix-section">
      <style>{`
        .procrastination-matrix-section {
          --wbw-pink: #ffd3e2;
          --wbw-pink-border: #ff85a2;
          --wbw-cream: #faf7f0;
          --wbw-brown: #8B5A2B;
          --wbw-red: #ff4d4d;
          --wbw-dark: #1e1e1e;
          --hand-border: 3px solid var(--wbw-dark);

          font-family: 'Nunito', sans-serif;
          background-color: var(--wbw-cream);
          border: var(--hand-border);
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
          box-shadow: 6px 6px 0px var(--wbw-dark);
          color: var(--wbw-dark);
        }

        .matrix-title {
          font-family: 'Permanent Marker', cursive;
          font-size: 2.2rem;
          text-align: center;
          margin-bottom: 4px;
          letter-spacing: 1px;
          transform: rotate(-1deg);
        }

        .matrix-subtitle {
          text-align: center;
          color: var(--meridian-text-muted);
          font-size: 1rem;
          margin-bottom: 24px;
          font-weight: 600;
        }

        /* Cockpit Frame styled as the wobbly Brain */
        .brain-cockpit-wrapper {
          position: relative;
          background: #fff;
          border: var(--hand-border);
          border-radius: 60px 60px 40px 40px / 50px 50px 30px 30px;
          overflow: hidden;
          padding: 12px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }

        .brain-cockpit-wrapper.driver-panic {
          border-color: var(--wbw-red);
          box-shadow: 0 0 20px rgba(255, 77, 77, 0.4), inset 0 0 20px rgba(255, 77, 77, 0.1);
          animation: cockpit-panic-pulse 1.5s infinite alternate;
        }

        @keyframes cockpit-panic-pulse {
          0% { box-shadow: 0 0 10px rgba(255, 77, 77, 0.3); }
          100% { box-shadow: 0 0 25px rgba(255, 77, 77, 0.7); }
        }

        /* Banner Slide Downs */
        .alert-banner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background-color: var(--wbw-dark);
          color: #fff;
          font-family: 'Permanent Marker', cursive;
          text-align: center;
          padding: 8px 12px;
          font-size: 0.95rem;
          z-index: 10;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .alert-banner.active {
          transform: translateY(0);
        }

        .alert-banner.panic {
          background-color: var(--wbw-red);
        }

        /* SVG Cockpit Layout */
        .brain-canvas-container {
          width: 100%;
          height: auto;
          min-height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fdfdfb;
        }

        .brain-svg {
          width: 100%;
          max-width: 800px;
          height: auto;
        }

        /* Speech Bubbles */
        .speech-bubble {
          position: absolute;
          background: #fff;
          border: 2px solid var(--wbw-dark);
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 0.85rem;
          max-width: 210px;
          font-weight: 700;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
          pointer-events: none;
          z-index: 8;
        }

        .speech-bubble::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: #fff;
          border-right: 2px solid var(--wbw-dark);
          border-bottom: 2px solid var(--wbw-dark);
        }

        .monkey-bubble {
          right: 15%;
          top: 15%;
        }
        .monkey-bubble::after {
          bottom: -7px;
          left: 30%;
          transform: rotate(45deg);
        }

        .monkey-driving-bubble {
          right: 28%;
          top: 12%;
        }
        .monkey-driving-bubble::after {
          bottom: -7px;
          left: 40%;
          transform: rotate(45deg);
        }

        .panic-bubble {
          left: 24%;
          top: 12%;
          border-color: var(--wbw-red);
          color: var(--wbw-red);
        }
        .panic-bubble::after {
          bottom: -7px;
          left: 30%;
          border-color: var(--wbw-red);
          transform: rotate(45deg);
        }

        /* Core Animation Classes */
        .animated-wheel {
          transform-origin: 400px 210px;
        }
        .driver-rational .animated-wheel {
          animation: steer-wheel 3s ease-in-out infinite;
        }
        .driver-monkey .animated-wheel {
          animation: steer-wheel 1.2s ease-in-out infinite;
        }

        .monkey-bouncing {
          transform-origin: 400px 155px;
          animation: monkey-bounce 1s ease-in-out infinite;
        }

        .monkey-idle-bouncing {
          transform-origin: 550px 180px;
          animation: monkey-bounce 3s ease-in-out infinite;
        }

        .monkey-shivering {
          transform-origin: 640px 100px;
          animation: shiver 0.15s linear infinite;
        }

        .panic-shaking {
          transform-origin: 220px 170px;
          animation: shiver 0.1s linear infinite;
        }

        .rdm-swaying {
          transform-origin: 400px 195px;
          animation: rdm-sway 3s ease-in-out infinite;
        }

        /* Keyframe Definitions */
        @keyframes steer-wheel {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }

        @keyframes monkey-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shiver {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          20% { transform: translate(-1px, -1px) rotate(-1deg); }
          40% { transform: translate(-2px, 0px) rotate(1deg); }
          60% { transform: translate(1px, 2px) rotate(0deg); }
          80% { transform: translate(-1px, 1px) rotate(-1deg); }
          100% { transform: translate(2px, -1px) rotate(1deg); }
        }

        @keyframes rdm-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg) translateX(2px); }
        }

        /* Deck / controls below brain */
        .dashboard-control-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-control-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Comic panels style */
        .comic-panel {
          background: #fff;
          border: var(--hand-border);
          border-radius: 12px 4px 10px 4px/4px 10px 4px 12px;
          padding: 16px;
          box-shadow: 4px 4px 0px var(--wbw-dark);
          display: flex;
          flex-direction: column;
        }

        .panel-heading {
          font-family: 'Permanent Marker', cursive;
          font-size: 1.3rem;
          margin-top: 0;
          margin-bottom: 12px;
          border-bottom: 2px solid var(--wbw-dark);
          padding-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Who's driving badge */
        .driver-badge-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .driver-avatar-mini {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--wbw-dark);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .driver-avatar-mini.rational { background-color: #e3f2fd; }
        .driver-avatar-mini.monkey { background-color: #efebe9; }
        .driver-avatar-mini.panic { background-color: #ffebee; }

        .driver-meta h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
        }
        .driver-meta p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--meridian-text-muted);
        }

        /* Quick Log Buttons */
        .quick-log-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .quick-log-btn {
          border: 2px solid var(--wbw-dark);
          background: #fff;
          padding: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 2px 2px 0 var(--wbw-dark);
        }

        .quick-log-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 var(--wbw-dark);
        }

        .quick-log-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 var(--wbw-dark);
        }

        .quick-log-btn.deep { background-color: #e3f2fd; }
        .quick-log-btn.shallow { background-color: #e8f5e9; }
        .quick-log-btn.distracted { background-color: #fff8e1; }
        .quick-log-btn.break { background-color: #eceff1; }

        /* Focus Timer */
        .focus-timer-container {
          text-align: center;
          border-top: 2px dashed #ccc;
          padding-top: 14px;
        }

        .digital-clock {
          font-family: 'Permanent Marker', cursive;
          font-size: 2.8rem;
          margin: 8px 0;
          letter-spacing: 2px;
        }

        .timer-btn-row {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .timer-btn {
          border: 2px solid var(--wbw-dark);
          background: #fff;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 2px 2px 0 var(--wbw-dark);
          transition: all 0.1s ease;
        }

        .timer-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 var(--wbw-dark);
        }

        .timer-btn.active {
          background-color: var(--wbw-pink);
        }

        .focus-timer-config {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .focus-duration-input {
          border: 2px solid var(--wbw-dark);
          padding: 4px;
          border-radius: 6px;
          font-size: 0.8rem;
          text-align: center;
          width: 70px;
          font-family: inherit;
        }

        .focus-duration-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Task input and list */
        .task-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }

        .task-input-text {
          border: 2px solid var(--wbw-dark);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
        }

        .task-input-row-mini {
          display: grid;
          grid-template-columns: 1fr 60px 40px;
          gap: 6px;
        }

        .task-input-date {
          border: 2px solid var(--wbw-dark);
          padding: 4px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-family: inherit;
        }

        .task-input-num {
          border: 2px solid var(--wbw-dark);
          padding: 4px;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
        }

        .add-task-btn {
          background: var(--wbw-pink);
          border: 2px solid var(--wbw-dark);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0 var(--wbw-dark);
        }

        .task-list-scroller {
          flex: 1;
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-right: 4px;
        }

        .task-item-card {
          border: 2px solid var(--wbw-dark);
          border-radius: 8px;
          padding: 8px;
          background: #fff;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .task-item-card.completed {
          opacity: 0.6;
          background: #f5f5f5;
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 6px;
        }

        .task-card-name {
          font-weight: 700;
          line-height: 1.2;
        }

        .task-card-name.line-through {
          text-decoration: line-through;
        }

        .task-card-meta {
          font-size: 0.75rem;
          color: var(--meridian-text-muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-time-edit {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
        }

        .task-time-input {
          border: 2px solid var(--wbw-dark);
          padding: 2px 4px;
          border-radius: 6px;
          font-size: 0.75rem;
          text-align: center;
          width: 60px;
          font-family: inherit;
        }

        .task-action-btns {
          display: flex;
          gap: 6px;
        }
        .task-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: var(--wbw-dark);
        }
        .task-icon-btn:hover {
          color: var(--wbw-red);
        }
        .task-icon-btn.comp:hover {
          color: #2e7d32;
        }

        /* Hand drawn Daily scorecard bar chart */
        .scorecard-chart-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .score-bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .score-bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .hand-drawn-bar-track {
          height: 24px;
          border: var(--hand-border);
          border-radius: 12px;
          background: #fdfdfd;
          overflow: hidden;
          position: relative;
        }

        .hand-drawn-bar-fill {
          height: 100%;
          border-right: 2px solid var(--wbw-dark);
          transition: width 0.8s ease-in-out;
        }

        .hand-drawn-bar-fill.rdm-fill { background-color: #64b5f6; }
        .hand-drawn-bar-fill.monkey-fill { background-color: #d7ccc8; }
        .hand-drawn-bar-fill.panic-fill { background-color: #e57373; }

        .scorecard-caption {
          margin-top: auto;
          font-family: 'Permanent Marker', cursive;
          font-size: 0.9rem;
          text-align: center;
          padding: 8px;
          border: 2px dashed #ccc;
          border-radius: 6px;
          transform: rotate(0.5deg);
        }
      `}</style>

      <h2 className="matrix-title">MY BRAIN IN HIGH SCHOOL</h2>
      <div className="matrix-subtitle">
        WaitButWhy Interactive Cockpit System
      </div>

      {/* Cockpit Frame (Brain wobbly area) */}
      <div
        className={`brain-cockpit-wrapper ${driver === "panic" ? "driver-panic" : ""}`}
      >
        {/* Monkey Alert warning banner */}
        <div className={`alert-banner ${monkeyAlert ? "active" : ""}`}>
          <AlertOctagon size={16} />
          <span>THE MONKEY HAS THE WHEEL. STEP AWAY FROM YOUTUBE.</span>
        </div>

        {/* Panic Monster active warning banner */}
        <div
          className={`alert-banner panic ${driver === "panic" ? "active" : ""}`}
        >
          <AlertOctagon size={16} />
          <span>PANIC MONSTER DETECTED: DEADLINE WITHIN 12 HOURS!</span>
        </div>

        {/* Dynamic Speech Bubbles */}
        {driver === "monkey" && (
          <div className="speech-bubble monkey-driving-bubble">
            "{monkeyQuote}"
          </div>
        )}
        {driver === "rational" && !isTimerRunning && (
          <div className="speech-bubble monkey-bubble">
            "Are you sure we shouldn't just look at Wikipedia page for salt?"
          </div>
        )}
        {driver === "panic" && (
          <div className="speech-bubble panic-bubble">
            "WE ARE GOING TO FAIL! WORK WORK WORK!"
          </div>
        )}

        {/* The Brain SVG Playground */}
        <div className="brain-canvas-container">
          <svg
            className="brain-svg"
            viewBox="0 0 800 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wobbly Inner Brain Outline */}
            <path
              d="M 50,180 C 50,90 140,50 250,60 C 310,40 490,40 550,60 C 660,50 750,90 750,180 C 770,250 720,310 650,310 C 550,330 250,330 150,310 C 80,310 30,250 50,180 Z"
              fill="#FAF8F2"
              stroke="#ffccd5"
              strokeWidth="5"
              strokeDasharray="4 6"
            />
            <path
              d="M 48,182 C 48,88 138,48 248,58 C 308,38 488,38 548,58 C 658,48 748,88 748,182 C 768,248 718,308 648,308 C 548,328 248,328 148,308 C 78,308 28,248 48,182 Z"
              fill="none"
              stroke="#111"
              strokeWidth="2.5"
            />

            {/* EYEBROWS AND EYES OF THE HOST (AT BOTTOM) */}
            <path
              d="M 340,320 Q 360,312 380,320"
              stroke="#111"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 420,320 Q 440,312 460,320"
              stroke="#111"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="360" cy="336" r="8" fill="#111" />
            <circle cx="440" cy="336" r="8" fill="#111" />

            {/* --- STEERING WHEEL --- */}
            <g className="animated-wheel" style={{ transformBox: "fill-box" }}>
              {/* Wooden wheel core */}
              <circle
                cx="400"
                cy="210"
                r="40"
                fill="none"
                stroke="#8B5A2B"
                strokeWidth="8"
              />
              <circle
                cx="400"
                cy="210"
                r="44"
                fill="none"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="400"
                cy="210"
                r="36"
                fill="none"
                stroke="#111"
                strokeWidth="1.5"
              />

              {/* Central hub */}
              <circle
                cx="400"
                cy="210"
                r="10"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="2.5"
              />
              <circle cx="400" cy="210" r="3" fill="#111" />

              {/* 6 Spokes */}
              <line
                x1="400"
                y1="210"
                x2="400"
                y2="150"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="400"
                y2="150"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="400"
                cy="150"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />

              <line
                x1="400"
                y1="210"
                x2="452"
                y2="180"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="452"
                y2="180"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="452"
                cy="180"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />

              <line
                x1="400"
                y1="210"
                x2="452"
                y2="240"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="452"
                y2="240"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="452"
                cy="240"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />

              <line
                x1="400"
                y1="210"
                x2="400"
                y2="270"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="400"
                y2="270"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="400"
                cy="270"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />

              <line
                x1="400"
                y1="210"
                x2="348"
                y2="240"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="348"
                y2="240"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="348"
                cy="240"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />

              <line
                x1="400"
                y1="210"
                x2="348"
                y2="180"
                stroke="#8B5A2B"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="400"
                y1="210"
                x2="348"
                y2="180"
                stroke="#111"
                strokeWidth="1.5"
              />
              <circle
                cx="348"
                cy="180"
                r="5"
                fill="#CD853F"
                stroke="#111"
                strokeWidth="1.5"
              />
            </g>

            {/* Steer column (gray pedestal) */}
            <path
              d="M 392,270 L 388,310 L 412,310 L 408,270 Z"
              fill="#9e9e9e"
              stroke="#111"
              strokeWidth="2.5"
            />

            {/* --- RATIONAL DECISION-MAKER --- */}
            {driver === "rational" ? (
              <g className="rdm-swaying" style={{ transformBox: "fill-box" }}>
                <circle
                  cx="400"
                  cy="120"
                  r="18"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="3"
                />
                <circle cx="393" cy="115" r="2" fill="#111" />
                <circle cx="407" cy="115" r="2" fill="#111" />
                <path
                  d="M 393,124 Q 400,131 407,124"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="400"
                  y1="138"
                  x2="400"
                  y2="195"
                  stroke="#111"
                  strokeWidth="3"
                />
                <path
                  d="M 400,148 Q 365,160 375,190"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 400,148 Q 435,160 425,190"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="400"
                  y1="195"
                  x2="385"
                  y2="245"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="400"
                  y1="195"
                  x2="415"
                  y2="245"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g>
                <circle
                  cx="310"
                  cy="135"
                  r="18"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="3"
                />
                <circle cx="304" cy="130" r="2.5" fill="#111" />
                <circle cx="316" cy="130" r="2.5" fill="#111" />
                <line
                  x1="304"
                  y1="140"
                  x2="316"
                  y2="140"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 324,121 C 326,124 326,127 324,129 C 322,127 322,124 324,121 Z"
                  fill="#29b6f6"
                />
                <line
                  x1="310"
                  y1="153"
                  x2="310"
                  y2="205"
                  stroke="#111"
                  strokeWidth="3"
                />
                <path
                  d="M 310,163 Q 290,170 295,190"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 310,163 Q 330,170 325,190"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="310"
                  y1="205"
                  x2="295"
                  y2="255"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="310"
                  y1="205"
                  x2="325"
                  y2="255"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* --- INSTANT GRATIFICATION MONKEY --- */}
            {driver === "monkey" ? (
              <g
                className="monkey-bouncing"
                style={{ transformBox: "fill-box" }}
              >
                <circle
                  cx="378"
                  cy="148"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="422"
                  cy="148"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="400"
                  cy="150"
                  r="18"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <ellipse
                  cx="400"
                  cy="155"
                  rx="13"
                  ry="10"
                  fill="#FDF5E6"
                  stroke="#111"
                  strokeWidth="2"
                />
                <path
                  d="M 390,154 Q 400,166 410,154"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="394"
                  cy="145"
                  r="4.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle
                  cx="406"
                  cy="145"
                  r="4.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle cx="394" cy="145" r="1.5" fill="#111" />
                <circle cx="406" cy="145" r="1.5" fill="#111" />
                <ellipse
                  cx="400"
                  cy="188"
                  rx="11"
                  ry="16"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <ellipse cx="400" cy="190" rx="7" ry="10" fill="#FDF5E6" />
                <path
                  d="M 391,180 Q 365,185 375,205"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 409,180 Q 435,185 425,205"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 392,203 Q 380,225 375,235"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 408,203 Q 420,225 425,235"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 395,203 Q 370,222 350,212 T 345,190"
                  fill="none"
                  stroke="#8B5A2B"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 395,203 Q 370,222 350,212 T 345,190"
                  fill="none"
                  stroke="#111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            ) : driver === "panic" ? (
              <g
                className="monkey-shivering"
                style={{ transformBox: "fill-box" }}
              >
                <circle
                  cx="618"
                  cy="98"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="662"
                  cy="98"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="640"
                  cy="100"
                  r="18"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <ellipse
                  cx="640"
                  cy="105"
                  rx="13"
                  ry="10"
                  fill="#FDF5E6"
                  stroke="#111"
                  strokeWidth="2"
                />
                <path
                  d="M 632,107 Q 640,102 648,107"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="632"
                  cy="94"
                  r="5.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle
                  cx="648"
                  cy="94"
                  r="5.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle cx="632" cy="94" r="2.5" fill="#111" />
                <circle cx="648" cy="94" r="2.5" fill="#111" />
                <ellipse
                  cx="640"
                  cy="138"
                  rx="11"
                  ry="16"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <path
                  d="M 630,130 Q 610,125 605,115"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 650,130 Q 675,125 670,115"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 632,152 Q 622,165 628,172"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                />
                <path
                  d="M 648,152 Q 658,165 652,172"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                />
                <path
                  d="M 635,152 Q 615,160 622,148"
                  fill="none"
                  stroke="#8B5A2B"
                  strokeWidth="3"
                />
                <path
                  d="M 635,152 Q 615,160 622,148"
                  fill="none"
                  stroke="#111"
                  strokeWidth="1.2"
                />
              </g>
            ) : (
              <g
                className="monkey-idle-bouncing"
                style={{ transformBox: "fill-box" }}
              >
                <circle
                  cx="528"
                  cy="178"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="572"
                  cy="178"
                  r="8"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <circle
                  cx="550"
                  cy="180"
                  r="18"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <ellipse
                  cx="550"
                  cy="185"
                  rx="13"
                  ry="10"
                  fill="#FDF5E6"
                  stroke="#111"
                  strokeWidth="2"
                />
                <path
                  d="M 540,184 Q 550,196 560,184"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="544"
                  cy="175"
                  r="4.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle
                  cx="556"
                  cy="175"
                  r="4.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle cx="544" cy="175" r="1.5" fill="#111" />
                <circle cx="556" cy="175" r="1.5" fill="#111" />
                <ellipse
                  cx="550"
                  cy="220"
                  rx="11"
                  ry="16"
                  fill="#8B5A2B"
                  stroke="#111"
                  strokeWidth="3"
                />
                <ellipse cx="550" cy="222" rx="7" ry="10" fill="#FDF5E6" />
                <path
                  d="M 540,212 Q 525,215 530,225"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 560,212 Q 580,200 585,185"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 543,235 L 538,265"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 557,235 L 562,265"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 545,235 Q 520,250 500,240 T 495,220"
                  fill="none"
                  stroke="#8B5A2B"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 545,235 Q 520,250 500,240 T 495,220"
                  fill="none"
                  stroke="#111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* --- PANIC MONSTER --- */}
            {driver === "panic" ? (
              <g className="panic-shaking" style={{ transformBox: "fill-box" }}>
                <path
                  d="M 120,220 L 160,220 L 160,270 M 120,220 L 120,270 M 125,170 L 125,220"
                  stroke="#888"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 130,285 L 155,275 L 175,287 L 150,295 Z"
                  fill="#fff"
                  stroke="#444"
                  strokeWidth="1.5"
                />
                <line
                  x1="140"
                  y1="282"
                  x2="160"
                  y2="282"
                  stroke="#bbb"
                  strokeWidth="1"
                />

                <path
                  d="M 220,110 L 227,122 L 238,116 L 240,128 L 251,126 L 248,138 L 259,141 L 252,150 L 261,159 L 251,164 L 256,175 L 244,177 L 246,189 L 235,187 L 233,199 L 220,192 L 207,199 L 205,187 L 194,189 L 196,177 L 184,175 L 189,164 L 179,159 L 188,150 L 181,141 L 192,138 L 189,126 L 200,128 L 202,116 L 213,122 Z"
                  fill="#ff4d4d"
                  stroke="#111"
                  strokeWidth="3.5"
                  filter="drop-shadow(0 0 8px rgba(255, 77, 77, 0.8))"
                />

                <circle
                  cx="210"
                  cy="145"
                  r="7.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="2"
                />
                <circle
                  cx="230"
                  cy="145"
                  r="7.5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="2"
                />
                <circle cx="210" cy="145" r="2.5" fill="#111" />
                <circle cx="230" cy="145" r="2.5" fill="#111" />
                <circle cx="178" cy="120" r="2" fill="#29b6f6" />
                <circle cx="262" cy="120" r="2" fill="#29b6f6" />
                <path
                  d="M 211,163 Q 220,154 229,163 Q 220,165 211,163 Z"
                  fill="#111"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <path
                  d="M 194,150 Q 165,125 178,110"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 246,150 Q 275,125 262,110"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 208,193 Q 198,225 204,265"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 232,193 Q 242,225 236,265"
                  fill="none"
                  stroke="#111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g>
                <path
                  d="M 120,220 L 160,220 L 160,270 M 120,220 L 120,270 M 125,170 L 125,220"
                  stroke="#888"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                <path
                  d="M 145,130 L 150,138 L 158,134 L 159,142 L 167,140 L 165,148 L 173,150 L 167,157 L 173,163 L 165,167 L 169,175 L 160,176 L 161,184 L 153,182 L 151,190 L 145,185 L 139,190 L 137,182 L 129,184 L 130,176 L 121,175 L 125,167 L 117,163 L 123,157 L 117,150 L 125,148 L 123,140 L 131,142 L 132,134 L 140,138 Z"
                  fill="#ff8080"
                  stroke="#111"
                  strokeWidth="3"
                />

                <circle
                  cx="137"
                  cy="155"
                  r="5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle
                  cx="151"
                  cy="155"
                  r="5"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <circle cx="137" cy="155" r="1.5" fill="#111" />
                <circle cx="151" cy="155" r="1.5" fill="#111" />
                <line
                  x1="131"
                  y1="152"
                  x2="143"
                  y2="152"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <line
                  x1="145"
                  y1="152"
                  x2="157"
                  y2="152"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <line
                  x1="140"
                  y1="166"
                  x2="148"
                  y2="166"
                  stroke="#111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 128,168 L 138,178 M 162,168 L 152,178"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="135"
                  y1="188"
                  x2="135"
                  y2="230"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="153"
                  y1="188"
                  x2="153"
                  y2="230"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M 132,172 L 158,172 L 158,192 L 132,192 Z"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="1.5"
                />
                <line
                  x1="136"
                  y1="177"
                  x2="154"
                  y2="177"
                  stroke="#666"
                  strokeWidth="1.5"
                />
                <line
                  x1="136"
                  y1="182"
                  x2="154"
                  y2="182"
                  stroke="#666"
                  strokeWidth="1.5"
                />
                <line
                  x1="136"
                  y1="187"
                  x2="148"
                  y2="187"
                  stroke="#666"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Control grid (3 columns: Deck, Tasks, Daily Scorecard) */}
      <div className="dashboard-control-grid">
        {/* Panel 1: Dashboard Control Deck */}
        <div className="comic-panel">
          <h3 className="panel-heading">
            <span style={{ fontSize: "1.5rem" }}>🕹️</span> Brain Cockpit Deck
          </h3>

          <div className="driver-badge-wrapper">
            <div className={`driver-avatar-mini ${driver}`}>
              {driver === "rational" && (
                <span style={{ fontSize: "1.4rem" }}>🧑‍✈️</span>
              )}
              {driver === "monkey" && (
                <span style={{ fontSize: "1.4rem" }}>🐒</span>
              )}
              {driver === "panic" && (
                <span style={{ fontSize: "1.4rem" }}>👹</span>
              )}
            </div>
            <div className="driver-meta">
              <h4>
                {driver === "rational" && "Rational Decision-Maker"}
                {driver === "monkey" && "Instant Gratification Monkey"}
                {driver === "panic" && "Panic Monster"}
              </h4>
              <p>is currently steering the wheel</p>
            </div>
          </div>

          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            Log activity in the last 30 min:
          </p>
          <div className="quick-log-grid">
            <button
              className="quick-log-btn deep"
              onClick={() => handleQuickLog("Deep Work")}
            >
              🚀 Deep Work
            </button>
            <button
              className="quick-log-btn shallow"
              onClick={() => handleQuickLog("Shallow Work")}
            >
              📋 Shallow Work
            </button>
            <button
              className="quick-log-btn distracted"
              onClick={() => handleQuickLog("Distracted")}
            >
              🍌 Distracted
            </button>
            <button
              className="quick-log-btn break"
              onClick={() => handleQuickLog("Break")}
            >
              ☕ Take Break
            </button>
          </div>

          <div className="focus-timer-container">
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              ⏱️ Rational Focus Lock
            </div>
            <div className="digital-clock">{formatTime(timeLeft)}</div>
            <div className="focus-timer-config">
              <span>Duration (min)</span>
              <input
                type="number"
                className="focus-duration-input"
                min="5"
                max="300"
                value={focusDurationInput}
                onChange={(e) => setFocusDurationInput(Number(e.target.value))}
                onBlur={() =>
                  void updateFocusDurationMinutes(focusDurationInput)
                }
                disabled={isTimerRunning}
              />
            </div>
            <div className="timer-btn-row">
              <button
                className={`timer-btn ${isTimerRunning ? "active" : ""}`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                {isTimerRunning ? "Pause" : "Focus Lock"}
              </button>
              <button className="timer-btn" onClick={resetTimer}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Task Terminal */}
        <div className="comic-panel">
          <h3 className="panel-heading">
            <span style={{ fontSize: "1.5rem" }}>📝</span> Brain Task Terminal
          </h3>

          <form className="task-form" onSubmit={handleAddTask}>
            <input
              type="text"
              className="task-input-text"
              placeholder="Task name (e.g. Write Capstone report)..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <div
              className="task-input-row-mini"
              style={{ gridTemplateColumns: "1fr 80px" }}
            >
              <input
                type="number"
                className="task-input-num"
                placeholder="Mins"
                min="5"
                max="300"
                value={taskFocusTime}
                onChange={(e) => setTaskFocusTime(Number(e.target.value))}
                required
              />
              <button type="submit" className="add-task-btn">
                <Plus size={16} /> Add
              </button>
            </div>
          </form>

          <div className="task-list-scroller">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                return (
                  <div
                    key={task.id}
                    className={`task-item-card ${task.completed ? "completed" : ""}`}
                    style={{
                      borderColor: "var(--wbw-dark)",
                      boxShadow: "2px 2px 0 var(--wbw-dark)",
                    }}
                  >
                    <div className="task-card-header">
                      <span
                        className={`task-card-name ${task.completed ? "line-through" : ""}`}
                      >
                        {task.name}
                      </span>
                      <div className="task-action-btns">
                        <button
                          className="task-icon-btn comp"
                          onClick={() => toggleTask(task.id)}
                          title={
                            task.completed ? "Mark Incomplete" : "Mark Complete"
                          }
                        >
                          <CheckCircle2
                            size={16}
                            style={{
                              color: task.completed ? "#2e7d32" : "#888",
                            }}
                          />
                        </button>
                        <button
                          className="task-icon-btn"
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="task-card-meta">
                      <label className="task-time-edit">
                        <span>Est</span>
                        <input
                          type="number"
                          className="task-time-input"
                          min="5"
                          max="300"
                          value={task.focusTime}
                          onChange={(e) =>
                            updateTaskFocusTimeDraft(
                              task.id,
                              Number(e.target.value),
                            )
                          }
                          onBlur={(e) =>
                            void updateTaskFocusTime(
                              task.id,
                              Number(e.currentTarget.value),
                            )
                          }
                        />
                        <span>m</span>
                      </label>
                      {task.completed && (
                        <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                          Done!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  alignSelf: "center",
                  color: "#888",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  marginTop: "30px",
                }}
              >
                No active tasks in brain. Add one above!
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Daily Score Card */}
        <div className="comic-panel">
          <h3 className="panel-heading">
            <span style={{ fontSize: "1.5rem" }}>📊</span> Daily Score Card
          </h3>

          <div className="scorecard-chart-container">
            {/* Rational Row */}
            <div className="score-bar-row">
              <div className="score-bar-label">
                <span>🧑‍✈️ Rational Control</span>
                <span>{scoreStats.rational}%</span>
              </div>
              <div className="hand-drawn-bar-track">
                <div
                  className="hand-drawn-bar-fill rdm-fill"
                  style={{ width: `${scoreStats.rational}%` }}
                />
              </div>
            </div>

            {/* Monkey Row */}
            <div className="score-bar-row">
              <div className="score-bar-label">
                <span>🐒 Monkey Procrastination</span>
                <span>{scoreStats.monkey}%</span>
              </div>
              <div className="hand-drawn-bar-track">
                <div
                  className="hand-drawn-bar-fill monkey-fill"
                  style={{ width: `${scoreStats.monkey}%` }}
                />
              </div>
            </div>

            {/* Panic Row */}
            <div className="score-bar-row">
              <div className="score-bar-label">
                <span>👹 Panic Shaking</span>
                <span>{scoreStats.panic}%</span>
              </div>
              <div className="hand-drawn-bar-track">
                <div
                  className="hand-drawn-bar-fill panic-fill"
                  style={{ width: `${scoreStats.panic}%` }}
                />
              </div>
            </div>
          </div>

          <div className="scorecard-caption">
            {scoreStats.isDefault
              ? "No logs recorded yet. Defaulting to standard high school procrastination settings."
              : scoreStats.monkey > scoreStats.rational
                ? "🐒 THE MONKEY WON TODAY. 'One more YouTube video' was a lie."
                : scoreStats.panic > scoreStats.rational
                  ? "👹 PANIC DRIVEN. You survived, but at what cost of cortisol?"
                  : "🧑‍✈️ EXCELLENT. The Rational Decision-Maker steered successfully!"}
          </div>
        </div>
      </div>

      {/* Panic Monster Deadlines strip */}
      {panicDeadlines.filter((d) => !d.completed).length > 0 && (
        <div
          style={{
            marginTop: "20px",
            background: "#fff",
            border: "3px solid var(--wbw-dark)",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "4px 4px 0 var(--wbw-dark)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: "1.2rem",
              margin: "0 0 12px 0",
              borderBottom: "2px solid var(--wbw-dark)",
              paddingBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            👹 Panic Monster Targets
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {panicDeadlines
              .filter((d) => !d.completed)
              .map((d) => {
                const deadlineMs = new Date(`${d.date}T${d.time}`).getTime();
                const nowMs2 = Date.now();
                const diffMs = deadlineMs - nowMs2;
                const isOverdue = diffMs < 0;
                const isUrgent = diffMs > 0 && diffMs <= 2 * 60 * 60 * 1000;
                return (
                  <div
                    key={d.id}
                    style={{
                      border: `2px solid ${isOverdue ? "#ff4d4d" : isUrgent ? "#ff9800" : "var(--wbw-dark)"}`,
                      borderRadius: "8px",
                      padding: "10px 12px",
                      background: isOverdue
                        ? "#fff5f5"
                        : isUrgent
                          ? "#fff8e1"
                          : "#fafafa",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>
                      {isOverdue ? "🚨" : isUrgent ? "⚠️" : "⏰"} {d.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: isOverdue ? "#ff4d4d" : "#666",
                        fontWeight: 700,
                      }}
                    >
                      {isOverdue
                        ? `OVERDUE — was due ${d.date} ${d.time}`
                        : `Due: ${d.date} at ${d.time}`}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
