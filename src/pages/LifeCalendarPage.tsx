import { useState, useEffect } from "react";
import { Calendar, User, Compass, Hourglass, BookOpen, X, ExternalLink } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

interface SelectedWeek {
  year: number;
  week: number;
  days: { date: Date; dateStr: string; label: string }[];
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function LifeCalendarPage() {
  const [birthdate, setBirthdate] = useState("1998-05-20");
  const [weeksLived, setWeeksLived] = useState(0);
  const [hoveredWeek, setHoveredWeek] = useState<{ year: number; week: number } | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<SelectedWeek | null>(null);
  const [vaultName, setVaultName] = useState("My Vault");

  // Load birthdate + vault name on mount
  useEffect(() => {
    const fetchData = async () => {
      const savedBirth = await loadState("properrr-birthdate", "1998-05-20");
      setBirthdate(savedBirth);
      const savedVault = localStorage.getItem("obsidian-vault-name") || "My Vault";
      setVaultName(savedVault);
    };
    fetchData();
  }, []);

  // Compute weeks lived
  useEffect(() => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    if (diffMs < 0) { setWeeksLived(0); return; }
    setWeeksLived(Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
  }, [birthdate]);

  const handleBirthdateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthdate(val);
    await saveState("properrr-birthdate", val);
  };

  const handleVaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setVaultName(val);
    localStorage.setItem("obsidian-vault-name", val);
  };

  // Click a week block — compute 7 actual calendar dates
  const handleWeekClick = (year: number, week: number) => {
    const birth = new Date(birthdate);
    const absoluteWeek = year * 52 + week;
    const weekStartMs = birth.getTime() + absoluteWeek * 7 * 24 * 60 * 60 * 1000;

    const days = DAY_NAMES.map((label, i) => {
      const d = new Date(weekStartMs + i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      return { date: d, dateStr, label };
    });

    setSelectedWeek({ year, week, days });
  };

  const openObsidian = (dateStr: string) => {
    const url = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(dateStr)}`;
    // Custom URI schemes don't work with window.open — use an anchor click instead
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalWeeks = 90 * 52;
  const percentageLived = Math.min(100, Math.max(0, (weeksLived / totalWeeks) * 100));

  const getEraColor = (year: number) => {
    if (year < 5) return "#ffecb3";
    if (year < 18) return "#c8e6c9";
    if (year < 22) return "#bbdefb";
    return "#e0e0e0";
  };

  return (
    <div className="life-calendar-container">
      <style>{`
        .life-calendar-container {
          padding: 24px;
          color: #1e1e1e;
          font-family: 'Nunito', sans-serif;
          background-color: #faf7f0;
          border: 3px solid #1e1e1e;
          border-radius: 12px;
          box-shadow: 6px 6px 0px #1e1e1e;
          margin-bottom: 24px;
        }

        .calendar-header { text-align: center; margin-bottom: 24px; }

        .calendar-title {
          font-family: 'Permanent Marker', cursive;
          font-size: 2.5rem;
          margin: 0;
          transform: rotate(-0.5deg);
        }

        .calendar-subtitle { color: #666; font-weight: 600; margin-top: 6px; }

        .calendar-layout {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .calendar-layout { grid-template-columns: 1fr; }
        }

        .calendar-sidebar {
          background: #fff;
          border: 3px solid #1e1e1e;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 4px 4px 0px #1e1e1e;
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: fit-content;
        }

        .sidebar-section-title {
          font-family: 'Permanent Marker', cursive;
          font-size: 1.2rem;
          margin: 0 0 10px 0;
          border-bottom: 2.5px solid #1e1e1e;
          padding-bottom: 4px;
        }

        .cal-input {
          border: 2px solid #1e1e1e;
          padding: 8px;
          border-radius: 6px;
          font-family: inherit;
          width: 100%;
          font-weight: 700;
          box-sizing: border-box;
        }

        .stat-pill-list { display: flex; flex-direction: column; gap: 8px; }

        .stat-pill {
          background: #fafafa;
          border: 2px solid #1e1e1e;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }

        .stat-val {
          margin-left: auto;
          font-family: 'Permanent Marker', cursive;
          font-size: 1.1rem;
        }

        .grid-card {
          background: #fff;
          border: 3px solid #1e1e1e;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 4px 4px 0px #1e1e1e;
          overflow-x: auto;
        }

        .grid-header-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 800;
          color: #666;
          margin-bottom: 8px;
          padding-left: 28px;
        }

        .grid-body { display: flex; flex-direction: column; gap: 2px; }

        .grid-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .row-label {
          width: 24px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #666;
          text-align: right;
          margin-right: 4px;
          flex-shrink: 0;
        }

        .weeks-row {
          display: grid;
          grid-template-columns: repeat(52, 1fr);
          gap: 2px;
          flex: 1;
        }

        .week-box {
          aspect-ratio: 1;
          border: 1px solid #ddd;
          border-radius: 1.5px;
          background-color: #fff;
          cursor: pointer;
          position: relative;
          transition: transform 0.1s ease;
        }

        .week-box:hover {
          transform: scale(1.5);
          z-index: 10;
          border-color: #1e1e1e;
          outline: 1px solid #1e1e1e;
        }

        .week-box.selected {
          outline: 2px solid #7c3aed !important;
          transform: scale(1.5);
          z-index: 11;
        }

        .week-box.lived {
          background-color: #424242 !important;
          border-color: #333;
        }

        .week-box.current {
          background-color: #ff4081 !important;
          border-color: #1e1e1e;
          animation: current-pulse 1s infinite alternate;
          outline: 1.5px solid #1e1e1e;
        }

        @keyframes current-pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.3); }
        }

        .decade-separator { margin-bottom: 6px; }

        .era-legend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .legend-item { display: flex; align-items: center; gap: 6px; }

        .legend-color {
          width: 14px;
          height: 14px;
          border: 1.5px solid #1e1e1e;
          border-radius: 3px;
        }

        /* Week Day Expansion Panel */
        .week-expansion-panel {
          margin-top: 20px;
          background: #fff;
          border: 3px solid #7c3aed;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 4px 4px 0 #7c3aed;
          animation: slide-in 0.25s ease;
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .expansion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .expansion-title {
          font-family: 'Permanent Marker', cursive;
          font-size: 1.3rem;
          margin: 0;
          color: #7c3aed;
        }

        .expansion-close-btn {
          background: none;
          border: 2px solid #7c3aed;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c3aed;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        @media (max-width: 900px) {
          .days-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .day-card {
          border: 2px solid #1e1e1e;
          border-radius: 8px;
          padding: 12px 8px;
          text-align: center;
          background: #faf7f0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 2px 2px 0 #1e1e1e;
          position: relative;
          transition: transform 0.1s ease;
        }

        .day-card:hover { transform: translateY(-2px); }

        .day-card.weekend { background: #f3f0ff; border-color: #7c3aed; }

        .day-card.today-card {
          background: #fff0f3;
          border: 2.5px solid #ff4081;
          box-shadow: 3px 3px 0 #ff4081, 0 0 12px rgba(255,64,129,0.25);
          animation: today-pulse 2s infinite alternate;
        }

        @keyframes today-pulse {
          from { box-shadow: 3px 3px 0 #ff4081, 0 0 8px rgba(255,64,129,0.2); }
          to   { box-shadow: 3px 3px 0 #ff4081, 0 0 18px rgba(255,64,129,0.45); }
        }

        .today-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4081;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .day-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #7c3aed;
        }

        .day-date-main {
          font-family: 'Permanent Marker', cursive;
          font-size: 1.2rem;
        }

        .day-date-full {
          font-size: 0.7rem;
          color: #888;
          font-weight: 700;
        }

        .obsidian-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: #7c3aed;
          color: #fff;
          border: 2px solid #1e1e1e;
          border-radius: 6px;
          padding: 6px 4px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          margin-top: 4px;
          box-shadow: 1px 1px 0 #1e1e1e;
          transition: all 0.1s ease;
          text-decoration: none;
        }

        .obsidian-btn:hover {
          transform: translate(-1px, -1px);
          box-shadow: 2px 2px 0 #1e1e1e;
          background: #6d28d9;
        }

        .calendar-motivational {
          font-family: 'Permanent Marker', cursive;
          font-size: 0.95rem;
          text-align: center;
          padding: 12px;
          border: 2px dashed #ff85a2;
          background: #fff0f3;
          border-radius: 8px;
          margin-top: auto;
          transform: rotate(-0.5deg);
        }

        .vault-hint {
          font-size: 0.72rem;
          color: #888;
          font-weight: 700;
          margin-top: 4px;
        }
      `}</style>

      <div className="calendar-header">
        <h1 className="calendar-title">YOUR LIFE IN WEEKS</h1>
        <div className="calendar-subtitle">Every square = one week of a 90-year life. Click any week to see its 7 days and open in Obsidian.</div>
      </div>

      <div className="calendar-layout">

        {/* Left: Grid + Expansion Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="grid-card">
            <div className="grid-header-row">
              <span>WEEK 1 &rarr;</span>
              <span>&larr; WEEK 52</span>
            </div>

            <div className="grid-body">
              {Array.from({ length: 90 }).map((_, yearIdx) => {
                const isDecadeEnd = yearIdx > 0 && yearIdx % 10 === 0;
                return (
                  <div key={yearIdx} className={`grid-row ${isDecadeEnd ? "decade-separator" : ""}`}>
                    <span className="row-label">{yearIdx}</span>
                    <div className="weeks-row">
                      {Array.from({ length: 52 }).map((_, weekIdx) => {
                        const absIdx = yearIdx * 52 + weekIdx;
                        const isLived = absIdx < weeksLived;
                        const isCurrent = absIdx === weeksLived;
                        const isSelected = selectedWeek?.year === yearIdx && selectedWeek?.week === weekIdx;
                        const eraColor = getEraColor(yearIdx);

                        return (
                          <div
                            key={weekIdx}
                            className={`week-box ${isLived ? "lived" : ""} ${isCurrent ? "current" : ""} ${isSelected ? "selected" : ""}`}
                            style={!isLived && !isCurrent ? { backgroundColor: eraColor } : {}}
                            onMouseEnter={() => setHoveredWeek({ year: yearIdx, week: weekIdx })}
                            onMouseLeave={() => setHoveredWeek(null)}
                            onClick={() => handleWeekClick(yearIdx, weekIdx)}
                            title={`Age ${yearIdx}, Week ${weekIdx + 1} — click to expand`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Week expansion panel */}
          {selectedWeek && (
            <div className="week-expansion-panel">
              <div className="expansion-header">
                <h3 className="expansion-title">
                  🗓️ Age {selectedWeek.year}, Week {selectedWeek.week + 1}
                  &nbsp;—&nbsp;
                  {selectedWeek.days[0].dateStr} → {selectedWeek.days[6].dateStr}
                </h3>
                <button className="expansion-close-btn" onClick={() => setSelectedWeek(null)}>
                  <X size={16} />
                </button>
              </div>

              {/* Quick Today Button */}
              {selectedWeek.days.some(d => d.dateStr === new Date().toISOString().split("T")[0]) && (
                <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px", background: "#fff0f3", border: "2px solid #ff4081", borderRadius: "8px", padding: "10px 14px" }}>
                  <span style={{ fontFamily: "'Permanent Marker', cursive", color: "#ff4081", fontSize: "1rem" }}>📅 Today is in this week!</span>
                  <button
                    className="obsidian-btn"
                    style={{ background: "#ff4081", marginTop: 0, marginLeft: "auto" }}
                    onClick={() => openObsidian(new Date().toISOString().split("T")[0])}
                  >
                    <BookOpen size={12} />
                    <ExternalLink size={10} />
                    Open Today
                  </button>
                </div>
              )}

              <div className="days-grid">
                {selectedWeek.days.map((day, i) => {
                  const isWeekend = i >= 5;
                  const isToday = day.dateStr === new Date().toISOString().split("T")[0];
                  const dayNum = day.date.getDate();
                  const monthName = day.date.toLocaleString("default", { month: "short" });
                  const yearNum = day.date.getFullYear();

                  return (
                    <div key={i} className={`day-card ${isWeekend ? "weekend" : ""} ${isToday ? "today-card" : ""}`}>
                      {isToday && <div className="today-badge">TODAY</div>}
                      <div className="day-label">{day.label}</div>
                      <div className="day-date-main">{dayNum}</div>
                      <div className="day-date-full">{monthName} {yearNum}</div>
                      <button
                        className="obsidian-btn"
                        style={isToday ? { background: "#ff4081", borderColor: "#ff4081" } : {}}
                        onClick={() => openObsidian(day.dateStr)}
                        title={`Open ${day.dateStr} in Obsidian`}
                      >
                        <BookOpen size={12} />
                        <ExternalLink size={10} />
                        {isToday ? "Today" : "Open"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{
                marginTop: "14px",
                fontSize: "0.78rem",
                color: "#888",
                fontWeight: 700,
                textAlign: "center"
              }}>
                ☝️ Buttons open Obsidian vault <strong>"{vaultName}"</strong> to that date's daily note. Change vault name in the sidebar.
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="calendar-sidebar">
          <div>
            <h4 className="sidebar-section-title">🎈 BIRTHDATE</h4>
            <input
              type="date"
              className="cal-input"
              value={birthdate}
              onChange={handleBirthdateChange}
            />
          </div>

          <div>
            <h4 className="sidebar-section-title">🔮 OBSIDIAN VAULT</h4>
            <input
              type="text"
              className="cal-input"
              placeholder="Enter your vault name..."
              value={vaultName}
              onChange={handleVaultChange}
            />
            <div className="vault-hint">
              Used to build the deep link:<br />
              <code>obsidian://open?vault=<em>{vaultName || "..."}</em>&amp;file=YYYY-MM-DD</code>
            </div>
          </div>

          <div>
            <h4 className="sidebar-section-title">📊 LIFE STATS</h4>
            <div className="stat-pill-list">
              <div className="stat-pill">
                <Compass size={18} />
                <span>Current Age</span>
                <span className="stat-val">
                  {Math.floor(weeksLived / 52)}y {weeksLived % 52}w
                </span>
              </div>
              <div className="stat-pill">
                <User size={18} />
                <span>Weeks Lived</span>
                <span className="stat-val">{weeksLived}</span>
              </div>
              <div className="stat-pill">
                <Hourglass size={18} />
                <span>Weeks Left</span>
                <span className="stat-val">{Math.max(0, totalWeeks - weeksLived)}</span>
              </div>
              <div className="stat-pill">
                <Calendar size={18} />
                <span>% Lived</span>
                <span className="stat-val">{percentageLived.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="sidebar-section-title">🎨 ERA LEGEND</h4>
            <div className="era-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#ffecb3" }} />
                <span>0–5 (Child)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#c8e6c9" }} />
                <span>5–18 (School)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#bbdefb" }} />
                <span>18–22 (College)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#e0e0e0" }} />
                <span>22–90 (Career)</span>
              </div>
            </div>
          </div>

          {hoveredWeek && !selectedWeek && (
            <div style={{
              background: "#1e1e1e",
              color: "#fff",
              padding: "10px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 800,
              textAlign: "center"
            }}>
              🔍 Age {hoveredWeek.year}, Week {hoveredWeek.week + 1}<br />
              <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>Click to expand days</span>
            </div>
          )}

          <div className="calendar-motivational">
            {percentageLived > 50
              ? "👹 HALF YOUR LIFE IS GONE. Wake up Sam!"
              : `🐒 ${percentageLived.toFixed(0)}% of your squares used. The Monkey wants you on Reddit.`}
          </div>
        </div>

      </div>
    </div>
  );
}
