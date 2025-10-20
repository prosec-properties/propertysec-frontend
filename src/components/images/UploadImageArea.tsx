import { cn } from "@/lib/utils";
import { UploadImageFormat } from "../../../interface/image";
import React from "react";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  format: UploadImageFormat;
  name?: string;
  onClick?: () => void;
}
export default function UploadImageArea(props: Props) {
  return (
    <div
      onClick={props.onClick}
      className={cn(
        `
        flex 
        h-[96px] 
        w-[96px] 
        shrink-0 
        cursor-pointer 
        items-center 
        justify-center 
        sm:h-[100px]
        sm:w-[100px]
        bg-offWhite
      `,
        {
          "rounded-full ": props.format === "single",
          "h-[96px] w-[96px] rounded-[7px] sm:h-[120px] sm:w-[130px]":
            props.format === "multiple",
        },
        props.className
      )}
      // htmlFor={props.name || "upload-image"}
    >
      {props.children}
    </div>
  );
}
