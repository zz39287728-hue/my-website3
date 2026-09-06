const fs = require('fs');

// 1. Patch server.ts
let serverCode = fs.readFileSync('server.ts', 'utf-8');

const newServerTranslate = `// Translation API using Gemini
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and targetLang are required' });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         return res.json({ translatedText: "Translation service is currently unavailable.", detectedLanguage: "Unknown" });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const SYSTEM_INSTRUCTION = "You are a professional real-time multilingual translator. Detect the input language automatically and translate it into the target language requested. Output ONLY the translated text without quotes, markdown formatting, greetings, or any explanations. IMPORTANT: Format your response exactly as: DetectedLanguageName|TranslatedText";
      
      const prompt = \`Target language: \${targetLang === 'ar' ? 'Arabic' : 'English'}\\n\\nText: "\${text}"\`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1,
          maxOutputTokens: 300
        }
      });
      
      const output = response.text?.trim() || '';
      const parts = output.split('|');
      let detectedLanguage = 'Auto';
      let translatedText = 'Translation failed';
      
      if (parts.length >= 2) {
        detectedLanguage = parts[0].trim();
        translatedText = parts.slice(1).join('|').trim();
      } else {
        translatedText = output;
      }
      
      res.json({ translatedText, detectedLanguage });
    } catch (error) {
      console.error('Translation Error:', error);
      res.status(500).json({ error: 'Failed to translate' });
    }
  });`;

serverCode = serverCode.replace(/\/\/ Translation API using Gemini[\s\S]*?res\.status\(500\)\.json\(\{ error: 'Failed to translate' \}\);\n    \}\n  \}\);/, newServerTranslate);
fs.writeFileSync('server.ts', serverCode);
console.log("server.ts patched.");

// 2. Patch Communication.tsx
let clientCode = fs.readFileSync('src/pages/Communication.tsx', 'utf-8');

// Add detectedLang state
const stateOld = `const [translatedText, setTranslatedText] = useState<Record<string, string>>({});`;
const stateNew = `const [translatedText, setTranslatedText] = useState<Record<string, string>>({});\n  const [detectedLang, setDetectedLang] = useState<Record<string, string>>({});`;
if (!clientCode.includes('setDetectedLang')) {
  clientCode = clientCode.replace(stateOld, stateNew);
}

// Replace handleTranslate
const handleOldRegex = /const handleTranslate = async \([\s\S]*?setIsTranslating\(prev => \(\{ \.\.\.prev, \[msgId\]: false \}\)\);\n    \}\n  \};/;
const handleNew = `const handleTranslate = async (msgId: string, text: string) => {
    if (translatedMessages[msgId]) {
      setTranslatedMessages(prev => ({ ...prev, [msgId]: false }));
      return;
    }

    if (translatedText[msgId]) {
      setTranslatedMessages(prev => ({ ...prev, [msgId]: true }));
      return;
    }

    setIsTranslating(prev => ({ ...prev, [msgId]: true }));
    try {
      const targetLang = isAr ? 'ar' : 'en';
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedText(prev => ({ ...prev, [msgId]: data.translatedText }));
        if (data.detectedLanguage) {
           setDetectedLang(prev => ({ ...prev, [msgId]: data.detectedLanguage }));
        }
        setTranslatedMessages(prev => ({ ...prev, [msgId]: true }));
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [msgId]: false }));
    }
  };`;
clientCode = clientCode.replace(handleOldRegex, handleNew);

// Replace Text Bubble
const bubbleOldRegex = /<div className="text-\[15px\] font-medium leading-relaxed whitespace-pre-wrap break-words">[\s\S]*?\{msg\.text\}[\s\S]*?\{isAr \? 'ترجمة' : 'Translate'\}\)}[\s\S]*?<\/button>/;

const bubbleNew = `<div className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                      
                      {/* Translated Text Block */}
                      {translatedMessages[msg.id] && translatedText[msg.id] && (
                        <div className={\`mt-2 pt-2 border-t \${isClient ? 'border-amber-500/30' : 'border-neutral-600/50'}\`}>
                          <div className={\`text-[11px] mb-1 italic flex items-center gap-1 \${isClient ? 'text-amber-200/70' : 'text-neutral-400'}\`}>
                            <Languages size={10} />
                            {isAr ? \`(مترجم من: \${detectedLang[msg.id] || 'تلقائي'})\` : \`(Translated from: \${detectedLang[msg.id] || 'Auto'})\`}
                          </div>
                          <div className="text-[14.5px] leading-relaxed">
                            {translatedText[msg.id]}
                          </div>
                        </div>
                      )}

                      {/* Invisible spacer to prevent text from overlapping the absolute timestamp */}
                      {attachmentsToRender.length === 0 && !msg.actionItem && (
                        <span className="inline-block w-14 h-4 ml-2"></span>
                      )}
                    </div>
                    
                    {/* Translate Button */}
                    <button 
                      onClick={() => handleTranslate(msg.id, msg.text)}
                      disabled={isTranslating[msg.id]}
                      className={\`mt-1.5 flex items-center gap-1.5 text-[11px] font-medium hover:opacity-80 transition-opacity disabled:opacity-50 \${isClient ? 'text-amber-200/80' : 'text-neutral-400/80'}\`}
                    >
                      <Languages size={12} className={isTranslating[msg.id] ? "animate-pulse" : ""} />
                      {isTranslating[msg.id] 
                        ? (isAr ? 'جاري الترجمة...' : 'Translating...')
                        : translatedMessages[msg.id] 
                          ? (isAr ? 'إخفاء الترجمة' : 'Hide Translation')
                          : (isAr ? 'ترجمة' : 'Translate')}
                    </button>`;

clientCode = clientCode.replace(bubbleOldRegex, bubbleNew);
fs.writeFileSync('src/pages/Communication.tsx', clientCode);
console.log("Communication.tsx patched.");

