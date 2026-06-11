export interface DeadlineGoal {
    id: string;
    title: string;
    period: "weekly" | "monthly" | "quarterly" | "yearly";
    targetDate: string;
    status: "active" | "completed";
    logs: { date: string; text: string }[];
}