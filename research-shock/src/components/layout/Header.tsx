'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuth';
import { AuthModals } from './AuthModals';
import { useMobile } from '@/hooks/use-mobile';
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
  
  const { 
    isAuth, 
    info, 
    role, 
    isLoading, 
    logout, 
    clearAll,
    fetchUserInfo 
  } = useAuthStore();

  useEffect(() => {
    if (isAuth && !info && !isLoading) {
      fetchUserInfo();
    }
  }, [isAuth, info, isLoading, fetchUserInfo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const getNavItemClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-gray-600 hover:text-blue-600 transition-colors";
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

  const handleLogout = () => {
    try {
      console.log('Logging out user...');
      
      setShowUserMenu(false);
      setShowMobileMenu(false);
      clearAll();
      logout();
      
      localStorage.removeItem("rToken");
      sessionStorage.removeItem("rToken");
      localStorage.removeItem("auth-store");
      sessionStorage.removeItem("auth-store");
      
      console.log('Logout successful, redirecting to homepage...');
      router.push('/');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Error during logout:', error);
      router.push('/');
    }
  };

  const getUserName = () => {
    return info?.name || 'User';
  };

  const getRoleDisplayName = () => {
    switch (role) {
      case 'university': return 'University';
      case 'institution': return 'Institution';
      case 'student_ambassador': return 'Student Ambassador';
      case 'mentor': return 'Mentor';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  const getUserInitials = (name: string | undefined) => {
    if (!name) {
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

  const getAvatar = () => {
    const { pp } = useAuthStore.getState();
    
    if (pp && typeof pp === 'string') {
      const correctedPhotoUrl = fixPhotoUrl(pp);
      if (correctedPhotoUrl) {
        console.log('Using corrected pp URL:', correctedPhotoUrl);
        return correctedPhotoUrl;
      }
    }
    
    if (role === 'student') {
      return '/ambassador-default.png';
    }
    
    const initials = getUserInitials(info?.name);
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" fill="#3B82F6" rx="20"/>
        <text x="20" y="26" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getAvatarFallback = () => {
    if (role === 'student') {
      return '/ambassador-default.png';
    }
    
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
      case 'institution':
      case 'student_ambassador':
      case 'mentor':
        return '/dashboard';
      case 'student':
        return '/';
      default:
        return '/dashboard';
    }
  };

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
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-40 mx-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo - Left aligned */}
              <div className="flex items-center flex-shrink-0">
                <a href="/" className="font-bold text-gray-800 text-xl hover:text-blue-600 transition-colors">
                  ResearchShock
                </a>
              </div>
              
              {/* Desktop Navigation - Center */}
              <nav className="hidden lg:flex space-x-6 items-center flex-1 justify-center">
                {navigationItems.map((item) => (
                  <a 
                    key={item.href}
                    className={`${getNavItemClass(item.href)} text-sm whitespace-nowrap`}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              
              {/* Right side - Desktop */}
              <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
                {!isAuth && <AuthModals />}

                {isAuth && (
                  <>
                    {info?.name && !isLoading && (
                      <span className="hidden xl:block text-sm text-gray-700">
                        Welcome, {getUserName()}
                      </span>
                    )}

                    <div className="relative">
                      <NotificationDropdown
                        notifications={notifications as NotificationDropdownItem[]}
                        onNotificationClick={onNotificationClick}
                        onMarkAsRead={onMarkAsRead}
                      />
                    </div>

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
                          className="rounded-full size-10 object-cover border-2 border-gray-200 hover:border-blue-400 transition-colors"
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
                              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</a>
                              <a href="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Saved</a>
                              <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Account Settings</a>
                            </>
                          ) : (
                            <>
                              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</a>
                              <a href={getDashboardRoute()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Dashboard</a>
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Saved</a>
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Applied</a>
                              <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Account Settings</a>
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
                {isAuth ? (
                  <>
                    <div className="relative">
                      <NotificationDropdown
                        notifications={notifications as NotificationDropdownItem[]}
                        onNotificationClick={onNotificationClick}
                        onMarkAsRead={onMarkAsRead}
                      />
                    </div>

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
                              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</a>
                              <a href="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Saved</a>
                              <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Account Settings</a>
                            </>
                          ) : (
                            <>
                              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Profile</a>
                              <a href={getDashboardRoute()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Dashboard</a>
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Saved</a>
                              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Applied</a>
                              <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Account Settings</a>
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

                <button
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    setShowUserMenu(false);
                    setShowNotifications(false);
                  }}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
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
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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

            {!isAuth && (
              <div className="px-4 py-6 border-t border-gray-200">
                <div className="space-y-3">
                  <AuthModals />
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
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