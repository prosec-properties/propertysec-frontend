"use client";

import React, { useState } from "react";
import CustomButton from "../buttons/CustomButton";

interface Props {
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

const LoanHeader = ({ onFilterChange, activeFilter = "all" }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState(activeFilter);

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex justify-between bg-white rounded-[0.3125rem] py-3 px-6 flex-wrap">
      <h1 className="text-black text-2xl font-medium">Loans</h1>

      <article className="flex justify-end gap-4">
        <CustomButton 
          variant={selectedFilter === "pending" ? "default" : "secondary"}
          onClick={() => handleFilterClick("pending")}
        >
          Loan Requests
        </CustomButton>
        <CustomButton 
          variant={selectedFilter === "approved" ? "default" : "secondary"}
          onClick={() => handleFilterClick("approved")}
        >
          Active Loans
        </CustomButton>
        <CustomButton 
          variant={selectedFilter === "disbursed" ? "default" : "secondary"}
          onClick={() => handleFilterClick("disbursed")}
        >
          Disbursed Loans
        </CustomButton>
        <CustomButton 
          variant={selectedFilter === "overdue" ? "default" : "secondary"}
          onClick={() => handleFilterClick("overdue")}
        >
          Due Loans
        </CustomButton>
        <CustomButton 
          variant={selectedFilter === "all" ? "default" : "secondary"}
          onClick={() => handleFilterClick("all")}
        >
          All Loans
        </CustomButton>
      </article>
    </div>
  );
};

export default LoanHeader;
