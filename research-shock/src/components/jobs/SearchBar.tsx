'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Search for jobs" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Real-time search as user types
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="px-4 py-3">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-full relative">
          {/* Search Icon */}
          <div className="text-[#5c748a] flex border-none bg-[#eaedf1] items-center justify-center pl-4 rounded-l-xl border-r-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          
          {/* Input Field */}
          <input
            placeholder={placeholder}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border-none bg-[#eaedf1] focus:border-none h-full placeholder:text-[#5c748a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal pr-12"
            value={searchQuery}
            onChange={handleSearch}
          />
          
          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5c748a] hover:text-[#101518] transition-colors p-1 rounded-full hover:bg-[#d4d9de]"
              title="Clear search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="currentColor" 
                viewBox="0 0 256 256"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
          )}
        </div>
      </label>
      
      {/* Search Status */}
      {searchQuery && (
        <div className="px-2 pt-2">
          <p className="text-xs text-[#5c748a]">
            Searching for: "<span className="font-medium text-[#101518]">{searchQuery}</span>"
          </p>
        </div>
      )}
    </div>
  );
};
