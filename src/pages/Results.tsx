import type { AIResult } from "../types/AIResult";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();
  const storedResult = localStorage.getItem("aiResult");

  if (!storedResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">No AI result found.</h1>
      </div>
    );
  }

  let result: AIResult;
  try {
    result = JSON.parse(storedResult);
    // Validate that the result has the expected shape
    if (!result.specialty || !result.urgency || result.confidence === undefined) {
      throw new Error("Invalid result structure");
    }
  } catch (error) {
    console.error("Failed to parse stored result:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Session Error</h1>
          <p className="mt-4 text-gray-700">
            Your previous results couldn't be loaded. Please start a new assessment.
          </p>
          <button
            onClick={() => navigate("/symptoms")}
            className="mt-6 w-full rounded-lg bg-cyan-500 py-3 text-white font-semibold hover:bg-cyan-600 transition"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  // Determine urgency styling and messaging
  const urgencyConfig = {
    emergency: {
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-900",
      banner: true,
      message:
        "🚨 SEEK IMMEDIATE CARE - This may require emergency medical attention. Call emergency services or go to the nearest emergency room immediately.",
    },
    high: {
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-900",
      banner: true,
      message:
        "⚠️ URGENT - Schedule an appointment with a doctor as soon as possible (today or tomorrow if available).",
    },
    soon: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-900",
      banner: false,
      message:
        "Schedule an appointment within the next few days.",
    },
    routine: {
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-900",
      banner: false,
      message:
        "This can be addressed at your next routine appointment.",
    },
  };

  const urgencyKey = (
    result.urgency?.toLowerCase() as keyof typeof urgencyConfig
  ) || "routine";
  const urgency = urgencyConfig[urgencyKey] || urgencyConfig.routine;
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-cyan-600">AI Analysis Results</h1>

        {/* Emergency/Urgent Banner */}
        {urgency.banner && (
          <div
            className={`mt-6 rounded-lg border-l-4 ${urgency.borderColor} ${urgency.bgColor} p-6`}
          >
            <p className={`text-lg font-bold ${urgency.textColor}`}>
              {urgency.message}
            </p>
          </div>
        )}

        {/* Recommended Specialty */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Recommended Specialty</h2>
          <p className="mt-2 text-2xl text-cyan-600 font-semibold">
            {result.specialty || "Unknown"}
          </p>
        </div>

        {/* Confidence */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="font-bold">Confidence</h2>
          <p className="mt-2 text-lg">
            {result.confidence !== undefined ? `${result.confidence}%` : "N/A"}
          </p>
        </div>

        {/* Urgency */}
        <div
          className={`mt-6 rounded-xl border-l-4 ${urgency.borderColor} ${urgency.bgColor} p-6`}
        >
          <h2 className={`font-bold ${urgency.textColor}`}>Urgency Level</h2>
          <p className={`mt-2 font-semibold ${urgency.textColor}`}>
            {result.urgency || "Unknown"}
          </p>
          {!urgency.banner && (
            <p className={`mt-2 text-sm ${urgency.textColor}`}>
              {urgency.message}
            </p>
          )}
        </div>

        {/* Reasoning */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="font-bold">Medical Reasoning</h2>
          <p className="mt-2 text-gray-700">{result.reasoning || "N/A"}</p>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 rounded-xl border-l-4 border-orange-500 bg-orange-50 p-6">
          <strong className="text-orange-900">⚠️ Medical Disclaimer</strong>
          <p className="mt-3 text-orange-900">
            This is AI guidance only and <strong>NOT a medical diagnosis</strong>.
            Always consult with licensed healthcare professionals for medical
            decisions. In case of emergency, call emergency services immediately.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/doctors")}
            className="flex-1 rounded-xl bg-cyan-500 py-4 text-white font-bold hover:bg-cyan-600 transition"
          >
            Find Nearby Doctors
          </button>
          <button
            onClick={() => navigate("/symptoms")}
            className="flex-1 rounded-xl bg-gray-300 py-4 text-gray-800 font-bold hover:bg-gray-400 transition"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;