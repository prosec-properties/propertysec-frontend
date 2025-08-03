import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  title: string;
  className?: string;
}
const TitleWithHR = (props: Props) => {
  return (
    <React.Fragment>
      <h2 className={cn("text-xl font-medium text-left", props.className)}>
        {props.title}
      </h2>
      <hr className="my-4" />
    </React.Fragment>
  );
};

export default TitleWithHR;
