import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rawMarkdown from "../../Backend_Engineering_Mastery_Plan_2026 (2).md?raw";
import "../index.css";

// Extract the pre-requisite section up until "## The Main Project: OpenTrace"
const prerequisiteText = rawMarkdown.split("## The Main Project: OpenTrace")[0];

export default function PrerequisitesPage() {
  return (
    <div className="tasks-container" style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", color: "var(--meridian-text)" }}>
      <div className="tasks-header" style={{ marginBottom: "40px" }}>
        <h1 className="tasks-title">
          <BookOpen className="icon-main" style={{ color: "#10b981" }} />
          Curriculum Prerequisites
        </h1>
        <p className="tasks-subtitle">
          Master Concept Checklist & Foundational Requirements
        </p>
      </div>

      <div className="content-section markdown-body" style={{ background: "var(--meridian-panel)", padding: "32px", borderRadius: "12px", marginBottom: "32px", lineHeight: "1.7" }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 style={{ borderBottom: "1px solid var(--meridian-border)", paddingBottom: "12px", marginBottom: "24px", color: "#1e293b" }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ borderBottom: "1px solid var(--meridian-border)", paddingBottom: "8px", marginTop: "40px", marginBottom: "16px", color: "#1e293b" }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ marginTop: "32px", marginBottom: "16px", color: "#334155" }} {...props} />,
            h4: ({node, ...props}) => <h4 style={{ marginTop: "24px", marginBottom: "12px", color: "#475569" }} {...props} />,
            p: ({node, ...props}) => <p style={{ marginBottom: "16px" }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ paddingLeft: "24px", marginBottom: "24px" }} {...props} />,
            ol: ({node, ...props}) => <ol style={{ paddingLeft: "24px", marginBottom: "24px" }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: "8px" }} {...props} />,
            a: ({node, ...props}) => <a style={{ color: "#3b82f6", textDecoration: "none" }} {...props} />,
            blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: "4px solid #3b82f6", paddingLeft: "16px", color: "var(--meridian-muted)", fontStyle: "italic", margin: "0 0 24px 0", background: "rgba(59, 130, 246, 0.1)", padding: "16px", borderRadius: "0 8px 8px 0" }} {...props} />,
            pre: ({node, ...props}) => <pre style={{ background: "rgba(0,0,0,0.5)", padding: "16px", borderRadius: "8px", overflowX: "auto", marginBottom: "24px" }} {...props} />,
            code: ({node, inline, ...props}: any) => inline 
              ? <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.9em", color: "#a78bfa" }} {...props} />
              : <code style={{ color: "#a78bfa", fontFamily: "monospace" }} {...props} />,
            table: ({node, ...props}) => (
              <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }} {...props} />
              </div>
            ),
            th: ({node, ...props}) => <th style={{ padding: "12px", borderBottom: "2px solid var(--meridian-border)", background: "rgba(255,255,255,0.05)" }} {...props} />,
            td: ({node, ...props}) => <td style={{ padding: "12px", borderBottom: "1px solid var(--meridian-border)" }} {...props} />,
          }}
        >
          {prerequisiteText}
        </ReactMarkdown>
      </div>
    </div>
  );
}
