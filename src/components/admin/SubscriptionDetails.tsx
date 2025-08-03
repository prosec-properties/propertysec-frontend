"use client";

import React from "react";
import TopHeading from "../misc/TopHeading";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { ISubscriptionWithUser } from "@/services/subscriptions.service";
import CustomButton from "../buttons/CustomButton";
import { useRouter } from "next/navigation";
import { ADMIN_SUBSCRIPTION_ROUTE } from "@/constants/routes";

interface Props {
  subscription: ISubscriptionWithUser;
}

const SubscriptionDetails = ({ subscription }: Props) => {
  const router = useRouter();

  const calculateStatus = (endDate: string): 'active' | 'expired' => {
    const now = new Date();
    const end = new Date(endDate);
    return end > now ? 'active' : 'expired';
  };

  const calculateDaysRemaining = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isExpired = (endDate: string): boolean => {
    return calculateStatus(endDate) === 'expired';
  };

  const status = calculateStatus(subscription.endDate);
  const daysRemaining = calculateDaysRemaining(subscription.endDate);
  const expired = isExpired(subscription.endDate);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-successLight text-success";
      case "expired":
      case "cancelled":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-grey100 text-grey8";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TopHeading title="Subscription Details" />
        <CustomButton
          variant="secondary"
          onClick={() => router.push(ADMIN_SUBSCRIPTION_ROUTE)}
        >
          ← Back to Subscriptions
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information Card */}
        <div className="bg-white border-[0.6px] border-grey100 rounded-[0.625rem] p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">User Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-grey8">Full Name</label>
              <p className="text-black font-medium">{subscription.user?.fullName || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Email</label>
              <p className="text-black">{subscription.user?.email || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Phone Number</label>
              <p className="text-black">{subscription.user?.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">State of Residence</label>
              <p className="text-black">{subscription.user?.stateOfResidence || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">User Role</label>
              <p className="text-black capitalize">{subscription.user?.role || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Subscription Information Card */}
        <div className="bg-white border-[0.6px] border-grey100 rounded-[0.625rem] p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Subscription Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-grey8">Subscription ID</label>
              <p className="text-black font-mono text-sm">{subscription.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Status</label>
              <p
                className={cn(
                  "capitalize w-fit px-3 py-2 rounded-[3px] text-sm font-medium",
                  getStatusColor(status)
                )}
              >
                {status}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Start Date</label>
              <p className="text-black">{formatDate(subscription.startDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">End Date</label>
              <p className="text-black">{formatDate(subscription.endDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Days Remaining</label>
              <p className={cn("font-medium", {
                "text-red-600": expired || daysRemaining <= 7,
                "text-yellow-600": daysRemaining > 7 && daysRemaining <= 30,
                "text-green-600": daysRemaining > 30,
              })}>
                {expired ? "Expired" : `${daysRemaining} days`}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Total Price</label>
              <p className="text-black font-semibold">₦{subscription.totalPrice || 0}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Created At</label>
              <p className="text-black">{formatDate(subscription.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Plan Information Card */}
        <div className="bg-white border-[0.6px] border-grey100 rounded-[0.625rem] p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-black">Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-grey8">Plan Name</label>
              <p className="text-black font-semibold text-lg">{subscription.plan?.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Price</label>
              <p className="text-black font-semibold text-lg">
                {subscription.plan?.currency || "₦"}{subscription.plan?.price || 0}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-grey8">Duration</label>
              <p className="text-black font-medium">{subscription.plan?.duration || 0} days</p>
            </div>
          </div>
          
          {subscription.plan?.features && subscription.plan.features.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-grey8 block mb-2">Plan Features</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscription.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
