const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

code = code.replace(
  "{(activeClient.chatHistory || []).filter(msg => msg.sender === 'ARCHITECT' || (msg.sender === 'CLIENT' && (msg.recipient || 'ARCHITECT') === 'ARCHITECT')).map((msg) => {",
  "{(activeClient.chatHistory || []).filter(msg => msg.sender === role || (msg.sender === 'CLIENT' && (msg.recipient || 'ARCHITECT') === role)).map((msg) => {"
);

// We also need to fix the sender when admin sends a message!
// Let's find how AdminChat handles handleSend
code = code.replace(
  "sender: 'ARCHITECT' as const,",
  "sender: role as any,"
);

fs.writeFileSync('src/pages/Admin.tsx', code);
