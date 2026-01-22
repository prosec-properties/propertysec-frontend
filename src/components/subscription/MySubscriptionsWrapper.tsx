import ErrorDisplay from "@/components/misc/ErrorDisplay";
import UserSubscriptionsList from "@/components/subscription/UserSubscriptionsList";
import { ensureAuthenticatedSession, withServerAuth } from "@/lib/serverAuthGuard";
import { fetchSubscriptions } from "@/services/subscriptions.service";
import { getServerSession } from "next-auth";
import { authConfig } from "@/authConfig";
import React from "react";

const isNextRedirectError = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    (error as { digest: string }).digest === "NEXT_REDIRECT";

interface IProps {
    searchParams: {
        search?: string;
        page?: string;
        limit?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function MySubscriptionsWrapper({ searchParams }: IProps) {
    const session = ensureAuthenticatedSession(await getServerSession(authConfig));
    const token = session.user?.token || session.accessToken || "";

    try {
        const subscriptions = await withServerAuth(() =>
            fetchSubscriptions(
                token,
                {
                    search: searchParams.search,
                    page: searchParams.page ? parseInt(searchParams.page) : 1,
                    limit: searchParams.limit ? parseInt(searchParams.limit) : 10,
                },
                {
                    cache: "force-cache",
                    next: {
                        revalidate: 300,
                        tags: [
                            "subscriptions",
                            session.user?.id
                                ? `subscriptions-${session.user.id}`
                                : undefined,
                        ].filter(Boolean) as string[],
                    },
                }
            )
        );

        if (!subscriptions?.success) {
            return <ErrorDisplay message="An error occurred while fetching your subscriptions" />;
        }

        return (
            <div className="container mx-auto px-4 py-6">
                <UserSubscriptionsList
                    subscriptions={subscriptions?.data?.data?.data}
                    statistics={subscriptions?.data?.data?.statistics}
                />
            </div>
        );
    } catch (error) {
        if (isNextRedirectError(error)) throw error;
        return <ErrorDisplay message="An error occurred while fetching your subscriptions" />;
    }
}
