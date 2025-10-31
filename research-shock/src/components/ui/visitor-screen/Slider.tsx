'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause } from 'lucide-react';
import { useSliderLogic } from '@/lib/useSlider';

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
  autoplayDelay = 5000,
}: SliderProps) => {
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  const {
    currentIndex,
    responsiveItemsPerView,
    currentGap,
    slideLeft,
    slideRight,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isPaused,
    setIsPaused,
    slideTo,
    isTransitioning,
    maxIndex,
  } = useSliderLogic({
    totalItems,
    itemsPerView,
    autoplay,
    autoplayDelay,
  });

  const totalDots = Math.ceil(totalItems / responsiveItemsPerView);
  const activeDot = Math.floor(currentIndex / responsiveItemsPerView);

  return (
    <div
      className={`w-full max-w-full space-y-6 ${className}`}
      onMouseEnter={() => autoplay && setIsPaused(true)}
      onMouseLeave={() => autoplay && setIsPaused(false)}
    >
      {/* Title + Controls */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          {autoplay && totalItems > responsiveItemsPerView && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 bg-white border border-gray-200 rounded-full transition-colors shadow-sm hover:shadow"
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" /> <span className="hidden md:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 fill-current" /> <span className="hidden md:inline">Pause</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={slideLeft}
              disabled={currentIndex === 0}
              className="group p-2.5 sm:p-3 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition-all disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600" />
            </button>
            <button
              onClick={slideRight}
              disabled={currentIndex === maxIndex}
              className="group p-2.5 sm:p-3 rounded-xl bg-white shadow-sm hover:shadow-md border border-gray-200 transition-all disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-600" />
            </button>
          </div>

          <Link
            href={viewAllLink}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl border border-blue-200 hover:border-blue-600 transition-all"
          >
            {viewAllText}
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

      {/* Carousel */}
      <div
        className="relative overflow-hidden w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / responsiveItemsPerView)}%)`,
            gap: `${currentGap}px`,
          }}
        >
          {childrenArray.map((child, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / responsiveItemsPerView}% - ${
                  ((responsiveItemsPerView - 1) * currentGap) / responsiveItemsPerView
                }px)`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {totalDots > 1 && (
        <div className="flex justify-center gap-2 pt-2">
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
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="flex justify-center">
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentIndex + 1} - {Math.min(currentIndex + responsiveItemsPerView, totalItems)} of {totalItems}
        </span>
      </div>
    </div>
  );
};
