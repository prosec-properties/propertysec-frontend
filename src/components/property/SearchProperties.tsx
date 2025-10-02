"use client";

import React, { useCallback } from "react";
import SearchInput from "../inputs/SearchInput";
import CustomButton from "../buttons/CustomButton";
import FilterIcon from "../icons/Filter";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/hooks/useQueryString";
import { useDebounceCallback } from "usehooks-ts";

interface Props {
  showFilterIconOnMobile?: boolean;
  title: string;
  titleClass?: string;
  placeholder: string;
  onFilterClick?: () => void;
  onSearch?: (searchTerm: string) => void;
  debounceTime?: number;
  minSearchLength?: number;
  className?: string;
}

const SearchItems = ({
  showFilterIconOnMobile = false,
  title,
  titleClass,
  placeholder,
  onFilterClick,
  onSearch,
  debounceTime = 500,
  minSearchLength = 2,
  className,
}: Props) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [value, setValue] = React.useState("");

  const debounced = useDebounceCallback(setValue, debounceTime);

  const { setQueryParam } = useQueryString();

    const handleSearch = useCallback((text: string) => {
    if (text.length < minSearchLength) {
      onSearch?.('');
      setQueryParam("search", '');
      return;
    };
    onSearch?.(text);
    setQueryParam("search", text);
  }, [minSearchLength, onSearch, setQueryParam]);

  React.useEffect(() => {
    handleSearch(value);
  }, [value, handleSearch]);



  return (
    <div className={cn("", className)}>
      <h1
        className={cn(
          "text-2xl md:text-3xl font-medium mb-[1.69rem] text-black text-center",
          titleClass
        )}
      >
        {title}
      </h1>
      <div className="flex items-center w-full gap-2">
        {showFilterIconOnMobile && (
          <div onClick={onFilterClick} className="cursor-pointer">
            <FilterIcon />
          </div>
        )}
        <SearchInput
          placeholder={placeholder}
          wrapperClass="w-full"
          inputClass="bg-white"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            debounced(e.target.value);
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSearch(searchTerm)}
        />
        <CustomButton className="h-[2rem] md:h-[40px]" onClick={() => handleSearch(searchTerm)}>
          Search
        </CustomButton>
      </div>
    </div>
  );
};

export default SearchItems;
