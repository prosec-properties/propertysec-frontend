"use client";

import React from "react";
import { IProperty, IPropertyInspection } from "@/interface/property";
import InspectionCard from "../property/InspectionCard";
import { IMeta } from "@/interface/general";
import EmptyState from "../misc/Empty";
import CustomPagination from "../misc/CustomPagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchMyInspectedProperties } from "@/services/user.service";
import ErrorDisplay from "../misc/ErrorDisplay";
import Spinner from "../misc/Spinner";

interface Props {
  token: string;
}

const MyInspections = ({ token }: Props) => {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-inspections", searchParamsHook.toString()],
    queryFn: async () => {
      const page = searchParamsHook.get("page") || "1";
      const per_page = searchParamsHook.get("per_page") || "20";
      const sort_by = searchParamsHook.get("sort_by") || "created_at";
      const order = searchParamsHook.get("order") || "desc";
      return fetchMyInspectedProperties(token, {
        page,
        per_page,
        sort_by,
        order,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (isLoading) {
    return <Spinner fullScreen={false} />;
  }

  if (error) {
    return <ErrorDisplay message="Failed to fetch inspection payments" />;
  }

  const inspections = data?.data?.inspections || [];
  const meta = data?.data?.meta;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Inspection Payments</h1>

      {inspections.length === 0 ? (
        <EmptyState title="No inspection payments found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}

      {inspections.length > 0 && meta && meta.lastPage > 1 && (
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
