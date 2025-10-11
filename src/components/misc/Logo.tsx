import React from "react";
import Link from "next/link";
import LogoIcon from "../icons/Logo";
import { HOME_ROUTE } from "@/constants/routes";
import Image from "next/image";
import ImageLogo from "@public/proseclogo.jpg";
import { cn } from "@/lib/utils";

interface Props{
  className?: string;
}
const Logo = (props: Props) => {
  return (
    <Link className={cn("block", props.className)} href={HOME_ROUTE} prefetch>
      <span className="sr-only">Home</span>
      <LogoIcon className="w-[6rem] h-[2rem] hidden md:block" />
      <Image
        src={ImageLogo}
        alt="logo"
        width={40}
        height={32}
        className="md:hidden min-w-[2.5rem] min-h-[2rem]"
      />
    </Link>
  );
};

export default Logo;
