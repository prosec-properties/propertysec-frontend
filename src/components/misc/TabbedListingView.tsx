import React from "react";
import ListingTabs from "../listings/ListingTabs";
import { isNotAnEmptyArray } from "@/lib/general";
import EmptyState from "../misc/Empty";
import TopHeading from "./TopHeading";
import { cn } from "@/lib/utils";
import CustomPagination from "./CustomPagination";
import { useQueryString } from "@/hooks/useQueryString";
import { IMeta } from "@/interface/general";

interface Props<T> {
  items: T[];
  title: string;
  tabs: string[];
  tabDescription: string;
  emptyStateMessage: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  titleStyle?: "solid" | "outline";
  titleClassName?: string;
  paramName?: string;
  meta?: IMeta;
}

const TabbedListingView = <T,>({
  items,
  title,
  tabs,
  tabDescription,
  emptyStateMessage,
  titleStyle = "outline",
  titleClassName,
  paramName,
  renderItem,
  meta,
}: Props<T>) => {
  const { setQueryParam } = useQueryString();

  const handlePageChange = (page: number) => {
    setQueryParam("page", page.toString());
  };

  return (
    <div>
      {titleStyle === "solid" ? (
        <TopHeading title={title} className={cn("mb-6", titleClassName)} />
      ) : (
        <h1 className="font-medium text-xl text-black mb-6">{title}</h1>
      )}
      <div className="bg-white border-[0.6px] border-grey100 rounded-[0.625rem] p-6">
        <ListingTabs
          text={tabDescription}
          tabs={tabs}
          paramName={paramName}
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {isNotAnEmptyArray(items) ? (
            items?.map((item, index) => renderItem(item, index))
          ) : (
            <EmptyState message={emptyStateMessage} />
          )}
        </div>
        {meta && meta.lastPage > 1 && (
          <div className="mt-6">
            <CustomPagination
              currentPage={meta.currentPage}
              totalPages={meta.lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedListingView;
