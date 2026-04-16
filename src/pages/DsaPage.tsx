import { useState, useEffect, useCallback, useMemo } from "react";
import dsaDataImport from "../data/dsa.json";
const dsaData = dsaDataImport as any as Level[];
import { 
  Binary, 
  Search, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Rocket,
  Zap,
  Globe,
  Building2,
  Library
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../styles/DsaPremium.css";

interface Problem {
  id: string;
  title: string;
  pattern?: string;
  prerequisite?: string;
  company?: string;
  cluster?: string;
  striver_covered?: boolean;
  note?: string;
  representation_note?: string;
  representation_decision?: string;
  is_duplicate?: boolean;
  duplicate_ref?: string;
}

interface Level {
  title: string;
  problems: Problem[];
}

export default function DsaPage() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedDsa, setCompletedDsa] = useState<Record<string, boolean>>({});
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-dsa", {});
      setCompletedDsa(data);
    };
    fetchData();
  }, []);

  const toggleDsaTask = useCallback((taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedDsa(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveState("properrr-dsa", next);
      return next;
    });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedProblemId(prev => (prev === id ? null : id));
  };

  const filteredProblems = useMemo(() => {
    const problems = (dsaData[activeLevel] as Level).problems;
    if (!searchQuery) return problems;
    
    const query = searchQuery.toLowerCase();
    return problems.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.id.toLowerCase().includes(query) ||
      p.pattern?.toLowerCase().includes(query) ||
      p.cluster?.toLowerCase().includes(query) ||
      p.company?.toLowerCase().includes(query)
    );
  }, [activeLevel, searchQuery]);

  const stats = useMemo(() => {
    const level = dsaData[activeLevel] as Level;
    const total = level.problems.length;
    const completed = level.problems.filter(p => completedDsa[`dsa-${p.id}`]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [activeLevel, completedDsa]);

  const getLevelIcon = (index: number) => {
    switch(index) {
      case 0: return <Zap className="w-5 h-5" />;
      case 1: return <Brain className="w-5 h-5" />;
      case 2: return <Rocket className="w-5 h-5" />;
      case 3: return <Globe className="w-5 h-5" />;
      case 4: return <Library className="w-5 h-5" />;
      default: return <Binary className="w-5 h-5" />;
    }
  };

  return (
    <div className={`dsa-page-container level-${activeLevel}`}>
      <header className="dsa-header-premium">
        <h1 className="dsa-title-premium">DSA Mastery</h1>
        <p className="dsa-subtitle-premium">
          Architectural Taxonomy & Pedagogical Roadmap for High-Stakes Engineering
        </p>
        
        <div className="dsa-search-wrap">
          <Search className="dsa-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search problems, patterns, companies..." 
            className="dsa-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="level-tabs">
          {dsaData.map((_, idx) => (
            <button
              key={idx}
              className={`level-tab ${activeLevel === idx ? "active" : ""}`}
              onClick={() => setActiveLevel(idx)}
            >
              <div className="flex items-center gap-2">
                {getLevelIcon(idx)}
                <span>Level {idx + 1}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="dsa-progress-summary">
          <div className="progress-info">
            <div className="progress-label-wrap">
              <span className="font-bold">{dsaData[activeLevel].title}</span>
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

      <div className="dsa-problems-grid">
        {filteredProblems.map((prob) => {
          const taskId = `dsa-${prob.id}`;
          const isDone = !!completedDsa[taskId];
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
                  onClick={(e) => toggleDsaTask(taskId, e)}
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
                      <Zap size={10} className="mr-1 inline" />
                      {prob.pattern}
                    </span>
                  )}
                  {prob.company && (
                    <span className="dsa-tag company">
                      <Building2 size={10} className="mr-1 inline" />
                      {prob.company}
                    </span>
                  )}
                  {prob.striver_covered && (
                    <span className="dsa-tag striver">
                      <Library size={10} className="mr-1 inline" />
                      Striver
                    </span>
                  )}
                  {prob.is_duplicate && (
                    <span className="dsa-tag duplicate">
                      <History size={10} className="mr-1 inline" />
                      Repeated
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="dsa-expansion" onClick={(e) => e.stopPropagation()}>
                  {prob.cluster && (
                    <div>
                      <span className="dsa-sub-title">Domain Cluster</span>
                      <p className="dsa-info-text">{prob.cluster}</p>
                    </div>
                  )}
                  
                  {prob.note && (
                    <div>
                      <span className="dsa-sub-title">Key Insights</span>
                      <p className="dsa-info-text">{prob.note}</p>
                    </div>
                  )}

                  {prob.prerequisite && (
                    <div>
                      <span className="dsa-sub-title">Prerequisites</span>
                      <div className="dsa-prereq-box">{prob.prerequisite}</div>
                    </div>
                  )}

                  {(prob.representation_note || prob.representation_decision) && (
                    <div className="mt-2 p-3 bg-blue-950/30 rounded-lg border border-blue-500/20">
                      <span className="dsa-sub-title text-blue-400">Architectural Decision</span>
                      {prob.representation_decision && (
                        <p className="font-bold text-sm mb-1 text-blue-200">{prob.representation_decision}</p>
                      )}
                      {prob.representation_note && (
                        <p className="text-xs text-blue-300/80 leading-relaxed italic">{prob.representation_note}</p>
                      )}
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

      {filteredProblems.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No matches found</h3>
          <p className="text-slate-600">Try adjusting your search query or level Filter</p>
        </div>
      )}
    </div>
  );
}
