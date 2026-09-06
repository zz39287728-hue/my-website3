const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');
code = code.replace(
  "CheckCheck, Mic, MoreHorizontal} from 'lucide-react';",
  "CheckCheck, Mic, MoreHorizontal, Languages} from 'lucide-react';"
);
fs.writeFileSync('src/pages/Communication.tsx', code);
