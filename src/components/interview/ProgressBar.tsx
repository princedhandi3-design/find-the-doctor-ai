interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mt-6">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-cyan-500 transition-all"
          style={{
            width: `${((current + 1) / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;