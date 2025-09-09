"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/payment";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { getLoanById } from "@/services/loan.service";
import { frontendUrl } from "@/constants/env";
import { useRouter } from "next/navigation";
import { initializeTransactionApi } from "@/services/payment.service";
import { $requestWithToken } from "@/api/general";

interface LoanRepaymentData {
  amount: number;
  callbackUrl: string;
  loanId: string;
  repaymentAmount: number;
}

interface LoanRepaymentProps {
  loanId: string;
  loanStatus: string;
}

export default function LoanRepayment({
  loanId,
  loanStatus,
}: LoanRepaymentProps) {
  const { toast } = useToast();
  const { user, token } = useUser();
  const router = useRouter();

  const loan = useQuery({
    queryKey: ["loan-details", loanId, token],
    queryFn: () => getLoanById(loanId, token),
    enabled: !!loanId && !!token,
  });

  console.log("loan", loan?.data?.data);

  const mutation = useMutation({
    mutationFn: async (data: LoanRepaymentData) => {
      return await initializeTransactionApi(token, {
        type: 'loan_repayment',
        amount: data.amount,
        callbackUrl: data.callbackUrl,
        metadata: {
          loanId: data.loanId,
          repaymentAmount: data.repaymentAmount,
          repaymentType: 'FULL'
        },
      });
    },
    onSuccess: (data) => {
      console.log("auth url", data?.data?.data);
      router.replace(data?.data?.data?.authorization_url || "");
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get payment authorization URL",
        variant: "destructive",
      });
    },
  });

  const onRepay = () => {
    if (!loan.data?.data) return;

    const loanAmount = parseInt(loan.data.data.loanAmount) || 0;
    const interestRate = loan.data.data.interestRate || 0;
    const totalAmount = loanAmount + (loanAmount * interestRate) / 100;

    mutation.mutate({
      amount: totalAmount,
      callbackUrl: `${frontendUrl}/verify`,
      loanId,
      repaymentAmount: totalAmount,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Loan Repayment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loan.data?.data && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Loan Amount:</span>
                  <span className="text-lg font-semibold">
                    {formatPrice(parseInt(loan.data.data.loanAmount))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Interest Rate:</span>
                  <span className="text-lg font-semibold">
                    {loan.data.data.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-bold">Total to Pay:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(
                      parseInt(loan.data.data.loanAmount) +
                        (parseInt(loan.data.data.loanAmount) *
                          loan.data.data.interestRate) /
                          100
                    )}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={onRepay}
              disabled={!loan.data?.data || mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Full Amount
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
