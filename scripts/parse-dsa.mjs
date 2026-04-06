import fs from 'fs';

const content = fs.readFileSync('Untitled 9.md', 'utf-8');
const lines = content.split(/\r?\n/);

const data = [];
let currentLevel = null;

for (let line of lines) {
  if (line.trim().startsWith('Level ')) {
    currentLevel = { title: line.trim(), problems: [] };
    data.push(currentLevel);
  } else if (line.trim().startsWith('|') && !line.includes('---|')) {
    const parts = line.split('|').map(s => s.trim()).filter(Boolean);
    // Ignore the table header (where parts[0] is 'ID' or 'Input Size (n)')
    if (parts.length >= 4 && parts[0] !== 'ID' && parts[0] !== 'Input Size (n)' && currentLevel) {
      currentLevel.problems.push({
        id: parts[0],
        title: parts[1],
        pattern: parts[2],
        prerequisite: parts[3]
      });
    }
  }
}

fs.writeFileSync('./src/dsa.json', JSON.stringify(data, null, 2));
console.log('Parsed successfully! Found ' + data.length + ' levels.');
