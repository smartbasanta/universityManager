import { useState, useEffect, useRef, useMemo } from 'react';
import { SearchFilters, FilterOption } from '@/types/universities/university';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface FilterSectionProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  countries: string[];
  areaTypes: string[];
  universityTypes: string[];
}

export const FilterSection = ({
  filters,
  onFiltersChange,
  countries: apiCountries,
  areaTypes,
  universityTypes,
}: FilterSectionProps) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    countries: true,
    locations: true,
    types: true,
  });

  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const formattedCountries = useMemo(() => {
    return apiCountries.map(country => ({
      value: country,
      label: country,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [apiCountries]);

  // Create location options from API areaTypes
  const [locationOptions, setLocationOptions] = useState<FilterOption[]>([]);
  useEffect(() => {
    setLocationOptions(areaTypes.map(type => ({
      value: type,
      label: type,
      checked: filters.locations.includes(type)
    })));
  }, [areaTypes, filters.locations]);

  // Create type options from API universityTypes
  const [typeOptions, setTypeOptions] = useState<FilterOption[]>([]);
  useEffect(() => {
    setTypeOptions(universityTypes.map(type => ({
      value: type,
      label: type,
      checked: filters.types.includes(type)
    })));
  }, [universityTypes, filters.types]);

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

  const handleCountrySelect = (countryValue: string) => {
    const newCountries = filters.countries.includes(countryValue)
      ? filters.countries.filter(c => c !== countryValue)
      : [...filters.countries, countryValue];

    onFiltersChange({ ...filters, countries: newCountries });
    setCountrySearchQuery(''); // Clear search after selection
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
      [section]: !prev[section],
    }));
  };

  // Section header component
  const SectionHeader = ({
    title,
    section,
    count = 0,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    count?: number;
  }) => (
    <div className="flex items-center justify-between cursor-pointer py-2" onClick={() => toggleSection(section)}>
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-semibold text-base">
          {title}
        </span>
        {count > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`} />
    </div>
  );

  const activeFiltersCount = filters.countries.length + filters.locations.length + filters.types.length;

  const handleClearAllFilters = () => {
    onFiltersChange({
      search: filters.search,
      countries: [],
      locations: [],
      types: [],
      researchAreas: [],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">
          Filters
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Country Filter with Search */}
      <div>
        <SectionHeader title="Country" section="countries" count={filters.countries.length} />

        {expandedSections.countries && (
          <div className="mt-3 space-y-3">
            <div className="relative" ref={countryDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearchQuery}
                  onChange={(e) => setCountrySearchQuery(e.target.value)}
                  onFocus={() => setShowCountryDropdown(true)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {showCountryDropdown && (filteredCountries.length > 0 || countrySearchQuery) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto text-base">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.value}
                        onClick={() => handleCountrySelect(country.value)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                          filters.countries.includes(country.value) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{country.label}</span>
                          {filters.countries.includes(country.value) && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No countries found matching "{countrySearchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Display selected countries as tags */}
            {filters.countries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.countries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {country}
                    <button
                      onClick={() => handleCountrySelect(country)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Area Type Filter */}
      <div>
        <SectionHeader title="Area Type" section="locations" count={filters.locations.length} />

        {expandedSections.locations && (
          <div className="mt-3 space-y-2">
            {locationOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => handleLocationChange(option.value, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 text-base">
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

        {expandedSections.types && (
          <div className="mt-3 space-y-2">
            {typeOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => handleTypeChange(option.value, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 text-base">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
