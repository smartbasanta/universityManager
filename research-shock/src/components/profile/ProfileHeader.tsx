'use client';

import { ProfileAvatar } from '@/components/ui/visitor-screen/profile-avatar';
import { Dropdown } from '@/components/ui/visitor-screen/profile-dropdown';
import { NotificationDropdown } from '../ui/visitor-screen/notification';
import { useNavigation } from '@/hooks/useNavigation';
import type { Notification } from '@/types/profile/profile';

interface ProfileHeaderProps {
  avatar: string;
  notifications: Notification[];
}

export const ProfileHeader = ({ avatar, notifications }: ProfileHeaderProps) => {
  const { getMenuItems } = useNavigation();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3e7e8] px-4 md:px-10 py-3">
      <div className="flex flex-1 justify-end gap-2 md:gap-8">
        <div className="flex gap-2 relative">
          <NotificationDropdown
            notifications={notifications}
            onNotificationClick={(notification) => console.log('Notification clicked:', notification.id)}
            onMarkAsRead={(id) => console.log('Mark as read:', id)}
          />
          
          <Dropdown
            trigger={
              <button className="focus:outline-none">
                <ProfileAvatar 
                  src={avatar} 
                  alt="User avatar" 
                  size="sm" 
                />
              </button>
            }
            items={getMenuItems()}
          />
        </div>
      </div>
    </header>
  );
};
