import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  showEditButton?: boolean;
  onEdit?: () => void;
}

export const ProfileAvatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', className, showEditButton = false, onEdit, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8 md:h-10 md:w-10',
      md: 'h-16 w-16 md:h-20 md:w-20',
      lg: 'h-24 w-24 md:h-32 md:w-32',
    };

    return (
      <div 
        ref={ref}
        className={cn('relative group', className)}
        {...props}
      >
        <div
          className={cn(
            'bg-center bg-no-repeat aspect-square bg-cover rounded-full',
            sizeClasses[size]
          )}
          style={{ backgroundImage: `url("${src}")` }}
          role="img"
          aria-label={alt}
        />
        {showEditButton && (
          <button
            onClick={onEdit}
            className="absolute bottom-1 right-1 bg-white border rounded-full p-1 shadow hidden group-hover:block"
            title="Edit Photo"
          >
            ✏️
          </button>
        )}
      </div>
    );
  }
);

ProfileAvatar.displayName = 'Avatar';
