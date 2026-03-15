import { useState, useRef } from "react";
import Dashboard from "./Dashboard";
import TasksPage from "./TasksPage";
import DsaPage from "./DsaPage";
import AlternatePlanPage from "./AlternatePlanPage";
import alternatePlans from "./alternatePlans.json";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./index.css";

const PLANS = [
  { id: "main", name: "Mastery Plan", emoji: "🚀", color: "#3b82f6" },
  ...alternatePlans.map(p => ({ id: p.id, name: p.name, emoji: p.emoji, color: p.color })),
];

export default function App() {
  const [showTasks, setShowTasks] = useState(false);
  const [activePlan, setActivePlan] = useState("main");
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

  const handlePlanSelect = (id: string) => {
    setActivePlan(id);
    if (!showTasks) {
      setShowTasks(true);
      setTimeout(() => {
        tasksRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const selectedAlt = alternatePlans.find(p => p.id === activePlan) ?? null;

  return (
    <div className="main-scroll-container">
      <section className="dashboard-section">
        <Dashboard />

        <div className="toggle-tasks-container">
          {/* Main plan toggle button */}
          <button className="toggle-tasks-btn" onClick={toggleTasks}>
            {showTasks ? (
              <>
                <ChevronUp size={20} />
                <span>Hide Plans</span>
              </>
            ) : (
              <>
                <span>View Plans</span>
                <ChevronDown size={20} />
              </>
            )}
          </button>
        </div>

        {/* Plan selector pills */}
        <div className="plan-selector">
          {PLANS.map(p => (
            <button
              key={p.id}
              className={`plan-pill ${activePlan === p.id ? "plan-pill--active" : ""}`}
              style={activePlan === p.id ? { borderColor: p.color, color: p.color, background: p.color + "18" } : {}}
              onClick={() => handlePlanSelect(p.id)}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      {showTasks && (
        <section className="bottom-split-section" ref={tasksRef}>
          {activePlan === "main" ? (
            <>
              <div className="split-column">
                <TasksPage />
              </div>
              <div className="split-column">
                <DsaPage />
              </div>
            </>
          ) : selectedAlt ? (
            <div className="split-column" style={{ maxWidth: 960, width: "100%" }}>
              <AlternatePlanPage plan={selectedAlt as any} />
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
