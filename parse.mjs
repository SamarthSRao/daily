import fs from 'fs';

const content = fs.readFileSync('mastery_plan.md', 'utf-8');
const lines = content.split(/\r?\n/);

const data = [];
let currentMonth = null;
let currentWeek = null;
let currentDay = null;
let inCodeBlock = false;

for (let line of lines) {
  const trimmed = line.trim();

  // 1. Handle Code Blocks
  if (trimmed.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    if (currentDay) {
      currentDay.tasks.push(line);
    }
    continue;
  }

  if (inCodeBlock) {
    if (currentDay) {
      currentDay.tasks.push(line);
    }
    continue;
  }

  // 2. Month headers: # MONTH ... or ## MONTH ...
  // Loose separator: any non-word character sequence
  const monthMatch = line.match(/^#+\s+(?:MONTHS?|Months?)\s+([\d\u2013\-\s]+)[^a-z0-9](.+)/i);
  if (monthMatch) {
    currentMonth = { title: `MONTH ${monthMatch[1].trim()}: ${monthMatch[2].trim()}`, weeks: [] };
    data.push(currentMonth);
    currentWeek = null;
    currentDay = null;
    continue;
  }

  // 3. Week headers: ## Week ... or ### Week ...
  const weekMatch = line.match(/^#+\s+Weeks?\s+([\d\u2013\-\s]+)(?:\s*\([^)]+\))?[^a-z0-9\s](.+)/i) || 
                   line.match(/^#+\s+Weeks?\s+([\d\u2013\-\s]+)/i);
  if (weekMatch && !line.match(/^#+\s+(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)/i)) {
    if (!currentMonth) {
      currentMonth = { title: "Introduction", weeks: [] };
      data.push(currentMonth);
    }
    const weekNum = weekMatch[1].trim();
    const weekTitle = weekMatch[2] ? weekMatch[2].trim() : "";
    currentWeek = { title: `Week ${weekNum}${weekTitle ? ': ' + weekTitle : ''}`, days: [] };
    currentMonth.weeks.push(currentWeek);
    currentDay = null;
    continue;
  }

  // 4. Day-like headers (Monday, Tuesday, etc.) or combined Day-Week headers
  const dayMatch = line.match(/^#+\s+(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)(?:\s+[^a-z0-9\s]\s*(.+))?/i);
  if (dayMatch) {
    if (!currentMonth) {
      currentMonth = { title: "Introduction", weeks: [] };
      data.push(currentMonth);
    }
    
    const weekInDayMatch = line.match(/Week\s+([\d\u2013\-]+)/i);
    if (weekInDayMatch) {
       const weekNum = weekInDayMatch[1];
       if (!currentWeek || !currentWeek.title.includes(`Week ${weekNum}`)) {
          currentWeek = { title: `Week ${weekNum}`, days: [] };
          currentMonth.weeks.push(currentWeek);
       }
    }

    if (!currentWeek) {
      currentWeek = { title: "Overview", days: [] };
      currentMonth.weeks.push(currentWeek);
    }

    const dayName = dayMatch[1].charAt(0) + dayMatch[1].slice(1).toLowerCase();
    let subTitle = dayMatch[2] ? dayMatch[2].trim() : "";
    subTitle = subTitle.replace(/Week\s+[\d\u2013\-]+\s*[\u2013\u2014·]?\s*/i, '').trim();
    
    currentDay = { title: subTitle ? `${dayName}: ${subTitle}` : dayName, tasks: [] };
    currentWeek.days.push(currentDay);
    continue;
  }

  // 5. Tasks (Only capture if inside a Day)
  if (currentDay && trimmed !== '' && trimmed !== '---') {
    currentDay.tasks.push(line);
  }
}

// ── Merging Logic ──
for (let m of data) {
  for (let w of m.weeks) {
    for (let d of w.days) {
      let mergedTasks = [];
      let currentItem = [];
      let inCode = false;

      for (let t of d.tasks) {
        const lt = t.trim();

        if (lt.startsWith('```')) {
          if (!inCode) {
            if (currentItem.length > 0) mergedTasks.push(currentItem.join('\n').trim());
            currentItem = [t];
            inCode = true;
          } else {
            currentItem.push(t);
            mergedTasks.push(currentItem.join('\n').trim());
            currentItem = [];
            inCode = false;
          }
          continue;
        }

        if (inCode) {
          currentItem.push(t);
          continue;
        }

        if (lt === '') {
          if (currentItem.length > 0) {
            mergedTasks.push(currentItem.join('\n').trim());
            currentItem = [];
          }
          continue;
        }

        if (lt.startsWith('- ') || 
            lt.startsWith('* ') || 
            lt.startsWith('> ') || 
            lt.startsWith('**') || 
            lt.startsWith('|') ||
            lt.match(/^\d+\.\s/)) {
          if (currentItem.length > 0) {
            mergedTasks.push(currentItem.join('\n').trim());
            currentItem = [];
          }
          currentItem.push(t);
          continue;
        }

        currentItem.push(t);
      }

      if (currentItem.length > 0) mergedTasks.push(currentItem.join('\n').trim());
      d.tasks = mergedTasks.filter(it => it.length > 0);
    }
  }
}

const filtered = data.filter(m => m.weeks.length > 0);

fs.writeFileSync('./src/tasks.json', JSON.stringify(filtered, null, 2));
console.log('Parsed successfully! Found ' + filtered.length + ' months.');
filtered.forEach(m => console.log(` - ${m.title} (${m.weeks.length} weeks)`));
