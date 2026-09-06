import fs from 'fs';
const path = 'src/pages/Communication.tsx';
let content = fs.readFileSync(path, 'utf8');

const execTarget = `      initiatedBy: (isAdmin ? 'ARCHITECT' : 'CLIENT') as 'ARCHITECT' | 'CLIENT',
      cost
    };`;
    
const execReplacement = `      initiatedBy: (isAdmin ? 'ARCHITECT' : 'CLIENT') as 'ARCHITECT' | 'CLIENT',
      cost,
      isGuestBooking: activeClient.profile.isGuest,
      guestPhone: guestPhone || undefined
    };`;

content = content.replace(execTarget, execReplacement);

fs.writeFileSync(path, content);
