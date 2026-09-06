import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
