const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const retryFunction = `
// Helper to retry Gemini API calls
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
}
`;

if (!code.includes('callGeminiWithRetry')) {
  code = code.replace(`async function startServer() {`, `${retryFunction}\nasync function startServer() {`);
  code = code.replace(/await ai\.models\.generateContent\(\{/g, `await callGeminiWithRetry(ai, {`);
  fs.writeFileSync('server.ts', code);
  console.log("Retry mechanism added to server.ts");
}
