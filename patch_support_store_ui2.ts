import fs from 'fs';

const path = 'src/pages/SupportStore.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<div className="w-16 h-16 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-600"><Package size={24} /></div>',
  '<div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-inner"><Package size={32} /></div>'
);

content = content.replace(
  '<div className="w-16 h-16 bg-gold-500/10 rounded-xl flex items-center justify-center text-gold-600"><Calendar size={24} /></div>',
  '<div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center text-gold-600 border border-gold-500/20 shadow-inner"><Calendar size={32} /></div>'
);

content = content.replace(
  '<img src={item.image} alt={item.title} className="w-24 h-24 rounded-lg object-cover" />',
  '<img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover border border-luxury-200 dark:border-luxury-800 shadow-sm" />'
);

// Better card styling
content = content.replace(
  /className="p-4 flex flex-col md:flex-row items-center gap-6"/g,
  'className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-lg transition-all border-luxury-200 dark:border-luxury-800/60"'
);

fs.writeFileSync(path, content);
