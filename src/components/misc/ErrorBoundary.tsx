"use client";

import React, { useState } from "react";
import ErrorDisplay from "./ErrorDisplay";

const MyComponent: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  const simulateError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    // Add your retry logic here (e.g., refetch data, reset state, etc.)
    console.log("Retrying...");
  };

  if (hasError) {
    return (
      <ErrorDisplay
        title="Oops! Something went wrong"
        message="We couldn't load the data. Please try again."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div>
      <h1>My Component</h1>
      <button
        onClick={simulateError}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Simulate Error
      </button>
    </div>
  );
};

export default MyComponent;
