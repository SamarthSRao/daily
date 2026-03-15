import { useEffect, useState } from "react";
import "./index.css";

const DEFAULT_CATEGORIES = [
  { id: "commission", name: "Commission", color: "#3b82f6", w: 8, h: 1 },
  { id: "creation", name: "Creation", color: "#a855f7", w: 2, h: 4 },
  { id: "research", name: "Research", color: "#f59e0b", w: 1, h: 1 },
  { id: "life", name: "Life", color: "#10b981", w: 7, h: 12 },
  { id: "sleep", name: "Sleep", color: "#ef4444", w: 6, h: 6 },
];

type StatRow = { totH: number; remH: number; totD: number; remD: number };
type CatStats = { Y: StatRow; M: StatRow; D: StatRow; W: StatRow; H: StatRow };

function createEmptyRow(): StatRow {
  return { totH: 0, remH: 0, totD: 0, remD: 0 };
}

function createEmptyCat(): CatStats {
  return {
    Y: createEmptyRow(),
    M: createEmptyRow(),
    D: createEmptyRow(),
    W: createEmptyRow(),
    H: createEmptyRow(),
  };
}

function isHoliday(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export default function Dashboard() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("properrr-categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [now, setNow] = useState(new Date("2026-03-15T10:29:45")); 

  useEffect(() => {
    localStorage.setItem("properrr-categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = now.getFullYear();
  const month = now.getMonth();

  const totalStats = createEmptyCat();
  const catStats: Record<string, CatStats> = {};
  categories.forEach((c: any) => {
    catStats[c.id] = createEmptyCat();
  });

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

    totalStats.Y.totD += 1;
    totalStats.Y.totH += 24;
    totalStats.Y.remD += fractionRemaining;
    totalStats.Y.remH += 24 * fractionRemaining;
    if (isPast) passedYearHours += 24;
    if (isToday) passedYearHours += 24 * (1 - fractionRemaining);

    if (d.getMonth() === month) {
      totalStats.M.totD += 1;
      totalStats.M.totH += 24;
      totalStats.M.remD += fractionRemaining;
      totalStats.M.remH += 24 * fractionRemaining;
    }

    if (isH) {
      totalStats.H.totD += 1;
      totalStats.H.totH += 24;
      totalStats.H.remD += fractionRemaining;
      totalStats.H.remH += 24 * fractionRemaining;
    } else {
      totalStats.W.totD += 1;
      totalStats.W.totH += 24;
      totalStats.W.remD += fractionRemaining;
      totalStats.W.remH += 24 * fractionRemaining;
    }

    if (isToday) {
      totalStats.D.totD = 1;
      totalStats.D.totH = 24;
      totalStats.D.remD = fractionRemaining;
      totalStats.D.remH = 24 * fractionRemaining;
    }

    categories.forEach((c: any) => {
      const alloc = isH ? c.h : c.w;
      const stats = catStats[c.id];

      stats.Y.totH += alloc;
      stats.Y.remH += alloc * fractionRemaining;
      stats.Y.totD = stats.Y.totH / 24;
      stats.Y.remD = stats.Y.remH / 24;

      if (d.getMonth() === month) {
        stats.M.totH += alloc;
        stats.M.remH += alloc * fractionRemaining;
        stats.M.totD = stats.M.totH / 24;
        stats.M.remD = stats.M.remH / 24;
      }

      if (isH) {
        stats.H.totH += alloc;
        stats.H.remH += alloc * fractionRemaining;
        stats.H.totD = stats.H.totH / 24;
        stats.H.remD = stats.H.remH / 24;
      } else {
        stats.W.totH += alloc;
        stats.W.remH += alloc * fractionRemaining;
        stats.W.totD = stats.W.totH / 24;
        stats.W.remD = stats.W.remH / 24;
      }

      if (isToday) {
        stats.D.totH = alloc;
        stats.D.remH = alloc * fractionRemaining;
        stats.D.totD = alloc / 24;
        stats.D.remD = (alloc * fractionRemaining) / 24;
      }
    });
  }

  const fmt = (n: number) => (n < 10 ? "0" + n : n);
  const timeStr = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${fmt(
    now.getHours()
  )}h ${fmt(now.getMinutes())}m ${fmt(now.getSeconds())}s`;

  const totalRemainingS = totalStats.Y.remH * 3600;
  const remH = Math.floor(totalRemainingS / 3600);
  const remM = Math.floor((totalRemainingS % 3600) / 60);
  const remS = Math.floor(totalRemainingS % 60);

  const displayRemStr = `${remH}h ${remM}m ${remS}s`;

  const dailyRemainingS = totalStats.D.remH * 3600;
  const dayRemH = Math.floor(dailyRemainingS / 3600);
  const dayRemM = Math.floor((dailyRemainingS % 3600) / 60);
  const dayRemS = Math.floor(dailyRemainingS % 60);

  const dayRemStr = `${dayRemH}h ${dayRemM}m ${dayRemS}s`;

  const renderStatRow = (label: string, row: StatRow, hideDays = false) => {
    return (
      <div className="stat-row">
        <span className="label">{label}</span> : <span className="value">{Math.floor(row.remH)}h</span>
        {!hideDays && (
          <>
            <span className="sub-value">({Math.floor(row.remD)}d)</span>
          </>
        )}
        <span className="separator">/</span>
        <span className="value">{Math.floor(row.totH)}h</span>
        {!hideDays && (
          <>
            <span className="sub-value">({Math.floor(row.totD)}d)</span>
          </>
        )}
      </div>
    );
  };

  const renderCategoryCard = (c: any, stats: CatStats, titleDotColor?: string) => (
    <div className="category-card" key={c.id}>
      <div className="category-title">
        <span
          className="color-dot"
          style={{ backgroundColor: titleDotColor || c.color }}
        ></span>
        {c.name}
      </div>
      {renderStatRow("Y", stats.Y)}
      {renderStatRow("M", stats.M)}
      {renderStatRow("D", stats.D, true)}
      {renderStatRow("W", stats.W)}
      {renderStatRow("H", stats.H)}
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="datetime">{timeStr}</div>
        <div className="remaining-huge-container">
          <div className="timer-box">
            <span className="timer-label">Yearly Remaining</span>
            <span className="remaining-huge">{displayRemStr}</span>
          </div>
          <div className="timer-box">
            <span className="timer-label">Today Remaining</span>
            <span className="remaining-huge">{dayRemStr}</span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-segment"
            style={{
              width: `${(passedYearHours / totalStats.Y.totH) * 100}%`,
              backgroundColor: "#18181b",
            }}
          />
          {categories.map((c: any) => (
            <div
              key={c.id}
              className="progress-segment"
              style={{
                width: `${(catStats[c.id].Y.remH / totalStats.Y.totH) * 100}%`,
                backgroundColor: c.color,
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid-container">
        {renderCategoryCard(
          { id: "total", name: "Total", color: "#3f3f46" },
          totalStats,
          "#18181b"
        )}
        {categories.map((c: any) => renderCategoryCard(c, catStats[c.id]))}
      </div>

      <div className="footer">
        <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Ratio</button>
      </div>

      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Time Allocation Ratio</h2>
            <div className="edit-form">
              <div className="edit-header">
                <span>Category</span>
                <span>Weekday (h)</span>
                <span>Weekend (h)</span>
              </div>
              {categories.map((c: any, i: number) => (
                <div key={c.id} className="edit-row">
                  <span className="edit-name" style={{ color: c.color }}>{c.name}</span>
                  <input 
                    type="number" 
                    value={c.w} 
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[i].w = Number(e.target.value);
                      setCategories(newCats);
                    }}
                  />
                  <input 
                    type="number" 
                    value={c.h} 
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[i].h = Number(e.target.value);
                      setCategories(newCats);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="edit-btn" onClick={() => setIsEditing(false)}>Close & Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
