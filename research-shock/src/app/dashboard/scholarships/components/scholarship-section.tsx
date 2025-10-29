// components/scholarship-section.tsx
import { ScholarshipItem } from "./scholarship-item";

interface ScholarshipSectionProps {
  title: string;
  status: string; // Add status prop
  items: {
    id?: string;
    title: string;
    meta: string;
    showMoveToLive?: boolean;
    showMoveToArchive?: boolean;
  }[];
}

export const ScholarshipSection = ({ title, status, items }: ScholarshipSectionProps) => {
  return (
    <div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      {items.map((item, index) => (
        <ScholarshipItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          meta={item.meta}
          status={status} // Pass status to ScholarshipItem
          showMoveToLive={item.showMoveToLive}
          showMoveToArchive={item.showMoveToArchive}
        />
      ))}
    </div>
  );
};
