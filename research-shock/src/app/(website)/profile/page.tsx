'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { useAuthStore } from '@/stores';

export default function ProfilePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Get store values
  const { pp, info, role, fetchUserInfo } = useAuthStore();
  console.log('Environment check:');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
console.log('BASE_URL:', process.env.BASE_URL);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch user info when component mounts (after hydration)
  useEffect(() => {
    if (isHydrated && !info) {
      fetchUserInfo();
    }
  }, [isHydrated, info, fetchUserInfo]);

  // Extract individual properties from the info object safely
  const userName = info?.name || info?.username || info?.firstName || '';
  const userTitle = info?.title || info?.position || role || '';
  const userLocation = info?.location || info?.address || '';

  const handleProfileUpdate = async (field: string, value: string | File) => {
    if (field === 'avatar' && value instanceof File) {
      const newAvatarUrl = URL.createObjectURL(value);
      useAuthStore.getState().setPp(newAvatarUrl);
    } else if (typeof value === 'string') {
      // Update the info object with new values
      const currentInfo = useAuthStore.getState().info || {};
      useAuthStore.getState().setInfo({
        ...currentInfo,
        [field]: value
      });
    }
  };

  const handlePasswordUpdate = async (oldPassword: string, newPassword: string) => {
    console.log({
      message: 'API call to update password would be made here',
      oldPassword,
      newPassword,
    });
    alert('Password update sent! Check the browser console.');
  };

  if (!isHydrated) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
        <Header/>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <Header/>
      
      <main className="flex-1 px-6 py-5">
        <div className="max-w-[960px] mx-auto">
          <div className="px-4 sm:px-8 md:px-20 lg:px-40 py-5">
            <div className="max-w-[512px] mx-auto">
              <ProfileInfo
                name={userName} 
                title={userTitle}
                location={userLocation}
                avatar={pp || null}
                onUpdate={handleProfileUpdate}
                onPasswordUpdate={handlePasswordUpdate}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
