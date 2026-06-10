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

// PREMIUM STYLING TOKENS
const theme = {
    bg: "var(--meridian-bg, #0a0a0a)",
    cardBg: "rgba(255, 255, 255, 0.03)",
    cardBorder: "1px solid rgba(255, 255, 255, 0.08)",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    danger: "#ef4444",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
};

const glassmorphism = {
    background: theme.cardBg,
    backdropFilter: "blur(12px)",
    border: theme.cardBorder,
    borderRadius: "16px",
    color: theme.textMain,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
};

const inputStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: theme.cardBorder,
    background: "rgba(0, 0, 0, 0.2)",
    color: theme.textMain,
    outline: "none",
    transition: "border 0.2s ease",
};

const buttonStyle = {
    padding: "10px 20px",
    background: theme.primary,
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
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
        <div style={{ ...glassmorphism, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontWeight: "700", fontSize: "1.2rem", letterSpacing: "1px", textTransform: "uppercase", borderBottom: theme.cardBorder, paddingBottom: "12px" }}>
                {title}
            </h2>
            {goals.filter(g => g.period === period).map(g => {
                const daysRemaining = calculateDaysRemaining(g.targetDate);
                const isOverdue = daysRemaining < 0;

                return (
                    <div key={g.id} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: theme.cardBorder,
                        padding: "20px",
                        borderRadius: "12px",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        {/* Status Indicator Bar */}
                        <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: g.status === "completed" ? theme.primary : (isOverdue ? theme.danger : "#10b981") }} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <h4 style={{ fontWeight: "600", fontSize: "1.1rem", margin: 0, textDecoration: g.status === "completed" ? "line-through" : "none", color: g.status === "completed" ? theme.textMuted : theme.textMain }}>
                                {g.title}
                            </h4>
                            <span style={{ fontSize: "0.8rem", padding: "4px 8px", borderRadius: "12px", background: "rgba(255,255,255,0.1)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {g.status}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: theme.textMuted, marginBottom: "16px" }}>
                            <span>Target: {g.targetDate}</span>
                            <span style={{ fontWeight: "600", color: isOverdue && g.status !== "completed" ? theme.danger : theme.textMuted }}>
                                {daysRemaining} days left
                            </span>
                        </div>

                        {g.logs.length > 0 && (
                            <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.85rem" }}>
                                {g.logs.map((log, idx) => (
                                    <div key={idx} style={{ marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "4px" }}>
                                        <span style={{ color: theme.primary, marginRight: "8px" }}>{new Date(log.date).toLocaleDateString()}</span>
                                        <span style={{ color: theme.textMuted }}>{log.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {g.status !== "completed" && (
                                <>
                                    <button onClick={() => handleMarkFunction(g.id)} style={{ padding: "6px 12px", fontSize: "0.85rem", background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "6px", cursor: "pointer" }}>Mark Done</button>
                                    <button onClick={() => handleAddLog(g.id)} style={{ padding: "6px 12px", fontSize: "0.85rem", background: "rgba(59, 130, 246, 0.2)", color: theme.primary, border: "1px solid rgba(59, 130, 246, 0.4)", borderRadius: "6px", cursor: "pointer" }}>Add Log</button>
                                </>
                            )}
                            <button onClick={() => handleDeleteGoal(g.id)} style={{ padding: "6px 12px", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)", color: theme.danger, border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "6px", cursor: "pointer", marginLeft: "auto" }}>Delete</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div style={{ padding: "40px 24px", maxWidth: "1600px", margin: "0 auto", background: theme.bg, minHeight: "100vh", color: theme.textMain }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-1px", margin: 0, background: "linear-gradient(90deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        DEADLINE GOALS
                    </h1>
                    <p style={{ color: theme.textMuted, marginTop: "8px", fontSize: "1.1rem" }}>{goals.length} Active Objectives</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ ...glassmorphism, padding: "32px", marginBottom: "40px", display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: "1", minWidth: "250px" }}>
                    <label style={{ fontSize: "0.9rem", color: theme.textMuted, marginBottom: "8px", fontWeight: "500" }}>Goal Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter strategy objective..." style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
                    <label style={{ fontSize: "0.9rem", color: theme.textMuted, marginBottom: "8px", fontWeight: "500" }}>Period</label>
                    <select name="period" value={formData.period} onChange={handleChange} style={inputStyle}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
                    <label style={{ fontSize: "0.9rem", color: theme.textMuted, marginBottom: "8px", fontWeight: "500" }}>Target Date</label>
                    <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} style={inputStyle} />
                </div>
                <button type="submit" style={buttonStyle}>Deploy Goal</button>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {renderColumn("Weekly Sprints", "weekly")}
                {renderColumn("Monthly Targets", "monthly")}
                {renderColumn("Quarterly OKRs", "quarterly")}
                {renderColumn("Yearly Vision", "yearly")}
            </div>
        </div>
    );
}