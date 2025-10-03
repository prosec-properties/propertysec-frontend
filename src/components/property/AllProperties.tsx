"use client";

import React, { useState } from "react";
import SearchProperties from "./SearchProperties";
import FilterProperty from "./FilterProperty";
import { IProperty } from "@/interface/property";
import { ICountry } from "@/interface/location";
import { ICategory } from "@/interface/category";
import MultipleProperties from "./MultipleProperties";
import { IMeta } from "@/interface/general";
import CustomPagination from "../misc/CustomPagination";
import { useQueryString } from "@/hooks/useQueryString";

interface Props {
  properties: IProperty[];
  country: ICountry;
  categories: ICategory[];
  meta?: IMeta;
}
const AllProperties = (props: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { setQueryParam } = useQueryString();

  const handlePageChange = (page: number) => {
    setQueryParam("page", page.toString());
  };

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
        {props.meta && props.meta.lastPage > 1 && (
          <div className="mt-6">
            <CustomPagination
              currentPage={props.meta.currentPage}
              totalPages={props.meta.lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProperties;
