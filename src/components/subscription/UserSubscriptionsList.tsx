"use client";

import React from "react";
import TableSearch from "../tables/TableSearch";
import CustomTable from "../tables/CustomTable";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Stat, StatsWrapper } from "../misc/Stat";
import TopHeading from "../misc/TopHeading";
import { ISubscription } from "@/services/subscriptions.service";

interface Props {
  subscriptions?: ISubscription[];
  statistics?: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
  };
}

const UserSubscriptionsList = (props: Props) => {
  const subscriptions = props.subscriptions || [];
  const backendStats = props.statistics;

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

  const calculateStats = () => {
    const total = subscriptions.length;
    const active = subscriptions.filter(sub => calculateStatus(sub.endDate) === 'active').length;
    const expired = total - active;
    
    return {
      totalSubscriptions: backendStats?.totalSubscriptions || total,
      activeSubscriptions: backendStats?.activeSubscriptions || active,
      expiredSubscriptions: backendStats?.expiredSubscriptions || expired,
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
      <TopHeading title="My Subscriptions" className="mb-6" />
      
      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Subscriptions"
          value={String(stats.totalSubscriptions)}
          className="basis-[30%]"
        />
        <Stat
          title="Active Subscriptions"
          value={String(stats.activeSubscriptions)}
          className="basis-[30%]"
        />
        <Stat
          title="Expired Subscriptions"
          value={String(stats.expiredSubscriptions)}
          className="basis-[30%]"
        />
      </StatsWrapper>

      <TableSearch
        title="Your Subscription History"
        placeholder="Search by plan name..."
      />

      <CustomTable
        tableData={subscriptions?.map((subscription) => {
          const status = calculateStatus(subscription.endDate);
          const daysRemaining = calculateDaysRemaining(subscription.endDate);
          const expired = isExpired(subscription.endDate);
          
          return {
            id: subscription.id,
            plan: subscription.plan?.name || "N/A",
            price: `${subscription.plan?.currency || "₦"}${subscription.plan?.price || 0}`,
            duration: `${subscription.plan?.duration || 0} days`,
            startDate: formatDate(subscription.startDate),
            endDate: formatDate(subscription.endDate),
            daysRemaining: expired ? "Expired" : `${daysRemaining} days`,
            status: (
              <p
                className={cn(
                  "capitalize w-fit px-3 py-2 rounded-[3px]",
                  getStatusColor(status)
                )}
              >
                {status}
              </p>
            ),
          };
        })}
        hiddenColumns={["id"]}
        isClickable={false}
      />
    </div>
  );
};

export default UserSubscriptionsList;
