const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const readIncomingEffect = `  // Mark incoming messages as read when viewing the thread
  useEffect(() => {
    const unreadIncoming = chatHistory.filter(msg => msg.sender === activeThread && msg.status !== 'READ');
    if (unreadIncoming.length > 0) {
      setGlobalState(prev => {
        const client = prev.clients[prev.activeClientId];
        const updatedHistory = client.chatHistory.map(msg => 
          (msg.sender === activeThread && msg.status !== 'READ') ? { ...msg, status: 'READ' } : msg
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
    }
  }, [chatHistory, activeThread, setGlobalState, globalState.activeClientId]);

  // Simulate read receipts`;

if (code.includes('// Simulate read receipts') && !code.includes('unreadIncoming')) {
  code = code.replace("  // Simulate read receipts", readIncomingEffect);
  fs.writeFileSync('src/pages/Communication.tsx', code);
  console.log("Unread incoming effect added");
}
