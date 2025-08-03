import React from "react";
import PropertyCategoryCard from "./PropertyCategoryCard";
import { PROPERTIES_ROUTE } from "@/constants/routes";

const images = {
  product:
    "https://res.cloudinary.com/dmxltdk64/image/upload/v1726918429/property-sec/bg2-mobile_q1lt7h.png",
  buy: "https://res.cloudinary.com/dmxltdk64/image/upload/v1726918429/property-sec/bg2-mobile_q1lt7h.png",
  rent: "https://res.cloudinary.com/dmxltdk64/image/upload/v1726918431/property-sec/bg-mobile_iadyb9.png",
};

interface Props {
  queries: {
    category?: string;
  };
}

const BuyerHome = (props: Props) => {
  return (
    <div>
      <h1 className="font-medium text-xl mb-6 text-center">PROPERTIES</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <PropertyCategoryCard
          imageSrc={images.buy}
          title="BUY"
          className=""
          href={`${PROPERTIES_ROUTE}?category=buy`}
        />
        <PropertyCategoryCard
          imageSrc={images.rent}
          title="RENT"
          href={`${PROPERTIES_ROUTE}?category=rent`}
        />
      </div>
    </div>
  );
};

export default BuyerHome;
