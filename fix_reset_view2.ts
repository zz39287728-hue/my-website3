import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("e.detail === 'booking'", "e.detail === 'BOOKING'");

fs.writeFileSync(path, content);
