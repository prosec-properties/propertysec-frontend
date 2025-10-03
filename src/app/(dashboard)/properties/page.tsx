import ErrorDisplay from "@/components/misc/ErrorDisplay";
import AllProperties from "@/components/property/AllProperties";
import { ICountry } from "@/interface/location";
import { ICategory } from "@/interface/category";
import { fetchCategories } from "@/services/categories.service";
import { fetchAllProperties } from "@/services/properties.service";
import { Metadata } from "next";
import React from "react";
import { fetchACountry } from "@/services/location.service";

export const metadata: Metadata = {
  title: "Properties",
};

type ISearchParams = Promise<{
  categories?: string;
  locations?: string;
  pricing?: string;
  search?: string;
  [key: string]: string | string[] | undefined;
}>;

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;

  const filterParams = {
    categories: queries?.categories,
    locations: queries?.locations,
    pricing: queries?.pricing,
    search: queries?.search,
  };

  const [properties, country, categories] = await Promise.all([
    fetchAllProperties(filterParams),
    fetchACountry("161"),
    fetchCategories("property"),
  ]);

  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch listings" />;
  }

  return (
    <AllProperties
      properties={properties?.data?.data}
      country={country?.data as ICountry}
      categories={categories?.data as ICategory[]}
    />
  );
}

export default Page;
