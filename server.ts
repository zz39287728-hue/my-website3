import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';


// Helper to retry Gemini API calls
async function callGeminiWithRetry(ai, params, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isRateLimitOrUnavailable = error.status === 429 || error.status === 503 || error.status === 'UNAVAILABLE' || (error.message && (error.message.includes('429') || error.message.includes('503') || error.message.includes('quota') || error.message.includes('resource_exhausted')));
      if (isRateLimitOrUnavailable && i < retries - 1) {
        const delay = 2000;
        console.warn(`Gemini API Rate Limit / 503 Error. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const SYSTEM_INSTRUCTION = `You are "Zain", an elite virtual architectural advisor for ZAINTERIOR, a luxury interior design studio in Bahrain led by Arch. Zainab Al-Zaki. 
You assist VIP clients with expertise in natural stone geologies, ergonomics, spatial clearances, architectural lighting, and high-performance luxury textiles.
Keep responses concise, elegant, professional, and tailored to high-net-worth individuals in the Gulf region.`;

  // API route for Zain AI
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Valid prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          text: "As your dedicated advisor, I am currently analyzing the latest architectural trends offline. Please leave your inquiry, and Arch. Zainab's team will address it shortly."
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await callGeminiWithRetry(ai, {
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      res.json({
        text: response.text || "I apologize, I am currently unable to process your request."
      });
    } catch (error) {
      console.error("AI Service Error:", error);
      res.json({
        text: "As your dedicated advisor, I am currently analyzing the latest architectural trends offline. Please leave your inquiry, and Arch. Zainab's team will address it shortly."
      });
    }
  });


  // Translation API using Gemini
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
      
      const prompt = `Target language: ${targetLang === 'ar' ? 'Arabic' : 'English'}\n\nText: "${text}"`;
      
      const response = await callGeminiWithRetry(ai, {
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
      const isRateLimit = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('resource_exhausted')));
      if (isRateLimit) {
        return res.json({ 
          translatedText: targetLang === 'ar' ? 'يرجى الانتظار بضع ثوانٍ قبل طلب ترجمة أخرى' : 'Please wait a few seconds before requesting another translation.',
          detectedLanguage: 'Auto'
        });
      }
      res.status(500).json({ error: 'Failed to translate' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZAINTERIOR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
