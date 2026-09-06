import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `    const handleReset = (e: CustomEvent) => {
      if (e.detail === 'BOOKING') {`;
const rep = `    const handleReset = (e: CustomEvent) => {
      console.log('Reset event received for:', e.detail);
      if (e.detail === 'BOOKING') {`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
