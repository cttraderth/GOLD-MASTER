
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Analyze market sentiment using the Gemini 3 Flash model
export const analyzeMarketSentiment = async (price: number, trend: string, lang: Language = 'en') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langMsg = lang === 'th' ? "Respond in Thai language." : "Respond in English language.";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze current gold market sentiment. Current Price: $${price}. Trend: ${trend}. Give a short, professional trading insight (max 100 words). ${langMsg}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return lang === 'th' ? "ตลาดกำลังพักฐานเฝ้ารอจังหวะเบรคเอาท์" : "Market is currently showing neutral consolidation.";
  }
};

// Get interactive learning responses from the AI tutor
export const getAITutorResponse = async (question: string, lang: Language = 'en') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langMsg = lang === 'th' ? "Respond in Thai language." : "Respond in English language.";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Gold Master AI Tutor. Help the user learn about gold trading. Question: ${question}. ${langMsg}`,
      config: {
        systemInstruction: "You are an expert commodities trader with 20 years of experience. Be encouraging, concise, and technical where necessary.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Tutor Error:", error);
    return lang === 'th' ? "ขออภัย ระบบขัดข้องชั่วคราว" : "I am currently calibrating my market data. Please try again in a moment.";
  }
};
