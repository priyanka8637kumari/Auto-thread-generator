import { geminiModel } from "./gemini";

// Function to generate a thread using the Gemini model
export async function generateThread(topic: string, tone: string) {
  const prompt = `
You are an expert social media content creator. Write a 5-tweet thread on the topic "${topic}" in a ${tone} tone. 

IMPORTANT FORMATTING RULES:
- Each tweet should be engaging and concise (under 280 characters)
- Separate each tweet with a line break
- Do NOT include any numbering like "1/5", "**1/5**", "Tweet 1:", etc.
- Do NOT include thread indicators or counters
- Just write the content of each tweet naturally
- Each tweet should stand alone but flow together as a cohesive thread

Focus on creating valuable, engaging content without any formatting markers or numbering.
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
