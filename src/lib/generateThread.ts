import { geminiModel } from "./gemini";

// Function to generate a thread using the Gemini model
export async function generateThread(topic: string, tone: string) {
  const prompt = `
You are an expert social media content creator. Write a 5-tweet thread on the topic "${topic}" in a ${tone} tone. 
Each tweet should be engaging and concise. Add line breaks between tweets.
`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating thread:", error);
    throw new Error("Failed to generate thread. Please try again later.");
  }
}
