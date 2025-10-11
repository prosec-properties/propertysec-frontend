import React from "react";

interface SpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  message?: string;
}

const Spinner = ({ fullScreen = true, size = "lg", message }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClass = fullScreen
    ? "fixed inset-0 flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm z-50"
    : "flex flex-col justify-center items-center";

  return (
    <div className={containerClass}>
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
      ></div>
      {message && (
        <p className="mt-4 text-gray-600 text-sm font-medium">{message}</p>
      )}
    </div>
  );
};

export default Spinner;
