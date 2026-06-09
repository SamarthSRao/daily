import { useState, useEffect } from "react";

export interface Goal {
    id: string;
    title: string;
    period: "weekly" | "monthly" | "quarterly" | "yearly";
    targetDate: string;
    status: "active" | "completed";
    logs: { date: string; text: string }[];
}

// 2. Countdown Helper Function (Placed outside the component scope)
function calculateDaysRemaining(targetDateStr: string): number {
    const today = new Date();
    const target = new Date(targetDateStr);

    // Compute raw millisecond delta difference
    const timeDifference = target.getTime() - today.getTime();

    // Convert to discrete integer days, rounding up
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
}

export default function DeadlineGoals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [filterBy, setFilterBy] = useState<'all' | 'active' | 'completed'>('all');
    const [formData, setFormData] = useState({
        title: "",
        period: "weekly" as Goal["period"],
        targetDate: "",
        status: "active"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Fix 1.1: Fixed property check from targetData to targetDate
        if (!formData.title || !formData.targetDate) {
            alert("Title and Target Date are required");
            return;
        }

        const newGoal: Goal = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: formData.title,
            period: formData.period,
            targetDate: formData.targetDate,
            status: "active",
            logs: []
        };

        setGoals([...goals, newGoal]);
        setFormData({
            title: "",
            period: "weekly",
            targetDate: "",
            status: "active"
        });
    };

    useEffect(() => {
        const savedGoals = localStorage.getItem("goals");
        if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals));
    }, [goals]);

    const handleDeleteGoal = (idToRemove: string) => {
        const remainingGoals = goals.filter(g => g.id !== idToRemove);
        setGoals(remainingGoals);
    };

    const handleAddDummyGoal = () => {
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newGoal: Goal = {
            id: uniqueId,
            title: "Dummy Goal",
            period: "weekly",
            targetDate: "2026-12-31",
            status: "active",
            logs: []
        };
        setGoals([...goals, newGoal]);
    };
    const handleMarkFunction = (id: string) => {
        setGoals(g => g.map(goal => goal.id === id ? { ...goal, status: "completed" } : goal));
    }
    const handleAddLog = (id: string) => {
        const logtext = window.prompt("enter progress")
        if (!logtext) return;
        const newLog = { date: new Date().toISOString(), text: logtext }
        setGoals(goals.map((goal => {
            if (goal.id === id) {

                return { ...goal, logs: [...goal.logs, newLog] };
            } else {
                return goal;
            }
        })))
    }
    return (
        <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
            <h1 className="text-3xl font-bold">DEADLINE GOALS</h1>
            <button onClick={handleAddDummyGoal} style={{ margin: "10px 0", padding: "8px 16px", cursor: "pointer" }}> Add Dummy Goal</button>
            <p> Total Goals: {goals.length}</p>

            <form onSubmit={handleSubmit} style={{ margin: "20px 0", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="title" style={{ fontWeight: "bold", marginBottom: "4px" }}>Goal Title</label>
                        {/* Fix 1.2: Added closing slash '/>' directly here */}
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter strategy title..."
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "200px" }}
                        />
                    </div>

                    {/* Fix 1.3: Added missing structural '>' right here */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="period" style={{ fontWeight: "bold", marginBottom: "4px" }}>Period</label>
                        <select name="period" id="period" value={formData.period} onChange={handleChange}
                            style={{
                                padding: "6px",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                            }}>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="targetDate" style={{ fontWeight: "bold", marginBottom: "4px" }}>Target Date</label>
                        <input
                            id="targetDate"
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 20px",
                                background: "#2563eb",
                                color: "white",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Add Goal
                        </button>
                    </div>
                </div>
            </form>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "24px" }}>

                {/* Weekly Column with Countdown Display */}
                <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
                    <h2 style={{ fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #ccc" }}>Weekly</h2>
                    {goals.filter(g => g.period === "weekly").map(g => (
                        <div key={g.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px", borderRadius: "4px", background: "#fff" }}>
                            <h4 style={{ fontWeight: "bold" }}>{g.title}</h4>
                            <p>Status: {g.status}</p>
                            <p>Target: {g.targetDate}</p>
                            {/* 3. Render Countdown */}
                            <p style={{ fontWeight: "500", color: calculateDaysRemaining(g.targetDate) < 0 ? "#dc2626" : "#4b5563" }}>
                                Days Remaining: {calculateDaysRemaining(g.targetDate)}
                            </p>
                            <button
                                onClick={() => handleDeleteGoal(g.id)}
                                style={{
                                    marginTop: "8px",
                                    color: "#dc2626",
                                    background: "none",
                                    border: "1px solid #dc2626",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Monthly Column with Countdown Display */}
                <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
                    <h2 style={{ fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #ccc" }}>Monthly</h2>
                    {goals.filter(g => g.period === "monthly").map(g => (
                        <div key={g.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px", borderRadius: "4px", background: "#fff" }}>
                            <h4 style={{ fontWeight: "bold" }}>{g.title}</h4>
                            <p>Status: {g.status}</p>
                            <p>Target: {g.targetDate}</p>
                            {/* 3. Render Countdown */}
                            <p style={{ fontWeight: "500", color: calculateDaysRemaining(g.targetDate) < 0 ? "#dc2626" : "#4b5563" }}>
                                Days Remaining: {calculateDaysRemaining(g.targetDate)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quarterly Column with Countdown Display */}
                <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
                    <h2 style={{ fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #ccc" }}>Quarterly</h2>
                    {goals.filter(g => g.period === "quarterly").map(g => (
                        <div key={g.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px", borderRadius: "4px", background: "#fff" }}>
                            <h4 style={{ fontWeight: "bold" }}>{g.title}</h4>
                            <p>Status: {g.status}</p>
                            <p>Target: {g.targetDate}</p>
                            {/* 3. Render Countdown */}
                            <p style={{ fontWeight: "500", color: calculateDaysRemaining(g.targetDate) < 0 ? "#dc2626" : "#4b5563" }}>
                                Days Remaining: {calculateDaysRemaining(g.targetDate)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Yearly Column with Countdown Display */}
                <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
                    <h2 style={{ fontWeight: "bold", marginBottom: "16px", borderBottom: "2px solid #ccc" }}>Yearly</h2>
                    {goals.filter(g => g.period === "yearly").map(g => (
                        <div key={g.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px", borderRadius: "4px", background: "#fff" }}>
                            <h4 style={{ fontWeight: "bold" }}>{g.title}</h4>
                            <p>Status: {g.status}</p>
                            <p>Target: {g.targetDate}</p>
                            {/* 3. Render Countdown */}
                            <p style={{ fontWeight: "500", color: calculateDaysRemaining(g.targetDate) < 0 ? "#dc2626" : "#4b5563" }}>
                                Days Remaining: {calculateDaysRemaining(g.targetDate)}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}