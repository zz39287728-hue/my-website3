const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const oldMsgBubble = `{msg.text && (
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
                        {isClient && (msg.status === 'SENT' ? <Check size={13} /> : <CheckCheck size={13} />)}
                      </div>
                    )}
                  </div>
                )}`;

const newMsgBubble = `{msg.text && (
                  <div className={\`relative max-w-[85%] sm:max-w-[480px] px-3.5 pt-2 pb-1.5 shadow-sm backdrop-blur-md \${attachmentsToRender.length > 0 || msg.actionItem ? 'mb-1' : ''} \${bubbleClass}\`}>
                    <div className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">
                      {translatedMessages[msg.id] 
                        ? (translatedText[msg.id] || (isAr ? 'Translated text placeholder' : 'نص مترجم تجريبي')) 
                        : msg.text}
                      {/* Invisible spacer to prevent text from overlapping the absolute timestamp */}
                      {attachmentsToRender.length === 0 && !msg.actionItem && (
                        <span className="inline-block w-14 h-4 ml-2"></span>
                      )}
                    </div>
                    
                    {/* Translate Button */}
                    <button 
                      onClick={() => setTranslatedMessages(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className={\`mt-1 flex items-center gap-1.5 text-[11px] font-medium hover:opacity-80 transition-opacity \${isClient ? 'text-amber-200/80' : 'text-neutral-400/80'}\`}
                    >
                      <Languages size={12} />
                      {translatedMessages[msg.id] 
                        ? (isAr ? 'عرض النص الأصلي' : 'Show Original')
                        : (isAr ? 'ترجمة' : 'Translate')}
                    </button>

                    {attachmentsToRender.length === 0 && !msg.actionItem && (
                      <div className={\`absolute bottom-1.5 ltr:right-2.5 rtl:left-2.5 flex items-center gap-1 text-[11px] font-sans font-medium \${isClient ? 'text-amber-200/70' : 'text-neutral-400'}\`}>
                        {msg.timestamp}
                        {isClient && (msg.status === 'SENT' ? <Check size={13} /> : <CheckCheck size={13} />)}
                      </div>
                    )}
                  </div>
                )}`;

if (code.includes(oldMsgBubble)) {
  code = code.replace(oldMsgBubble, newMsgBubble);
  fs.writeFileSync('src/pages/Communication.tsx', code);
  console.log("Translate button added!");
} else {
  console.log("Could not find the text bubble code.");
}
