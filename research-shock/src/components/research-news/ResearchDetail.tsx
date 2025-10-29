'use client';

import { useState, useRef, useEffect } from 'react';
import { ExternalLink, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { CommentSection } from './CommentSection';
import { useToggleLike, useIsLiked } from '@/hooks/api/research/research.query';
import { toast } from 'react-toastify';

// Define interfaces directly in the component
interface ResearchArticle {
  id: string;
  title: string;
  author?: string;
  authorLink?: string;
  institution?: string;
  institutionLink?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  readTime?: string;
  status?: string;
  keywords?: string[];
  abstract?: string;
  content?: string;
  paperLink?: string;
  youtubeUrl?: string;
  featuredImage?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  article?: string;
  doi?: string;
  sections?: SectionType[];
}

interface SectionType {
  id: string;
  title?: string;
  content?: string;
  type: 'text' | 'list' | 'grid' | 'timeline' | 'quote' | 'callout';
  items?: string[];
  gridItems?: GridItem[];
  timelineItems?: TimelineItem[];
  quote?: Quote;
}

interface GridItem {
  title: string;
  description: string;
  highlight?: string;
}

interface TimelineItem {
  phase?: string;
  title: string;
  description: string;
  status?: 'completed' | 'current' | 'planned';
}

interface Quote {
  text: string;
  author: string;
}

interface ResearchDetailProps {
  article: ResearchArticle;
}

export const ResearchDetail = ({ article }: ResearchDetailProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { data: likeStatus, isLoading: isLikeLoading } = useIsLiked(article.id);
  const toggleLikeMutation = useToggleLike();
  const [showShareMenu, setShowShareMenu] = useState(false);
   const shareMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);
  
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleImageError = () => {
    console.log('Image failed to load, using fallback'); // Debug log
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully'); // Debug log
    setImageLoading(false);
  };

    const handleToggleLike = () => {
    if (toggleLikeMutation.isPending) return;
    
    toggleLikeMutation.mutate(article.id, {
      onSuccess: (data) => {
        // Optional: You can add custom success handling here
        console.log('Like toggled successfully:', data);
      },
      onError: (error) => {
        console.error('Failed to toggle like:', error);
      }
    });
  };
    // ADD SHARE FUNCTIONALITY
  const getCurrentUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const shareToFacebook = () => {
    const url = getCurrentUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToMessenger = () => {
    const url = getCurrentUrl();
    const shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const url = getCurrentUrl();
    const text = `Check out this research: ${article.title}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareToLinkedIn = () => {
    const url = getCurrentUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      toast.success('Link copied to clipboard!');
      setShowShareMenu(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = () => {
    if (imageError) return '/no-image.jpg';
    return article.image || article.featuredImage || '/no-image.jpg';
  };

  // Helper function to format URL
  const formatUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  // Put this above the component or in a utils file
const toEmbed = (url: string | undefined): string => {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};


  const renderSection = (section: SectionType) => {
    switch (section.type) {
      case 'list':
        return (
          <ul className="grid md:grid-cols-2 gap-4 list-disc pl-5">
            {section.items?.map((item: string, index: number) => (
              <li key={index} className="mb-2">
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        );
      
      case 'grid':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {section.gridItems?.map((item: GridItem, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-600 mb-2">{item.title}</h4>
                <p>{item.description}</p>
                {item.highlight && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {item.highlight}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'timeline':
        return (
          <div className="relative">
            <div className="border-l-2 border-blue-200 pl-8 space-y-8">
              {section.timelineItems?.map((item: TimelineItem, index: number) => (
                <div key={index} className="relative">
                  <div className={`absolute -left-10 w-4 h-4 rounded-full border-2 ${
                    item.status === 'completed' ? 'bg-green-500 border-green-500' :
                    item.status === 'current' ? 'bg-blue-500 border-blue-500' :
                    'bg-gray-300 border-gray-300'
                  }`} />
                  {item.phase && (
                    <span className="text-sm font-medium text-blue-600">{item.phase}</span>
                  )}
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
            <p>"{section.quote?.text}"</p>
            <cite className="block mt-2 text-sm">— {section.quote?.author}</cite>
          </blockquote>
        );
      
      case 'callout':
        return (
          <div className="bg-blue-50 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div dangerouslySetInnerHTML={{ __html: section.content || '' }} />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[960px] px-4 sm:px-6 lg:px-8">
      <Breadcrumb articleTitle={article.title} />
      
      {/* Article Header */}
      <div className="px-4">
        {/* Research Category Badge */}
        {article.category && (
          <span className={`inline-block px-3 py-1 mb-3 text-xs font-semibold text-white rounded-full ${
            article.category === 'ai' ? 'bg-blue-600' :
            article.category === 'aerospace' ? 'bg-indigo-600' :
            article.category === 'health' ? 'bg-green-600' :
            article.category === 'sustainability' ? 'bg-teal-600' :
            article.category === 'quantum' ? 'bg-purple-600' :
            'bg-gray-600'
          }`}>
            {article.category === 'ai' ? 'Artificial Intelligence' :
             article.category === 'aerospace' ? 'Aerospace Engineering' :
             article.category === 'health' ? 'Health & Medicine' :
             article.category === 'sustainability' ? 'Sustainability' :
             article.category === 'quantum' ? 'Quantum Computing' :
             article.category}
          </span>
        )}
        
        <div className="flex items-start justify-between pb-1 pt-2">
          {/* Title */}
          <h2 className="text-[#0e141b] tracking-light text-[28px] font-bold leading-tight text-left">
            {article.title}
          </h2>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className={`p-1 transition-colors ${isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            aria-label={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M5 5v14l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
            </svg>
          </button>
        </div>
        
        {/* Date and Read Time */}
        <div className="flex flex-wrap items-center gap-2 text-[#4e7097] text-sm font-normal leading-normal pb-3 pt-1">
          <span>{article.date}</span>
          {article.readTime && (
            <>
              <span className="text-gray-400">•</span>
              <span>{article.readTime}</span>
            </>
          )}
        </div>
        
        {/* Keywords/Tags */}
        {(article.keywords || article.tags) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-medium text-gray-500">Keywords:</span>
            {(article.keywords || article.tags || []).map((keyword: string, index: number) => (
              <a 
                key={index}
                href="#" 
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {keyword}
              </a>
            ))}
          </div>
        )}
        
        {/* Abstract */}
        {article.abstract && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
            <h3 className="text-lg font-bold text-[#0e141b] mb-2">Abstract</h3>
            <p className="text-[#0e141b] text-base font-normal leading-normal">
              {article.abstract}
            </p>
          </div>
        )}
      </div>

      {/* Article Image */}
      <div className="flex w-full grow bg-slate-50 py-3">
        <div className="w-full gap-1 overflow-hidden bg-slate-50 aspect-[3/2] flex relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse bg-gray-300 w-full h-full"></div>
            </div>
          )}
          
          <img
            src={getImageUrl()}
            alt={article.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Article Content Section - BELOW the image with Abstract-like styling */}
      {(article.content || article.article) && (
        <div className="px-4 mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
            <h3 className="text-lg font-bold text-[#0e141b] mb-2">Article Content</h3>
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-[#0e141b] text-base font-normal leading-normal"
                dangerouslySetInnerHTML={{ __html: article.content || article.article || '' }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional sections if available - BELOW the image */}
      {article.sections && article.sections.length > 0 && (
        <div className="px-4 mb-8">
          {article.sections.map((section: SectionType, index: number) => (
            <div key={section.id} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r mb-6">
              {section.title && (
                <h3 className="text-lg font-bold text-[#0e141b] mb-2">
                  {section.title}
                </h3>
              )}
              <div className="text-[#0e141b] text-base font-normal leading-normal">
                {renderSection(section)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read Full Article Section */}
      {article.paperLink && (
        <div className="mb-8 mx-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Read Full Article Here:</h3>
          <a 
            href={formatUrl(article.paperLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <ExternalLink size={16} />
            {article.paperLink}
          </a>
        </div>
      )}

      {/* YouTube Video */}
{article.youtubeUrl && toEmbed(article.youtubeUrl) && (
  <div className="mb-8 mx-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Video</h3>
    <div className="aspect-video">
      <iframe
        src={toEmbed(article.youtubeUrl)}
        title={article.title}
        className="w-full h-full rounded-lg"
        allowFullScreen
      />
    </div>
  </div>
)}

      {/* Comments Section with Like and Share on the same line */}
      <div className="px-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          {/* Left side - Comments label/title */}
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          
          {/* Right side - Like and Share buttons */}
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              disabled={toggleLikeMutation.isPending || isLikeLoading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                likeStatus?.isLiked 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${(toggleLikeMutation.isPending || isLikeLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              {likeStatus?.isLiked ? (
                <ThumbsUp className="w-4 h-4 fill-current text-green-600" />
              ) : (
                <ThumbsUp className="w-4 h-4 text-gray-600" />
              )}
              <span>
                {toggleLikeMutation.isPending 
                  ? 'Loading...' 
                  : likeStatus?.isLiked 
                    ? 'Liked' 
                    : 'Like'
                }
              </span>
            </button>

            {/* Share Button */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    <button
                      onClick={shareToFacebook}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      Facebook
                    </button>
                    
                    <button
                      onClick={shareToMessenger}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">💬</span>
                      </div>
                      Messenger
                    </button>
                    
                    <button
                      onClick={shareToTwitter}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">𝕏</span>
                      </div>
                      Twitter
                    </button>
                    
                    <button
                      onClick={shareToLinkedIn}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-blue-700 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      LinkedIn
                    </button>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-gray-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

  {/* Comments Section - Now without its own header */}
  <CommentSection researchNewsId={article.id} />
</div>

    </div>
  );
};
