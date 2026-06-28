type DeadlineGoalStatus = 'pending' | 'in-progress' | 'completed';


interface DeadlineGoal {
    id: string;
    title: string;
    status: TaskStatus;
    comments: TaskComment[];

    assignedTo?: string;
    deadline?: string;
    createdAt?: Date;
    updatedAt?: Date;
    type?: 'goal' | 'task';
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    subtasks?: Subtask[];
}

interface TaskComment {
    id: string;
    taskId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
}

interface Subtask {
    id: string;
    taskId: string;
    title: string;
    completed: boolean;
}