import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const modalStart = 1004; // 0-indexed: 1003
const modalEnd = 1004 + 106; // 1110

const modalHtml = lines.slice(1003, 1110);
lines.splice(1003, 107); // remove

// insert before the </div> that is at 1003 originally (now at 1003)
lines.splice(1002, 0, ...modalHtml);

fs.writeFileSync(path, lines.join('\n'));
