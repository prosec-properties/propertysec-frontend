"use client";

import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { usePDF } from "react-to-pdf";
import { showToaster } from "@/lib/general";
import { IProperty } from "@/interface/property";

interface Inspection {
  id: string;
  inspectionAmount: number;
  inspectionStatus: "PENDING" | "COMPLETED";
  approvalStatus?: "approved" | "pending" | "rejected";
  inspectionReport: string;
  userId: string;
  propertyId: string;
  name: string;
  email: string;
  phoneNumber: string;
  inspectionDate: string;
  createdAt: string;
  updatedAt: string;
  property: IProperty & {
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

interface InspectionReceiptDownloaderProps {
  inspection: Inspection;
}

export interface InspectionReceiptDownloaderRef {
  downloadReceipt: () => Promise<void>;
}

const InspectionReceiptDownloader = forwardRef<
  InspectionReceiptDownloaderRef,
  InspectionReceiptDownloaderProps
>(({ inspection }, ref) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<Inspection | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const { toPDF } = usePDF({
    filename: `inspection-receipt-${inspection.id}.pdf`,
  });

  const handleDownloadReceipt = async () => {
    setReceiptData(inspection);
    setShowReceipt(true);
    try {
      setTimeout(async () => {
        try {
          await toPDF();
          showToaster("Receipt downloaded successfully", "default");
        } catch (error) {
          console.error("Error generating PDF:", error);
          showToaster("Failed to generate receipt", "destructive");
        } finally {
          setShowReceipt(false);
          setReceiptData(null);
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      showToaster("Failed to download receipt", "destructive");
      setShowReceipt(false);
      setReceiptData(null);
    }
  };

  useImperativeHandle(ref, () => ({
    downloadReceipt: handleDownloadReceipt,
  }));

  return (
    <>
      {/* Hidden Receipt Component for PDF Generation */}
      {showReceipt && receiptData && (
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
                      {receiptData.id}
                    </p>
                    <p>
                      <span className="font-medium">Inspection Date:</span>{" "}
                      {new Date(receiptData.inspectionDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {receiptData.inspectionStatus}
                    </p>
                    {receiptData.approvalStatus && (
                      <p>
                        <span className="font-medium">Approval Status:</span>{" "}
                        {receiptData.approvalStatus}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                  <div className="text-2xl font-bold text-green-600">
                    ₦{receiptData.inspectionAmount.toLocaleString()}
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
                    {receiptData.property.title}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {receiptData.property.address}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {receiptData.property.type}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {receiptData.property.category?.name}
                    </p>
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
                      {receiptData.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {receiptData.email}
                    </p>
                    {receiptData.phoneNumber && (
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {receiptData.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Landlord Details */}
              {receiptData.property.user && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Landlord Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {receiptData.property.user.fullName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {receiptData.property.user.email}
                      </p>
                      {receiptData.property.user.phoneNumber && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {receiptData.property.user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Inspection Report */}
              {receiptData.inspectionReport && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Inspection Report
                  </h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm">{receiptData.inspectionReport}</p>
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