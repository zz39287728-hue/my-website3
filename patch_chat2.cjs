const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

// Add imports
if (!code.includes('CheckCheck')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, (match, p1) => {
    return `import {${p1}, CheckCheck, Mic, MoreHorizontal} from 'lucide-react';`;
  });
}

// Add isTyping state inside Chat component
code = code.replace(/const \[input, setInput\] = useState\(''\);/, `const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);`);

// Update handleSend to simulate typing
code = code.replace(/const handleSend = \(\) => {[\s\S]*?setPendingAttachments\(\[\]\);\n  };/, `const handleSend = () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    
    const newMessage = {
      id: \`msg\${Date.now()}\`,
      sender: 'CLIENT' as const,
      recipient: activeThread,
      text: input,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));
    setInput('');
    setPendingAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage = {
        id: \`msg\${Date.now() + 1}\`,
        sender: activeThread,
        recipient: 'CLIENT',
        text: isAr ? (activeThread === 'ARCHITECT' ? 'شكراً لك، سأقوم بمراجعة ذلك.' : 'سنقوم بمتابعة طلبك فوراً.') : (activeThread === 'ARCHITECT' ? 'Thank you, I will review this.' : 'We will follow up on your request immediately.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            chatHistory: [...prev.clients[prev.activeClientId].chatHistory, replyMessage]
          }
        }
      }));
    }, 2500);
  };`);


// Update the UI rendering part for the Chat
const startMarker = '        {/* Chat Messages Area */}';
const endMarker = '      </div>\n    </div>\n  );\n};';

const regex = new RegExp(
  startMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + 
  '[\\s\\S]*?' + 
  endMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
);

const newUI = `        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar bg-[#1c1a17]">
          
          {/* Date Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-black/30 text-white/70 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              {isAr ? 'اليوم' : 'Today'}
            </div>
          </div>

          {filteredChatHistory.map((msg) => {
            const attachmentsToRender = msg.attachments || (msg.attachment ? [msg.attachment] : []);
            const isClient = msg.sender === 'CLIENT';
            
            // Sent by client: gold/brown, received: dark grey
            const bubbleClass = isClient
              ? 'bg-[#b78d59] text-[#1f1d1b] rounded-2xl rounded-tr-sm shadow-sm font-medium'
              : 'bg-[#2d2925] text-luxury-50 rounded-2xl rounded-tl-sm shadow-sm font-medium border border-white/5';

            return (
              <div key={msg.id} className={\`flex flex-col relative \${isClient ? 'items-end' : 'items-start'}\`}>
                
                {/* Bubble Tail Pseudo-element Simulation using a small SVG or div */}
                <div className={\`absolute top-0 \${isClient ? '-right-2' : '-left-2'} w-4 h-4 overflow-hidden\`}>
                  <div className={\`w-4 h-4 \${isClient ? 'bg-[#b78d59] rounded-bl-full translate-x-2 translate-y-[-50%]' : 'bg-[#2d2925] rounded-br-full -translate-x-2 translate-y-[-50%] border-r border-b border-white/5'}\`}></div>
                </div>

                {/* Text Bubble */}
                {msg.text && (
                  <div className={\`relative z-10 max-w-[85%] sm:max-w-[75%] px-4 py-2.5 \${attachmentsToRender.length > 0 || msg.actionItem ? 'mb-1' : ''} \${bubbleClass}\`}>
                    <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {attachmentsToRender.length === 0 && !msg.actionItem && (
                      <div className={\`float-right flex items-center gap-1 text-[10px] ml-4 mt-2 \${isClient ? 'text-[#1f1d1b]/70' : 'text-white/40'} font-sans font-bold\`}>
                        {msg.timestamp}
                        {isClient && <CheckCheck size={14} className="text-[#1f1d1b]" />}
                      </div>
                    )}
                    <div className="clear-both"></div>
                  </div>
                )}
                
                {/* Action Item Bubble */}
                {msg.actionItem && (
                  <div className={\`relative z-10 max-w-[85%] sm:max-w-[70%] p-5 mb-1 shadow-sm rounded-2xl \${isClient ? 'rounded-tr-sm bg-[#c2996b] text-[#1f1d1b]' : 'rounded-tl-sm bg-[#2d2925] text-luxury-50 border border-white/5'}\`}>
                    <div className="flex flex-col items-center text-center">
                      <div className={\`p-3 rounded-full mb-3 \${isClient ? 'bg-black/10' : 'bg-gold-500/10 text-gold-500'}\`}>
                        {msg.actionItem.type === 'PAYMENT' && <DollarSign size={24} />}
                        {msg.actionItem.type === 'APPROVAL' && <CheckCircle2 size={24} />}
                        {msg.actionItem.type === 'MEETING' && <CalendarIcon size={24} />}
                      </div>
                      <h4 className="font-bold text-lg mb-1">{msg.actionItem.title}</h4>
                      {msg.actionItem.type === 'PAYMENT' && (
                        <p className={\`text-xl font-bold font-serif mb-4 \${isClient ? 'text-[#1f1d1b]' : 'text-gold-500'}\`}>{msg.actionItem.amount} BHD</p>
                      )}
                      
                      {msg.actionItem.completed ? (
                        <div className={\`w-full mt-3 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 \${isClient ? 'bg-black/10' : 'bg-emerald-500/10 text-emerald-400'}\`}>
                          <CheckCircle2 size={16} />
                          {t('status.completed') || 'تم الإنجاز'}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(msg.id)}
                          className={\`w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95 \${isClient ? 'bg-[#1f1d1b] text-[#c2996b] hover:bg-black' : 'bg-[#b78d59] text-[#1f1d1b] hover:bg-[#c2996b]'}\`}
                        >
                          {msg.actionItem.type === 'PAYMENT' ? 'دفع الآن (Pay Now)' :
                           msg.actionItem.type === 'APPROVAL' ? 'اعتماد (Approve)' :
                           'حجز الموعد (Book)'}
                        </button>
                      )}
                    </div>
                    {attachmentsToRender.length === 0 && (
                      <div className={\`flex justify-end items-center gap-1 text-[10px] mt-3 \${isClient ? 'text-[#1f1d1b]/70' : 'text-white/40'} font-sans font-bold\`}>
                        {msg.timestamp}
                        {isClient && <CheckCheck size={14} className="text-[#1f1d1b]" />}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Attachments */}
                {attachmentsToRender.length > 0 && (
                  <div className={\`relative z-10 flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] w-full \${isClient ? 'items-end' : 'items-start'}\`}>
                    {attachmentsToRender.map((att, idx) => {
                      const isLast = idx === attachmentsToRender.length - 1;
                      
                      if (att.type === 'image' && att.url) {
                        return (
                          <div key={idx} className={\`relative group \${isClient ? 'items-end' : 'items-start'}\`}>
                            <button 
                              type="button"
                              onClick={() => setSelectedImage(att.url)}
                              className="text-left focus:outline-none"
                            >
                              <img 
                                src={att.url} 
                                alt={att.name} 
                                className={\`w-48 sm:w-64 h-auto max-h-64 object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in \${isClient ? 'rounded-tr-sm' : 'rounded-tl-sm'} border border-white/5\`}
                              />
                            </button>
                            {isLast && (
                              <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-sans font-bold text-white shadow-sm">
                                {msg.timestamp}
                                {isClient && <CheckCheck size={14} className="text-white" />}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className={\`relative px-4 py-3 w-64 \${bubbleClass}\`}>
                            <a href={att.url || '#'} download={att.name} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                              <div className={\`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 \${isClient ? 'bg-black/10 text-[#1f1d1b]' : 'bg-[#1c1a17] text-[#b78d59]'}\`}>
                                <Paperclip size={20} />
                              </div>
                              <div className="text-sm overflow-hidden flex-1">
                                <p className="font-bold truncate text-inherit leading-tight mb-1">{att.name}</p>
                                <p className="text-[11px] font-medium opacity-80 uppercase tracking-wider">{att.size}</p>
                              </div>
                            </a>
                            {isLast && (
                              <div className={\`float-right flex items-center gap-1 text-[10px] ml-3 mt-2 \${isClient ? 'text-[#1f1d1b]/70' : 'text-white/40'} font-sans font-bold\`}>
                                {msg.timestamp}
                                {isClient && <CheckCheck size={14} className="text-[#1f1d1b]" />}
                              </div>
                            )}
                            <div className="clear-both"></div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex flex-col relative items-start">
              <div className="absolute top-0 -left-2 w-4 h-4 overflow-hidden">
                <div className="w-4 h-4 bg-[#2d2925] rounded-br-full -translate-x-2 translate-y-[-50%] border-r border-b border-white/5"></div>
              </div>
              <div className="relative z-10 bg-[#2d2925] text-luxury-50 rounded-2xl rounded-tl-sm shadow-sm font-medium border border-white/5 px-4 py-3 flex items-center gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-2 rounded-full bg-luxury-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-luxury-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-luxury-400"></motion.div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Errors */}
        {attachmentError && (
          <div className="px-4 py-2 text-xs text-red-400 font-bold text-center bg-red-950/30 border-t border-red-900/30">
            {attachmentError}
          </div>
        )}
        
        {/* Pending Attachments */}
        {pendingAttachments.length > 0 && (
          <div className="px-4 py-3 bg-[#1c1a17] border-t border-white/5 flex flex-wrap gap-3 max-h-32 overflow-y-auto">
            {pendingAttachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[#2d2925] border border-white/5 rounded-xl pr-2 overflow-hidden shadow-sm">
                <div className="w-12 h-12 bg-[#1c1a17] flex items-center justify-center text-[#b78d59] shrink-0">
                  {att.type === 'image' ? (
                     <img src={att.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                     <Paperclip size={16} />
                  )}
                </div>
                <div className="text-xs overflow-hidden max-w-[120px]">
                  <p className="font-bold text-luxury-50 truncate">{att.name}</p>
                  <p className="font-medium text-luxury-400">{att.size}</p>
                </div>
                <button onClick={() => removePendingAttachment(idx)} className="text-luxury-500 hover:text-red-400 transition-colors p-1.5 ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-[#1c1a17] border-t border-white/5">
          <div className="flex flex-row-reverse items-end gap-3 max-w-4xl mx-auto">
            
            {/* Input Field Box (Grows to fill space) */}
            <div className="flex-1 bg-[#2d2925] rounded-3xl flex items-end relative border border-white/5 focus-within:border-[#b78d59]/50 transition-colors">
              <input 
                type="file" 
                multiple
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx"
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-3.5 pb-4 text-luxury-500 hover:text-[#b78d59] transition-colors shrink-0 rtl:pr-4 ltr:pl-4 self-end"
              >
                <Paperclip size={24} className="transform -rotate-45" />
              </button>
              <textarea 
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isAr ? "اكتب رسالتك..." : "Write a message..."} 
                className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-50 text-[15px] min-w-0 px-2 py-4 placeholder:text-luxury-500/70 resize-none overflow-y-auto no-scrollbar"
                rows={1}
                style={{ minHeight: '56px' }}
              />
            </div>
            
            {/* Send / Mic Button */}
            <button 
              onClick={input.trim() || pendingAttachments.length > 0 ? handleSend : () => {}} 
              className={\`w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all shadow-lg self-end \${(input.trim() || pendingAttachments.length > 0) ? 'bg-[#b78d59] text-[#1c1a17] hover:bg-[#a67c4d] scale-100' : 'bg-[#2d2925] text-[#b78d59] hover:bg-[#36312d] scale-100'}\`}
            >
              <AnimatePresence mode="wait">
                {(input.trim() || pendingAttachments.length > 0) ? (
                  <motion.div key="send" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Send size={24} className="ltr:ml-1 rtl:mr-1 rtl:-scale-x-100" />
                  </motion.div>
                ) : (
                  <motion.div key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Mic size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};`;

if (!code.match(regex)) {
  console.log("Regex mismatch!");
} else {
  fs.writeFileSync('src/pages/Communication.tsx', code.replace(regex, newUI));
  console.log("Patched successfully");
}
