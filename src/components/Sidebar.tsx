import { Home, Calendar, Rocket, Dna, Timer, Terminal, ChevronLeft, ChevronRight, Settings, Layers, HelpCircle } from "lucide-react";
import { useState } from "react";

type NavItem = {
  id: string;
  label: string;
  icon: any;
  color: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Overview", icon: Home, color: "#3b82f6" },
  { id: "daily", label: "Daily Plan", icon: Calendar, color: "#10b981" },
  { id: "nine-month", label: "9-Month Mastery", icon: Rocket, color: "#3b82f6" },
  { id: "dsa", label: "DSA Tracker", icon: Dna, color: "#a855f7" },
  { id: "biweekly", label: "Biweekly Internals", icon: Layers, color: "#3b82f6" },
  { id: "questions", label: "Questions", icon: HelpCircle, color: "#ec4899" },
  { id: "timer", label: "Timers", icon: Timer, color: "#f59e0b" },
  { id: "system", label: "System Console", icon: Terminal, color: "#3b82f6" },
];

export default function Sidebar({ 
  activeTab, 
  onTabSelect 
}: { 
  activeTab: string; 
  onTabSelect: (tab: any) => void 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <span className="logo-text">PROPERRR</span>}
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabSelect(item.id)}
              style={{ '--accent': item.color } as any}
            >
              <Icon size={20} className="sidebar-icon" />
              {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
              {isActive && !isCollapsed && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item settings">
          <Settings size={20} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
