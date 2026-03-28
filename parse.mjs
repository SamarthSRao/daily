import fs from 'fs';

function parseFile(sourceFile, summaryTitle) {
  const content = fs.readFileSync(sourceFile, 'utf-8');
  const lines = content.split(/\r?\n/);

  const data = [];
  let currentMonth = null;
  let currentWeek = null;
  let currentDay = null;
  let inCodeBlock = false;
  let introLines = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // Handle Code Blocks
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentDay) currentDay.tasks.push(line);
      else if (!currentMonth) introLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      if (currentDay) currentDay.tasks.push(line);
      else if (!currentMonth) introLines.push(line);
      continue;
    }

    // Month/Stage/Section Headers
    const sectionMatch = line.match(/^#+\s+(?:Stage|Month|MONTHS?|Months?|Section)\s+([\d\u2013\-\s]+)[^a-z0-9,]?(.*)/i) ||
      (line.startsWith('#') && line.includes('Plan') && !currentMonth && line.length > 5 ? [line, line.replace(/^#+\s+/, '')] : null);

    if (sectionMatch && !line.includes('Week')) {
      if (!currentMonth && introLines.length > 0) {
        // Create an "Information" month for the intro text
        currentMonth = { title: "GUIDE & PHILOSOPHY", weeks: [{ title: "Overview", days: [{ title: "Reference", tasks: introLines }] }] };
        data.push(currentMonth);
      }

      const title = sectionMatch[2] ? `${sectionMatch[1].trim()}: ${sectionMatch[2].trim()}` : sectionMatch[1].trim();
      currentMonth = { title: title.toUpperCase(), weeks: [] };
      data.push(currentMonth);
      currentWeek = null;
      currentDay = null;
      continue;
    }

    // Week Headers
    const weekMatch = line.match(/Week\s+([\d\u2013\-\s]+)(?::?\s*(.+))?$/i);
    if (weekMatch && (line.startsWith('###') || line.startsWith('##'))) {
      if (!currentMonth) {
        currentMonth = { title: "INTRODUCTION", weeks: [] };
        data.push(currentMonth);
      }
      const weekNum = weekMatch[1].trim();
      const weekTitle = weekMatch[2] ? weekMatch[2].trim() : "";
      currentWeek = { title: `Week ${weekNum}${weekTitle ? ': ' + weekTitle : ''}`, days: [] };
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      continue;
    }

    // Day Headers
    const dayMatch = line.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)(?:\s+[^a-z0-9\s]\s*(.+))?\*\*/i) ||
      line.match(/^#+\s+(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)(?:\s+[^a-z0-9\s]\s*(.+))?/i);

    if (dayMatch) {
      if (!currentMonth) {
        currentMonth = { title: "INTRODUCTION", weeks: [] };
        data.push(currentMonth);
      }
      if (!currentWeek) {
        currentWeek = { title: "Overview", days: [] };
        currentMonth.weeks.push(currentWeek);
      }

      const dayName = dayMatch[1].charAt(0) + dayMatch[1].slice(1).toLowerCase();
      let subTitle = dayMatch[2] ? dayMatch[2].trim() : "";

      currentDay = { title: subTitle ? `${dayName}: ${subTitle}` : dayName, tasks: [] };
      currentWeek.days.push(currentDay);
      continue;
    }

    // Capture Line as Task or Intro
    if (currentDay) {
      currentDay.tasks.push(line);
    } else if (!currentMonth && trimmed !== '') {
      introLines.push(line);
    }
  }

  // Merge Tasks
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
            if (currentItem.length > 0) { mergedTasks.push(currentItem.join('\n').trim()); currentItem = []; }
            continue;
          }
          if (lt.startsWith('- ') || lt.startsWith('* ') || lt.startsWith('> ') || lt.startsWith('**') || lt.startsWith('|') || lt.match(/^\d+\.\s/)) {
            if (currentItem.length > 0) { mergedTasks.push(currentItem.join('\n').trim()); currentItem = []; }
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

  return data.filter(m => m.weeks.length > 0);
}

// 1. Parse main.md (Daily Plan)
const dailyPlanData = parseFile('main.md', 'DAILY PLAN');
fs.writeFileSync('./src/dailyPlan.json', JSON.stringify(dailyPlanData, null, 2));

// 2. Parse mastery_plan.md (Mastery Plan)
const masteryPlanData = parseFile('mastery_plan.md', 'MASTERY PLAN');
fs.writeFileSync('./src/tasks.json', JSON.stringify(masteryPlanData, null, 2));

// 3. Update alternatePlans.json
const altPlansRaw = fs.readFileSync('./src/alternatePlans.json', 'utf-8');
const altPlans = JSON.parse(altPlansRaw);

// Check if "Daily Plan" already exists, update or add it
const dailyPlanIndex = altPlans.findIndex(p => p.id === 'daily-plan');
const dailyPlanEntry = {
  id: "daily-plan",
  name: "Daily Plan",
  emoji: "📅",
  subtitle: "Integrated Backend Hub",
  color: "#10b981",
  months: dailyPlanData
};

if (dailyPlanIndex >= 0) {
  altPlans[dailyPlanIndex] = dailyPlanEntry;
} else {
  altPlans.push(dailyPlanEntry);
}

fs.writeFileSync('./src/alternatePlans.json', JSON.stringify(altPlans, null, 2));

console.log('Parsed successfully!');
console.log(' - Daily Plan: ' + dailyPlanData.length + ' sections');
console.log(' - Mastery Plan: ' + masteryPlanData.length + ' months');
