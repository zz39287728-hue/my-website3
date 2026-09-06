const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

// 1. Update handleSend
code = code.replace(
  /timestamp: new Date\(\)\.toLocaleTimeString\(\[\]\, \{ hour\: \'2\-digit\'\, minute\: \'2\-digit\' \}\)/g,
  "timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),\n      status: 'SENT' as const"
);

// 2. Add useEffect to simulate read receipts
const readReceiptEffect = `
  // Simulate read receipts
  useEffect(() => {
    const unreadMessages = chatHistory.filter(msg => msg.sender === 'CLIENT' && msg.status === 'SENT');
    if (unreadMessages.length > 0) {
      const timer = setTimeout(() => {
        setGlobalState(prev => {
          const client = prev.clients[prev.activeClientId];
          const updatedHistory = client.chatHistory.map(msg => 
            (msg.sender === 'CLIENT' && msg.status === 'SENT') ? { ...msg, status: 'READ' as const } : msg
          );
          return {
            ...prev,
            clients: {
              ...prev.clients,
              [prev.activeClientId]: {
                ...client,
                chatHistory: updatedHistory
              }
            }
          };
        });
      }, 1500); // 1.5 seconds to read
      
      return () => clearTimeout(timer);
    }
  }, [chatHistory, globalState.activeClientId, setGlobalState]);
`;

code = code.replace(
  "const handleSend = () => {",
  readReceiptEffect + "\n\n  const handleSend = () => {"
);

// 3. Update the CheckCheck to Check if status is SENT
// We have three places where CheckCheck is rendered.
code = code.replace(
  /\{isClient && <CheckCheck size=\{13\} \/>\}/g,
  "{isClient && (msg.status === 'SENT' ? <Check size={13} /> : <CheckCheck size={13} />)}"
);
code = code.replace(
  /\{isClient && <CheckCheck size=\{13\} className\=\"text\-white\" \/>\}/g,
  "{isClient && (msg.status === 'SENT' ? <Check size={13} className=\"text-white\" /> : <CheckCheck size={13} className=\"text-white\" />)}"
);

fs.writeFileSync('src/pages/Communication.tsx', code);
console.log("Patched Communication.tsx successfully for single/double check!");
