const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

code = code.replace(
  "sender: (typeof role !== 'undefined' ? role : 'ARCHITECT') as any,",
  "sender: 'ARCHITECT' as any,"
);

fs.writeFileSync('src/pages/Admin.tsx', code);
