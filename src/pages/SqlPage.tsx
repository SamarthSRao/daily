import { useState, useEffect, useCallback, useMemo } from "react";
import sqlDataImport from "../data/sql.json";
const sqlData = sqlDataImport as any as Level[];
import { 
  Database, 
  Search, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  Server,
  Table,
  Activity,
  Box,
  CreditCard,
  Users,
  MessageSquare,
  Globe
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../styles/DsaPremium.css";

interface Problem {
  id: string;
  title: string;
  pattern?: string;
  cluster?: string;
}

interface Level {
  title: string;
  problems: Problem[];
}

export default function SqlPage() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedSql, setCompletedSql] = useState<Record<string, boolean>>({});
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-sql", {});
      setCompletedSql(data);
    };
    fetchData();
  }, []);

  const toggleSqlTask = useCallback((taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSql(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveState("properrr-sql", next);
      return next;
    });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedProblemId(prev => (prev === id ? null : id));
  };

  const filteredProblems = useMemo(() => {
    const problems = (sqlData[activeLevel] as Level).problems;
    if (!searchQuery) return problems;
    
    const query = searchQuery.toLowerCase();
    return problems.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.id.toLowerCase().includes(query) ||
      p.pattern?.toLowerCase().includes(query) ||
      p.cluster?.toLowerCase().includes(query)
    );
  }, [activeLevel, searchQuery]);

  const groupedProblems = useMemo(() => {
    const groups: Record<string, Problem[]> = {};
    filteredProblems.forEach(p => {
      const cluster = p.cluster || "General";
      if (!groups[cluster]) groups[cluster] = [];
      groups[cluster].push(p);
    });
    return groups;
  }, [filteredProblems]);

  const stats = useMemo(() => {
    const level = sqlData[activeLevel] as Level;
    const total = level.problems.length;
    const completed = level.problems.filter(p => completedSql[`sql-${p.id}`]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [activeLevel, completedSql]);

  const getLevelIcon = (index: number) => {
    switch(index) {
      case 0: return <Box className="w-5 h-5" />; // E-Commerce
      case 1: return <Activity className="w-5 h-5" />; // Ride-Sharing
      case 2: return <Table className="w-5 h-5" />; // Delivery
      case 3: return <CreditCard className="w-5 h-5" />; // Payments
      case 4: return <Users className="w-5 h-5" />; // HR
      case 5: return <MessageSquare className="w-5 h-5" />; // Social Media
      case 6: return <Database className="w-5 h-5" />; // Core SQL
      default: return <Server className="w-5 h-5" />;
    }
  };

  return (
    <div className={`dsa-page-container level-${activeLevel}`}>
      <header className="dsa-header-premium">
        <h1 className="dsa-title-premium">SQL Mastery</h1>
        <p className="dsa-subtitle-premium">
          900 Practice Questions Across 7 Real-World Domains
        </p>
        
        <div className="dsa-search-wrap">
          <Search className="dsa-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search questions, concepts, domains..." 
            className="dsa-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="level-tabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {sqlData.map((level, idx) => {
            const shortTitle = level.title.split(' ')[1] || level.title;
            return (
              <button
                key={idx}
                className={`level-tab ${activeLevel === idx ? "active" : ""}`}
                onClick={() => setActiveLevel(idx)}
              >
                <div className="flex items-center gap-2">
                  {getLevelIcon(idx)}
                  <span>{shortTitle}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="dsa-progress-summary">
          <div className="progress-info">
            <div className="progress-label-wrap">
              <span className="font-bold">{sqlData[activeLevel].title}</span>
              <span className="progress-percentage">{stats.percentage}% Complete</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-2xl font-black">{stats.completed}</span>
            <span className="text-sm text-slate-500 font-bold ml-1">/ {stats.total} Tasks</span>
          </div>
        </div>
      </header>

      <div className="dsa-clusters-wrap">
        {Object.entries(groupedProblems).map(([clusterName, problems]) => (
          <div key={clusterName} style={{ marginBottom: "48px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
              {clusterName}
            </h2>
            <div className="dsa-problems-grid" style={{ paddingBottom: "0" }}>
              {problems.map((prob) => {
                const taskId = `sql-${prob.id}`;
                const isDone = !!completedSql[taskId];
                const isExpanded = expandedProblemId === prob.id;

                return (
                  <div 
                    key={prob.id} 
                    className={`dsa-problem-card ${isDone ? "completed" : ""}`}
                    onClick={() => toggleExpand(prob.id)}
                  >
                    <div className="dsa-card-header">
                      <span className="dsa-id-badge">{prob.id}</span>
                      <button 
                        className="bg-transparent border-none cursor-pointer"
                        onClick={(e) => toggleSqlTask(taskId, e)}
                      >
                        {isDone ? (
                          <CheckCircle2 className="dsa-status-icon text-emerald-500" />
                        ) : (
                          <Circle className="dsa-status-icon text-slate-600" />
                        )}
                      </button>
                    </div>

                    <div className="dsa-card-body">
                      <h3>{prob.title}</h3>
                      <div className="dsa-tags">
                        {prob.pattern && (
                          <span className="dsa-tag pattern">
                            <Database size={10} className="mr-1 inline" />
                            {prob.pattern}
                          </span>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="dsa-expansion" onClick={(e) => e.stopPropagation()}>
                        {prob.cluster && (
                          <div>
                            <span className="dsa-sub-title">Domain Sub-topic</span>
                            <p className="dsa-info-text">{prob.cluster}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 flex justify-center text-slate-600">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No matches found</h3>
          <p className="text-slate-600">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
