import React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}) => {
  return (
    <div className={`relative flex-1 h-[30px] bg-celestial-blue rounded-[5px] border-b [border-bottom-style:solid] border-[#000000cc] flex items-center px-2 ${className}`}>
      <Input
        className="h-[30px] border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <SearchIcon className="w-5 h-5 text-black" />
    </div>
  );
}; 