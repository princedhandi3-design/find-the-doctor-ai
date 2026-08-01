import type { ReactNode } from "react";

interface QuestionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

function QuestionCard({
  title,
  description,
  children,
}: QuestionCardProps) {
  return (
    <div className="mt-8 rounded-2xl bg-white shadow-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-gray-600">
          {description}
        </p>
      )}

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}

export default QuestionCard;