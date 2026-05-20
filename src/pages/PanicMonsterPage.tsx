import { useState, useEffect } from "react";
import { Plus, CheckCircle, Trash2, ShieldAlert, CalendarClock } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

export interface PanicDeadline {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:MM"
  completed: boolean;
  completedAt?: string;
}

const STORAGE_KEY = "properrr-panic-deadlines-v2";

export default function PanicMonsterPage() {
  const [deadlines, setDeadlines] = useState<PanicDeadline[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split("T")[0]);
  const [taskTime, setTaskTime] = useState("18:00");
  const [monsterState, setMonsterState] = useState<"sleeping" | "active" | "happy">("sleeping");

  // Load deadlines on mount
  useEffect(() => {
    const fetchData = async () => {
      const saved = await loadState(STORAGE_KEY, []);
      setDeadlines(saved || []);
    };
    fetchData();
  }, []);

  // Compute monster state
  useEffect(() => {
    if (deadlines.length === 0) { setMonsterState("sleeping"); return; }
    const now = new Date();
    const incomplete = deadlines.filter(d => !d.completed);
    if (incomplete.length === 0) { setMonsterState("happy"); return; }
    const isUrgent = incomplete.some(d => {
      const deadlineMs = new Date(`${d.date}T${d.time}`).getTime();
      const diffMs = deadlineMs - now.getTime();
      return diffMs > 0 && diffMs <= 12 * 60 * 60 * 1000;
    });
    setMonsterState(isUrgent ? "active" : "happy");
  }, [deadlines]);

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !taskDate || !taskTime) return;
    const newItem: PanicDeadline = {
      id: "deadline-" + Date.now(),
      name: taskName.trim(),
      date: taskDate,
      time: taskTime,
      completed: false,
    };
    const updated = [...deadlines, newItem];
    setDeadlines(updated);
    await saveState(STORAGE_KEY, updated);
    setTaskName("");
  };

  const toggleDeadline = async (id: string) => {
    const updated = deadlines.map(d => {
      if (d.id !== id) return d;
      const completed = !d.completed;
      return { ...d, completed, completedAt: completed ? new Date().toISOString() : undefined };
    });
    setDeadlines(updated);
    await saveState(STORAGE_KEY, updated);
  };

  const deleteDeadline = async (id: string) => {
    const updated = deadlines.filter(d => d.id !== id);
    setDeadlines(updated);
    await saveState(STORAGE_KEY, updated);
  };

  const formatDeadline = (d: PanicDeadline) => {
    const dt = new Date(`${d.date}T${d.time}`);
    const now = new Date();
    const diffMs = dt.getTime() - now.getTime();
    if (d.completed) return "✅ Done";
    if (diffMs < 0) return "🔴 OVERDUE";
    const diffH = Math.floor(diffMs / 3600000);
    const diffM = Math.floor((diffMs % 3600000) / 60000);
    if (diffH < 24) return `⏰ ${diffH}h ${diffM}m left`;
    const diffD = Math.floor(diffMs / 86400000);
    return `📅 ${diffD}d left`;
  };

  const getUrgencyColor = (d: PanicDeadline) => {
    if (d.completed) return "#e8f5e9";
    const dt = new Date(`${d.date}T${d.time}`);
    const diffMs = dt.getTime() - Date.now();
    if (diffMs < 0) return "#ffebee";
    if (diffMs < 12 * 3600000) return "#fff3e0";
    return "#fff";
  };

  // Group deadlines
  const todayStr = new Date().toISOString().split("T")[0];
  const overdue = deadlines.filter(d => !d.completed && new Date(`${d.date}T${d.time}`).getTime() < Date.now());
  const today = deadlines.filter(d => d.date === todayStr && !overdue.includes(d));
  const upcoming = deadlines.filter(d => d.date > todayStr && !d.completed);
  const done = deadlines.filter(d => d.completed);

  return (
    <div className="panic-monster-page">
      <style>{`
        .panic-monster-page {
          padding: 24px;
          color: #1e1e1e;
          font-family: 'Nunito', sans-serif;
          background-color: #faf7f0;
          border: 3px solid #1e1e1e;
          border-radius: 12px;
          box-shadow: 6px 6px 0px #1e1e1e;
          margin-bottom: 24px;
        }
        .page-header { text-align: center; margin-bottom: 24px; }
        .page-title {
          font-family: 'Permanent Marker', cursive;
          font-size: 2.5rem; margin: 0; color: #ff4d4d;
          transform: rotate(-0.5deg);
        }
        .page-subtitle { color: #666; font-weight: 600; margin-top: 6px; }
        .page-layout {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;
        }
        @media (max-width: 1024px) { .page-layout { grid-template-columns: 1fr; } }
        .morning-prompt-card {
          background: #fff0f3; border: 3px dashed #ff4d4d; border-radius: 12px;
          padding: 24px; text-align: center; margin-bottom: 24px;
          box-shadow: 4px 4px 0 #1e1e1e;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .morning-prompt-title { font-family: 'Permanent Marker', cursive; font-size: 1.8rem; color: #ff4d4d; margin: 0; }
        .morning-prompt-desc { font-weight: 700; font-size: 1rem; max-width: 600px; color: #424242; }
        .monster-display-card {
          background: #fff; border: 3px solid #1e1e1e; border-radius: 12px;
          padding: 24px; box-shadow: 4px 4px 0 #1e1e1e;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; min-height: 380px;
        }
        .monster-state-badge {
          position: absolute; top: 16px; left: 16px;
          background: #1e1e1e; color: #fff; padding: 6px 12px;
          border-radius: 20px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase;
        }
        .monster-speech-bubble {
          position: absolute; top: 40px; right: 40px;
          background: #fff; border: 2.5px solid #1e1e1e; border-radius: 12px;
          padding: 10px 16px; font-size: 0.9rem; font-weight: 800; max-width: 200px;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
        }
        .monster-speech-bubble::after {
          content: ''; position: absolute; bottom: -7px; left: 30%;
          width: 10px; height: 10px; background: #fff;
          border-right: 2.5px solid #1e1e1e; border-bottom: 2.5px solid #1e1e1e;
          transform: rotate(45deg);
        }
        .monster-svg-box { width: 100%; max-width: 400px; height: auto; }
        .panic-monster-active {
          transform-origin: center;
          animation: monster-vibrate 0.1s linear infinite;
          filter: drop-shadow(0 0 12px rgba(255, 77, 77, 0.8));
        }
        @keyframes monster-vibrate {
          0% { transform: translate(1px,1px) rotate(0deg); }
          20% { transform: translate(-1px,-1px) rotate(-1deg); }
          40% { transform: translate(-2px,0px) rotate(1deg); }
          60% { transform: translate(1px,2px) rotate(0deg); }
          80% { transform: translate(-1px,1px) rotate(-1deg); }
          100% { transform: translate(2px,-1px) rotate(1deg); }
        }
        .deadlines-card {
          background: #fff; border: 3px solid #1e1e1e; border-radius: 12px;
          padding: 20px; box-shadow: 4px 4px 0 #1e1e1e;
          display: flex; flex-direction: column; gap: 12px;
        }
        .deadline-form {
          display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px;
        }
        .deadline-form-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; }
        .deadline-input-text {
          border: 2px solid #1e1e1e; padding: 8px; border-radius: 6px;
          font-family: inherit; font-weight: 700; width: 100%; box-sizing: border-box;
        }
        .deadline-input-date {
          border: 2px solid #1e1e1e; padding: 8px; border-radius: 6px;
          font-family: inherit; font-weight: 700; width: 100%; box-sizing: border-box;
          min-width: 0;
        }
        .deadline-input-time {
          border: 2px solid #1e1e1e; padding: 8px; border-radius: 6px;
          font-family: inherit; font-weight: 700; width: 100%; box-sizing: border-box;
          min-width: 0;
          cursor: text;
        }
        .deadline-add-btn {
          background: #ff85a2; border: 2px solid #1e1e1e; border-radius: 6px;
          padding: 8px 12px; cursor: pointer; font-weight: 800;
          box-shadow: 2px 2px 0 #1e1e1e;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          white-space: nowrap;
        }
        .deadline-add-btn:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 #1e1e1e; }
        .deadline-group-label {
          font-family: 'Permanent Marker', cursive; font-size: 0.95rem;
          padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 6px;
        }
        .label-overdue { background: #ffebee; color: #d32f2f; }
        .label-today { background: #fff3e0; color: #e65100; }
        .label-upcoming { background: #e8f5e9; color: #2e7d32; }
        .label-done { background: #f3e5f5; color: #7b1fa2; }
        .deadline-list { display: flex; flex-direction: column; gap: 8px; }
        .deadline-item {
          border: 2px solid #1e1e1e; border-radius: 8px; padding: 10px 12px;
          display: flex; align-items: center; justify-content: space-between;
          box-shadow: 2px 2px 0 #1e1e1e; transition: background 0.2s;
        }
        .deadline-item.overdue { border-color: #d32f2f; }
        .deadline-item.completed { opacity: 0.55; }
        .deadline-info { display: flex; flex-direction: column; gap: 3px; }
        .deadline-name { font-weight: 800; font-size: 0.95rem; }
        .deadline-name.line-through { text-decoration: line-through; }
        .deadline-time-badge { font-size: 0.72rem; color: #666; font-weight: 700; display: flex; gap: 6px; align-items: center; }
        .urgency-chip { font-weight: 800; font-size: 0.72rem; }
        .actions-cell { display: flex; gap: 8px; }
        .action-icon-btn {
          background: none; border: none; cursor: pointer; padding: 4px; color: #1e1e1e;
          display: flex; align-items: center;
        }
        .action-icon-btn.check:hover { color: #2e7d32; }
        .action-icon-btn.delete:hover { color: #d32f2f; }
        .empty-state { color: #888; text-align: center; padding: 32px 0; font-size: 0.9rem; font-weight: 700; }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">PANIC MONSTER COMMAND</h1>
        <div className="page-subtitle">Set deadlines (any date!) — the monster wakes when they're near</div>
      </div>

      {deadlines.length === 0 && (
        <div className="morning-prompt-card">
          <ShieldAlert size={48} color="#ff4d4d" />
          <h2 className="morning-prompt-title">NO DEADLINES SET!</h2>
          <p className="morning-prompt-desc">
            Sam, the cockpit is in snooze mode. Add your deadlines below — any date, not just today.
            The Panic Monster activates when a deadline is within 12 hours!
          </p>
        </div>
      )}

      <div className="page-layout">
        {/* Deadlines Panel */}
        <div className="deadlines-card">
          <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: "1.3rem", marginTop: 0, borderBottom: "2px solid #1e1e1e", paddingBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarClock size={20} /> Deadline Targets
          </h3>

          <form className="deadline-form" onSubmit={handleAddDeadline}>
            <input
              type="text"
              className="deadline-input-text"
              placeholder="What must be completed?..."
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              required
            />
            <div className="deadline-form-row">
              <input
                type="date"
                className="deadline-input-date"
                value={taskDate}
                onChange={e => setTaskDate(e.target.value)}
                required
              />
              <input
                type="time"
                className="deadline-input-time"
                value={taskTime}
                onChange={e => setTaskTime(e.target.value)}
                required
              />
              <button type="submit" className="deadline-add-btn">
                <Plus size={16} /> Add
              </button>
            </div>
          </form>

          {/* Overdue */}
          {overdue.length > 0 && (
            <div>
              <div className="deadline-group-label label-overdue">🔴 Overdue ({overdue.length})</div>
              <div className="deadline-list">
                {overdue.map(d => (
                  <div key={d.id} className="deadline-item overdue" style={{ backgroundColor: getUrgencyColor(d) }}>
                    <div className="deadline-info">
                      <span className="deadline-name">{d.name}</span>
                      <div className="deadline-time-badge">
                        📅 {d.date} at {d.time}
                        <span className="urgency-chip" style={{ color: "#d32f2f" }}>{formatDeadline(d)}</span>
                      </div>
                    </div>
                    <div className="actions-cell">
                      <button className="action-icon-btn check" onClick={() => toggleDeadline(d.id)}><CheckCircle size={18} style={{ color: "#888" }} /></button>
                      <button className="action-icon-btn delete" onClick={() => deleteDeadline(d.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today */}
          {today.length > 0 && (
            <div>
              <div className="deadline-group-label label-today">⏰ Today ({today.length})</div>
              <div className="deadline-list">
                {today.map(d => (
                  <div key={d.id} className="deadline-item" style={{ backgroundColor: getUrgencyColor(d) }}>
                    <div className="deadline-info">
                      <span className="deadline-name">{d.name}</span>
                      <div className="deadline-time-badge">
                        🕐 Due at {d.time}
                        <span className="urgency-chip" style={{ color: "#e65100" }}>{formatDeadline(d)}</span>
                      </div>
                    </div>
                    <div className="actions-cell">
                      <button className="action-icon-btn check" onClick={() => toggleDeadline(d.id)}><CheckCircle size={18} style={{ color: "#888" }} /></button>
                      <button className="action-icon-btn delete" onClick={() => deleteDeadline(d.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <div className="deadline-group-label label-upcoming">📅 Upcoming ({upcoming.length})</div>
              <div className="deadline-list">
                {upcoming.map(d => (
                  <div key={d.id} className="deadline-item" style={{ backgroundColor: getUrgencyColor(d) }}>
                    <div className="deadline-info">
                      <span className="deadline-name">{d.name}</span>
                      <div className="deadline-time-badge">
                        📅 {d.date} at {d.time}
                        <span className="urgency-chip" style={{ color: "#2e7d32" }}>{formatDeadline(d)}</span>
                      </div>
                    </div>
                    <div className="actions-cell">
                      <button className="action-icon-btn check" onClick={() => toggleDeadline(d.id)}><CheckCircle size={18} style={{ color: "#888" }} /></button>
                      <button className="action-icon-btn delete" onClick={() => deleteDeadline(d.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {done.length > 0 && (
            <div>
              <div className="deadline-group-label label-done">✅ Completed ({done.length})</div>
              <div className="deadline-list">
                {done.map(d => (
                  <div key={d.id} className="deadline-item completed" style={{ backgroundColor: "#e8f5e9" }}>
                    <div className="deadline-info">
                      <span className="deadline-name line-through">{d.name}</span>
                      <div className="deadline-time-badge">📅 {d.date} at {d.time}</div>
                    </div>
                    <div className="actions-cell">
                      <button className="action-icon-btn check" onClick={() => toggleDeadline(d.id)}><CheckCircle size={18} style={{ color: "#2e7d32" }} /></button>
                      <button className="action-icon-btn delete" onClick={() => deleteDeadline(d.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deadlines.length === 0 && <div className="empty-state">No deadlines set yet. Add one above!</div>}
        </div>

        {/* Panic Monster SVG Display */}
        <div className="monster-display-card" style={{ borderColor: monsterState === "active" ? "#ff4d4d" : "#1e1e1e" }}>
          <div className="monster-state-badge">State: {monsterState}</div>
          <div className="monster-speech-bubble">
            {monsterState === "sleeping" && "💤 (Zzz... Snore... Monkey has control...)"}
            {monsterState === "happy" && "📰 (Calmly reading news. Deadlines under control.)"}
            {monsterState === "active" && "🚨 A DEADLINE IS COMING! WAKE UP! START WORKING!"}
          </div>
          <div className="monster-svg-box">
            <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={monsterState === "active" ? "panic-monster-active" : ""}>
              {(monsterState === "sleeping" || monsterState === "happy") && (
                <path d="M 110,210 L 190,210 L 190,280 M 110,210 L 110,280 M 115,160 L 115,210" stroke="#888" strokeWidth="4" strokeLinecap="round" />
              )}
              {monsterState === "sleeping" ? (
                <g>
                  <path d="M 150,110 L 155,118 L 163,114 L 164,122 L 172,120 L 170,128 L 178,130 L 172,137 L 178,143 L 170,147 L 174,155 L 165,156 L 166,164 L 158,162 L 156,170 L 150,165 L 144,170 L 142,162 L 134,164 L 135,156 L 126,155 L 130,147 L 122,143 L 128,137 L 122,130 L 130,128 L 128,120 L 136,122 L 137,114 L 145,118 Z" fill="#ff8080" stroke="#111" strokeWidth="3.5" />
                  <path d="M 134,142 Q 138,145 142,142" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M 148,142 Q 152,145 156,142" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="145" cy="154" r="3.5" fill="#111" />
                  <text x="175" y="100" fontFamily="Permanent Marker" fontSize="18" fill="#ff8080" fontWeight="bold">Z</text>
                  <text x="188" y="85" fontFamily="Permanent Marker" fontSize="14" fill="#ff8080" fontWeight="bold">z</text>
                  <text x="198" y="75" fontFamily="Permanent Marker" fontSize="11" fill="#ff8080" fontWeight="bold">z</text>
                  <path d="M 130,162 L 160,162 L 160,185 L 130,185 Z" fill="#fff" stroke="#111" strokeWidth="2" />
                  <line x1="135" y1="168" x2="155" y2="168" stroke="#666" strokeWidth="1.5" />
                  <line x1="135" y1="174" x2="155" y2="174" stroke="#666" strokeWidth="1.5" />
                  <line x1="135" y1="180" x2="148" y2="180" stroke="#666" strokeWidth="1.5" />
                </g>
              ) : monsterState === "happy" ? (
                <g>
                  <path d="M 150,110 L 155,118 L 163,114 L 164,122 L 172,120 L 170,128 L 178,130 L 172,137 L 178,143 L 170,147 L 174,155 L 165,156 L 166,164 L 158,162 L 156,170 L 150,165 L 144,170 L 142,162 L 134,164 L 135,156 L 126,155 L 130,147 L 122,143 L 128,137 L 122,130 L 130,128 L 128,120 L 136,122 L 137,114 L 145,118 Z" fill="#ff6666" stroke="#111" strokeWidth="3.5" />
                  <circle cx="138" cy="140" r="4.5" fill="#fff" stroke="#111" strokeWidth="1.5" />
                  <circle cx="152" cy="140" r="4.5" fill="#fff" stroke="#111" strokeWidth="1.5" />
                  <circle cx="138" cy="140" r="1.5" fill="#111" />
                  <circle cx="152" cy="140" r="1.5" fill="#111" />
                  <path d="M 141,151 Q 145,155 149,151" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 125,155 Q 115,165 130,175" stroke="#111" strokeWidth="3" fill="none" />
                  <path d="M 165,155 Q 175,165 160,175" stroke="#111" strokeWidth="3" fill="none" />
                  <path d="M 128,160 L 162,160 L 162,185 L 128,185 Z" fill="#fff" stroke="#111" strokeWidth="2" />
                  <line x1="133" y1="166" x2="157" y2="166" stroke="#666" strokeWidth="1.5" />
                  <line x1="133" y1="172" x2="157" y2="172" stroke="#666" strokeWidth="1.5" />
                  <line x1="133" y1="178" x2="148" y2="178" stroke="#666" strokeWidth="1.5" />
                </g>
              ) : (
                <g>
                  <path d="M 132,190 Q 120,225 128,265" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 168,190 Q 180,225 172,265" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 150,90 L 157,102 L 168,96 L 170,108 L 181,106 L 178,118 L 189,121 L 182,130 L 191,139 L 181,144 L 186,155 L 174,157 L 176,169 L 165,167 L 163,179 L 150,172 L 137,179 L 135,167 L 124,169 L 126,157 L 114,155 L 119,144 L 109,139 L 118,130 L 111,121 L 122,118 L 119,106 L 130,108 L 132,96 L 143,102 Z" fill="#ff4d4d" stroke="#111" strokeWidth="4" />
                  <circle cx="138" cy="128" r="9" fill="#fff" stroke="#111" strokeWidth="2.5" />
                  <circle cx="162" cy="128" r="9" fill="#fff" stroke="#111" strokeWidth="2.5" />
                  <circle cx="138" cy="128" r="3.5" fill="#111" />
                  <circle cx="162" cy="128" r="3.5" fill="#111" />
                  <path d="M 140,147 Q 150,135 160,147 Q 150,158 140,147 Z" fill="#111" stroke="#111" strokeWidth="2.5" />
                  <path d="M 116,134 Q 85,115 100,90" fill="none" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 184,134 Q 215,115 200,90" fill="none" stroke="#111" strokeWidth="4.5" strokeLinecap="round" />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
