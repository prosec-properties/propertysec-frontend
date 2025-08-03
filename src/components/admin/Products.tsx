"use client";

import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { IProduct } from "@/interface/product";
import ProductCard from "../products/ProductCard";

interface Props {
  products: IProduct[];
}

const AdminProducts = (props: Props) => {
  const [activeTab, setActiveTab] = React.useState("Open");

  return (
    <TabbedListingView
      items={props.products}
      // activeTab={activeTab}
      // setActiveTab={setActiveTab}
      title="Properties"
      titleStyle="solid"
      tabs={["Open", "Closed"]}
      tabDescription="These are products that are still open to buyers."
      emptyStateMessage="You have no listing yet."
      renderItem={(product: IProduct, index: number) => (
        <ProductCard key={index} product={product} />
      )}
    />
  );
};

export default AdminProducts;
