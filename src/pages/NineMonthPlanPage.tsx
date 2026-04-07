import { useState, useEffect } from "react";
import data from "../data/nine_month_plan.json";
import { ChevronDown, ChevronRight, Rocket, Target, Code2, Cpu, Wrench, CheckCircle2 } from "lucide-react";
import { saveState, loadState } from "../lib/redis";

export default function NineMonthPlanPage() {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({ "m1": true });
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      const saved = await loadState("properrr-9month", {});
      setCompletedSteps(saved);
    };
    fetchData();
  }, []);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      saveState("properrr-9month", next);
      return next;
    });
  };

  const toggleMonth = (id: string) => {
    setExpandedMonths(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTrackIcon = (name: string) => {
    if (name.includes("DSA")) return <Code2 size={18} className="track-icon dsa" />;
    if (name.includes("Systems")) return <Cpu size={18} className="track-icon systems" />;
    if (name.includes("Project")) return <Wrench size={18} className="track-icon project" />;
    return <Target size={18} className="track-icon" />;
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <Rocket className="icon-main" style={{ color: "#3b82f6" }} />
          9-Month Backend Mastery
        </h1>
        <p className="tasks-subtitle">Company Target: Rippling, Palantir, Uber, DoorDash, JioHotstar, Razorpay, Databricks</p>
      </div>

      <div className="curriculum-list">
        {data.map((month) => (
          <div key={month.id} className="month-card nine-month-card">
            <div 
              className="month-header" 
              onClick={() => toggleMonth(month.id)}
            >
              <div className="month-title">
                <div className="month-badge">{month.id.toUpperCase()}</div>
                <div className="month-info">
                  <h2>{month.title}</h2>
                  <span className="phase-label">{month.phase}</span>
                </div>
              </div>
              {expandedMonths[month.id] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedMonths[month.id] && (
              <div className="month-content">
                <div className="tracks-grid">
                  {month.tracks.map((track, tIdx) => (
                    <div key={tIdx} className="track-item-card">
                      <div className="track-header">
                        {getTrackIcon(track.name)}
                        <h3>{track.name}</h3>
                      </div>
                      <p className="track-content">{track.content}</p>
                    </div>
                  ))}
                </div>

                {month.deliverables && (
                  <div className="deliverables-section">
                    <h4>Monthly Deliverables</h4>
                    <ul className="deliverables-list">
                      {month.deliverables.map((del, dIdx) => {
                        const delId = `${month.id}-del-${dIdx}`;
                        const isDone = completedSteps[delId];
                        return (
                          <li 
                            key={delId} 
                            className={`deliverable-item ${isDone ? "completed" : ""}`}
                            onClick={() => toggleStep(delId)}
                          >
                            <CheckCircle2 size={16} className={isDone ? "icon-done" : "icon-pending"} />
                            <span>{del}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
