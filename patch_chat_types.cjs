const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "sender: 'ARCHITECT' | 'CLIENT' | 'SUPPORT';",
  "sender: 'ARCHITECT' | 'CLIENT' | 'SUPPORT' | string;\n  recipient?: 'ARCHITECT' | 'CLIENT' | 'SUPPORT' | string;"
);

fs.writeFileSync('src/types.ts', code);
