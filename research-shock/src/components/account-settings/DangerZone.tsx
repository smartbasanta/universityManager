'use client';

import { Button } from '@/components/ui/button';

export const DangerZone = () => {
  const handleExportData = () => {
    console.log('Export data clicked');
  };

  const handleDeactivateAccount = () => {
    console.log('Deactivate account clicked');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account clicked');
  };

  return (
    <div>
      <h2 className="text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Danger Zone
      </h2>
      
      <div className="space-y-3">
        <div className="flex px-4 py-3 justify-start">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="bg-[#f0f2f4] text-[#111518] hover:bg-[#e8eaec]"
          >
            Export Data
          </Button>
        </div>
        
        <div className="flex px-4 py-3 justify-start">
          <Button
            variant="destructive"
            onClick={handleDeactivateAccount}
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            Deactivate Account
          </Button>
        </div>
        
        <div className="flex px-4 py-3 justify-start">
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};
