import { useState, useEffect, useCallback, useMemo } from "react";
import data from "../data/dailyPlan.json";
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, CalendarDays, Zap, X } from "lucide-react";
import { saveState, loadState } from "../lib/redis";
import "../index.css";

// Utility to create a date at midnight local time
const createDate = (y: number, m: number, d: number) => new Date(y, m, d);

// Date formatter YYYY-MM-DD
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function DailyPage() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  
  // Flatten data into a map: dateString -> day details
  const daysMap = useMemo(() => {
    const map = new Map<string, any>();
    data.forEach((month, mIdx) => {
      month.weeks.forEach((week, wIdx) => {
        week.days.forEach((day, dIdx) => {
          if ((day as any).date) {
            const dateStr = (day as any).date; // YYYY-MM-DD
            if (!map.has(dateStr)) {
              map.set(dateStr, { ...day, mIdx, wIdx, dIdx });
            } else {
              // Combine tasks if multiple blocks on same day
              const existing = map.get(dateStr);
              if (!existing.title.includes(day.title)) {
                existing.title += " | " + day.title;
              }
              existing.tasks.push(...day.tasks);
            }
          }
        });
      });
    });
    return map;
  }, []);

  // Calendar State (Start from June 2026 as per user's schedule start)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => createDate(2026, 5, 1)); 
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  
  useEffect(() => {
    const cleanupBuggySyncs = async () => {
      const existingStr = localStorage.getItem("properrr-panic-deadlines-v2");
      if (existingStr) {
        try {
          const parsed = JSON.parse(existingStr);
          const clean = parsed.filter((d: any) => !(d.id && d.id.startsWith("daily-panic-")));
          if (clean.length !== parsed.length) {
            localStorage.setItem("properrr-panic-deadlines-v2", JSON.stringify(clean));
            await saveState("properrr-panic-deadlines-v2", clean);
            console.log("Cleaned up old daily syncs. Ready for fresh sync.");
            window.location.reload(); // Refresh to reflect clean state in UI
          }
        } catch (e) {}
      }
    };
    cleanupBuggySyncs();

    const fetchData = async () => {
      const data = await loadState("properrr-daily-tasks", {});
      setCompletedTasks(data);
    };
    fetchData();
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      saveState("properrr-daily-tasks", next);
      return next;
    });
  }, []);

  const syncToPanicMonster = async (dateStr: string) => {
    const dayData = daysMap.get(dateStr);
    if (!dayData) return;

    const existing = await loadState("properrr-panic-deadlines-v2", []);
    const existingMap = new Set(existing.map((d: any) => d.id));
    const newDeadlines = [...existing];
    let added = 0;
    
    // Add individual tasks to the panic monster
    dayData.tasks.forEach((taskText: string, tIdx: number) => {
      const id = `daily-panic-${dateStr}-${dayData.mIdx}-${dayData.wIdx}-${dayData.dIdx}-${tIdx}`;
      if (!existingMap.has(id)) {
        newDeadlines.push({
          id,
          name: taskText.substring(0, 60) + (taskText.length > 60 ? '...' : ''),
          date: dateStr,
          time: "23:59",
          completed: false
        });
        added++;
      }
    });

    if (added > 0) {
      await saveState("properrr-panic-deadlines-v2", newDeadlines);
      alert(`Successfully synced ${added} tasks for ${dateStr} to Panic Monster!`);
    } else {
      alert(`All tasks for ${dateStr} are already synced to Panic Monster!`);
    }
  };

  const prevMonth = () => {
    setCurrentMonthDate(prev => createDate(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(prev => createDate(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar rendering logic
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed
  
  const firstDayOfMonth = createDate(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = createDate(year, month + 1, 0).getDate();
  
  const calendarCells = [];
  // Padding for start
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`pad-${i}`} className="calendar-cell empty"></div>);
  }
  
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDateStr = formatDate(createDate(year, month, d));
    const dayData = daysMap.get(cellDateStr);
    const hasTasks = !!dayData;
    const isSelected = selectedDateStr === cellDateStr;
    const isToday = cellDateStr === formatDate(new Date());

    calendarCells.push(
      <div 
        key={`day-${d}`} 
        className={`calendar-cell ${hasTasks ? 'has-tasks' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
        onClick={() => {
          if (hasTasks) {
            setSelectedDateStr(cellDateStr);
          }
        }}
      >
        <div className="cell-date">{d}</div>
        {hasTasks && <div className="cell-indicator"></div>}
      </div>
    );
  }

  const selectedDayData = selectedDateStr ? daysMap.get(selectedDateStr) : null;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="tasks-title">
          <CalendarDays className="icon-main" style={{ color: '#10b981' }} />
          Daily Routine (Calendar)
        </h1>
        <p className="tasks-subtitle">Systematic execution of the Backend Mastery Plan</p>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-header">
            <button onClick={prevMonth} className="cal-nav-btn"><ChevronLeft /></button>
            <h2 className="cal-month-title">{monthNames[month]} {year}</h2>
            <button onClick={nextMonth} className="cal-nav-btn"><ChevronRight /></button>
          </div>
          
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}
            {calendarCells}
          </div>
        </div>

        {selectedDateStr && selectedDayData && (
          <div className="calendar-side-panel">
            <div className="panel-header">
              <h3>{selectedDateStr}</h3>
              <button className="panel-close-btn" onClick={() => setSelectedDateStr(null)}>
                <X size={20} />
              </button>
            </div>
            
            <h4 className="panel-day-title">{selectedDayData.title}</h4>
            
            <button 
              className="sync-panic-btn"
              onClick={() => syncToPanicMonster(selectedDateStr)}
            >
              <Zap size={16} />
              Sync Today's Tasks to Panic Monster
            </button>

            <ul className="task-list" style={{ marginTop: '16px' }}>
              {selectedDayData.tasks.map((task: string, tIdx: number) => {
                const taskId = `daily-${selectedDayData.mIdx}-${selectedDayData.wIdx}-${selectedDayData.dIdx}-${tIdx}`;
                const isDone = completedTasks[taskId];

                return (
                  <li
                    key={taskId}
                    className={`task-item ${isDone ? "completed" : ""}`}
                    onClick={() => toggleTask(taskId)}
                  >
                    {isDone ? (
                      <CheckCircle2 className="icon-check" size={18} />
                    ) : (
                      <Circle className="icon-uncheck" size={18} />
                    )}
                    <div className="task-text" style={{ whiteSpace: 'pre-wrap' }}>{task}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
