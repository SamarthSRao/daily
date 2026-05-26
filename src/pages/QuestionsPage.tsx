import { useState, useEffect } from "react";
import { HelpCircle, Terminal, Book, Database, Search, Hash } from "lucide-react";
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

type BankType = "backend" | "clrs" | "sql";

const getShortSectionName = (sec: string, bank: BankType) => {
  if (!sec) return "";
  if (bank === "backend") {
    return sec.split(':')[0]; // e.g. "S1", "S2"
  }
  if (bank === "clrs") {
    const parts = sec.split(/[\u2014-]/); // Split on em-dash or hyphen
    return parts[0].trim(); // e.g. "PART I"
  }
  if (bank === "sql") {
    return `Ch ${sec.split(':')[0]}`; // e.g. "Ch 1", "Ch 2"
  }
  return sec;
};

export default function QuestionsPage() {
  const [activeBank, setActiveBank] = useState<BankType>("backend");
  const [activeSection, setActiveSection] = useState<string>("S1: Web Request Lifecycle");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const bankQuestions = ((questionsData as any)[activeBank] || []) as Question[];
    setQuestions(bankQuestions);
    setPage(1);

    // Extract unique sections for this bank and sort them properly
    const uniqueSecs = Array.from(new Set(bankQuestions.map(q => q.section))).filter(Boolean);
    if (activeBank === "backend") {
      uniqueSecs.sort();
    } else if (activeBank === "sql") {
      uniqueSecs.sort((a, b) => {
        const aNum = parseInt(a.split(':')[0]) || 0;
        const bNum = parseInt(b.split(':')[0]) || 0;
        return aNum - bNum;
      });
    } else if (activeBank === "clrs") {
      const romanOrder: { [key: string]: number } = {
        "PART I": 1,
        "PART II": 2,
        "PART III": 3,
        "PART IV": 4,
        "PART V": 5,
        "PART VI": 6,
        "PART VII": 7,
        "PART VIII": 8
      };
      uniqueSecs.sort((a, b) => {
        const aRoman = a.split(/[\u2014-]/)[0].trim();
        const bRoman = b.split(/[\u2014-]/)[0].trim();
        return (romanOrder[aRoman] || 99) - (romanOrder[bRoman] || 99);
      });
    }

    if (uniqueSecs.length > 0) {
      setActiveSection(uniqueSecs[0]);
    } else {
      setActiveSection("");
    }
  }, [activeBank]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredQuestions = questions.filter(q => {
    // Filter by section if one is active
    if (activeSection && q.section !== activeSection) {
      return false;
    }
    
    // Apply search
    if (!search) return true;
    
    return (
      (q.text && q.text.toLowerCase().includes(search.toLowerCase())) ||
      (q.tag && q.tag.toLowerCase().includes(search.toLowerCase())) ||
      (q.subSection && q.subSection.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Extract unique sections for the sub-nav and sort them
  const activeBankSections = Array.from(new Set(questions.map(q => q.section))).filter(Boolean);
  if (activeBank === "backend") {
    activeBankSections.sort();
  } else if (activeBank === "sql") {
    activeBankSections.sort((a, b) => {
      const aNum = parseInt(a.split(':')[0]) || 0;
      const bNum = parseInt(b.split(':')[0]) || 0;
      return aNum - bNum;
    });
  } else if (activeBank === "clrs") {
    const romanOrder: { [key: string]: number } = {
      "PART I": 1,
      "PART II": 2,
      "PART III": 3,
      "PART IV": 4,
      "PART V": 5,
      "PART VI": 6,
      "PART VII": 7,
      "PART VIII": 8
    };
    activeBankSections.sort((a, b) => {
      const aRoman = a.split(/[\u2014-]/)[0].trim();
      const bRoman = b.split(/[\u2014-]/)[0].trim();
      return (romanOrder[aRoman] || 99) - (romanOrder[bRoman] || 99);
    });
  }

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
          <button 
            className={`bank-btn ${activeBank === "sql" ? "active" : ""}`}
            onClick={() => setActiveBank("sql")}
          >
            <Database size={16} />
            SQL Practice
          </button>
        </div>
      </header>

      {activeBankSections.length > 0 && (
        <div className="meridian-section-nav" style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto", 
          padding: "0 0 24px 0",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-color, #e5e5e5)",
          whiteSpace: "nowrap",
          scrollbarWidth: "none" // hide scrollbar in Firefox
        }}>
          {activeBankSections.map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              title={sec}
              style={{
                background: activeSection === sec ? "var(--color-primary, #111)" : "transparent",
                color: activeSection === sec ? "#fff" : "var(--text-secondary, #666)",
                border: activeSection === sec ? "1px solid var(--color-primary, #111)" : "1px solid #ccc",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: activeSection === sec ? "600" : "400",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--meridian-font-mono, monospace)"
              }}
            >
              {getShortSectionName(sec, activeBank)}
            </button>
          ))}
        </div>
      )}

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
