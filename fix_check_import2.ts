import fs from 'fs';

const path = 'src/components/Layout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("Activity, Lock", "Activity, Lock, Check");
fs.writeFileSync(path, content);
