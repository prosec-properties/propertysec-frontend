import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `h-[2rem]
          sm:h-12 
          px-4
          w-full
          rounded-md
          outline-none
          text-xs
          sm:text-sm
          text-grey9
          placeholder:text-grey5
          border
          border-solid
          border-grey5
          caret-grey10
          disabled:bg-grey1
          disabled:cursor-not-allowed
        hover:border-greyBody
        focus:border-grey10
        active:border-grey10
          `,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
