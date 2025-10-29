'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchFilters } from '@/components/research-news/SearchFilters';
import { CategoryFilter } from '@/components/research-news/CategoryFilter';
import { TrendingButton } from '@/components/research-news/TrendingButton';
import { TagsFilter } from '@/components/research-news/TagsFilter';
import { Pagination } from '@/components/research-news/Pagination';
import { websiteResearchNewsAPI, ResearchArticle } from '@/hooks/api/website/research-news.api';
import { useBreakpoint } from '@/hooks/use-mobile'; // Import the enhanced hook

// Static categories matching dashboard form
const staticCategories = [
  { id: 'all', label: 'All', count: 0, isActive: true },
  { id: 'ai', label: 'Artificial Intelligence', count: 0 },
  { id: 'aerospace', label: 'Aerospace Engineering', count: 0 },
  { id: 'health', label: 'Health & Medicine', count: 0 },
  { id: 'sustainability', label: 'Sustainability', count: 0 },
  { id: 'quantum', label: 'Quantum Computing', count: 0 },
  { id: 'other', label: 'Other', count: 0 },
];

// Define proper types for filters
interface SearchFiltersType {
  query: string;
  category: string;
  sortBy: string;
}

interface CategoryFilterType {
  id: string;
  label: string;
  count: number;
  isActive?: boolean;
}

interface TagType {
  id: string;
  label: string;
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Enhanced Research Card Component with mobile responsiveness
const ResearchCard = ({ article, isMobile, isTablet }: { 
  article: ResearchArticle; 
  isMobile?: boolean; 
  isTablet?: boolean; 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Helper function to get staff name
  const getStaffName = (staff: any): string => {
    if (!staff) return 'Unknown Author';
    if (staff.name) return staff.name;
    if (staff.firstName && staff.lastName) return `${staff.firstName} ${staff.lastName}`;
    if (staff.firstName) return staff.firstName;
    if (staff.lastName) return staff.lastName;
    return 'Unknown Author';
  };

  return (
    <Link href={`/research-news/${article.id}`}>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group cursor-pointer h-full flex flex-col ${
        isMobile ? 'shadow-md' : 'shadow-lg'
      }`}>
        {/* Responsive image container */}
        <div className={`relative w-full bg-gray-200 flex-shrink-0 ${
          isMobile ? 'h-40' : isTablet ? 'h-44' : 'h-48'
        }`}>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse bg-gray-300 w-full h-full"></div>
            </div>
          )}
          <img 
            alt={article.title}
            className={`w-full object-cover transition-opacity duration-300 ${
              isMobile ? 'h-40' : isTablet ? 'h-44' : 'h-48'
            } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            src={imageError ? '/no-image.jpg' : (article.image || '/no-image.jpg')}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
        
        {/* Content container with mobile optimization */}
        <div className={`flex-grow flex flex-col ${
          isMobile ? 'p-3' : isTablet ? 'p-3.5' : 'p-4'
        }`}>
          {/* Category and status badges */}
          <div className="mb-2">
            <span className={`font-semibold uppercase ${
              isMobile ? 'text-xs' : 'text-xs'
            } ${
              article.category === 'ai' ? 'text-blue-600' :
              article.category === 'aerospace' ? 'text-indigo-600' :
              article.category === 'health' ? 'text-green-600' :
              article.category === 'sustainability' ? 'text-teal-600' :
              article.category === 'quantum' ? 'text-purple-600' :
              'text-gray-600'
            }`}>
              {truncateText(
                staticCategories.find(cat => cat.id === article.category)?.label || article.category,
                isMobile ? 15 : 20
              )}
            </span>
            {article.status === 'published' && (
              <span className={`ml-2 inline-block font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                Live
              </span>
            )}
          </div>

          {/* Title with responsive sizing */}
          <h2 className={`mb-2 font-semibold text-gray-900 transition-colors line-clamp-2 ${
            isMobile ? 'text-base h-12' : isTablet ? 'text-lg h-13' : 'text-lg h-14'
          } ${
            article.category === 'ai' ? 'group-hover:text-blue-600' :
            article.category === 'aerospace' ? 'group-hover:text-indigo-600' :
            article.category === 'health' ? 'group-hover:text-green-600' :
            article.category === 'sustainability' ? 'group-hover:text-teal-600' :
            article.category === 'quantum' ? 'group-hover:text-purple-600' :
            'group-hover:text-blue-600'
          }`}>
            {truncateText(article.title, isMobile ? 50 : isTablet ? 60 : 70)}
          </h2>
          
          {/* Abstract with responsive display */}
          <p className={`text-gray-600 mb-3 line-clamp-2 flex-grow ${
            isMobile ? 'text-xs h-8' : isTablet ? 'text-sm h-9' : 'text-sm h-10'
          }`}>
            {truncateText(
              article.excerpt || article.abstract, 
              isMobile ? 60 : isTablet ? 80 : 100
            )}
          </p>
          
          {/* Bottom section - pushed to bottom */}
          <div className="mt-auto">
            {/* Read time */}
            {article.readTime && (
              <div className={`flex items-center justify-between text-gray-500 mb-2 ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                <span>{article.readTime}</span>
              </div>
            )}
            
            {/* Date */}
            <div className={`text-gray-500 mb-2 ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>
              {article.date}
            </div>
            
            {/* Tags - responsive display */}
            <div className="flex flex-wrap gap-1">
              {article.tags?.slice(0, isMobile ? 1 : 2).map((tag: string, index: number) => (
                <span key={index} className={`inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>
                  #{truncateText(tag, isMobile ? 8 : 10)}
                </span>
              ))}
              {article.tags && article.tags.length > (isMobile ? 1 : 2) && (
                <span className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  +{article.tags.length - (isMobile ? 1 : 2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function ResearchNewsPage() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [categories] = useState<CategoryFilterType[]>(staticCategories);
  const [availableTags, setAvailableTags] = useState<TagType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showTrending, setShowTrending] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({
    query: '',
    category: 'all',
    sortBy: 'date'
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tagsLoading, setTagsLoading] = useState<boolean>(false);

  // Responsive articles per page
  const getArticlesPerPage = () => {
    if (isMobile) return 6;
    if (isTablet) return 8;
    return 10;
  };

  const articlesPerPage = getArticlesPerPage();

  // Fetch research news with proper tag handling
  const fetchData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const tagNamesForAPI = selectedTags.map((tagId: string) => {
        const tag = availableTags.find((t: TagType) => t.id === tagId);
        return tag ? tag.label : tagId;
      });

      const params = {
        page: currentPage,
        limit: articlesPerPage,
        category: activeCategory !== 'all' ? activeCategory : undefined,
        tags: tagNamesForAPI.length > 0 ? tagNamesForAPI : undefined,
        search: filters.query || undefined,
        status: 'published'
      };

      const data = await websiteResearchNewsAPI.fetchResearchNews(params);
      
      setArticles(data.data || []);
      setTotalArticles(data.total || 0);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch research news');
      console.error('Error fetching research news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tags and format them correctly
  const fetchTags = async (): Promise<void> => {
    setTagsLoading(true);
    try {
      const fetchedTags = await websiteResearchNewsAPI.fetchTags();
      
      const formattedTags: TagType[] = fetchedTags.map((tag: string) => ({ 
        id: tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        label: tag
      }));
      
      setAvailableTags(formattedTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setAvailableTags([]);
    } finally {
      setTagsLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [currentPage, activeCategory, selectedTags, filters.query, articlesPerPage]);

  // Load tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  // Update articles per page when screen size changes
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1); // Reset to first page when screen size changes
    }
  }, [isMobile, isTablet]);

  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // Event handlers
  const handleCategoryChange = (categoryId: string): void => {
    setActiveCategory(categoryId);
    setFilters(prev => ({ ...prev, category: categoryId }));
    setCurrentPage(1);
    setShowTrending(false);
    
    // Hide mobile filters after selection
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const handleTrendingToggle = (): void => {
    setShowTrending(!showTrending);
    setActiveCategory('all');
    setCurrentPage(1);
    
    if (isMobile) {
      setShowMobileFilters(false);
    }
  };

  const handleTagToggle = (tagId: string): void => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId) 
        ? prev.filter((id: string) => id !== tagId)
        : [...prev, tagId];
      return newTags;
    });
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType): void => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get responsive grid classes
  const getGridClasses = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-1 sm:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // Count active filters for mobile display
  const activeFiltersCount = [
    activeCategory !== 'all' ? 1 : 0,
    showTrending ? 1 : 0,
    selectedTags.length,
    filters.query ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="relative flex flex-col bg-white min-h-screen text-gray-800">
      <div className="layout-container flex flex-col">
        <Header />
        
        <main className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
          isMobile ? 'py-6' : isTablet ? 'py-8' : 'py-12'
        }`}>
          {/* Page Title */}
          <h1 className={`font-bold text-gray-900 mb-8 ${
            isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'
          }`}>
            Research News
          </h1>
          
          {/* Mobile Filter Toggle */}
          {isMobile && (
            <div className="mb-6">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <span className="font-medium text-gray-700">
                    Search & Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Filters Section */}
          {(!isMobile || showMobileFilters) && (
            <div className={`mb-10 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
              <SearchFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isMobile={isMobile}
              />

              {/* Category and Trending Filters */}
              <div className={`flex gap-4 ${
                isMobile ? 'flex-col space-y-4' : isTablet ? 'flex-col md:flex-row md:items-center gap-8' : 'flex-col md:flex-row md:items-center gap-40'
              }`}>
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  hasResults={articles.length > 0}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />

                <TrendingButton
                  isActive={showTrending}
                  onClick={handleTrendingToggle}
                  isMobile={isMobile}
                />
              </div>

              {/* Tags Filter */}
              {tagsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="text-gray-500">Loading tags...</div>
                </div>
              ) : (
                <TagsFilter
                  tags={availableTags}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                  hasResults={articles.length > 0}
                  activeCategory={activeCategory}
                  categories={categories}
                  onCategoryChange={handleCategoryChange}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${
                isMobile ? 'h-8 w-8' : 'h-12 w-12'
              }`}></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Results Info */}
          {!loading && !error && (
            <div className={`py-2 text-gray-600 mb-6 ${
              isMobile ? 'px-2 text-sm' : 'px-4 text-sm'
            }`}>
              Showing {((currentPage - 1) * articlesPerPage) + 1}-{Math.min(currentPage * articlesPerPage, totalArticles)} of {totalArticles} published article{totalArticles !== 1 ? 's' : ''}
              {filters.query && ` for "${filters.query}"`}
              {activeCategory !== 'all' && ` in ${categories.find((c: CategoryFilterType) => c.id === activeCategory)?.label}`}
              {showTrending && ` (Trending)`}
              {selectedTags.length > 0 && ` with tags: ${selectedTags.map((tagId: string) => {
                const tag = availableTags.find((t: TagType) => t.id === tagId);
                return `#${tag?.label || tagId}`;
              }).join(', ')}`}
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && (
            <div className={`grid gap-6 ${getGridClasses()}`}>
              {articles.map((article: ResearchArticle) => (
                <ResearchCard 
                  key={article.id} 
                  article={article} 
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-12">
              <div className={`mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center ${
                isMobile ? 'w-12 h-12' : 'w-16 h-16'
              }`}>
                <svg className={`text-gray-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className={`text-gray-500 ${isMobile ? 'text-base' : 'text-lg'}`}>
                No published research articles found matching your criteria.
              </p>
              <p className={`text-gray-400 mt-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className={`flex justify-center ${isMobile ? 'mt-8' : 'mt-12'}`}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isMobile={isMobile}
                variant={isMobile ? 'compact' : 'default'}
              />
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
