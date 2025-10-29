'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuth';
import type { Notification } from '@/types/profile/profile';
import { fixPhotoUrl } from '@/utils/imageUtils';
import { NotificationDropdown, NotificationItem as NotificationDropdownItem } from '@/components/ui/visitor-screen/notification';

interface DashboardHeaderProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

export const DashboardHeader = ({ 
  notifications = [],
  onNotificationClick,
  onMarkAsRead
}: DashboardHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get data from auth store
  const { 
    isAuth, 
    info, 
    role, 
    isLoading, 
    logout, 
    clearAll,
    fetchUserInfo 
  } = useAuthStore();

  // Fetch user info if authenticated but no info available
  useEffect(() => {
      if (isAuth && !info && !isLoading) {
    fetchUserInfo();
  }
}, [isAuth, info, isLoading, fetchUserInfo]);

  const getNavItemClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-gray-600 hover:text-blue-600";
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    } else {
      console.log('Notification clicked:', notification.id);
    }
    setShowNotifications(false);
  };

  const handleMarkAsRead = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    } else {
      console.log('Mark as read:', id);
    }
  };

  // Enhanced logout function
  const handleLogout = () => {
    try {
      console.log('Logging out user...');
      
      // Close the user menu
      setShowUserMenu(false);
      
      // Clear all auth data from the store
      clearAll();
      
      // Call the logout method (this should clear tokens from storage)
      logout();
      
      // Clear any additional storage items if needed
      localStorage.removeItem("rToken");
      sessionStorage.removeItem("rToken");
      localStorage.removeItem("auth-store");
      sessionStorage.removeItem("auth-store");
      
      console.log('Logout successful, redirecting to homepage...');
      
      // Redirect to homepage
      router.push('/');
      
      // Optional: Force reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still redirect to homepage
      router.push('/');
    }
  };

  // Helper functions
  const getUserName = () => {
    return info?.name || 'User';
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case 'university':
        return 'University';
      case 'institution':
        return 'Institution';
      case 'student_ambassador':
        return 'Student Ambassador';
      case 'mentor':
        return 'Mentor';
      case 'student':
        return 'Student';
      default:
        return 'User';
    }
  };

  // Function to get university/role initials (keeping the original SVG logic for dashboard)
  const getUniversityInitials = (name: string | undefined) => {
    if (!name) return 'UN'; // Default if no name
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2) // Take first 2 initials
      .join('');
  };

  // Function to generate avatar (keeping original logic - NOT using ambassador-default.png)
 const getAvatar = () => {
   
   // Access pp directly from the auth store, not from info.pp
   const { pp } = useAuthStore.getState();
   
   if (pp && typeof pp === 'string') {
     const correctedPhotoUrl = fixPhotoUrl(pp);
     if (correctedPhotoUrl) {
       console.log('Using corrected pp URL:', correctedPhotoUrl);
       return correctedPhotoUrl;
     }
   }
    
    // If no photo available, create initials avatar (original dashboard logic)
    const initials = getUniversityInitials(info?.name);
    
    // Create a data URL for an SVG with initials
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" fill="#3B82F6" rx="20"/>
        <text x="20" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getDashboardRoute = () => {
    switch (role) {
      case 'university':
        return '/dashboard';
      case 'institution':
        return '/dashboard';
      case 'student_ambassador':
        return '/dashboard';
      case 'mentor':
        return '/dashboard';
      case 'student':
        return '/';
      default:
        return '/dashboard';
    }
  };

  // Don't render if not authenticated
  if (!isAuth) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="font-bold text-xl text-gray-800">ResearchShock</a>
          </div>
          
          <nav className="hidden lg:flex space-x-6 items-center">
            <a 
              className={`${getNavItemClass('/research-news')} text-sm`}
              href="/research-news"
            >
              Research News
            </a>
            <a 
              className={`${getNavItemClass('/universities')} text-sm`}
              href="/universities"
            >
              Universities
            </a>
            <a 
              className={`${getNavItemClass('/scholarships')} text-sm`}
              href="/scholarships"
            >
              Scholarships
            </a>
            <a 
              className={`${getNavItemClass('/jobs')} text-sm`}
              href="/jobs"
            >
              Jobs
            </a>
            <a 
              className={`${getNavItemClass('/ambassadors')} text-sm`}
              href="/ambassadors"
            >
              Ambassadors
            </a>
            <a 
              className={`${getNavItemClass('/mentors')} text-sm`}
              href="/mentors"
            >
              Mentors
            </a>
            <a 
              className={`${getNavItemClass('/opportunity-hub')} text-sm`}
              href="/opportunity-hub"
            >
              Opportunity Hub
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* User name display */}
            {info?.name && !isLoading && (
              <span className="hidden md:block text-sm text-gray-700">
                Welcome, {getUserName()}
              </span>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <NotificationDropdown
                notifications={notifications as NotificationDropdownItem[]}
                onNotificationClick={onNotificationClick}
                onMarkAsRead={onMarkAsRead}
              />

              {showNotifications && (
                <div className="absolute right-0 mt-2 min-w-[18rem] max-w-sm rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900">
                            Notifications
                          </h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left block px-4 py-2 hover:bg-gray-100 transition-colors ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <span 
                                  className={`text-sm w-[85%] break-words ${
                                    notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'
                                  }`}
                                >
                                  {notification.message}
                                </span>
                                <span className="text-xs text-gray-400 text-nowrap whitespace-nowrap flex-shrink-0">
                                  {notification.timestamp}
                                </span>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="focus:outline-none relative"
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ 
                    backgroundImage: `url("${getAvatar()}")` 
                  }}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                )}
                {/* Online status indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {/* User Info Section */}
                  {info && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 bg-center bg-no-repeat bg-cover rounded-full"
                          style={{ backgroundImage: `url("${getAvatar()}")` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getUserName()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getRoleDisplayName()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href={getDashboardRoute()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Applied</a>
                  <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                  
                  {/* Functional Logout Button */}
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    type="button"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
