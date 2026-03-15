import { useState, useEffect, useCallback } from "react";
import data from "./tasks.json";
import { CheckCircle2, Circle, ChevronDown, ChevronRight, CalendarDays, BookOpenCheck } from "lucide-react";

export default function TasksPage() {
  const [expandedMonths, setExpandedMonths] = useState<Record<number, boolean>>({ 0: true });
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({ "0-0": true });
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("properrr-tasks");
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem("properrr-tasks", JSON.stringify(next));
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
          <BookOpenCheck className="icon-main" />
          Mastery Curriculum
        </h1>
        <p className="tasks-subtitle">10-11 Month Full-Stack + Backend + Distributed Systems Plan</p>
      </div>

      <div className="curriculum-list">
        {data.map((month, mIdx) => (
          <div key={mIdx} className="month-card">
            <div 
              className="month-header" 
              onClick={() => toggleMonth(mIdx)}
            >
              <div className="month-title">
                <CalendarDays className="icon-month" />
                <h2>MONTH {mIdx + 1}: {month.title}</h2>
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
                                  const taskId = `${mIdx}-${wIdx}-${dIdx}-${tIdx}`;
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
