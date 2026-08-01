import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">

        <LoaderCircle
          className="mx-auto h-16 w-16 animate-spin text-cyan-500"
        />

        <h1 className="mt-6 text-3xl font-bold">
          Analyzing Symptoms
        </h1>

        <p className="mt-3 text-gray-600">
          Our AI is reviewing your symptoms...
        </p>

      </div>
    </div>
  );
}

export default Loading;