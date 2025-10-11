"use client";

import ProductCard from "../property/PropertyCard";
import { IProperty } from "@/interface/property";
import React from "react";
import TabbedListingView from "../misc/TabbedListingView";
import { useQueryString } from "@/hooks/useQueryString";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProperties } from "@/services/properties.service";
import Spinner from "../misc/Spinner";
import ErrorDisplay from "../misc/ErrorDisplay";

import { IMeta } from "@/interface/general";

const Landlord = ({ token }: { token: string }) => {
  const { getQueryParam, setQueryParam } = useQueryString();
  const [properties, setProperties] = React.useState<IProperty[]>([]);
  const [meta, setMeta] = React.useState<IMeta | undefined>();

  React.useEffect(() => {
    const currentStatus = getQueryParam("status");
    if (!currentStatus) {
      setQueryParam("status", "all");
    }
  }, [getQueryParam, setQueryParam]);

  const status = getQueryParam("status") || "all";
  const search = getQueryParam("search") || "";
  const page = getQueryParam("page") || "1";
  const limit = getQueryParam("limit") || "10";

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["my-properties", status, search, page, limit],
    queryFn: () =>
      fetchMyProperties(token, {
        status: status === "all" ? undefined : status,
        search: search || undefined,
        page: parseInt(page),
        limit: parseInt(limit),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  React.useEffect(() => {
    if (data?.data?.data) {
      setProperties(data.data.data);
      setMeta(data.data.meta);
    }
  }, [data]);

  if (isLoading && !properties.length) {
    return <Spinner fullScreen={false} />;
  }

  if (error && !properties.length) {
    return <ErrorDisplay message="Failed to fetch properties" />;
  }

  return (
    <TabbedListingView
      items={properties}
      title="My Listing"
      tabs={["all", "draft", "published", "rejected", "sold"]}
      tabDescription="View and manage all your property listings including draft, published, rejected, and sold properties."
      emptyStateMessage="You have no listing yet."
      renderItem={(property: IProperty, index: number) => (
        <ProductCard key={index} property={property} />
      )}
      meta={meta}
    />
  );
};

export default Landlord;
