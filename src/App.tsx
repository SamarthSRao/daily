import { useState, useRef } from "react";
import Dashboard from "./pages/Dashboard";
import DailyPage from "./pages/DailyPage";
import TasksPage from "./pages/TasksPage";
import DsaPage from "./pages/DsaPage";
import BiweeklyPage from "./pages/BiweeklyPage";
import SpecsPage from "./pages/SpecsPage";
import AlternatePlanPage from "./pages/AlternatePlanPage";
import DailyChecks from "./components/DailyChecks";
import MiscTasks from "./components/MiscTasks";
import alternatePlans from "./data/alternatePlans.json";
import { ChevronDown, ChevronUp, Calendar, LayoutGrid, Timer as TimerIcon, Dna } from "lucide-react";
import "./index.css";

const OTHER_PLANS = [
  { id: "mastery", name: "Mastery Plan", emoji: "🚀", color: "#3b82f6" },
  { id: "specs", name: "Spec Sheets", emoji: "📑", color: "#f59e0b" },
  ...alternatePlans.map(p => ({ id: p.id, name: p.name, emoji: p.emoji, color: p.color })),
];

export default function App() {
  const [showTasks, setShowTasks] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "others" | "timer" | "dsa">("daily");
  const [activeOtherPlan, setActiveOtherPlan] = useState("mastery");
  const tasksRef = useRef<HTMLElement>(null);

  const toggleTasks = () => {
    setShowTasks(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          tasksRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      return next;
    });
  };

  const handleTabSelect = (tab: "daily" | "others" | "timer" | "dsa") => {
    setActiveTab(tab);
    if (!showTasks) {
      setShowTasks(true);
      setTimeout(() => {
        tasksRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const selectedAlt = alternatePlans.find(p => p.id === activeOtherPlan) ?? null;

  return (
    <div className="main-scroll-container">
      <DailyChecks />
      <MiscTasks />
      <section className="dashboard-section">
        <Dashboard />

        <div className="toggle-tasks-container">
          <button className="toggle-tasks-btn" onClick={toggleTasks}>
            {showTasks ? (
              <>
                <ChevronUp size={20} />
                <span>Hide Content</span>
              </>
            ) : (
              <>
                <span>Explore Content</span>
                <ChevronDown size={20} />
              </>
            )}
          </button>
        </div>

        {/* Main 4 Sections Navigation */}
        <div className="main-nav">
          <button 
            className={`nav-btn ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => handleTabSelect('daily')}
            style={{ '--accent': '#10b981' } as any}
          >
            <Calendar size={24} />
            <span>DAILY</span>
          </button>
          
          <button 
            className={`nav-btn ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => handleTabSelect('dsa')}
            style={{ '--accent': '#a855f7' } as any}
          >
            <Dna size={24} />
            <span>DSA PLAN</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'others' ? 'active' : ''}`}
            onClick={() => handleTabSelect('others')}
            style={{ '--accent': '#3b82f6' } as any}
          >
            <LayoutGrid size={24} />
            <span>OTHERS</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => handleTabSelect('timer')}
            style={{ '--accent': '#f59e0b' } as any}
          >
            <TimerIcon size={24} />
            <span>TIMER</span>
          </button>
        </div>

        {/* Sub-selector for Others tab, shown only if 'others' is active AND content is shown */}
        {activeTab === 'others' && (
          <div className="plan-selector" style={{ marginTop: '24px' }}>
            {OTHER_PLANS.map(p => (
              <button
                key={p.id}
                className={`plan-pill ${activeOtherPlan === p.id ? "plan-pill--active" : ""}`}
                style={activeOtherPlan === p.id ? { borderColor: p.color, color: p.color, background: p.color + "18" } : {}}
                onClick={() => setActiveOtherPlan(p.id)}
              >
                <span>{p.emoji}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {showTasks && (
        <section className="bottom-split-section" ref={tasksRef}>
          {activeTab === "daily" ? (
            <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
              <DailyPage />
            </div>
          ) : activeTab === "dsa" ? (
            <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
              <DsaPage />
            </div>
          ) : activeTab === "timer" ? (
            <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
              <BiweeklyPage />
            </div>
          ) : activeTab === "others" ? (
            <>
              {activeOtherPlan === "mastery" && (
                <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
                  <TasksPage />
                </div>
              )}
              {activeOtherPlan === "specs" && (
                <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
                  <SpecsPage />
                </div>
              )}
              {selectedAlt && (
                <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
                  <AlternatePlanPage plan={selectedAlt as any} />
                </div>
              )}
            </>
          ) : null}
        </section>
      )}
    </div>
  );
}
