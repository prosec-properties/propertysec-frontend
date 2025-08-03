import React from "react";

const Spinner = () => {
  return (
    <div className="min-h-screen">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default Spinner;
