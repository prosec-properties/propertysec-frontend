"use client";

import React, { useState } from "react";
import CustomInput from "./CustomInput";
import { EyeIcon, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  hideLabel?: boolean;
  errorMessage?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  (
    { wrapperClassName, errorMessage, hideLabel, label, className, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("relative", wrapperClassName)}>
        <CustomInput
          ref={ref}
          label={label}
          hideLabel={hideLabel}
          className={cn(
            "hide-password-toggle pr-10", // Add right padding for the eye icon
            className
          )}
          errorMessage={errorMessage}
          type={showPassword ? "text" : "password"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        <button
          type="button"
          className={cn(
            "absolute right-3 h-5 w-5",
            hideLabel ? "top-1/2 -translate-y-1/2" : "top-[38px]",
            "text-gray-500 hover:text-gray-700 focus:outline-none",
            "transition-colors duration-200",
            isFocused ? "text-gray-700" : "text-gray-500"
          )}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1} // Prevent button from being tabbed
        >
          {showPassword ? (
            <EyeOff className="h-full w-full" />
          ) : (
            <EyeIcon className="h-full w-full" />
          )}
        </button>

        {/* hides browsers password toggles */}
        <style>
          {`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}
        </style>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
