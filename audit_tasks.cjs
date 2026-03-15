const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(path.join(__dirname, 'properrr.md'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/tasks.json'), 'utf8'));

// ── Parse markdown into month → week → day structure ──────────────────────────
const mdMonths = [];
let curMonth = null, curWeek = null, curDay = null;
let inCodeBlock = false;

const lines = md.split('\n');
for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];

  if (raw.startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
  if (inCodeBlock) continue;

  // Month: ## MONTH N: Title  or  ## MONTHS N–M: Title
  const mMatch = raw.match(/^##\s+MONTHS?\s+([\d–\-]+)\s*[:–—]\s*(.+)/i);
  if (mMatch) {
    curMonth = { num: mMatch[1], title: mMatch[2].trim(), weeks: [], line: i + 1 };
    mdMonths.push(curMonth);
    curWeek = null; curDay = null;
    continue;
  }

  // Week: ### Week N (detail): Title  or  ### Week N: Title  or  ### Week N–M: Title
  const wMatch = raw.match(/^###\s+Week\s+([\d]+)(?:\s*[\(\[]?detail[\)\]]?)?\s*[:–—]\s*(.+)/i);
  if (wMatch) {
    if (!curMonth) { curMonth = { num: '?', title: 'Preamble', weeks: [], line: 0 }; mdMonths.push(curMonth); }
    curWeek = { num: wMatch[1], title: `Week ${wMatch[1]}: ${wMatch[2].trim()}`, days: [], line: i + 1 };
    curMonth.weeks.push(curWeek);
    curDay = null;
    continue;
  }

  // Day headers: #### Monday / #### Tuesday / #### Monday–Tuesday etc.
  const dayH4 = raw.match(/^####\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Weekend|Case Study|System Design|DSA Sprint|Behavioral|Target)/i);
  if (dayH4) {
    if (!curWeek) continue;
    const dayTitle = raw.replace(/^####\s+/, '').trim();
    curDay = { title: dayTitle, tasks: [], line: i + 1 };
    curWeek.days.push(curDay);
    continue;
  }
}

// ── Render pretty tables ──────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════');
console.log('         properrr.md ↔ tasks.json — FULL AUDIT REPORT');
console.log('════════════════════════════════════════════════════════════\n');

// Summary counts
let mdTotalDays = 0, jsonTotalDays = 0;
mdMonths.forEach(m => m.weeks.forEach(w => mdTotalDays += w.days.length));
json.forEach(m => (m.weeks || []).forEach(w => jsonTotalDays += (w.days || []).length));

console.log('STRUCTURE OVERVIEW:');
console.log(`  properrr.md → ${mdMonths.length} months, ${mdMonths.reduce((a,m) => a+m.weeks.length, 0)} weeks, ${mdTotalDays} days`);
console.log(`  tasks.json  → ${json.length} months, ${json.reduce((a,m) => a+(m.weeks||[]).length, 0)} weeks, ${jsonTotalDays} days`);
console.log();

// Month count match
if (mdMonths.length !== json.length) {
  console.log(`⚠️  Month count differs: MD=${mdMonths.length}, JSON=${json.length}`);
}

const issues = [];

// ── Week comparison ───────────────────────────────────────────────────────────
console.log('WEEK-BY-WEEK COMPARISON:');
console.log('─'.repeat(60));

mdMonths.forEach((mdMonth, mIdx) => {
  const jMonth = json[mIdx];
  const mLabel = `Month ${mdMonth.num}`;

  if (!jMonth) {
    issues.push(`❌ ${mLabel} "${mdMonth.title}" has NO entry in tasks.json`);
    console.log(`${mLabel}: ❌ MISSING in tasks.json`);
    return;
  }

  const mdW = mdMonth.weeks.length;
  const jW = (jMonth.weeks || []).length;
  const wOK = mdW === jW;

  // Print month header
  console.log(`\n${mLabel}: "${mdMonth.title.substring(0,45)}" — MD:${mdW}wks JSON:${jW}wks ${wOK ? '✅' : '❌'}`);

  if (!wOK) {
    issues.push(`❌ ${mLabel}: MD has ${mdW} weeks, JSON has ${jW} weeks`);
  }

  // Per-week comparison
  const maxW = Math.max(mdW, jW);
  for (let wi = 0; wi < maxW; wi++) {
    const mdWeek = mdMonth.weeks[wi];
    const jWeek = (jMonth.weeks || [])[wi];

    if (!mdWeek && jWeek) {
      console.log(`  Week[${wi+1}]: ❌ EXTRA in JSON — "${jWeek.title}"`);
      issues.push(`  ❌ ${mLabel} Week[${wi+1}]: Extra in JSON: "${jWeek.title}"`);
      continue;
    }
    if (mdWeek && !jWeek) {
      console.log(`  Week[${wi+1}]: ❌ MISSING in JSON — "${mdWeek.title}"`);
      issues.push(`  ❌ ${mLabel} ${mdWeek.title}: Missing in JSON`);
      continue;
    }

    const mdD = mdWeek.days.length;
    const jD = (jWeek.days || []).length;
    const dOK = mdD === jD;

    // Check week number from title
    const mdWNum = mdWeek.title.match(/Week (\d+)/)?.[1];
    const jWNum = jWeek.title.match(/Week (\d+)/)?.[1];
    const numOK = (!mdWNum || !jWNum || mdWNum === jWNum);

    const status = (!dOK || !numOK) ? '❌' : '✅';
    console.log(`  ${mdWeek.title.substring(0,40).padEnd(40)} MD:${String(mdD).padStart(2)}d | JSON:${String(jD).padStart(2)}d "${(jWeek.title||'').substring(0,30)}" ${status}`);

    if (!dOK) {
      issues.push(`  ❌ ${mLabel} ${mdWeek.title}: MD=${mdD}days, JSON=${jD}days`);
      // Show specific day mismatch
      console.log(`     MD days   : ${mdWeek.days.map(d => d.title.split('—')[0].trim()).join(' | ')}`);
      console.log(`     JSON days : ${(jWeek.days||[]).map(d => d.title.split('—')[0].trim()).join(' | ')}`);
    }
    if (!numOK) {
      issues.push(`  ❌ ${mLabel} Week number mismatch: MD=Week${mdWNum}, JSON=Week${jWNum}`);
    }
  }
});

// Months in JSON that aren't in MD
for (let i = mdMonths.length; i < json.length; i++) {
  issues.push(`❌ JSON has extra Month ${i+1}: "${json[i].title}" — not in MD`);
}

// ── Uncategorized check ───────────────────────────────────────────────────────
console.log('\n\n"UNCATEGORIZED" WEEK CHECK:');
console.log('─'.repeat(60));
let uncatCount = 0;
json.forEach((m, mi) => {
  (m.weeks || []).forEach((w, wi) => {
    if (w.title && w.title.toLowerCase().includes('uncategorized')) {
      const jdays = (w.days || []).map(d => d.title).join(', ');
      console.log(`  ❌ Month ${mi+1} Week ${wi+1}: "${w.title}"`);
      console.log(`     Days inside: ${jdays.substring(0,100)}`);
      uncatCount++;
      issues.push(`❌ Month ${mi+1} Week ${wi+1} is "Uncategorized" — should be parsed from MD line`);
    }
  });
});
if (uncatCount === 0) console.log('  ✅ None found');

// ── Final summary ─────────────────────────────────────────────────────────────
console.log('\n\nISSUES SUMMARY:');
console.log('─'.repeat(60));
if (issues.length === 0) {
  console.log('✅ PERFECT — tasks.json exactly matches properrr.md structure');
} else {
  console.log(`Found ${issues.length} issue(s):\n`);
  issues.forEach(i => console.log(i));
}

console.log(`\nTOTAL DAYS: MD=${mdTotalDays}, JSON=${jsonTotalDays} ${mdTotalDays === jsonTotalDays ? '✅' : `❌ (diff: ${jsonTotalDays - mdTotalDays})`}`);
