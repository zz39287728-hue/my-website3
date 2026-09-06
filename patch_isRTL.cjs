const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

code = code.replace(
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base transition-colors px-0 text-left rtl:text-right ltr:pr-6 rtl:pl-6"',
  'className={`w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base transition-colors px-0 ${isRTL ? "text-right pl-6" : "text-left pr-6"}`}'
);

code = code.replace(
  '<Edit2 size={12} className="absolute ltr:right-0 rtl:left-0 text-luxury-400 pointer-events-none" />',
  '<Edit2 size={12} className={`absolute ${isRTL ? "left-0" : "right-0"} text-luxury-400 pointer-events-none`} />'
);

code = code.replace(
  '<p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1 text-left rtl:text-right w-full block">',
  '<p className={`text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1 w-full block ${isRTL ? "text-right" : "text-left"}`}>'
);

fs.writeFileSync('src/components/Layout.tsx', code);
