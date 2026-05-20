const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));
const normalize = (sec) => {
  if (!sec) return 'Uncategorized';
  if (sec.includes('Section 1') || sec.includes('SECTION 1')) return 'S1: Web Request Lifecycle';
  if (sec.includes('Section 2') || sec.includes('SECTION 2')) return 'S2: System Design';
  if (sec.includes('Section 3') || sec.includes('SECTION 3')) return 'S3: Operating Systems';
  if (sec.includes('Section 4') || sec.includes('SECTION 4')) return 'S4: Databases';
  if (sec.includes('Section 5') || sec.includes('SECTION 5')) return 'S5: Distributed Systems';
  if (sec.includes('Section 6') || sec.includes('SECTION 6')) {
    if (sec.includes('Computer Networks')) return 'S6: Computer Networks';
    return 'S6: Go & Node.js';
  }
  if (sec.includes('Section 7') || sec.includes('SECTION 7')) return 'S7: Infrastructure & Security';
  if (sec.includes('Section 8') || sec.includes('SECTION 8')) return 'S8: Observability & AI';
  return sec;
};
data.backend.forEach(q => {
  q.section = normalize(q.section);
});
fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));
console.log('Sections normalized successfully');
