import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllSubscriptions } from "@/services/subscriptions.service";
import React from "react";
import SubscriptionsList from "@/components/admin/SubscriptionsList";

interface IProps {
    searchParams: {
        search?: string;
        page?: string;
        limit?: string;
        status?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function SubscriptionsListWrapper({ searchParams }: IProps) {
    const { user } = await adminGuard();

    const subscriptions = await fetchAllSubscriptions(
        user?.token || "",
        {
            search: searchParams.search,
            page: searchParams.page ? parseInt(searchParams.page) : 1,
            limit: searchParams.limit ? parseInt(searchParams.limit) : 50,
            status: searchParams.status,
        },
        {
            cache: "force-cache",
            next: { revalidate: 300, tags: ["subscriptions", "admin-subscriptions"] },
        }
    );

    if (!subscriptions?.success) {
        return <ErrorDisplay message="An error occurred while fetching subscriptions" />;
    }

    const subscriptionData = subscriptions?.data?.data || [];
    const statistics = subscriptions?.data?.statistics;

    return (
        <SubscriptionsList
            initialSubscriptions={subscriptionData}
            totalSubscriptions={statistics?.totalSubscriptions}
            activeSubscriptions={statistics?.activeSubscriptions}
            expiredSubscriptions={statistics?.expiredSubscriptions}
        />
    );
}
