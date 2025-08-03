//MultipleProducts

import { IProduct } from "@/interface/product";
import { isNotAnEmptyArray } from "@/lib/general";
import React from "react";
import ProductCard from "./ProductCard";
import EmptyState from "../misc/Empty";

interface Props {
  products: IProduct[];
}

const MultipleProducts = (props: Props) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 bg-white p-6 border-[0.6px] rounded-[0.625rem] border-grey100">
      {isNotAnEmptyArray(props.products) ? (
        props.products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
      ) : (
        <EmptyState message="No Products found" />
      )}
    </div>
  );
};

export default MultipleProducts;
