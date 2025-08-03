"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  isActiveTab: string;
}

const SubscriptionsTabsList = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "1";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);

    router.push(`${pathname}?${params.toString()}`);
  };

  const variant = {
    active:
      "border-primary bg-primary text-white border-solid hover:bg-blue400 active:bg-blue400 disabled:bg-blue200 disabled:border-blue200 border",
    inactive:
      "border border-primary border-solid text-primary bg-white hover:bg-blue400 hover:text-white active:bg-blue400 disabled:bg-blue200 disabled:border-blue200",
    constant: "h-10 px-2 sm:px-4 py-2 cursor-pointer whitespace-nowrap",
  };

  const isActiveTab = (tab: string) => {
    return tab === activeTab ? variant.active : variant.inactive;
  };

  return (
    <div className="flex justify-center w-full max-w-[300px] sm:max-w-md mx-auto">
      <div
        className={`${isActiveTab("1")} ${
          variant.constant
        } rounded-l-[0.3125rem] text-xs sm:text-base flex-1 text-center`}
        onClick={() => handleTabChange("1")}
        role="button"
      >
        1 month
      </div>
      <div
        className={`${isActiveTab("3")} ${variant.constant} text-xs sm:text-base flex-1 text-center`}
        onClick={() => handleTabChange("3")}
        role="button"
      >
        3 months
      </div>
      <div
        className={`${isActiveTab("6")} ${
          variant.constant
        } rounded-r-[0.3125rem] text-xs sm:text-base flex-1 text-center`}
        onClick={() => handleTabChange("6")}
        role="button"
      >
        6 months
      </div>
    </div>
  );
};

export default SubscriptionsTabsList;
