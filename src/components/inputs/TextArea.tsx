import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
  hideLabel?: boolean;
  label: string;
  wrapperClassName?: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      id,
      wrapperClassName,
      hideLabel,
      errorMessage,
      ...props
    },
    ref
  ) => {
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
        <textarea
          className={cn(
            "flex min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:border-greyBody focus:border-grey10 active:border-grey10 focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed  disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && (
          <span className="mt-3 text-red-700">{errorMessage}</span>
        )}
      </article>
    );
  }
);
TextArea.displayName = "Textarea";

export default TextArea;
