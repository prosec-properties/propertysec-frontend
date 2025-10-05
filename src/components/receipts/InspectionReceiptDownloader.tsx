"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { showToaster } from "@/lib/general";
import { usePDFDownloader } from "@/hooks/usePDFDownloader";
import { IPropertyInspection } from "@/interface/property";
import { formatPrice } from "@/lib/payment";

interface InspectionReceiptDownloaderProps {
  inspection: IPropertyInspection;
}

export interface InspectionReceiptDownloaderRef {
  downloadReceipt: () => Promise<void>;
}

const InspectionReceiptDownloader = forwardRef<
  InspectionReceiptDownloaderRef,
  InspectionReceiptDownloaderProps
>(({ inspection }, ref) => {
  const {
    payload: receiptData,
    setPayload: setReceiptData,
    download,
    targetRef,
  } = usePDFDownloader(
    (p) =>
      `inspection-receipt-${
        (p as IPropertyInspection)?.id || inspection.id
      }.pdf`
  );

  const handleDownloadReceipt = async () => {
    setReceiptData(inspection);
    try {
      await download(inspection);
      showToaster("Receipt downloaded successfully", "default");
    } catch (error) {
      console.error("Error generating PDF:", error);
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
              <p className="text-gray-600">Property Inspection Receipt</p>
            </div>

            {/* Receipt Details */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Inspection Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Inspection ID:</span>{" "}
                      {(receiptData as IPropertyInspection).id}
                    </p>
                    <p>
                      <span className="font-medium">Inspection Date:</span>{" "}
                      {(receiptData as IPropertyInspection).createdAt}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {(receiptData as IPropertyInspection).inspectionStatus}
                    </p>
                    {(receiptData as IPropertyInspection).approvalStatus && (
                      <p>
                        <span className="font-medium">Approval Status:</span>{" "}
                        {(receiptData as IPropertyInspection).approvalStatus}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(
                      (receiptData as IPropertyInspection).inspectionAmount
                    )}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Property Details
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium text-lg mb-1">
                    {(receiptData as IPropertyInspection).property.title}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {(receiptData as IPropertyInspection).property.address}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {(receiptData as IPropertyInspection).property.type && (
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {(receiptData as IPropertyInspection).property.type}
                      </p>
                    )}
                    {(receiptData as IPropertyInspection).property.category && (
                      <p>
                        <span className="font-medium">Category:</span>{" "}
                        {
                          (receiptData as IPropertyInspection).property.category
                            ?.name
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Inspector Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Inspector Information
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {(receiptData as IPropertyInspection).name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {(receiptData as IPropertyInspection).email}
                    </p>
                    {(receiptData as IPropertyInspection).phoneNumber && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {(receiptData as IPropertyInspection).phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Landlord Details */}
              {(receiptData as IPropertyInspection).property.user && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Landlord Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {
                          (receiptData as IPropertyInspection).property.user
                            .fullName
                        }
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {
                          (receiptData as IPropertyInspection).property.user
                            .email
                        }
                      </p>
                      {(receiptData as IPropertyInspection).property.user
                        .phoneNumber && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {
                            (receiptData as IPropertyInspection).property.user
                              .phoneNumber
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Inspection Report */}
              {(receiptData as IPropertyInspection).inspectionReport && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Inspection Report
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm">
                      {(receiptData as IPropertyInspection).inspectionReport}
                    </p>
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

InspectionReceiptDownloader.displayName = "InspectionReceiptDownloader";

export default InspectionReceiptDownloader;
