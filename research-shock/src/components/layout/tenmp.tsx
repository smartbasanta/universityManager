'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuth';
import { AuthModals } from './AuthModals';
import { useMobile } from '@/hooks/use-mobile';
import type { Notification } from '@/types/profile/profile';
import { fixPhotoUrl } from '@/utils/imageUtils';
import { NotificationDropdown, NotificationItem as NotificationDropdownItem } from '@/components/ui/visitor-screen/notification';
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Newspaper, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Users2, 
  Target
} from 'lucide-react';

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

  const handleLogout = () => {
    try {
      setShowUserMenu(false);
      setShowMobileMenu(false);
      clearAll();
      logout();
      
      localStorage.removeItem("rToken");
      sessionStorage.removeItem("rToken");
      localStorage.removeItem("auth-store");
      sessionStorage.removeItem("auth-store");
      
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
    { href: '/research-news', label: 'Research News', icon: Newspaper },
    { href: '/universities', label: 'Universities', icon: GraduationCap },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/mentors', label: 'Mentors', icon: Users2 },
    { href: '/opportunity-hub', label: 'Opportunities', icon: Target },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full border-b border-gray-200">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-40">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="font-bold text-gray-900 text-xl hover:text-blue-600 transition-colors">
                ResearchShock
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center flex-1 justify-center">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href}
                    className={`${getNavItemClass(item.href)} text-sm whitespace-nowrap flex items-center gap-2`}
                    href={item.href}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {!isAuth && <AuthModals />}

              {isAuth && (
                <>
                  {info?.name && !isLoading && (
                    <span className="hidden xl:block text-sm text-gray-600">
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
                          e.currentTarget.src = getAvatarFallback();
                        }}
                      />
                      {isLoading && (
                        <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {info && (
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <img
                                src={getAvatar()}
                                alt={getUserName()}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.src = getAvatarFallback();
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {getUserName()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getRoleDisplayName()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="py-1">
                          {role === 'student' ? (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href="/saved" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href={getDashboardRoute()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="w-4 h-4">📊</span> Dashboard
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          )}
                          
                          <div className="border-t border-gray-100 mt-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
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
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
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
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {getUserName()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {getRoleDisplayName()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="py-1">
                          {role === 'student' ? (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href="/saved" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href={getDashboardRoute()} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <span className="w-4 h-4">📊</span> Dashboard
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          )}
                          
                          <div className="border-t border-gray-100 mt-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
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
                }}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - FIXED */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-4 py-6 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${getMobileNavItemClass(item.href)} flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {!isAuth && (
              <div className="px-4 py-6 border-t border-gray-200">
                <AuthModals />
              </div>
            )}

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-center text-gray-500">© 2024 ResearchShock</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};