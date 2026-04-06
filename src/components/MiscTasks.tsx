import { useState, useEffect } from "react";
import { saveState, loadState } from "../lib/redis";
import { Plus, X, Check, Trash2, StickyNote } from "lucide-react";

type MiscTask = {
  id: string;
  text: string;
  isDone: boolean;
  createdAt: string; // ISO Date YYYY-MM-DD
};

export default function MiscTasks() {
  const [tasks, setTasks] = useState<MiscTask[]>([]);
  const [inputValue, setInputValue] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const storageKey = "properrr-misc-tasks-v1";

  useEffect(() => {
    const fetchData = async () => {
      const savedTasks: MiscTask[] = await loadState(storageKey, []);
      
      // Clean up logic: Remove completed tasks that are NOT from today
      const filtered = savedTasks.filter(task => {
        if (!task.isDone) return true; // Keep all unfinished tasks
        return task.createdAt === today; // Keep today's finished tasks
      });
      
      setTasks(filtered);
      if (filtered.length !== savedTasks.length) {
        saveState(storageKey, filtered);
      }
    };
    fetchData();
  }, [today]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: MiscTask = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputValue.trim(),
      isDone: false,
      createdAt: today,
    };

    const next = [...tasks, newTask];
    setTasks(next);
    saveState(storageKey, next);
    setInputValue("");
  };

  const toggleTask = (id: string) => {
    const next = tasks.map(t => t.id === id ? { ...t, isDone: !t.isDone } : t);
    setTasks(next);
    saveState(storageKey, next);
  };

  const deleteTask = (id: string) => {
    const next = tasks.filter(t => t.id !== id);
    setTasks(next);
    saveState(storageKey, next);
  };

  const clearCompleted = () => {
    const next = tasks.filter(t => !t.isDone);
    setTasks(next);
    saveState(storageKey, next);
  };

  return (
    <div className="misc-tasks-container">
      <div className="misc-header">
        <StickyNote size={18} className="misc-icon" />
        <h2>Daily Misc</h2>
        <span className="misc-count">{tasks.filter(t => !t.isDone).length} pending</span>
      </div>

      <form onSubmit={addTask} className="misc-input-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Append a quick task..."
          className="misc-input"
        />
        <button type="submit" className="misc-add-btn">
          <Plus size={18} />
        </button>
      </form>

      <div className="misc-list">
        {tasks.map(task => (
          <div key={task.id} className={`misc-item ${task.isDone ? 'is-done' : ''} ${task.createdAt !== today ? 'is-overflow' : ''}`}>
             <div className="misc-item-content" onClick={() => toggleTask(task.id)}>
                <div className={`misc-checkbox ${task.isDone ? 'checked' : ''}`}>
                    {task.isDone && <Check size={12} />}
                </div>
                <div className="misc-text-wrap">
                  <span className="misc-text">{task.text}</span>
                  {task.createdAt !== today && <span className="misc-date-tag">From {task.createdAt}</span>}
                </div>
             </div>
             <button className="misc-del-btn" onClick={() => deleteTask(task.id)}>
                <X size={14} />
             </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="misc-empty">No misc tasks. Focus on the core!</div>
        )}
      </div>

      {tasks.some(t => t.isDone) && (
        <button className="misc-clear-btn" onClick={clearCompleted}>
          <Trash2 size={12} />
          Clear Completed
        </button>
      )}
    </div>
  );
}
