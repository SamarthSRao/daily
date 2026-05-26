import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BookOpen,
  RefreshCw,
  Play,
  ArrowRight,
  History,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { saveState, loadState } from "../lib/redis";

interface RunLog {
  date: string;
  result: "pass" | "fail";
  activeRecall?: string;
  mistakeThisTime?: string;
  preventativeAction?: string;
}

interface WeakLink {
  id: string;
  title: string;
  context: string;
  myMistake: string;
  correctedLogic: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
  nextReviewDate: string; // YYYY-MM-DD
  intervalDays: number;
  streak: number;
  history: RunLog[];
}

const STORAGE_KEY = "properrr-weakest-links";

// Helper to format date as YYYY-MM-DD local time
const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDays = (dateStr: string, days: number): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const INTERVALS = [1, 3, 7, 14, 30, 60, 90];

export default function WeakestLinkPage() {
  const [weakLinks, setWeakLinks] = useState<WeakLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formContext, setFormContext] = useState("");
  const [formMyMistake, setFormMyMistake] = useState("");
  const [formCorrectedLogic, setFormCorrectedLogic] = useState("");
  const [formCategory, setFormCategory] = useState("Systems");
  const [formPriority, setFormPriority] = useState<"Low" | "Medium" | "High">("High");

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All"); // All, Due, Pending, Mastered

  // Active Session states
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<WeakLink[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRecallText, setActiveRecallText] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mistakeThisTime, setMistakeThisTime] = useState("");
  const [preventativeAction, setPreventativeAction] = useState("");
  const [sessionStats, setSessionStats] = useState({ passed: 0, failed: 0 });

  // Load state on mount
  useEffect(() => {
    const fetchData = async () => {
      const saved = await loadState(STORAGE_KEY, []);
      setWeakLinks(saved || []);
    };
    fetchData();
  }, []);

  const todayStr = getLocalDateString();

  // Filtered weak links for the catalog
  const filteredLinks = useMemo(() => {
    return weakLinks.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        filterCategory === "All" || item.category === filterCategory;
      
      let matchesStatus = true;
      if (filterStatus === "Due") {
        matchesStatus = item.nextReviewDate <= todayStr;
      } else if (filterStatus === "Pending") {
        matchesStatus = item.nextReviewDate > todayStr && item.streak < 5;
      } else if (filterStatus === "Mastered") {
        matchesStatus = item.streak >= 5;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [weakLinks, searchQuery, filterCategory, filterStatus, todayStr]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(weakLinks.map((wl) => wl.category));
    return ["Systems", "DSA", "SQL", "General", ...Array.from(set).filter(c => !["Systems", "DSA", "SQL", "General"].includes(c))];
  }, [weakLinks]);

  // Stats calculations
  const stats = useMemo(() => {
    const total = weakLinks.length;
    const due = weakLinks.filter((wl) => wl.nextReviewDate <= todayStr).length;
    const mastered = weakLinks.filter((wl) => wl.streak >= 5).length;
    
    // Calculate daily streak
    const reviewDates = new Set<string>();
    weakLinks.forEach((wl) => {
      wl.history.forEach((h) => reviewDates.add(h.date));
    });
    
    let currentStreak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (reviewDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If they haven't reviewed today yet, check yesterday to keep streak alive
        if (currentStreak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = getLocalDateString(checkDate);
          if (reviewDates.has(yesterdayStr)) {
            currentStreak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    return { total, due, mastered, streak: currentStreak };
  }, [weakLinks, todayStr]);

  // Handle adding new weakness
  const handleAddWeakLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newItem: WeakLink = {
      id: "wl-" + Date.now(),
      title: formTitle.trim(),
      context: formContext.trim(),
      myMistake: formMyMistake.trim(),
      correctedLogic: formCorrectedLogic.trim(),
      category: formCategory.trim(),
      priority: formPriority,
      createdAt: new Date().toISOString(),
      nextReviewDate: todayStr, // review today
      intervalDays: 1,
      streak: 0,
      history: [],
    };

    const updated = [...weakLinks, newItem];
    setWeakLinks(updated);
    await saveState(STORAGE_KEY, updated);

    // Reset form
    setFormTitle("");
    setFormContext("");
    setFormMyMistake("");
    setFormCorrectedLogic("");
    setFormCategory("Systems");
    setFormPriority("High");
    setShowAddForm(false);
  };

  // Handle deleting a weakness
  const handleDeleteWeakLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this weak link?")) return;
    const updated = weakLinks.filter((wl) => wl.id !== id);
    setWeakLinks(updated);
    await saveState(STORAGE_KEY, updated);
  };

  // Start daily session
  const startSession = (specificItem?: WeakLink) => {
    const queue = specificItem
      ? [specificItem]
      : weakLinks.filter((wl) => wl.nextReviewDate <= todayStr);
    
    if (queue.length === 0) {
      alert("No review items due today!");
      return;
    }

    setSessionQueue(queue);
    setCurrentIndex(0);
    setActiveRecallText("");
    setIsRevealed(false);
    setFeedbackOpen(false);
    setMistakeThisTime("");
    setPreventativeAction("");
    setSessionStats({ passed: 0, failed: 0 });
    setSessionActive(true);
  };

  // Handle test response
  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleTestPass = async () => {
    const currentItem = sessionQueue[currentIndex];
    
    const newStreak = currentItem.streak + 1;
    const nextInterval = INTERVALS[Math.min(newStreak, INTERVALS.length - 1)];
    const nextReviewDate = addDays(todayStr, nextInterval);

    const log: RunLog = {
      date: todayStr,
      result: "pass",
      activeRecall: activeRecallText,
    };

    const updatedItem: WeakLink = {
      ...currentItem,
      streak: newStreak,
      intervalDays: nextInterval,
      nextReviewDate,
      history: [...currentItem.history, log],
    };

    const updatedLinks = weakLinks.map((wl) => (wl.id === currentItem.id ? updatedItem : wl));
    setWeakLinks(updatedLinks);
    await saveState(STORAGE_KEY, updatedLinks);

    setSessionStats(prev => ({ ...prev, passed: prev.passed + 1 }));
    nextOrFinish();
  };

  const handleTestFail = () => {
    setFeedbackOpen(true);
  };

  const submitFailFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentItem = sessionQueue[currentIndex];

    const log: RunLog = {
      date: todayStr,
      result: "fail",
      activeRecall: activeRecallText,
      mistakeThisTime: mistakeThisTime.trim(),
      preventativeAction: preventativeAction.trim(),
    };

    const updatedItem: WeakLink = {
      ...currentItem,
      streak: 0, // Reset streak on failure
      intervalDays: 1, // Repeat tomorrow
      nextReviewDate: addDays(todayStr, 1),
      history: [...currentItem.history, log],
    };

    const updatedLinks = weakLinks.map((wl) => (wl.id === currentItem.id ? updatedItem : wl));
    setWeakLinks(updatedLinks);
    await saveState(STORAGE_KEY, updatedLinks);

    setSessionStats(prev => ({ ...prev, failed: prev.failed + 1 }));
    
    // Reset feedback form
    setMistakeThisTime("");
    setPreventativeAction("");
    setFeedbackOpen(false);
    nextOrFinish();
  };

  const nextOrFinish = () => {
    if (currentIndex + 1 < sessionQueue.length) {
      setCurrentIndex(currentIndex + 1);
      setActiveRecallText("");
      setIsRevealed(false);
      setFeedbackOpen(false);
    } else {
      // Done with session
      setSessionActive(false);
      alert(`Session complete! Passed: ${sessionStats.passed + (feedbackOpen ? 0 : 1)}, Failed: ${sessionStats.failed + (feedbackOpen ? 1 : 0)}`);
    }
  };

  return (
    <div className="weak-link-container" style={{ padding: "24px", color: "var(--text-primary)", fontFamily: "Geist Sans, -apple-system, sans-serif" }}>
      <style>{`
        .weak-link-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .wl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .wl-title h1 {
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .wl-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }
        .wl-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .wl-stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 2px 2px 0px var(--border-color);
          transition: all 0.2s ease;
        }
        .wl-stat-card:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--border-color);
        }
        .wl-stat-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .wl-stat-value {
          font-size: 2rem;
          font-weight: 900;
          font-family: 'Geist Mono', monospace;
        }
        .wl-stat-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .btn-premium {
          background: var(--color-primary);
          color: #fff;
          border: 2px solid var(--border-color);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 3px 3px 0px var(--border-color);
          transition: all 0.15s ease;
        }
        .btn-premium:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px var(--border-color);
        }
        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 2px 2px 0px var(--border-color);
          transition: all 0.15s ease;
        }
        .btn-secondary:hover {
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0px var(--border-color);
        }
        .btn-danger-outline {
          background: transparent;
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-danger-outline:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .card-neo {
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 4px 4px 0px var(--border-color);
          margin-bottom: 24px;
        }
        .input-neo {
          width: 100%;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 10px 12px;
          font-family: inherit;
          font-weight: 600;
          background: transparent;
          color: inherit;
          box-sizing: border-box;
          margin-bottom: 16px;
        }
        .input-neo:focus {
          outline: none;
          background: rgba(0, 0, 0, 0.02);
        }
        .tag-pill {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 800;
          border: 1px solid var(--border-color);
          text-transform: uppercase;
        }
        .priority-high { background: #fee2e2; color: #991b1b; }
        .priority-medium { background: #fef3c7; color: #92400e; }
        .priority-low { background: #d1fae5; color: #065f46; }
        
        .session-panel {
          background: #fffdf5;
          border: 3px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 6px 6px 0px var(--border-color);
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
        }
        .session-progress {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 99px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .session-progress-bar {
          height: 100%;
          background: var(--color-success);
          transition: width 0.3s ease;
        }
        .compare-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 24px;
        }
        @media (max-width: 768px) {
          .compare-box { grid-template-columns: 1fr; }
        }
        .panel-side {
          background: #fff;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 2px 2px 0 var(--border-color);
        }
        .catalog-filters {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .catalog-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .catalog-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 16px;
        }
        .catalog-item-header:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        .history-timeline {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 2px dashed var(--border-color);
          padding-left: 16px;
          margin-left: 8px;
          margin-top: 16px;
        }
        .history-node {
          position: relative;
        }
        .history-node::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          background: #fff;
        }
        .history-node.pass::before {
          background: var(--color-success);
        }
        .history-node.fail::before {
          background: var(--color-danger);
        }
      `}</style>

      {/* Header */}
      <header className="wl-header">
        <div className="wl-title">
          <h1>
            <RefreshCw size={32} className="text-accent" style={{ animation: sessionActive ? "spin 4s linear infinite" : "none" }} />
            Weakest Link Cockpit
          </h1>
          <p className="wl-subtitle">Identify the feedback loop, correct understanding, and repeat.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {!sessionActive && stats.due > 0 && (
            <button className="btn-premium" onClick={() => startSession()}>
              <Play size={18} fill="currentColor" />
              Test Due Today ({stats.due})
            </button>
          )}
          <button className="btn-secondary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={18} />
            Register Weakness
          </button>
        </div>
      </header>

      {/* Session Active Runner */}
      {sessionActive && sessionQueue.length > 0 && (
        <div className="session-panel">
          <div className="session-progress">
            <div
              className="session-progress-bar"
              style={{ width: `${((currentIndex) / sessionQueue.length) * 100}%` }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700 }}>
            <span>ITEM {currentIndex + 1} OF {sessionQueue.length}</span>
            <span style={{ color: "var(--color-danger)" }}>
              STREAK: {sessionQueue[currentIndex].streak} 🔥
            </span>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              <span className={`tag-pill priority-${sessionQueue[currentIndex].priority.toLowerCase()}`}>
                {sessionQueue[currentIndex].priority}
              </span>
              <span className="tag-pill" style={{ background: "rgba(0,0,0,0.05)" }}>
                {sessionQueue[currentIndex].category}
              </span>
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "12px 0 8px 0" }}>
              {sessionQueue[currentIndex].title}
            </h2>
            {sessionQueue[currentIndex].context && (
              <p style={{ whiteSpace: "pre-wrap", color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.5, background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
                {sessionQueue[currentIndex].context}
              </p>
            )}
          </div>

          {/* User Active Recall Draft Space */}
          {!isRevealed && (
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.9rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Recall (Draft your understanding or code implementation):
              </label>
              <textarea
                className="input-neo"
                rows={6}
                placeholder="Actively retrieve the correct explanation/logic from memory. Type it here to make it count..."
                value={activeRecallText}
                onChange={(e) => setActiveRecallText(e.target.value)}
                style={{ resize: "vertical" }}
              />
              <button className="btn-premium" onClick={handleReveal}>
                Reveal Solution & Compare <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Reveal details and self grade */}
          {isRevealed && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div className="compare-box">
                <div className="panel-side" style={{ borderLeft: "4px solid var(--color-danger)" }}>
                  <h4 style={{ color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "8px" }}>
                    <AlertTriangle size={16} /> My Default Mistake / Trap
                  </h4>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {sessionQueue[currentIndex].myMistake}
                  </p>
                </div>
                <div className="panel-side" style={{ borderLeft: "4px solid var(--color-success)" }}>
                  <h4 style={{ color: "var(--color-success)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, textTransform: "uppercase", fontSize: "0.85rem", marginBottom: "8px" }}>
                    <CheckCircle size={16} /> Correct Understanding / Logic
                  </h4>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {sessionQueue[currentIndex].correctedLogic}
                  </p>
                </div>
              </div>

              {activeRecallText.trim() && (
                <div className="panel-side" style={{ marginTop: "16px", background: "rgba(0,0,0,0.01)" }}>
                  <h4 style={{ color: "var(--text-secondary)", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "8px" }}>
                    My Active Recall Draft
                  </h4>
                  <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", fontStyle: "italic", opacity: 0.9 }}>
                    "{activeRecallText}"
                  </p>
                </div>
              )}

              {/* Self-Grade Actions */}
              {!feedbackOpen && (
                <div style={{ display: "flex", gap: "16px", marginTop: "32px", borderTop: "2px solid var(--border-color)", paddingTop: "24px" }}>
                  <button
                    className="btn-secondary"
                    onClick={handleTestFail}
                    style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)", flex: 1, justifyContent: "center" }}
                  >
                    <XCircle size={18} />
                    I made a mistake / missed details
                  </button>
                  <button
                    className="btn-premium"
                    onClick={handleTestPass}
                    style={{ background: "var(--color-success)", borderColor: "var(--color-success)", flex: 1, justifyContent: "center" }}
                  >
                    <CheckCircle size={18} />
                    I got it completely right!
                  </button>
                </div>
              )}

              {/* Feedback Loop Questionnaire */}
              {feedbackOpen && (
                <form onSubmit={submitFailFeedback} style={{ marginTop: "32px", borderTop: "2px solid var(--border-color)", paddingTop: "24px", animation: "slideDown 0.3s ease" }}>
                  <h3 style={{ fontFamily: "Permanent Marker, cursive", fontSize: "1.3rem", color: "var(--color-danger)", marginBottom: "16px" }}>
                    🚨 Error Diagnostic & Feedback Loop
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>
                      1. WHAT DID I GET WRONG THIS TIME? (Analyze the gap)
                    </label>
                    <textarea
                      className="input-neo"
                      rows={3}
                      value={mistakeThisTime}
                      onChange={(e) => setMistakeThisTime(e.target.value)}
                      placeholder="e.g., I forgot to reset the buffer pointer before executing the write..."
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>
                      2. PREVENTATIVE ACTION (How will I avoid this next time?)
                    </label>
                    <textarea
                      className="input-neo"
                      rows={3}
                      value={preventativeAction}
                      onChange={(e) => setPreventativeAction(e.target.value)}
                      placeholder="e.g., Draw the array structure or physically write the state reset rule on paper first..."
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" className="btn-premium" style={{ background: "var(--color-danger)", borderColor: "var(--color-danger)" }}>
                      Log Error & Schedule for Tomorrow
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => setFeedbackOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats Section */}
      <section className="wl-stats-grid">
        <div className="wl-stat-card">
          <span className="wl-stat-title">Weakness Count</span>
          <span className="wl-stat-value">{stats.total}</span>
          <span className="wl-stat-desc">Registered items</span>
        </div>
        <div className="wl-stat-card" style={{ borderColor: stats.due > 0 ? "var(--color-warning)" : "var(--border-color)" }}>
          <span className="wl-stat-title">Due Today</span>
          <span className="wl-stat-value" style={{ color: stats.due > 0 ? "var(--color-warning)" : "inherit" }}>
            {stats.due}
          </span>
          <span className="wl-stat-desc">Awaiting testing</span>
        </div>
        <div className="wl-stat-card">
          <span className="wl-stat-title">Mastery Rate</span>
          <span className="wl-stat-value">{stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%</span>
          <span className="wl-stat-desc">{stats.mastered} mastered (streak &ge; 5)</span>
        </div>
        <div className="wl-stat-card" style={{ borderColor: stats.streak > 0 ? "var(--color-success)" : "var(--border-color)" }}>
          <span className="wl-stat-title">Feedback Streak</span>
          <span className="wl-stat-value" style={{ color: stats.streak > 0 ? "var(--color-success)" : "inherit" }}>
            {stats.streak} 🔥
          </span>
          <span className="wl-stat-desc">Days active in a row</span>
        </div>
      </section>

      {/* Add Weak Link Form */}
      {showAddForm && (
        <div className="card-neo" style={{ animation: "slideDown 0.25s ease" }}>
          <h2 style={{ fontFamily: "Permanent Marker, cursive", fontSize: "1.5rem", marginBottom: "20px", borderBottom: "2px solid var(--border-color)", paddingBottom: "8px" }}>
            REGISTER A NEW WEAKNESS
          </h2>
          <form onSubmit={handleAddWeakLink}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>Topic / Mistake Title</label>
                <input
                  type="text"
                  className="input-neo"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. LSM write path memtable flush lock"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>Category</label>
                <input
                  type="text"
                  className="input-neo"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Systems, DSA, SQL, Web"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>Priority</label>
                <select
                  className="input-neo"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px" }}>
                Context / Question Details (Optional details or test prompt)
              </label>
              <textarea
                className="input-neo"
                rows={3}
                value={formContext}
                onChange={(e) => setFormContext(e.target.value)}
                placeholder="What is the setup or context for testing this? Code snippets or questions welcome..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px", color: "var(--color-danger)" }}>
                  My Default Mistake / Mental Trap
                </label>
                <textarea
                  className="input-neo"
                  rows={4}
                  value={formMyMistake}
                  onChange={(e) => setFormMyMistake(e.target.value)}
                  placeholder="What is the mistake I usually make or the conceptual trap I fall into?"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "6px", color: "var(--color-success)" }}>
                  Corrected Understanding / Correct Logic
                </label>
                <textarea
                  className="input-neo"
                  rows={4}
                  value={formCorrectedLogic}
                  onChange={(e) => setFormCorrectedLogic(e.target.value)}
                  placeholder="What is the actual truth/logic that resolves this mistake?"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button type="submit" className="btn-premium">
                Save Weak Link
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog of Weaknesses */}
      <section className="card-neo">
        <h2 style={{ fontFamily: "Permanent Marker, cursive", fontSize: "1.5rem", marginBottom: "20px" }}>
          WEAKNESS CATALOG
        </h2>

        {/* Filters */}
        <div className="catalog-filters">
          <div style={{ display: "flex", alignItems: "center", border: "2px solid var(--border-color)", borderRadius: "8px", padding: "4px 8px", background: "#fff", flex: 1, minWidth: "200px" }}>
            <Search size={16} style={{ color: "var(--text-muted)", marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", outline: "none", width: "100%", fontSize: "0.85rem", fontWeight: 600 }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <select
              className="input-neo"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ marginBottom: 0, padding: "6px 12px", fontSize: "0.85rem" }}
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              className="input-neo"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ marginBottom: 0, padding: "6px 12px", fontSize: "0.85rem" }}
            >
              <option value="All">All Statuses</option>
              <option value="Due">Due Today</option>
              <option value="Pending">Pending Review</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>
        </div>

        {/* List of weaknesses */}
        {filteredLinks.length > 0 ? (
          <div className="catalog-list">
            {filteredLinks.map((wl) => {
              const isExpanded = expandedCard === wl.id;
              const isDue = wl.nextReviewDate <= todayStr;

              return (
                <div
                  key={wl.id}
                  style={{
                    border: "2px solid var(--border-color)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: isDue ? "#fffdf8" : "#fff",
                    boxShadow: isDue ? "3px 3px 0 var(--border-color)" : "2px 2px 0 var(--border-color)",
                  }}
                >
                  <div
                    className="catalog-item-header"
                    onClick={() => setExpandedCard(isExpanded ? null : wl.id)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className={`tag-pill priority-${wl.priority.toLowerCase()}`}>
                          {wl.priority}
                        </span>
                        <span className="tag-pill" style={{ background: "rgba(0,0,0,0.03)" }}>
                          {wl.category}
                        </span>
                        {isDue && (
                          <span className="tag-pill" style={{ background: "var(--color-warning)", color: "#fff", borderColor: "var(--color-warning)" }}>
                            Due
                          </span>
                        )}
                        {wl.streak >= 5 && (
                          <span className="tag-pill" style={{ background: "var(--color-success)", color: "#fff", borderColor: "var(--color-success)" }}>
                            Mastered 🏆
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{wl.title}</h3>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "Geist Mono, monospace" }}>
                        <div>Streak: {wl.streak} 🔥</div>
                        <div>Next: {wl.nextReviewDate}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "16px 20px 20px 20px", borderTop: "1px dashed var(--border-color)", background: "rgba(0,0,0,0.01)", animation: "fadeIn 0.2s ease" }}>
                      {wl.context && (
                        <div style={{ marginBottom: "16px" }}>
                          <h5 style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Context</h5>
                          <p style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{wl.context}</p>
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div className="panel-side" style={{ borderLeft: "3px solid var(--color-danger)" }}>
                          <h5 style={{ color: "var(--color-danger)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>My Mistake / Trap</h5>
                          <p style={{ whiteSpace: "pre-wrap", fontSize: "0.88rem" }}>{wl.myMistake}</p>
                        </div>
                        <div className="panel-side" style={{ borderLeft: "3px solid var(--color-success)" }}>
                          <h5 style={{ color: "var(--color-success)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "4px" }}>Correct Logic</h5>
                          <p style={{ whiteSpace: "pre-wrap", fontSize: "0.88rem" }}>{wl.correctedLogic}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "16px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => startSession(wl)}>
                            <Play size={14} fill="currentColor" /> Test Now
                          </button>
                          <button className="btn-danger-outline" onClick={() => handleDeleteWeakLink(wl.id)}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Created: {new Date(wl.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* History Timeline */}
                      {wl.history.length > 0 && (
                        <div style={{ marginTop: "24px" }}>
                          <h4 style={{ fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
                            <History size={14} /> Review History ({wl.history.length})
                          </h4>
                          <div className="history-timeline">
                            {wl.history.slice().reverse().map((run, index) => (
                              <div key={index} className={`history-node ${run.result}`}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, display: "flex", gap: "8px", alignItems: "center" }}>
                                  <span>{run.date}</span>
                                  <span style={{ color: run.result === "pass" ? "var(--color-success)" : "var(--color-danger)", textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 800 }}>
                                    {run.result === "pass" ? "Pass" : "Failed"}
                                  </span>
                                </div>
                                {run.activeRecall && (
                                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0", fontStyle: "italic" }}>
                                    Recall: "{run.activeRecall}"
                                  </div>
                                )}
                                {run.result === "fail" && (
                                  <div style={{ marginTop: "6px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "6px", padding: "8px 10px" }}>
                                    <div style={{ fontSize: "0.78rem", color: "#991b1b", fontWeight: 700 }}>
                                      Mistake: {run.mistakeThisTime}
                                    </div>
                                    <div style={{ fontSize: "0.78rem", color: "#065f46", fontWeight: 700, marginTop: "2px" }}>
                                      Fix: {run.preventativeAction}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <BookOpen size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
            <p style={{ fontWeight: 700 }}>No weak links registered yet.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Register a weakness above to start closing feedback loops.</p>
          </div>
        )}
      </section>
    </div>
  );
}
