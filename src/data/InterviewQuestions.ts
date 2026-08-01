import type { InterviewQuestion } from "../types/InterviewQuestion";

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: "symptoms",
    title: "What symptoms are you experiencing?",
    description:
      "Describe all symptoms you're currently experiencing.",
    type: "textarea",
  },

  {
    id: "age",
    title: "How old are you?",
    description: "Enter your age.",
    type: "number",
  },

  {
    id: "gender",
    title: "What is your gender?",
    description: "Select the option that best describes you.",
    type: "select",
  },

  {
    id: "duration",
    title: "How long have you had these symptoms?",
    description: "For example: 2 days, 1 week, 3 months.",
    type: "text",
  },

  {
    id: "painSeverity",
    title: "How severe is the pain?",
    description: "Rate your pain from 0 to 10.",
    type: "slider",
  },

  {
    id: "medicalConditions",
    title: "Do you have any existing medical conditions?",
    description: "This question is optional.",
    type: "textarea",
  },
];