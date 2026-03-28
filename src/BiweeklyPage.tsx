import { useState, useEffect, useCallback, useRef } from "react";
import projects from "./biweekly.json";
import { Play, Pause, RotateCcw, Notebook, Timer, ChevronDown, ChevronRight, Save } from "lucide-react";
import { saveState, loadState } from "./lib/redis";

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
  const [tick, setTick] = useState(0); // Dummy state to trigger re-renders for active timers

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-biweekly", {});
      // Merge with initial states to ensure all projects exist
      const merged: BiweeklyState = {};
      projects.forEach(p => {
        merged[p.id] = data[p.id] || { ...INITIAL_PROJECT_STATE };
      });
      setProjectStates(merged);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
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

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <Timer className="icon-main" />
          Biweekly Internals
        </h1>
        <p className="tasks-subtitle">Implement the core of Distributed Systems & DBMS</p>
      </div>

      <div className="curriculum-list">
        {projects.map((project) => {
          const state = projectStates[project.id] || INITIAL_PROJECT_STATE;
          const isExpanded = expandedProjects[project.id];
          
          let displayTime = state.totalTime;
          if (state.isRunning && state.lastStartTime) {
            displayTime += Math.floor((Date.now() - state.lastStartTime) / 1000);
          }

          return (
            <div key={project.id} className="month-card">
              <div 
                className="month-header" 
                onClick={() => toggleExpand(project.id)}
                style={{ borderLeft: state.isRunning ? '4px solid #10b981' : '4px solid transparent' }}
              >
                <div className="month-title">
                  <div className={`timer-status-dot ${state.isRunning ? 'active' : ''}`} />
                  <div>
                    <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{project.title}</h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

      <style dangerouslySetInnerHTML={{ __html: `
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
      `}} />
    </div>
  );
}
