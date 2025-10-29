import { AmbassadorItem } from "./ambassador-item";

interface AmbassadorSectionProps {
  title: string;
  status: "awaiting-approval" | "live";
  items: {
    id?: string;
    title: string;
    meta: string;
  }[];
}

export const AmbassadorSection = ({ title, status, items }: AmbassadorSectionProps) => {
  return (
    <div>
      <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        {title}
      </h3>
      {items.map((item, index) => (
        <AmbassadorItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          meta={item.meta}
          status={status} // Pass status to AmbassadorItem
        />
      ))}
    </div>
  );
};
