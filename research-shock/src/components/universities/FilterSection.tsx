'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { SearchFilters, FilterOption } from '@/types/universities/university';
import { countries } from '@/lib/countries'; // Import your countries data
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

interface FilterSectionProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  countries: string[];
  areaTypes: string[];
  universityTypes: string[];
  // Mobile-specific props
  isMobile?: boolean;
  variant?: 'default' | 'compact' | 'modal';
  showActiveFilters?: boolean;
  onClearAllFilters?: () => void;
    onApplyFilters?: () => void; // Callback to close mobile filter view
  onCloseMobileFilters?: () => void; // Alternative callback for closing
}

export const FilterSection = ({ 
  filters, 
  onFiltersChange, 
  countries: apiCountries, 
  areaTypes, 
  universityTypes,
  isMobile: propIsMobile,
  variant = 'default',
  showActiveFilters = true,
  onClearAllFilters,
    onApplyFilters,
  onCloseMobileFilters
}: FilterSectionProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [showCustomCountryInput, setShowCustomCountryInput] = useState(false);
  const [customCountry, setCustomCountry] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    countries: true,
    locations: true,
    types: true
  });
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  // Use countries from lib file for display - FIX: Use 'label' instead of 'name'
  const formattedCountries = useMemo(() => {
    if (!countries || !Array.isArray(countries)) {
      return [];
    }
    
    return countries
      .filter(country => country && country.label && typeof country.label === 'string')
      .map(country => ({
        value: country.label, // Use country label as value for backend
        label: country.label  // Display country label
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // Static area types (predefined)
  const predefinedAreaTypes = [
    { value: 'Urban', label: 'Urban' },
    { value: 'Suburban', label: 'Suburban' },
    { value: 'Rural', label: 'Rural' },
  ];

  // Static university types (predefined)
  const predefinedUniversityTypes = [
    { value: 'Public', label: 'Public' },
    { value: 'Private', label: 'Private' },
    { value: 'Community College', label: 'Community College' },
    { value: 'Technical Institute', label: 'Technical Institute' },
    { value: 'Research University', label: 'Research University' },
    { value: 'Liberal Arts College', label: 'Liberal Arts College' },
    { value: 'Online University', label: 'Online University' },
  ];

  // Create location options from predefined area types
  const [locationOptions, setLocationOptions] = useState<FilterOption[]>(
    predefinedAreaTypes.map(type => ({
      value: type.value,
      label: type.label,
      checked: false
    }))
  );

  // Create type options from predefined university types
  const [typeOptions, setTypeOptions] = useState<FilterOption[]>(
    predefinedUniversityTypes.map(type => ({
      value: type.value,
      label: type.label,
      checked: false
    }))
  );
  // Handle applying filters on mobile
const handleApplyFilters = () => {
  // Close the mobile filter view
  if (onApplyFilters) {
    onApplyFilters();
  } else if (onCloseMobileFilters) {
    onCloseMobileFilters();
  }
  
  // Optional: scroll to top on mobile
  if (isMobile) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};


  // Auto-collapse sections on mobile
  useEffect(() => {
    if (isMobile) {
      setExpandedSections({
        countries: false,
        locations: false,
        types: false
      });
    } else {
      setExpandedSections({
        countries: true,
        locations: true,
        types: true
      });
    }
  }, [isMobile]);
  

  // Update checkbox states when filters change
  useEffect(() => {
    setLocationOptions(prev => prev.map(opt => 
      ({ ...opt, checked: filters.locations.includes(opt.value) })
    ));
  }, [filters.locations]);

  useEffect(() => {
    setTypeOptions(prev => prev.map(opt => 
      ({ ...opt, checked: filters.types.includes(opt.value) })
    ));
  }, [filters.types]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    
  }, []);

  // Filter countries based on search query
  const filteredCountries = formattedCountries.filter(country =>
    country.label.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const handleCountrySelect = (countryValue: string, countryLabel: string) => {
    if (countryValue === 'other') {
      setShowCustomCountryInput(true);
      setShowCountryDropdown(false);
      setTimeout(() => {
        countryInputRef.current?.focus();
      }, 100);
      return;
    }

    // Send country name to backend filter
    const newCountries = filters.countries.includes(countryValue)
      ? filters.countries.filter(c => c !== countryValue)
      : [...filters.countries, countryValue];
    
    onFiltersChange({ ...filters, countries: newCountries });
    setShowCountryDropdown(false);
    setCountrySearchQuery('');
  };

  const handleCustomCountrySubmit = () => {
    if (customCountry.trim()) {
      // Store custom country name directly
      const newCountries = [...filters.countries, customCountry.trim()];
      onFiltersChange({ 
        ...filters, 
        countries: newCountries, 
        customCountries: [...(filters.customCountries || []), customCountry.trim()] 
      });
      setCustomCountry('');
      setShowCustomCountryInput(false);
    }
  };

  const handleCustomCountryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomCountrySubmit();
    } else if (e.key === 'Escape') {
      setShowCustomCountryInput(false);
      setCustomCountry('');
    }
  };

  const removeCountry = (countryValue: string) => {
    const newCountries = filters.countries.filter(c => c !== countryValue);
    const newCustomCountries = filters.customCountries?.filter(c => c !== countryValue) || [];
    onFiltersChange({ ...filters, countries: newCountries, customCountries: newCustomCountries });
  };

  const getCountryDisplayName = (countryValue: string) => {
    // Return the country name as is
    return countryValue;
  };

  const handleLocationChange = (value: string, checked: boolean) => {
    const newLocations = checked 
      ? [...filters.locations, value]
      : filters.locations.filter(l => l !== value);
    
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const handleTypeChange = (value: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.types, value]
      : filters.types.filter(t => t !== value);
    
    onFiltersChange({ ...filters, types: newTypes });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Count active filters
  const activeFiltersCount = filters.countries.length + filters.locations.length + filters.types.length;

  // Get responsive container classes
  const getContainerClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-md space-y-6";
    if (variant === 'compact') {
      return `${baseClasses} ${isMobile ? 'p-3' : 'p-4'}`;
    }
    if (variant === 'modal') {
      return `${baseClasses} p-4 max-h-[70vh] overflow-y-auto`;
    }
    return `${baseClasses} ${isMobile ? 'max-w-full p-4' : 'max-w-lg mx-auto p-6'}`;
  };

  // Section header component
  const SectionHeader = ({ 
    title, 
    section, 
    count = 0 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    count?: number;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-gray-700 font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>
          {title}
        </span>
        {count > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {isMobile && (
        <button
          onClick={() => toggleSection(section)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={`Toggle ${title} section`}
        >
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${
              expandedSections[section] ? 'rotate-180' : ''
            }`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className={getContainerClasses()}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-[#101418] font-bold leading-tight tracking-[-0.015em] ${
          isMobile ? 'text-base' : 'text-lg'
        }`}>
          Filters
        </h3>
        {showActiveFilters && activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {activeFiltersCount} active
            </span>
            {onClearAllFilters && (
              <button
                onClick={onClearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Summary - Mobile */}
      {isMobile && showActiveFilters && activeFiltersCount > 0 && (
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs font-medium text-blue-800 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-1">
            {filters.countries.map((country) => (
              <span key={country} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {getCountryDisplayName(country)}
                <button onClick={() => removeCountry(country)} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
              </span>
            ))}
            {filters.locations.map((location) => (
              <span key={location} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                {location}
                <button onClick={() => handleLocationChange(location, false)} className="ml-1 text-green-600 hover:text-green-800">×</button>
              </span>
            ))}
            {filters.types.map((type) => (
              <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {type}
                <button onClick={() => handleTypeChange(type, false)} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Country Filter with Search */}
      <div>
        <SectionHeader title="Country" section="countries" count={filters.countries.length} />
        
        {(!isMobile || expandedSections.countries) && (
          <div className="mt-3 space-y-3">
            {/* Selected Countries */}
            {!isMobile && filters.countries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {getCountryDisplayName(country)}
                    <button
                      onClick={() => removeCountry(country)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Country Search Dropdown */}
            <div className="relative" ref={countryDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  onFocus={() => setShowCountryDropdown(true)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {showCountryDropdown && (
                <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  {filteredCountries.length > 0 ? (
                    <>
                      {filteredCountries.map((country) => (
                        <button
                          key={country.value}
                          onClick={() => handleCountrySelect(country.value, country.label)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            filters.countries.includes(country.value) ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{country.label}</span>
                            {filters.countries.includes(country.value) && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => handleCountrySelect('other', 'Other')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-600 italic"
                        >
                          + Add custom country
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-center">
                      No countries found
                      <button
                        onClick={() => handleCountrySelect('other', 'Other')}
                        className="block w-full text-left mt-2 text-blue-600 hover:text-blue-800"
                      >
                        + Add "{countrySearchQuery}" as custom country
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom Country Input */}
            {showCustomCountryInput && (
              <div className="p-3 border border-blue-200 rounded-md bg-blue-50">
                <label className={`block font-medium text-gray-700 mb-2 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>
                  Enter custom country name:
                </label>
                <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                  <input
                    ref={countryInputRef}
                    type="text"
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    onKeyDown={handleCustomCountryKeyPress}
                    placeholder="Country name..."
                    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      isMobile ? 'w-full text-sm' : 'flex-1'
                    }`}
                  />
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <button
                      onClick={handleCustomCountrySubmit}
                      disabled={!customCountry.trim()}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isMobile ? 'flex-1 text-sm' : ''
                      }`}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomCountryInput(false);
                        setCustomCountry('');
                      }}
                      className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ${
                        isMobile ? 'flex-1 text-sm' : ''
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Area Type Filter */}
      <div>
        <SectionHeader title="Area Type" section="locations" count={filters.locations.length} />
        
        {(!isMobile || expandedSections.locations) && (
          <div className={`mt-3 ${isMobile ? 'space-y-2' : 'flex flex-wrap gap-4'}`}>
            {locationOptions.map((option) => (
              <label key={option.value} className={`inline-flex items-center ${
                isMobile ? 'w-full py-1' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => handleLocationChange(option.value, e.target.checked)}
                  className="form-checkbox text-blue-600"
                />
                <span className={`ml-2 text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* University Type Filter */}
      <div>
        <SectionHeader title="University Type" section="types" count={filters.types.length} />
        
        {(!isMobile || expandedSections.types) && (
          <div className={`mt-3 ${isMobile ? 'space-y-2' : 'flex flex-col gap-2'}`}>
            {typeOptions.map((option) => (
              <label key={option.value} className={`inline-flex items-center ${
                isMobile ? 'w-full py-1' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => handleTypeChange(option.value, e.target.checked)}
                  className="form-checkbox text-blue-600"
                />
                <span className={`ml-2 text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Apply Filters Button */}
    {isMobile && variant !== 'modal' && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters} // This will now work
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            {activeFiltersCount > 0 && onClearAllFilters && (
              <button
                onClick={() => {
                  onClearAllFilters();
                  // Optional: keep filters open after clearing
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
