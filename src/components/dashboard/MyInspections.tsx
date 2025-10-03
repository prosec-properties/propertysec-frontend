"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import InspectionCard from "../property/InspectionCard";
import { IMeta } from "@/interface/general";
import EmptyState from "../misc/Empty";
import CustomPagination from "../misc/CustomPagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Inspection {
  id: string;
  inspectionAmount: number;
  inspectionStatus: "PENDING" | "COMPLETED";
  approvalStatus?: "approved" | "pending" | "rejected";
  inspectionReport: string;
  userId: string;
  propertyId: string;
  name: string;
  email: string;
  phoneNumber: string;
  inspectionDate: string;
  createdAt: string;
  updatedAt: string;
  property: IProperty & {
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

interface Props {
  inspections: Inspection[];
  meta: IMeta;
}

const MyInspections = ({ inspections, meta }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Inspected Properties</h1>

      {inspections.length === 0 ? (
        <EmptyState title="No inspected properties found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}

      {inspections.length > 0 && meta.lastPage > 1 && (
        <CustomPagination
          currentPage={meta.currentPage}
          totalPages={meta.lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MyInspections;
