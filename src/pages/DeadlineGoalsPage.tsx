import { useState, useEffect } from "react";

export interface Goal {
    id: string;
    title: string;
    period: "weekly" | "monthly" | "quarterly" | "yearly";
    targetDate: string;
    status: "active" | "completed";
    logs: { date: string; text: string }[];
}

function calculateDaysRemaining(targetDateStr: string): number {
    const today = new Date();
    const target = new Date(targetDateStr);
    const timeDifference = target.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

const inputStyle = {
    padding: "8px 12px",
    borderRadius: "0px",
    border: "1px solid var(--meridian-border)",
    background: "transparent",
    color: "var(--meridian-text)",
    fontFamily: "var(--meridian-font-mono)",
    fontSize: "0.85rem",
    outline: "none",
};

const buttonStyle = {
    padding: "8px 16px",
    background: "var(--meridian-black)",
    color: "#f5f5f0",
    borderRadius: "0px",
    border: "1px solid var(--meridian-border)",
    cursor: "pointer",
    fontFamily: "var(--meridian-font-mono)",
    fontSize: "0.85rem",
    fontWeight: "bold",
};

const secondaryButtonStyle = {
    ...buttonStyle,
    background: "transparent",
    color: "var(--meridian-text)",
};

export default function DeadlineGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        period: "weekly" as Goal["period"],
        targetDate: "",
        status: "active"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title || !formData.targetDate) {
            alert("Title and Target Date are required");
            return;
        }

        const newGoal: Goal = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: formData.title,
            period: formData.period,
            targetDate: formData.targetDate,
            status: "active",
            logs: []
        };

        setGoals([...goals, newGoal]);
        setFormData({ title: "", period: "weekly", targetDate: "", status: "active" });
    };

    useEffect(() => {
        const savedGoals = localStorage.getItem("properrr-deadline-goals");
        if (savedGoals) setGoals(JSON.parse(savedGoals));
    }, []);

    useEffect(() => {
        localStorage.setItem("properrr-deadline-goals", JSON.stringify(goals));
    }, [goals]);

    const handleDeleteGoal = (idToRemove: string) => {
        setGoals(goals.filter(g => g.id !== idToRemove));
    };

    const handleMarkFunction = (id: string) => {
        setGoals(g => g.map(goal => goal.id === id ? { ...goal, status: "completed" } : goal));
    }

    const handleAddLog = (id: string) => {
        const logtext = window.prompt("Enter progress details:");
        if (!logtext) return;
        const newLog = { date: new Date().toISOString(), text: logtext };
        setGoals(goals.map(goal => goal.id === id ? { ...goal, logs: [...goal.logs, newLog] } : goal));
    }

    const renderColumn = (title: string, period: string) => (
        <div style={{ border: "1px solid var(--meridian-border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", background: "var(--meridian-bg)" }}>
            <div className="meridian-activity-header" style={{ borderBottom: "1px solid var(--meridian-border)", paddingBottom: "16px", marginBottom: "8px" }}>
                <span className="meridian-stat-title">{title}</span>
            </div>
            
            {goals.filter(g => g.period === period).map(g => {
                const daysRemaining = calculateDaysRemaining(g.targetDate);
                const isOverdue = daysRemaining < 0;
                
                return (
                    <div key={g.id} style={{ 
                        border: "1px solid var(--meridian-border)", 
                        padding: "16px", 
                        background: "transparent",
                        position: "relative",
                    }}>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <h4 style={{ 
                                fontFamily: "var(--meridian-font-serif)", 
                                fontSize: "1.3rem", 
                                margin: 0, 
                                textDecoration: g.status === "completed" ? "line-through" : "none", 
                                color: g.status === "completed" ? "var(--meridian-text-muted)" : "var(--meridian-text)" 
                            }}>
                                {g.title}
                            </h4>
                            <span className="meridian-stat-pill" style={{ background: g.status === "completed" ? "var(--meridian-black)" : "transparent", color: g.status === "completed" ? "#f5f5f0" : "inherit" }}>
                                {g.status}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--meridian-font-mono)", fontSize: "0.75rem", color: "var(--meridian-text-muted)", marginBottom: "16px" }}>
                            <span>TGT: {g.targetDate}</span>
                            <span style={{ fontWeight: "bold", color: isOverdue && g.status !== "completed" ? "#dc2626" : "inherit" }}>
                                {daysRemaining} DAYS REMAINING
                            </span>
                        </div>

                        {g.logs.length > 0 && (
                            <div style={{ border: "1px dotted var(--meridian-border)", padding: "12px", marginBottom: "16px", fontFamily: "var(--meridian-font-mono)", fontSize: "0.75rem" }}>
                                {g.logs.map((log, idx) => (
                                    <div key={idx} style={{ marginBottom: "8px" }}>
                                        <span style={{ fontWeight: "bold", marginRight: "8px" }}>{new Date(log.date).toLocaleDateString()}</span>
                                        <span style={{ color: "var(--meridian-text-muted)" }}>{log.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px", borderTop: "1px dotted var(--meridian-border)", paddingTop: "16px" }}>
                            {g.status !== "completed" && (
                                <>
                                    <button onClick={() => handleMarkFunction(g.id)} style={secondaryButtonStyle}>Mark Done</button>
                                    <button onClick={() => handleAddLog(g.id)} style={secondaryButtonStyle}>Add Log</button>
                                </>
                            )}
                            <button onClick={() => handleDeleteGoal(g.id)} style={{...secondaryButtonStyle, color: "#dc2626", border: "1px solid #dc2626", marginLeft: "auto" }}>Delete</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="meridian-home">
            <div className="meridian-home-header">
                <div className="meridian-title-area">
                    <h1>DEADLINE GOALS</h1>
                    <h1 className="italic">tactical board</h1>
                </div>
                <div className="meridian-date-area">
                    <div>{goals.length} ACTIVE OBJECTIVES</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ border: "1px solid var(--meridian-border)", padding: "24px", marginBottom: "48px", display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: "1", minWidth: "200px" }}>
                    <label style={{ fontFamily: "var(--meridian-font-mono)", fontSize: "0.75rem", color: "var(--meridian-text-muted)", marginBottom: "8px" }}>OBJECTIVE TITLE</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter strategy objective..." style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
                    <label style={{ fontFamily: "var(--meridian-font-mono)", fontSize: "0.75rem", color: "var(--meridian-text-muted)", marginBottom: "8px" }}>PERIOD</label>
                    <select name="period" value={formData.period} onChange={handleChange} style={inputStyle}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
                    <label style={{ fontFamily: "var(--meridian-font-mono)", fontSize: "0.75rem", color: "var(--meridian-text-muted)", marginBottom: "8px" }}>TARGET DATE</label>
                    <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} style={inputStyle} />
                </div>
                <button type="submit" style={buttonStyle}>DEPLOY GOAL</button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {renderColumn("WEEKLY SPRINTS", "weekly")}
                {renderColumn("MONTHLY TARGETS", "monthly")}
                {renderColumn("QUARTERLY OKRS", "quarterly")}
                {renderColumn("YEARLY VISION", "yearly")}
            </div>
        </div>
    );
}