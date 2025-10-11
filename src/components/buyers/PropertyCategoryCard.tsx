import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imageSrc: string;
  title: string;
  height?: number;
  width?: number;
  className?: string;
  href: string;
}

const PropertyCategoryCard = (props: Props) => {
  return (
    <Link
      href={props.href}
      className={cn(
        props.className,
        "rounded-[0.625rem] border-[0.6px] border-grey100 bg-white p-3"
      )}
      prefetch
    >
      <div className="mb-10">
        <Image
          src={props.imageSrc}
          height={props.height || 300}
          width={props.width || 300}
          alt={`${props.title} Category`}
          className="rounded-[0.625rem] h-[12.5rem] w-[20.3125rem] object-cover"
        />
      </div>
      <h2 className="text-grey9 text-xl font-medium capitalize">
        {props.title}
      </h2>
    </Link>
  );
};

export default PropertyCategoryCard;
