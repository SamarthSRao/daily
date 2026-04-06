const fs = require('fs');
const files = [
  'properrr.md',
  'plan_datadog_confluent.md',
  'plan_jiohotstar_razorpay.md',
  'plan_rippling_databricks.md',
  'plan_uber_doordash_palantir.md'
];

files.forEach(file => {
  console.log(`\n--- ${file} ---`);
  if (!fs.existsSync(file)) {
    console.log('File not found');
    return;
  }
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/^##\s+MONTH/)) {
      console.log(`${i+1}: ${line.trim()}`);
    }
    if (line.match(/^###\s+Week/)) {
      console.log(`  ${i+1}: ${line.trim()}`);
    }
  });
});
