"use client";

import React, { useState } from "react";
import { IUser } from "@/interface/user";
import { IMeta } from "@/interface/general";
import { Stat, StatsWrapper } from "@/components/misc/Stat";
import TabbedListingView from "@/components/misc/TabbedListingView";
import PropertyCard from "@/components/property/PropertyCard";

interface Props {
  buyerId: string;
  initialInspectedProperties: any[];
  initialPurchasedProperties: any[];
  buyer: IUser;
  inspectedMeta?: IMeta;
  purchasedMeta?: IMeta;
  activeTab: string;
}

const BuyerPropertiesList = (props: Props) => {
  const {
    buyerId,
    initialInspectedProperties,
    initialPurchasedProperties,
    buyer,
    inspectedMeta,
    purchasedMeta,
    activeTab
  } = props;

  const [currentTab, setCurrentTab] = useState(activeTab);

  const inspectedItems = initialInspectedProperties.map(item => ({
    ...item.property,
    inspectionDetails: item
  }));

  const purchasedItems = initialPurchasedProperties.map(item => ({
    ...item.property,
    purchaseDetails: item
  }));

  const tabs = [
    {
      key: 'inspected',
      label: 'Inspected Properties',
      items: inspectedItems,
      meta: inspectedMeta,
      emptyMessage: 'This buyer has not paid for any property inspections yet.'
    },
    {
      key: 'purchased',
      label: 'Purchased Properties',
      items: purchasedItems,
      meta: purchasedMeta,
      emptyMessage: 'This buyer has not purchased any properties yet.'
    }
  ];

  const activeTabData = tabs.find(tab => tab.key === currentTab) || tabs[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Properties for {buyer.fullName}</h1>
        <p className="text-gray-600">Buyer: {buyer.fullName} ({buyer.email})</p>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Inspected Properties"
          value={String(inspectedMeta?.total || initialInspectedProperties.length)}
          className="basis-[30%]"
        />
        <Stat
          title="Purchased Properties"
          value={String(purchasedMeta?.total || initialPurchasedProperties.length)}
          className="basis-[30%]"
        />
        <Stat
          title="Current Tab"
          value={activeTabData.label}
          className="basis-[30%]"
        />
      </StatsWrapper>

      <div className="flex space-x-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-4 py-2 rounded-md font-medium ${
              currentTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label} ({tab.items.length})
          </button>
        ))}
      </div>

      <TabbedListingView
        items={activeTabData.items}
        title={activeTabData.label}
        titleStyle="solid"
        tabs={["all"]}
        tabDescription={`Properties ${currentTab} by ${buyer.fullName}`}
        emptyStateMessage={activeTabData.emptyMessage}
        renderItem={(property: any, index: number) => (
          <PropertyCard key={index} property={property} />
        )}
      />
    </div>
  );
};

export default BuyerPropertiesList;