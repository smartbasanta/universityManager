import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
}

export const SearchBar = ({
  onSearch,
  placeholder = "Search universities...",
  initialValue = '',
  debounceMs = 300,
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch(''); // Immediately trigger search with empty query
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all duration-200">
        <div className="p-3 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 py-3 pr-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

