
import { GoogleGenAI, Type } from "@google/genai";
import { Language, TradeSignal } from "../types";

export const aiService = {
  // Core Analysis Engine
  analyzeMarket: async (price: number, trend: string, lang: Language = 'en') => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze XAUUSD. Price: $${price}. Trend: ${trend}. Language: ${lang}. Short insight (100 words).`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error("AI Analysis Error", error);
      return null;
    }
  },

  // Simulated Backend Process: Auto-generate Signals
  generateSmartSignal: async (currentPrice: number): Promise<Partial<TradeSignal> | null> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Act as a senior gold analyst. Generate a realistic XAUUSD trading signal based on current price of $${currentPrice}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "BUY or SELL" },
              entry: { type: Type.NUMBER },
              sl: { type: Type.NUMBER },
              tp1: { type: Type.NUMBER },
              tp2: { type: Type.NUMBER },
              probability: { type: Type.NUMBER, description: "Percentage from 0-100" },
              analysis: { type: Type.STRING }
            },
            required: ["type", "entry", "sl", "tp1", "tp2", "probability", "analysis"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      return {
        id: Math.random().toString(36).substr(2, 9),
        pair: 'XAUUSD',
        type: result.type,
        entry: result.entry,
        sl: result.sl,
        tp1: result.tp1,
        tp2: result.tp2,
        timestamp: new Date().toISOString(),
        status: 'ACTIVE',
        aiAnalysis: result.analysis,
        isVip: result.probability > 90,
        probability: result.probability
      } as TradeSignal;
    } catch (error) {
      console.error("Signal Generation Error", error);
      return null;
    }
  },

  getTutorResponse: async (question: string, lang: Language = 'en') => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: question,
        config: {
          systemInstruction: `Expert Gold Trader tutor. Answer in ${lang}. Be technical but clear.`,
        }
      });
      return response.text;
    } catch (error) {
      return null;
    }
  }
};
