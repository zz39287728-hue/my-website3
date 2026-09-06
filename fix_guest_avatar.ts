import fs from 'fs';

const path = 'src/components/Onboarding.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `          isGuest: true
        },`,
  `          isGuest: true,
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200'
        },`
);

fs.writeFileSync(path, content);
console.log('Fixed guest avatar');
