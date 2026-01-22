import EmptyState from "@/components/misc/Empty";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MyPurchases from "@/components/dashboard/MyPurchases";
import { ensureAuthenticatedSession, withServerAuth } from "@/lib/serverAuthGuard";
import { fetchMyPurchasedProperties } from "@/services/user.service";
import { getServerSession } from "next-auth";
import { authConfig } from "@/authConfig";
import { USER_ROLE } from "@/constants/user";
import { redirect } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import React from "react";

const isNextRedirectError = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).digest === "NEXT_REDIRECT";

interface IProps {
    searchParams: {
        page?: string;
        per_page?: string;
        sort_by?: string;
        order?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function MyPurchasesWrapper({ searchParams }: IProps) {
    const session = ensureAuthenticatedSession(await getServerSession(authConfig));
    const token = session.user?.token || session.accessToken || "";

    if (session.user.role !== USER_ROLE.BUYER) {
        redirect(SIGN_IN_ROUTE);
    }

    const user = session.user;

    try {
        const purchases = await withServerAuth(() =>
            fetchMyPurchasedProperties(
                token,
                {
                    page: searchParams?.page || "1",
                    per_page: searchParams?.per_page || "20",
                    sort_by: searchParams?.sort_by || "created_at",
                    order: searchParams?.order || "desc",
                },
                {
                    cache: "force-cache",
                    next: {
                        revalidate: 300,
                        tags: [
                            "my-purchases",
                            user?.id ? `my-purchases-${user.id}` : undefined,
                        ].filter(Boolean) as string[],
                    },
                }
            )
        );

        if (!purchases?.success) {
            return <ErrorDisplay message="Failed to fetch purchased properties" />;
        }

        if (!purchases.data?.purchases?.length) {
            return <EmptyState title="No purchased properties found" />;
        }

        return (
            <MyPurchases
                purchases={purchases.data.purchases}
                meta={purchases.data.meta}
            />
        );
    } catch (error) {
        if (isNextRedirectError(error)) throw error;
        return <ErrorDisplay message="Failed to fetch purchased properties" />;
    }
}
