import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `  const handleStatusChange = (id: string, status: 'Confirmed') => {`;
const replacement = `  const handleStatusChange = (id: string, status: 'Confirmed' | 'Rejected') => {`;

content = content.replace(target, replacement);

fs.writeFileSync(path, content);
