const fs = require('fs');
let code = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

const stateDecls = `  const [input, setInput] = useState('');
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});
  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});`;

code = code.replace("  const [input, setInput] = useState('');\n  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});\n  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});", stateDecls);

const scrollFn = `  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };`;

const newScrollFnAndTranslateFn = `  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTranslate = async (msgId: string, text: string) => {
    if (translatedMessages[msgId]) {
      // Toggle back to original
      setTranslatedMessages(prev => ({ ...prev, [msgId]: false }));
      return;
    }

    if (translatedText[msgId]) {
      // Already translated, just show it
      setTranslatedMessages(prev => ({ ...prev, [msgId]: true }));
      return;
    }

    // Need to fetch translation
    setIsTranslating(prev => ({ ...prev, [msgId]: true }));
    try {
      const targetLang = isAr ? 'ar' : 'en'; // translate to current app lang
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedText(prev => ({ ...prev, [msgId]: data.translatedText }));
        setTranslatedMessages(prev => ({ ...prev, [msgId]: true }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [msgId]: false }));
    }
  };`;

code = code.replace(scrollFn, newScrollFnAndTranslateFn);

const oldTranslateBtn = `{/* Translate Button */}
                    <button 
                      onClick={() => setTranslatedMessages(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className={\`mt-1 flex items-center gap-1.5 text-[11px] font-medium hover:opacity-80 transition-opacity \${isClient ? 'text-amber-200/80' : 'text-neutral-400/80'}\`}
                    >
                      <Languages size={12} />
                      {translatedMessages[msg.id] 
                        ? (isAr ? 'عرض النص الأصلي' : 'Show Original')
                        : (isAr ? 'ترجمة' : 'Translate')}
                    </button>`;

const newTranslateBtn = `{/* Translate Button */}
                    <button 
                      onClick={() => handleTranslate(msg.id, msg.text)}
                      disabled={isTranslating[msg.id]}
                      className={\`mt-1 flex items-center gap-1.5 text-[11px] font-medium hover:opacity-80 transition-opacity disabled:opacity-50 \${isClient ? 'text-amber-200/80' : 'text-neutral-400/80'}\`}
                    >
                      <Languages size={12} className={isTranslating[msg.id] ? "animate-pulse" : ""} />
                      {isTranslating[msg.id] 
                        ? (isAr ? 'جاري الترجمة...' : 'Translating...')
                        : translatedMessages[msg.id] 
                          ? (isAr ? 'عرض النص الأصلي' : 'Show Original')
                          : (isAr ? 'ترجمة' : 'Translate')}
                    </button>`;

code = code.replace(oldTranslateBtn, newTranslateBtn);

const textPlaceholder = `{translatedMessages[msg.id] 
                        ? (translatedText[msg.id] || (isAr ? 'Translated text placeholder' : 'نص مترجم تجريبي')) 
                        : msg.text}`;
const newTextPlaceholder = `{translatedMessages[msg.id] && translatedText[msg.id]
                        ? translatedText[msg.id]
                        : msg.text}`;

code = code.replace(textPlaceholder, newTextPlaceholder);

fs.writeFileSync('src/pages/Communication.tsx', code);
console.log("Translation logic patched!");
