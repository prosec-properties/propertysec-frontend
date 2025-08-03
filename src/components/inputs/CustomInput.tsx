import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import ErrorMessage from "../misc/ErrorMessage";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  wrapperClassName?: string;
  hideLabel?: boolean;
  errorMessage?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, Props>(
  ({ wrapperClassName, hideLabel, errorMessage, label, id, ...props }, ref) => {
    return (
      <article className={cn("text-grey8", wrapperClassName)}>
        <Label
          htmlFor={id}
          className={cn("mb-3 block font-medium text-xs md:text-sm", {
            hidden: hideLabel,
          })}
        >
          {label}
        </Label>
        <Input id={id} ref={ref} {...props} />

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}


        {/* Hide arrows for input type = number */}
        <style>
          {`
           input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0`}
        </style>
      </article>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
