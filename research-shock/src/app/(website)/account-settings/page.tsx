'use client';

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PersonalInfo } from '@/components/account-settings/PersonalInfo';
import { PasswordSection } from '@/components/account-settings/PasswordSection';
import { PrivacySection } from '@/components/account-settings/PrivacySection';
import { DangerZone } from '@/components/account-settings/DangerZone';
import { Footer } from '@/components/layout/Footer';


const mockUserData = {
  name: 'Prashant Panta',
  email: 'pantaprs03@gmail.com',
  phoneNumber: '',
  emailVerifiedDate: '2023-08-15',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIR5dZZ2lPgtEeqdMjYAjdcvoPrhlcQ2STtr6wTlK4N7jEKHL3IwunjqBCXTHpDFXdB1qiBW8kovfCXvwQAxvdZUcGEI6gi5jdpWPg1qsh0YPNwFWXjGcpfB3E27lgP1HZ-jAzKzeMgKgzM5envnkR3h2dDQuK2BMnZ0EcQ7YvrfM32E3thqQqdZnwAI3DRlqX8E2JNOLwUZcz3Np6Vpa34gqtcepUDFmb87uTEYQwH-KEUcYReT8NEzHYlciFmVg6Wzrqky-AhoEA',
};

export default function AccountSettingsPage() {
  return (
    <div 
      className="relative flex size-full min-h-screen flex-col bg-slate-50" 
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header at top level */}
        <DashboardHeader 
        />
        
        {/* Main content with consistent padding */}
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <h1 className="text-[#111518] tracking-light text-2xl md:text-[32px] font-bold leading-tight min-w-72">
                Settings
              </h1>
            </div>
            
            {/* Settings Sections */}
            <div className="space-y-6 px-4">
              <PersonalInfo initialData={mockUserData} />
              <PasswordSection />
              <PrivacySection />
              <DangerZone />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
