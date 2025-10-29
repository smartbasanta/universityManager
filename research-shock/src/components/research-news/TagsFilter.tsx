'use client';

import { useState } from 'react';
import { FileX } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook

// Define interfaces directly in the component
interface TagType {
  id: string;
  label: string;
  count?: number;
}

interface CategoryFilterType {
  id: string;
  label: string;
  count?: number;
  isActive?: boolean;
}

interface TagsFilterProps {
  tags: TagType[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  hasResults: boolean;
  activeCategory: string;
  categories: CategoryFilterType[];
  onCategoryChange: (categoryId: string) => void;
  // Mobile-specific props
  isMobile?: boolean;
  isTablet?: boolean;
  maxVisibleTags?: number;
  showCounts?: boolean;
  variant?: 'default' | 'compact' | 'grid';
}

// Helper function to truncate text for mobile
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const TagsFilter = ({ 
  tags, 
  selectedTags, 
  onTagToggle, 
  hasResults, 
  activeCategory, 
  categories, 
  onCategoryChange,
  isMobile: propIsMobile,
  isTablet: propIsTablet,
  maxVisibleTags,
  showCounts = true,
  variant = 'default'
}: TagsFilterProps) => {
  const hookIsMobile = useMobile();
  const isMobile = propIsMobile ?? hookIsMobile;
  const [showAllTags, setShowAllTags] = useState(false);
  const [showTagsSection, setShowTagsSection] = useState(!isMobile);

  // Determine how many tags to show initially
  const getMaxVisibleTags = () => {
    if (maxVisibleTags) return maxVisibleTags;
    if (isMobile) return 6;
    if (propIsTablet) return 8;
    return 12;
  };

  const maxVisible = getMaxVisibleTags();
  const visibleTags = showAllTags ? tags : tags.slice(0, maxVisible);
  const hasMoreTags = tags.length > maxVisible;

  const clearAllTags = (): void => {
    selectedTags.forEach((tagId: string) => onTagToggle(tagId));
  };

  const getSelectedTagsText = (): string => {
    return selectedTags.map((tagId: string) => {
      const tag = tags.find((t: TagType) => t.id === tagId);
      return `#${tag?.label || tagId}`;
    }).join(', ');
  };

  // Mobile compact variant
  if (isMobile && variant === 'compact') {
    return (
      <div className="w-full">
        {/* Mobile Tags Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowTagsSection(!showTagsSection)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </span>
            </div>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${showTagsSection ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Selected tags preview (always visible on mobile) */}
        {selectedTags.length > 0 && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Selected Tags:</span>
              <button
                onClick={clearAllTags}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedTags.slice(0, 3).map((tagId: string) => {
                const tag = tags.find((t: TagType) => t.id === tagId);
                return (
                  <span
                    key={tagId}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    #{truncateText(tag?.label || tagId, 10)}
                    <button
                      onClick={() => onTagToggle(tagId)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                );
              })}
              {selectedTags.length > 3 && (
                <span className="text-xs text-blue-600">+{selectedTags.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Tags list (collapsible on mobile) */}
        {showTagsSection && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {visibleTags.map((tag: TagType) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                    selectedTags.includes(tag.id)
                      ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <div className="truncate">#{truncateText(tag.label, 12)}</div>
                  {showCounts && tag.count && (
                    <div className="text-xs opacity-75 mt-1">{tag.count} articles</div>
                  )}
                </button>
              ))}
            </div>

            {hasMoreTags && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showAllTags ? 'Show Less' : `Show ${tags.length - maxVisible} More Tags`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Grid variant for tablets
  if (variant === 'grid' || (propIsTablet && variant === 'default')) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">Popular Tags</h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Clear all ({selectedTags.length})
            </button>
          )}
        </div>
        
        <div className={`grid gap-2 ${
          isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-4'
        }`}>
          {visibleTags.map((tag: TagType) => (
            <button
              key={tag.id}
              onClick={() => onTagToggle(tag.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                selectedTags.includes(tag.id)
                  ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <div className="truncate">#{tag.label}</div>
              {showCounts && tag.count && (
                <div className="text-xs opacity-75 mt-1">{tag.count}</div>
              )}
            </button>
          ))}
        </div>

        {hasMoreTags && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAllTags ? 'Show Less' : `Show All ${tags.length} Tags`}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default horizontal variant (enhanced)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-medium text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>
          Popular Tags
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className={`text-blue-600 hover:text-blue-800 font-medium transition-colors ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}
          >
            Clear all ({selectedTags.length})
          </button>
        )}
      </div>
      
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
        {visibleTags.map((tag: TagType) => (
          <button
            key={tag.id}
            onClick={() => onTagToggle(tag.id)}
            className={`font-medium rounded-full transition-colors flex items-center gap-1 ${
              isMobile ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-xs'
            } ${
              selectedTags.includes(tag.id)
                ? 'text-blue-700 bg-blue-100 hover:bg-blue-200 border border-blue-300'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            #{isMobile ? truncateText(tag.label, 12) : tag.label}
            {showCounts && tag.count && (
              <span className="text-xs opacity-75">({tag.count})</span>
            )}
            {selectedTags.includes(tag.id) && (
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        ))}
        
        {hasMoreTags && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className={`font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors ${
              isMobile ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-xs'
            }`}
          >
            {showAllTags ? 'Less' : `+${tags.length - maxVisible}`}
          </button>
        )}
      </div>

      {/* Enhanced No Results Message */}
      {!hasResults && (selectedTags.length > 0 || activeCategory !== 'all') && (
        <div className={`mt-6 flex flex-col items-center justify-center text-center ${
          isMobile ? 'py-6' : 'py-8'
        }`}>
          <FileX className={`text-gray-400 mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
          <h3 className={`font-medium text-gray-900 mb-2 ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            News on this topic isn't available
          </h3>
          
          {/* Message for selected tags */}
          {selectedTags.length > 0 && (
            <p className={`text-gray-500 max-w-sm mb-4 ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              No articles found with the selected tags: {isMobile 
                ? truncateText(getSelectedTagsText(), 50)
                : getSelectedTagsText()
              }. Try different tags or clear your selection.
            </p>
          )}
          
          {/* Message for selected category (when no tags are selected) */}
          {selectedTags.length === 0 && activeCategory !== 'all' && (
            <p className={`text-gray-500 max-w-sm mb-4 ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              No articles found in the "{categories.find((c: CategoryFilterType) => c.id === activeCategory)?.label}" category. 
              Try selecting a different category or adjusting your search terms.
            </p>
          )}

          {/* Action buttons */}
          <div className={`flex gap-2 ${isMobile ? 'flex-col w-full' : 'flex-row'}`}>
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllTags}
                className={`font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors ${
                  isMobile ? 'px-4 py-3 text-sm w-full' : 'px-4 py-2 text-sm'
                }`}
              >
                Clear All Tags
              </button>
            )}
            {activeCategory !== 'all' && (
              <button
                onClick={() => onCategoryChange('all')}
                className={`font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors ${
                  isMobile ? 'px-4 py-3 text-sm w-full' : 'px-4 py-2 text-sm'
                }`}
              >
                View All Articles
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
