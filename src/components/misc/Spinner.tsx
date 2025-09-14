import React from "react";

interface SpinnerProps {
  fullScreen?: boolean;
}

const Spinner = ({ fullScreen = true }: SpinnerProps) => {
  const containerClass = fullScreen
    ? "fixed inset-0 flex justify-center items-center bg-white z-50"
    : "flex justify-center items-center";

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Spinner;
