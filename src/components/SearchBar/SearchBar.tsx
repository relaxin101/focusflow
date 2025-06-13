import React from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  filters?: {
    showLive?: boolean;
    showUnwatched?: boolean;
  };
  onFilterChange?: (filters: { showLive: boolean; showUnwatched: boolean }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search",
  className = "",
  filters = { showLive: false, showUnwatched: false },
  onFilterChange,
}) => {
  return (
    <div className={`relative flex-1 h-[30px] bg-celestial-blue rounded-[5px] border-b [border-bottom-style:solid] border-[#000000cc] flex items-center px-2 ${className}`}>
      <Input
        className="h-[30px] border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-transparent">
              <FilterIcon className="w-4 h-4 text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuCheckboxItem
              checked={filters.showLive}
              onCheckedChange={(checked) => onFilterChange?.({ ...filters, showLive: checked })}
            >
              Show Live Courses
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.showUnwatched}
              onCheckedChange={(checked) => onFilterChange?.({ ...filters, showUnwatched: checked })}
            >
              Show Unwatched Content
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SearchIcon className="w-5 h-5 text-black" />
      </div>
    </div>
  );
}; 