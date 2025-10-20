import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { ICountry } from "@/interface/location";
import { ICategory } from "@/interface/category";
import { fetchCategories } from "@/services/categories.service";
import { fetchAllProperties } from "@/services/properties.service";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { fetchACountry } from "@/services/location.service";
import Spinner from "@/components/misc/Spinner";
import AllProperties from "@/components/property/AllProperties";


export const metadata: Metadata = {
  title: "Properties",
};

type ISearchParams = Promise<{
  categories?: string;
  locations?: string;
  pricing?: string;
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;

  const filterParams = {
    categories: queries?.categories,
    locations: queries?.locations,
    pricing: queries?.pricing,
    search: queries?.search,
    page: queries?.page ? parseInt(queries.page) : 1,
    limit: queries?.limit ? parseInt(queries.limit) : 20,
  };

  const [properties, country, categories] = await Promise.all([
    fetchAllProperties(filterParams, {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["properties"] },
    }),
    fetchACountry("161"),
    fetchCategories("property"),
  ]);

  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch listings" />;
  }

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading properties..." />}>
      <AllProperties
        properties={properties?.data?.data}
        country={country?.data as ICountry}
        categories={categories?.data as ICategory[]}
        meta={properties?.data?.meta}
      />
    </Suspense>
  );
}

export default Page;
