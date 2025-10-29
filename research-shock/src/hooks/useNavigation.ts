'use client';

import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  const getMenuItems = () => [
    { 
      label: 'Profile', 
      onClick: () => navigateToPage('/landing/profile')
    },
    { 
      label: 'Dashboard', 
      onClick: () => navigateToPage('/landing/news-dashboard')
    },
    { 
      label: 'Saved', 
      onClick: () => navigateToPage('/landing/saved')
    },
    { 
      label: 'Applied', 
      onClick: () => navigateToPage('/landing/applied')
    },
    { 
      label: 'Account Setting', 
      onClick: () => navigateToPage('/landing/account-settings')
    },
    { 
      label: 'Logout', 
      onClick: () => {
        // Handle logout logic
        console.log('Logout clicked');
        // router.push('/login');
      },
      className: 'text-red-600'
    },
  ];

  return {
    navigateToPage,
    getMenuItems,
  };
};
