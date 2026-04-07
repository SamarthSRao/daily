import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./pages/HomeDashboard";
import DailyPage from "./pages/DailyPage";
import DsaPage from "./pages/DsaPage";
import BiweeklyPage from "./pages/BiweeklyPage";
import NineMonthPlanPage from "./pages/NineMonthPlanPage";
import SystemPage from "./pages/SystemPage";
import Dashboard from "./pages/Dashboard";
import "./index.css";

type Tab = "home" | "daily" | "dsa" | "nine-month" | "timer" | "system" | "biweekly";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timer");

  const renderContent = () => {
    switch (activeTab) {
      case "home"      : return <HomeDashboard />;
      case "daily"     : return <DailyPage />;
      case "nine-month": return <NineMonthPlanPage />;
      case "dsa"       : return <DsaPage />;
      case "biweekly"  : return <BiweeklyPage />;
      case "system"    : return <SystemPage />;
      case "timer"     : return <Dashboard />;
      default          : return <HomeDashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Navigation & Command Layer (Left) */}
      <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />
      
      {/* Primary Workspace (Center/Right) */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
