"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { verifyTransactionApi } from "@/services/payment.service";

export default function VerifyTransactionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { token, status } = useUser();
  const hasAttemptedRef = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: verifyTransactionApi,
    onSuccess: (response) => {
      console.log("Verification response:", response);
      toast({
        title: "Success",
        description: "Transaction verified successfully!",
      });
      router.push("/loans");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Error verifying transaction",
        variant: "destructive",
      });
      router.push("/loans");
    },
  });

  useEffect(() => {
    if (hasAttemptedRef.current || status === "loading") return;

    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (!reference || !trxref || !token) {
      toast({
        title: "Error",
        description: "Invalid transaction parameters",
        variant: "destructive",
      });
      router.push("/loans");
      console.log("Invalid transaction parameters");
      hasAttemptedRef.current = true;
      return;
    }

    hasAttemptedRef.current = true;
    verifyMutation.mutate({
      token,
      transactionId: reference,
      paymentReference: reference,
    });
  }, [searchParams, router, token, verifyMutation, status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verifying Your Transaction
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your payment...
        </p>
      </div>
    </div>
  );
}
