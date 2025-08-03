"use client";

import React, { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface Props {
  maxLength?: number;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
}

const OTPInput = (props: Props) => {
  return (
    <InputOTP
      maxLength={props.maxLength || 6}
      value={props.otp}
      onChange={(value) => {
        props.setOtp(value);
      }}
    >
      <InputOTPGroup className="flex items-center gap-3">
        {Array.from({ length: props.maxLength || 6 }).map((_, index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OTPInput;
