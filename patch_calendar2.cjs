const fs = require('fs');
let files = ['src/pages/Communication.tsx', 'src/pages/Admin.tsx'];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Replace aspect-square anywhere else in the file where it matches calendar cells
  code = code.replace(/aspect-square/g, 'h-20 lg:h-24');

  fs.writeFileSync(file, code);
}
