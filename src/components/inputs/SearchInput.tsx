import React from "react";
import SearchIcon from "../icons/Search";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import ErrorMessage from "../misc/ErrorMessage";

interface Props {
  errorMessage?: string;
  placeholder?: string;
  wrapperClass?: string;
  inputClass?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = ({
  errorMessage, 
  placeholder,
  wrapperClass,
  inputClass,
  value,
  onChange,
  onKeyPress,
}: Props) => {
  return (
    <div className={cn(wrapperClass, "relative")}>
      <span className="absolute inset-y-0 start-2 grid place-content-center">
        <button type="button" className="text-gray-600 hover:text-gray-700">
          <span className="sr-only">Search</span>
          <SearchIcon />
        </button>
      </span>

      <label htmlFor="Search" className="sr-only">
        Search
      </label>

      <Input
        type="text"
        id="Search"
        placeholder={placeholder || "Search for..."}
        className={cn(
          "w-full rounded-[0.635rem] border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm indent-5 bg-offWhite",
          inputClass
        )}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

export default SearchInput;
