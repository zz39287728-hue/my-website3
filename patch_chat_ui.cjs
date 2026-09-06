const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

// Inject activeThread state
code = code.replace(
  "const [input, setInput] = useState('');",
  "const [activeThread, setActiveThread] = useState<'ARCHITECT' | 'SUPPORT'>('ARCHITECT');\n  const [input, setInput] = useState('');"
);

// Filter chat history
code = code.replace(
  "const [pendingAttachments, setPendingAttachments]",
  "const filteredChatHistory = chatHistory.filter(msg => { const recipient = msg.recipient || 'ARCHITECT'; return msg.sender === 'CLIENT' ? recipient === activeThread : msg.sender === activeThread; });\n  const [pendingAttachments, setPendingAttachments]"
);

// Update map from chatHistory to filteredChatHistory
code = code.replace(
  "{chatHistory.map((msg) => {",
  "{filteredChatHistory.map((msg) => {"
);

// Update newMessage with recipient
code = code.replace(
  "sender: 'CLIENT' as const,",
  "sender: 'CLIENT' as const,\n      recipient: activeThread,"
);

// Update header UI to show a selector instead of hardcoded Arch. Zainab
const oldHeader = `<div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md flex items-center gap-4 transition-colors duration-500">
          <img src="https://picsum.photos/id/1027/100/100" alt="Designer" className="w-12 h-12 rounded-full object-cover border border-gold-500 shadow-[0_0_10px_rgba(166,136,104,0.3)]" />
          <div>
            <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">Arch. Zainab Al-Zaki</h3>
            <p className="text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> {t('chat.online')}</p>
          </div>
        </div>`;

const newHeader = `<div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md flex items-center gap-2 transition-colors duration-500">
          <button 
            onClick={() => setActiveThread('ARCHITECT')}
            className={\`flex-1 flex items-center gap-3 p-2 rounded-xl transition-all \${activeThread === 'ARCHITECT' ? 'bg-gold-500/10 border border-gold-500/30' : 'hover:bg-luxury-100 dark:hover:bg-luxury-900 border border-transparent'}\`}
          >
            <img src={globalState.architectProfile?.avatar || "https://picsum.photos/id/1027/100/100"} alt="Designer" className="w-10 h-10 rounded-full object-cover border border-gold-500 shadow-sm" />
            <div className="text-left rtl:text-right">
              <h3 className="font-serif text-sm font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{globalState.architectProfile?.name || 'Arch. Zainab Al-Zaki'}</h3>
              <p className="text-[10px] font-bold text-luxury-500">{t('support.switch.architect') || 'Architect'}</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveThread('SUPPORT')}
            className={\`flex-1 flex items-center gap-3 p-2 rounded-xl transition-all \${activeThread === 'SUPPORT' ? 'bg-gold-500/10 border border-gold-500/30' : 'hover:bg-luxury-100 dark:hover:bg-luxury-900 border border-transparent'}\`}
          >
            <div className="w-10 h-10 rounded-full bg-luxury-200 dark:bg-luxury-800 flex items-center justify-center border border-luxury-300 dark:border-luxury-700">
              <Headphones size={20} className="text-luxury-600 dark:text-luxury-400" />
            </div>
            <div className="text-left rtl:text-right">
              <h3 className="font-serif text-sm font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{isAr ? 'فريق الدعم الفني' : 'Support Team'}</h3>
              <p className="text-[10px] font-bold text-luxury-500">{t('support.switch.support') || 'Support'}</p>
            </div>
          </button>
        </div>`;

code = code.replace(oldHeader, newHeader);

fs.writeFileSync('src/pages/Communication.tsx', code);
