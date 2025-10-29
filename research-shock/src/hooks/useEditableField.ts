'use client';

import { useState } from 'react';

export const useEditableField = (initialValue: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      stopEditing();
    }
  };

  return {
    isEditing,
    value,
    setValue,
    startEditing,
    stopEditing,
    handleKeyDown,
  };
};
