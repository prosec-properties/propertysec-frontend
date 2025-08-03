"use client";

import React, { useState } from "react";
import Title from "@/components/misc/Title";
import { formStyle } from "@/lib/authSharedStyles";
import OTPInput from "../inputs/OTPInput";
import { showToaster, extractServerErrorMessage } from "@/lib/general";
import { useRouter } from "next/navigation";
// import ResendOtp from "../misc/ResendOtp";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import CustomButton from "../buttons/CustomButton";
import { useMutation } from "@tanstack/react-query";
import { verifyOtpApi } from "@/services/auth.service";
import ResendOtp from "../auth/ResendOtp";

interface Props {
  email: string;
}

const VerifyEmail = (props: Props) => {
  const [otp, setOtp] = useState("");
  const { push } = useRouter();

  const mutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (res) => {
      showToaster("Your email has been verified successfully!", "success");
      push(SIGN_IN_ROUTE);
    },
    onError: (error) => {
      showToaster(extractServerErrorMessage(error), "destructive");
      console.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    mutation.mutate({ email: props.email, otp });
  };

  return (
    <form onSubmit={onSubmit} className={formStyle}>
      <Title title="Verify email" className="mb-6" />
      <p className="font-semibold mb-6 text-center">{props.email}</p>
      <p className="font-normal text-greyBodyText mb-8 text-center">
        Please enter the 6-digit verification code we sent to the above email.
        This code expires within 20 minutes.
      </p>

      <div className="mb-8 flex justify-center">
        <OTPInput otp={otp} setOtp={setOtp} />
      </div>

      <CustomButton
        className="w-full mb-6"
        disabled={!otp || otp.length < 6}
        loading={mutation.isPending}
      >
        Verify
      </CustomButton>

      <ResendOtp email={props.email} />
    </form>
  );
};

export default VerifyEmail;
