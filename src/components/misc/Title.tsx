import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  title: string;
  className?: string;
}
const Title = (props: Props) => {
  return (
    <h2 className={cn("text-xl font-medium text-center", props.className)}>
      {props.title}
    </h2>
  );
};

export default Title;
