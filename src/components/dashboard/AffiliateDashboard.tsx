"use client";

import ProductCard from "../property/PropertyCard";
import { IProperty } from "@/interface/property";
import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { useQueryString } from "@/hooks/useQueryString";

const AffiliateDashboard = (props: { properties: IProperty[] }) => {
  const { getQueryParam, setQueryParam } = useQueryString();

  React.useEffect(() => {
    const currentAvailability = getQueryParam("availability");
    if (!currentAvailability) {
      setQueryParam("availability", "available");
    }
  }, [getQueryParam, setQueryParam]);

  // Filter properties based on availability
  const filteredProperties = React.useMemo(() => {
    const availability = getQueryParam("availability") || "available";
    if (availability === "all") {
      return props.properties;
    }
    return props.properties.filter(property => property.availability === availability);
  }, [props.properties, getQueryParam]);

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