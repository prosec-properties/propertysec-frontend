import React from "react";
import SearchIcon from "../icons/Search";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ value, onChange, onKeyPress }: SearchInputProps) => {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-3 flex items-center">
        <SearchIcon className="h-4 w-4 text-gray-400" />
      </span>
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default SearchInput;
