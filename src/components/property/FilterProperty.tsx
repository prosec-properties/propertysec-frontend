"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomButton from "../buttons/CustomButton";
import { Circle, X, CheckCircle2 } from "lucide-react";
import { ICategory } from "@/interface/category";
import { ICountry } from "@/interface/location";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/hooks/useQueryString";

interface Props {
  country: ICountry;
  categories: ICategory[];
  isOpen?: boolean;
  onClose?: () => void;
  wrapperClass?: string;
  onFiltersApplied?: (data: any) => void; // Add callback prop
}

const FilterProperty = ({
  country,
  categories,
  isOpen = false,
  onClose,
  onFiltersApplied,
  ...props
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { getQueryParam } = useQueryString();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);

  useEffect(() => {
    const categoryIds = getQueryParam("categories")
      ? JSON.parse(getQueryParam("categories") || "[]")
      : [];
    const locationIds = getQueryParam("locations")
      ? JSON.parse(getQueryParam("locations") || "[]")
      : [];
    const pricingIds = getQueryParam("pricing")
      ? JSON.parse(getQueryParam("pricing") || "[]")
      : [];

    setSelectedCategories(categoryIds);
    setSelectedLocations(locationIds);
    setSelectedPricing(pricingIds);
  }, [searchParams, categories, country?.states]);

  // console.log(selectedCategories);

  const updateQueryParams = (
    categories: string[],
    locations: string[],
    pricing: string[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categories.length > 0) {
      params.set("categories", JSON.stringify(categories));
    } else {
      params.delete("categories");
    }

    if (locations.length > 0) {
      params.set("locations", JSON.stringify(locations));
    } else {
      params.delete("locations");
    }

    if (pricing.length > 0) {
      params.set("pricing", JSON.stringify(pricing));
    } else {
      params.delete("pricing");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleApplyFilter = async () => {
    updateQueryParams(selectedCategories, selectedLocations, selectedPricing);
    onClose?.();
  };

  const pricing = [
    {
      id: "100000-",
      name: "Under ₦100,000",
    },
    {
      id: "150000-",
      name: "Under ₦150,000",
    },
    {
      id: "200000-",
      name: "Under ₦200,000",
    },
    {
      id: "200000+",
      name: "Over ₦200,000",
    },
  ];

  return (
    <div
      className={cn(
        `
      fixed inset-0 z-40 bg-white md:relative md:bg-transparent md:h-full flex flex-col
      ${isOpen ? "block" : "hidden md:block"}
    `,
        props.wrapperClass
      )}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b md:hidden">
        <h1 className="text-grey1000 font-medium text-lg">Filters</h1>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Scrollable content */}
      <div className="bg-white rounded-[0.3125rem] p-6 flex flex-col gap-[1.12rem] overflow-y-auto flex-1">
        <h1 className="text-grey1000 font-medium text-lg hidden md:block">
          Filter
        </h1>
        <div className="flex-1">
          <FilterItem
            title="Category"
            items={categories || []}
            selectedItems={selectedCategories}
            onSelectionChange={(data) => {
              setSelectedCategories(data);
            }}
          />
          <FilterItem
            title="Location"
            items={country?.states || []}
            selectedItems={selectedLocations}
            onSelectionChange={(data) => {
              setSelectedLocations(data);
            }}
          />
          <FilterItem
            title="Pricing"
            items={pricing || []}
            selectedItems={selectedPricing}
            onSelectionChange={(data) => {
              setSelectedPricing(data);
            }}
            multiple={false}
          />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t">
        <CustomButton
          variant="secondary"
          onClick={handleApplyFilter}
          className="w-full"
        >
          Apply Filter
        </CustomButton>
      </div>
    </div>
  );
};

export default FilterProperty;

interface Item {
  id: string;
  name: string;
}

interface FilterItemProps<T extends Item> {
  title: string;
  items: T[];
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  multiple?: boolean; // New prop with default value of true
}

const FilterItem = <T extends Item>(props: FilterItemProps<T>) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_ITEMS_TO_SHOW = 5;
  const { multiple = true } = props; // Default to true if not provided

  const displayedItems = showAll
    ? props.items
    : props.items.slice(0, INITIAL_ITEMS_TO_SHOW);
  const hasMoreItems = props.items.length > INITIAL_ITEMS_TO_SHOW;

  const formatName = (name: string) => {
    return name === "Abuja Federal Capital Territory" ? "Abuja" : name;
  };

  const toggleItem = (item: T) => {
    let newSelectedItems: string[];

    if (isSelected(item)) {
      // If item is already selected, remove it
      newSelectedItems = props.selectedItems.filter((id) => id !== item.id);
    } else {
      // If item is not selected
      if (multiple) {
        // If multiple selection is allowed, add to existing selection
        newSelectedItems = [...props.selectedItems, item.id];
      } else {
        // If multiple selection is not allowed, replace existing selection
        newSelectedItems = [item.id];
      }
    }

    props.onSelectionChange(newSelectedItems);
  };

  const isSelected = (item: T) =>
    props.selectedItems.some((id) => id === item.id);

  return (
    <div className="border-b border-gray-200 pb-4">
      <h2 className="mb-4 text-[1.1rem] font-semibold text-gray-800 tracking-wide">
        {props.title}
      </h2>
      <ul className="space-y-3">
        {displayedItems.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleItem(item)}
            className={`
              flex items-center gap-3 text-[0.95rem] transition-all duration-200 cursor-pointer group
              ${
                isSelected(item)
                  ? "text-primary font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {isSelected(item) ? (
              <CheckCircle2 className="block size-[1.125rem] text-primary" />
            ) : (
              <Circle className="block size-[1.125rem] text-gray-400 group-hover:text-primary/60 transition-colors duration-200" />
            )}
            <span className="block">{formatName(item.name)}</span>
          </li>
        ))}
      </ul>
      {hasMoreItems && (
        <button
          className="mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
