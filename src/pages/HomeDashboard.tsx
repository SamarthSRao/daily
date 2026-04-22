import { useState, useEffect } from "react";
import { loadState } from "../lib/redis";
import { 
  Rocket, 
  Dna, 
  Calendar, 
  TrendingUp, 
  BrainCircuit,
  ShieldCheck,
  Hourglass,
  Layers,
  StickyNote,
  Circle,
  CheckCircle2
} from "lucide-react";
import dsaDataImport from "../data/dsa.json";
const dsaData = dsaDataImport as any;
import nineMonthData from "../data/nine_month_plan.json";
import biweeklyData from "../data/biweekly.json";
import questionsDataImport from "../data/questions.json";
const qData = questionsDataImport as any;
import { HelpCircle } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { id: "commission", name: "Commission", color: "#3b82f6", w: 8, h: 1, locked: false },
  { id: "creation", name: "Creation", color: "#a855f7", w: 2, h: 4, locked: false },
  { id: "research", name: "Research", color: "#f59e0b", w: 1, h: 1, locked: false },
  { id: "life", name: "Life", color: "#10b981", w: 7, h: 12, locked: true },
  { id: "sleep", name: "Sleep", color: "#ef4444", w: 6, h: 6, locked: true },
];

export default function HomeDashboard() {
  const [now, setNow] = useState(new Date());
  const [stats, setStats] = useState({
    dsaDone: 0,
    dsaTotal: 0,
    nineMonthDone: 0,
    nineMonthTotal: 0,
    dailyDone: 0,
    dailyTotal: 4,
    remainingYearStr: "",
    remainingDayStr: "",
    yearProgress: 0,
  });

  const [activeProject, setActiveProject] = useState<any>(null);
  const [miscTasks, setMiscTasks] = useState<any[]>([]);
  const [nextMilestone, setNextMilestone] = useState<any>(null);
  const [dailyQuestions, setDailyQuestions] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    
    // Pick one from backend
    const bMatch = qData.backend[seed % qData.backend.length];
    // Pick one from clrs
    const cMatch = qData.clrs[seed % qData.clrs.length];
    
    setDailyQuestions([
      { ...bMatch, bank: "Backend" },
      { ...cMatch, bank: "Algorithms" }
    ]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const dsaState = await loadState("properrr-dsa", {});
      const nineMonthState = await loadState("properrr-9month", {});
      const dailyState = await loadState(`properrr-daily-ticks-${today}`, {});
      const categories = await loadState("properrr-categories", DEFAULT_CATEGORIES);
      const biweeklyMeta = await loadState("properrr-biweekly-meta", { startDate: new Date(2026, 0, 1).getTime() });
      const miscData = await loadState("properrr-misc-tasks", []);

      // Active Project Logic
      const startDate = new Date(biweeklyMeta.startDate);
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const activeIdx = Math.floor(daysSinceStart / 14);
      if (activeIdx >= 0 && activeIdx < biweeklyData.length) {
        setActiveProject(biweeklyData[activeIdx]);
      }

      setMiscTasks(miscData.slice(0, 5)); // Show top 5 misc tasks

      // Core Progress Calcs
      const allDsaProbs = dsaData.flatMap((level: any) => level.problems);
      const dsaDoneCount = Object.keys(dsaState).filter(k => dsaState[k]).length;
      const totalDeliverables = nineMonthData.reduce((acc, month) => acc + (month.deliverables?.length || 0), 0);
      const nineMonthDoneCount = Object.keys(nineMonthState).filter(k => nineMonthState[k]).length;
      const dailyDoneCount = Object.values(dailyState).filter(v => v).length;

      // Time Remainder Calcs
      const year = now.getFullYear();
      const startYear = new Date(year, 0, 1);
      const endYear = new Date(year + 1, 0, 1);
      const yearProgress = ((now.getTime() - startYear.getTime()) / (endYear.getTime() - startYear.getTime())) * 100;

      const isHoliday = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
      const h = isHoliday(now);
      const dailyTotalAlloc = categories.reduce((sum: number, c: any) => sum + (h ? c.h : c.w), 0);
      const hoursPassed = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      const fractionRemaining = Math.max(0, 1 - (hoursPassed / 24));
      const dailyRemH = dailyTotalAlloc * fractionRemaining;
      
      const diffS = (endYear.getTime() - now.getTime()) / 1000;
      const yrRemH = Math.floor(diffS / 3600);
      const yrRemM = Math.floor((diffS % 3600) / 60);

      const dayRemH = Math.floor(dailyRemH);
      const dayRemM = Math.floor((dailyRemH % 1) * 60);
      const dayRemS = Math.floor(((dailyRemH % 1) * 60 % 1) * 60);

      setStats(prev => ({
        ...prev,
        dsaDone: dsaDoneCount,
        dsaTotal: allDsaProbs.length,
        nineMonthDone: nineMonthDoneCount,
        nineMonthTotal: totalDeliverables,
        dailyDone: dailyDoneCount,
        yearProgress,
        remainingYearStr: `${yrRemH}h ${yrRemM}m`,
        remainingDayStr: `${dayRemH}h ${dayRemM}m ${dayRemS}s`,
      }));

      for (const month of nineMonthData) {
         const undone = month.deliverables?.find((_, idx) => !nineMonthState[`${month.id}-del-${idx}`]);
         if (undone) {
            setNextMilestone({ month: month.title, task: undone });
            break;
         }
      }
    };

    fetchStats();
    const statTimer = setInterval(fetchStats, 60000); 
    return () => clearInterval(statTimer);
  }, [now.getHours()]);

  return (
    <div className="home-dashboard">
      <header className="dashboard-header">
        <div className="header-greeting">
          <h1>Universal Command</h1>
          <p>System Operating Logic: <span className="text-highlight">Peak Efficiency</span></p>
        </div>
        <div className="system-status">
           <div className="status-item">
              <span className="dot pulse" />
              <span>LIVE</span>
           </div>
           <div className="header-time">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
           </div>
        </div>
      </header>

      <section className="main-timers-section">
         <div className="timer-card large">
            <div className="timer-info">
               <span className="timer-tag"><Hourglass size={12} /> Today Remaining</span>
               <h2 className="timer-value mono">{stats.remainingDayStr}</h2>
            </div>
            <div className="timer-visual">
               <div className="visual-bar-wrap">
                  <div className="visual-bar-fill" style={{ width: `${(stats.dailyDone / stats.dailyTotal) * 100}%` }} />
               </div>
            </div>
         </div>
         <div className="timer-card blur">
            <span className="timer-tag">Year Passed</span>
            <h2 className="timer-value">{stats.yearProgress.toFixed(4)}%</h2>
            <div className="mini-progress-track">
               <div className="track-fill" style={{ width: `${stats.yearProgress}%` }} />
            </div>
         </div>
      </section>

      <div className="stats-grid">
        <StatCard 
          title="Daily Habits" 
          value={`${stats.dailyDone}/${stats.dailyTotal}`} 
          progress={(stats.dailyDone / stats.dailyTotal) * 100}
          icon={Calendar}
          color="#10b981"
          label="Sync Status"
        />
        <StatCard 
          title="DSA Velocity" 
          value={`${stats.dsaDone}`} 
          subValue={`/${stats.dsaTotal}`}
          progress={(stats.dsaDone / stats.dsaTotal) * 100}
          icon={Dna}
          color="#a855f7"
          label="Logic Ingested"
        />
        <StatCard 
          title="Mastery Path" 
          value={`${stats.nineMonthDone}`} 
          progress={(stats.nineMonthDone / stats.nineMonthTotal) * 100}
          icon={Rocket}
          color="#3b82f6"
          label="Milestone Lock"
        />
        <StatCard 
          title="Time Vector" 
          value={stats.remainingYearStr} 
          progress={100 - stats.yearProgress}
          icon={TrendingUp}
          color="#f59e0b"
          label="Year Left"
        />
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-main-card active-milestone">
          <div className="card-header">
            <BrainCircuit className="header-icon" />
            <h2>Immediate Objective</h2>
          </div>
          {nextMilestone ? (
            <div className="milestone-content">
              <span className="milestone-tag">{nextMilestone.month}</span>
              <p className="milestone-text">{nextMilestone.task}</p>
              <div className="milestone-footer">
                <ShieldCheck size={16} />
                <span>Primary Target Lock</span>
              </div>
            </div>
          ) : (
            <p className="empty-state">All current objectives achieved.</p>
          )}
        </div>

        <div className="dashboard-main-card daily-questions">
          <div className="card-header">
            <HelpCircle className="header-icon" />
            <h2>Daily Mental Sparring</h2>
          </div>
          <div className="daily-questions-wrap">
            {dailyQuestions.map((q, idx) => (
              <div key={idx} className="daily-q-item">
                <div className="q-meta">
                  <span className="q-bank">{q.bank}</span>
                  <span className="q-type-mini">{q.type}</span>
                </div>
                <p className="q-text-small">{q.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-side-cards mobile-hide">
           <div className="mini-card clock-card">
              <div className="card-header-compact">
                 <Layers size={14} />
                 <h3>Ongoing Project</h3>
              </div>
              <div className="active-project-brief">
                 <span className="proj-title">{activeProject?.title || "N/A"}</span>
                 <p className="proj-sub">{activeProject?.subtitle || "No active biweekly cycle"}</p>
              </div>
              <div className="progress-ring-wrap small">
                  <svg width="80" height="80">
                     <circle className="ring-bg" cx="40" cy="40" r="34" />
                     <circle 
                        className="ring-fill" 
                        cx="40" cy="40" r="34" 
                        style={{ 
                          strokeDasharray: `${(stats.dailyDone / stats.dailyTotal) * 213} 213`,
                          stroke: stats.dailyDone === stats.dailyTotal ? '#10b981' : '#3b82f6'
                        }}
                     />
                  </svg>
                  <div className="ring-center">
                     <span className="percent">{Math.round((stats.dailyDone / stats.dailyTotal) * 100)}%</span>
                     <span className="label">Sync</span>
                  </div>
              </div>
           </div>

           <div className="mini-card tasks-summary-card">
              <div className="card-header-compact">
                 <StickyNote size={14} />
                 <h3>Misc Tasks Today</h3>
              </div>
              <div className="misc-summary-list">
                 {miscTasks.length > 0 ? (
                   miscTasks.map((t, idx) => (
                     <div key={idx} className="misc-summary-item">
                        {t.done ? <CheckCircle2 size={12} className="icon-done" /> : <Circle size={12} className="icon-pending" />}
                        <span>{t.text}</span>
                     </div>
                   ))
                 ) : (
                   <p className="empty-msg">No miscellaneous tasks tracked today.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, progress, icon: Icon, color, label }: any) {
  return (
    <div className="stat-card-v2">
      <div className="stat-card-header">
        <div className="stat-icon-box" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={18} />
        </div>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value-box">
        <span className="stat-value">{value}</span>
        {subValue && <span className="stat-sub-value">{subValue}</span>}
      </div>
      <div className="stat-progress-container">
        <div className="stat-progress-bar">
          <div 
            className="stat-progress-fill" 
            style={{ width: `${progress}%`, backgroundColor: color }} 
          />
        </div>
        <span className="stat-progress-label">{label}</span>
      </div>
    </div>
  );
}
