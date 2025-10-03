"use client";

import React from "react";
import { IProperty } from "@/interface/property";
import PurchaseCard from "../property/PurchaseCard";
import EmptyState from "../misc/Empty";
import { IMeta } from "@/interface/general";
import CustomPagination from "../misc/CustomPagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Purchase {
  id: string;
  purchaseAmount: number;
  currency: string;
  purchaseStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
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
  meta: IMeta;
}

const MyPurchases = ({ purchases, meta }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Purchased Properties</h1>

      {purchases.length === 0 ? (
        <EmptyState message="You have not purchased any properties yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}

      {purchases.length > 0 && meta.lastPage > 1 && (
        <CustomPagination
          currentPage={meta.currentPage}
          totalPages={meta.lastPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MyPurchases;
