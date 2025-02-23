import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);

/**
 * A function to interact with Google Generative AI model and fetch the result.
 * 
 * @param schema The schema for the response.
 * @param prompt The query to send to the model.
 * @returns The response from the model.
 */

export const fetchFromGenAI = async (schema: any, prompt: string) => {
  try {
    // Set up the model with schema
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Fetch the response from the model
    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response?.text() || "{}");

    return response;
  } catch (error) {
    console.error("Error fetching data from Google Generative AI:", error);
    throw error;
  }
};
