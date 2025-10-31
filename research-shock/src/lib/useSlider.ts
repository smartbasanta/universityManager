'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSliderLogicProps {
  totalItems: number;
  itemsPerView: number;
  autoplay: boolean;
  autoplayDelay: number;
}

export const useSliderLogic = ({
  totalItems,
  itemsPerView,
  autoplay,
  autoplayDelay,
}: UseSliderLogicProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [responsiveItemsPerView, setResponsiveItemsPerView] = useState(itemsPerView);
  const [currentGap, setCurrentGap] = useState(24);

  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const maxIndex = Math.max(0, totalItems - responsiveItemsPerView);

  // --- Responsive logic
  useEffect(() => {
    const updateResponsive = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      if (width < 640) setResponsiveItemsPerView(1);
      else if (width < 1024) setResponsiveItemsPerView(Math.min(2, itemsPerView));
      else setResponsiveItemsPerView(itemsPerView);

      setCurrentGap(width < 640 ? 16 : 24);
    };

    updateResponsive();
    window.addEventListener('resize', updateResponsive);
    return () => window.removeEventListener('resize', updateResponsive);
  }, [itemsPerView]);

  // --- Slide control
  const slideTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      const newIndex = Math.max(0, Math.min(index, maxIndex));
      if (newIndex === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [currentIndex, maxIndex, isTransitioning]
  );

  const slideLeft = () => slideTo(currentIndex - 1);
  const slideRight = () => slideTo(currentIndex + 1);

  // --- Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const start = touchStartRef.current;
    const end = touchEndRef.current;
    if (!start || !end) return;
    const distance = start - end;
    if (distance > 50) slideRight();
    if (distance < -50) slideLeft();
    touchStartRef.current = 0;
    touchEndRef.current = 0;
    setIsPaused(false);
  };

  useEffect(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);

    if (!autoplay || isPaused || totalItems <= responsiveItemsPerView) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, autoplayDelay);

    return () => autoplayRef.current && clearInterval(autoplayRef.current);
  }, [autoplay, isPaused, autoplayDelay, responsiveItemsPerView, maxIndex, totalItems]);

  return {
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
  };
};
