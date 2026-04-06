import fs from 'fs';

const IGNORE_HEADERS = [/Summary/i, /Core Principle/i, /Rules/i, /Targeting/i, /Projects/i, /Monthly Summary/i, /Non-Negotiable/i, /Interconnection/i, /Cold Email/i, /Case Studies Documented/i, /The 4 Projects/i];

function parse(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const months = [];
    let currentMonth = null;
    let currentWeek = null;
    let currentDay = null;

    for (let line of lines) {
        const t = line.trim();
        if (!t || t === '---') continue;

        // Level 1: MONTH/Project
        const mMatch = t.match(/^#+\s+(?:MONTHS?|Months?|Project|Phase)\s+([\d\u2013\-\s]+)\s*[:\u2013\u2014\-\.· ]*(.*)/i);
        if (mMatch && !t.includes('Week')) {
            const title = mMatch[2].trim();
            if (IGNORE_HEADERS.some(re => re.test(title || mMatch[0]))) continue;
            
            currentMonth = { title: title || `Month ${mMatch[1].trim()}`, weeks: [] };
            months.push(currentMonth);
            currentWeek = null;
            currentDay = null;
            continue;
        }

        if (!currentMonth) continue;

        // Level 2: Week
        const wMatch = t.match(/^#+\s+(?:Months?\s+\d+,?\s+)?Weeks?\s+([\d\-\.\s\u2013\-\s]+)(?:[:\u2013\u2014\-\.· ]+(.*))?/i);
        if (wMatch) {
            const weekNum = wMatch[1].trim();
            const weekTitle = (wMatch[2] || "").trim();
            currentWeek = { title: `Week ${weekNum}${weekTitle ? ': ' + weekTitle : ''}`, days: [] };
            currentMonth.weeks.push(currentWeek);
            currentDay = null;
            continue;
        }

        // Level 3: Day
        const dMatch = t.match(/^#+\s+(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)(.*)/i) || 
                       t.match(/^\*\*(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|WEEKEND)[^*]*\*\*(.*)/i);
        if (dMatch) {
            if (!currentWeek) {
                currentWeek = { title: 'Overview', days: [] };
                currentMonth.weeks.push(currentWeek);
            }
            const dayName = dMatch[1].charAt(0).toUpperCase() + dMatch[1].slice(1).toLowerCase();
            currentDay = { title: `${dayName}${dMatch[2] ? dMatch[2].trim().replace(/^[:\u2013\u2014\-\.· ]+/, ': ') : ''}`, tasks: [] };
            currentWeek.days.push(currentDay);
            continue;
        }

        // Everything else is a task
        if (!t.startsWith('#')) {
            if (!currentWeek) continue;
            if (!currentDay) {
                currentDay = { title: 'Overview', tasks: [] };
                currentWeek.days.push(currentDay);
            }
            currentDay.tasks.push(line);
        }
    }

    return months.map(m => ({
        ...m,
        weeks: m.weeks.map(w => ({
            ...w,
            days: w.days.map(d => {
                let merged = [];
                let currentItem = [];
                for (let taskLine of d.tasks) {
                    const tl = taskLine.trim();
                    if (!tl) continue;
                    if (tl.startsWith('- ') || tl.startsWith('* ') || tl.startsWith('|')) {
                        if (currentItem.length > 0) merged.push(currentItem.join('\n').trim());
                        currentItem = [taskLine];
                    } else if (tl.startsWith('**') && tl.length < 100) {
                        if (currentItem.length > 0) merged.push(currentItem.join('\n').trim());
                        currentItem = [taskLine];
                    } else if (currentItem.length === 0) {
                        currentItem = [taskLine];
                    } else {
                        currentItem.push(taskLine);
                    }
                }
                if (currentItem.length > 0) merged.push(currentItem.join('\n').trim());
                return { ...d, tasks: merged.filter(x => x.length > 0) };
            }).filter(d => d.tasks.length > 0)
        })).filter(w => w.days.length > 0)
    })).filter(m => m.weeks.length > 0);
}

// Update tasks.json
const mastery = parse('master 1.md');
fs.writeFileSync('./src/tasks.json', JSON.stringify(mastery, null, 2));
console.log(`Mastery: ${mastery.length} months`);

// Update alternatePlans.json
const FILES = [
  { file: 'plan_datadog_confluent.md', id: 'datadog', name: 'Datadog · Confluent', emoji: '🔭', subtitle: 'ObserveFlow · StreamBridge · CrystalDB · VaultAuth', color: '#3b82f6' },
  { file: 'plan_jiohotstar_razorpay.md', id: 'jiohotstar', name: 'JioHotstar · Razorpay', emoji: '📺', subtitle: 'StreamEdge · PayRail · BazaarFast · InsightHub', color: '#ef4444' },
  { file: 'plan_rippling_databricks.md', id: 'rippling', name: 'Rippling · Databricks', emoji: '⚙️', subtitle: 'WorkOS · SparkFlow · PayCore · LakeAI', color: '#a855f7' },
  { file: 'plan_uber_doordash_palantir.md', id: 'uber', name: 'Uber · DoorDash · Palantir', emoji: '🚗', subtitle: 'DispatchOS · CourierNet · FoundryOS · AIPilot', color: '#10b981' },
];

const altResults = FILES.map(f => {
    const months = parse(f.file);
    console.log(`${f.id}: ${months.length} months`);
    return { ...f, months };
});
fs.writeFileSync('./src/alternatePlans.json', JSON.stringify(altResults, null, 2));
