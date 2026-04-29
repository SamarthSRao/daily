import { useEffect, useState } from "react";
import { 
  History, 
  Hourglass, 
  Calendar, 
  Settings2, 
  Lock, 
  Unlock,
  AlertCircle 
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../index.css";

const DEFAULT_CATEGORIES = [
  { id: "commission", name: "Commission", color: "#3b82f6", w: 8, h: 1, locked: false },
  { id: "creation", name: "Creation", color: "#a855f7", w: 2, h: 4, locked: false },
  { id: "research", name: "Research", color: "#f59e0b", w: 1, h: 1, locked: false },
  { id: "life", name: "Life", color: "#10b981", w: 7, h: 12, locked: true },
  { id: "sleep", name: "Sleep", color: "#ef4444", w: 6, h: 6, locked: true },
];

type StatRow = { totH: number; remH: number; totD: number; remD: number };
type CatStats = { Y: StatRow; M: StatRow; D: StatRow; W: StatRow; H: StatRow };

function createEmptyRow(): StatRow { return { totH: 0, remH: 0, totD: 0, remD: 0 }; }
function createEmptyCat(): CatStats {
  return { Y: createEmptyRow(), M: createEmptyRow(), D: createEmptyRow(), W: createEmptyRow(), H: createEmptyRow() };
}
function isHoliday(date: Date) { const day = date.getDay(); return day === 0 || day === 6; }
function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function Dashboard() {
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const [now, setNow] = useState(new Date()); 
  const [activityPrompt, setActivityPrompt] = useState(false);
  const [activityLog, setActivityLog] = useState("");

  useEffect(() => {
    const checkPrompt = () => {
      const lastPrompt = localStorage.getItem("last-activity-prompt");
      const timeNow = Date.now();
      // 3 hours = 3 * 60 * 60 * 1000 = 10800000 ms
      if (!lastPrompt || timeNow - parseInt(lastPrompt) > 10800000) {
        setActivityPrompt(true);
      }
    };
    checkPrompt();
    const interval = setInterval(checkPrompt, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const saveActivity = () => {
    const logs = JSON.parse(localStorage.getItem("activity-logs") || "[]");
    logs.push({ time: new Date().toISOString(), activity: activityLog });
    localStorage.setItem("activity-logs", JSON.stringify(logs));
    localStorage.setItem("last-activity-prompt", Date.now().toString());
    setActivityPrompt(false);
    setActivityLog("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-categories", DEFAULT_CATEGORIES);
      setCategories(data);
    };
    fetchData();
  }, []);

  const updateCategories = (newCats: any[]) => {
    setCategories(newCats);
    saveState("properrr-categories", newCats);
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Time Calculation Engine
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalStats = createEmptyCat();
  const catStats: Record<string, CatStats> = {};
  categories.forEach((c: any) => { catStats[c.id] = createEmptyCat(); });

  const startYear = new Date(year, 0, 1);
  const endYear = new Date(year + 1, 0, 1);
  let passedYearHours = 0;

  for (let d = new Date(startYear); d < endYear; d.setDate(d.getDate() + 1)) {
    const isH = isHoliday(d);
    const isToday = isSameDay(d, now);
    const isPast = d.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    let fractionRemaining = isPast ? 0 : 1;
    if (isToday) {
      const hoursPassed = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      fractionRemaining = Math.max(0, 1 - (hoursPassed / 24));
    }

    const dailyTotalAlloc = categories.reduce((sum: number, c: any) => sum + (isH ? c.h : c.w), 0);
    const dailyPassedAlloc = dailyTotalAlloc * (1 - fractionRemaining);

    totalStats.Y.totH += dailyTotalAlloc;
    totalStats.Y.remH += dailyTotalAlloc * fractionRemaining;
    totalStats.Y.totD = totalStats.Y.totH / 24;
    totalStats.Y.remD = totalStats.Y.remH / 24;

    if (isPast) passedYearHours += dailyTotalAlloc;
    if (isToday) passedYearHours += dailyPassedAlloc;

    if (d.getMonth() === month) {
      totalStats.M.totH += dailyTotalAlloc;
      totalStats.M.remH += dailyTotalAlloc * fractionRemaining;
      totalStats.M.totD = totalStats.M.totH / 24;
      totalStats.M.remD = totalStats.M.remH / 24;
    }

    if (isH) {
      totalStats.H.totH += dailyTotalAlloc;
      totalStats.H.remH += dailyTotalAlloc * fractionRemaining;
    } else {
      totalStats.W.totH += dailyTotalAlloc;
      totalStats.W.remH += dailyTotalAlloc * fractionRemaining;
    }

    if (isToday) {
      totalStats.D.totH = dailyTotalAlloc;
      totalStats.D.remH = dailyTotalAlloc * fractionRemaining;
    }

    categories.forEach((c: any) => {
      const alloc = isH ? c.h : c.w;
      const stats = catStats[c.id];
      stats.Y.totH += alloc;
      stats.Y.remH += alloc * fractionRemaining;
      if (d.getMonth() === month) {
        stats.M.totH += alloc;
        stats.M.remH += alloc * fractionRemaining;
      }
      if (isToday) {
        stats.D.totH = alloc;
        stats.D.remH = alloc * fractionRemaining;
      }
    });
  }

  const calendarProgress = ((now.getTime() - startYear.getTime()) / (endYear.getTime() - startYear.getTime())) * 100;
  
  const totalRemainingS = totalStats.Y.remH * 3600;
  const remH = Math.floor(totalRemainingS / 3600);
  const remM = Math.floor((totalRemainingS % 3600) / 60);

  const dailyRemainingS = totalStats.D.remH * 3600;
  const dayRemH = Math.floor(dailyRemainingS / 3600);
  const dayRemM = Math.floor((dailyRemainingS % 3600) / 60);
  const dayRemS = Math.floor(dailyRemainingS % 60);

  return (
    <div className="dashboard-container pro-timers">
      <header className="timers-header">
        <div className="header-meta">
          <History size={16} />
          <span>Universal Time Logic / System Active</span>
        </div>
        <div className="main-stats-hero">
           <div className="hero-card primary">
              <span className="hero-tag"><Hourglass size={14} /> Today Left</span>
              <h2 className="hero-value mono">{dayRemH}h {dayRemM}m {dayRemS}s</h2>
              <div className="hero-progress-track">
                 <div className="track-fill" style={{ width: `${(totalStats.D.remH / totalStats.D.totH) * 100}%` }} />
              </div>
           </div>
           
           <div className="hero-card secondary">
              <span className="hero-tag"><Calendar size={14} /> Year Left</span>
              <h2 className="hero-value">{remH}h <span className="text-muted">{remM}m</span></h2>
              <div className="calendar-status">
                 <div className="status-label">Calendar Decay</div>
                 <div className="status-val">{calendarProgress.toFixed(4)}% Pass</div>
              </div>
           </div>
        </div>
      </header>

      <section className="allocation-overview">
         <div className="section-header-compact">
            <h3>Resource Allocation Ratio</h3>
            <button className="pro-edit-btn" onClick={() => setIsEditing(true)}>
              <Settings2 size={16} />
              Customize Vector
            </button>
         </div>

         <div className="allocation-grid">
           {/* Total Control Card */}
           <div className="alloc-card total-alloc">
              <div className="alloc-info">
                 <div className="alloc-name">System Wide</div>
                 <div className="alloc-desc">Aggregate time pressure</div>
              </div>
              <div className="alloc-metrics">
                 <div className="metric">
                    <span className="m-label">Today</span>
                    <span className="m-val">{totalStats.D.totH}h</span>
                 </div>
                 <div className="metric">
                    <span className="m-label">Yearly Rem.</span>
                    <span className="m-val">{Math.floor(totalStats.Y.remH)}h</span>
                 </div>
              </div>
              <div className="alloc-progress-visual">
                 <div className="visual-bar">
                    <div className="fill" style={{ width: `${calendarProgress}%` }} />
                 </div>
              </div>
           </div>

           {/* Individual Categories */}
           {categories.map((c) => {
             const stats = catStats[c.id];
             const dayPct = (stats.D.remH / stats.D.totH) * 100;
             return (
               <div key={c.id} className="alloc-card">
                 <div className="alloc-top">
                    <div className="alloc-title">
                       <span className="dot" style={{ backgroundColor: c.color }} />
                       <h4>{c.name}</h4>
                    </div>
                    {c.locked ? <Lock size={12} className="lock-icon" /> : <Unlock size={12} className="lock-icon unlock" />}
                 </div>
                 <div className="alloc-rows">
                    <div className="alloc-row">
                       <span className="r-label">Today</span>
                       <span className="r-val">{stats.D.totH}h <span className="r-rem">/{stats.D.remH.toFixed(1)}h</span></span>
                    </div>
                    <div className="alloc-row">
                       <span className="r-label">Monthly</span>
                       <span className="r-val">{Math.floor(stats.M.remH)}h</span>
                    </div>
                 </div>
                 <div className="alloc-progress-mini">
                    <div className="p-bar" style={{ '--color': c.color } as any}>
                       <div className="p-fill" style={{ width: `${dayPct}%` }} />
                    </div>
                 </div>
               </div>
             );
           })}
         </div>
      </section>

      {/* Activity Log Section (Persistent Text Box) */}
      <section className="allocation-overview" style={{ marginTop: "24px" }}>
         <div className="section-header-compact">
            <h3>Activity Log</h3>
         </div>
         <div className="alloc-card" style={{ width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", borderLeft: "4px solid #a855f7" }}>
           <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Log your progress (System prompts every 3 hours)</p>
           <textarea
             style={{ width: "100%", minHeight: "80px", padding: "12px", background: "rgba(0,0,0,0.2)", color: "#fff", border: "1px solid #333", borderRadius: "8px", resize: "vertical", fontFamily: "inherit" }}
             placeholder="What did you do?"
             value={activityLog}
             onChange={(e) => setActivityLog(e.target.value)}
           />
           <button className="save-btn" style={{ alignSelf: "flex-end", padding: "8px 16px" }} onClick={saveActivity}>
             Commit Log
           </button>
         </div>
      </section>

      {/* Ratios Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content pro-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ratio Engineering</h2>
              <p>Calibrate daily time allocation for maximized objective completion.</p>
            </div>
            <div className="ratio-form">
              <div className="form-head">
                <span>Objective</span>
                <span>Work-Cycle (h)</span>
                <span>Rest-Cycle (h)</span>
              </div>
              {categories.map((c, i) => (
                <div key={c.id} className="form-row">
                  <div className="name-box">
                    {c.locked ? (
                      <span className="fixed-name" style={{ color: c.color }}>{c.name}</span>
                    ) : (
                      <input
                        type="text"
                        className="name-input"
                        value={c.name}
                        onChange={(e) => {
                          const next = [...categories];
                          next[i].name = e.target.value;
                          updateCategories(next);
                        }}
                      />
                    )}
                  </div>
                  <input 
                    type="number" 
                    value={c.w} 
                    onChange={(e) => {
                      const next = [...categories];
                      next[i].w = Number(e.target.value);
                      updateCategories(next);
                    }}
                  />
                  <input 
                    type="number" 
                    value={c.h} 
                    onChange={(e) => {
                      const next = [...categories];
                      next[i].h = Number(e.target.value);
                      updateCategories(next);
                    }}
                  />
                </div>
              ))}
              
              {(() => {
                const totW = categories.reduce((s, c) => s + (c.w || 0), 0);
                const totH = categories.reduce((s, c) => s + (c.h || 0), 0);
                const wOk = Math.abs(totW - 24) < 0.01;
                const hOk = Math.abs(totH - 24) < 0.01;
                return (
                  <div className="form-total-row">
                    <div className="total-label">CHECKSUM</div>
                    <div className={`total-value ${wOk ? 'valid' : 'invalid'}`}>
                       {totW}h {!wOk && <AlertCircle size={10} />}
                    </div>
                    <div className={`total-value ${hOk ? 'valid' : 'invalid'}`}>
                       {totH}h {!hOk && <AlertCircle size={10} />}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div className="modal-footer">
               <button className="save-btn" onClick={() => setIsEditing(false)}>Lock Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Hour Activity Prompt Modal */}
      {activityPrompt && (
        <div className="modal-overlay">
          <div className="modal-content pro-modal" style={{ borderTop: "4px solid #f59e0b" }}>
            <div className="modal-header">
              <h2><Hourglass size={18} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }}/> Activity Check</h2>
              <p>It's been 3 hours. What did you do?</p>
            </div>
            <div className="ratio-form" style={{ padding: "0" }}>
              <textarea 
                style={{ width: "100%", minHeight: "120px", padding: "12px", background: "rgba(0,0,0,0.2)", color: "#fff", border: "1px solid #333", borderRadius: "8px", resize: "vertical", fontFamily: "inherit" }}
                placeholder="Describe your work..."
                value={activityLog}
                onChange={(e) => setActivityLog(e.target.value)}
              />
            </div>
            <div className="modal-footer" style={{ marginTop: "16px" }}>
               <button className="save-btn" onClick={saveActivity}>Log Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
