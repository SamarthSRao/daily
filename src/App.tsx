import { useState, useRef } from "react";
import Dashboard from "./Dashboard";
import TasksPage from "./TasksPage";
import DsaPage from "./DsaPage";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./index.css";

export default function App() {
  const [showTasks, setShowTasks] = useState(false);
  const tasksRef = useRef<HTMLElement>(null);

  const toggleTasks = () => {
    setShowTasks(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          tasksRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      return next;
    });
  };

  return (
    <div className="main-scroll-container">
      <section className="dashboard-section">
        <Dashboard />
        
        <div className="toggle-tasks-container">
          <button className="toggle-tasks-btn" onClick={toggleTasks}>
            {showTasks ? (
              <>
                <ChevronUp size={20} />
                <span>Hide Mastery Plan</span>
              </>
            ) : (
              <>
                <span>View Mastery Plan</span>
                <ChevronDown size={20} />
              </>
            )}
          </button>
        </div>
      </section>

      {showTasks && (
        <section className="bottom-split-section" ref={tasksRef}>
          <div className="split-column">
            <TasksPage />
          </div>
          <div className="split-column">
            <DsaPage />
          </div>
        </section>
      )}
    </div>
  );
}
