"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { usePDF } from "react-to-pdf";
import { showToaster } from "@/lib/general";
import { formatPrice } from "@/lib/payment";
import { IProperty } from "@/interface/property";

interface ReceiptDownloaderProps {
  property: IProperty;
  purchase: any;
}

export interface ReceiptDownloaderRef {
  downloadReceipt: (transactionReference: string) => Promise<void>;
}


const ReceiptDownloader = forwardRef<
  ReceiptDownloaderRef,
  ReceiptDownloaderProps
>(({ property, purchase }, ref) => {
  const [receiptData, setReceiptData] = useState<any>(null);
  const { toPDF, targetRef } = usePDF({
    filename: `property-receipt-${purchase?.transactionReference}.pdf`,
  });

  // Expose downloadReceipt to parent via ref
  const downloadReceipt = useCallback(
    async (transactionReference: string) => {
      if (!purchase) {
        showToaster("No purchase data available to generate receipt.", "destructive");
        return;
      }

      const data = {
        transactionReference:
          transactionReference || purchase.transactionReference || purchase.id,
        createdAt: purchase.createdAt || new Date().toISOString(),
        purchaseStatus: purchase.status || purchase.paymentStatus || "Completed",
        purchaseAmount: purchase.amount || purchase.price || 0,
        currency: purchase.currency || property.currency || "NGN",
        buyerName:
          purchase.buyerName || purchase.user?.fullName || purchase.purchaserName || "",
        buyerEmail: purchase.buyerEmail || purchase.user?.email || purchase.purchaserEmail || "",
        buyerPhone:
          purchase.buyerPhone || purchase.user?.phoneNumber || purchase.purchaserPhone || "",
        paymentMethod: purchase.paymentMethod || purchase.method,
        paymentGateway: purchase.paymentGateway || purchase.gateway,
      };

      setReceiptData(data);

      // Wait for the hidden receipt DOM to mount and paint so react-to-pdf can capture it.
      await new Promise((res) => setTimeout(res, 250));

      try {
        if (!toPDF) throw new Error("toPDF is not available");
        await toPDF();
        showToaster("Receipt downloaded", "success");
      } catch (err) {
        console.error("Failed to generate PDF", err);
        showToaster("Failed to generate receipt PDF", "destructive");
      } finally {
        // remove hidden node after a short delay to avoid impacting UX
        setTimeout(() => setReceiptData(null), 800);
      }
    },
    [purchase, property, toPDF]
  );

  useImperativeHandle(ref, () => ({
    downloadReceipt,
  }));

  return (
    <>
      {/* Hidden Receipt Component for PDF Generation */}
      {receiptData && (
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
                    <p>
                      <span className="font-medium">Price:</span>{" "}
                      {formatPrice(property.price)} {property.currency}
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

              {/* Payment Method */}
              {receiptData.paymentMethod && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Method:</span>{" "}
                      {receiptData.paymentMethod}
                    </p>
                    {receiptData.paymentGateway && (
                      <p className="text-sm">
                        <span className="font-medium">Gateway:</span>{" "}
                        {receiptData.paymentGateway}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Terms & Conditions
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• This receipt serves as proof of purchase.</p>
                  <p>• All sales are final unless otherwise specified.</p>
                  <p>• Please retain this receipt for your records.</p>
                  <p>• For any inquiries, contact support@propertysec.com</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              <p>Thank you for using PropertySec!</p>
              <p className="mt-2">
                Generated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()}
              </p>
              <p className="mt-1 text-xs">
                PropertySec Inc. • 123 Business Ave, City, State 12345 • support@propertysec.com
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