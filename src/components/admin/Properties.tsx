"use client";

import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { IProperty } from "@/interface/property";
import PropertyCard from "../property/PropertyCard";
import { useQueryString } from "@/hooks/useQueryString";

interface Props {
  properties: IProperty[];
}

const AdminProperties = (props: Props) => {
  const { getQueryParam, setQueryParam } = useQueryString();

  React.useEffect(() => {
    const currentStatus = getQueryParam("status");
    if (!currentStatus) {
      setQueryParam("status", "draft");
    }
  }, [getQueryParam, setQueryParam]);

  return (
    <TabbedListingView
      items={props.properties}
      title="Properties"
      titleStyle="solid"
      tabs={["draft", "published", "closed", "rejected"]}
      tabDescription="These are properties under review waiting to be published."
      emptyStateMessage="You have no listing yet."
      renderItem={(property: IProperty, index: number) => (
        <PropertyCard key={index} property={property} />
      )}
    />
  );
};

export default AdminProperties;
