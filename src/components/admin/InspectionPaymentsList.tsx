"use client";

import React, { useState, useEffect, useMemo } from "react";
import TableSearch from "../tables/TableSearch";
import CustomTable from "../tables/CustomTable";
import { formatDate } from "@/lib/date";
import { useRouter, useSearchParams } from "next/navigation";
import { Stat, StatsWrapper } from "../misc/Stat";
import { cn } from "@/lib/utils";
import { InspectionPaymentDetail } from "@/services/inspection.service";
import { useLocalSearchParams } from "@/hooks/useLocalSearchParams";
import { formatPrice } from "@/lib/payment";

interface Props {
  initialInspectionPayments?: InspectionPaymentDetail[];
  totalInspections: number;
  completedInspections: number;
  approvedInspections: number;
}

const InspectionPaymentsList = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [activeTab, setActiveTab] = useState("");
  const { setSearchParams } = useLocalSearchParams();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [searchParams, searchTerm]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams("status", tab);
  };


  const tableData = useMemo(
    () =>
      props.initialInspectionPayments?.map((payment) => ({
        id: payment.id,
        user: payment.user?.fullName || payment.name || "-",
        email: payment.user?.email || payment.email || "-",
        phone: payment.user?.phoneNumber || payment.phoneNumber || "-",
        property: payment.property?.title || "-",
        address: payment.property?.address || "-",
        amount: formatPrice(payment.inspectionAmount),
        createdAt: formatDate(payment.createdAt),
        inspectionStatus: (
          <p
            className={cn("capitalize w-fit px-3 py-2 rounded-[3px]", {
              ["bg-successLight text-success"]:
                payment.inspectionStatus === "COMPLETED",
              ["bg-warningLight text-warning"]:
                payment.inspectionStatus === "PENDING",
            })}
          >
            {payment.status.toLowerCase()}
          </p>
        ),
      })) || [],
    [props.initialInspectionPayments]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <p>Property Inspection Payments</p>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Inspections"
          value={String(props.totalInspections)}
          className="basis-[30%]"
        />
        <Stat
          title="Completed Inspections"
          value={String(props.completedInspections)}
          className="basis-[30%]"
        />
      </StatsWrapper>

      <div className="flex flex-wrap space-x-2 mb-4">
        <button
          onClick={() => handleTabChange("")}
          className={cn(
            "px-4 py-2 rounded-md mb-2",
            activeTab === ""
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          )}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange("pending")}
          className={cn(
            "px-4 py-2 rounded-md mb-2",
            activeTab === "pending"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          )}
        >
          Pending
        </button>
        <button
          onClick={() => handleTabChange("completed")}
          className={cn(
            "px-4 py-2 rounded-md mb-2",
            activeTab === "completed"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700"
          )}
        >
          Paid
        </button>
      </div>

      <TableSearch
        title="Inspection Payments"
        placeholder="Search by user, property, email... Click on any row to view details"
        onSearch={handleSearch}
      />

      <CustomTable
        tableData={tableData}
        hiddenColumns={["id"]}
        isClickable
        onRowClick={(item) => {
          router.push(`/admin/inspections/${item.id}`);
        }}
      />
    </div>
  );
};

export default InspectionPaymentsList;
