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

  for (let line of lines) {
    const raw = line.trimEnd();
    const t = raw.trim();

    // Month / Project / Section
    if (t.startsWith('## ')) {
      const title = t.replace(/^##\s+(?:MONTHS?|Months?|Project)\s*[\d\u2013\-]*\s*[:\u2013\u2014–]?\s*/i, '').trim() || t.replace(/^##\s*/, '');
      currentMonth = { title, weeks: [] };
      months.push(currentMonth);
      currentWeek = null;
      currentDay = null;
      continue;
    }

    if (!currentMonth) continue;

    // Week
    if (t.startsWith('### ')) {
      const title = t.replace(/^###\s*(?:Months?\s+\d+,\s+)?(?:Weeks?\s+[\d\u2013\-]+\s*[:\u2013\u2014–]?\s*)?/i, '').trim() || t.replace(/^###\s*/, '');
      currentWeek = { title, days: [] };
      currentMonth.weeks.push(currentWeek);
      currentDay = null;
      continue;
    }

    if (!currentWeek) continue;

    // Day
    const dayMatch = t.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)[^*]*\*\*/i);
    if (dayMatch) {
      const dayName = dayMatch[1].charAt(0) + dayMatch[1].slice(1).toLowerCase();
      let title = t.replace(/^\*\*[^*]+\*\*/, '').replace(/^[\s:–—-]+/, '').trim() || dayName;
      currentDay = { title, tasks: [] };
      currentWeek.days.push(currentDay);
      continue;
    }

    // Tasks (bullet points or bold subheaders)
    if (currentDay) {
      if (t.startsWith('- ') || t.startsWith('* ')) {
        const task = t.replace(/^[-*]\s+/, '').trim();
        if (task && !task.startsWith('[ ]')) {
          currentDay.tasks.push(task);
        }
      } else if (t.startsWith('**') && t.endsWith('**') && t.length < 100) {
        currentDay.tasks.push(t.replace(/\*\*/g, '').trim());
      }
    }
  }

  return months.filter(m => m.weeks.length > 0);
}

const result = FILES.map(meta => {
  const filePath = path.join(__dirname, meta.file);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const months = parseMarkdown(content);
  console.log(`${meta.id}: ${months.length} sections found`);
  return { ...meta, months };
}).filter(Boolean);

fs.writeFileSync(path.join(__dirname, 'src', 'alternatePlans.json'), JSON.stringify(result, null, 2));
console.log('Done.');
