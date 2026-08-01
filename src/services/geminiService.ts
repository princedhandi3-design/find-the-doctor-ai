import { GoogleGenAI } from "@google/genai";
import type { InterviewAnswers } from "../types/Interview";
import type { AIResult } from "../types/AIResult";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeSymptoms(
  answers: InterviewAnswers
): Promise<AIResult> {
  const prompt = `
You are a medical triage assistant.

Return ONLY valid JSON.

User Information:

Symptoms: ${answers.symptoms}

Age: ${answers.age}

Gender: ${answers.gender}

Duration: ${answers.duration}

Pain Severity: ${answers.painSeverity}

Medical Conditions:
${answers.medicalConditions}

Return exactly:

{
"specialty":"",
"confidence":0,
"urgency":"",
"reasoning":""
}

Do not include markdown.
Do not include explanation.
Only JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  let text = response.text ?? "";

  // Gemini sometimes wraps JSON in ```json ... ``` even when told not to.
  text = text.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  }

  try {
    return JSON.parse(text) as AIResult;
  } catch (err) {
    console.error("Gemini returned non-JSON response:", text);
    throw new Error("The AI response could not be understood. Please try again.");
  }
}