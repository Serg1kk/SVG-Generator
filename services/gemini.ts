import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an SVG string based on a user prompt using Gemini 3 Pro.
 */
export const generateSvgFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert SVG artist and frontend engineer. 
        Your task is to generate valid, scalable, and aesthetically pleasing SVG code based on the user's prompt.
        
        Rules:
        1. Return ONLY the raw SVG code. 
        2. Do NOT wrap the code in markdown blocks (e.g., \`\`\`xml). 
        3. Do NOT include any text before or after the SVG tag.
        4. Ensure the SVG has a valid 'viewBox' and 'xmlns' attribute.
        5. Use vibrant colors and clean paths unless specified otherwise.
        6. Optimize the SVG for web usage (keep code relatively concise).
        7. If the user asks for a specific scene (e.g., Pelican on a bike), focus on capturing the essence with good composition.`,
        temperature: 0.4, // Lower temperature for more deterministic code generation
      },
    });

    let text = response.text || '';

    // Cleanup: Remove markdown code blocks if the model ignores the system instruction
    text = text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();

    // specific check to ensure it starts with <svg
    const svgStartIndex = text.indexOf('<svg');
    const svgEndIndex = text.lastIndexOf('</svg>');

    if (svgStartIndex !== -1 && svgEndIndex !== -1) {
      return text.substring(svgStartIndex, svgEndIndex + 6);
    } else {
      // Fallback if no valid SVG found, though unlikely with system prompt
      throw new Error("The model did not return a valid SVG tag.");
    }

  } catch (error) {
    console.error("Error generating SVG:", error);
    throw error;
  }
};