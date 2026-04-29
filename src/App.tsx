import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./pages/HomeDashboard";
import DailyPage from "./pages/DailyPage";
import DsaPage from "./pages/DsaPage";
import BiweeklyPage from "./pages/BiweeklyPage";
import NineMonthPlanPage from "./pages/NineMonthPlanPage";
import SystemPage from "./pages/SystemPage";
import Dashboard from "./pages/Dashboard";
import QuestionsPage from "./pages/QuestionsPage";
import "./index.css";
import "./meridian.css";

type Tab = "home" | "daily" | "dsa" | "nine-month" | "timer" | "system" | "biweekly" | "questions";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home"      : return <HomeDashboard />;
      case "daily"     : return <DailyPage />;
      case "nine-month": return <NineMonthPlanPage />;
      case "dsa"       : return <DsaPage />;
      case "biweekly"  : return <BiweeklyPage />;
      case "system"    : return <SystemPage />;
      case "timer"     : return <Dashboard />;
      case "questions" : return <QuestionsPage />;
      default          : return <HomeDashboard />;
    }
  };

  return (
    <div className="meridian-app">
      <header className="meridian-topbar">
        <div className="meridian-brand">Meridian</div>
        <div className="meridian-top-center">
           <span className="dot" /> LIVE &middot; FRI 17 APR 2026
        </div>
        <div className="meridian-top-right">
           <span>v3.1.0</span>
           <div className="meridian-avatar">AK</div>
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
