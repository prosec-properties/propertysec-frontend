"use client";

import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { usePDF } from "react-to-pdf";
import { showToaster } from "@/lib/general";
import { formatPrice } from "@/lib/payment";
import { IProperty } from "@/interface/property";

interface ReceiptDownloaderProps {
  property: IProperty;
  purchases: any[];
}

export interface ReceiptDownloaderRef {
  downloadReceipt: (transactionReference: string) => Promise<void>;
}

const ReceiptDownloader = forwardRef<
  ReceiptDownloaderRef,
  ReceiptDownloaderProps
>(({ property, purchases }, ref) => {
  const [receiptData, setReceiptData] = useState<any>(null);
  // const targetRef = useRef<HTMLDivElement>(null);

  const { toPDF, targetRef } = usePDF();

  const handleDownloadReceipt = async (transactionReference: string) => {
    try {
      const purchase = purchases.find(
        (p) => p.transactionReference === transactionReference
      );
      if (!purchase) {
        showToaster("Purchase data not found", "destructive");
        return;
      }

      setReceiptData(purchase);
      toPDF({
        filename: `property-receipt-${
          purchase.transactionReference || "unknown"
        }.pdf`,
      });

      // setTimeout(async () => {
      //   try {
      //     // toPDF({
      //     //   filename: `property-receipt-${
      //     //     purchase.transactionReference || "unknown"
      //     //   }.pdf`,
      //     // });
      //     showToaster("Receipt downloaded successfully", "default");
      //   } catch (error) {
      //     console.error("Error generating PDF:", error);
      //     showToaster("Failed to generate receipt", "destructive");
      //     setReceiptData(null);
      //   }
      // }, 100);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      showToaster("Failed to download receipt", "destructive");
      setReceiptData(null);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadReceipt: handleDownloadReceipt,
  }));

  return (
    <>
      {/* Hidden Receipt Component for PDF Generation */}
      {receiptData && (
        <div
          ref={targetRef}
          className="fixed top-0 left-0 w-full h-full bg-white p-8 text-black"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "210mm",
            minHeight: "297mm",
            fontSize: "12px",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                PropertySec
              </h1>
              <p className="text-gray-600">Property Purchase Receipt</p>
            </div>

            {/* Receipt Details */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Transaction Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">
                        Transaction Reference:
                      </span>{" "}
                      {receiptData.transactionReference}
                    </p>
                    <p>
                      <span className="font-medium">Purchase Date:</span>{" "}
                      {new Date(receiptData.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {receiptData.purchaseStatus}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(receiptData.purchaseAmount)}{" "}
                    {receiptData.currency}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Property Details
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium text-lg mb-1">{property.title}</p>
                  <p className="text-gray-600 mb-2">{property.address}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Type:</span> {property.type}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {property.category?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Buyer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {receiptData.buyerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {receiptData.buyerEmail}
                    </p>
                    {receiptData.buyerPhone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {receiptData.buyerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Details */}
              {property.user && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Seller Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {property.user.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {property.user.email}
                      </p>
                      {property.user.phoneNumber && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {property.user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              <p>Thank you for using PropertySec!</p>
              <p className="mt-2">
                Generated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ReceiptDownloader.displayName = "ReceiptDownloader";

export default ReceiptDownloader;
