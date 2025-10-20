"use client";

import ProductCard from "../property/PropertyCard";
import { IProperty } from "@/interface/property";
import TabbedListingView from "../misc/TabbedListingView";
import { IMeta } from "@/interface/general";

interface Props {
  properties: IProperty[];
  meta?: IMeta;
}
const Landlord = ({ properties, meta }: Props) => {
  return (
    <TabbedListingView
      items={properties}
      title="My Listing"
      tabs={["all", "draft", "published", "rejected", "sold"]}
      tabDescription="View and manage all your property listings including draft, published, rejected, and sold properties."
      emptyStateMessage="You have no listing yet."
      renderItem={(property: IProperty, index: number) => (
        <ProductCard key={index} property={property} />
      )}
      meta={meta}
    />
  );
};

export default Landlord;
