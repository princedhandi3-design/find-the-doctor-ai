import type { InterviewQuestion } from "../../types/InterviewQuestion";
import type { InterviewAnswers } from "../../types/Interview";

interface QuestionInputProps {
  question: InterviewQuestion;
  answers: InterviewAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<InterviewAnswers>>;
}

function QuestionInput({
  question,
  answers,
  setAnswers,
}: QuestionInputProps) {
  if (question.type === "textarea") {
    return (
      <textarea
        value={answers[question.id] as string}
        onChange={(e) =>
          setAnswers((previous) => ({
            ...previous,
            [question.id]: e.target.value,
          }))
        }
        rows={6}
        placeholder="Type your answer..."
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          p-4
          focus:border-cyan-500
          focus:ring-2
          focus:ring-cyan-200
          outline-none
          resize-none
        "
      />
    );
  }

  if (question.type === "number") {
    return (
      <input
        type="number"
        min={0}
        max={120}
        step={1}
        inputMode="numeric"
        value={answers[question.id] as string}
        onChange={(e) => {
          // Strip anything that isn't a digit so a "-" or "+" can never be
          // typed/pasted into the age field, then clamp to a sane range.
          const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
          const clamped =
            digitsOnly === ""
              ? ""
              : String(Math.min(120, Number(digitsOnly)));

          setAnswers((previous) => ({
            ...previous,
            [question.id]: clamped,
          }));
        }}
        placeholder="Enter your age"
        className="w-full rounded-xl border border-gray-300 p-4 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
      />
    );
  }
if (question.type === "text") {
  return (
    <input
      type="text"
      value={answers[question.id] as string}
      onChange={(e) =>
        setAnswers((previous) => ({
          ...previous,
          [question.id]: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-gray-300 p-4 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
    />
  );
}
if (question.type === "select") {
  return (
    <select
      value={answers[question.id] as string}
      onChange={(e) =>
        setAnswers((previous) => ({
          ...previous,
          [question.id]: e.target.value,
        }))
      }
      className="w-full rounded-xl border border-gray-300 p-4 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  );
}
if (question.type === "slider") {
  return (
    <>
      <input
        type="range"
        min={0}
        max={10}
        value={answers[question.id] as number}
        onChange={(e) =>
          setAnswers((previous) => ({
            ...previous,
            [question.id]: Number(e.target.value),
          }))
        }
        className="w-full"
      />

      <p className="mt-2 text-center font-semibold">
        Pain Level: {answers[question.id]}
      </p>
    </>
  );
}
  return (
    <p className="text-gray-500">
      This input type is coming next.
    </p>
  );
}

export default QuestionInput;