"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import InspectionCard from "../property/InspectionCard";

interface Inspection {
  id: string;
  inspectionAmount: number;
  inspectionStatus: 'PENDING' | 'COMPLETED';
  approvalStatus?: 'approved' | 'pending' | 'rejected';
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
  meta: any;
}

const MyInspections = ({ inspections, meta }: Props) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Inspected Properties</h1>

      {inspections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No inspected properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}

      {/* Pagination can be added here if needed */}
    </div>
  );
};

export default MyInspections;