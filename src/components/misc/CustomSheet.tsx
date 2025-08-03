"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
}

const CustomSheet = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{props.trigger}</SheetTrigger>
      <SheetContent
        className={cn("w-[250px] sm:w-[400px]", props.className)}
        side={props.side || "left"}
      >
        <VisuallyHidden>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetHeader>
        </VisuallyHidden>

        {props.children}
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
