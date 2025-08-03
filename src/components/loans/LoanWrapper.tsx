"use client";

import React, { useEffect, useState, useMemo } from "react";
import LoanStats from "./LoanStats";
import LoanHeader from "./LoanHeader";
import LoanTable from "./LoanTable";
import { useSession } from "next-auth/react";
import { getUserLoans, IUserLoansResponse } from "@/services/loan.service";
import { ILoan } from "@/interface/loan";

const LoanWrapper = () => {
  const { data: session } = useSession();
  const [loansData, setLoansData] = useState<IUserLoansResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!session?.user?.token) return;
      
      try {
        setLoading(true);
        const response = await getUserLoans(session.user.token);
        if (response?.success) {
          setLoansData(response.data);
        } else {
          setError("Failed to fetch loans");
        }
      } catch (err) {
        setError("An error occurred while fetching loans");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, [session?.user?.token]);

  // Filter loans based on selected filter
  const filteredLoans = useMemo(() => {
    if (!loansData?.loans?.data) return [];
    
    if (activeFilter === "all") {
      return loansData.loans.data;
    }
    
    return loansData.loans.data.filter(loan => loan.loanStatus === activeFilter);
  }, [loansData?.loans?.data, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <LoanHeader onFilterChange={handleFilterChange} activeFilter={activeFilter} />
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <LoanHeader onFilterChange={handleFilterChange} activeFilter={activeFilter} />
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <LoanHeader onFilterChange={handleFilterChange} activeFilter={activeFilter} />
      </div>
      <div className="mb-6">
        <LoanStats stats={loansData?.stats} />
      </div>

      <div>
        <h1 className="text-2xl font-medium mb-6">
          {activeFilter === "all" ? "Loan Activity" : 
           activeFilter === "pending" ? "Loan Requests" :
           activeFilter === "approved" ? "Active Loans" :
           activeFilter === "disbursed" ? "Disbursed Loans" : "Loan Activity"}
        </h1>
        <LoanTable loans={filteredLoans} />
      </div>
    </div>
  );
};

export default LoanWrapper;



