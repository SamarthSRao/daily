const fs = require('fs');

const md = fs.readFileSync('properrr.md', 'utf8');
const json = JSON.parse(fs.readFileSync('src/tasks.json', 'utf8'));

const mdMonths = [];
let curMonth = null, curWeek = null;
let inCode = false;

md.split('\n').forEach((raw) => {
  if (raw.startsWith('```')) { inCode = !inCode; return; }
  if (inCode) return;

  // Month headers
  if (/^##\s+MONTHS?\s+/.test(raw)) {
    const m = raw.match(/^##\s+MONTHS?\s+([\d\u2013\-]+)\s*.+?[:\u2013\u2014]\s*(.+)/i);
    if (m) {
      curMonth = { num: m[1], title: m[2].trim(), weeks: [] };
      mdMonths.push(curMonth);
      curWeek = null;
    }
    return;
  }

  // Week headers (both "### Week N: title" and "### Week N (detail): title")
  if (/^###\s+Week\s+\d+/.test(raw)) {
    const w = raw.match(/^###\s+Week\s+(\d+)[^:]*[:\u2013\u2014]\s*(.+)/i);
    if (w && curMonth) {
      curWeek = { num: w[1], title: w[2].trim(), days: [] };
      curMonth.weeks.push(curWeek);
    }
    return;
  }

  // Day headers (####)
  if (/^####\s+/.test(raw) && curWeek) {
    curWeek.days.push(raw.replace(/^####\s+/, '').trim());
  }
});

console.log('MD structure: ' + mdMonths.length + ' months');
console.log('JSON structure: ' + json.length + ' months');
console.log('');

const issues = [];

mdMonths.forEach((mdM, mi) => {
  const jM = json[mi];
  const jWks = jM ? (jM.weeks || []) : [];
  
  process.stdout.write('Month ' + (mi+1) + ' [MD:' + mdM.weeks.length + 'wk / JSON:' + jWks.length + 'wk] "' + mdM.title.substring(0,35) + '"');
  if (mdM.weeks.length !== jWks.length) {
    process.stdout.write(' *** WEEK COUNT MISMATCH ***');
    issues.push('Month ' + (mi+1) + ': MD=' + mdM.weeks.length + 'wks, JSON=' + jWks.length + 'wks');
  }
  console.log('');

  const maxW = Math.max(mdM.weeks.length, jWks.length);
  for (let wi = 0; wi < maxW; wi++) {
    const mw = mdM.weeks[wi];
    const jw = jWks[wi];

    if (!mw && jw) {
      console.log('  [' + (wi+1) + '] EXTRA in JSON: "' + jw.title + '"');
      issues.push('  Month ' + (mi+1) + ' Week[' + (wi+1) + ']: Extra in JSON: "' + jw.title + '"');
      continue;
    }
    if (mw && !jw) {
      console.log('  [' + (wi+1) + '] MISSING from JSON: Week ' + mw.num + ': "' + mw.title.substring(0,40) + '"');
      issues.push('  Month ' + (mi+1) + ' Week ' + mw.num + ': Missing from JSON');
      continue;
    }

    const md = mw.days.length;
    const jd = (jw.days || []).length;
    const numMD = mw.num || '?';
    const numJSON = (jw.title.match(/Week (\d+)/) || [,'?'])[1];
    const numOK = numMD === numJSON;
    const dayOK = md === jd;

    const status = (numOK && dayOK) ? 'OK' : 'XX';
    const note = (!numOK ? '[numMismatch:MD=W'+numMD+' JSON=W'+numJSON+']' : '') +
                 (!dayOK ? '[days:MD='+md+' JSON='+jd+']' : '');

    console.log('  [' + status + '] W' + numMD + ': "' + mw.title.substring(0,30).padEnd(30) + '" | json:"' + jw.title.substring(0,30).padEnd(30) + '" ' + note);

    if (!numOK) issues.push('  Month ' + (mi+1) + ' Week[' + (wi+1) + '] number mismatch: MD=W' + numMD + ', JSON=W' + numJSON);
    if (!dayOK) {
      issues.push('  Month ' + (mi+1) + ' Week ' + numMD + ': days MD=' + md + ', JSON=' + jd);
      console.log('    MD days  : ' + mw.days.map(d => d.split('\u2014')[0].trim().substring(0,20)).join(', '));
      console.log('    JSON days: ' + (jw.days||[]).map(d => d.title.split('\u2014')[0].trim().substring(0,20)).join(', '));
    }
  }
});

// Uncategorized weeks
console.log('\n--- UNCATEGORIZED CHECK ---');
json.forEach((m, mi) => {
  (m.weeks||[]).forEach((w, wi) => {
    if (w.title && w.title.toLowerCase().includes('uncategorized')) {
      console.log('Month ' + (mi+1) + ' Week[' + (wi+1) + ']: "' + w.title + '"');
      console.log('  days: ' + (w.days||[]).map(d=>d.title.substring(0,25)).join(', '));
      issues.push('Month ' + (mi+1) + ' Week[' + (wi+1) + '] is Uncategorized');
    }
  });
});

// Totals
let mdDays = 0, jsonDays = 0;
mdMonths.forEach(m => m.weeks.forEach(w => mdDays += w.days.length));
json.forEach(m => (m.weeks||[]).forEach(w => jsonDays += (w.days||[]).length));

console.log('\n--- SUMMARY ---');
console.log('Total days: MD=' + mdDays + ', JSON=' + jsonDays + (mdDays===jsonDays?' OK':' MISMATCH (extra '+( jsonDays-mdDays)+' in JSON)'));
console.log('Issues: ' + issues.length);
issues.forEach(i => console.log('  ' + i));
