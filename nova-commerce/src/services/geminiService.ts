import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
  // Safely access Vite env vars
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {}

  // Safely access Process env vars (fallback)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {}

  return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateSupportResponse = async (userMessage: string, context: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful customer support agent for NovaCommerce, a modern tech store. 
    Be polite, concise, and helpful. 
    Current context about the store: ${context}.
    If you don't know an answer, suggest they email support@novacommerce.com.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm having trouble connecting right now. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please try again later.";
  }
};