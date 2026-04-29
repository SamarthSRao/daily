import { useState, useEffect } from "react";
import { saveState, loadState } from "../lib/redis";
import { CheckCircle2, Circle, Code2, Layout, Milestone, PenTool } from "lucide-react";

const CHECKS = [
  { id: "dsa", label: "DSA", icon: Code2, color: "#a855f7" },
  { id: "sysDesign", label: "System Design", icon: Layout, color: "#3b82f6" },
  { id: "lfx", label: "LFX", icon: Milestone, color: "#10b981" },
  { id: "blogs", label: "Blogs", icon: PenTool, color: "#f59e0b" },
];

export default function DailyChecks() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `properrr-daily-ticks-${today}`;

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState(storageKey, {});
      setCompleted(data);
    };
    fetchData();
  }, [storageKey]);

  const toggleCheck = (id: string) => {
    const next = { ...completed, [id]: !completed[id] };
    setCompleted(next);
    saveState(storageKey, next);
  };

  return (
    <div className="daily-checks-container">
      {CHECKS.map((check) => {
        const Icon = check.icon;
        const isDone = completed[check.id];
        return (
          <div 
            key={check.id} 
            className={`daily-check-item ${isDone ? 'is-done' : ''}`}
            onClick={() => toggleCheck(check.id)}
            title={check.label}
          >
            <div className="check-icon-wrapper" style={{ color: isDone ? '#111' : check.color, backgroundColor: isDone ? check.color : 'transparent' }}>
              <Icon size={14} />
            </div>
            <span className="check-label">{check.label}</span>
            {isDone ? <CheckCircle2 size={14} className="check-status done" /> : <Circle size={14} className="check-status" />}
          </div>
        );
      })}
    </div>
  );
}
