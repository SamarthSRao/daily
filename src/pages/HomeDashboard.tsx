import { useState, useEffect } from "react";

export default function HomeDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats] = useState({ revenue: "$84.2k", users: "2,841", conversion: "3.72%", session: "4m 18s" });

  useEffect(() => {
    const fetchLogs = () => {
      const l = JSON.parse(localStorage.getItem("activity-logs") || "[]");
      setLogs(l.reverse().slice(0, 5));
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="meridian-home">
      <div className="meridian-home-header">
        <div className="meridian-title-area">
          <h1>Good morning,</h1>
          <h1 className="italic">overview</h1>
        </div>
        <div className="meridian-date-area">
          <div>Week 16 of 2026</div>
          <div>Apr 11 - Apr 17</div>
        </div>
      </div>

      <div className="meridian-stats-grid">
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">TOTAL REVENUE</div>
          <div className="meridian-stat-value">{stats.revenue}</div>
          <div className="meridian-stat-pill">&#8593; 12.4% vs last week</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">ACTIVE USERS</div>
          <div className="meridian-stat-value">{stats.users}</div>
          <div className="meridian-stat-pill">&#8593; 5.1% vs last week</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">CONVERSION</div>
          <div className="meridian-stat-value">{stats.conversion}</div>
          <div className="meridian-stat-pill">&#8595; 0.3% vs last week</div>
        </div>
        <div className="meridian-stat-box">
          <div className="meridian-stat-title">AVG. SESSION</div>
          <div className="meridian-stat-value">{stats.session}</div>
          <div className="meridian-stat-pill">&#8593; 8.9% vs last week</div>
        </div>
      </div>

      <div className="meridian-bottom-grid">
        <div className="meridian-weekly-box">
           <div className="meridian-weekly-header">
              <span className="meridian-stat-title">WEEKLY<br/>REVENUE</span>
              <span className="meridian-stat-title" style={{color:"#888", textAlign: "right"}}>Apr 11 - Apr<br/>17, 2026</span>
           </div>
        </div>
        
        <div className="meridian-activity-box">
           <div className="meridian-activity-header">
              <span className="meridian-stat-title">ACTIVITY</span>
              <span className="meridian-stat-title" style={{color:"#888"}}>Today</span>
           </div>
           <div className="meridian-activity-list">
              {logs.length > 0 ? logs.map((log, i) => {
                 const d = new Date(log.time);
                 const timeStr = `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
                 return (
                   <div key={i} className="meridian-activity-item">
                     <div className="meridian-activity-main">
                        <span className="dot"></span>
                        <span>{log.activity}</span>
                     </div>
                     <span className="meridian-activity-time">{timeStr}</span>
                   </div>
                 );
              }) : (
                 <div className="meridian-activity-item" style={{color: "#888"}}>No activity logged yet.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
