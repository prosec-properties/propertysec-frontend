import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<Props> = ({
  title = "Something went wrong",
  message = "Please try again later.",
  className = "",
  onRetry,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg text-center ${className}`}
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-red-600 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
