'use client';

import { useEditableField } from '@/hooks/useEditableField';

interface ProfileBioProps {
  bio: string;
  onUpdate: (bio: string) => void;
}

export const ProfileBio = ({ bio, onUpdate }: ProfileBioProps) => {
  const bioField = useEditableField(bio);

  const handleSave = () => {
    onUpdate(bioField.value);
    bioField.stopEditing();
  };

  return (
    <div className="group relative px-4">
      <div className="relative">
        <h3 className="text-[#111418] text-lg font-bold">Bio</h3>
        {!bioField.isEditing ? (
          <p className="text-base pt-1">{bioField.value}</p>
        ) : (
          <textarea
            value={bioField.value}
            onChange={(e) => bioField.setValue(e.target.value)}
            className="w-full border px-2 py-1 mt-2 rounded text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleSave();
              if (e.key === 'Escape') bioField.stopEditing();
            }}
            onBlur={handleSave}
          />
        )}
        <button
          onClick={bioField.startEditing}
          className="absolute right-0 top-0 text-blue-500 text-sm bg-white border rounded-full p-1 shadow hidden group-hover:block"
        >
          ✏️
        </button>
      </div>
    </div>
  );
};
