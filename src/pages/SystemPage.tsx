import DailyChecks from "../components/DailyChecks";
import MiscTasks from "../components/MiscTasks";
import { Terminal, Shield, Activity, Cpu } from "lucide-react";

export default function SystemPage() {
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
      </div>
    </div>
  );
}
