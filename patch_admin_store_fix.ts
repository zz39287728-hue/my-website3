import fs from 'fs';

const path = 'src/pages/AdminStore.tsx';
let content = fs.readFileSync(path, 'utf8');

// We have 3 blocks that are wrong. Let's fix them with regex.
content = content.replace(
  /(\( \n                  <button onClick=\{\(\) => startEditing\(item, 'collection'\)\}[\s\S]*?<\/button>\n                  <button onClick=\{\(\) => deleteItem\(item\.id, 'collections'\)\}[\s\S]*?<\/button>\n                \))/g,
  '( \n                  <>\n                  <button onClick={() => startEditing(item, \'collection\')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">\n                    <Edit2 size={18} />\n                  </button>\n                  <button onClick={() => deleteItem(item.id, \'collections\')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">\n                    <Trash2 size={18} />\n                  </button>\n                  </>\n                )'
);

content = content.replace(
  /(\( \n                  <button onClick=\{\(\) => startEditing\(item, 'package'\)\}[\s\S]*?<\/button>\n                  <button onClick=\{\(\) => deleteItem\(item\.id, 'packages'\)\}[\s\S]*?<\/button>\n                \))/g,
  '( \n                  <>\n                  <button onClick={() => startEditing(item, \'package\')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">\n                    <Edit2 size={18} />\n                  </button>\n                  <button onClick={() => deleteItem(item.id, \'packages\')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">\n                    <Trash2 size={18} />\n                  </button>\n                  </>\n                )'
);

content = content.replace(
  /(\( \n                  <button onClick=\{\(\) => startEditing\(item, 'consultation'\)\}[\s\S]*?<\/button>\n                  <button onClick=\{\(\) => deleteItem\(item\.id, 'consultations'\)\}[\s\S]*?<\/button>\n                \))/g,
  '( \n                  <>\n                  <button onClick={() => startEditing(item, \'consultation\')} className="p-2 bg-luxury-100 dark:bg-luxury-800 text-luxury-700 dark:text-luxury-300 rounded hover:bg-gold-500 hover:text-white transition-colors">\n                    <Edit2 size={18} />\n                  </button>\n                  <button onClick={() => deleteItem(item.id, \'consultations\')} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-500 hover:text-white transition-colors">\n                    <Trash2 size={18} />\n                  </button>\n                  </>\n                )'
);

fs.writeFileSync(path, content);
