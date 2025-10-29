'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuth';
import { AuthModals } from './AuthModals';
import { useMobile } from '@/hooks/use-mobile'; // Import your hook
import type { Notification } from '@/types/profile/profile';
import { fixPhotoUrl } from '@/utils/imageUtils';
import { NotificationDropdown, NotificationItem as NotificationDropdownItem } from '@/components/ui/visitor-screen/notification';

interface HeaderProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

export const Header = ({ 
  notifications = [],
  onNotificationClick,
  onMarkAsRead
}: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMobile();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const getNavItemClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-gray-600 hover:text-blue-600";
  };

  const getMobileNavItemClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "text-blue-600 font-semibold bg-blue-50 border-l-4 border-blue-600"
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50";
  };

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
      
      // Close all menus
      setShowUserMenu(false);
      setShowMobileMenu(false);
      
      // Clear all auth data from the store
      clearAll();
      
      // Call the logout method
      logout();
      
      // Clear storage items
      localStorage.removeItem("rToken");
      sessionStorage.removeItem("rToken");
      localStorage.removeItem("auth-store");
      sessionStorage.removeItem("auth-store");
      
      console.log('Logout successful, redirecting to homepage...');
      
      // Redirect to homepage
      router.push('/');
      
      // Force reload for clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout:', error);
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

  // Function to get initials for non-student roles (same as dashboard header)
  const getUserInitials = (name: string | undefined) => {
    if (!name) {
      // Role-specific default initials
      switch (role) {
        case 'university': return 'UN';
        case 'institution': return 'IN';
        case 'student_ambassador': return 'SA';
        case 'mentor': return 'ME';
        default: return 'U';
      }
    }
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Updated avatar function with role-based logic
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
    
    // For students, use ambassador-default.png
    if (role === 'student') {
      return '/ambassador-default.png';
    }
    
    // For other roles (university, institution, mentor, student_ambassador), generate SVG initials
    const initials = getUserInitials(info?.name);
    
    // Create a data URL for an SVG with initials (same as dashboard header)
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" fill="#3B82F6" rx="20"/>
        <text x="20" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Fallback for onError - different logic for students vs other roles
  const getAvatarFallback = () => {
  if (role === 'student') {
    return '/ambassador-default.png';
  }
    
    // For other roles, generate SVG initials as fallback
    const initials = getUserInitials(info?.name);
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

  // Navigation items
  const navigationItems = [
    { href: '/research-news', label: 'Research News' },
    { href: '/universities', label: 'Universities' },
    { href: '/scholarships', label: 'Scholarships' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/ambassadors', label: 'Ambassadors' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/opportunity-hub', label: 'Opportunity Hub' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className={`font-bold text-gray-800 ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>
              ResearchShock
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navigationItems.map((item) => (
              <a 
                key={item.href}
                className={`${getNavItemClass(item.href)} text-sm`}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          {/* Right side - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuth && <AuthModals />}

            {isAuth && (
              <>
                {/* User name display - show for all authenticated roles */}
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
                    <img
                      src={getAvatar()}
                      alt={getUserName()}
                      className="rounded-full size-10 object-cover border-2 border-gray-200"
                      onError={(e) => {
                        console.log('Avatar failed to load, using fallback');
                        e.currentTarget.src = getAvatarFallback();
                      }}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {info && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getAvatar()}
                              alt={getUserName()}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = getAvatarFallback();
                              }}
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

                      {role === 'student' ? (
                        <>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                          <a href="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                          <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                        </>
                      ) : (
                        <>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                          <a href={getDashboardRoute()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Applied</a>
                          <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                        </>
                      )}
                      
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
              </>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Auth/User Section */}
            {isAuth ? (
              <>
                {/* Mobile Notifications */}
                <div className="relative">
                  <NotificationDropdown
                    notifications={notifications as NotificationDropdownItem[]}
                    onNotificationClick={onNotificationClick}
                    onMarkAsRead={onMarkAsRead}
                  />
                </div>

                {/* Mobile User Avatar */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowMobileMenu(false);
                    }}
                    className="focus:outline-none relative"
                  >
                    <img
                      src={getAvatar()}
                      alt={getUserName()}
                      className="rounded-full size-8 object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = getAvatarFallback();
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
                  </button>

                  {/* Mobile User Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {info && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getAvatar()}
                              alt={getUserName()}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = getAvatarFallback();
                              }}
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

                      {/* Same menu logic as desktop */}
                      {role === 'student' ? (
                        <>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                          <a href="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                          <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                        </>
                      ) : (
                        <>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                          <a href={getDashboardRoute()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Applied</a>
                          <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                        </>
                      )}
                      
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
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <AuthModals />
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowUserMenu(false);
                setShowNotifications(false);
              }}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${showMobileMenu ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Rest of the component remains the same */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-6 space-y-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`${getMobileNavItemClass(item.href)} block px-4 py-3 text-base font-medium rounded-lg transition-colors`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              {!isAuth && (
                <div className="px-4 py-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <AuthModals />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500">© 2024 ResearchShock</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
