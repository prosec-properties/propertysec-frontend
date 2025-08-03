import React from "react";
import { IAffiliateStats } from "../dashboard/Affiliate";
import { formatPrice } from "@/lib/payment";

const Commission = ({ stats }: { stats: IAffiliateStats }) => {
  return (
    <div className="rounded-[0.625rem] bg-white text-white p-6 font-medium">
      <h1 className="font-medium text-2xl mb-6 text-black">Commission</h1>
      <div className="bg-grey9 rounded-[0.625rem] px-6 py-10 md:flex items-center flex-col md:flex-row gap-6">
        <article className="md:basis-[48%] mb-6 md:mb-0">
          <p className="text-lg mb-6">Total Number of Sales</p>
          <p className="text-2xl">{stats.noOfSales || 0}</p>
        </article>
        <article className="justify-self-start md:basis-[48%]">
          <p className="text-lg mb-6">Total Commission</p>
          <p className="text-2xl">
            {formatPrice(stats.affiliateWallet.balance) || 0}
          </p>
        </article>
      </div>
    </div>
  );
};

export default Commission;
