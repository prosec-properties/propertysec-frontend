"use client";

import React, { useEffect } from "react";
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
  const { token } = useUser();

  const verifyMutation = useMutation({
    mutationFn: verifyTransactionApi,
    onSuccess: (response) => {
      console.log("Verification response:", response);
      toast({
        title: "Success",
        description: "Transaction verified successfully!",
      });
      // router.push("/loans");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Error verifying transaction",
        variant: "destructive",
      });
      // router.push("/loans");
    },
  });

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    if (!reference || !trxref || !token) {
      toast({
        title: "Error",
        description: "Invalid transaction parameters",
        variant: "destructive",
      });
      // router.push("/loans");
      console.log("Invalid transaction parameters");
      return;
    }

    const transactionId = searchParams.get("reference");

    if (!transactionId) {
      toast({
        title: "Error",
        description: "Transaction ID not found",
        variant: "destructive",
      });
      // router.push("/loans");
      console.log("Transaction ID not found");
      return;
    }

    verifyMutation.mutate({
      token,
      transactionId,
      paymentReference: reference,
    });
  }, [searchParams, router]);

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
