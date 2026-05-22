import fs from 'fs';
const q = JSON.parse(fs.readFileSync('src/data/questions.json', 'utf8'));

Object.keys(q).forEach(bank => {
  let missingSection = 0;
  let missingSubSection = 0;
  let total = q[bank].length;
  
  q[bank].forEach((item, idx) => {
    if (!item.section || item.section.trim() === '') {
      missingSection++;
    }
    if (!item.subSection || item.subSection.trim() === '') {
      missingSubSection++;
    }
  });
  
  console.log(`Bank: ${bank}`);
  console.log(`  Total: ${total}`);
  console.log(`  Missing Section: ${missingSection}`);
  console.log(`  Missing SubSection: ${missingSubSection}`);
});
