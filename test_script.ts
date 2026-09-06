import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `              const isFullyBlocked = isPastOrTooSoon || isWeekend || hasAllDayBlock;`;

console.log(content.includes(targetStr));
