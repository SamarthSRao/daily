import fs from 'fs';

function parseMainMd() {
    const content = fs.readFileSync('main.md', 'utf-8');
    const lines = content.split(/\r?\n/);

    const sections = [];
    let currentSection = null;
    let currentWeek = null;
    let currentDay = null;
    let introTasks = [];

    for (let line of lines) {
        const trimmed = line.trim();

        // Stage/Section Headers (## Stage 1: ...)
        const stageMatch = line.match(/^##\s+(?:⚡\s+)?(Stage\s+\d+:?\s*.*)/i) ||
            line.match(/^##\s+(?:🖥️\s+)?(Stage\s+\d+:?\s*.*)/i) ||
            line.match(/^##\s+(.+)/);

        if (stageMatch && !line.includes('---') && !line.includes('Week') && !line.includes('Day')) {
            const title = stageMatch[1].trim();
            currentSection = { title: title.toUpperCase(), weeks: [] };
            sections.push(currentSection);
            currentWeek = { title: "Activities", days: [] };
            currentSection.weeks.push(currentWeek);
            currentDay = { title: "Curriculum", tasks: [] };
            currentWeek.days.push(currentDay);
            continue;
        }

        // Capture every line as a task if it's within a section
        if (currentDay && trimmed !== '') {
            currentDay.tasks.push(line);
        } else if (!currentSection && trimmed !== '') {
            introTasks.push(line);
        }
    }

    // Prepend Introduction if exists
    if (introTasks.length > 0) {
        const intro = {
            title: "GUIDE & PHILOSOPHY",
            weeks: [{
                title: "Overview",
                days: [{
                    title: "Introduction",
                    tasks: introTasks
                }]
            }]
        };
        sections.unshift(intro);
    }

    return sections;
}

const data = parseMainMd();
fs.writeFileSync('./src/dailyPlan.json', JSON.stringify(data, null, 2));

// Update alternatePlans.json
const altPlansRaw = fs.readFileSync('./src/alternatePlans.json', 'utf-8');
const altPlans = JSON.parse(altPlansRaw);

const dailyPlanIndex = altPlans.findIndex(p => p.id === 'daily-plan');
const dailyPlanEntry = {
    id: "daily-plan",
    name: "Daily Plan",
    emoji: "📂",
    subtitle: "Full Mastery Roadmap (main.md)",
    color: "#10b981",
    months: data
};

if (dailyPlanIndex >= 0) {
    altPlans[dailyPlanIndex] = dailyPlanEntry;
} else {
    altPlans.push(dailyPlanEntry);
}

fs.writeFileSync('./src/alternatePlans.json', JSON.stringify(altPlans, null, 2));
console.log('Daily Plan generated and added to alternatePlans.json');
