"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import SearchBar from "../misc/SearchBar";
import { useDebounceCallback } from "usehooks-ts";

interface TableSearchProps {
  title: string;
  placeholder?: string;
  searchParam?: string;
  className?: string;
  debounceTime?: number;
  onSearch?: (value: string) => void;
}

export default function TableSearch({
  title,
  placeholder = "Search...",
  searchParam = "search",
  className = "",
  debounceTime = 400,
  onSearch,
}: TableSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get(searchParam) || "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const debouncedSearch = useDebounceCallback((value: string) => {
    updateSearchParam(value);
  }, debounceTime);

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(searchParam, value);
      } else {
        params.delete(searchParam);
      }

      router.push(`?${params.toString()}`, { scroll: false });

      if (onSearch) {
        onSearch(value);
      }
    },
    [searchParam, searchParams, router, onSearch]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateSearchParam(searchValue);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSearch = () => {
    updateSearchParam(searchValue);
  };

  return (
    <div className={className}>
      <h1 className="text-lg font-medium mb-4">{title}</h1>
      <SearchBar
        placeholder={placeholder}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        onSearch={handleSearch}
        wrapperClass="mb-6"
      />
    </div>
  );
}
