'use client';

import { useState, useRef, useEffect } from 'react';

interface FilterDropdownsProps {
  onFilterChange: (filters: Record<string, string>) => void;
  focusAreas: string[];
  languages: string[];
  universities: string[];
}

export const FilterDropdowns = ({ 
  onFilterChange, 
  focusAreas, 
  languages, 
  universities 
}: FilterDropdownsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown] && 
          !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveDropdown(null);
  };

  const handleClearFilter = (filterType: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterType];
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveDropdown(null);
  };

  const SearchableDropdown = ({ id, label, options }: { id: string; label: string; options: string[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOptions = options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentValue = filters[id];
    const displayLabel = currentValue ? `${label}: ${currentValue}` : label;

    return (
      <div className="relative" ref={(el: HTMLDivElement | null) => {
        dropdownRefs.current[id] = el;
      }}>
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-2 ${
            currentValue ? 'bg-blue-100 text-blue-800' : 'bg-[#eaedf1] text-[#101518]'
          }`}
        >
          <p className="text-sm font-medium leading-normal">{displayLabel}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>
        
        {activeDropdown === id && (
          <div className="absolute mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border-b text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="max-h-48 overflow-y-auto py-1 text-gray-700 text-sm">
              {currentValue && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 border-b"
                  onClick={() => handleClearFilter(id)}
                >
                  Clear filter
                </li>
              )}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleFilterSelect(id, option)}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-3 p-3 flex-wrap pr-4">
      {/* Education Level commented out as requested */}
      {/* <DropdownButton
        id="education_level"
        label="Education Level"
        options={['grad']}
      /> */}
      
      <SearchableDropdown
        id="focused_area"
        label="Focus Area"
        options={focusAreas}
      />
      
      <SearchableDropdown
        id="language"
        label="Language"
        options={languages}
      />
      
      <SearchableDropdown
        id="university"
        label="University"
        options={universities}
      />
    </div>
  );
};
