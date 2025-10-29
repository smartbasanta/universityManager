'use client';

import { useState } from 'react';
import { FormField } from '@/components/ui/visitor-screen/form-field';

interface PersonalInfoData {
  name: string;
  email: string;
  phoneNumber: string;
  emailVerifiedDate: string;
}

interface PersonalInfoProps {
  initialData?: PersonalInfoData;
}

export const PersonalInfo = ({ initialData }: PersonalInfoProps) => {
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');

  return (
    <div>
      <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Personal Information
      </h2>
      
      <div className="px-4 py-3 max-w-[480px]">
        <FormField 
          label="Name" 
          value={initialData?.name || 'Prashant Panta'} 
        />
        <FormField 
          label="Email" 
          value={initialData?.email || 'pantaprs03@gmail.com'} 
        />
        
        <p className="text-[#617689] text-sm font-normal pt-2">
          Email verified on {initialData?.emailVerifiedDate || '2023-08-15'}
        </p>
      </div>
      
      {/* Phone Number Input - Matching HTML exactly */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <p className="text-[#111518] text-base font-medium leading-normal pb-2">
            Phone Number
          </p>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111518] focus:outline-0 focus:ring-0 border border-[#dbe1e6] bg-white focus:border-[#dbe1e6] h-14 placeholder:text-[#617689] p-[15px] text-base font-normal leading-normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
          />
        </label>
      </div>
      <p className="text-[#617689] text-sm font-normal leading-normal pb-3 pt-1 px-4">
        Required for SMS alerts
      </p>
    </div>
  );
};
