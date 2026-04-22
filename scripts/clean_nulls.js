import fs from 'fs';

const filePath = 'src/index.css';
const buffer = fs.readFileSync(filePath);

// Clean null bytes
const cleaned = [];
for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) {
        cleaned.push(buffer[i]);
    }
}

fs.writeFileSync(filePath, Buffer.from(cleaned));
console.log('Cleaned null bytes from index.css');
