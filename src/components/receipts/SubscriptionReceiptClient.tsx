"use client";

import React, { useRef } from "react";
import { Transaction } from "@/interface/payment";
import { showToaster } from "@/lib/general";
import { formatPrice } from "@/lib/payment";
import { formatDate } from "@/lib/date";
import CustomButton from "@/components/buttons/CustomButton";
import { generateInvoicePdfName } from "@/lib/files";
import { usePDFDownloader } from "@/hooks/usePDFDownloader";

interface SubscriptionReceiptClientProps {
  paymentInfo: Transaction | null;
  userEmail: string | null | undefined;
}

const SubscriptionReceiptClient: React.FC<SubscriptionReceiptClientProps> = ({
  paymentInfo,
  userEmail,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { payload: receiptData, setPayload: setReceiptData, download, targetRef } =
    usePDFDownloader((p) =>
      generateInvoicePdfName({
        planName: (p as Transaction)?.plan?.name ?? paymentInfo?.plan?.name ?? "subscription",
        planDuration:
          (p as Transaction)?.plan?.duration?.toString() ?? paymentInfo?.plan?.duration?.toString() ?? "",
        reference: (p as Transaction)?.reference ?? paymentInfo?.reference ?? "receipt",
      }) + ".pdf"
    );

  const handleDownloadInvoice = async () => {
    if (!paymentInfo) {
      showToaster("No payment information available.", "warning");
      return;
    }

    try {
      // Use shared hook to prepare payload and generate PDF from hidden DOM
      setReceiptData(paymentInfo);
      await download(paymentInfo);
    } catch (error) {
      showToaster("Error downloading receipt.", "destructive");
      console.error("Error downloading receipt:", error);
    }
  };

  if (!paymentInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h1 className="text-2xl font-semibold mb-4">
          Transaction Not Found
        </h1>
        <p className="text-gray-600">
          We could not find the details for this transaction. Please check the
          reference, ensure you are logged in, or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Payment Receipt
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Thank you for your payment, {userEmail || "customer"}!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Transaction Reference
            </h2>
            <p className="text-lg text-gray-800 break-all">
              {paymentInfo.reference || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Transaction ID
            </h2>
            <p className="text-lg text-gray-800 break-all">
              {paymentInfo.id || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Payment Status
            </h2>
            <p
              className={`text-lg font-semibold ${
                paymentInfo.status === "SUCCESS"
                  ? "text-green-600"
                  : paymentInfo.status === "PENDING"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {paymentInfo.status || "N/A"}
            </p>
          </div>
          {paymentInfo.providerStatus && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Provider Status
              </h2>
              <p className="text-lg text-gray-800">
                {paymentInfo.providerStatus}
              </p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Amount Paid
            </h2>
            <p className="text-lg text-gray-800">
              {formatPrice(paymentInfo.actualAmount, paymentInfo.currency)}
            </p>
          </div>
          {typeof paymentInfo.amount === 'number' && paymentInfo.amount !== paymentInfo.actualAmount && (
             <div>
               <h2 className="text-sm font-semibold text-gray-500 mb-1">
                 Original Amount
               </h2>
               <p className="text-lg text-gray-800">
                 {formatPrice(paymentInfo.amount, paymentInfo.currency)}
               </p>
             </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Payment Method (Provider)
            </h2>
            <p className="text-lg text-gray-800">
              {paymentInfo.provider || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Transaction Type
            </h2>
            <p className="text-lg text-gray-800">
              {paymentInfo.type || "N/A"}
            </p>
          </div>
          {paymentInfo.sessionId && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Session ID
              </h2>
              <p className="text-lg text-gray-800">
                {paymentInfo.sessionId}
              </p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Date of Transaction
            </h2>
            <p className="text-lg text-gray-800">
              {formatDate(paymentInfo.date || paymentInfo.createdAt)}
            </p>
          </div>
          {paymentInfo.plan?.name && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Plan Name
              </h2>
              <p className="text-lg text-gray-800">{paymentInfo.plan.name}</p>
            </div>
          )}
          {paymentInfo.plan?.duration && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Plan Duration
              </h2>
              <p className="text-lg text-gray-800">
                {paymentInfo.plan.duration} days
              </p>
            </div>
          )}
          {paymentInfo.currency && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Currency
              </h2>
              <p className="text-lg text-gray-800">
                {paymentInfo.currency}
              </p>
            </div>
          )}
          {paymentInfo.isVerified !== undefined && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-1">
                Verification Status
              </h2>
              <p className={`text-lg ${paymentInfo.isVerified ? "text-green-600" : "text-red-600"}`}>
                {paymentInfo.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          )}
        </div>

        {paymentInfo.narration && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Narration
            </h2>
            <p className="text-base text-gray-700 bg-gray-50 p-3 rounded">
              {paymentInfo.narration}
            </p>
          </div>
        )}
        
        {paymentInfo.verifyNarration && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-1">
              Verification Notes
            </h2>
            <p className="text-base text-gray-700 bg-gray-50 p-3 rounded">
              {paymentInfo.verifyNarration}
            </p>
          </div>
        )}

        {paymentInfo.plan?.features && paymentInfo.plan.features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Plan Features
            </h2>
            <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
              {paymentInfo.plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-8">
          <CustomButton onClick={handleDownloadInvoice} variant="default">
            Download Receipt PDF
          </CustomButton>
        </div>

        {/* Hidden receipt used for PDF generation - kept visually offscreen */}
        {receiptData != null && (
          <div
            ref={targetRef}
            className="bg-white p-8 text-black"
            style={{
              position: "fixed",
              left: "-9999px",
              top: "-9999px",
              width: "210mm",
              minHeight: "297mm",
              fontSize: "12px",
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">PropertySec</h1>
                <p className="text-gray-600">Subscription Payment Receipt</p>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Transaction Reference:</span>{" "}
                        {(receiptData as Transaction).reference}
                      </p>
                      <p>
                        <span className="font-medium">Purchase Date:</span>{" "}
                        {new Date((receiptData as Transaction).date || (receiptData as Transaction).createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {(receiptData as Transaction).status}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice((receiptData as Transaction).actualAmount || (receiptData as Transaction).amount, (receiptData as Transaction).currency)}
                    </div>
                  </div>
                </div>

                {(receiptData as Transaction).plan && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Plan Details</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="font-medium text-lg mb-1">{(receiptData as Transaction).plan!.name}</p>
                      {(receiptData as Transaction).plan!.duration && (
                        <p className="text-sm">Duration: {(receiptData as Transaction).plan!.duration} days</p>
                      )}
                    </div>
                  </div>
                )}

                {(receiptData as Transaction).narration && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Narration</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-sm">{(receiptData as Transaction).narration}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Thank you for using PropertySec!</p>
                <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-600">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionReceiptClient;