import React from "react";
import SearchInput from "../inputs/SearchInput";
import CustomButton from "../buttons/CustomButton";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  wrapperClass?: string;
  inputWrapperClass?: string;
  buttonClass?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonVariant?: React.ComponentProps<typeof CustomButton>["variant"];
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      placeholder = "Search for...",
      searchValue,
      onSearchChange,
      onSearch,
      onKeyPress,
      wrapperClass,
      inputWrapperClass,
      buttonClass,
      showButton = true,
      buttonText = "Search",
      buttonVariant = "primary",
    },
    ref
  ) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSearch) {
        onSearch();
      }
      onKeyPress?.(e);
    };

    return (
      <div className={cn("space-y-4", wrapperClass)} ref={ref}>
        <div className="flex items-stretch gap-4"> 
          <SearchInput
            placeholder={placeholder}
            wrapperClass={cn("w-full flex-1", inputWrapperClass)}
            inputClass="h-full" 
            value={searchValue}
            onChange={onSearchChange}
            onKeyPress={handleKeyPress}
          />
          {showButton && (
            <CustomButton
              variant={buttonVariant}
              className={cn("h-auto", buttonClass)} 
              onClick={onSearch}
            >
              {buttonText}
            </CustomButton>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;