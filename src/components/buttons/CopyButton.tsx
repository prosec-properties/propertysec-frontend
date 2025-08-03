import { useCopyToClipboard } from "usehooks-ts";
import { useToast } from "../ui/use-toast";
import CustomButton from "./CustomButton";
import { cn } from "@/lib/utils";
import CopyIcon from "../icons/Copy";

interface Props {
  value: string;
  success?: () => void;
  error?: (error: any) => void;
}

export const CopyButton = (props: Props) => {
  const [value, copy] = useCopyToClipboard();
  const { toast } = useToast();
  const onClick = async () => {
    try {
      await copy(props.value);
      toast({
        title: "Success",
        description: "Copied to clipboard",
        variant: "success",
      });
      props.success?.();
    } catch (error) {
      props.error?.(error);
    }
  };

  return (
    <CustomButton
      variant={"tertiary"}
      className={cn(`
      bg-offwhite
      flex
      items-center
      justify-between
      text-black
      gap-x-2`)}
      onClick={onClick}
    >
      <CopyIcon />
      Copy
    </CustomButton>
  );
};
