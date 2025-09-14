import { adminGuard } from "@/lib/admin";
import { fetchInspectionPaymentById } from "@/services/inspection.service";
import { getAuthUserToken } from "@/actions/affiliates";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import InspectionDetails from "@/components/admin/InspectionDetails";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const InspectionDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  await adminGuard();
  const token = await getAuthUserToken();

  try {
    const inspectionResponse = await fetchInspectionPaymentById(token, id);

    if (!inspectionResponse?.success || !inspectionResponse.data) {
      notFound();
    }

    const inspection = inspectionResponse.data;

    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <InspectionDetails inspection={inspection} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching inspection details:", error);
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <ErrorDisplay message="An error occurred while fetching inspection details" />
      </div>
    );
  }
};

export default InspectionDetailsPage;
