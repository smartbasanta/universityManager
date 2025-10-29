'use client';

import { IconBrandLinkedin } from '@tabler/icons-react';
import { useEditableField } from '@/hooks/useEditableField';

interface ProfileContactProps {
  linkedin: string;
  onUpdate: (linkedin: string) => void;
}

export const ProfileContact = ({ linkedin, onUpdate }: ProfileContactProps) => {
  const linkedinField = useEditableField(linkedin);

  const handleSave = () => {
    onUpdate(linkedinField.value);
    linkedinField.stopEditing();
  };

  return (
    <>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Contact
      </h3>
      <div className="group relative">
        <div className="flex items-center gap-4 bg-white px-4 min-h-14">
          <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10">
            <IconBrandLinkedin size={24} />
          </div>
          <div className="flex-1 flex items-center gap-2">
            {!linkedinField.isEditing ? (
              <p className="flex-1 truncate text-base text-[#111418]">
                {linkedinField.value}
              </p>
            ) : (
              <input
                value={linkedinField.value}
                onChange={(e) => linkedinField.setValue(e.target.value)}
                className="flex-1 border px-2 py-1 text-sm rounded text-[#111418]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') linkedinField.stopEditing();
                }}
                onBlur={handleSave}
              />
            )}
            <button
              onClick={linkedinField.startEditing}
              className="text-blue-500 text-sm bg-white border rounded-full p-1 shadow hidden group-hover:block"
            >
              ✏️
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
