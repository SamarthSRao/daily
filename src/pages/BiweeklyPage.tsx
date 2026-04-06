import { useState, useEffect, useCallback } from "react";
import projects from "../data/biweekly.json";
import { Play, Pause, RotateCcw, Notebook, Timer, ChevronDown, ChevronRight } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

type ProjectState = {
  totalTime: number; // in seconds
  isRunning: boolean;
  lastStartTime: number | null; // timestamp
  notes: string;
};

type BiweeklyState = Record<string, ProjectState>;

const INITIAL_PROJECT_STATE: ProjectState = {
  totalTime: 0,
  isRunning: false,
  lastStartTime: null,
  notes: "",
};

export default function BiweeklyPage() {
  const [projectStates, setProjectStates] = useState<BiweeklyState>({});
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<number>(new Date(2026, 0, 1).getTime()); // Default to Jan 1

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-biweekly-meta", { startDate: new Date(2026, 0, 1).getTime() });
      if (data.startDate) setStartDate(data.startDate);

      const states = await loadState("properrr-biweekly", {});
      const merged: BiweeklyState = {};
      projects.forEach(p => {
        merged[p.id] = states[p.id] || { ...INITIAL_PROJECT_STATE };
      });
      setProjectStates(merged);
    };
    fetchData();
  }, []);

  const resetPlanStartDate = () => {
    if (!confirm("Start the entire biweekly plan from today? This will shift all project deadlines.")) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newStart = today.getTime();
    setStartDate(newStart);
    saveState("properrr-biweekly-meta", { startDate: newStart });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger re-render every second for active timers
      setProjectStates(prev => ({ ...prev }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setProjectStates(prev => {
      const now = Date.now();
      const newState = { ...prev };

      // If we are starting a timer, stop ALL others first
      const isStarting = !prev[id]?.isRunning;

      if (isStarting) {
        Object.keys(newState).forEach(projId => {
          if (newState[projId].isRunning) {
            const sessionTime = Math.floor((now - (newState[projId].lastStartTime || now)) / 1000);
            newState[projId] = {
              ...newState[projId],
              isRunning: false,
              totalTime: newState[projId].totalTime + sessionTime,
              lastStartTime: null,
            };
          }
        });

        // Start the new one
        newState[id] = {
          ...newState[id],
          isRunning: true,
          lastStartTime: now,
        };
      } else {
        // Stop the current one
        const current = newState[id];
        const sessionTime = Math.floor((now - (current.lastStartTime || now)) / 1000);
        newState[id] = {
          ...current,
          isRunning: false,
          totalTime: current.totalTime + sessionTime,
          lastStartTime: null,
        };
      }

      saveState("properrr-biweekly", newState);
      return newState;
    });
  }, []);

  const resetTimer = useCallback((id: string) => {
    if (!confirm("Reset timer for this project?")) return;
    setProjectStates(prev => {
      const newState = {
        ...prev,
        [id]: { ...(prev[id] || INITIAL_PROJECT_STATE), totalTime: 0, isRunning: false, lastStartTime: null }
      };
      saveState("properrr-biweekly", newState);
      return newState;
    });
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setProjectStates(prev => {
      const newState = {
        ...prev,
        [id]: { ...(prev[id] || INITIAL_PROJECT_STATE), notes }
      };
      saveState("properrr-biweekly", newState);
      return newState;
    });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Logic to calculate remaining days in the biweekly cycle
  const getCycleStats = (projectIdx: number) => {
    const now = new Date();
    const startOfPlan = new Date(startDate);
    const msDiff = now.getTime() - startOfPlan.getTime();
    const daysSinceStart = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    // Each project is 2 weeks = 14 days
    const projectCycleStartDay = projectIdx * 14;
    const projectCycleEndDay = (projectIdx + 1) * 14;

    const isCurrentCycle = daysSinceStart >= projectCycleStartDay && daysSinceStart < projectCycleEndDay;
    const isPastCycle = daysSinceStart >= projectCycleEndDay;
    const daysRemaining = projectCycleEndDay - daysSinceStart;

    return { isCurrentCycle, isPastCycle, daysRemaining };
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="tasks-title">
              <Timer className="icon-main" />
              Biweekly Internals
            </h1>
            <p className="tasks-subtitle">Implement the core of Distributed Systems & DBMS</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="reset-plan-btn" onClick={resetPlanStartDate}>
              Start Plan from Today
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Bar */}
      {(() => {
        const runningProjectId = Object.keys(projectStates).find(id => projectStates[id].isRunning);
        const runningProject = projects.find(p => p.id === runningProjectId);
        const runningState = runningProjectId ? projectStates[runningProjectId] : null;

        let displayTime = runningState?.totalTime || 0;
        if (runningState?.isRunning && runningState?.lastStartTime) {
          displayTime += Math.floor((Date.now() - runningState.lastStartTime) / 1000);
        }

        const activeIdx = projects.findIndex((_, i) => getCycleStats(i).isCurrentCycle);
        const activeProject = projects[activeIdx];
        const { daysRemaining } = activeProject ? getCycleStats(activeIdx) : { daysRemaining: 0 };

        return (
          <div className="status-floating-banner">
            {runningProject ? (
              <div className="status-item running">
                <div className="status-label">
                  <div className="pulse-dot" />
                  RUNNING: {runningProject.title}
                </div>
                <div className="status-value">{formatTime(displayTime)}</div>
              </div>
            ) : (
              <div className="status-item idle">
                <div className="status-label">TIMER IDLE</div>
                <div className="status-value">0h 0m 0s</div>
              </div>
            )}

            <div className="status-divider" />

            {activeProject && (
              <div className="status-item pending">
                <div className="status-label">ACTIVE CYCLE: {activeProject.title}</div>
                <div className="status-value">{daysRemaining} days left</div>
              </div>
            )}
          </div>
        );
      })()}

      <div className="curriculum-list">
        {projects.map((project, idx) => {
          const state = projectStates[project.id] || INITIAL_PROJECT_STATE;
          const isExpanded = expandedProjects[project.id];
          const { isCurrentCycle, isPastCycle, daysRemaining } = getCycleStats(idx);

          let displayTime = state.totalTime;
          if (state.isRunning && state.lastStartTime) {
            displayTime += Math.floor((Date.now() - state.lastStartTime) / 1000);
          }

          return (
            <div key={project.id} className={`month-card ${isCurrentCycle ? 'current-project' : ''}`}>
              <div
                className="month-header"
                onClick={() => toggleExpand(project.id)}
                style={{
                  borderLeft: state.isRunning ? '4px solid #10b981' : isCurrentCycle ? '4px solid #3b82f6' : '4px solid transparent'
                }}
              >
                <div className="month-title">
                  <div className={`timer-status-dot ${state.isRunning ? 'active' : ''}`} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{project.title}</h2>
                      {isCurrentCycle && <span className="current-badge">ACTIVE CYCLE</span>}
                      {isPastCycle && <span className="past-badge">PAST</span>}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {isCurrentCycle && (
                    <div className="days-remaining-badge">
                      <span className="dr-val">{daysRemaining}</span>
                      <span className="dr-lab">d left</span>
                    </div>
                  )}
                  <span className="biweekly-timer-display">{formatTime(displayTime)}</span>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="month-content" style={{ paddingTop: '10px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
                    {project.description}
                  </p>

                  <div className="biweekly-controls">
                    <button
                      className={`timer-control-btn ${state.isRunning ? 'stop' : 'start'}`}
                      onClick={(e) => { e.stopPropagation(); toggleTimer(project.id); }}
                    >
                      {state.isRunning ? <Pause size={18} /> : <Play size={18} />}
                      {state.isRunning ? 'Stop Timer' : 'Start Timer'}
                    </button>

                    <button
                      className="timer-control-btn reset"
                      onClick={(e) => { e.stopPropagation(); resetTimer(project.id); }}
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                  </div>

                  <div className="notes-section">
                    <div className="notes-header">
                      <Notebook size={16} />
                      <span>Project Notes</span>
                      <div className="auto-save-tag">Auto-saving</div>
                    </div>
                    <textarea
                      className="notes-textarea"
                      placeholder="Add implementation notes, architecture decisions, or blockers..."
                      value={state.notes}
                      onChange={(e) => updateNotes(project.id, e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .timer-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--text-muted);
          margin-right: 12px;
        }
        .timer-status-dot.active {
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .biweekly-timer-display {
          font-family: 'Geist Mono', monospace;
          font-weight: 700;
          color: var(--color-commission);
          background: rgba(59, 130, 246, 0.1);
          padding: 4px 12px;
          border-radius: 6px;
          min-width: 100px;
          text-align: center;
        }
        .reset-plan-btn {
          background-color: var(--bg-hover);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-plan-btn:hover {
          background-color: var(--bg-card);
          color: var(--text-primary);
          border-color: #3f3f46;
        }
        .current-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
          letter-spacing: 0.5px;
        }
        .past-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(161, 161, 170, 0.1);
          color: var(--text-muted);
          border: 1px solid rgba(161, 161, 170, 0.2);
        }
        .days-remaining-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 4px 8px;
          border-radius: 6px;
          color: #f59e0b;
        }
        .dr-val {
          font-size: 0.9rem;
          font-weight: 800;
        }
        .dr-lab {
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.8;
        }
        .current-project {
          border-color: rgba(59, 130, 246, 0.3) !important;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.05), transparent) !important;
        }
        .biweekly-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
        .timer-control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border-color);
        }
        .timer-control-btn.start {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);
        }
        .timer-control-btn.start:hover {
          background-color: rgba(16, 185, 129, 0.2);
        }
        .timer-control-btn.stop {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }
        .timer-control-btn.stop:hover {
          background-color: rgba(239, 68, 68, 0.2);
        }
        .timer-control-btn.reset {
          background-color: var(--bg-hover);
          color: var(--text-secondary);
        }
        .notes-section {
          background-color: rgba(0,0,0,0.2);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .notes-textarea {
          width: 100%;
          min-height: 120px;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
          resize: vertical;
          outline: none;
          line-height: 1.6;
        }
        .auto-save-tag {
          margin-left: auto;
          font-size: 0.7rem;
          opacity: 0.5;
          font-weight: 400;
        }

        .status-floating-banner {
          position: fixed;
          top: 80px;
          right: 24px;
          background: rgba(15, 15, 15, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 1000;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          font-family: 'Geist Sans', sans-serif;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .status-label {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: 'Geist Mono', monospace;
        }

        .status-item.running .status-label {
          color: #10b981;
        }

        .status-item.running .status-value {
          color: #10b981;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 6px #10b981;
          animation: status-pulse 2s infinite;
        }

        @keyframes status-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .status-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .status-floating-banner {
            position: relative;
            top: auto;
            right: auto;
            margin-bottom: 24px;
            width: 100%;
            justify-content: space-around;
          }
        }
      `}} />
    </div>
  );
}
