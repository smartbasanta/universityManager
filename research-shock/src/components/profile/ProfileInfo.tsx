'use client';

import { useState, useRef } from 'react';
import { ProfileAvatar } from '@/components/ui/visitor-screen/profile-avatar';
import { useEditableField } from '@/hooks/useEditableField';
import { axiosPrivateInstance } from '@/api/axois-config';
import { useAuthStore } from '@/stores';
import { fixPhotoUrl } from '@/utils/imageUtils';

interface ProfileInfoProps {
  name: string | null;
  title: string | null;
  location: string | null;
  avatar: string | null;
  onUpdate: (field: string, value: string | File) => void;
  onPasswordUpdate: (oldPassword: string, newPassword: string) => void;
}

export const ProfileInfo = ({ name, title, avatar, onUpdate, onPasswordUpdate }: ProfileInfoProps) => {
  const titleField = useEditableField(title || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Get pp from auth store
  const { setPp, pp } = useAuthStore();

  // Function to get the correct avatar URL
  const getProfileAvatar = () => {
    console.log('ProfileInfo - pp from store:', pp);
    console.log('ProfileInfo - avatar prop:', avatar);
    
    // Prioritize pp from auth store over avatar prop
    const avatarUrl = pp || avatar;
    
    if (avatarUrl && typeof avatarUrl === 'string') {
      const correctedUrl = fixPhotoUrl(avatarUrl);
      if (correctedUrl) {
        console.log('ProfileInfo - Using corrected URL:', correctedUrl);
        return correctedUrl;
      }
    }
    
    console.log('ProfileInfo - Using default avatar');
    return '/ambassador-default.png';
  };

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosPrivateInstance.patch('/auth/update-profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get the avatar URL from server response
      let serverAvatarUrl = response.data.avatarUrl || response.data.photo;
      
      console.log('Raw avatar URL from server:', serverAvatarUrl);
      
      // Fix the photo URL if it contains 'undefined'
      if (serverAvatarUrl) {
        const fixedAvatarUrl = fixPhotoUrl(serverAvatarUrl);
        console.log('Fixed avatar URL:', fixedAvatarUrl);
        
        // Update the store with the corrected URL
        setPp(fixedAvatarUrl);
        
        // Also call the parent update handler with the corrected URL
        onUpdate('avatar', fixedAvatarUrl);
      } else {
        // Fallback to local URL if no server URL
        const localUrl = URL.createObjectURL(file);
        setPp(localUrl);
        onUpdate('avatar', localUrl);
      }
      
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setUploadError('Failed to upload avatar. Please try again.');
      
      // Fallback: use local URL for immediate UI feedback
      const localUrl = URL.createObjectURL(file);
      onUpdate('avatar', localUrl);
      
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!oldPassword || !newPassword) {
      setError('Both fields are required.');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    try {
      await onPasswordUpdate(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setIsPasswordFormVisible(false);
    } catch (error) {
      setError('Failed to update password. Please check your old password and try again.');
    }
  };

  const handleCancelPasswordChange = () => {
    setIsPasswordFormVisible(false);
    setOldPassword('');
    setNewPassword('');
    setError('');
  };

  return (
    <div className="flex p-4 w-full">
      <div className="flex w-full flex-col gap-4 items-center">
        <div className="flex gap-4 flex-col items-center">
          <div className="relative">
            <ProfileAvatar
              src={getProfileAvatar()} // Use the function instead of just avatar prop
              alt={name || 'Profile avatar'}
              size="lg"
              showEditButton={!isUploading}
              onEdit={handleAvatarEditClick}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif, image/webp"
            disabled={isUploading}
          />

          {uploadError && (
            <p className="text-sm text-red-600 text-center">{uploadError}</p>
          )}

          <div className="flex flex-col items-center justify-center">
            <p className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">
              {name || 'Guest User'}
            </p>
          </div>

          <div className="group relative">
            <div className="flex-1 flex items-center gap-2">
              <p className="text-[#60758a] text-base flex-1">
                {titleField.value || 'No title set'}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-6 border-t pt-6">
          {!isPasswordFormVisible ? (
            <button
              onClick={() => setIsPasswordFormVisible(true)}
              className="w-full text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-gray-900">Update Your Password</h3>
              
              <div>
                <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your new password (min. 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
