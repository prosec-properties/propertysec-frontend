import ErrorDisplay from "@/components/misc/ErrorDisplay";
import CustomButton from "@/components/buttons/CustomButton";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 text-center">
      <ErrorDisplay message="Inspection not found" />
      <div className="mt-4 sm:mt-6">
        <Link href="/admin/inspections">
          <CustomButton variant="primary" className="w-full sm:w-auto">
            Back to Inspections
          </CustomButton>
        </Link>
      </div>
    </div>
  );
}
