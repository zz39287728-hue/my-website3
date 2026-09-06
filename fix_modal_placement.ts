import fs from 'fs';

const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

// The modal HTML is from line 397 (<AnimatePresence>) to line 506 (};)
// But wait, the </div> at the end of Communication is there too.

// Let's just remove the modal from Communication and put it in Booking.
