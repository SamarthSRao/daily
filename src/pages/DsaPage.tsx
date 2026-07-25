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
  Server,
  Calendar,
  RefreshCw,
  Award,
  Clock
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

interface RevisionState {
  problemId: string;
  completedAt: string; // ISO string
  stage: number; // 0 to 5
  lastRevisedAt: string | null; // ISO string
}

const COMPANIES = ["All", "Uber", "DoorDash", "Databricks", "Razorpay", "Stripe", "Rakuten", "PlanetScale"];
const REVISION_INTERVALS = [1, 3, 5, 8, 13]; // Fibonacci spaced repetition intervals

export default function DsaPage() {
  const [activeCompany, setActiveCompany] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedDsa, setCompletedDsa] = useState<Record<string, boolean>>({});
  const [dsaRevisions, setDsaRevisions] = useState<Record<string, RevisionState>>({});
  const [activeRevTab, setActiveRevTab] = useState<"due" | "upcoming" | "mastered">("due");
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-dsa", {});
      const revData = await loadState("properrr-dsa-revision", {});
      setCompletedDsa(data);
      setDsaRevisions(revData || {});
    };
    fetchData();
  }, []);

  const toggleDsaTask = useCallback((taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const problemId = taskId.replace(/^dsa-/, "");
    
    setCompletedDsa(prevCompleted => {
      const isNowCompleted = !prevCompleted[taskId];
      const nextCompleted = { ...prevCompleted, [taskId]: isNowCompleted };
      saveState("properrr-dsa", nextCompleted);

      setDsaRevisions(prevRevisions => {
        const nextRevisions = { ...prevRevisions };
        if (isNowCompleted) {
          nextRevisions[problemId] = {
            problemId,
            completedAt: new Date().toISOString(),
            stage: 0,
            lastRevisedAt: null
          };
        } else {
          delete nextRevisions[problemId];
        }
        saveState("properrr-dsa-revision", nextRevisions);
        return nextRevisions;
      });

      return nextCompleted;
    });
  }, []);

  const markAsRevised = useCallback((problemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDsaRevisions(prev => {
      const current = prev[problemId];
      if (!current) return prev;

      const nextStage = Math.min(current.stage + 1, 5);
      const updated: RevisionState = {
        ...current,
        stage: nextStage,
        lastRevisedAt: new Date().toISOString(),
      };

      const next = { ...prev, [problemId]: updated };
      saveState("properrr-dsa-revision", next);
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

  const revisionStats = useMemo(() => {
    const nowTime = new Date().getTime();
    
    const dueList: { problem: Problem; rev: RevisionState; dueTime: number; dueLabel: string }[] = [];
    const upcomingList: { problem: Problem; rev: RevisionState; dueTime: number; dueLabel: string }[] = [];
    const masteredList: { problem: Problem; rev: RevisionState }[] = [];

    const problemMap = new Map<string, Problem>();
    allProblems.forEach(p => problemMap.set(p.id, p));

    Object.entries(dsaRevisions).forEach(([probId, rev]) => {
      const problem = problemMap.get(probId);
      if (!problem) return;

      if (rev.stage >= 5) {
        masteredList.push({ problem, rev });
      } else {
        const baseDate = rev.lastRevisedAt ? new Date(rev.lastRevisedAt) : new Date(rev.completedAt);
        const interval = REVISION_INTERVALS[rev.stage] || 0;
        const dueDate = new Date(baseDate.getTime() + interval * 24 * 60 * 60 * 1000);
        const dueTime = dueDate.getTime();
        const diffMs = dueTime - nowTime;

        let dueLabel = "";
        if (diffMs <= 0) {
          const overdueDays = Math.floor(Math.abs(diffMs) / (24 * 60 * 60 * 1000));
          dueLabel = overdueDays === 0 ? "Due today" : `Overdue by ${overdueDays}d`;
          dueList.push({ problem, rev, dueTime, dueLabel });
        } else {
          const upcomingDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
          dueLabel = upcomingDays === 1 ? "Due tomorrow" : `Due in ${upcomingDays}d`;
          upcomingList.push({ problem, rev, dueTime, dueLabel });
        }
      }
    });

    dueList.sort((a, b) => a.dueTime - b.dueTime);
    upcomingList.sort((a, b) => a.dueTime - b.dueTime);

    return {
      dueList,
      upcomingList,
      masteredList
    };
  }, [dsaRevisions, allProblems]);

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

      {/* Spaced Repetition Revision Control Panel */}
      <section className="dsa-revision-panel">
        <div className="dsa-revision-header">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-indigo-400 animate-spin-slow" size={24} />
            <h2 className="dsa-revision-title">Spaced Repetition Queue</h2>
          </div>
          <p className="dsa-revision-subtitle">
            Revise finished questions at spaced intervals: <strong>1d &rarr; 3d &rarr; 5d &rarr; 8d &rarr; 13d</strong> spacing.
          </p>
        </div>

        <div className="dsa-revision-tabs-bar">
          <div className="dsa-revision-tabs">
            <button 
              className={`dsa-revision-tab ${activeRevTab === "due" ? "active" : ""}`}
              onClick={() => setActiveRevTab("due")}
            >
              <Clock size={14} className="mr-1 inline animate-pulse" />
              Due Now ({revisionStats.dueList.length})
            </button>
            <button 
              className={`dsa-revision-tab ${activeRevTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveRevTab("upcoming")}
            >
              <Calendar size={14} className="mr-1 inline" />
              Upcoming ({revisionStats.upcomingList.length})
            </button>
            <button 
              className={`dsa-revision-tab ${activeRevTab === "mastered" ? "active" : ""}`}
              onClick={() => setActiveRevTab("mastered")}
            >
              <Award size={14} className="mr-1 inline" />
              Mastered ({revisionStats.masteredList.length})
            </button>
          </div>
        </div>

        <div className="dsa-revision-content">
          {activeRevTab === "due" && (
            <>
              {revisionStats.dueList.length === 0 ? (
                <div className="dsa-rev-empty">
                  <CheckCircle2 className="text-emerald-500 w-8 h-8 mb-2" />
                  <p>All caught up! No questions due for revision right now.</p>
                </div>
              ) : (
                <div className="dsa-revision-grid">
                  {revisionStats.dueList.map(({ problem, rev, dueLabel }) => (
                    <div key={problem.id} className="dsa-revision-card overdue">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{problem.id}</span>
                        <span className="dsa-rev-badge badge-due">{dueLabel}</span>
                      </div>
                      <h3>{problem.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-slate-400 font-bold">Stage {rev.stage}/5</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`dsa-rev-progress-dot ${i <= rev.stage ? "active" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <div className="dsa-rev-actions">
                        {problem.lc && (
                          <a href={`https://leetcode.com/problems/${problem.lc}`} target="_blank" rel="noreferrer" className="dsa-rev-btn-secondary">
                            LeetCode
                          </a>
                        )}
                        <button 
                          className="dsa-rev-btn-primary"
                          onClick={() => markAsRevised(problem.id)}
                        >
                          Mark Revised
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeRevTab === "upcoming" && (
            <>
              {revisionStats.upcomingList.length === 0 ? (
                <div className="dsa-rev-empty">
                  <Calendar className="text-slate-600 w-8 h-8 mb-2" />
                  <p>No upcoming revisions scheduled. Complete some tasks below to queue them.</p>
                </div>
              ) : (
                <div className="dsa-revision-grid">
                  {revisionStats.upcomingList.map(({ problem, rev, dueLabel }) => (
                    <div key={problem.id} className="dsa-revision-card">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{problem.id}</span>
                        <span className="dsa-rev-badge badge-upcoming">{dueLabel}</span>
                      </div>
                      <h3>{problem.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-slate-400 font-bold">Stage {rev.stage}/5</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`dsa-rev-progress-dot ${i <= rev.stage ? "active" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <div className="dsa-rev-actions">
                        {problem.lc && (
                          <a href={`https://leetcode.com/problems/${problem.lc}`} target="_blank" rel="noreferrer" className="dsa-rev-btn-secondary w-full text-center">
                            LeetCode
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeRevTab === "mastered" && (
            <>
              {revisionStats.masteredList.length === 0 ? (
                <div className="dsa-rev-empty">
                  <Award className="text-slate-600 w-8 h-8 mb-2" />
                  <p>No mastered questions yet. Finish all 5 stages of spaced repetition to master a topic.</p>
                </div>
              ) : (
                <div className="dsa-revision-grid">
                  {revisionStats.masteredList.map(({ problem }) => (
                    <div key={problem.id} className="dsa-revision-card mastered">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{problem.id}</span>
                        <span className="dsa-rev-badge badge-mastered">Mastered</span>
                      </div>
                      <h3>{problem.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-emerald-400 font-bold">Completed all stages</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="dsa-rev-progress-dot active mastered" />
                          ))}
                        </div>
                      </div>
                      <div className="dsa-rev-actions">
                        {problem.lc && (
                          <a href={`https://leetcode.com/problems/${problem.lc}`} target="_blank" rel="noreferrer" className="dsa-rev-btn-secondary w-full text-center">
                            LeetCode
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
