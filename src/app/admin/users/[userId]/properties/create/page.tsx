import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchACountry, fetchCountries } from "@/services/location.service";
import { fetchCategories } from "@/services/categories.service";
import React from "react";
import PropertyForm from "@/components/forms/PropertyForm";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";

type PageProps = {
  params: Promise<{ userId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const { user } = await adminGuard();

  const [countriesResponse, categoriesResponse] = await Promise.all([
    fetchACountry(NIGERIAN_COUNTRY_ID),
    fetchCategories("property"),
  ]);

  if (!countriesResponse?.success || !categoriesResponse?.success) {
    return <ErrorDisplay message="Failed to load form data" />;
  }

  const countries = countriesResponse.data;
  const categories = categoriesResponse.data;



  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Property for User</h1>
        <p className="text-gray-600">Creating a new property listing</p>
      </div>

      <PropertyForm
        country={countries}
        categories={categories}
        adminMode={true}
        targetUserId={userId}
      />
    </div>
  );
};

export default Page;
