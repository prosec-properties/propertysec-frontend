
"use client";

import { useMutation } from "@tanstack/react-query";
import { showToaster } from "@/lib/general";
import { resendOtpApi } from "@/services/auth.service";
import React, { useEffect, useState } from "react";

interface Props {
  email: string;
  otp?: string;
  setOtp?: React.Dispatch<React.SetStateAction<string>>;
}

const COUNTDOWN_SECONDS = 15;

const ResendOtp = ({ email, otp, setOtp }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [count, setCount] = useState(0);

  const { mutate: resendOtp, isPending } = useMutation({
    mutationFn: () => resendOtpApi({ email }),
    onSuccess: (res) => {
      if (otp && setOtp) {
        setOtp("");
      }

      showToaster("New verification code sent successfully", "success");
      setIsDisabled(true);
      setCount(COUNTDOWN_SECONDS);
    },
    onError: (error) => {
      showToaster("Failed to resend verification code", "destructive");
      console.error("Resend OTP error:", error);
    },
  });

  useEffect(() => {
    if (count <= 0) {
      setIsDisabled(false);
      return;
    }

    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="text-center">
      {isDisabled ? (
        <p className="text-sm text-gray-600">
          A new code has been sent. You can request another in {count} seconds.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => resendOtp()}
          disabled={isPending || isDisabled}
          className={`text-primary font-medium text-sm underline ${
            isPending || isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-primary-dark"
          }`}
          aria-label="Resend verification code"
        >
          {isPending ? "Sending..." : "Didn't receive a code? Resend"}
        </button>
      )}
    </div>
  );
};

export default ResendOtp;
