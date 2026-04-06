const fs = require('fs');
const path = require('path');

const FILES = [
  {
    file: 'plan_datadog_confluent.md',
    id: 'datadog',
    name: 'Datadog · Confluent',
    emoji: '🔭',
    subtitle: 'ObserveFlow · StreamBridge · CrystalDB · VaultAuth — Observability + Kafka + Auth',
    color: '#3b82f6',
  },
  {
    file: 'plan_jiohotstar_razorpay.md',
    id: 'jiohotstar',
    name: 'JioHotstar · Razorpay',
    emoji: '📺',
    subtitle: 'StreamEdge · PayRail · BazaarFast · InsightHub — India Scale Consumer + Fintech',
    color: '#ef4444',
  },
  {
    file: 'plan_rippling_databricks.md',
    id: 'rippling',
    name: 'Rippling · Databricks',
    emoji: '⚙️',
    subtitle: 'WorkOS · SparkFlow · PayCore · LakeAI — Multi-Tenant SaaS + Data Platform',
    color: '#a855f7',
  },
  {
    file: 'plan_uber_doordash_palantir.md',
    id: 'uber',
    name: 'Uber · DoorDash · Palantir',
    emoji: '🚗',
    subtitle: 'DispatchOS · CourierNet · FoundryOS · AIPilot — Real-Time Marketplace + Data/AI',
    color: '#10b981',
  },
];

function parseMarkdown(content) {
  const lines = content.split('\n');
  const months = [];
  let currentMonth = null;
  let currentWeek = null;
  let currentDay = null;
  let currentTask = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const raw = line.trimEnd();

    // Match: ## MONTH N: Title  OR  ### Week N: Title that starts a month section
    // Months are ## MONTH N: ...
    const monthMatch = raw.match(/^##\s+MONTH\s+\d+\s*[:–—]\s*(.+)/i);
    if (monthMatch) {
      currentMonth = { title: monthMatch[1].trim(), weeks: [] };
      months.push(currentMonth);
      currentWeek = null;
      currentDay = null;
      currentTask = null;
      continue;
    }

    // Week headers: ### Week N: Title  (inside a month section)
    const weekMatch = raw.match(/^###\s+Week\s+[\d–\-]+\s*[:–—]\s*(.+)/i);
    if (weekMatch) {
      if (!currentMonth) {
        currentMonth = { title: 'Introduction', weeks: [] };
        months.push(currentMonth);
      }
      currentWeek = { title: `Week ${weekMatch[1].trim()}`, days: [] };
      // Extract week number for proper title
      const weekNumMatch = raw.match(/Week\s+([\d–\-]+)/i);
      if (weekNumMatch) {
        currentWeek.title = `Week ${weekNumMatch[1]}: ${weekMatch[1].trim()}`;
      }
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      currentTask = null;
      continue;
    }

    // Also catch "### Week N-M: ..." (ranges like 17-18)
    const weekRangeMatch = raw.match(/^###\s+Week\s+(\d+[-–]\d+)\s*[:–—]\s*(.+)/i);
    if (weekRangeMatch) {
      // Already caught by above, skip
      continue;
    }

    // Also catch "### Weeks N-M: ..." 
    const weeksMatch = raw.match(/^###\s+Weeks?\s+([\d–\-]+(?:\s*[-–]\s*[\d–\-]+)?)\s*[:–—]\s*(.+)/i);
    if (weeksMatch) {
      if (!currentMonth) {
        currentMonth = { title: 'Introduction', weeks: [] };
        months.push(currentMonth);
      }
      currentWeek = { title: `Weeks ${weeksMatch[1]}: ${weeksMatch[2].trim()}`, days: [] };
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      currentTask = null;
      continue;
    }

    // Day headers: **MONDAY —** or **MONDAY — title** (bold line, not inside a list)
    // Pattern: starts with **DAY — anything** or **DAY (3h):**
    const dayBoldMatch = raw.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)[^*]*\*\*/i);
    if (dayBoldMatch) {
      if (!currentWeek) {
        if (!currentMonth) {
          currentMonth = { title: 'Introduction', weeks: [] };
          months.push(currentMonth);
        }
        currentWeek = { title: 'Week 1', days: [] };
        currentMonth.weeks.push(currentWeek);
      }
      // Extract the full day title from the bold text
      const boldContent = raw.match(/^\*\*([^*]+)\*\*/);
      const dayTitle = boldContent ? boldContent[1].trim() : dayBoldMatch[0].replace(/\*\*/g, '').trim();
      currentDay = { title: dayTitle, tasks: [] };
      currentWeek.days.push(currentDay);
      currentTask = null;

      // If there's content after the bold on the same line, start a task
      const afterBold = raw.replace(/^\*\*[^*]+\*\*/, '').trim();
      if (afterBold && afterBold.length > 2 && !afterBold.startsWith('---')) {
        const taskText = afterBold.replace(/^[\s:–—-]+/, '').trim();
        if (taskText.length > 3) {
          currentTask = taskText;
          currentDay.tasks.push(currentTask);
        }
      }
      continue;
    }

    // Also catch "**Evening (2h): Title**" or "**Morning (3h):**" type headers as day-subsection headers
    // These get rolled into the current day's tasks as a bullet
    const subheaderMatch = raw.match(/^\*\*(Morning|Evening|Afternoon|Morning \(|Evening \(|WEEKEND)[^*]*\*\*/i);
    if (subheaderMatch && currentDay) {
      const boldContent = raw.match(/^\*\*([^*]+)\*\*/);
      const label = boldContent ? boldContent[1].trim() : '';
      const rest = raw.replace(/^\*\*[^*]+\*\*/, '').replace(/^[\s:–—-]+/, '').trim();
      const combined = rest ? `${label}: ${rest}` : label;
      if (combined.length > 3) {
        currentTask = combined;
        currentDay.tasks.push(currentTask);
      }
      continue;
    }

    // Bullet point task lines: "- Feature: ..." or "- Something"
    // Must be inside a day
    if (raw.match(/^[-*]\s+/) && currentDay) {
      const taskText = raw.replace(/^[-*]\s+/, '').trim();
      if (taskText.length > 3 && !taskText.startsWith('[ ]') && !taskText.startsWith('[x]')) {
        currentTask = taskText;
        currentDay.tasks.push(currentTask);
      }
      continue;
    }

    // Continuation lines (no prefix, non-empty, within a day)
    // Only if they're regular text paragraphs after a day header and before the next section
    if (
      currentDay &&
      raw.trim().length > 10 &&
      !raw.startsWith('#') &&
      !raw.startsWith('```') &&
      !raw.startsWith('---') &&
      !raw.startsWith('|') &&
      !raw.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)/i) &&
      !raw.match(/^##/) &&
      !raw.match(/^###/)
    ) {
      // Skip code blocks
      if (raw.startsWith('const ') || raw.startsWith('function ') || raw.startsWith('import ') ||
          raw.startsWith('from ') || raw.startsWith('export ') || raw.startsWith('//') ||
          raw.startsWith('*') || raw.startsWith('{') || raw.startsWith('}') ||
          raw.startsWith('server') || raw.startsWith('let ') || raw.startsWith('var ')) {
        continue;
      }

      // If this looks like prose continuation of a task, append to last task
      if (currentTask && currentDay.tasks.length > 0 && raw.trim() && !raw.startsWith('*') && !raw.startsWith('`')) {
        // Append as continuation (not a new bullet)
        // Don't append — keep tasks clean, skip continuation prose
      }
    }
  }

  // Clean up: remove months/weeks/days with no content
  return months
    .filter(m => m.weeks.length > 0)
    .map(m => ({
      ...m,
      weeks: m.weeks
        .filter(w => w.days.length > 0)
        .map(w => ({
          ...w,
          days: w.days.filter(d => d.tasks.length > 0),
        }))
        .filter(w => w.days.length > 0),
    }))
    .filter(m => m.weeks.length > 0);
}

const planDir = path.join(__dirname);
const result = FILES.map(meta => {
  const content = fs.readFileSync(path.join(planDir, meta.file), 'utf8');
  const months = parseMarkdown(content);
  console.log(`${meta.id}: ${months.length} months, ${months.reduce((a, m) => a + m.weeks.length, 0)} weeks, ${months.reduce((a, m) => m.weeks.reduce((b, w) => b + w.days.length, 0) + a, 0)} days`);
  return {
    id: meta.id,
    name: meta.name,
    emoji: meta.emoji,
    subtitle: meta.subtitle,
    color: meta.color,
    months,
  };
});

const outPath = path.join(planDir, 'src', 'alternatePlans.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log('Written to', outPath);
