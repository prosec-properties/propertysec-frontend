import { fetchInspectionPaymentById } from "@/services/inspection.service";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import InspectionDetails from "@/components/admin/InspectionDetails";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/../auth.config";
import { adminGuard } from "@/lib/admin";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const InspectionDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession(authConfig);
  const token = session?.accessToken;
  await adminGuard();

  if (!session || !token) {
    redirect("/");
  }

  try {
    const { id } = await params;

    const inspectionResponse = await fetchInspectionPaymentById(token, id);

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
