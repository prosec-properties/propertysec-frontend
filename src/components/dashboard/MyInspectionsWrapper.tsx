import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MyInspections from "@/components/dashboard/MyInspections";
import { ensureAuthenticatedSession, withServerAuth } from "@/lib/serverAuthGuard";
import { fetchMyInspectedProperties } from "@/services/user.service";
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
    (error as { digest: string }).digest === "NEXT_REDIRECT";

interface IProps {
    searchParams: {
        page?: string;
        per_page?: string;
        sort_by?: string;
        order?: string;
        [key: string]: string | string[] | undefined;
    };
}

const getParamValue = (param?: string | string[]): string | undefined => {
    if (Array.isArray(param)) {
        return param[0];
    }
    return param;
};

export default async function MyInspectionsWrapper({ searchParams }: IProps) {
    const session = ensureAuthenticatedSession(await getServerSession(authConfig));
    const token = session.user?.token || session.accessToken || "";

    if (session.user.role === USER_ROLE.ADMIN) {
        redirect(SIGN_IN_ROUTE);
    }

    try {
        const page = getParamValue(searchParams.page) ?? "1";
        const per_page = getParamValue(searchParams.per_page) ?? "20";
        const sort_by = getParamValue(searchParams.sort_by) ?? "created_at";
        const order = getParamValue(searchParams.order) ?? "desc";

        const response = await withServerAuth(() =>
            fetchMyInspectedProperties(
                token,
                {
                    page,
                    per_page,
                    sort_by,
                    order,
                },
                {
                    cache: "force-cache",
                    next: {
                        revalidate: 300,
                        tags: [
                            "my-inspections",
                            session.user?.id
                                ? `my-inspections-${session.user.id}`
                                : undefined,
                        ].filter(Boolean) as string[],
                    },
                }
            )
        );

        const inspections = response?.data?.inspections ?? [];
        const meta = response?.data?.meta;

        return <MyInspections inspections={inspections} meta={meta} />;
    } catch (error) {
        if (isNextRedirectError(error)) throw error;
        return <ErrorDisplay message="Failed to fetch inspection payments" />;
    }
}
