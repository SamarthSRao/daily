import { useState, useEffect } from 'react';
import DailyChecks from "../components/DailyChecks";
import MiscTasks from "../components/MiscTasks";
import { Terminal, Shield, Activity, Cpu, HelpCircle } from "lucide-react";
import questionsData from "../data/questions.json";

function getDailyQuestions() {
  const dateStr = new Date().toLocaleDateString(); // use local date so it resets at midnight local time
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i);
  }
  
  const backendQs = questionsData.backend;
  const numQs = backendQs.length;
  
  // Simple seeded pseudo-random
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  const selected = [];
  for(let i=0; i<3; i++) {
    const idx = Math.floor(random() * numQs);
    selected.push(backendQs[idx]);
  }
  return selected;
}

export default function SystemPage() {
  const [dailyQs, setDailyQs] = useState<any[]>([]);

  useEffect(() => {
    setDailyQs(getDailyQuestions());
  }, []);

  return (
    <div className="system-page">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <Terminal className="icon-main" style={{ color: '#3b82f6' }} />
          System Console
        </h1>
        <p className="tasks-subtitle">Unified command center for habits and miscellaneous objectives</p>
      </div>

      <div className="system-grid">
        <div className="system-card">
          <div className="card-header">
            <Shield className="header-icon" style={{ color: '#10b981' }} />
            <div>
              <h3>Daily Habits</h3>
              <p>Core consistency synchronization</p>
            </div>
          </div>
          <div className="card-body">
            <DailyChecks />
          </div>
        </div>

        <div className="system-card">
          <div className="card-header">
            <Activity className="header-icon" style={{ color: '#f59e0b' }} />
            <div>
              <h3>Miscellaneous Objectives</h3>
              <p>Buffer tasks and dynamic targets</p>
            </div>
          </div>
          <div className="card-body">
            <MiscTasks />
          </div>
        </div>

        <div className="system-card status-card">
          <div className="card-header">
            <Cpu className="header-icon" style={{ color: '#a855f7' }} />
            <div>
              <h3>Hardware Status</h3>
              <p>Environment performance logic</p>
            </div>
          </div>
          <div className="card-body">
            <div className="status-row">
              <span>Kernel Integrity</span>
              <span className="status-val good">SECURE</span>
            </div>
            <div className="status-row">
              <span>Link Velocity</span>
              <span className="status-val">STABLE</span>
            </div>
            <div className="status-row">
              <span>Memory Allocation</span>
              <span className="status-val">OPTIMAL</span>
            </div>
          </div>
        </div>

        <div className="system-card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header">
            <HelpCircle className="header-icon" style={{ color: '#ec4899' }} />
            <div>
              <h3>Daily Knowledge Check</h3>
              <p>Three randomly selected architecture questions for today</p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dailyQs.map((q, idx) => (
              <div key={idx} style={{ padding: '16px', background: 'var(--meridian-bg, #f5f5f0)', border: '1px solid var(--meridian-border, #111)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: '#111', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>#{q.id}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #111', padding: '2px 6px', borderRadius: '4px' }}>{q.type}</span>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>{q.section}</span>
                </div>
                <p style={{ margin: 0, fontWeight: '500', lineHeight: '1.5' }}>{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
