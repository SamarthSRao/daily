import fs from 'fs';

const content = fs.readFileSync('properrr.md', 'utf-8');
const lines = content.split(/\r?\n/);

const data = [];
let currentMonth = null;
let currentWeek = null;
let currentDay = null;
let inCodeBlock = false;

for (let line of lines) {
  const trimmed = line.trim();

  // 1. Handle Code Blocks (Strictly content)
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

  // 2. Month headers (Strict: Starts with ## MONTH)
  const monthMatch = line.match(/^##\s+MONTHS?\s+([\d\u2013\-]+)\s*[:\u2013\u2014]\s*(.+)/i);
  if (monthMatch) {
    currentMonth = { title: `MONTH ${monthMatch[1]}: ${monthMatch[2].trim()}`, weeks: [] };
    data.push(currentMonth);
    currentWeek = null;
    currentDay = null;
    continue;
  }

  // 3. Week headers (Strict: Starts with ### Week)
  // Handles variant: ### Week 15 (detail): title
  const weekMatch = line.match(/^###\s+Week\s+([\d\u2013\-]+)(?:\s*\([^)]+\))?\s*[:\u2013\u2014]\s*(.+)/i);
  if (weekMatch) {
    if (!currentMonth) continue;
    currentWeek = { title: `Week ${weekMatch[1]}: ${weekMatch[2].trim()}`, days: [] };
    currentMonth.weeks.push(currentWeek);
    currentDay = null;
    continue;
  }

  // 4. Day headers (Strict: Starts with ####)
  if (line.startsWith('#### ')) {
    if (!currentWeek) continue; // IGNORE days that aren't inside an explicit Week block
    const title = line.replace(/^#### /, '').trim();
    currentDay = { title, tasks: [] };
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

// Final Filter: Only keep months that actually have weeks
const filtered = data.filter(m => m.weeks.length > 0);

fs.writeFileSync('./src/tasks.json', JSON.stringify(filtered, null, 2));
console.log('Parsed successfully! Found ' + filtered.length + ' months.');
filtered.forEach(m => console.log(` - ${m.title} (${m.weeks.length} weeks)`));
