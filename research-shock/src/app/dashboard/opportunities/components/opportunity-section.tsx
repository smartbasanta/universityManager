import { OpportunityItem } from "./opportunity-item";

interface OpportunitySectionProps {
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

export const OpportunitySection = ({ title, status, items }: OpportunitySectionProps) => {
  return (
    <div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      {items.map((item, index) => (
        <OpportunityItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          meta={item.meta}
          status={status} // Pass status to OpportunityItem
          showMoveToLive={item.showMoveToLive}
          showMoveToArchive={item.showMoveToArchive}
        />
      ))}
    </div>
  );
};
