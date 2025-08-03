import { cn } from "@/lib/utils";
import React from "react";

export const Stat = (props: {
  title: string;
  value: string;
  className?: string;
}) => {
  return (
    <article
      className={cn(
        "border-[0.6px] rounded-[0.1875rem] mb-6 p-4 md:p-0 md:mb-0 border-greyBody md:rounded-none md:border-0",
        props.className
      )}
    >
      <p className="mb-6">{props.title}</p>
      <h1 className="text-2xl font-medium">{props.value}</h1>
    </article>
  );
};

export const StatsWrapper = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap md:flex-row flex-col justify-between gap-x-6 rounded-[0.3125rem] text-white bg-grey9 py-10 px-6",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
