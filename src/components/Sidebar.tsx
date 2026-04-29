import { Grid, Activity, FileText, Users, MessageSquare, Settings, Sun, Database } from "lucide-react";

export default function Sidebar({ activeTab, onTabSelect }: any) {
  return (
    <aside className="meridian-sidebar">
      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">OVERVIEW</h4>
        <NavItem id="home" label="Dashboard" activeTab={activeTab} onTabSelect={onTabSelect} icon={Grid} />
        <NavItem id="daily" label="Analytics" activeTab={activeTab} onTabSelect={onTabSelect} icon={Activity} badge="New" />
        <NavItem id="nine-month" label="Reports" activeTab={activeTab} onTabSelect={onTabSelect} icon={FileText} />
      </div>
      
      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">MANAGE</h4>
        <NavItem id="dsa" label="Projects" activeTab={activeTab} onTabSelect={onTabSelect} icon={Database} badge="4" />
        <NavItem id="biweekly" label="Users" activeTab={activeTab} onTabSelect={onTabSelect} icon={Users} />
        <NavItem id="questions" label="Messages" activeTab={activeTab} onTabSelect={onTabSelect} icon={MessageSquare} badge="12" />
      </div>

      <div className="meridian-sidebar-section">
        <h4 className="meridian-sidebar-header">SYSTEM</h4>
        <NavItem id="timer" label="Timers" activeTab={activeTab} onTabSelect={onTabSelect} icon={Sun} />
        <NavItem id="system" label="Settings" activeTab={activeTab} onTabSelect={onTabSelect} icon={Settings} />
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
