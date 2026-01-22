import { adminGuard } from "@/lib/admin";
import { fetchInspectionPayments } from "@/services/inspection.service";
import { getAuthUserToken } from "@/actions/affiliates";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import InspectionPaymentsList from "@/components/admin/InspectionPaymentsList";
import React from "react";

interface IProps {
    searchParams: {
        status?: string;
        search?: string;
        page?: string;
        limit?: string;
        [key: string]: string | string[] | undefined;
    };
}

export default async function InspectionPaymentsListWrapper({ searchParams }: IProps) {
    await adminGuard();
    const token = await getAuthUserToken();

    try {
        const inspectionPaymentsResponse = await fetchInspectionPayments(
            token,
            {
                status: searchParams.status,
                search: searchParams.search,
                page: searchParams.page ? parseInt(searchParams.page) : undefined,
                limit: searchParams.limit ? parseInt(searchParams.limit) : undefined,
            },
            {
                cache: "force-cache",
                next: { revalidate: 300, tags: ["inspections", "admin-inspections"] },
            }
        );

        if (!inspectionPaymentsResponse?.success) {
            return <ErrorDisplay message="Failed to fetch inspection payments" />;
        }

        const inspectionPayments = Array.isArray(inspectionPaymentsResponse.data)
            ? inspectionPaymentsResponse.data
            : [];

        const statistics = (inspectionPaymentsResponse as unknown as { statistics?: { totalInspections?: number; completedInspections?: number; approvedInspections?: number } }).statistics;

        return (
            <InspectionPaymentsList
                initialInspectionPayments={inspectionPayments}
                totalInspections={statistics?.totalInspections ?? 0}
                completedInspections={statistics?.completedInspections ?? 0}
                approvedInspections={statistics?.approvedInspections ?? 0}
            />
        );
    } catch (error) {
        console.error("Error fetching inspection payments:", error);
        return (
            <ErrorDisplay message="An error occurred while fetching inspection payments" />
        );
    }
}
