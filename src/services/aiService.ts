export const askZain = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.text || "I apologize, I am currently unable to process your request.";
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback engine for zero-downtime offline responses
    return "As your dedicated advisor, I am currently analyzing the latest architectural trends offline. Please leave your inquiry, and Arch. Zainab's team will address it shortly.";
  }
};
