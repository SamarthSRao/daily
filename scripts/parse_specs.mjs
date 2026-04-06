import fs from 'fs';
import path from 'path';

function parseSpecFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  const spec = {
    id: path.basename(filePath, '.md'),
    title: "",
    subtitle: "",
    stack: "",
    sections: []
  };

  let currentSection = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed && !currentSection) continue;

    if (line.startsWith('# ')) {
      spec.title = line.replace('# ', '').trim();
    } else if (line.startsWith('## ') && !spec.subtitle) {
      spec.subtitle = line.replace('## ', '').trim();
    } else if (line.startsWith('**Stack:**')) {
      spec.stack = line.replace('**Stack:**', '').trim();
    } else if (line.startsWith('## ')) {
      if (currentSection) spec.sections.push(currentSection);
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: []
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  }
  if (currentSection) spec.sections.push(currentSection);

  // Join content lines
  spec.sections.forEach(s => {
    s.content = s.content.join('\n').trim();
  });

  return spec;
}

function parseGuidelines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  const guidelines = {
    title: "",
    sections: []
  };

  let currentSection = null;

  for (let line of lines) {
    if (line.startsWith('# ')) {
      guidelines.title = line.replace('# ', '').trim();
    } else if (line.startsWith('## ')) {
      if (currentSection) guidelines.sections.push(currentSection);
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: []
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  }
  if (currentSection) guidelines.sections.push(currentSection);

  guidelines.sections.forEach(s => {
    s.content = s.content.join('\n').trim();
  });

  return guidelines;
}

const specFiles = [
  'PayCore_Spec.md',
  'RouteMaster_Spec.md',
  'OpenTrace_Spec.md',
  'DungBeetle_Spec.md',
  'BookWise_Spec.md'
];

const specs = specFiles.map(f => parseSpecFile(f));
fs.writeFileSync('./src/specs.json', JSON.stringify(specs, null, 2));

const guidelines = parseGuidelines('Bangalore_Fresher_Readiness_Plan.md');
fs.writeFileSync('./src/guidelines.json', JSON.stringify(guidelines, null, 2));

console.log('Specs and Guidelines parsed!');
