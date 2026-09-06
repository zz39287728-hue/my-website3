const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');
code = code.replace("  return (\n  return (", "  return (");
fs.writeFileSync('src/pages/Communication.tsx', code);
