import { adminGuard } from "@/lib/admin";
import { fetchInspectionPayments } from "@/services/inspection.service";
import { getAuthUserToken } from "@/actions/affiliates";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import InspectionPaymentsList from "@/components/admin/InspectionPaymentsList";
import React from "react";

type ISearchParams = Promise<{
  status?: string;
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  await adminGuard();
  const token = await getAuthUserToken();

  try {
    const inspectionPaymentsResponse = await fetchInspectionPayments(
      token,
      {
        status: queries.status,
        search: queries.search,
        page: queries.page ? parseInt(queries.page) : undefined,
        limit: queries.limit ? parseInt(queries.limit) : undefined,
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

    const statistics = (inspectionPaymentsResponse as any).statistics;

    return (
      <div>
        <InspectionPaymentsList
          initialInspectionPayments={inspectionPayments}
          totalInspections={statistics.totalInspections || 0}
          completedInspections={statistics.completedInspections || 0}
          approvedInspections={statistics.approvedInspections || 0}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching inspection payments:", error);
    return (
      <ErrorDisplay message="An error occurred while fetching inspection payments" />
    );
  }
};

export default Page;
