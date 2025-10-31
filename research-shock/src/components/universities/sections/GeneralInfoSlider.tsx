"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GeneralInfoSliderProps {
  children: React.ReactNode[];
}

export const GeneralInfoSlider = ({ children }: GeneralInfoSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
  };

  // Optional: Auto-slide functionality
  // useEffect(() => {
  //   const interval = setInterval(goToNext, 5000); // Change slide every 5 seconds
  //   return () => clearInterval(interval);
  // }, [currentIndex, children.length]);

  if (!children || children.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-md border border-gray-200 bg-white p-6">
      <div
        ref={sliderRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {children.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </>
      )}

      {children.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'} hover:bg-blue-400 transition-colors`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};
