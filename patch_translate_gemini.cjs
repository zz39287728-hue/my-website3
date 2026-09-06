const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldTranslateEndpoint = `  // Translation API using Google Translate free endpoint
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and targetLang are required' });
      }
      
      const response = await fetch(\`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=\${targetLang}&dt=t&q=\${encodeURIComponent(text)}\`);
      const data = await response.json();
      
      let translatedText = '';
      if (data && data[0]) {
        data[0].forEach((item: any) => {
          if (item[0]) translatedText += item[0];
        });
      }
      
      res.json({ translatedText: translatedText || 'Translation failed' });
    } catch (error) {
      console.error('Translation Error:', error);
      res.status(500).json({ error: 'Failed to translate' });
    }
  });`;

const newTranslateEndpoint = `  // Translation API using Gemini
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and targetLang are required' });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         return res.json({ translatedText: "Translation service is currently unavailable." });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = \`Translate the following text into \${targetLang === 'ar' ? 'Arabic' : 'English'}. Only return the translated text, nothing else.\\n\\nText: "\${text}"\`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
        }
      });
      
      res.json({ translatedText: response.text?.trim() || 'Translation failed' });
    } catch (error) {
      console.error('Translation Error:', error);
      res.status(500).json({ error: 'Failed to translate' });
    }
  });`;

if (code.includes('// Translation API using Google Translate free endpoint')) {
  code = code.replace(oldTranslateEndpoint, newTranslateEndpoint);
  fs.writeFileSync('server.ts', code);
  console.log("Translate endpoint updated to use Gemini.");
} else {
  console.log("Could not find old translate endpoint.");
}
