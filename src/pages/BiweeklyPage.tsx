import { useState, useEffect, useCallback } from "react";
import projects from "../data/biweekly.json";
import { Play, Pause, RotateCcw, Notebook, Timer, ChevronDown, ChevronRight } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

type ProjectState = {
  totalTime: number; 
  isRunning: boolean;
  lastStartTime: number | null; 
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
  const [startDate, setStartDate] = useState<number>(new Date(2026, 0, 1).getTime());

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
      setProjectStates(prev => ({ ...prev }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = useCallback((id: string) => {
    setProjectStates(prev => {
      const now = Date.now();
      const newState = { ...prev };
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
        newState[id] = { ...newState[id], isRunning: true, lastStartTime: now };
      } else {
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
      const newState = { ...prev, [id]: { ...(prev[id] || INITIAL_PROJECT_STATE), notes } };
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

  const getCycleStats = (projectIdx: number) => {
    const now = new Date();
    const startOfPlan = new Date(startDate);
    const msDiff = now.getTime() - startOfPlan.getTime();
    const daysSinceStart = Math.floor(msDiff / (1000 * 60 * 60 * 24));
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
              <Timer className="icon-main" style={{ color: '#3b82f6' }} />
              Biweekly Internals
            </h1>
            <p className="tasks-subtitle">Systematic Implementation of Core Infrastructure Architecture</p>
          </div>
          <button className="reset-plan-btn" onClick={resetPlanStartDate}>
             Calibrate Start Cycle
          </button>
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
                <div className="status-label-mini">
                   <div className="pulse-dot" />
                   ACTIVE: {runningProject.title}
                </div>
                <div className="status-value-mini">{formatTime(displayTime)}</div>
              </div>
            ) : (
              <div className="status-item idle">
                <div className="status-label-mini">IDLE</div>
                <div className="status-value-mini">0h 0m 0s</div>
              </div>
            )}

            <div className="status-divider" />

            {activeProject && (
              <div className="status-item pending">
                <div className="status-label-mini">CYCLE ENDING</div>
                <div className="status-value-mini">{daysRemaining} DAYS</div>
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
                      <h2 style={{ fontSize: '1.1rem' }}>{project.title}</h2>
                      {isCurrentCycle && <span className="current-badge">CORE CYCLE</span>}
                      {isPastCycle && <span className="past-badge">ARCHIVED</span>}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {isCurrentCycle && (
                    <div className="days-remaining-badge">
                      <span className="dr-val">{daysRemaining}</span>
                      <span className="dr-lab">d rem</span>
                    </div>
                  )}
                  <span className="biweekly-timer-display">{formatTime(displayTime)}</span>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
              </div>

              {isExpanded && (
                <div className="month-content" style={{ paddingTop: '10px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    {project.description}
                  </p>

                  <div className="biweekly-controls">
                    <button
                      className={`timer-control-btn ${state.isRunning ? 'stop' : 'start'}`}
                      onClick={(e) => { e.stopPropagation(); toggleTimer(project.id); }}
                    >
                      {state.isRunning ? <Pause size={18} /> : <Play size={18} />}
                      {state.isRunning ? 'STOP CYCLE' : 'INITIALIZE'}
                    </button>

                    <button
                      className="timer-control-btn reset"
                      onClick={(e) => { e.stopPropagation(); resetTimer(project.id); }}
                    >
                      <RotateCcw size={18} />
                      PURGE
                    </button>
                  </div>

                  <div className="notes-section">
                    <div className="notes-header">
                      <Notebook size={16} />
                      <span>Architecture Notes</span>
                      <div className="auto-save-tag">Syncing with Upstash...</div>
                    </div>
                    <textarea
                      className="notes-textarea"
                      placeholder="Input architectural constraints and implementation logic..."
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
    </div>
  );
}
