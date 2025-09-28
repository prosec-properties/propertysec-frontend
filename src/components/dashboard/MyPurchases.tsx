"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import PurchaseCard from "../property/PurchaseCard";

interface Purchase {
  id: string;
  purchaseAmount: number;
  currency: string;
  purchaseStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  transactionReference: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
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
  purchases: Purchase[];
  meta: any;
}

const MyPurchases = ({ purchases, meta }: Props) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Purchased Properties</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No purchased properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}

      {/* Pagination can be added here if needed */}
    </div>
  );
};

export default MyPurchases;