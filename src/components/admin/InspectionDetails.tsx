"use client";

import React, { useState } from "react";
import {
  InspectionPaymentDetail,
  updateInspectionStatus,
} from "@/services/inspection.service";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/payment";
import { cn } from "@/lib/utils";
import CustomButton from "../buttons/CustomButton";
import { ArrowLeft, ChevronDown, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { showToaster } from "@/lib/general";

interface Props {
  inspection: InspectionPaymentDetail;
  onUpdate?: (updatedInspection: InspectionPaymentDetail) => void;
  token: string;
}

const InspectionDetails = ({ inspection, onUpdate, token }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentInspectionStatus, setCurrentInspectionStatus] = useState(
    inspection.inspectionStatus
  );
  const [currentStatus, setCurrentStatus] = useState(inspection.status);
  const [expandedSections, setExpandedSections] = useState({
    inspection: true,
    user: true,
    property: true,
    timeline: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMarkAsCompleted = async () => {
    if (!token) return;

    setIsUpdating(true);
    try {
      const response = await updateInspectionStatus(
        token,
        inspection.id,
        "COMPLETED"
      );

      if (response && response.success) {
        showToaster("Inspection marked as completed successfully!", "success");
        setCurrentInspectionStatus("COMPLETED");
        setCurrentStatus("completed");
        if (onUpdate) {
          onUpdate({
            ...inspection,
            inspectionStatus: "COMPLETED",
            status: "paid",
          });
        }
      } else {
        showToaster("Failed to update inspection status", "destructive");
      }
    } catch (error) {
      console.error("Error updating inspection status:", error);
      showToaster(
        "An error occurred while updating the inspection status",
        "destructive"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <CustomButton
            onClick={() => router.back()}
            variant="secondary"
            className="flex items-center text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </CustomButton>
          <h1 className="text-xl md:text-2xl font-bold">Inspection Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Inspection Information */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleSection("inspection")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              Inspection Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.inspection,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.inspection,
              "max-h-[1000px] md:max-h-none": expandedSections.inspection,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Amount
                </label>
                <p className="text-base md:text-lg font-semibold">
                  {formatPrice(inspection?.amount as number)}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Payment Date
                </label>
                <p className="text-xs md:text-sm">
                  {formatDate(inspection.createdAt)}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium w-fi capitalize",
                      {
                        "bg-green-100 text-green-800":
                          currentInspectionStatus === "COMPLETED",
                        "bg-yellow-100 text-yellow-800":
                          currentInspectionStatus === "PENDING",
                      }
                    )}
                  >
                    {currentStatus}
                  </span>
                  {user?.role === "admin" &&
                    currentInspectionStatus === "PENDING" && (
                      <CustomButton
                        onClick={handleMarkAsCompleted}
                        disabled={isUpdating}
                        className="flex items-center text-xs px-3 py-1 h-auto"
                        variant="primary"
                      >
                        {isUpdating ? (
                          "Updating..."
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirm Inspection Completed
                          </>
                        )}
                      </CustomButton>
                    )}
                </div>
              </div>
              {inspection.inspectionReport && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Inspection Report
                  </label>
                  <p className="text-xs md:text-sm bg-gray-50 p-3 rounded break-words">
                    {inspection.inspectionReport}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleSection("user")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              User Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.user,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.user,
              "max-h-[1000px] md:max-h-none": expandedSections.user,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="text-xs md:text-sm break-words">
                  {inspection.user?.fullName || inspection.name}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-xs md:text-sm break-all">
                  {inspection.user?.email || inspection.email}
                </p>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <p className="text-xs md:text-sm">
                  {inspection.user?.phoneNumber || inspection.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information */}

        <div className="bg-white rounded-lg shadow-sm border xl:col-span-2 overflow-hidden">
          <button
            onClick={() => toggleSection("property")}
            className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
          >
            <h2 className="text-base md:text-lg font-semibold">
              Property Information
            </h2>
            <ChevronDown
              className={cn("w-5 h-5 transition-transform md:hidden", {
                "rotate-180": expandedSections.property,
              })}
            />
          </button>
          <div
            className={cn("overflow-hidden transition-all duration-200", {
              "max-h-0 md:max-h-none": !expandedSections.property,
              "max-h-[1000px] md:max-h-none": expandedSections.property,
            })}
          >
            <div className="p-4 md:p-6 md:pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Property Title
                  </label>
                  <p className="text-xs md:text-sm font-medium break-words">
                    {inspection.property?.title}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <p className="text-xs md:text-sm break-words">
                    {inspection.property?.address}
                  </p>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">
                    Property Price
                  </label>
                  <p className="text-base md:text-lg font-semibold text-primary">
                    {formatPrice(inspection.property?.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline/History Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <button
          onClick={() => toggleSection("timeline")}
          className="w-full p-4 md:p-6 flex items-center justify-between bg-gray-50 md:bg-transparent md:cursor-default"
        >
          <h2 className="text-base md:text-lg font-semibold">Timeline</h2>
          <ChevronDown
            className={cn("w-5 h-5 transition-transform md:hidden", {
              "rotate-180": expandedSections.timeline,
            })}
          />
        </button>
        <div
          className={cn("overflow-hidden transition-all duration-200", {
            "max-h-0 md:max-h-none": !expandedSections.timeline,
            "max-h-[1000px] md:max-h-none": expandedSections.timeline,
          })}
        >
          <div className="p-4 md:p-6 md:pt-0 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium">
                  Inspection Payment Created
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(inspection.createdAt)}
                </p>
              </div>
            </div>
            {currentInspectionStatus === "COMPLETED" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium">
                    Inspection Completed
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(inspection.updatedAt)}
                  </p>
                </div>
              </div>
            )}
            {inspection.approvalStatus === "approved" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium">
                    Inspection Approved
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(inspection.updatedAt)}
                  </p>
                </div>
              </div>
            )}
            {inspection.approvalStatus === "rejected" && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium">
                    Inspection Rejected
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(inspection.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
