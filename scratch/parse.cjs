const fs = require('fs');
const path = require('path');

const files = [
  'Backend_S1_WebRequestLifecycle_500.md',
  'Backend_S2_SystemDesign_500.md',
  'Backend_S3_OperatingSystems_500.md',
  'Backend_S4_Databases_500.md',
  'Backend_S5_DistributedSystems_500.md',
  'Backend_S6_GoNodeJS_500.md',
  'Backend_S7_Infrastructure_500.md',
  'Backend_S8_Observability_Testing_AI_500.md'
];

const basePath = 'c:/Users/samar/OneDrive/Desktop/family/daily';
const dataPath = path.join(basePath, 'src/data/questions.json');

const questionsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let maxId = 0;
questionsData.backend.forEach(q => {
  if (q.id > maxId) maxId = q.id;
});

const newQuestions = [];

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) continue;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let currentSection = '';
  let currentSubSection = '';
  
  for (const line of lines) {
    if (line.startsWith('# Backend Engineering — ')) {
      currentSection = line.replace('# ', '').trim();
    } else if (line.startsWith('# PART ')) {
      currentSubSection = line.replace('# ', '').trim();
    } else {
      const match = line.match(/^(\d+)\.\s+`\[(.*?)\]`\s+`\{(.*?)\}`\s+(.*)/);
      if (match) {
        maxId++;
        newQuestions.push({
          id: maxId,
          type: match[2],
          tag: match[3],
          text: match[4].trim(),
          section: currentSection,
          subSection: currentSubSection
        });
      }
    }
  }
}

console.log(`Parsed ${newQuestions.length} new questions.`);

if (newQuestions.length > 0) {
  questionsData.backend.push(...newQuestions);
  fs.writeFileSync(dataPath, JSON.stringify(questionsData, null, 2));
  console.log('Updated questions.json successfully.');
} else {
  console.log('No new questions found.');
}
