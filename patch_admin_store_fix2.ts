import fs from 'fs';

const path = 'src/pages/AdminStore.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /) : \(\n                  <button onClick=\{\(\) => startEditing/g,
  ') : (<>\n                  <button onClick={() => startEditing'
);

content = content.replace(
  /Trash2 size=\{18\} \/>\n                  <\/button>\n                \)\}/g,
  'Trash2 size={18} />\n                  </button>\n                  </>\n                )}'
);

fs.writeFileSync(path, content);
