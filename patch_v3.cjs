const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const startMarker = '        {/* Chat Messages Area */}';
const endMarker = '      </div>\n    </div>\n  );\n};';

const regex = new RegExp(
  startMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + 
  '[\\s\\S]*?' + 
  endMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
);

const newUI = `        {/* Chat Messages Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          
          {/* Date Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-800/60 text-white/70 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-white/5">
              {isAr ? 'اليوم' : 'Today'}
            </div>
          </div>

          {filteredChatHistory.map((msg) => {
            const attachmentsToRender = msg.attachments || (msg.attachment ? [msg.attachment] : []);
            const isClient = msg.sender === 'CLIENT';
            
            // Refined Bubble Classes
            const bubbleClass = isClient
              ? 'bg-amber-900/40 border border-amber-500/30 text-white rounded-2xl rounded-br-sm'
              : 'bg-neutral-800/80 border border-neutral-700/50 text-white rounded-2xl rounded-bl-sm';

            return (
              <div key={msg.id} className={\`flex flex-col w-full \${isClient ? 'items-end' : 'items-start'}\`}>
                
                {/* Text Bubble */}
                {msg.text && (
                  <div className={\`relative max-w-[85%] sm:max-w-[480px] px-3.5 pt-2 pb-1.5 shadow-sm backdrop-blur-md \${attachmentsToRender.length > 0 || msg.actionItem ? 'mb-1' : ''} \${bubbleClass}\`}>
                    <div className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                      {/* Invisible spacer to prevent text from overlapping the absolute timestamp */}
                      {attachmentsToRender.length === 0 && !msg.actionItem && (
                        <span className="inline-block w-14 h-4 ml-2"></span>
                      )}
                    </div>
                    {attachmentsToRender.length === 0 && !msg.actionItem && (
                      <div className={\`absolute bottom-1.5 ltr:right-2.5 rtl:left-2.5 flex items-center gap-1 text-[11px] font-sans font-medium \${isClient ? 'text-amber-200/70' : 'text-neutral-400'}\`}>
                        {msg.timestamp}
                        {isClient && <CheckCheck size={13} />}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Action Item Bubble */}
                {msg.actionItem && (
                  <div className={\`relative max-w-[85%] sm:max-w-[480px] p-5 mb-1 shadow-sm backdrop-blur-md \${isClient ? 'bg-amber-900/40 border border-amber-500/30 text-white rounded-2xl rounded-br-sm' : 'bg-neutral-800/80 border border-neutral-700/50 text-white rounded-2xl rounded-bl-sm'}\`}>
                    <div className="flex flex-col items-center text-center">
                      <div className={\`p-3 rounded-full mb-3 \${isClient ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-700/50 text-amber-500'}\`}>
                        {msg.actionItem.type === 'PAYMENT' && <DollarSign size={24} />}
                        {msg.actionItem.type === 'APPROVAL' && <CheckCircle2 size={24} />}
                        {msg.actionItem.type === 'MEETING' && <CalendarIcon size={24} />}
                      </div>
                      <h4 className="font-bold text-lg mb-1">{msg.actionItem.title}</h4>
                      {msg.actionItem.type === 'PAYMENT' && (
                        <p className="text-xl font-bold font-serif mb-4 text-amber-400">{msg.actionItem.amount} BHD</p>
                      )}
                      
                      {msg.actionItem.completed ? (
                        <div className="w-full mt-3 py-2 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 size={16} />
                          {t('status.completed') || 'تم الإنجاز'}
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(msg.id)}
                          className="w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95 bg-amber-500 hover:bg-amber-400 text-neutral-950"
                        >
                          {msg.actionItem.type === 'PAYMENT' ? (isAr ? 'دفع الآن' : 'Pay Now') :
                           msg.actionItem.type === 'APPROVAL' ? (isAr ? 'اعتماد' : 'Approve') :
                           (isAr ? 'حجز الموعد' : 'Book')}
                        </button>
                      )}
                    </div>
                    {attachmentsToRender.length === 0 && (
                      <div className={\`flex justify-end items-center gap-1 text-[11px] mt-3 font-sans font-medium \${isClient ? 'text-amber-200/70' : 'text-neutral-400'}\`}>
                        {msg.timestamp}
                        {isClient && <CheckCheck size={13} />}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Attachments */}
                {attachmentsToRender.length > 0 && (
                  <div className={\`flex flex-col gap-1 max-w-[85%] sm:max-w-[480px] w-full \${isClient ? 'items-end' : 'items-start'}\`}>
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
                                className={\`w-56 sm:w-72 h-auto max-h-72 object-cover shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in \${isClient ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'} border border-white/10\`}
                              />
                            </button>
                            {isLast && (
                              <div className="absolute bottom-2 ltr:right-2 rtl:left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-sans font-medium text-white shadow-sm">
                                {msg.timestamp}
                                {isClient && <CheckCheck size={13} className="text-white" />}
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div key={idx} className={\`relative px-3.5 py-3 w-64 sm:w-72 shadow-sm backdrop-blur-md \${bubbleClass}\`}>
                            <a href={att.url || '#'} download={att.name} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-neutral-900/40 text-amber-500">
                                <Paperclip size={20} />
                              </div>
                              <div className="text-sm overflow-hidden flex-1">
                                <p className="font-bold truncate text-inherit leading-tight mb-1">{att.name}</p>
                                <p className="text-[11px] font-medium opacity-70 uppercase tracking-wider">{att.size}</p>
                              </div>
                            </a>
                            {isLast && (
                              <div className={\`absolute bottom-1.5 ltr:right-2.5 rtl:left-2.5 flex items-center gap-1 text-[11px] font-sans font-medium \${isClient ? 'text-amber-200/70' : 'text-neutral-400'}\`}>
                                {msg.timestamp}
                                {isClient && <CheckCheck size={13} />}
                              </div>
                            )}
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
            <div className="flex flex-col relative items-start w-full">
              <div className="relative max-w-[85%] px-4 py-3 shadow-sm backdrop-blur-md bg-neutral-800/80 border border-neutral-700/50 text-neutral-400 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-neutral-400"></motion.div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Errors */}
        {attachmentError && (
          <div className="relative z-10 px-4 py-2 text-xs text-red-400 font-bold text-center bg-red-950/80 border-t border-red-900/50 backdrop-blur-md">
            {attachmentError}
          </div>
        )}
        
        {/* Pending Attachments */}
        {pendingAttachments.length > 0 && (
          <div className="relative z-10 px-4 py-3 bg-neutral-900/90 backdrop-blur-xl border-t border-white/5 flex flex-wrap gap-3 max-h-32 overflow-y-auto">
            {pendingAttachments.map((att, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-neutral-800 border border-white/5 rounded-xl pr-2 overflow-hidden shadow-sm">
                <div className="w-12 h-12 bg-neutral-900 flex items-center justify-center text-amber-500 shrink-0">
                  {att.type === 'image' ? (
                     <img src={att.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                     <Paperclip size={16} />
                  )}
                </div>
                <div className="text-xs overflow-hidden max-w-[120px]">
                  <p className="font-bold text-neutral-50 truncate">{att.name}</p>
                  <p className="font-medium text-neutral-400">{att.size}</p>
                </div>
                <button onClick={() => removePendingAttachment(idx)} className="text-neutral-500 hover:text-red-400 transition-colors p-1.5 ml-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Area (Telegram Web Style) */}
        <div className="relative z-10 p-3 bg-transparent">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            
            {/* Input Field Box */}
            <div className="flex-1 bg-neutral-900/90 backdrop-blur-xl rounded-2xl sm:rounded-full flex items-end relative border border-neutral-700/60 focus-within:border-amber-500/50 transition-colors shadow-sm">
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
                className="p-3 pb-3.5 text-neutral-500 hover:text-amber-400 transition-colors shrink-0 rtl:pr-4 ltr:pl-4 self-end focus:outline-none"
              >
                <Paperclip size={22} className="transform -rotate-45" />
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
                placeholder={isAr ? "رسالة..." : "Message..."} 
                className="flex-1 bg-transparent border-none focus:outline-none font-medium text-neutral-50 text-[15px] min-w-0 px-2 py-4 placeholder:text-neutral-500 resize-none overflow-y-auto no-scrollbar"
                rows={1}
                style={{ minHeight: '56px' }}
              />
            </div>
            
            {/* Send / Mic Button */}
            <button 
              onClick={input.trim() || pendingAttachments.length > 0 ? handleSend : () => {}} 
              className={\`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full flex items-center justify-center transition-all shadow-lg self-end focus:outline-none \${(input.trim() || pendingAttachments.length > 0) ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 scale-100' : 'bg-neutral-800 border border-neutral-700/50 text-neutral-400 hover:text-amber-400 scale-100'}\`}
            >
              <AnimatePresence mode="wait">
                {(input.trim() || pendingAttachments.length > 0) ? (
                  <motion.div key="send" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Send size={22} className="ltr:ml-1 rtl:mr-1 rtl:-scale-x-100" />
                  </motion.div>
                ) : (
                  <motion.div key="mic" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Mic size={22} />
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
  code = code.replace(regex, newUI);
  fs.writeFileSync('src/pages/Communication.tsx', code);
  console.log("Patched UI part successfully");
}
