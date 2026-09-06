const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const oldRetry = `// Helper to retry Gemini API calls
async function callGeminiWithRetry(ai, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isUnavailable = error.status === 503 || error.status === 'UNAVAILABLE' || (error.message && error.message.includes('503'));
      if (isUnavailable && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 500; // Exponential backoff with jitter
        console.warn(\`Gemini API 503 Error. Retrying in \${Math.round(delay)}ms...\`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}`;

const newRetry = `// Helper to retry Gemini API calls
async function callGeminiWithRetry(ai, params, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      const isRateLimitOrUnavailable = error.status === 429 || error.status === 503 || error.status === 'UNAVAILABLE' || (error.message && (error.message.includes('429') || error.message.includes('503') || error.message.includes('quota') || error.message.includes('resource_exhausted')));
      if (isRateLimitOrUnavailable && i < retries - 1) {
        const delay = 2000;
        console.warn(\`Gemini API Rate Limit / 503 Error. Retrying in \${delay}ms...\`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}`;

code = code.replace(oldRetry, newRetry);

// Replace models to gemini-2.0-flash
code = code.replace(/model: 'gemini-3.6-flash'/g, "model: 'gemini-2.0-flash'");

// Replace translation catch block
const oldTranslateCatch = `    } catch (error) {
      console.error('Translation Error:', error);
      res.status(500).json({ error: 'Failed to translate' });
    }`;

const newTranslateCatch = `    } catch (error) {
      console.error('Translation Error:', error);
      const isRateLimit = error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('resource_exhausted')));
      if (isRateLimit) {
        return res.json({ 
          translatedText: targetLang === 'ar' ? 'يرجى الانتظار بضع ثوانٍ قبل طلب ترجمة أخرى' : 'Please wait a few seconds before requesting another translation.',
          detectedLanguage: 'Auto'
        });
      }
      res.status(500).json({ error: 'Failed to translate' });
    }`;

code = code.replace(oldTranslateCatch, newTranslateCatch);

fs.writeFileSync('server.ts', code);
console.log("server.ts patched for rate limit.");
