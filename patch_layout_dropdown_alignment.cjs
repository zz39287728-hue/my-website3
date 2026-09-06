const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const alignRegex = /<p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1">[\s\S]*?<\/p>/g;
code = code.replace(alignRegex, `<p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 mt-1 text-left rtl:text-right w-full block">
                            {role === 'ARCHITECT' ? globalState.architectProfile.title : role === 'SUPPORT' ? 'Support' : activeClient.profile.tier}
                          </p>`);

// Also change the parent container of input and tier from justify-center to items-start                        
code = code.replace(/<div className="flex-1">/g, '<div className="flex-1 flex flex-col items-start w-full overflow-hidden">');

// Ensure the input field text is also left-aligned (or right-aligned in rtl)
code = code.replace(/className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base pb-1 transition-colors pr-6"/g, 
  'className="w-full bg-transparent border-b border-transparent focus:border-gold-500 hover:border-luxury-300 dark:hover:border-luxury-700 outline-none font-bold text-luxury-900 dark:text-luxury-50 text-base pb-1 transition-colors pr-6 text-left rtl:text-right"');

fs.writeFileSync('src/components/Layout.tsx', code);
