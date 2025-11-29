import { GoogleGenAI } from "@google/genai";
import { Scenario, AnalysisResult } from '../types';

export const analyzeEconomics = async (
  scenario: Scenario,
  analysis: AnalysisResult
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a senior product manager and financial analyst for a SaaS startup.
      
      We are analyzing a scenario named: "${scenario.name}"
      Description: "${scenario.description}"
      
      Here is the cost breakdown (Components):
      ${scenario.components.map(c => `- ${c.name}: ${c.quantity} units @ $${c.pricePerUnit}/${c.costType === 'Unit Based Cost' ? 'unit' : 'item'} (${c.costType}). Total: $${(c.quantity * c.pricePerUnit).toFixed(4)}`).join('\n')}
      
      Total Cost for this scenario: $${analysis.totalCost.toFixed(4)}
      
      Please provide a concise analysis (max 3 paragraphs) covering:
      1. Viability assessment.
      2. Identification of the primary cost driver.
      3. Specific optimization advice based on the component types (Fixed vs Unit vs One-Time).
      
      Keep the tone professional, objective, and concise.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis could not be generated.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Unable to generate AI analysis at this time. Please check your API key.";
  }
};