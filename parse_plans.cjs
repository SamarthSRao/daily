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
  const lines = content.split(/\r?\n/);
  const months = [];
  let currentMonth = null;
  let currentWeek = null;
  let currentDay = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // 1. Month Header: ## MONTH N: Title
    const monthMatch = raw.match(/^##\s+MONTHS?\s+([\d\u2013\-]+)\s*[:\u2013\u2014]\s*(.+)/i);
    if (monthMatch) {
      currentMonth = { title: monthMatch[2].trim(), weeks: [] };
      months.push(currentMonth);
      currentWeek = null;
      currentDay = null;
      continue;
    }

    // IGNORE everything before the first month
    if (!currentMonth) continue;

    // 2. Week Header: ### Week N: Title
    const weekMatch = raw.match(/^###\s+Weeks?\s+([\d\u2013\-\s]+)(?:\s*\([^)]+\))?\s*[:\u2013\u2014]\s*(.+)/i);
    if (weekMatch) {
      currentWeek = { title: `Week ${weekMatch[1].trim()}: ${weekMatch[2].trim()}`, days: [] };
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      continue;
    }

    // 3. Day Header: **MONDAY — ...** or **MONDAY (3h):**
    const dayBoldMatch = trimmed.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)[^*]*\*\*/i);
    if (dayBoldMatch) {
      const boldContentMatch = trimmed.match(/^\*\*([^*]+)\*\*/);
      const dayTitle = boldContentMatch ? boldContentMatch[1].trim() : "Focus";
      
      currentDay = { title: dayTitle, tasks: [] };
      if (!currentWeek) {
        currentWeek = { title: "General Overview", days: [] };
        currentMonth.weeks.push(currentWeek);
      }
      currentWeek.days.push(currentDay);

      const rest = raw.replace(/^\*\*[^*]+\*\*/, '').trim();
      if (rest && rest.length > 2 && !rest.startsWith('---')) {
        const cleanedRest = rest.replace(/^[:–—-\s]+/, '').trim();
        if (cleanedRest) currentDay.tasks.push(cleanedRest);
      }
      continue;
    }

    // 4. Task detection
    if ((trimmed.startsWith('- ') || trimmed.startsWith('* ')) && !trimmed.startsWith('- [ ]') && !trimmed.startsWith('* [ ]')) {
      const taskText = trimmed.replace(/^[-*]\s+/, '').trim();
      if (taskText) {
        if (!currentDay) {
          if (!currentWeek) {
            currentWeek = { title: "General Overview", days: [] };
            currentMonth.weeks.push(currentWeek);
          }
          currentDay = { title: "Key Objectives", tasks: [] };
          currentWeek.days.push(currentDay);
        }
        currentDay.tasks.push(taskText);
      }
      continue;
    }

    // 5. Continuation / Subheaders
    const subheaderMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (subheaderMatch && currentDay) {
      currentDay.tasks.push(`**${subheaderMatch[1].trim()}**`);
      continue;
    }
  }

  return months
    .map(m => ({
      ...m,
      weeks: m.weeks.filter(w => w.days.some(d => d.tasks.length > 0))
    }))
    .filter(m => m.weeks.length > 0);
}

const planDir = path.join(__dirname);
const result = [];

for (const meta of FILES) {
  const filePath = path.join(planDir, meta.file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const months = parseMarkdown(content);
  console.log(`${meta.id}: ${months.length} months, ${months.reduce((a, m) => a + m.weeks.length, 0)} weeks`);
  result.push({ ...meta, months });
}

fs.writeFileSync(path.join(planDir, 'src', 'alternatePlans.json'), JSON.stringify(result, null, 2));
console.log('Successfully updated alternatePlans.json');
