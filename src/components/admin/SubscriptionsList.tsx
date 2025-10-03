"use client";

import React from "react";
import TableSearch from "../tables/TableSearch";
import CustomTable from "../tables/CustomTable";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Stat, StatsWrapper } from "../misc/Stat";
import TopHeading from "../misc/TopHeading";
import { ISubscriptionWithUser } from "@/services/subscriptions.service";
import { ADMIN_SUBSCRIPTION_ROUTE } from "@/constants/routes";
import { formatPrice } from "@/lib/payment";

interface Props {
  initialSubscriptions?: ISubscriptionWithUser[];
  totalSubscriptions?: number;
  activeSubscriptions?: number;
  expiredSubscriptions?: number;
}

const SubscriptionsList = (props: Props) => {
  const router = useRouter();
  const subscriptions = props.initialSubscriptions || [];
  const totalSubscriptions = props.totalSubscriptions || 0;
  const activeSubscriptions = props.activeSubscriptions || 0;
  const expiredSubscriptions = props.expiredSubscriptions || 0;

  const calculateStatus = (endDate: string): "active" | "expired" => {
    const now = new Date();
    const end = new Date(endDate);
    return end > now ? "active" : "expired";
  };

  const calculateDaysRemaining = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isExpired = (endDate: string): boolean => {
    return calculateStatus(endDate) === "expired";
  };

  const calculateStats = () => {
    const total = subscriptions.length;
    const active = subscriptions.filter(
      (sub) => calculateStatus(sub.endDate) === "active"
    ).length;
    const expired = total - active;

    return {
      total: totalSubscriptions || total,
      active: activeSubscriptions || active,
      expired: expiredSubscriptions || expired,
    };
  };

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

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <TopHeading title="Subscriptions" className="mb-6" />

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Subscriptions"
          value={String(stats.total)}
          className="basis-[30%]"
        />
        <Stat
          title="Active Subscriptions"
          value={String(stats.active)}
          className="basis-[30%]"
        />
        <Stat
          title="Expired Subscriptions"
          value={String(stats.expired)}
          className="basis-[30%]"
        />
      </StatsWrapper>

      <TableSearch
        title="Subscription Management"
        placeholder="Search by user name, plan name..."
      />

      <CustomTable
        tableData={subscriptions?.map((subscription, index) => {
          const status = calculateStatus(subscription.endDate);

          return {
            id: subscription.id || `subscription-${index}`,
            user:
              subscription.user?.fullName ||
              (subscription.user as any)?.full_name ||
              "N/A",
            email: subscription.user?.email || "N/A",
            plan: subscription.plan?.name || "N/A",
            price: formatPrice(subscription.plan?.price || 0),
            duration: `${subscription.plan?.duration || 0} months`,
            startDate: subscription.startDate
              ? formatDate(subscription.startDate)
              : "N/A",
            endDate: subscription.endDate
              ? formatDate(subscription.endDate)
              : "N/A",
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
        isClickable
        onRowClick={(item) => {
          router.push(`${ADMIN_SUBSCRIPTION_ROUTE}/${item.id}`);
        }}
      />
    </div>
  );
};

export default SubscriptionsList;
