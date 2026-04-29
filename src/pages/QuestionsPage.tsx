import { useState, useEffect } from "react";
import { HelpCircle, Terminal, Book, Search, Hash } from "lucide-react";
import questionsData from "../data/questions.json";
import "../styles/Questions.css";
import "../index.css";

interface Question {
  id: number;
  type: string;
  tag: string;
  text: string;
  section: string;
  subSection: string;
}

export default function QuestionsPage() {
  const [activeBank, setActiveBank] = useState<"backend" | "clrs">("backend");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    setQuestions(questionsData[activeBank] as Question[]);
    setPage(1);
  }, [activeBank]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredQuestions = questions.filter(q => 
    (q.text && q.text.toLowerCase().includes(search.toLowerCase())) ||
    (q.tag && q.tag.toLowerCase().includes(search.toLowerCase())) ||
    (q.subSection && q.subSection.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  return (
    <div className="questions-page">
      <header className="page-header">
        <div className="header-info">
          <div className="title-with-icon">
            <HelpCircle size={28} className="text-accent" />
            <h1>Knowledge Bank</h1>
          </div>
          <p>Mastering Computer Science & System Internals</p>
        </div>
        <div className="bank-selector">
          <button 
            className={`bank-btn ${activeBank === "backend" ? "active" : ""}`}
            onClick={() => setActiveBank("backend")}
          >
            <Terminal size={16} />
            Backend Interview
          </button>
          <button 
            className={`bank-btn ${activeBank === "clrs" ? "active" : ""}`}
            onClick={() => setActiveBank("clrs")}
          >
            <Book size={16} />
            CLRS Algorithms
          </button>
        </div>
      </header>

      <div className="search-bar-container">
        <div className="search-input-wrap">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search questions, topics, or incidents..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="question-stats">
          <Hash size={16} />
          <span>{filteredQuestions.length} Questions</span>
        </div>
      </div>

      <div className="questions-list">
        {(() => {
          let currentSection = "";
          let currentSubSection = "";

          return paginatedQuestions.map((q, idx) => {
            const showSection = q.section !== currentSection;
            const showSubSection = q.subSection !== currentSubSection;
            
            if (showSection) currentSection = q.section || "";
            if (showSubSection) currentSubSection = q.subSection || "";

            return (
              <div key={`${activeBank}-${q.id}-${idx}`}>
                {showSection && q.section && (
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "40px", marginBottom: "16px", color: "var(--meridian-text, #fff)", borderBottom: "1px solid var(--meridian-border, #333)", paddingBottom: "8px" }}>
                    {q.section}
                  </h2>
                )}
                {showSubSection && q.subSection && (
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "24px", marginBottom: "16px", color: "var(--meridian-text-muted, #aaa)" }}>
                    {q.subSection}
                  </h3>
                )}
                <div className="question-card" style={{ marginBottom: "16px" }}>
                  <div className="q-card-header">
                    <span className="q-id">#{q.id}</span>
                    <span className={`q-type ${(q.type || '').toLowerCase()}`}>{q.type}</span>
                    <span className="q-tag">{q.tag}</span>
                  </div>
                  <p className="q-text">{q.text}</p>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px", marginBottom: "40px" }}>
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            style={{ padding: "8px 16px", background: page === 1 ? "rgba(255,255,255,0.05)" : "var(--bg-secondary)", color: page === 1 ? "#666" : "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "4px", cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            Previous
          </button>
          <span style={{ display: "flex", alignItems: "center", color: "var(--text-secondary)" }}>
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => p + 1)}
            style={{ padding: "8px 16px", background: page === totalPages ? "rgba(255,255,255,0.05)" : "var(--bg-secondary)", color: page === totalPages ? "#666" : "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "4px", cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
