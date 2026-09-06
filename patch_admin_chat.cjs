const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

code = code.replace(
  "{(activeClient.chatHistory || []).map((msg) => {",
  "{(activeClient.chatHistory || []).filter(msg => msg.sender === 'ARCHITECT' || (msg.sender === 'CLIENT' && (msg.recipient || 'ARCHITECT') === 'ARCHITECT')).map((msg) => {"
);

fs.writeFileSync('src/pages/Admin.tsx', code);
