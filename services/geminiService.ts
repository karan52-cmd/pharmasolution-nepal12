import { GoogleGenAI } from "@google/genai";

// NOTE: In a real app, this key should be in process.env.API_KEY
// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const GeminiService = {
  async askTutor(question: string): Promise<string> {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert pharmacology tutor for students in Nepal. 
                   Answer the following question clearly and concisely. 
                   If the question is not related to pharmacy, medicine, or science, politely decline.
                   
                   Question: ${question}`,
      });
      
      return response.text || "I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Sorry, I'm having trouble connecting to the Pharma Brain right now.";
    }
  },

  async generateQuestionsFromFile(base64Data: string, mimeType: string): Promise<GeneratedQuestion[]> {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: `Analyze the provided document/image thoroughly. 
                     Generate a comprehensive set of multiple choice questions covering all key concepts, definitions, and clinical details found in the content.
                     If the document contains a list of questions, extract ALL of them.
                     If the document is study material, generate as many high-quality questions as possible to cover the material fully.
                     Do NOT arbitrarily limit the number of questions.

                     Return ONLY a raw JSON array. Do not use Markdown code blocks.
                     Each object in the array must have:
                     - "text": The question string
                     - "options": An array of 4 possible answers
                     - "correctAnswer": The index (0-3) of the correct option
                     - "explanation": A brief explanation of why the answer is correct.`
            }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      let text = response.text;
      if (!text) return [];
      
      // Clean up potential markdown formatting
      text = text.replace(/```json\n?|```/g, '').trim();
      
      // Parse JSON safely
      const questions = JSON.parse(text);
      return questions;
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw new Error("Failed to generate questions from file.");
    }
  }
};