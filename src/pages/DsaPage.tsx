import { useState, useEffect, useCallback, useMemo } from "react";
import dsaDataImport from "../data/dsa_v2.json";
const dsaData = dsaDataImport as any as Level[];
import { 
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
  Library,
  History as HistoryIcon,
  Database,
  Server
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../styles/DsaPremium.css";

interface Problem {
  id: string;
  title: string;
  pattern?: string;
  prerequisite?: string;
  company?: string[] | string;
  co?: string[] | string;
  cluster?: string;
  striver_covered?: boolean;
  note?: string;
  representation_note?: string;
  representation_decision?: string;
  is_duplicate?: boolean;
  duplicate_ref?: string;
  diff?: string;
  lc?: string;
}

interface Level {
  title: string;
  problems: Problem[];
}

const COMPANIES = ["All", "Uber", "DoorDash", "Databricks", "Razorpay", "Stripe", "Rakuten", "PlanetScale"];

export default function DsaPage() {
  const [activeCompany, setActiveCompany] = useState("All");
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

  const allProblems = useMemo(() => {
    const map = new Map<string, Problem>();
    dsaData.forEach(level => {
      level.problems.forEach(p => {
        if (!map.has(p.id)) {
          map.set(p.id, p);
        }
      });
    });
    return Array.from(map.values());
  }, []);

  const filteredProblems = useMemo(() => {
    let problems = allProblems;
    
    if (activeCompany !== "All") {
      problems = problems.filter(p => {
        const coList = Array.isArray(p.co) ? p.co : (p.co ? [p.co] : []);
        const companyList = Array.isArray(p.company) ? p.company : (p.company ? [p.company] : []);
        const combined = [...coList, ...companyList].map(c => c.toLowerCase());
        return combined.includes(activeCompany.toLowerCase());
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      problems = problems.filter(p => {
        const coList = Array.isArray(p.co) ? p.co.join(' ') : (p.co || '');
        const companyList = Array.isArray(p.company) ? p.company.join(' ') : (p.company || '');
        const coStr = `${coList} ${companyList}`;
        return p.title.toLowerCase().includes(query) || 
        p.id.toLowerCase().includes(query) ||
        p.pattern?.toLowerCase().includes(query) ||
        p.cluster?.toLowerCase().includes(query) ||
        coStr.toLowerCase().includes(query);
      });
    }
    
    return problems;
  }, [allProblems, activeCompany, searchQuery]);

  const groupedProblems = useMemo(() => {
    const groups: Record<string, Problem[]> = {};
    filteredProblems.forEach(p => {
      const cluster = p.cluster || "Ungrouped Concepts";
      if (!groups[cluster]) groups[cluster] = [];
      groups[cluster].push(p);
    });
    return groups;
  }, [filteredProblems]);

  const stats = useMemo(() => {
    const total = filteredProblems.length;
    const completed = filteredProblems.filter(p => completedDsa[`dsa-${p.id}`]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }, [filteredProblems, completedDsa]);

  const getCompanyIcon = (company: string) => {
    switch(company.toLowerCase()) {
      case 'uber': return <Rocket className="w-5 h-5" />;
      case 'doordash': return <Zap className="w-5 h-5" />;
      case 'databricks': return <Database className="w-5 h-5" />;
      case 'razorpay': return <Building2 className="w-5 h-5" />;
      case 'stripe': return <Globe className="w-5 h-5" />;
      case 'rakuten': return <Brain className="w-5 h-5" />;
      case 'planetscale': return <Server className="w-5 h-5" />;
      default: return <Library className="w-5 h-5" />;
    }
  };

  return (
    <div className={`dsa-page-container active-company-${activeCompany.toLowerCase()}`}>
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

        <nav className="level-tabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {COMPANIES.map((co) => (
            <button
              key={co}
              className={`level-tab ${activeCompany === co ? "active" : ""}`}
              onClick={() => setActiveCompany(co)}
            >
              <div className="flex items-center gap-2">
                {getCompanyIcon(co)}
                <span>{co}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="dsa-progress-summary">
          <div className="progress-info">
            <div className="progress-label-wrap">
              <span className="font-bold">{activeCompany === "All" ? "Overall Progress" : `${activeCompany} Readiness`}</span>
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
                const taskId = `dsa-${prob.id}`;
                const isDone = !!completedDsa[taskId];
                const isExpanded = expandedProblemId === prob.id;
                
                const combinedCompany = Array.isArray(prob.co) 
                  ? prob.co.join(', ') 
                  : (prob.co || (Array.isArray(prob.company) ? prob.company.join(', ') : prob.company));

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
                        {prob.diff && (
                          <span className={`dsa-tag diff-${prob.diff} font-bold text-xs px-2 py-0.5 rounded-full border border-current`} style={{
                            color: prob.diff === 'E' ? '#4ade80' : prob.diff === 'M' ? '#fbbf24' : '#f87171',
                            borderColor: prob.diff === 'E' ? '#4ade8055' : prob.diff === 'M' ? '#fbbf2455' : '#f8717155',
                            backgroundColor: prob.diff === 'E' ? '#4ade8011' : prob.diff === 'M' ? '#fbbf2411' : '#f8717111',
                          }}>
                            {prob.diff === 'E' ? 'Easy' : prob.diff === 'M' ? 'Medium' : prob.diff === 'H' ? 'Hard' : prob.diff === 'D' ? 'Design' : prob.diff}
                          </span>
                        )}
                        {combinedCompany && (
                          <span className="dsa-tag company" style={{ textTransform: 'capitalize' }}>
                            <Building2 size={10} className="mr-1 inline" />
                            {combinedCompany}
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
                            <HistoryIcon size={10} className="mr-1 inline" />
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
                        
                        {prob.lc && (
                          <div className="mt-3">
                            <a href={`https://leetcode.com/problems/${prob.lc}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-900/30 hover:bg-blue-800/40 border border-blue-500/30 rounded-lg transition-colors no-underline">
                              <Globe size={12} />
                              Open on LeetCode
                            </a>
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
          </div>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No matches found</h3>
          <p className="text-slate-600">Try adjusting your search query or company filter</p>
        </div>
      )}
    </div>
  );
}
