const fs = require('fs');

const md = fs.readFileSync('properrr.md', 'utf8');
const json = JSON.parse(fs.readFileSync('src/tasks.json', 'utf8'));

const out = [];
const log = (...args) => out.push(args.join(' '));

const mdMonths = [];
let curMonth = null, curWeek = null;
let inCode = false;

md.split('\n').forEach((raw) => {
  if (raw.startsWith('```')) { inCode = !inCode; return; }
  if (inCode) return;

  if (/^##\s+MONTHS?\s+/.test(raw)) {
    const m = raw.match(/^##\s+MONTHS?\s+([\d\u2013\-]+)\s*.+?[:\u2013\u2014]\s*(.+)/i);
    if (m) { curMonth = { num: m[1], title: m[2].trim(), weeks: [] }; mdMonths.push(curMonth); curWeek = null; }
    return;
  }
  if (/^###\s+Week\s+\d+/.test(raw)) {
    const w = raw.match(/^###\s+Week\s+(\d+)[^:]*[:\u2013\u2014]\s*(.+)/i);
    if (w && curMonth) { curWeek = { num: w[1], title: w[2].trim(), days: [] }; curMonth.weeks.push(curWeek); }
    return;
  }
  if (/^####\s+/.test(raw) && curWeek) curWeek.days.push(raw.replace(/^####\s+/, '').trim());
});

log('MD structure:', mdMonths.length, 'months');
log('JSON structure:', json.length, 'months');
log('');

const issues = [];

mdMonths.forEach((mdM, mi) => {
  const jM = json[mi];
  const jWks = jM ? (jM.weeks || []) : [];
  const wMatch = mdM.weeks.length === jWks.length;
  log('Month', mi+1, '[MD:'+mdM.weeks.length+'wk / JSON:'+jWks.length+'wk]', wMatch ? 'OK' : '*** MISMATCH ***', '"'+mdM.title.substring(0,45)+'"');

  if (!wMatch) issues.push('Month '+(mi+1)+': MD='+mdM.weeks.length+'wks, JSON='+jWks.length+'wks');

  const maxW = Math.max(mdM.weeks.length, jWks.length);
  for (let wi = 0; wi < maxW; wi++) {
    const mw = mdM.weeks[wi];
    const jw = jWks[wi];
    if (!mw && jw) { log('  [EXTRA_JSON]', 'Week['+wi+']:', '"'+jw.title.substring(0,50)+'"'); issues.push('Month '+(mi+1)+' Week['+(wi+1)+'] extra in JSON: "'+jw.title.substring(0,40)+'"'); continue; }
    if (mw && !jw) { log('  [MISSING_JSON]', 'W'+mw.num+':', '"'+mw.title.substring(0,40)+'"'); issues.push('Month '+(mi+1)+' W'+mw.num+' missing from JSON'); continue; }
    const md = mw.days.length;
    const jd = (jw.days || []).length;
    const numJSON = (jw.title.match(/Week (\d+)/) || [,'?'])[1];
    const numOK = mw.num === numJSON;
    const dayOK = md === jd;
    const stat = (numOK && dayOK) ? 'OK' : 'ISSUE';
    log('  ['+stat+'] W'+mw.num+'(MD)/W'+numJSON+'(JSON) days:MD='+md+'/JSON='+jd, '"'+mw.title.substring(0,28)+'" <-> "'+jw.title.substring(0,28)+'"');
    if (!numOK) { log('    ^ WEEK NUMBER MISMATCH: MD has W'+mw.num+', JSON has W'+numJSON); issues.push('Month '+(mi+1)+' slot['+(wi+1)+']: week# mismatch MD=W'+mw.num+' JSON=W'+numJSON); }
    if (!dayOK) {
      log('    ^ DAY COUNT MISMATCH: MD='+md+' JSON='+jd);
      log('    MD days:', mw.days.map(d=>d.replace('\u2014','--').substring(0,18)).join(' | '));
      log('    JSON days:', (jw.days||[]).map(d=>d.title.replace('\u2014','--').substring(0,18)).join(' | '));
      issues.push('Month '+(mi+1)+' W'+mw.num+': days MD='+md+' JSON='+jd);
    }
  }
  log('');
});

for (let i = mdMonths.length; i < json.length; i++) {
  log('Month', i+1, '[EXTRA IN JSON]:', '"'+json[i].title.substring(0,50)+'"');
  issues.push('Month '+(i+1)+' extra in JSON: "'+json[i].title+'"');
}

log('--- UNCATEGORIZED WEEKS ---');
json.forEach((m, mi) => {
  (m.weeks||[]).forEach((w, wi) => {
    if (w.title && w.title.toLowerCase().includes('uncategorized')) {
      log('Month '+(mi+1)+' Week['+(wi+1)+']: "'+w.title+'"');
      log('  Days inside:', (w.days||[]).map(d=>d.title.substring(0,20)).join(', '));
    }
  });
});

let mdDays = 0, jsonDays = 0;
mdMonths.forEach(m => m.weeks.forEach(w => mdDays += w.days.length));
json.forEach(m => (m.weeks||[]).forEach(w => jsonDays += (w.days||[]).length));

log('');
log('--- TOTALS ---');
log('Days: MD='+mdDays+', JSON='+jsonDays, mdDays===jsonDays ? 'OK' : 'DIFF='+(jsonDays-mdDays));
log('');
log('--- ALL ISSUES ---');
issues.forEach(i => log(i));

fs.writeFileSync('audit_result.txt', out.join('\n'), 'utf8');
console.log('Written to audit_result.txt');
