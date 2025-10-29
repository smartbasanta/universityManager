import { MentorItem } from "./mentor-item";

interface MentorSectionProps {
  title: string;
  status: "awaiting-approval" | "live";
  items: {
    id?: string;
    title: string;
    meta: string;
  }[];
}

export const MentorSection = ({ title, status, items }: MentorSectionProps) => {
  return (
    <div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      {items.map((item, index) => (
        <MentorItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          meta={item.meta}
          status={status} // Pass status to MentorItem
        />
      ))}
    </div>
  );
};
