import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `          joinDate: new Date().toISOString(),
          status: 'Active',
          project: '-',`,
  `          joinDate: new Date().toISOString(),
          status: 'Active' as const,
          project: '-',`
);

fs.writeFileSync(path, content);
console.log('Fixed typings');
