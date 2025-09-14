import { convertBytesToMB } from "@/lib/files";
import { cn } from "@/lib/utils";
import { File as FileIcon, Trash2 } from "lucide-react";
import React from "react";

interface Props {
  deleteFile?: (filename: string) => void;
  deleteUploadedFile?: () => void;
  fileSize: number;
  fileName: string;
  hideDelete?: boolean;
  wrapperClass?: string;
  viewFile?: () => void;
}

const UploadedDoc = (props: Props) => {
  const handleFileName = () => {
    if (props.fileName.length > 25) {
      return props.fileName.slice(0, 25) + "...";
    }
    return props.fileName;
  };

  return (
    <div
      className={cn(
        "flex justify-between gap-2 rounded-[0.3125rem] overflow-hidden border border-grey1 group",
        props.wrapperClass
      )}
    >
      <div className="flex items-center flex-1 p-2">
        <div className="bg-black rounded-[50%] aspect-square flex items-center justify-center">
          <FileIcon size={40} className="size-[50%] text-white " />{" "}
        </div>

        <div className="w-full ml-2 space-y-1">
          <div className="text-sm">
            <p 
              className="text-muted-foreground mb-2 cursor-pointer hover:text-blue-600 hover:underline"
              onClick={props.viewFile}
            >
              {handleFileName()}
            </p>
            <p className="text-muted-foreground text-xs">
              {convertBytesToMB(props.fileSize)}
            </p>
          </div>
        </div>
      </div>
      {props.hideDelete ? null : (
        <button
          onClick={() => {
            props.deleteUploadedFile?.();
            props.deleteFile?.(props.fileName);
          }}
          type="button"
          className="hover:bg-red-500 bg-grey10 text-white transition-all items-center justify-center cursor-pointer px-2 group-hover:flex"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
};

export default UploadedDoc;
