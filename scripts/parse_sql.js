import fs from 'fs';
import path from 'path';

function parseSqlQuestions() {
  const content = fs.readFileSync('900_SQL_Practice_Questions.md', 'utf8');
  const lines = content.split(/\r?\n/);
  
  const questions = [];
  let currentSection = '';
  let currentSubSection = '';
  let questionId = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for Section Header (e.g. ## 1. 🛒 E-Commerce SQL)
    const secMatch = trimmed.match(/^##\s+(\d+)\.\s*(?:\S+\s+)?(.*)/);
    if (secMatch) {
      const secNum = secMatch[1];
      let secName = secMatch[2].trim();
      currentSection = `${secNum}: ${secName}`;
      continue;
    }

    // Check for SubSection Header (e.g. ### 1.1 Basic SELECT & Filtering)
    const subSecMatch = trimmed.match(/^###\s+(\d+\.\d+)\s+(.*)/);
    if (subSecMatch) {
      const subSecNum = subSecMatch[1];
      const subSecName = subSecMatch[2].trim();
      currentSubSection = `${subSecNum}: ${subSecName}`;
      continue;
    }

    // Check for Question (e.g. 1. List all customers... `[SELECT]`)
    const questionMatch = trimmed.match(/^(\d+)\.\s+(.*?)\s+`\[(.*?)\]`$/);
    if (questionMatch) {
      questionId++;
      questions.push({
        id: questionId,
        type: 'QUERY',
        tag: questionMatch[3].trim(),
        text: questionMatch[2].trim(),
        section: currentSection,
        subSection: currentSubSection
      });
    }
  }

  return questions;
}

const sqlQuestions = parseSqlQuestions();
console.log(`Parsed ${sqlQuestions.length} SQL questions.`);

if (sqlQuestions.length > 0) {
  const questionsPath = 'src/data/questions.json';
  const data = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  data.sql = sqlQuestions;
  fs.writeFileSync(questionsPath, JSON.stringify(data, null, 2));
  console.log('Updated questions.json successfully with sql key.');
} else {
  console.error('Error: No SQL questions parsed!');
  process.exit(1);
}
