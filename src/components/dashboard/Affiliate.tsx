"use client";

import React from "react";
import ListingTabs from "../listings/ListingTabs";
import { IProperty } from "@/interface/property";
import PropertyCard from "../property/PropertyCard";
import Commission from "../affiliate/Commission";
import { CustomTab } from "../misc/CustomTab";
import { IProduct } from "@/interface/product";
import ProductCard from "../products/ProductCard";
import { cn } from "@/lib/utils";
import EmptyState from "../misc/Empty";

interface Props {
  properties: IProperty[];
  products: IProduct[];
  stats: IAffiliateStats;
}

export interface IAffiliateStats {
  affiliateWallet: {
    id: string;
    balance: string;
    ledgerBalance: string;
    totalBalance: string;
    totalSpent: string;
    meta: null;
    currency: string;
    type: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  noOfSales: string;
}

const Content = ({
  mode,
  ...props
}: { mode: "products" | "properties" } & Props) => {
  const [activeTab, setActiveTab] = React.useState("Open");

  const filteredItems = React.useMemo(() => {
    const items = mode === "products" ? props.products : props.properties;
    return items.filter((item) =>
      activeTab === "Open"
        ? item.availability === "available"
        : item.availability === "sold"
    );
  }, [mode, props.products, props.properties, activeTab]);

  return (
    <div className="bg-white border-[0.6px] border-grey100 rounded-[0.625rem] p-6 mt-6">
      <ListingTabs
        text="These are items that are still available for sale."
        tabs={["Open", "Sold"]}

        // activeTab={activeTab}
        // setActiveTab={setActiveTab}
      />

      {filteredItems.length === 0 ? (
        <EmptyState title={`No ${activeTab.toLowerCase()} items found`} />
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredItems.map((item, index) =>
            mode === "products" ? (
              <ProductCard
                key={`product-${index}`}
                product={item as IProduct}
              />
            ) : (
              <PropertyCard
                key={`property-${index}`}
                property={item as IProperty}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};


const AffiliateHome = (props: Props) => {
  return (
    <div>
      <div className="mb-10">
        <Commission stats={props.stats} />
      </div>

      <div className="flex flex-col">
        <div className="mb-6">
          <h1 className="font-medium text-xl text-black whitespace-nowrap">
            My Shop
          </h1>
          <CustomTab
            defaultValue="properties"
            tabs={[
              {
                value: "properties",
                label: "Properties",
                content: <Content mode="properties" {...props} />,
              },
              {
                value: "products",
                label: "Products",
                content: <Content mode="products" {...props} />,
              },
            ]}
            // tabsTriggerClassName="bg-primary"
            tabsListClassName="w-full "
          />
        </div>
      </div>
    </div>
  );
};

export default AffiliateHome;
