import { useState, useEffect } from "react";
import { loadState } from "../lib/redis";
import dsaDataImport from "../data/dsa.json";
const dsaData = dsaDataImport as any;
import nineMonthData from "../data/nine_month_plan.json";
import biweeklyData from "../data/biweekly.json";
import ProcrastinationMatrix from "../components/ProcrastinationMatrix";

const pad2 = (value: number) => value.toString().padStart(2, "0");
const formatLocalDate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const getISOWeekInfo = (date: Date) => {
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const day = localDate.getDay() || 7; // Sunday -> 7
  localDate.setDate(localDate.getDate() + 4 - day); // Thursday in current week
  const weekYear = localDate.getFullYear();
  const yearStart = new Date(weekYear, 0, 1);
  const weekNumber = Math.ceil(
    ((localDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { weekNumber, weekYear };
};

const DEFAULT_CATEGORIES = [
  {
    id: "commission",
    name: "Commission",
    color: "#3b82f6",
    w: 8,
    h: 1,
    locked: false,
  },
  {
    id: "creation",
    name: "Creation",
    color: "#a855f7",
    w: 2,
    h: 4,
    locked: false,
  },
  {
    id: "research",
    name: "Research",
    color: "#f59e0b",
    w: 1,
    h: 1,
    locked: false,
  },
  { id: "life", name: "Life", color: "#10b981", w: 7, h: 12, locked: true },
  { id: "sleep", name: "Sleep", color: "#ef4444", w: 6, h: 6, locked: true },
];

export default function HomeDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
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

  const [activeProject, setActiveProject] = useState<any>(null);

  useEffect(() => {
    // Fetch logs
    const fetchLogs = () => {
      const l = JSON.parse(localStorage.getItem("activity-logs") || "[]");
      setLogs(l.reverse().slice(0, 5));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

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
      const categories = await loadState(
        "properrr-categories",
        DEFAULT_CATEGORIES,
      );
      const biweeklyMeta = await loadState("properrr-biweekly-meta", {
        startDate: new Date(2026, 0, 1).getTime(),
      });

      // Active Project Logic
      const startDate = new Date(biweeklyMeta.startDate);
      const daysSinceStart = Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const activeIdx = Math.floor(daysSinceStart / 14);
      if (activeIdx >= 0 && activeIdx < biweeklyData.length) {
        setActiveProject(biweeklyData[activeIdx]);
      }

      // Core Progress Calcs
      const allDsaProbs = dsaData.flatMap((level: any) => level.problems);
      const dsaDoneCount = Object.keys(dsaState).filter(
        (k) => dsaState[k],
      ).length;
      const totalDeliverables = nineMonthData.reduce(
        (acc, month) => acc + (month.deliverables?.length || 0),
        0,
      );
      const nineMonthDoneCount = Object.keys(nineMonthState).filter(
        (k) => nineMonthState[k],
      ).length;
      const dailyDoneCount = Object.values(dailyState).filter((v) => v).length;

      // Time Remainder Calcs
      const year = now.getFullYear();
      const startYear = new Date(year, 0, 1);
      const endYear = new Date(year + 1, 0, 1);
      const yearProgress =
        ((now.getTime() - startYear.getTime()) /
          (endYear.getTime() - startYear.getTime())) *
        100;

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

  const { weekNumber: currentWeekNum, weekYear: currentWeekYear } =
    getISOWeekInfo(now);

  return (
    <div className="meridian-home">
      <div className="meridian-home-header">
        <div className="meridian-title-area">
          <h1>Good morning,</h1>
          <h1 className="italic">overview</h1>
        </div>
        <div className="meridian-date-area">
          <div>
            Week {currentWeekNum} of {currentWeekYear}
          </div>
          <div>
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="meridian-stats-grid">
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">DAILY HABITS</div>
          <div className="meridian-stat-value">
            {stats.dailyDone}/{stats.dailyTotal}
          </div>
          <div className="meridian-stat-pill">
            {((stats.dailyDone / stats.dailyTotal) * 100 || 0).toFixed(1)}%
            complete
          </div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">DSA VELOCITY</div>
          <div className="meridian-stat-value">{stats.dsaDone}</div>
          <div className="meridian-stat-pill">
            / {stats.dsaTotal} logic ingested
          </div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">MASTERY PATH</div>
          <div className="meridian-stat-value">
            {stats.nineMonthDone}/{stats.nineMonthTotal}
          </div>
          <div className="meridian-stat-pill">milestones locked</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">TIME VECTOR</div>
          <div className="meridian-stat-value" style={{ fontSize: "2.4rem" }}>
            {stats.remainingYearStr}
          </div>
          <div className="meridian-stat-pill">
            {stats.yearProgress.toFixed(2)}% passed
          </div>
        </div>
      </div>

      <ProcrastinationMatrix />

      <div className="meridian-bottom-grid">
        <div className="meridian-weekly-box">
          <div className="meridian-weekly-header">
            <span className="meridian-stat-title">
              ACTIVE
              <br />
              SPRINT
            </span>
            <span
              className="meridian-stat-title"
              style={{ color: "#888", textAlign: "right" }}
            >
              {now.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div style={{ marginTop: "24px" }}>
            <h2
              style={{
                fontFamily: "var(--meridian-font-serif)",
                fontSize: "2rem",
                marginBottom: "8px",
                color: "var(--text-primary)",
              }}
            >
              {activeProject?.title || "No Sprint"}
            </h2>
            <p
              style={{
                fontFamily: "var(--meridian-font-mono)",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              {activeProject?.subtitle || "Awaiting instructions..."}
            </p>
          </div>
        </div>

        <div className="meridian-activity-box">
          <div className="meridian-activity-header">
            <span className="meridian-stat-title">ACTIVITY</span>
            <span className="meridian-stat-title" style={{ color: "#888" }}>
              Today
            </span>
          </div>
          <div className="meridian-activity-list">
            {logs.length > 0 ? (
              logs.map((log, i) => {
                const d = new Date(log.time);
                const timeStr = `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
                return (
                  <div key={i} className="meridian-activity-item">
                    <div className="meridian-activity-main">
                      <span className="dot"></span>
                      <span>{log.activity}</span>
                    </div>
                    <span className="meridian-activity-time">{timeStr}</span>
                  </div>
                );
              })
            ) : (
              <div className="meridian-activity-item" style={{ color: "#888" }}>
                No activity logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
