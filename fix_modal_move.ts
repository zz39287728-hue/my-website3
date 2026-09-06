import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

const modalLines = lines.slice(396, 503); // lines 397 to 503 (0-indexed 396 to 502, length 107. Wait, slice is start to end (exclusive), so 396 to 503 extracts 396..502 which is lines 397..503)

// Check if these are the right lines
if (modalLines[0].includes('<AnimatePresence>') && modalLines[modalLines.length-1].includes('</AnimatePresence>')) {
  console.log('Found modal');
} else {
  console.log('First line:', modalLines[0]);
  console.log('Last line:', modalLines[modalLines.length-1]);
}

// Remove from old place
lines.splice(396, 107); // removes lines 397 to 503

// Find where Booking component ends
let bookingEndIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const Support: React.FC = () => {')) {
    bookingEndIndex = i - 3; // a few lines before Support
    break;
  }
}

console.log('Booking ends at line:', bookingEndIndex + 1);
console.log('Line there:', lines[bookingEndIndex]);
console.log('Line before there:', lines[bookingEndIndex - 1]);

lines.splice(bookingEndIndex, 0, ...modalLines);

fs.writeFileSync(path, lines.join('\n'));
console.log('Moved modal to Booking');
