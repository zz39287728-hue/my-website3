const fs = require('fs');
let files = ['src/pages/Communication.tsx', 'src/pages/Admin.tsx'];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Remove aspect-square from empty cells and change it to h-20 or similar
  code = code.replace(/<div key={`empty-\${i}`} className="aspect-square"><\/div>/g, '<div key={`empty-${i}`} className="h-20 lg:h-24"></div>');
  
  // Replace aspect-square in the day cell
  code = code.replace(/className={`p-2 border rounded-xl flex flex-col aspect-square relative transition-all/g, 'className={`p-2 border rounded-xl flex flex-col h-20 lg:h-24 relative transition-all');
  
  // Another potential format
  code = code.replace(/className={`p-2 border rounded-xl flex flex-col relative transition-all aspect-square/g, 'className={`p-2 border rounded-xl flex flex-col relative transition-all h-20 lg:h-24');

  code = code.replace(/className={`p-1 md:p-2 border rounded-xl flex flex-col aspect-square relative transition-all/g, 'className={`p-1 md:p-2 border rounded-xl flex flex-col h-20 lg:h-24 relative transition-all');
  
  code = code.replace(/className={`p-1 md:p-2 border rounded-xl flex flex-col relative transition-all aspect-square/g, 'className={`p-1 md:p-2 border rounded-xl flex flex-col relative transition-all h-20 lg:h-24');

  fs.writeFileSync(file, code);
}
