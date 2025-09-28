"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import { IUser } from "@/interface/user";
import { IMeta } from "@/interface/general";
import PropertyCard from "@/components/property/PropertyCard";
import { Stat, StatsWrapper } from "@/components/misc/Stat";
import TabbedListingView from "@/components/misc/TabbedListingView";

interface Props {
  initialProperties: IProperty[];
  affiliate: IUser;
  meta?: IMeta;
}

const AffiliatePropertiesList = (props: Props) => {
  const { initialProperties, affiliate, meta } = props;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Properties in {affiliate.fullName}&apos;s Shop</h1>
        <p className="text-gray-600">Affiliate: {affiliate.fullName} ({affiliate.email})</p>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Properties"
          value={String(meta?.total || initialProperties.length)}
          className="basis-[45%]"
        />
        <Stat
          title="Current Page"
          value={`${meta?.currentPage || 1} of ${meta?.lastPage || 1}`}
          className="basis-[45%]"
        />
      </StatsWrapper>

      <TabbedListingView
        items={initialProperties}
        title="Shop Properties"
        titleStyle="solid"
        tabs={["all"]}
        tabDescription={`Properties available in ${affiliate.fullName}'s shop`}
        emptyStateMessage="This affiliate has no properties in their shop yet."
        renderItem={(property: IProperty, index: number) => (
          <PropertyCard key={index} property={property} />
        )}
      />
    </div>
  );
};

export default AffiliatePropertiesList;