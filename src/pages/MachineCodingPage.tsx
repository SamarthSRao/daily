import { useState, useEffect, useCallback, useMemo } from "react";
import catalogImport from "../data/machineCoding.json";
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
  Database,
  Server,
  Calendar,
  RefreshCw,
  Award,
  Clock,
  Layers,
  ExternalLink,
  Code2,
  Boxes,
  Network,
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../styles/DsaPremium.css";

type Kind = "mc" | "lld" | "hld";

interface CatalogItem {
  id: string;
  kind: Kind;
  company: string;
  title: string;
  stack?: string;
  level?: string;
  mechanics?: string;
  variant?: string;
  entities?: string;
  invariants?: string;
  patterns?: string;
  scope?: string;
  constraints?: string;
}

interface CompanyMeta {
  id: string;
  name: string;
  focus: string;
}

interface Reference {
  title: string;
  site: string;
  url: string;
}

interface Catalog {
  companies: CompanyMeta[];
  items: CatalogItem[];
  references: Reference[];
}

interface RevisionState {
  itemId: string;
  completedAt: string;
  stage: number;
  lastRevisedAt: string | null;
}

const catalog = catalogImport as Catalog;
const REVISION_INTERVALS = [1, 3, 5, 8, 13];
const KIND_TABS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mc", label: "Machine Coding" },
  { id: "lld", label: "LLD" },
  { id: "hld", label: "HLD" },
];
const LEVELS = ["All", "Basic", "Medium", "Advanced"];
const KIND_LABEL: Record<Kind, string> = {
  mc: "MC",
  lld: "LLD",
  hld: "HLD",
};

const getCompanyIcon = (company: string) => {
  switch (company.toLowerCase()) {
    case "uber":
      return <Rocket className="w-5 h-5" />;
    case "stripe":
      return <Globe className="w-5 h-5" />;
    case "razorpay":
      return <Building2 className="w-5 h-5" />;
    case "flipkart":
      return <Zap className="w-5 h-5" />;
    case "databricks":
      return <Database className="w-5 h-5" />;
    case "snowflake":
      return <Server className="w-5 h-5" />;
    case "pierre":
      return <Code2 className="w-5 h-5" />;
    case "tml":
      return <Brain className="w-5 h-5" />;
    default:
      return <Library className="w-5 h-5" />;
  }
};

const companyName = (id: string) =>
  catalog.companies.find((c) => c.id === id)?.name || id;

export default function MachineCodingPage() {
  const [activeKind, setActiveKind] = useState<"all" | Kind>("all");
  const [activeCompany, setActiveCompany] = useState("all");
  const [activeLevel, setActiveLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [revisions, setRevisions] = useState<Record<string, RevisionState>>({});
  const [activeRevTab, setActiveRevTab] = useState<"due" | "upcoming" | "mastered">("due");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadState("properrr-machine-coding", {});
      const revData = await loadState("properrr-machine-coding-revision", {});
      setCompleted(data);
      setRevisions(revData || {});
    };
    fetchData();
  }, []);

  const toggleComplete = useCallback((itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const taskId = `mc-${itemId}`;

    setCompleted((prevCompleted) => {
      const isNowCompleted = !prevCompleted[taskId];
      const nextCompleted = { ...prevCompleted, [taskId]: isNowCompleted };
      saveState("properrr-machine-coding", nextCompleted);

      setRevisions((prevRevisions) => {
        const nextRevisions = { ...prevRevisions };
        if (isNowCompleted) {
          nextRevisions[itemId] = {
            itemId,
            completedAt: new Date().toISOString(),
            stage: 0,
            lastRevisedAt: null,
          };
        } else {
          delete nextRevisions[itemId];
        }
        saveState("properrr-machine-coding-revision", nextRevisions);
        return nextRevisions;
      });

      return nextCompleted;
    });
  }, []);

  const markAsRevised = useCallback((itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRevisions((prev) => {
      const current = prev[itemId];
      if (!current) return prev;

      const nextStage = Math.min(current.stage + 1, 5);
      const updated: RevisionState = {
        ...current,
        stage: nextStage,
        lastRevisedAt: new Date().toISOString(),
      };
      const next = { ...prev, [itemId]: updated };
      saveState("properrr-machine-coding-revision", next);
      return next;
    });
  }, []);

  const showLevelChips = activeKind === "all" || activeKind === "mc";

  const filteredItems = useMemo(() => {
    return catalog.items.filter((item) => {
      if (activeKind !== "all" && item.kind !== activeKind) return false;
      if (activeCompany !== "all" && item.company !== activeCompany) return false;
      if (showLevelChips && activeLevel !== "All") {
        if (item.kind !== "mc" || item.level !== activeLevel) return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const hay = [
        item.id,
        item.title,
        item.stack,
        item.level,
        item.mechanics,
        item.variant,
        item.entities,
        item.invariants,
        item.patterns,
        item.scope,
        item.constraints,
        item.company,
        companyName(item.company),
        KIND_LABEL[item.kind],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [activeKind, activeCompany, activeLevel, searchQuery, showLevelChips]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CatalogItem[]> = {};
    filteredItems.forEach((item) => {
      const key = companyName(item.company);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [filteredItems]);

  const stats = useMemo(() => {
    const total = filteredItems.length;
    const done = filteredItems.filter((p) => completed[`mc-${p.id}`]).length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, completed: done, percentage };
  }, [filteredItems, completed]);

  const revisionStats = useMemo(() => {
    const nowTime = new Date().getTime();
    const dueList: { item: CatalogItem; rev: RevisionState; dueTime: number; dueLabel: string }[] = [];
    const upcomingList: { item: CatalogItem; rev: RevisionState; dueTime: number; dueLabel: string }[] = [];
    const masteredList: { item: CatalogItem; rev: RevisionState }[] = [];
    const itemMap = new Map(catalog.items.map((p) => [p.id, p]));

    Object.entries(revisions).forEach(([id, rev]) => {
      const item = itemMap.get(id);
      if (!item) return;
      if (rev.stage >= 5) {
        masteredList.push({ item, rev });
        return;
      }
      const baseDate = rev.lastRevisedAt ? new Date(rev.lastRevisedAt) : new Date(rev.completedAt);
      const interval = REVISION_INTERVALS[rev.stage] || 0;
      const dueDate = new Date(baseDate.getTime() + interval * 24 * 60 * 60 * 1000);
      const dueTime = dueDate.getTime();
      const diffMs = dueTime - nowTime;
      if (diffMs <= 0) {
        const overdueDays = Math.floor(Math.abs(diffMs) / (24 * 60 * 60 * 1000));
        dueList.push({
          item,
          rev,
          dueTime,
          dueLabel: overdueDays === 0 ? "Due today" : `Overdue by ${overdueDays}d`,
        });
      } else {
        const upcomingDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
        upcomingList.push({
          item,
          rev,
          dueTime,
          dueLabel: upcomingDays === 1 ? "Due tomorrow" : `Due in ${upcomingDays}d`,
        });
      }
    });

    dueList.sort((a, b) => a.dueTime - b.dueTime);
    upcomingList.sort((a, b) => a.dueTime - b.dueTime);
    return { dueList, upcomingList, masteredList };
  }, [revisions]);

  const activeCompanyMeta = catalog.companies.find((c) => c.id === activeCompany);

  return (
    <div className={`dsa-page-container active-company-${activeCompany}`}>
      <header className="dsa-header-premium">
        <h1 className="dsa-title-premium">Machine Coding</h1>
        <p className="dsa-subtitle-premium">
          Live coding, LLD, and HLD catalogs across Uber, Stripe, Razorpay, Flipkart, Databricks, Snowflake, Pierre, and Thinking Machines Lab.
        </p>

        <div className="dsa-search-wrap">
          <Search className="dsa-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search id, title, stack, invariants, patterns..."
            className="dsa-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <nav className="level-tabs">
          {KIND_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`level-tab ${activeKind === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveKind(tab.id);
                if (tab.id === "lld" || tab.id === "hld") setActiveLevel("All");
              }}
            >
              <div className="flex items-center gap-2">
                {tab.id === "mc" ? <Code2 className="w-4 h-4" /> : tab.id === "lld" ? <Boxes className="w-4 h-4" /> : tab.id === "hld" ? <Network className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <nav className="level-tabs">
          <button
            className={`level-tab ${activeCompany === "all" ? "active" : ""}`}
            onClick={() => setActiveCompany("all")}
          >
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5" />
              <span>All</span>
            </div>
          </button>
          {catalog.companies.map((co) => (
            <button
              key={co.id}
              className={`level-tab ${activeCompany === co.id ? "active" : ""}`}
              onClick={() => setActiveCompany(co.id)}
            >
              <div className="flex items-center gap-2">
                {getCompanyIcon(co.id)}
                <span>{co.name}</span>
              </div>
            </button>
          ))}
        </nav>

        {showLevelChips && (
          <nav className="level-tabs">
            {LEVELS.map((level) => (
              <button
                key={level}
                className={`level-tab ${activeLevel === level ? "active" : ""}`}
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </button>
            ))}
          </nav>
        )}

        {activeCompanyMeta && (
          <p className="dsa-subtitle-premium" style={{ marginTop: 0 }}>
            {activeCompanyMeta.focus}
          </p>
        )}

        <div className="dsa-progress-summary">
          <div className="progress-info">
            <div className="progress-label-wrap">
              <span className="font-bold">
                {activeCompany === "all" ? "Overall Progress" : `${companyName(activeCompany)} Readiness`}
              </span>
              <span className="progress-percentage">{stats.percentage}% Complete</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.percentage}%` }} />
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-2xl font-black">{stats.completed}</span>
            <span className="text-sm text-slate-500 font-bold ml-1">/ {stats.total} Tasks</span>
          </div>
        </div>
      </header>

      <section className="dsa-revision-panel">
        <div className="dsa-revision-header">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-indigo-400 animate-spin-slow" size={24} />
            <h2 className="dsa-revision-title">Spaced Repetition Queue</h2>
          </div>
          <p className="dsa-revision-subtitle">
            Revise finished items at spaced intervals: <strong>1d &rarr; 3d &rarr; 5d &rarr; 8d &rarr; 13d</strong> spacing.
          </p>
        </div>

        <div className="dsa-revision-tabs-bar">
          <div className="dsa-revision-tabs">
            <button className={`dsa-revision-tab ${activeRevTab === "due" ? "active" : ""}`} onClick={() => setActiveRevTab("due")}>
              <Clock size={14} className="mr-1 inline animate-pulse" />
              Due Now ({revisionStats.dueList.length})
            </button>
            <button className={`dsa-revision-tab ${activeRevTab === "upcoming" ? "active" : ""}`} onClick={() => setActiveRevTab("upcoming")}>
              <Calendar size={14} className="mr-1 inline" />
              Upcoming ({revisionStats.upcomingList.length})
            </button>
            <button className={`dsa-revision-tab ${activeRevTab === "mastered" ? "active" : ""}`} onClick={() => setActiveRevTab("mastered")}>
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
                  <p>All caught up! No items due for revision right now.</p>
                </div>
              ) : (
                <div className="dsa-revision-grid">
                  {revisionStats.dueList.map(({ item, rev, dueLabel }) => (
                    <div key={item.id} className="dsa-revision-card overdue">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{item.id}</span>
                        <span className="dsa-rev-badge badge-due">{dueLabel}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-slate-400 font-bold">Stage {rev.stage}/5</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`dsa-rev-progress-dot ${i <= rev.stage ? "active" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <div className="dsa-rev-actions">
                        <button className="dsa-rev-btn-primary" onClick={() => markAsRevised(item.id)}>
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
                  {revisionStats.upcomingList.map(({ item, rev, dueLabel }) => (
                    <div key={item.id} className="dsa-revision-card">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{item.id}</span>
                        <span className="dsa-rev-badge badge-upcoming">{dueLabel}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-slate-400 font-bold">Stage {rev.stage}/5</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className={`dsa-rev-progress-dot ${i <= rev.stage ? "active" : ""}`} />
                          ))}
                        </div>
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
                  <p>No mastered items yet. Finish all 5 stages of spaced repetition to master a topic.</p>
                </div>
              ) : (
                <div className="dsa-revision-grid">
                  {revisionStats.masteredList.map(({ item }) => (
                    <div key={item.id} className="dsa-revision-card mastered">
                      <div className="dsa-rev-card-top">
                        <span className="dsa-id-badge">{item.id}</span>
                        <span className="dsa-rev-badge badge-mastered">Mastered</span>
                      </div>
                      <h3>{item.title}</h3>
                      <div className="dsa-rev-progress">
                        <span className="text-xs text-emerald-400 font-bold">Completed all stages</span>
                        <div className="dsa-rev-progress-dots">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i} className="dsa-rev-progress-dot active mastered" />
                          ))}
                        </div>
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
        {Object.entries(groupedItems).map(([clusterName, items]) => (
          <div key={clusterName} style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "20px",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {clusterName}
            </h2>
            <div className="dsa-problems-grid" style={{ paddingBottom: "0" }}>
              {items.map((item) => {
                const taskId = `mc-${item.id}`;
                const isDone = !!completed[taskId];
                const isExpanded = expandedId === item.id;
                const revision = revisions[item.id];

                return (
                  <div
                    key={item.id}
                    className={`dsa-problem-card ${isDone ? "completed" : ""}`}
                    onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                  >
                    <div className="dsa-card-header">
                      <span className="dsa-id-badge">{item.id}</span>
                      <button className="bg-transparent border-none cursor-pointer" onClick={(e) => toggleComplete(item.id, e)}>
                        {isDone ? (
                          <CheckCircle2 className="dsa-status-icon text-emerald-500" />
                        ) : (
                          <Circle className="dsa-status-icon text-slate-600" />
                        )}
                      </button>
                    </div>

                    <div className="dsa-card-body">
                      <h3>{item.title}</h3>
                      <div className="dsa-tags">
                        <span className="dsa-tag pattern">{KIND_LABEL[item.kind]}</span>
                        {item.level && (
                          <span
                            className="dsa-tag font-bold text-xs px-2 py-0.5 rounded-full border border-current"
                            style={{
                              color: item.level === "Basic" ? "#4ade80" : item.level === "Medium" ? "#fbbf24" : "#f87171",
                              borderColor: item.level === "Basic" ? "#4ade8055" : item.level === "Medium" ? "#fbbf2455" : "#f8717155",
                              backgroundColor: item.level === "Basic" ? "#4ade8011" : item.level === "Medium" ? "#fbbf2411" : "#f8717111",
                            }}
                          >
                            {item.level}
                          </span>
                        )}
                        {item.stack && (
                          <span className="dsa-tag company">
                            <Zap size={10} className="mr-1 inline" />
                            {item.stack}
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
                              <span
                                key={i}
                                className={`dsa-rev-progress-dot ${i <= revision.stage ? "active" : ""} ${revision.stage >= 5 ? "mastered" : ""}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="dsa-expansion" onClick={(e) => e.stopPropagation()}>
                        {item.mechanics && (
                          <div>
                            <span className="dsa-sub-title">First-Principles Mechanics</span>
                            <p className="dsa-info-text">{item.mechanics}</p>
                          </div>
                        )}
                        {item.variant && (
                          <div>
                            <span className="dsa-sub-title">Interview Variant</span>
                            <p className="dsa-info-text">{item.variant}</p>
                          </div>
                        )}
                        {item.entities && (
                          <div>
                            <span className="dsa-sub-title">Domain Entities</span>
                            <p className="dsa-info-text">{item.entities}</p>
                          </div>
                        )}
                        {item.invariants && (
                          <div>
                            <span className="dsa-sub-title">Key Invariants</span>
                            <p className="dsa-info-text">{item.invariants}</p>
                          </div>
                        )}
                        {item.patterns && (
                          <div>
                            <span className="dsa-sub-title">Design Patterns</span>
                            <p className="dsa-info-text">{item.patterns}</p>
                          </div>
                        )}
                        {item.scope && (
                          <div>
                            <span className="dsa-sub-title">Functional Scope</span>
                            <p className="dsa-info-text">{item.scope}</p>
                          </div>
                        )}
                        {item.constraints && (
                          <div>
                            <span className="dsa-sub-title">Scale & Constraints</span>
                            <p className="dsa-info-text">{item.constraints}</p>
                          </div>
                        )}
                        {revision && revision.stage < 5 && (
                          <button className="dsa-rev-btn-primary" onClick={() => markAsRevised(item.id)}>
                            Mark Revised ({revision.stage}/5)
                          </button>
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

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No matches found</h3>
          <p className="text-slate-600">Try adjusting your search, company, or type filter</p>
        </div>
      )}

      <section className="mc-references">
        <h2 className="mc-references-title">References</h2>
        <p className="mc-references-subtitle">Source writeups, Discuss threads, and product docs for this catalog. Separate from the problem list.</p>
        <ul className="mc-references-list">
          {catalog.references.map((ref) => (
            <li key={`${ref.site}-${ref.title}`}>
              <a href={ref.url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} />
                <span className="mc-ref-title">{ref.title}</span>
                <span className="mc-ref-site">{ref.site}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
