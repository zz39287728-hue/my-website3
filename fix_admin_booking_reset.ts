import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `if (e.detail === 'BOOKING') {`;
const rep = `if (e.detail === 'BOOKING' || e.detail === 'ADMIN_BOOKINGS') {`;

content = content.replace(target, rep);
fs.writeFileSync(path, content);
