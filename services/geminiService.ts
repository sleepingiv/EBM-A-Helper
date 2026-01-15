
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export async function solveMedicalQuery(query: string): Promise<AIResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: query }] }],
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: `You are a medical expert providing Evidence-Based Medicine (EBM) information to laypeople. 
      Your goal is to provide ONLY Grade A evidence responses. Grade A evidence means the findings are based on consistent, high-quality, patient-oriented evidence, such as systematic reviews or meta-analyses of randomized controlled trials (RCTs).
      
      Structure your response in JSON with these fields:
      - summary: A crisp, clear, authoritative summary of the Grade A evidence.
      - insight: Additional context, nuances, or secondary evidence that explains WHY this is the current gold standard.
      - evidenceGrade: Must be 'A'.
      - sources: A list of the types of high-level sources (e.g., Cochrane Reviews, Lancet Meta-analyses) supporting this answer.
      
      Always speak in a professional yet accessible tone. Use bolding for key medical terms in the summary text.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "The main clinical answer based on Grade A evidence." },
          insight: { type: Type.STRING, description: "Additional context or 'why' behind the evidence." },
          evidenceGrade: { type: Type.STRING, enum: ['A'], description: "The grade of evidence." },
          sources: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of authoritative sources or study types."
          }
        },
        required: ["summary", "insight", "evidenceGrade", "sources"]
      }
    }
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      summary: "I apologize, but I'm having trouble processing the evidence correctly. Please try again.",
      insight: "Error parsing the response from the medical engine.",
      evidenceGrade: 'A',
      sources: []
    };
  }
}
