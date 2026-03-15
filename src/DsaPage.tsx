import { useState, useEffect, useCallback } from "react";
import dsaData from "./dsa.json";
import { ChevronDown, ChevronRight, Binary, Code2, CheckCircle2, Circle } from "lucide-react";

export default function DsaPage() {
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({ 0: true });
  const [completedDsa, setCompletedDsa] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("properrr-dsa");
    if (saved) {
      try {
        setCompletedDsa(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved DSA tasks", e);
      }
    }
  }, []);

  const toggleDsaTask = useCallback((taskId: string) => {
    setCompletedDsa(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem("properrr-dsa", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleLevel = (idx: number) => {
    setExpandedLevels(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <Binary className="icon-main" />
          DSA Mastery
        </h1>
        <p className="tasks-subtitle">Architectural Paradigms in Algorithmic Problem Solving (Untitled 9)</p>
      </div>

      <div className="curriculum-list">
        {dsaData.map((level, lIdx) => (
          <div key={lIdx} className="month-card dsa-card">
            <div 
              className="month-header" 
              onClick={() => toggleLevel(lIdx)}
            >
              <div className="month-title">
                <Code2 className="icon-month" />
                <h2>{level.title}</h2>
              </div>
              {expandedLevels[lIdx] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedLevels[lIdx] && level.problems.length > 0 && (
              <div className="month-content dsa-content">
                <div className="dsa-grid-header">
                  <span>Status</span>
                  <span>ID</span>
                  <span>Problem Title</span>
                  <span>Pattern</span>
                  <span>Prerequisite</span>
                </div>
                <div className="dsa-list">
                  {level.problems.map((prob: any) => {
                    const taskId = `dsa-${prob.id}`;
                    const isDone = completedDsa[taskId];

                    return (
                      <div 
                        key={taskId} 
                        className={`dsa-row ${isDone ? "completed" : ""}`}
                        onClick={() => toggleDsaTask(taskId)}
                      >
                        <div className="dsa-check">
                          {isDone ? (
                            <CheckCircle2 className="icon-check" />
                          ) : (
                            <Circle className="icon-uncheck" />
                          )}
                        </div>
                        <span className="dsa-id">{prob.id}</span>
                        <span className="dsa-title">{prob.title}</span>
                        <span className="dsa-pattern">{prob.pattern}</span>
                        <span className="dsa-prereq">{prob.prerequisite}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {expandedLevels[lIdx] && level.problems.length === 0 && (
              <div className="month-content dsa-content">
                <p style={{ color: "var(--text-muted)" }}>No problems listed in this section.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
