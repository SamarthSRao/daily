import fs from 'fs';
const content = fs.readFileSync('900_SQL_Practice_Questions.md', 'utf8');
const lines = content.split('\n');
let matched = 0, total = 0;
const unmatched = [];
lines.forEach((line, idx) => {
  const trimmed = line.trim();
  const matchNum = trimmed.match(/^(\d+)\./);
  if (matchNum) {
    total++;
    // Regex matching: line starts with digits, dot, spaces, followed by question text, spaces, and tag like `[SELECT]`
    const matchFull = trimmed.match(/^(\d+)\.\s+(.*?)\s+`\[(.*?)\]`$/);
    if (matchFull) {
      matched++;
    } else {
      unmatched.push({ lineNum: idx + 1, text: trimmed });
    }
  }
});
console.log('Total numbered lines:', total);
console.log('Matched:', matched);
console.log('Unmatched samples:', unmatched.slice(0, 10));
