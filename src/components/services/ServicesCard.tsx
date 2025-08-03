import React from "react";
import CustomButton from "../buttons/CustomButton";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  linkText: string;
  link: string;
  className?: string;
}
const ServicesCard = (props: Props) => {
  return (
    <article
      className={cn(
        "rounded-[0.625rem] border-[0.6px] border-solid border-grey2 p-6 grid grid-rows-5 gap-y-4",
        props.className
      )}
    >
      <h2 className="font-medium text-grey10 md:text-xl">{props.title}</h2>
      <p className="text-base font-base text-greyBody row-span-3">
        {props.description}
      </p>
      <CustomButton
        href={props.link}
        as="link"
        className="w-full row-span-2"
      >
        {props.linkText}
      </CustomButton>
    </article>
  );
};

export default ServicesCard;
