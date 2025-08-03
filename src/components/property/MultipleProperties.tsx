import { IProperty } from "@/interface/property";
import React from "react";
import PropertyCard from "./PropertyCard";
import EmptyState from "../misc/Empty";
import { isNotAnEmptyArray } from "@/lib/general";

interface Props {
  properties: IProperty[];
}
const MultipleProperties = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 bg-white p-6 border-[0.6px] rounded-[0.625rem] border-grey100">
      {isNotAnEmptyArray(props.properties) ? (
        props.properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))
      ) : (
        <EmptyState message="No Listings found" />
      )}
    </div>
  );
};

export default MultipleProperties;
