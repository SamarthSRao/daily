import { useState, useEffect } from "react";
import { loadState } from "../lib/redis";
import dsaDataImport from "../data/dsa.json";
const dsaData = dsaDataImport as any;
import nineMonthData from "../data/nine_month_plan.json";

const pad2 = (value: number) => value.toString().padStart(2, "0");
const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const getISOWeekInfo = (date: Date) => {
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const day = localDate.getDay() || 7;
  localDate.setDate(localDate.getDate() + 4 - day);
  const weekYear = localDate.getFullYear();
  const yearStart = new Date(weekYear, 0, 1);
  const weekNumber = Math.ceil(
    ((localDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { weekNumber, weekYear };
};

const DEFAULT_CATEGORIES = [
  { id: "commission", name: "Commission", w: 8, h: 1, locked: false },
  { id: "creation", name: "Creation", w: 2, h: 4, locked: false },
  { id: "research", name: "Research", w: 1, h: 1, locked: false },
  { id: "life", name: "Life", w: 7, h: 12, locked: true },
  { id: "sleep", name: "Sleep", w: 6, h: 6, locked: true },
];

const TOPICS = [
  "go",
  "javascript",
  "backend",
  "database",
  "lfx",
  "system design"
];

export default function MainPage() {
  const [now, setNow] = useState(new Date());
  
  const [stats, setStats] = useState({
    dsaDone: 0,
    dsaTotal: 0,
    nineMonthDone: 0,
    nineMonthTotal: 0,
    dailyDone: 0,
    dailyTotal: 4,
    remainingYearStr: "",
    yearProgress: 0,
  });

  const [heatmapData, setHeatmapData] = useState<Record<string, Record<string, boolean>>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const today = formatLocalDate(new Date());

      const dsaState = await loadState("properrr-dsa", {});
      const nineMonthState = await loadState("properrr-9month", {});
      const dailyState = await loadState(`properrr-daily-ticks-${today}`, {});
      const categories = await loadState("properrr-categories", DEFAULT_CATEGORIES);
      
      const heatmap = await loadState("properrr-heatmap", {});
      setHeatmapData(heatmap);

      const allDsaProbs = dsaData.flatMap((level: any) => level.problems);
      const dsaDoneCount = Object.keys(dsaState).filter((k) => dsaState[k]).length;
      const totalDeliverables = nineMonthData.reduce((acc, month) => acc + (month.deliverables?.length || 0), 0);
      const nineMonthDoneCount = Object.keys(nineMonthState).filter((k) => nineMonthState[k]).length;
      const dailyDoneCount = Object.values(dailyState).filter((v) => v).length;

      const year = now.getFullYear();
      const startYear = new Date(year, 0, 1);
      const endYear = new Date(year + 1, 0, 1);
      const yearProgress = ((now.getTime() - startYear.getTime()) / (endYear.getTime() - startYear.getTime())) * 100;

      const diffS = (endYear.getTime() - now.getTime()) / 1000;
      const yrRemH = Math.floor(diffS / 3600);
      const yrRemM = Math.floor((diffS % 3600) / 60);

      setStats({
        dsaDone: dsaDoneCount,
        dsaTotal: allDsaProbs.length,
        nineMonthDone: nineMonthDoneCount,
        nineMonthTotal: totalDeliverables,
        dailyDone: dailyDoneCount,
        dailyTotal: categories.length,
        yearProgress,
        remainingYearStr: `${yrRemH}h ${yrRemM}m`,
      });
    };

    fetchStats();
    const statTimer = setInterval(fetchStats, 60000);
    return () => clearInterval(statTimer);
  }, [now.getHours()]);

  const { weekNumber: currentWeekNum, weekYear: currentWeekYear } = getISOWeekInfo(now);

  const handleTopicToggle = (topic: string) => {
    if (!selectedDate) return;
    setHeatmapData((prev) => {
      const dayData = prev[selectedDate] || {};
      const newDayData = { ...dayData, [topic]: !dayData[topic] };
      const newData = { ...prev, [selectedDate]: newDayData };
      localStorage.setItem("properrr-heatmap", JSON.stringify(newData));
      return newData;
    });
  };

  // Generate last 364 days (52 weeks)
  const today = new Date();
  const heatmapDays = [];
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    heatmapDays.push(formatLocalDate(d));
  }

  const getHeatmapColor = (dateStr: string) => {
    const dayData = heatmapData[dateStr] || {};
    const count = Object.values(dayData).filter(Boolean).length;
    if (count === 0) return "rgba(0, 0, 0, 0.1)"; // empty/no streak (visible on light background)
    if (count === TOPICS.length) return "#10b981"; // full green
    // Gradient based on how many done
    const intensity = 0.3 + (count / TOPICS.length) * 0.7;
    return `rgba(16, 185, 129, ${intensity})`;
  };

  return (
    <div className="meridian-home" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div className="meridian-home-header">
        <div className="meridian-title-area">
          <h1>Main Base,</h1>
          <h1 className="italic">overview</h1>
        </div>
        <div className="meridian-date-area">
          <div>Week {currentWeekNum} of {currentWeekYear}</div>
          <div>{now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
        </div>
      </div>

      <div className="meridian-stats-grid">
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">DAILY HABITS</div>
          <div className="meridian-stat-value">{stats.dailyDone}/{stats.dailyTotal}</div>
          <div className="meridian-stat-pill">{((stats.dailyDone / stats.dailyTotal) * 100 || 0).toFixed(1)}% complete</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">DSA VELOCITY</div>
          <div className="meridian-stat-value">{stats.dsaDone}</div>
          <div className="meridian-stat-pill">/ {stats.dsaTotal} logic ingested</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">MASTERY PATH</div>
          <div className="meridian-stat-value">{stats.nineMonthDone}/{stats.nineMonthTotal}</div>
          <div className="meridian-stat-pill">milestones locked</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">TIME VECTOR</div>
          <div className="meridian-stat-value" style={{ fontSize: "2.4rem" }}>{stats.remainingYearStr}</div>
          <div className="meridian-stat-pill">{stats.yearProgress.toFixed(2)}% passed</div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div style={{ background: "var(--meridian-bg-elevated)", padding: "30px", borderRadius: "16px", border: "1px solid var(--text-muted, rgba(0,0,0,0.1))" }}>
        <h2 style={{ marginBottom: "20px", fontSize: "1.2rem", color: "var(--text-primary)", fontFamily: "var(--meridian-font-mono)", letterSpacing: "1px", textTransform: "uppercase" }}>
          Daily Interview Streak
        </h2>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(52, 16px)", 
          gridTemplateRows: "repeat(7, 16px)",
          gridAutoFlow: "column",
          gap: "6px",
          width: "100%",
          overflowX: "auto",
          paddingBottom: "20px"
        }}>
          {heatmapDays.map((dateStr) => (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              title={dateStr}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "3px",
                background: getHeatmapColor(dateStr),
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedDate && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            background: "var(--meridian-bg)", padding: "30px", borderRadius: "16px", width: "400px", border: "1px solid var(--text-muted, rgba(0,0,0,0.1))", zIndex: 1001, color: "var(--text-primary)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--meridian-font-mono)", fontSize: "1.2rem", margin: 0 }}>Interviewed on {selectedDate}?</h2>
              <button onClick={() => setSelectedDate(null)} style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {TOPICS.map((topic) => {
                const isChecked = heatmapData[selectedDate]?.[topic] || false;
                return (
                  <label key={topic} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "10px", background: "var(--meridian-bg-elevated, rgba(0,0,0,0.02))", borderRadius: "8px" }}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => handleTopicToggle(topic)}
                      style={{ width: "18px", height: "18px", accentColor: "#10b981" }}
                    />
                    <span style={{ textTransform: "capitalize", fontSize: "1.1rem" }}>{topic}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
