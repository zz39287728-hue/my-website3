import fs from 'fs';

const path = 'src/types.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `  onboardingCompleted?: boolean;
  designPreferences?: Record<string, string>;`,
  `  onboardingCompleted?: boolean;
  designPreferences?: Record<string, string>;
  isGuest?: boolean;`
);

fs.writeFileSync(path, content);
console.log('Updated types');
