'use client';

import { Button } from '@/components/ui/button';

export const PasswordSection = () => {
  const handleChangePassword = () => {
    console.log('Change password clicked');
  };

  return (
    <div>
      <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Password
      </h2>
      
      <div className="flex px-4 py-3 justify-start">
        <Button
          variant="outline"
          onClick={handleChangePassword}
          className="bg-[#f0f2f4] text-[#111518] hover:bg-[#e8eaec]"
        >
          Change Password
        </Button>
      </div>
    </div>
  );
};
