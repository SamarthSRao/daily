import { Grid, Activity, FileText, Users, MessageSquare, Settings, Sun, Database, Calendar, Flame, BookOpen, RefreshCw, CheckCircle } from "lucide-react";

export default function Sidebar({ activeTab, onTabSelect }: any) {
  return (
    <aside className="meridian-sidebar">
      <div className="meridian-sidebar-section">

        <h4 className="meridian-sidebar-header">OVERVIEW</h4>
        <NavItem id="home" label="Dashboard" activeTab={activeTab} onTabSelect={onTabSelect} icon={Grid} />
        <NavItem id="deadline-goals" label="Deadline Goals" activeTab={activeTab} onTabSelect={onTabSelect} icon={CheckCircle} />
        <NavItem id="timer" label="Timers" activeTab={activeTab} onTabSelect={onTabSelect} icon={Sun} badge="Active" />
      </div>

      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">MIND COCKPIT</h4>
        <NavItem id="panic-monster" label="Panic Monster" activeTab={activeTab} onTabSelect={onTabSelect} icon={Flame} />
        <NavItem id="life-calendar" label="Life Calendar" activeTab={activeTab} onTabSelect={onTabSelect} icon={Calendar} />
      </div>

      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">CURRICULUM</h4>
        <NavItem id="prerequisites" label="Prerequisites" activeTab={activeTab} onTabSelect={onTabSelect} icon={BookOpen} />
        <NavItem id="daily" label="Daily Plan" activeTab={activeTab} onTabSelect={onTabSelect} icon={Activity} />
        <NavItem id="nine-month" label="9-Month Plan" activeTab={activeTab} onTabSelect={onTabSelect} icon={FileText} />
        <NavItem id="biweekly" label="Biweekly Sprints" activeTab={activeTab} onTabSelect={onTabSelect} icon={Users} />
      </div>

      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">PRACTICE</h4>
        <NavItem id="dsa" label="DSA Tracker" activeTab={activeTab} onTabSelect={onTabSelect} icon={Database} />
        <NavItem id="sql" label="SQL Tracker" activeTab={activeTab} onTabSelect={onTabSelect} icon={Database} />
        <NavItem id="questions" label="Knowledge Bank" activeTab={activeTab} onTabSelect={onTabSelect} icon={MessageSquare} badge="4k+" />
        <NavItem id="weak-link" label="Weakest Link" activeTab={activeTab} onTabSelect={onTabSelect} icon={RefreshCw} />
      </div>

      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">SYSTEM</h4>
        <NavItem id="system" label="System Console" activeTab={activeTab} onTabSelect={onTabSelect} icon={Settings} />
      </div>
    </aside>
  );
}

function NavItem({ id, label, icon: Icon, activeTab, onTabSelect, badge }: any) {
  return (
    <div className={`meridian-nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => onTabSelect(id)}>
      <Icon size={16} strokeWidth={1.5} />
      <span>{label}</span>
      {badge && <span className="meridian-badge">{badge}</span>}
    </div>
  );
}
