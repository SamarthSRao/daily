import json
import re
from datetime import datetime, timedelta

md_path = r'c:\Users\samar\OneDrive\Desktop\family\daily\Backend_Engineering_Mastery_Plan_2026 (2).md'
daily_path = r'c:\Users\samar\OneDrive\Desktop\family\daily\src\data\dailyPlan.json'

with open(md_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

months = []
current_month = None
current_week = None
current_day = None

start_date = datetime(2026, 6, 15)

def get_week_num(title):
    match = re.search(r'Week[s]?\s+(\d+)', title, re.IGNORECASE)
    return int(match.group(1)) if match else None

def get_week_end_num(title):
    match = re.search(r'Week[s]?\s+\d+-(\d+)', title, re.IGNORECASE)
    return int(match.group(1)) if match else get_week_num(title)

weekdays = {
    'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
    'friday': 4, 'saturday': 5, 'sunday': 6, 'weekend': 5
}

def find_target_weekday(title_lower):
    best_idx = 999
    best_val = None
    for w, val in weekdays.items():
        idx = title_lower.find(w)
        if idx != -1 and idx < best_idx:
            best_idx = idx; best_val = val
    return best_val

for line in lines:
    line_s = line.strip()
    
    if line_s.startswith('# MONTH '):
        title = line_s.replace('# ', '').strip()
        current_month = {"title": title, "weeks": []}
        months.append(current_month)
        current_week = None
        current_day = None
        continue
        
    if line_s.startswith('## Week ') or line_s.startswith('## Weeks '):
        if not current_month:
            current_month = {"title": "PRE-REQUISITES", "weeks": []}
            months.append(current_month)
            
        title = line_s.replace('## ', '').strip()
        start_w = get_week_num(title)
        end_w = get_week_end_num(title)
        
        current_week = {
            "title": title, 
            "start_w": start_w,
            "end_w": end_w,
            "days": [],
            "buffered_tasks": []
        }
        current_month['weeks'].append(current_week)
        current_day = None
        continue
        
    if line_s.startswith('### '):
        title = line_s.replace('### ', '').strip()
        title_lower = title.lower()
        target_wd = find_target_weekday(title_lower)
        
        if target_wd is None:
            if current_day:
                current_day['tasks'].append(f"## {title}")
            elif current_week:
                current_week['buffered_tasks'].append(f"## {title}")
            continue

        if not current_month:
            current_month = {"title": "PRE-REQUISITES", "weeks": []}
            months.append(current_month)
        if not current_week:
            current_week = {"title": "General", "start_w": 1, "end_w": 1, "days": [], "buffered_tasks": []}
            current_month['weeks'].append(current_week)
            
        week_offset = current_week.get('start_w')
        if not week_offset: week_offset = 1
        
        day_date = start_date + timedelta(weeks=week_offset - 1)
        while day_date.weekday() != target_wd:
            day_date += timedelta(days=1)
            
        current_day = {
            "title": title,
            "date": day_date.strftime('%Y-%m-%d'),
            "tasks": []
        }
        current_week['days'].append(current_day)
        continue
        
    if line_s and not line_s.startswith('---'):
        if current_day:
            current_day['tasks'].append(line_s)
        elif current_week:
            current_week['buffered_tasks'].append(line_s)

for m in months:
    for w in m['weeks']:
        if 'buffered_tasks' not in w or not w['buffered_tasks']:
            w.pop('buffered_tasks', None)
            w.pop('start_w', None)
            w.pop('end_w', None)
            continue
        
        start_w = w.get('start_w') or 1
        end_w = w.get('end_w') or start_w
        num_weeks = max(1, end_w - start_w + 1)
        total_weekdays = num_weeks * 5
        
        tasks = w['buffered_tasks']
        chunk_size = max(1, len(tasks) // total_weekdays)
        
        chunk_idx = 0
        for wk in range(num_weeks):
            for wd in range(5):
                if chunk_idx >= len(tasks):
                    break
                    
                chunk_tasks = tasks[chunk_idx : chunk_idx + chunk_size]
                chunk_idx += chunk_size
                
                if wk == num_weeks - 1 and wd == 4:
                    chunk_tasks = tasks[chunk_idx - chunk_size:]
                    chunk_idx = len(tasks)
                    
                if not chunk_tasks:
                    continue
                    
                day_date = start_date + timedelta(weeks=start_w - 1 + wk, days=wd)
                
                w['days'].append({
                    "title": f"{['Monday','Tuesday','Wednesday','Thursday','Friday'][wd]} \u2014 {w['title']}",
                    "date": day_date.strftime('%Y-%m-%d'),
                    "tasks": chunk_tasks
                })

        w.pop('buffered_tasks', None)
        w.pop('start_w', None)
        w.pop('end_w', None)

with open(daily_path, 'w', encoding='utf-8') as f:
    json.dump(months, f, indent=2)

print("Parsed successfully!")
