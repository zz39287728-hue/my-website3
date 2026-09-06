const fs = require('fs');
const lines = fs.readFileSync('src/pages/Communication.tsx', 'utf-8').split('\n');
const start = 191; // line 192 is index 191
const end = 422; // The line before `export const Booking`

const newUI = `  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-4 text-luxury-100">
      {/* Lightbox / Modal for Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Preview" className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" />
            <a 
              href={selectedImage} 
              download="attachment"
              className="mt-6 flex items-center gap-2 bg-white/10 text-white px-6 py-2.5 rounded-full hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md"
            >
              <Download size={18} />
              <span className="font-bold text-sm">{isAr ? 'تحميل الصورة' : 'Download Image'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Chat Container - Telegram Dark Style */}
      <div className="flex-1 flex flex-col p-0 overflow-hidden rounded-2xl bg-[#1c1a17] border border-white/5 shadow-2xl">
        
        {/* Top Bar - Contact Switcher */}
        <div className="p-4 border-b border-white/5 bg-[#1c1a17] flex items-center gap-4">
          <button 
            onClick={() => setActiveThread('SUPPORT')}
            className={\`flex-1 flex items-center justify-center sm:justify-start gap-4 p-3 rounded-2xl border transition-all \${activeThread === 'SUPPORT' ? 'bg-[#2c2824] border-gold-600/30' : 'hover:bg-white/5 border-transparent'}\`}
          >
            <div className="w-12 h-12 rounded-full bg-[#1c1a17] flex items-center justify-center border border-white/10 shrink-0">
              <Headphones size={24} className="text-luxury-400" />
            </div>
            <div className="hidden sm:block text-left rtl:text-right overflow-hidden">
              <h3 className="font-bold text-sm text-luxury-50 truncate">{isAr ? 'فريق الدعم الفني' : 'Support Team'}</h3>
              <p className="text-[11px] text-luxury-400">{isAr ? 'التبديل إلى لوحة الدعم' : 'Switch to Support'}</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveThread('ARCHITECT')}
            className={\`flex-1 flex items-center justify-center sm:justify-start gap-4 p-3 rounded-2xl border transition-all \${activeThread === 'ARCHITECT' ? 'bg-[#2c2824] border-gold-600/30' : 'hover:bg-white/5 border-transparent'}\`}
          >
            <img src={globalState.architectProfile?.avatar || "https://picsum.photos/id/1027/100/100"} alt="Designer" className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0" />
            <div className="hidden sm:block text-left rtl:text-right overflow-hidden">
              <h3 className="font-bold text-sm text-luxury-50 truncate">{globalState.architectProfile?.name || 'ARCH. ZAINAB AL-ZAKI'}</h3>
              <p className="text-[11px] text-luxury-400">{isAr ? 'التبديل إلى لوحة المهندس' : 'Switch to Architect'}</p>
            </div>
          </button>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar bg-[#1c1a17]">
          {filteredChatHistory.map((msg) => {
            const attachmentsToRender = msg.attachments || (msg.attachment ? [msg.attachment] : []);
            const isClient = msg.sender === 'CLIENT';
            
            // Sent by client: gold/brown, received: dark grey
            const bubbleClass = isClient
              ? 'bg-[#b78d59] text-[#1f1d1b] rounded-2xl rounded-tr-sm shadow-sm font-medium'
              : 'bg-[#2d2925] text-luxury-50 rounded-2xl rounded-tl-sm shadow-sm font-medium';

            return (
              <div key={msg.id} className={\`flex flex-col \${isClient ? 'items-end' : 'items-start'}\`}>
                
                {/* Text Bubble */}
                {msg.text && (
                  <div className={\`relative max-w-[85%] sm:max-w-[70%] px-4 py-2.5 \${attachmentsToRender.length > 0 || msg.actionItem ? 'mb-1' : ''} \${bubbleClass}\`}>
                    <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {attachmentsToRender.length === 0 && !msg.actionItem && (
                      <span className={\`float-right text-[10px] ml-3 mt-2 \${isClient ? 'text-black/60' : 'text-white/40'} font-sans font-bold\`}>{msg.timestamp}</span>
                    )}
                    <div className="clear-both"></div>
                  </div>
                )}
                
                {/* Action Item Bubble */}
                {msg.actionItem && (
                  <div className={\`relative max-w-[85%] sm:max-w-[70%] p-5 mb-1 shadow-sm rounded-2xl \${isClient ? 'rounded-tr-sm bg-[#c2996b] text-[#1f1d1b]' : 'rounded-tl-sm bg-[#2d2925] text-luxury-50'}\`}>
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
                      <span className={\`block text-right text-[10px] mt-3 \${isClient ? 'text-black/60' : 'text-white/40'} font-sans font-bold\`}>{msg.timestamp}</span>
                    )}
                  </div>
                )}
                
                {/* Attachments */}
                {attachmentsToRender.length > 0 && (
                  <div className={\`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] w-full \${isClient ? 'items-end' : 'items-start'}\`}>
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
                                className={\`w-48 sm:w-60 h-auto max-h-64 object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in \${isClient ? 'rounded-tr-sm' : 'rounded-tl-sm'} border border-white/5\`}
                              />
                            </button>
                            {isLast && (
                              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-sans font-bold text-white shadow-sm">
                                {msg.timestamp}
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
                              <span className={\`float-right text-[10px] ml-3 mt-2 \${isClient ? 'text-black/60' : 'text-white/40'} font-sans font-bold\`}>{msg.timestamp}</span>
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
            <div className="flex-1 bg-[#2d2925] rounded-full flex items-center relative border border-white/5 focus-within:border-[#b78d59]/50 transition-colors">
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
                className="p-3.5 text-luxury-500 hover:text-[#b78d59] transition-colors shrink-0 rtl:pr-4 ltr:pl-4"
              >
                <Paperclip size={20} className="transform -rotate-45" />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isAr ? "اكتب رسالتك..." : "Write a message..."} 
                className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-50 text-[15px] min-w-0 px-2 py-3.5 placeholder:text-luxury-500/70" 
              />
            </div>
            
            {/* Send Button */}
            <button 
              onClick={handleSend} 
              disabled={!input.trim() && pendingAttachments.length === 0}
              className="w-12 h-12 shrink-0 bg-[#b78d59] text-[#1c1a17] rounded-full flex items-center justify-center hover:bg-[#a67c4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send size={20} className="ltr:ml-1 rtl:mr-1 rtl:-scale-x-100" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};`

lines.splice(start, end - start, newUI);
fs.writeFileSync('src/pages/Communication.tsx', lines.join('\n'));
console.log("Patched successfully.");
