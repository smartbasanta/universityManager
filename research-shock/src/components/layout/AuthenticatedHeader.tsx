'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Notification } from '@/types/profile/profile';
import { NotificationDropdown, NotificationItem as NotificationDropdownItem } from '@/components/ui/visitor-screen/notification'; 


interface AuthenticatedHeaderProps {
  avatar?: string;
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

export const AuthenticatedHeader = ({ 
  avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqutJR3CPy5eQzjR5rOwpgD-RMXkvtxnu_U2Kdvaz1d2XN7wbrjfviH_eiBs1ayXJBlOD6qkyQst37yH7CEowIWSSHEOrZ-u93cK1S0-4HIws3gVIML1XGuK2g2xD6naeYCNQ970zyxgozgZ3Y_6xThamlKO4mQxu9QfUpBuVyceuHPNhPrTz9OX8iy9XwajFuh5MujRbSUOKk6tcRe6GpAvS2xQ6MTrSBDUa0lXfyy0HXV0TAcoL1VI9ucVIVewdykmVQSQZ9VeDl',
  notifications = [],
  onNotificationClick,
  onMarkAsRead
}: AuthenticatedHeaderProps) => {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getNavItemClass = (href: string) => {
    const isActive = pathname.startsWith(href);
    return isActive 
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/*<img 
              src="/images/logo.svg" 
              alt="ResearchShock Logo" 
              className="w-8 h-8 mr-2"
            /> */}
            <a href="/" className="font-bold text-xl text-gray-800">ResearchShock</a>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            <a 
              className={getNavItemClass('/landing/research-news')} 
              href="/landing/research-news"
            >
              Research News
            </a>
            <a 
              className={getNavItemClass('/landing/universities')} 
              href="/landing/universities"
            >
              Universities
            </a>
            <a 
              className={getNavItemClass('/landing/scholarships')} 
              href="/landing/scholarships"
            >
              Scholarships
            </a>
            <a 
              className={getNavItemClass('/landing/jobs')} 
              href="/landing/jobs"
            >
              Jobs
            </a>
            <a 
              className={getNavItemClass('/landing/ambassadors')} 
              href="/landing/ambassadors"
            >
              Ambassadors
            </a>
            <a 
              className={getNavItemClass('/landing/mentors')} 
              href="/landing/mentors"
            >
              Mentors
            </a>
            <a 
              className={getNavItemClass('/landing/opportunity-hub')} 
              href="/landing/opportunity-hub"
            >
              Opportunity Hub
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
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
                className="focus:outline-none"
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${avatar}")` }}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <a href="/landing/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="/landing/news-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Applied</a>
                  <a href="/landing/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account Settings</a>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
