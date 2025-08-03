import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  status: "active" | "inactive" | "pending";
  text?: string;
}
const Status = ({ status, text }: Props) => {
  return (
    <p
      className={cn("capitalize w-fit px-3 py-2 rounded-[3px]", {
        ["bg-successLight text-success"]: status === "active",
        ["bg-grey100 text-grey8"]: status === "inactive",
        ["bg-pendingLight text-pending"]: status === "pending",
      })}
    >
      {text || status}
    </p>
  );
};

export default Status;
