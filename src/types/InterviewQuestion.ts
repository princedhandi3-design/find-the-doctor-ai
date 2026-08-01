import type { InterviewAnswers } from "./Interview";

export interface InterviewQuestion {
  id: keyof InterviewAnswers;
  title: string;
  description?: string;
  type: "textarea" | "text" | "number" | "select" | "slider";
}