import React from "react";

interface Props {
  text?: string;
}
const Divider = (props: Props) => {
  return (
    <span className="flex items-center">
      <span className="h-px flex-1 bg-grey5"></span>
      <span className="shrink-0 px-6 text-grey11">{props.text || "Or"}</span>
      <span className="h-px flex-1 bg-grey5"></span>
    </span>
  );
};

export default Divider;
