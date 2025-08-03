import React from "react";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/../auth.config";
import { getTransactionByReferenceApi } from "@/services/payment.service";
import SubscriptionReceiptClient from "@/components/subscription/SubscriptionReceiptClient";
import { PaymentCredentials, Transaction } from "@/interface/payment";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { redirect } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/constants/routes";

interface PageProps {
  params: Promise<{
    reference: string;
  }>;
}

async function SubscriptionReceiptPage({ params }: PageProps) {
  const session = await getServerSession(authConfig);
  const token = session?.accessToken;
  const userEmail = session?.user?.email;
  const { reference } = await params;

  console.log("reference", reference);

  let paymentInfo: Transaction | null = null;
  let errorFetching: string | null = null;

  if (!token) {
    <ErrorDisplay
      message="You are not logged in. Please log
     in to view your subscription receipt."
    />;
    redirect(SIGN_IN_ROUTE);
  }

  const response = await getTransactionByReferenceApi(token, reference);

  if (!response?.success) {
    errorFetching =
      response?.message || "Failed to fetch transaction details from server.";
  }

  console.log("response", response?.data);

  paymentInfo = response?.data || null;

  if (errorFetching && !paymentInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">
            Error Loading Receipt
          </h1>
          <p className="text-gray-600">{errorFetching}</p>
          <p className="text-gray-500 mt-2">
            Please ensure the reference is correct, try again later, or contact
            support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionReceiptClient
      paymentInfo={paymentInfo}
      userEmail={userEmail}
    />
  );
}

export default SubscriptionReceiptPage;
