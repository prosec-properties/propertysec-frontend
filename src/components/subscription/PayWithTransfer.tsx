import React, { SetStateAction } from "react";
import { PaymentCredentials } from "@/interface/payment";
import { XIcon } from "lucide-react";
import Hr from "../misc/Hr";
import { CopyButton } from "../buttons/CopyButton";
import CustomButton from "../buttons/CustomButton";
import { downloadPdf, generateInvoicePdfName } from "@/lib/files";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/payment";

interface Props {
  paymentResponse: Partial<PaymentCredentials> | undefined;
  setTransfer: React.Dispatch<SetStateAction<boolean>>;
}

export default function PayWithTransfer(props: Props) {
  const textClass =
  "text-grey10 font-semibold text-[0.9375rem] xs:text-[1.05rem] sm:text-[1.25rem]";

const handleDownload = () => {
  if (!props.paymentResponse?.pdfUrl) {
    console.error("No PDF URL available");
    return;
  }

  try {
    const fileName = generateInvoicePdfName({
      planName: props.paymentResponse?.planName,
      planDuration: props.paymentResponse?.planDuration,
      reference: props.paymentResponse?.reference,
    });

    if (props.paymentResponse.pdfUrl.startsWith('data:application/pdf;base64,')) {
      const base64Data = props.paymentResponse.pdfUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Handle regular URL case
      downloadPdf({
        fileName,
        url: props.paymentResponse.pdfUrl,
      });
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
    // Show error to user if needed
  }
};

  return (
    <div
      className={cn(
        "grid gap-y-4 xs:gap-y-5 sm:gap-y-6 w-[220px] xms:w-[270px] xs:max-w-full xs:w-[400px] sm:w-[472px]",
      )}
    >
      <div className={"flex justify-between items-center"}>
        <h2 className={cn(textClass)}>Pay via bank transfer</h2>
        <XIcon
          className={"w-[20px] xs:w-[24px] sm:w-[28px] cursor-pointer"}
          onClick={() => {
            props.setTransfer(false);
          }}
        />
      </div>

      <Hr className={"border-grey2"} />

      <p className={cn(textClass, "text-[15px] font-medium")}>
        Bank Name: {props.paymentResponse?.bankName}
      </p>
      <p className={cn(textClass, "font-medium")}>
        Account Name: {props.paymentResponse?.acctName}
      </p>

      <div className={cn(`flex justify-between items-center gap-x-2`)}>
        <p className={cn(textClass, "text-[15px] font-medium")}>
          Account No: {props.paymentResponse?.acctNumber}
        </p>
        <CopyButton value={props.paymentResponse?.acctNumber || ""} />
      </div>

      <div className={cn(`flex justify-between items-center gap-x-2`)}>
        <p className={cn(textClass, "font-medium")}>
          Payment ID: {props.paymentResponse?.reference}
        </p>
        <CopyButton value={props.paymentResponse?.reference || ""} />
      </div>

      <p className={cn(textClass, "font-medium")}>
        Amount: {formatPrice(props.paymentResponse?.amountToPay || 0)}
      </p>

      <CustomButton
        variant={"primary"}
        className={cn(`w-full`)}
        onClick={handleDownload}
      >
        Download Invoice
      </CustomButton>

      <Hr className={"border-grey2"} />

      <h3
        className={cn(
          textClass,
          "text-[0.9375rem] xs:text-[1.25rem] sm:text-[1.5rem] text-grey11 font-medium",
        )}
      >
        *Instruction
      </h3>

      <p className={cn(textClass, "font-medium")}>
        <span className={"font-semibold"}>For mobile transfer</span> use your
        payment ID as the narration
      </p>

      <p className={cn(textClass, "font-medium")}>
        <span className={"font-semibold"}>For bank deposit</span> use your
        payment ID as the depositor&apos;s name
      </p>
    </div>
  );
}