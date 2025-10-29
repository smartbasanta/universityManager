'use client';

import { useState } from 'react';
import { Toggle } from '@/components/ui/visitor-screen/toggle';

export const PrivacySection = () => {
  const [hideProfile, setHideProfile] = useState(false);

  return (
    <div>
      <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Privacy & Visibility
      </h2>
      
      <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
        <div className="flex flex-col justify-center flex-1">
          <p className="text-[#111518] text-base font-medium leading-normal line-clamp-1">
            Hide profile during hover
          </p>
          <p className="text-[#617689] text-sm font-normal leading-normal line-clamp-2">
            Hide your profile preview when someone hovers over your name.
          </p>
        </div>
        <div className="shrink-0">
          <Toggle
            checked={hideProfile}
            onChange={setHideProfile}
          />
        </div>
      </div>
    </div>
  );
};
