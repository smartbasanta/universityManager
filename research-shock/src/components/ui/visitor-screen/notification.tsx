'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from './profile-button';

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
  href?: string;
  onClick?: () => void;
}

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  className?: string;
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export const NotificationDropdown = ({
  notifications,
  className,
  onNotificationClick,
  onMarkAsRead,
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.onClick) {
      notification.onClick();
    }
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <IconButton
          ref={buttonRef}
          icon={<Bell size={20} />}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown Menu - Updated width and layout */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 max-w-sm rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-2 text-sm text-gray-700 space-y-1">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface NotificationItemProps {
  notification: NotificationItem;
  onClick: () => void;
}

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const Component = notification.href ? 'a' : 'button';
  
  return (
    <Component
      href={notification.href}
      onClick={onClick}
      className={cn(
        'w-full text-left block px-4 py-2 hover:bg-gray-100 transition-colors',
        !notification.read && 'bg-blue-50'
      )}
    >
      {/* Updated layout to match HTML structure exactly */}
      <div className="flex items-start justify-between gap-3">
        <span 
          className={cn(
            'text-sm w-[85%] break-words',
            notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'
          )}
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
    </Component>
  );
};

// Simple Notification Bell Component (alternative simpler version)
interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export const NotificationBell = ({ 
  count = 0, 
  onClick, 
  className 
}: NotificationBellProps) => {
  return (
    <div className={cn('relative', className)}>
      <IconButton
        icon={<Bell size={20} />}
        aria-label={`Notifications${count > 0 ? ` (${count})` : ''}`}
        onClick={onClick}
      />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};
