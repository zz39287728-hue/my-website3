import fs from 'fs';
const path = 'src/types.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `  initiatedBy: 'CLIENT' | 'ARCHITECT';
  cost?: number;
}`,
  `  initiatedBy: 'CLIENT' | 'ARCHITECT';
  cost?: number;
  isGuestBooking?: boolean;
  guestPhone?: string;
}`
);

fs.writeFileSync(path, content);
