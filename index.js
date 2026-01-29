import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

// const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();