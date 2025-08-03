import React from "react";
import { SimleyXEyesIcon } from "../icons/SmileXEyes";

interface Props {
  title?: string;
  description?: string;
}
const EmptyTable = (props: Props) => {
  return (
    <div className="mx-auto max-w-[447px] rounded-lg border border-offwhite px-14 py-6">
      <div className="flex justify-center">
        <SimleyXEyesIcon />
      </div>
      <h1 className="mb-3.5 text-center text-sm font-normal text-grey8">
        {props.title || "Table is empty."}
      </h1>
      <p className="mb-3.5 text-center text-sm font-normal text-grey8">
        {props.description || "All table data will appear here"}
      </p>
    </div>
  );
};

export default EmptyTable;
