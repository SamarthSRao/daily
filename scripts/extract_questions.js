import fs from 'fs';
import path from 'path';

function parseMd(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const questions = [];
    let currentSection = "";
    let currentSubSection = "";

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
            currentSection = trimmed.replace('# ', '').trim();
        } else if (trimmed.startsWith('## ')) {
            const text = trimmed.replace('## ', '').trim();
            if (!text.toLowerCase().includes('how to use')) {
                currentSubSection = text;
            }
        } else if (trimmed.startsWith('### ')) {
             const text = trimmed.replace('### ', '').trim();
             currentSubSection = text;
        }

        // Updated regex to handle backticks
        const match = trimmed.match(/^(\d+)\.\s+`\[(.*?)\]` \s*`\{(.*?)\}`\s+(.*)/) || 
                      trimmed.match(/^(\d+)\.\s+\[(.*?)\]\s+\{(.*?)\}\s+(.*)/);
        if (match) {
            questions.push({
                id: parseInt(match[1]),
                type: match[2],
                tag: match[3],
                text: match[4].trim(),
                section: currentSection,
                subSection: currentSubSection
            });
        }
    });
    return questions;
}

const backendQuestions = parseMd('Backend_Interview_Question_Bank_v2.md');
const clrsQuestions = parseMd('CLRS_Complete_Question_Bank.md');

const data = {
    backend: backendQuestions,
    clrs: clrsQuestions
};

fs.writeFileSync('src/data/questions.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${backendQuestions.length} backend questions and ${clrsQuestions.length} CLRS questions.`);
