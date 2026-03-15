import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Layers } from "lucide-react";

interface Day {
  title: string;
  tasks: string[];
}
interface Week {
  title: string;
  days: Day[];
}
interface Month {
  title: string;
  weeks: Week[];
}
interface AlternatePlan {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  color: string;
  months: Month[];
}

interface Props {
  plan: AlternatePlan;
}

export default function AlternatePlanPage({ plan }: Props) {
  const storageKey = `properrr-alt-${plan.id}`;
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0-0": true });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setCompletedTasks(JSON.parse(saved)); } catch {}
    }
  }, [storageKey]);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const toggleMonth = (idx: number) =>
    setExpandedMonths(prev => ({ ...prev, [idx]: !prev[idx] }));

  const toggleWeek = (mIdx: number, wIdx: number) => {
    const key = `${mIdx}-${wIdx}`;
    setExpandedWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Count completion stats
  let totalTasks = 0;
  let doneTasks = 0;
  plan.months.forEach((m, mIdx) =>
    m.weeks.forEach((w, wIdx) =>
      w.days.forEach((d, dIdx) =>
        d.tasks.forEach((_, tIdx) => {
          totalTasks++;
          if (completedTasks[`${mIdx}-${wIdx}-${dIdx}-${tIdx}`]) doneTasks++;
        })
      )
    )
  );
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title" style={{ color: plan.color }}>
          <Layers className="icon-main" style={{ color: plan.color }} />
          {plan.emoji} {plan.name} Plan
        </h1>
        <p className="tasks-subtitle">{plan.subtitle}</p>
        <div className="alt-progress-bar-wrap">
          <div
            className="alt-progress-bar-fill"
            style={{ width: `${pct}%`, background: plan.color }}
          />
        </div>
        <span className="alt-progress-label" style={{ color: plan.color }}>
          {doneTasks}/{totalTasks} tasks · {pct}%
        </span>
      </div>

      <div className="curriculum-list">
        {plan.months.map((month, mIdx) => (
          <div key={mIdx} className="month-card" style={{ borderColor: expandedMonths[mIdx] ? plan.color + "55" : "" }}>
            <div className="month-header" onClick={() => toggleMonth(mIdx)}>
              <div className="month-title">
                <Layers className="icon-month" style={{ color: plan.color }} />
                <h2 style={{ color: plan.color }}>MONTH {mIdx + 1}: {month.title}</h2>
              </div>
              {expandedMonths[mIdx] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedMonths[mIdx] && (
              <div className="month-content">
                {month.weeks.map((week, wIdx) => {
                  const wKey = `${mIdx}-${wIdx}`;
                  return (
                    <div key={wKey} className="week-card">
                      <div className="week-header" onClick={() => toggleWeek(mIdx, wIdx)}>
                        <h3>{week.title}</h3>
                        {expandedWeeks[wKey] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                      {expandedWeeks[wKey] && (
                        <div className="week-content">
                          {week.days.map((day, dIdx) => (
                            <div key={dIdx} className="day-card">
                              <h4 className="day-title">{day.title}</h4>
                              <ul className="task-list">
                                {day.tasks.map((task, tIdx) => {
                                  const taskId = `${mIdx}-${wIdx}-${dIdx}-${tIdx}`;
                                  const isDone = completedTasks[taskId];
                                  return (
                                    <li
                                      key={taskId}
                                      className={`task-item ${isDone ? "completed" : ""}`}
                                      onClick={() => toggleTask(taskId)}
                                    >
                                      {isDone
                                        ? <CheckCircle2 className="icon-check" />
                                        : <Circle className="icon-uncheck" />}
                                      <div className="task-text">{task}</div>
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
