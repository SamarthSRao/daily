import { useState } from "react";
import specs from "../data/specs.json";
import guidelines from "../data/guidelines.json";
import { ChevronDown, ChevronRight, FileText, Layout, Book, Info } from "lucide-react";

export default function SpecsPage() {
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [expandedGuidelineSections, setExpandedGuidelineSections] = useState<Record<number, boolean>>({});

  const toggleSpec = (id: string) => {
    setExpandedSpecs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGuideline = (idx: number) => {
    setExpandedGuidelineSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <FileText className="icon-main" />
          Spec Sheet
        </h1>
        <p className="tasks-subtitle">Project Blueprints & System Specifications</p>
      </div>

      <div className="curriculum-list">
        {specs.map((spec) => (
          <div key={spec.id} className="month-card">
            <div 
              className="month-header" 
              onClick={() => toggleSpec(spec.id)}
            >
              <div className="month-title">
                <Layout className="icon-month" />
                <div>
                  <h2 style={{ fontSize: '1.25rem' }}>{spec.title}</h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{spec.subtitle}</span>
                </div>
              </div>
              {expandedSpecs[spec.id] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedSpecs[spec.id] && (
              <div className="month-content">
                <div className="spec-stack">
                  <strong>Stack:</strong> {spec.stack}
                </div>
                
                <div className="spec-grid">
                  {spec.sections.map((section, sIdx) => (
                    <div key={sIdx} className="spec-section">
                      <h3 className="spec-section-title">{section.title}</h3>
                      <div className="spec-section-content" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="tasks-header" style={{ marginTop: '60px' }}>
        <h1 className="tasks-title">
          <Book className="icon-main" />
          Guidelines
        </h1>
        <p className="tasks-subtitle">{guidelines.title}</p>
      </div>

      <div className="curriculum-list" style={{ marginBottom: '80px' }}>
        {guidelines.sections.map((section, idx) => (
          <div key={idx} className="month-card">
            <div 
              className="month-header" 
              onClick={() => toggleGuideline(idx)}
            >
              <div className="month-title">
                <Info className="icon-month" />
                <h2>{section.title}</h2>
              </div>
              {expandedGuidelineSections[idx] ? <ChevronDown /> : <ChevronRight />}
            </div>

            {expandedGuidelineSections[idx] && (
              <div className="month-content">
                <div className="spec-section-content" dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .spec-stack {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 8px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 0.95rem;
          display: inline-block;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .spec-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .spec-section {
          background-color: rgba(0,0,0,0.2);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }
        .spec-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }
        .spec-section-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
        }
        .spec-section-content table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          background: rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .spec-section-content th, .spec-section-content td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        .spec-section-content th {
          background: rgba(255,255,255,0.05);
          color: var(--text-secondary);
          font-size: 0.8rem;
          text-transform: uppercase;
        }
      `}} />
    </div>
  );
}
