import { useState, useEffect } from "react";
import { HelpCircle, Terminal, Book, ChevronRight, Search, Hash } from "lucide-react";
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

  useEffect(() => {
    setQuestions(questionsData[activeBank] as Question[]);
  }, [activeBank]);

  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(search.toLowerCase()) ||
    q.tag.toLowerCase().includes(search.toLowerCase()) ||
    q.subSection.toLowerCase().includes(search.toLowerCase())
  );

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
        {filteredQuestions.map((q, idx) => (
          <div key={`${activeBank}-${q.id}-${idx}`} className="question-card">
            <div className="q-card-header">
              <span className="q-id">#{q.id}</span>
              <span className={`q-type ${q.type.toLowerCase()}`}>{q.type}</span>
              <span className="q-tag">{q.tag}</span>
            </div>
            <p className="q-text">{q.text}</p>
            <div className="q-footer">
               <span className="q-subsection">{q.subSection}</span>
               <ChevronRight size={14} className="q-arrow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
