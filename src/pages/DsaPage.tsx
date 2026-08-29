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
  Clock,
  Layers,
  Palette,
  Link2,
  Plus,
  Trash2,
  ExternalLink
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import { enrichParsedLink, getProblemLinks, parseDsaLinks } from "../lib/dsaLinks";
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
  cf?: string;
  url?: string;
  source?: "leetcode" | "codeforces";
  custom?: boolean;
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

const COMPANIES = ["All", "Custom", "Uber", "DoorDash", "Databricks", "Razorpay", "Stripe", "Rakuten", "PlanetScale", "Rippling", "Adobe"];
const REVISION_INTERVALS = [1, 3, 5, 8, 13]; // Fibonacci spaced repetition intervals
const CUSTOM_STORAGE_KEY = "properrr-dsa-custom";
const CUSTOM_CLUSTER = "My Linked Problems";

function ProblemSourceLinks({ problem, className = "" }: { problem: Problem; className?: string }) {
  const links = getProblemLinks(problem);
  if (links.length === 0) return null;
  return (
    <div className={`dsa-source-links ${className}`.trim()}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`dsa-source-link source-${link.label.toLowerCase()}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={12} />
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function DsaPage() {
  const [activeCompany, setActiveCompany] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedDsa, setCompletedDsa] = useState<Record<string, boolean>>({});
  const [dsaRevisions, setDsaRevisions] = useState<Record<string, RevisionState>>({});
  const [activeRevTab, setActiveRevTab] = useState<"due" | "upcoming" | "mastered">("due");
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);
  const [customProblems, setCustomProblems] = useState<Problem[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkPattern, setLinkPattern] = useState("");
  const [enrollRevision, setEnrollRevision] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [linkStatus, setLinkStatus] = useState("");
  const [isAddingLinks, setIsAddingLinks] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-dsa", {});
      const revData = await loadState("properrr-dsa-revision", {});
      const custom = await loadState(CUSTOM_STORAGE_KEY, []);
      setCompletedDsa(data);
      setDsaRevisions(revData || {});
      setCustomProblems(Array.isArray(custom) ? custom : []);
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

  const parsedLinkPreview = useMemo(() => parseDsaLinks(linkInput), [linkInput]);

  const addLinkedProblems = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    setLinkStatus("");

    const { parsed, invalid } = parseDsaLinks(linkInput);
    if (parsed.length === 0) {
      setLinkError(invalid.length
        ? "Could not parse those URLs. Use a LeetCode /problems/... or Codeforces /problemset/problem/... link."
        : "Paste at least one LeetCode or Codeforces problem URL.");
      return;
    }

    setIsAddingLinks(true);
    try {
      const enriched = await Promise.all(parsed.map((item) => enrichParsedLink(item)));
      const bankByLc = new Map<string, Problem>();
      dsaData.forEach((level) => {
        level.problems.forEach((problem) => {
          if (problem.lc) bankByLc.set(problem.lc, problem);
        });
      });

      const existingCustomIds = new Set(customProblems.map((p) => p.id));
      const toAdd: Problem[] = [];
      const skipped: string[] = [];

      for (const item of enriched) {
        if (item.lc && bankByLc.has(item.lc)) {
          const existing = bankByLc.get(item.lc)!;
          skipped.push(`${item.title} is already in the bank as ${existing.id}`);
          continue;
        }
        if (existingCustomIds.has(item.id) || toAdd.some((p) => p.id === item.id)) {
          skipped.push(`${item.title} is already on your linked list`);
          continue;
        }

        const title = enriched.length === 1 && linkTitle.trim() ? linkTitle.trim() : item.title;
        toAdd.push({
          id: item.id,
          title,
          pattern: linkPattern.trim() || (item.source === "leetcode" ? "LeetCode" : "Codeforces"),
          cluster: CUSTOM_CLUSTER,
          co: ["custom"],
          custom: true,
          source: item.source,
          url: item.url,
          lc: item.lc,
          cf: item.cf,
          note: "Linked problem. Open the original statement, solve it, then use the 5-stage spaced repetition queue.",
        });
      }

      if (toAdd.length === 0) {
        setLinkError(skipped.join(". ") || "Nothing new to add.");
        return;
      }

      const nextCustom = [...toAdd, ...customProblems];
      setCustomProblems(nextCustom);
      saveState(CUSTOM_STORAGE_KEY, nextCustom);

      if (enrollRevision) {
        const now = new Date().toISOString();
        setCompletedDsa((prev) => {
          const next = { ...prev };
          toAdd.forEach((problem) => {
            next[`dsa-${problem.id}`] = true;
          });
          saveState("properrr-dsa", next);
          return next;
        });
        setDsaRevisions((prev) => {
          const next = { ...prev };
          toAdd.forEach((problem) => {
            if (!next[problem.id]) {
              next[problem.id] = {
                problemId: problem.id,
                completedAt: now,
                stage: 0,
                lastRevisedAt: null,
              };
            }
          });
          saveState("properrr-dsa-revision", next);
          return next;
        });
      }

      setLinkInput("");
      setLinkTitle("");
      setLinkPattern("");
      setActiveCompany("Custom");
      const addedLabel = toAdd.map((p) => p.title).join(", ");
      const skipNote = skipped.length ? ` Skipped: ${skipped.join("; ")}.` : "";
      setLinkStatus(`Added ${addedLabel} to your list${enrollRevision ? " and queued 5 spaced revisions" : ""}.${skipNote}`);
    } finally {
      setIsAddingLinks(false);
    }
  }, [linkInput, linkTitle, linkPattern, customProblems, enrollRevision]);

  const deleteCustomProblem = useCallback((problemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCustom = customProblems.filter((p) => p.id !== problemId);
    setCustomProblems(nextCustom);
    saveState(CUSTOM_STORAGE_KEY, nextCustom);

    setCompletedDsa((prev) => {
      const next = { ...prev };
      delete next[`dsa-${problemId}`];
      saveState("properrr-dsa", next);
      return next;
    });
    setDsaRevisions((prev) => {
      const next = { ...prev };
      delete next[problemId];
      saveState("properrr-dsa-revision", next);
      return next;
    });
  }, [customProblems]);

  const allProblems = useMemo(() => {
    const map = new Map<string, Problem>();
    customProblems.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    dsaData.forEach(level => {
      level.problems.forEach(p => {
        if (!map.has(p.id)) {
          map.set(p.id, p);
        }
      });
    });
    return Array.from(map.values());
  }, [customProblems]);

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
        (p.url || "").toLowerCase().includes(query) ||
        (p.cf || "").toLowerCase().includes(query) ||
        (p.source || "").toLowerCase().includes(query) ||
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
    if (!groups[CUSTOM_CLUSTER]) return groups;
    const ordered: Record<string, Problem[]> = { [CUSTOM_CLUSTER]: groups[CUSTOM_CLUSTER] };
    Object.keys(groups).forEach((key) => {
      if (key !== CUSTOM_CLUSTER) ordered[key] = groups[key];
    });
    return ordered;
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
      case 'rippling': return <Layers className="w-5 h-5" />;
      case 'adobe': return <Palette className="w-5 h-5" />;
      case 'custom': return <Link2 className="w-5 h-5" />;
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

        <form className="dsa-add-link-panel" onSubmit={addLinkedProblems}>
          <div className="dsa-add-link-header">
            <Link2 size={18} />
            <div>
              <h2>Add LeetCode &amp; Codeforces links</h2>
              <p>Paste problem URLs. They render below, join your list, and can enroll in the 5-stage revision queue.</p>
            </div>
          </div>
          <textarea
            className="dsa-add-link-input"
            rows={3}
            value={linkInput}
            onChange={(e) => {
              setLinkInput(e.target.value);
              setLinkError("");
              setLinkStatus("");
            }}
            placeholder={"https://leetcode.com/problems/two-sum/\nhttps://codeforces.com/problemset/problem/4/A"}
          />
          <div className="dsa-add-link-row">
            <input
              type="text"
              className="dsa-add-link-field"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Optional title (single URL)"
            />
            <input
              type="text"
              className="dsa-add-link-field"
              value={linkPattern}
              onChange={(e) => setLinkPattern(e.target.value)}
              placeholder="Optional pattern (e.g. DFS, greedy)"
            />
          </div>
          <label className="dsa-add-link-enroll">
            <input
              type="checkbox"
              checked={enrollRevision}
              onChange={(e) => setEnrollRevision(e.target.checked)}
            />
            Enroll in 5-stage spaced repetition (1d → 3d → 5d → 8d → 13d)
          </label>
          {parsedLinkPreview.parsed.length > 0 && (
            <div className="dsa-link-preview-grid">
              {parsedLinkPreview.parsed.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`dsa-link-preview-card source-${item.source}`}
                >
                  <span className={`dsa-tag source-${item.source}`}>{item.source === "leetcode" ? "LeetCode" : "Codeforces"}</span>
                  <strong>{item.title}</strong>
                  <span className="dsa-link-preview-url">{item.url}</span>
                </a>
              ))}
            </div>
          )}
          {parsedLinkPreview.invalid.length > 0 && (
            <p className="dsa-add-link-error">Unrecognized: {parsedLinkPreview.invalid.join(", ")}</p>
          )}
          {linkError && <p className="dsa-add-link-error">{linkError}</p>}
          {linkStatus && <p className="dsa-add-link-status">{linkStatus}</p>}
          <button type="submit" className="dsa-add-link-submit" disabled={isAddingLinks || parsedLinkPreview.parsed.length === 0}>
            <Plus size={16} />
            {isAddingLinks ? "Adding..." : "Add to list"}
          </button>
        </form>

        <nav className="level-tabs">
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
                        <ProblemSourceLinks problem={problem} />
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
                        <ProblemSourceLinks problem={problem} />
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
                        <ProblemSourceLinks problem={problem} />
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
                const revision = dsaRevisions[prob.id];
                
                const combinedCompany = Array.isArray(prob.co) 
                  ? prob.co.join(', ') 
                  : (prob.co || (Array.isArray(prob.company) ? prob.company.join(', ') : prob.company));

                return (
                  <div 
                    key={prob.id} 
                    className={`dsa-problem-card ${isDone ? "completed" : ""} ${prob.custom ? "custom-linked" : ""}`}
                    onClick={() => toggleExpand(prob.id)}
                  >
                    <div className="dsa-card-header">
                      <span className="dsa-id-badge">{prob.custom ? (prob.source === "codeforces" ? "CF" : "LC") : prob.id}</span>
                      <div className="flex items-center gap-2">
                        {prob.custom && (
                          <button
                            className="dsa-delete-link"
                            title="Remove linked problem"
                            onClick={(e) => deleteCustomProblem(prob.id, e)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
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
                    </div>

                    <div className="dsa-card-body">
                      <h3>{prob.title}</h3>
                      <div className="dsa-tags">
                        {prob.source && (
                          <span className={`dsa-tag source-${prob.source}`}>
                            {prob.source === "leetcode" ? "LeetCode" : "Codeforces"}
                          </span>
                        )}
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
                        {combinedCompany && combinedCompany.toLowerCase() !== "custom" && (
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
                      {revision && (
                        <div className="dsa-rev-progress dsa-card-rev">
                          <span className="text-xs text-slate-400 font-bold">
                            {revision.stage >= 5 ? "Mastered" : `Revision ${revision.stage}/5`}
                          </span>
                          <div className="dsa-rev-progress-dots">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span key={i} className={`dsa-rev-progress-dot ${i <= revision.stage ? "active" : ""} ${revision.stage >= 5 ? "mastered" : ""}`} />
                            ))}
                          </div>
                        </div>
                      )}
                      <ProblemSourceLinks problem={prob} />
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

                        {prob.url && (
                          <div>
                            <span className="dsa-sub-title">Original problem</span>
                            <a href={prob.url} target="_blank" rel="noreferrer" className="dsa-info-text dsa-original-url">
                              {prob.url}
                            </a>
                          </div>
                        )}

                        {revision && revision.stage < 5 && (
                          <button
                            className="dsa-rev-btn-primary"
                            onClick={() => markAsRevised(prob.id)}
                          >
                            Mark Revised ({revision.stage}/5)
                          </button>
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
