import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type IButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "primary"
  | "tertiary"
  | "icon";

type AsButton = {
  as?: "button";
};

type AsLink = {
  as?: "link";
  href: string;
  linkClassName?: string;
};

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  variant?: IButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  (AsButton | AsLink);

const CustomButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(
  (
    { as = "button", loading, disabled, loadingText, children, ...props },
    ref
  ) => {
    if (as === "link") {
      const { href, linkClassName, ...restProps } = props as AsLink &
        React.ButtonHTMLAttributes<HTMLButtonElement>;

      return (
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: props.variant || "primary" }),
            "w-full",
            linkClassName
          )}
          prefetch
        >
          {children}
        </Link>
      );
    }

    return (
      <Button
        disabled={loading || disabled}
        variant={props.variant || "primary"}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? loadingText || "Please wait..." : children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
