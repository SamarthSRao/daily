import { useState, useEffect, useCallback } from "react";
import data from "../data/dailyPlan.json";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, CalendarDays, ClipboardList } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

export default function DailyPage() {
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0-0": true });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-daily-tasks", {});
      setCompletedTasks(data);
    };
    fetchData();
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveState("properrr-daily-tasks", next);
      return next;
    });
  }, []);

  const toggleMonth = (idx: number) => {
    setExpandedMonths(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleWeek = (monthIdx: number, weekIdx: number) => {
    const key = `${monthIdx}-${weekIdx}`;
    setExpandedWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <ClipboardList className="icon-main" style={{ color: '#10b981' }} />
          Daily Routine
        </h1>
        <p className="tasks-subtitle">Systematic execution of the Backend Mastery Plan</p>
      </div>

      <div className="curriculum-list">
        {data.map((month, mIdx) => (
          <div key={mIdx} className="month-card">
            <div
              className="month-header"
              onClick={() => toggleMonth(mIdx)}
            >
              <div className="month-title">
                <CalendarDays className="icon-month" style={{ color: '#10b981' }} />
                <h2 style={{ color: '#10b981' }}>{month.title}</h2>
              </div>
              {expandedMonths[mIdx] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedMonths[mIdx] && (
              <div className="month-content">
                {month.weeks.map((week, wIdx) => {
                  const weekKey = `${mIdx}-${wIdx}`;
                  return (
                    <div key={weekKey} className="week-card">
                      <div
                        className="week-header"
                        onClick={() => toggleWeek(mIdx, wIdx)}
                      >
                        <h3>Week {wIdx + 1}: {week.title}</h3>
                        {expandedWeeks[weekKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>

                      {expandedWeeks[weekKey] && (
                        <div className="week-content">
                          {week.days.map((day, dIdx) => (
                            <div key={dIdx} className="day-card">
                              <h4 className="day-title">{day.title}</h4>
                              <ul className="task-list">
                                {day.tasks.map((task, tIdx) => {
                                  const taskId = `daily-${mIdx}-${wIdx}-${dIdx}-${tIdx}`;
                                  const isDone = completedTasks[taskId];

                                  return (
                                    <li
                                      key={taskId}
                                      className={`task-item ${isDone ? "completed" : ""}`}
                                      onClick={() => toggleTask(taskId)}
                                    >
                                      {isDone ? (
                                        <CheckCircle2 className="icon-check" />
                                      ) : (
                                        <Circle className="icon-uncheck" />
                                      )}
                                      <div className="task-text" style={{ whiteSpace: 'pre-wrap' }}>{task}</div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
