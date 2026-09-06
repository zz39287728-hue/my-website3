const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

code = code.replace(
  '<div className="flex-1 flex flex-col items-start justify-center">',
  '<div className="flex-1 flex flex-col items-start w-full overflow-hidden">'
);

// We need to also remove pb-1 from the input to prevent the padding from shifting it away.
code = code.replace(
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base pb-1 transition-colors pr-6 text-left rtl:text-right"',
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base transition-colors pr-6 text-left rtl:text-right"'
);

fs.writeFileSync('src/components/Layout.tsx', code);
