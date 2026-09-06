const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

code = code.replace(
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base transition-colors pr-6 px-0 text-left rtl:text-right"',
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base transition-colors px-0 text-left rtl:text-right ltr:pr-6 rtl:pl-6"'
);

code = code.replace(
  '<Edit2 size={12} className="absolute right-0 text-luxury-400 pointer-events-none" />',
  '<Edit2 size={12} className="absolute ltr:right-0 rtl:left-0 text-luxury-400 pointer-events-none" />'
);

fs.writeFileSync('src/components/Layout.tsx', code);
