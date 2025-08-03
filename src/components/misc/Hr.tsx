import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}
export default function Hr(props: Props) {
  return <hr className={cn("w-full border-grey4", props.className)} />;
}
