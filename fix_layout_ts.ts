import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('globalState.lang', 'lang');

fs.writeFileSync(path, content);
console.log('Fixed Layout.tsx typescript errors');
