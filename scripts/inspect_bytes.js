import fs from 'fs';

const filePath = 'src/index.css';
const buffer = fs.readFileSync(filePath);
console.log('File size:', buffer.length);

// Print first 50 bytes
console.log('First 50 bytes:', buffer.slice(0, 50).toString('hex'));

// Print bytes around 40000 (roughly where 1900 might be)
const start = Math.max(0, buffer.length - 2000);
console.log('Bytes at end-2000:', buffer.slice(start, start + 100).toString('hex'));
