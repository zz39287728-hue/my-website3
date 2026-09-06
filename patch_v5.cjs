const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const readIncomingEffect = `  // Mark incoming messages as read when viewing the thread
  useEffect(() => {
    const unreadIncoming = chatHistory.filter(msg => msg.sender === activeThread && msg.status !== 'READ');
    if (unreadIncoming.length > 0) {
      setGlobalState(prev => {
        const client = prev.clients[prev.activeClientId];
        const updatedHistory = client.chatHistory.map(msg => 
          (msg.sender === activeThread && msg.status !== 'READ') ? { ...msg, status: 'READ' as const } : msg
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

code = code.replace("  // Simulate read receipts", readIncomingEffect);

// Update Top Bar - Contact Switcher with badges
code = code.replace(
  "</h3>\n              <p className=\"text-[11px] text-luxury-400\">{isAr ? 'التبديل إلى لوحة الدعم' : 'Switch to Support'}</p>",
  `</h3>
              <p className="text-[11px] text-luxury-400">{isAr ? 'التبديل إلى لوحة الدعم' : 'Switch to Support'}</p>
            </div>
            {chatHistory.filter(m => m.sender === 'SUPPORT' && m.status !== 'READ').length > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-neutral-900 text-[10px] font-bold">
                {chatHistory.filter(m => m.sender === 'SUPPORT' && m.status !== 'READ').length}
              </span>
            )}`
);
// Careful, the closing div is already there. Let's fix the replace logic.
