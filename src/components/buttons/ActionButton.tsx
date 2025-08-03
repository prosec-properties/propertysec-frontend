import React from "react";
import CustomButton from "./CustomButton";

interface ActionButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  variant = "primary", 
  onClick, 
  loading,
  className = "w-full mb-4"
}) => (
  <CustomButton
    loading={loading}
    variant={variant}
    className={className}
    onClick={onClick}
  >
    {text}
  </CustomButton>
);

export default ActionButton;
