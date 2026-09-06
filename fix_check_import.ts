import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find the end of lucide-react imports and add Check
const importStr = "from 'lucide-react';";
if (!content.includes('Check,') && content.includes(importStr)) {
  content = content.replace("Activity, Lock", "Activity, Lock, Check");
  fs.writeFileSync(path, content);
  console.log('Added Check');
} else {
  console.log('Already there');
}
