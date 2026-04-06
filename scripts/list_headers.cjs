const fs = require('fs');
const content = fs.readFileSync('properrr.md', 'utf-8');
const lines = content.split('\n');
let active = false;
lines.forEach((line, i) => {
  if (line.match(/^##\s+MONTH/)) {
    console.log((i+1) + ': ' + line.trim());
  }
  if (line.match(/^###\s+Week/)) {
    console.log('  ' + (i+1) + ': ' + line.trim());
  }
});
