'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause } from 'lucide-react';

interface SliderProps {
  title: string;
  itemsPerView?: number;
  children: React.ReactNode;
  viewAllLink: string;
  viewAllText?: string;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export const Slider = ({ 
  title, 
  itemsPerView = 3, 
  children, 
  viewAllLink, 
  viewAllText = 'View All',
  className = '',
  autoplay = false,
  autoplayDelay = 5000
}: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView);
  
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  
  // Calculate max index to prevent cutting cards
  const maxIndex = Math.max(0, totalItems - responsiveItemsPerView);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveItemsPerView(1);
      } else if (width < 1024) {
        setResponsiveItemsPerView(Math.min(2, itemsPerView));
      } else {
        setResponsiveItemsPerView(itemsPerView);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  // Smooth slide function with boundary check
  const slideTo = useCallback((index: number) => {
    if (isTransitioning) return;
    
    // Ensure we don't go past boundaries
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    
    if (newIndex === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [currentIndex, maxIndex, isTransitioning]);

  const slideLeft = () => {
    if (currentIndex > 0) {
      slideTo(currentIndex - 1);
    }
  };
  
  const slideRight = () => {
    if (currentIndex < maxIndex) {
      slideTo(currentIndex + 1);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < maxIndex) {
      slideRight();
    }
    if (isRightSwipe && currentIndex > 0) {
      slideLeft();
    }

    setTouchStart(0);
    setTouchEnd(0);
    setIsPaused(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') slideLeft();
      if (e.key === 'ArrowRight') slideRight();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, maxIndex]);

  // Autoplay functionality
  useEffect(() => {
    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    // Don't start autoplay if paused or not enough items
    if (!autoplay || isPaused || totalItems <= responsiveItemsPerView) {
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // Loop back to start when reaching the end
        return next > maxIndex ? 0 : next;
      });
    }, autoplayDelay);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, isPaused, autoplayDelay, maxIndex, totalItems, responsiveItemsPerView]);

  // Calculate dots
  const totalDots = Math.ceil(totalItems / responsiveItemsPerView);
  const activeDot = Math.floor(currentIndex / responsiveItemsPerView);

  // Toggle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Dynamic gap based on breakpoint (to match Tailwind classes)
  const getCurrentGap = () => {
    if (window.innerWidth < 640) return 16; // gap-4 = 1rem = 16px
    return 24; // sm:gap-6 = 1.5rem = 24px
  };

  const currentGap = getCurrentGap();

  return (
    <div 
      className={`w-full max-w-full space-y-6 ${className}`}
      onMouseEnter={() => autoplay && setIsPaused(true)}
      onMouseLeave={() => autoplay && setIsPaused(false)}
    >
      {/* Header Row: Title + Controls */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          {autoplay && totalItems > responsiveItemsPerView && (
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 bg-white border border-gray-200 rounded-full transition-colors shadow-sm hover:shadow"
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? (
                <Play className="w-3 h-3 fill-current" />
              ) : (
                <Pause className="w-3 h-3 fill-current" />
              )}
              <span className="hidden md:inline">{isPaused ? 'Play' : 'Pause'}</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={slideLeft}
              disabled={currentIndex === 0}
              className="group p-2.5 sm:p-3 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
            </button>
            <button
              onClick={slideRight}
              disabled={currentIndex === maxIndex}
              className="group p-2.5 sm:p-3 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>

          {/* View All Link - Desktop */}
          <Link
            href={viewAllLink}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl border border-blue-200 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <span>{viewAllText}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      {totalItems > responsiveItemsPerView && (
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
          />
        </div>
      )}

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden w-full max-w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out w-full max-w-full"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
          }}
        >
          {childrenArray.map((child, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-full max-w-full"
              style={{ 
                width: `calc(${100 / responsiveItemsPerView}% - ${((responsiveItemsPerView - 1) * currentGap) / responsiveItemsPerView}px)`
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View All Button */}
      <Link
        href={viewAllLink}
        className="sm:hidden flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
      >
        <span>{viewAllText}</span>
        <ExternalLink className="w-4 h-4" />
      </Link>

      {/* Dot Indicators */}
      {totalDots > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => slideTo(idx * responsiveItemsPerView)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                idx === activeDot 
                  ? 'w-8 h-2 bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Item Counter */}
      <div className="flex justify-center">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentIndex + 1} - {Math.min(currentIndex + responsiveItemsPerView, totalItems)} of {totalItems}
        </span>
      </div>
    </div>
  );
};