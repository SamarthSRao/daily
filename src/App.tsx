import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./pages/HomeDashboard";
import DailyPage from "./pages/DailyPage";
import DsaPage from "./pages/DsaPage";
import BiweeklyPage from "./pages/BiweeklyPage";
import NineMonthPlanPage from "./pages/NineMonthPlanPage";
import SystemPage from "./pages/SystemPage";
import Dashboard from "./pages/Dashboard";
import QuestionsPage from "./pages/QuestionsPage";
import LifeCalendarPage from "./pages/LifeCalendarPage";
import PanicMonsterPage from "./pages/PanicMonsterPage";
import "./index.css";
import "./meridian.css";

type Tab = "home" | "daily" | "dsa" | "nine-month" | "timer" | "system" | "biweekly" | "questions" | "life-calendar" | "panic-monster";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [now, setNow] = useState(new Date());
  const [marqueeMsg, setMarqueeMsg] = useState("3HR WAKE UP NOTIFICATION ACTIVE • LOG ACTIVITY PROMPT EVERY 3 HOURS");

  useEffect(() => {
    const checkLogs = () => {
      const l = JSON.parse(localStorage.getItem("activity-logs") || "[]");
      if (l.length > 0) {
        setMarqueeMsg(`LAST LOG: ${l[l.length - 1].activity.toUpperCase()}`);
      }
    };
    
    checkLogs();
    const timer = setInterval(() => {
      setNow(new Date());
      checkLogs();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home"          : return <HomeDashboard />;
      case "daily"         : return <DailyPage />;
      case "nine-month"    : return <NineMonthPlanPage />;
      case "dsa"           : return <DsaPage />;
      case "biweekly"      : return <BiweeklyPage />;
      case "system"        : return <SystemPage />;
      case "timer"         : return <Dashboard />;
      case "questions"     : return <QuestionsPage />;
      case "life-calendar" : return <LifeCalendarPage />;
      case "panic-monster" : return <PanicMonsterPage />;
      default              : return <HomeDashboard />;
    }
  };

  return (
    <div className="meridian-app">
      <header className="meridian-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden", padding: "0" }}>
        
        {/* Scrolling Marquee Background Layer */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", zIndex: 1, pointerEvents: "none" }}>
           <div className="meridian-marquee-text" style={{ whiteSpace: "nowrap", color: "rgba(170,170,170,0.4)", fontSize: "0.75rem", letterSpacing: "2px", fontWeight: "600" }}>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
              <span>{marqueeMsg} • {marqueeMsg} • </span>
           </div>
        </div>

        {/* Foreground Content */}
        <div style={{ zIndex: 2, background: "var(--meridian-black)", height: "100%", display: "flex", alignItems: "center", padding: "0 24px", fontWeight: 800, fontSize: "1.1rem" }}>
          SAM
        </div>

        <div style={{ zIndex: 2, background: "var(--meridian-black)", height: "100%", display: "flex", alignItems: "center", padding: "0 24px" }}>
           {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} &middot; {now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        <div style={{ zIndex: 2, background: "var(--meridian-black)", height: "100%", display: "flex", alignItems: "center", padding: "0 24px" }}>
           <a href="https://samarthsrao.xyz" target="_blank" rel="noreferrer" style={{ color: "var(--meridian-bg)", textDecoration: "none" }}>
             samarthsrao.xyz ↗
           </a>
        </div>
      </header>
      <div className="meridian-body">
        <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />
        <main className="meridian-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
