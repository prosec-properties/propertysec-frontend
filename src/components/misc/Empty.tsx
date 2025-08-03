import React from "react";
import { FolderOpen } from "lucide-react";

interface Props {
  title?: string;
  message?: string;
  className?: string;
  actionButton?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({
  title = "No data available",
  message = "There is nothing to display at the moment.",
  className = "",
  actionButton,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg text-center ${className}`}
    >
      <FolderOpen className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionButton && actionButton}
    </div>
  );
};

export default EmptyState;
