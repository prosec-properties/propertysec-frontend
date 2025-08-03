import React from "react";
import HouseIcon from "../icons/House";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  className?: string;
  isIconCentered?: boolean;
  icon: React.ReactElement<SVGElement>;
}

const AboutService = (props: Props) => {
  return (
    <article
      className={cn(
        "border-[0.66px] border-grey100 rounded-[0.3125rem] border-solid p-6 bg-white",
        { "text-center": props.isIconCentered },
        props.className
      )}
    >
      <div
        className={`${props.isIconCentered ? "flex justify-center" : ""} mb-4`}
      >
        {props.icon}
      </div>
      <h2 className="font-medium text-grey10 md:text-xl mb-[2.88rem]">
        {props.title}
      </h2>
      <p className="text-base font-base text-greyBody row-span-3">
        {props.description}
      </p>
    </article>
  );
};

export default AboutService;
