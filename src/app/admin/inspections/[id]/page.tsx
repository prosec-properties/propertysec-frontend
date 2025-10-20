import { fetchInspectionPaymentById } from "@/services/inspection.service";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import InspectionDetails from "@/components/admin/InspectionDetails";
import { notFound } from "next/navigation";
import { adminGuard } from "@/lib/admin";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const InspectionDetailsPage = async ({ params }: Props) => {
  const { token } = await adminGuard();

  try {
    const { id } = await params;

    const inspectionResponse = await fetchInspectionPaymentById(
      token,
      id,
      {
        cache: "force-cache",
        next: {
          revalidate: 300,
          tags: [
            "inspections",
            "admin-inspections",
            `inspection-${id}`,
          ],
        },
      }
    );

    if (!inspectionResponse?.success || !inspectionResponse.data) {
      notFound();
    }

    const inspection = inspectionResponse.data;

    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <InspectionDetails inspection={inspection} token={token} />
      </div>
    );
  } catch (err) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <ErrorDisplay message="An error occurred while fetching inspection details" />
      </div>
    );
  }
};

export default InspectionDetailsPage;
