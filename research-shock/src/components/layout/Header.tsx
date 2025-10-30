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
  Bell, 
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
  Target, 
  Search
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
      ? "text-primary font-semibold border-b-2 border-primary pb-1 flex items-center gap-1"
      : "text-muted-foreground hover:text-primary transition-colors flex items-center gap-1";
  };

  const getMobileNavItemClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "text-primary font-semibold bg-primary/5 border-l-4 border-primary"
      : "text-foreground hover:text-primary hover:bg-muted";
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
        <rect width="40" height="40" fill="var(--primary)" rx="20"/>
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
        <rect width="40" height="40" fill="var(--primary)" rx="20"/>
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
    { href: '/', label: 'Home', icon: Home },
    { href: '/research-news', label: 'Research News', icon: Newspaper },
    { href: '/universities', label: 'Universities', icon: GraduationCap },
    { href: '/scholarships', label: 'Scholarships', icon: Award },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    // { href: '/ambassadors', label: 'Ambassadors', icon: Users2 },
    { href: '/mentors', label: 'Mentors', icon: Users2 },
    { href: '/opportunity-hub', label: 'Opportunity Hub', icon: Target },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-border/20">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left aligned */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="font-bold text-foreground text-xl hover:text-primary transition-colors flex items-center gap-2">
                ResearchShock
              </Link>
            </div>
            
            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex space-x-8 items-center flex-1 justify-center">
              {navigationItems.slice(0, 8).map((item) => { // Limit to 5 for space, rest in dropdown if needed
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href}
                    className={`${getNavItemClass(item.href)} text-sm whitespace-nowrap`}
                    href={item.href}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            {/* Right side - Desktop */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {!isAuth && <AuthModals />}

              {isAuth && (
                <>
                  {info?.name && !isLoading && (
                    <span className="hidden xl:block text-sm text-muted-foreground">
                      Welcome, {getUserName()}
                    </span>
                  )}

                  <div className="relative">
                    <NotificationDropdown
                      notifications={notifications as NotificationDropdownItem[]}
                      onNotificationClick={handleNotificationClick}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                      }}
                      className="focus:outline-none relative p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <img
                        src={getAvatar()}
                        alt={getUserName()}
                        className="rounded-full size-10 object-cover border-2 border-border hover:border-ring transition-colors"
                        onError={(e) => {
                          console.log('Avatar failed to load, using fallback');
                          e.currentTarget.src = getAvatarFallback();
                        }}
                      />
                      {isLoading && (
                        <div className="absolute inset-0 bg-muted rounded-full animate-pulse"></div>
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-background rounded-full"></div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {info && (
                          <div className="px-4 py-3 border-b border-border">
                            <div className="flex items-center space-x-3">
                              <img
                                src={getAvatar()}
                                alt={getUserName()}
                                className="w-10 h-10 rounded-full object-cover border border-border"
                                onError={(e) => {
                                  e.currentTarget.src = getAvatarFallback();
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {getUserName()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getRoleDisplayName()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="py-1">
                          {role === 'student' ? (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href="/saved" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href={getDashboardRoute()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">📊</span> Dashboard
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">✅</span> Applied
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors w-full">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          )}
                          
                          <div className="border-t border-border mt-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
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
                      onNotificationClick={handleNotificationClick}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowMobileMenu(false);
                      }}
                      className="focus:outline-none relative p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <img
                        src={getAvatar()}
                        alt={getUserName()}
                        className="rounded-full size-8 object-cover border border-border"
                        onError={(e) => {
                          e.currentTarget.src = getAvatarFallback();
                        }}
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-success border border-background rounded-full"></div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                        {/* Similar user menu as desktop, but compact */}
                        {info && (
                          <div className="px-4 py-3 border-b border-border">
                            <div className="flex items-center space-x-3">
                              <img
                                src={getAvatar()}
                                alt={getUserName()}
                                className="w-8 h-8 rounded-full object-cover border border-border"
                                onError={(e) => {
                                  e.currentTarget.src = getAvatarFallback();
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {getUserName()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getRoleDisplayName()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="py-1">
                          {role === 'student' ? (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href="/saved" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <User className="w-4 h-4" /> Profile
                              </Link>
                              <Link href={getDashboardRoute()} className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">📊</span> Dashboard
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">⭐</span> Saved
                              </Link>
                              <Link href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">✅</span> Applied
                              </Link>
                              <Link href="/account-settings" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors w-full">
                                <span className="w-4 h-4">⚙️</span> Settings
                              </Link>
                            </>
                          )}
                          
                          <div className="border-t border-border mt-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
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
                  setShowNotifications(false);
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md">
          <div 
            ref={mobileMenuRef}
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-card shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto border-l border-border"
          >
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                    className={`${getMobileNavItemClass(item.href)} block px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-3`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {!isAuth && (
              <div className="px-4 py-6 border-t border-border">
                <div className="space-y-3">
                  <AuthModals />
                </div>
              </div>
            )}

            <div className="p-4 border-t border-border bg-muted/50 mt-auto">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">© 2024 ResearchShock. </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};