// ListingTabs.tsx (modified)
"use client";

import { useQueryString } from "@/hooks/useQueryString";
import { cn } from "@/lib/utils";
import { startCase } from "lodash";
import React from "react";

interface Props {
  text: string;
  tabs: string[];
}

const ListingTabs = ({ text, tabs }: Props) => {
  const { getQueryParam, setQueryParam } = useQueryString();

  const param = getQueryParam("status");

  return (
    <div className="text-grey6 text-lg font-medium">
      <div className="border-b-[0.6px] border-grey100 pb-4 flex gap-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={cn({ "text-grey8": tab === param })}
            onClick={() => {
              setQueryParam("status", tab);
            }}
          >
            {startCase(tab)}
          </button>
        ))}
      </div>
      <p className="text-grey8 py-6">{text}</p>
    </div>
  );
};

export default ListingTabs;
