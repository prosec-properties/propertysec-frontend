"use client";

import React, { useState } from "react";
import SearchProperties from "./SearchProperties";
import FilterProperty from "./FilterProperty";
import { IProperty } from "@/interface/property";
import { ICountry } from "@/interface/location";
import { ICategory } from "@/interface/category";
import MultipleProperties from "./MultipleProperties";

interface Props {
  properties: IProperty[];
  country: ICountry;
  categories: ICategory[];
}
const AllProperties = (props: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="md:flex md:gap-4 h-screen overflow-hidden">
      <FilterProperty
        country={props.country}
        categories={props.categories}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        wrapperClass="overflow-y-auto"
      />

      <div className="md:flex-1 overflow-y-auto h-full">
        {/* shown on desktop */}
        <div className="mb-10 hidden md:block">
          <SearchProperties
            title="Search Properties"
            placeholder="Search Properties"
          />
        </div>

        {/* shown on mobile */}
        <div className="mb-10 md:hidden">
          <SearchProperties
            showFilterIconOnMobile
            title="Search Properties"
            placeholder="Search Properties"
            onFilterClick={() => setIsFilterOpen(true)}
          />
        </div>

        <div>
          <MultipleProperties properties={props.properties} />
        </div>
      </div>
    </div>
  );
};

export default AllProperties;
