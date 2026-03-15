import fs from 'fs';

const content = fs.readFileSync('properrr.md', 'utf-8');
const lines = content.split(/\r?\n/);

const data = [];

// Initialize with a catch-all for the very top of the file
let currentMonth = null;
let currentWeek = null;
let currentDay = null;

function ensureMonth(title = "Preface / Intro") {
  if (!currentMonth) {
    currentMonth = { title, weeks: [] };
    data.push(currentMonth);
  }
  return currentMonth;
}

function ensureWeek(title = "General Context") {
  ensureMonth();
  if (!currentWeek) {
    currentWeek = { title, days: [] };
    currentMonth.weeks.push(currentWeek);
  }
  return currentWeek;
}

function ensureDay(title = "Overview") {
  ensureWeek();
  if (!currentDay) {
    currentDay = { title, tasks: [] };
    currentWeek.days.push(currentDay);
  }
  return currentDay;
}

let inCodeBlock = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  if (trimmed.startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    ensureDay().tasks.push(line);
    continue;
  }

  if (inCodeBlock) {
    ensureDay().tasks.push(line);
    continue;
  }

  // Header detection
  if (line.startsWith('# ')) {
     const title = line.replace(/^# /, '').trim();
     currentMonth = { title, weeks: [] };
     data.push(currentMonth);
     currentWeek = null;
     currentDay = null;
     continue;
  }
  if (line.startsWith('## ')) {
    const title = line.replace(/^## /, '').trim();
    currentMonth = { title, weeks: [] };
    data.push(currentMonth);
    currentWeek = null;
    currentDay = null;
    continue;
  }
  if (line.startsWith('### ')) {
    const title = line.replace(/^### /, '').trim();
    ensureMonth();
    currentWeek = { title, days: [] };
    currentMonth.weeks.push(currentWeek);
    currentDay = null;
    continue;
  }
  if (line.startsWith('#### ')) {
    const title = line.replace(/^#### /, '').trim();
    ensureWeek();
    currentDay = { title, tasks: [] }; 
    currentWeek.days.push(currentDay);
    continue;
  }

  // Content line
  if (trimmed === '---') continue;
  if (!trimmed && !currentDay) continue; // Skip empty lines outside days

  // Add line to current day (ensuring it exists)
  ensureDay().tasks.push(line);
}

// ── Merging Logic ──
for (let m of data) {
  for (let w of m.weeks) {
    for (let d of w.days) {
      let mergedTasks = [];
      let currentItem = [];
      let inCode = false;

      for (let t of d.tasks) {
        const lineTrimmed = t.trim();

        if (lineTrimmed.startsWith('```')) {
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

        if (lineTrimmed === '') {
          if (currentItem.length > 0) {
            mergedTasks.push(currentItem.join('\n').trim());
            currentItem = [];
          }
          continue;
        }

        // Split on bullets, quotes, or bold headers
        if (lineTrimmed.startsWith('- ') || 
            lineTrimmed.startsWith('* ') || 
            lineTrimmed.startsWith('> ') || 
            lineTrimmed.startsWith('**') || 
            lineTrimmed.match(/^\d+\.\s/)) {
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

// Final cleanup: Remove sections that are just empty titles/dead branches
const cleaned = data.filter(m => {
  m.weeks = m.weeks.filter(w => {
    w.days = w.days.filter(d => d.tasks.length > 0);
    return w.days.length > 0 || w.title.includes('Week');
  });
  return m.weeks.length > 0 || m.title.includes('MONTH');
});

fs.writeFileSync('./src/tasks.json', JSON.stringify(cleaned, null, 2));
console.log('Final parse complete. Sections: ' + cleaned.length);
