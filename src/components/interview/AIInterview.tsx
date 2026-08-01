import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { InterviewAnswers } from "../../types/Interview";
import QuestionCard from "./QuestionCard";
import { interviewQuestions } from "../../data/InterviewQuestions";
import QuestionInput from "./QuestionInput";
import ProgressBar from "./ProgressBar";
import { analyzeSymptoms } from "../../services/geminiService";
import { useNavigate } from "react-router-dom";

function AIInterview() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const currentQuestion = interviewQuestions[currentStep];
  const [answers, setAnswers] = useState<InterviewAnswers>({
    symptoms: "",
    age: "",
    gender: "",
    duration: "",
    painSeverity: 0,
    medicalConditions: "",
  });

  const currentValue = answers[currentQuestion.id];

  const validateCurrentQuestion = (): boolean => {
    setValidationError("");
    const isEmpty =
      typeof currentValue === "string"
        ? currentValue.trim() === ""
        : currentValue === 0;

    if (currentQuestion.id !== "medicalConditions" && isEmpty) {
      setValidationError("Please answer this question to continue.");
      return false;
    }

    if (currentQuestion.id === "age") {
      const ageValue = Number(currentValue);
      if (!Number.isInteger(ageValue) || ageValue <= 0 || ageValue > 120) {
        setValidationError("Please enter a valid age between 1 and 120.");
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentQuestion()) {
      return;
    }

    if (currentStep < interviewQuestions.length - 1) {
      setCurrentStep((previous) => previous + 1);
    } else {
      // Submit form
      if (isSubmitting) return; // Prevent double-submit
      setIsSubmitting(true);

      navigate("/loading");

      try {
        const result = await analyzeSymptoms(answers);
        localStorage.setItem("aiResult", JSON.stringify(result));
        navigate("/results");
      } catch (err) {
        console.error("analyzeSymptoms failed:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong while analyzing your symptoms. Please try again.";
        setValidationError(errorMessage);
        setIsSubmitting(false);
        navigate("/symptoms");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
      setValidationError("");
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-cyan-600">🤖 FindTheDoctor AI</h1>

      <p className="mt-3 text-gray-600">
        This is AI guidance only and not a medical diagnosis.
      </p>

      <p className="mt-8 text-sm text-gray-500">
        Question {currentStep + 1} of {interviewQuestions.length}
      </p>

      <QuestionCard
        title={currentQuestion.title}
        description={currentQuestion.description}
      >
        <QuestionInput
          question={currentQuestion}
          answers={answers}
          setAnswers={setAnswers}
        />

        {/* Inline Validation Error */}
        {validationError && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-red-700 font-medium">{validationError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-3 text-gray-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition"
          >
            {currentStep === interviewQuestions.length - 1
              ? isSubmitting
                ? "Analyzing..."
                : "Submit"
              : "Continue"}
            {!isSubmitting && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </QuestionCard>

      <ProgressBar current={currentStep} total={interviewQuestions.length} />
    </div>
  );
}

export default AIInterview;