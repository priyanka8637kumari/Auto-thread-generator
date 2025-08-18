import { GoogleGenerativeAI } from "@google/generative-ai";

//Load the environment variables from .env file
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

// Initialize the Gemini client with the API key

const genAI = new GoogleGenerativeAI(API_KEY);

// Export model
export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})
