// src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

// This hook takes a value and returns a debounced version of it.
// The returned value will only update after the specified delay has passed
// without the original value changing.
export function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over
    // This is the core of debouncing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}