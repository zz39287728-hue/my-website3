const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const translateEndpoint = `
  // Translation API using Google Translate free endpoint
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
  });

  // Health check`;

if (!code.includes('/api/translate')) {
  code = code.replace("  // Health check", translateEndpoint);
  fs.writeFileSync('server.ts', code);
  console.log("Translate endpoint added to server.ts");
}
