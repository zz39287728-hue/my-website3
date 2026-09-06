const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

code = code.replace(
  "import { Send, Paperclip",
  "import { Headphones, Send, Paperclip"
);

fs.writeFileSync('src/pages/Communication.tsx', code);
