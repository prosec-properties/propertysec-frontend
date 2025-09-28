"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { verifyTransactionApi } from "@/services/payment.service";
import {
  DASHBOARD_LOAN_ROUTE,
  DASHBOARD_ROUTE,
  MY_INSPECTIONS_ROUTE,
  MY_PURCHASES_ROUTE,
  SUBSCRIPTION_ROUTE,
} from "@/constants/routes";

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

      const transactionType =
        response?.data?.metadata?.type || searchParams.get("type");

      toast({
        title: "Success",
        description: "Transaction verified successfully!",
      });

      switch (transactionType) {
        case "subscription":
          router.push(SUBSCRIPTION_ROUTE);
          break;
        case "inspection":
          router.push(MY_INSPECTIONS_ROUTE);
        case "property_purchase":
          router.push(MY_PURCHASES_ROUTE);
          break;
        case "loan_repayment":
          router.push(DASHBOARD_LOAN_ROUTE);
          break;
        default:
          router.push(DASHBOARD_ROUTE);
      }
    },
    onError: (error) => {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: "Failed to verify transaction. Please contact support.",
        variant: "destructive",
      });
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
      router.push("/dashboard");
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
