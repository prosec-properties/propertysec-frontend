import { cn } from "@/lib/utils";
import React from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "../ui/dialog";
import { X } from "lucide-react";

interface Props {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
  contentClass?: string;
  children: React.ReactNode;
  title: string;
  hideTitle?: boolean;
}

const CustomModal = (props: Props) => {
  const handleEscapeClick = () => {
    props.setIsShown(false);
  };

  const handleClickOutside = () => {
    props.setIsShown(false);
  };

  return (
    <Dialog open={props.isShown} onOpenChange={props.setIsShown} modal>
      <DialogContent
        onPointerDownOutside={handleClickOutside}
        onEscapeKeyDown={handleEscapeClick}
        className={cn(
          "max-h-[calc(100vh-100px)] overflow-y-auto px-2 outline-none xls:px-4 xs:px-6",
          props.contentClass
        )}
      >
        <DialogTitle
          className={props.hideTitle ? "sr-only" : "text-xl font-semibold mb-4"}
        >
          {props.title}
        </DialogTitle>
        <DialogClose
          onClick={() => {
            handleClickOutside;
            console.log("close");
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
