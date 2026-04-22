import fs from 'fs';

const filePath = 'src/index.css';
const content = fs.readFileSync(filePath, 'utf8');

// If there are many instances of "character space character space", 
// it's likely the corrupted version.
// However, we should be careful not to remove intentional spaces.
// Let's check for " . s t a t s - g r i d "
if (content.includes('. h a b i t - i n f o')) {
    console.log('Detected spacing corruption in index.css. Fixing...');
    // This is a naive fix: remove spaces if they occur after every character
    // and replace Double spaces (which were original single spaces converted to space-space)
    // Actually, if it was converted char -> char + space, then a space ' ' became '  ' (two spaces).
    
    // Let's try to remove every second character if it's a space, but ONLY in the corrupted regions.
    // Or just replace "  " with "@@TEMP@@", then remove all " ", then replace "@@TEMP@@" with " ".
    const fixed = content.replace(/  /g, '@@TEMP@@').replace(/ /g, '').replace(/@@TEMP@@/g, ' ');
    fs.writeFileSync(filePath, fixed);
    console.log('Fixed index.css');
} else {
    console.log('index.css seems fine or already fixed.');
}
