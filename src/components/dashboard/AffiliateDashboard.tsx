"use client";

import ProductCard from "../property/PropertyCard";
import { IProperty } from "@/interface/property";
import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { useQueryString } from "@/hooks/useQueryString";
import { useQuery } from "@tanstack/react-query";
import { fetchAffiliateShop } from "@/services/affiliate.service";
import { useUser } from "@/hooks/useUser";
import EmptyState from "../misc/Empty";

const AffiliateDashboard = () => {
  const { getQueryParam, setQueryParam } = useQueryString();
  const { user } = useUser();

  React.useEffect(() => {
    const currentAvailability = getQueryParam("availability");
    if (!currentAvailability) {
      setQueryParam("availability", "available");
    }
  }, [getQueryParam, setQueryParam]);

  const {
    data: affiliateShop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["affiliate-shop"],
    queryFn: () => fetchAffiliateShop(user?.token || ""),
    enabled: !!user?.token,
  });

  const filteredProperties = React.useMemo(() => {
    if (!affiliateShop?.data?.properties) return [];

    const availability = getQueryParam("availability") || "available";
    if (availability === "all") {
      return affiliateShop.data.properties;
    }
    return affiliateShop.data.properties.filter(
      (property) => property.availability === availability
    );
  }, [affiliateShop?.data?.properties, getQueryParam]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your shop...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState message="Unable to fetch your properties. Please try again later." />
    );
  }

  return (
    <TabbedListingView
      items={filteredProperties}
      title="My Shop"
      tabs={["available", "sold"]}
      tabDescription="View and manage properties in your affiliate shop."
      emptyStateMessage="You have no properties in your shop yet."
      paramName="availability"
      renderItem={(property: IProperty, index: number) => (
        <ProductCard key={index} property={property} />
      )}
    />
  );
};

export default AffiliateDashboard;
