"use client";

import ProductCard from "../property/PropertyCard";
import { IProperty } from "@/interface/property";
import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { useQueryString } from "@/hooks/useQueryString";

import { IMeta } from "@/interface/general";

const Landlord = (props: { properties: IProperty[]; meta?: IMeta }) => {
  const { getQueryParam, setQueryParam } = useQueryString();

  React.useEffect(() => {
    const currentStatus = getQueryParam("status");
    if (!currentStatus) {
      setQueryParam("status", "all");
    }
  }, [getQueryParam, setQueryParam]);

  return (
    <TabbedListingView
      items={props.properties}
      title="My Listing"
      tabs={["all", "draft", "published", "rejected", "sold"]}
      tabDescription="View and manage all your property listings including draft, published, rejected, and sold properties."
      emptyStateMessage="You have no listing yet."
      renderItem={(property: IProperty, index: number) => (
        <ProductCard key={index} property={property} />
      )}
      meta={props.meta}
    />
  );
};

export default Landlord;
