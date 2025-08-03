import React from "react";
import Small from "./Small";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  errorMessage: string;
}
const ErrorMessage = (props: Props) => {
  return (
    <Small
      className={cn(
        `text-red-700 text-[11px] sm:text-xs mt-3`,
        props.className
      )}
    >
      {props.errorMessage}
    </Small>
  );
};

export default ErrorMessage;
