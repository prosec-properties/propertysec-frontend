"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { formatPrice } from "@/lib/payment";
import { IProperty, IPropertyPurchase } from "@/interface/property";
import { usePDFDownloader } from "@/hooks/usePDFDownloader";

interface ReceiptData {
  transactionReference: string;
  createdAt: string;
  purchaseStatus: string;
  purchaseAmount: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  paymentMethod?: string;
  paymentGateway?: string;
  property: IProperty;
}

interface ReceiptDownloaderProps {
  property: IProperty;
  purchase: IPropertyPurchase;
}

export interface ReceiptDownloaderRef {
  downloadReceipt: (transactionReference: string) => Promise<void>;
}

const PropertyPurchase = forwardRef<
  ReceiptDownloaderRef,
  ReceiptDownloaderProps
>(({ property, purchase }, ref) => {
  const {
    payload: receiptData,
    setPayload: setReceiptData,
    download,
    targetRef,
  } = usePDFDownloader(
    (p) => `property-receipt-${purchase?.transactionReference || "receipt"}.pdf`
  );

  const downloadReceipt = async (transactionReference: string) => {
    if (!purchase) {
      const { showToaster } = await import("@/lib/general");
      showToaster(
        "No purchase data available to generate receipt.",
        "destructive"
      );
      return;
    }

    const data: ReceiptData = {
      transactionReference: purchase.transactionReference || "",
      createdAt: purchase.createdAt,
      purchaseStatus: purchase.purchaseStatus || "Completed",
      purchaseAmount: purchase.purchaseAmount || 0,
      currency: purchase.currency || "NGN",
      buyerName: purchase.buyerName || "",
      buyerEmail: purchase.buyerEmail || "",
      buyerPhone: purchase.buyerPhone || purchase.user?.phoneNumber || "",
      paymentMethod: purchase.paymentMethod || purchase.method,
      paymentGateway: purchase.paymentGateway || purchase.gateway,
      property,
    };

    setReceiptData(data);
    try {
      await download(data);
    } catch (err) {
      // already handled in hook
    }
  };

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
                      {(receiptData as ReceiptData).transactionReference}
                    </p>
                    <p>
                      <span className="font-medium">Purchase Date:</span>{" "}
                      {new Date(
                        (receiptData as ReceiptData).createdAt
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {(receiptData as ReceiptData).purchaseStatus}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice((receiptData as ReceiptData).purchaseAmount)}{" "}
                    {(receiptData as ReceiptData).currency}
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
                      {(receiptData as ReceiptData).buyerName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {(receiptData as ReceiptData).buyerEmail}
                    </p>
                    {(receiptData as ReceiptData).buyerPhone && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {(receiptData as ReceiptData).buyerPhone}
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
              {(receiptData as ReceiptData).paymentMethod && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm">
                      <span className="font-medium">Method:</span>{" "}
                      {(receiptData as ReceiptData).paymentMethod}
                    </p>
                    {(receiptData as ReceiptData).paymentGateway && (
                      <p className="text-sm">
                        <span className="font-medium">Gateway:</span>{" "}
                        {(receiptData as ReceiptData).paymentGateway}
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
                PropertySec Inc. • 123 Business Ave, City, State 12345 •
                support@propertysec.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

PropertyPurchase.displayName = "PropertyPurchase";

export default PropertyPurchase;
