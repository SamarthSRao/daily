import fs from 'fs';

const content = fs.readFileSync('properrr.md', 'utf-8');
const lines = content.split(/\r?\n/);

const data = [];
let currentMonth = null;
let currentWeek = null;
let currentDay = null;

for (let line of lines) {
  if (line.trim().startsWith('## MONTH ')) {
    currentMonth = { title: line.replace(/^## /, '').trim(), weeks: [] };
    data.push(currentMonth);
    currentWeek = null;
    currentDay = null;
  } else if (line.trim().startsWith('### Week ')) {
    currentWeek = { title: line.replace(/^### /, '').trim(), days: [] };
    if (currentMonth) {
      currentMonth.weeks.push(currentWeek);
    } else {
      // If we see a week without a month, wrap it in a dummy month
      currentMonth = { title: "Uncategorized Month", weeks: [currentWeek] };
      data.push(currentMonth);
    }
    currentDay = null;
  } else if (line.trim().startsWith('#### ')) {
    currentDay = { title: line.replace(/^#### /, '').trim(), tasks: [] };
    if (currentWeek) {
      currentWeek.days.push(currentDay);
    } else if (currentMonth) {
      // Fallback
      currentWeek = { title: "Uncategorized Week", days: [currentDay] };
      currentMonth.weeks.push(currentWeek);
    }
  } else if (currentDay) {
    // Only capture list items, paragraphs, code blocks if they are tasks. 
    // We'll just capture everything as markdown text for the day, but we'll prune empty lines
    if (line.trim() !== '' && !line.startsWith('---')) {
      currentDay.tasks.push(line);
    }
  }
}

// Clean up trailing text that might be too long and just group as paragraphs
for (let m of data) {
  for (let w of m.weeks) {
    for (let d of w.days) {
      let mergedTasks = [];
      let currentItem = '';
      let inCodeBlock = false;
      for (let t of d.tasks) {
        if (t.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          currentItem += '\n' + t;
        } else if (inCodeBlock) {
          currentItem += '\n' + t;
        } else if (t.startsWith('**') || t.startsWith('- ')) {
          if (currentItem.trim()) mergedTasks.push(currentItem.trim());
          currentItem = t;
        } else {
          currentItem += '\n' + t;
        }
      }
      if (currentItem.trim()) mergedTasks.push(currentItem.trim());
      d.tasks = mergedTasks;
    }
  }
}


fs.writeFileSync('./src/tasks.json', JSON.stringify(data, null, 2));
console.log('Parsed successfully! Found ' + data.length + ' months.');
