"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/payment";
import { formatDate } from "@/lib/date";
import { useToast } from "@/components/ui/use-toast";
import {
  initializeLoanRepayment,
  verifyLoanRepayment,
  getLoanRepaymentDetails,
  LoanRepaymentDetailsResponse,
  InitializeLoanRepaymentData,
} from "@/services/loan-repayment.service";

interface LoanRepaymentProps {
  loanId: string;
  loanStatus: string;
}

// declare global {
//   interface Window {
//     PaystackPop: {
//       setup: (config: any) => {
//         openIframe: () => void;
//       };
//     };
//   }
// }

export default function LoanRepayment({ loanId, loanStatus }: LoanRepaymentProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [repaymentDetails, setRepaymentDetails] = useState<LoanRepaymentDetailsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [repaymentType, setRepaymentType] = useState<"PARTIAL" | "FULL" | "INTEREST" | "PRINCIPAL">("PARTIAL");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "BANK_TRANSFER" | "WALLET" | "CASH">("CARD");
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setPaystackLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchRepaymentDetails = async () => {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        const response = await getLoanRepaymentDetails(loanId, session.user.token);
        if (response.success && response.data) {
          setRepaymentDetails(response.data);
          if (response.data.repaymentDetails.outstandingBalance > 0) {
            setRepaymentAmount(response.data.repaymentDetails.outstandingBalance.toString());
            setRepaymentType("FULL");
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch repayment details",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error fetching repayment details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepaymentDetails();
  }, [loanId, session?.user?.token, toast]);

  const handlePaystackSuccess = async (reference: any) => {
    if (!session?.user?.token || !reference.reference) return;

    try {
      setProcessing(true);
      const response = await verifyLoanRepayment(
        reference.reference.split("_")[1], 
        {
          paymentReference: reference.reference,
          providerResponse: reference,
        },
        session.user.token
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Payment verified successfully!",
        });
        // Refresh repayment details
        const detailsResponse = await getLoanRepaymentDetails(loanId, session.user.token);
        if (detailsResponse.success && detailsResponse.data) {
          setRepaymentDetails(detailsResponse.data);
        }

        setRepaymentAmount("");
        setRepaymentType("PARTIAL");
      } else {
        toast({
          title: "Error",
          description: response.message || "Payment verification failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error verifying payment",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePaystackClose = () => {
    toast({
      title: "Info",
      description: "Payment cancelled",
    });
    setProcessing(false);
  };

  const handleSubmitRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token || !paystackLoaded) return;

    const amount = parseFloat(repaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (repaymentDetails && amount > repaymentDetails.repaymentDetails.outstandingBalance) {
      toast({
        title: "Error",
        description: "Amount cannot exceed outstanding balance",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      const data: InitializeLoanRepaymentData = {
        repaymentAmount: amount,
        repaymentType,
        paymentMethod,
      };

      const response = await initializeLoanRepayment(loanId, data, session.user.token);

      if (response.success && response.data) {
        // Initialize Paystack payment
        const handler = (window as any).PaystackPop.setup({
          key: response.data.paystackConfig.publicKey,
          email: response.data.paystackConfig.email,
          amount: response.data.paystackConfig.amount,
          currency: response.data.paystackConfig.currency,
          ref: response.data.paystackConfig.reference,
          metadata: response.data.paystackConfig.metadata,
          onSuccess: handlePaystackSuccess,
          onClose: handlePaystackClose,
        });

        handler.openIframe();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to initialize payment",
          variant: "destructive",
        });
        setProcessing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error initializing payment",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading repayment details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!repaymentDetails) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load repayment details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show repayment for non-disbursed loans
  if (loanStatus !== "disbursed" && loanStatus !== "overdue") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Loan Repayment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-6">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>Repayment will be available once your loan is disbursed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { repaymentDetails: details, repaymentHistory } = repaymentDetails;

  // Check if loan is fully paid
  if (details.outstandingBalance <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Loan Repayment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-green-600 py-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loan Fully Repaid!</h3>
            <p>Congratulations! You have successfully repaid your loan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Repayment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Repayment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(details.totalAmount)}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(details.totalPaid)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Outstanding Balance</p>
              <p className="text-xl font-bold text-red-600">
                {formatPrice(details.outstandingBalance)}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
              <p className="text-xl font-bold text-purple-600">
                {formatPrice(details.monthlyPayment)}
              </p>
            </div>
          </div>

          {details.penaltyAmount > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">
                  Penalty Amount: {formatPrice(details.penaltyAmount)}
                </p>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                This loan has accrued penalty charges due to overdue payments.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Make Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Make Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitRepayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Repayment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={details.outstandingBalance}
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
                <p className="text-xs text-gray-500">
                  Maximum: {formatPrice(details.outstandingBalance)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repaymentType">Repayment Type</Label>
                <Select value={repaymentType} onValueChange={(value: any) => setRepaymentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PARTIAL">Partial Payment</SelectItem>
                    <SelectItem value="FULL">Full Payment</SelectItem>
                    <SelectItem value="INTEREST">Interest Only</SelectItem>
                    <SelectItem value="PRINCIPAL">Principal Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARD">Card Payment</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={processing || !paystackLoaded}
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay {repaymentAmount ? formatPrice(parseFloat(repaymentAmount)) : "Amount"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment History */}
      {repaymentHistory && repaymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repaymentHistory.map((payment, index) => (
                <div key={payment.id}>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        payment.status === "SUCCESS" ? "bg-green-500" :
                        payment.status === "PENDING" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}></div>
                      <div>
                        <p className="font-medium">{formatPrice(payment.amount)}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(payment.date)} • {payment.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          payment.status === "SUCCESS" ? "default" :
                          payment.status === "PENDING" ? "secondary" :
                          "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {payment.reference}
                      </p>
                    </div>
                  </div>
                  {index < repaymentHistory.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
