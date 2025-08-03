import { cn } from "@/lib/utils";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}
export default function Small(props: Props) {
  return (
    <small {...props} className={cn(`empty:hidden`, props.className)}>
      {props.children}
    </small>
  );
}
