import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  // Original props for backward compatibility
  basePath?: string;
  baseLabel?: string;
  currentName?: string;
  // New flexible approach
  items?: BreadcrumbItem[];
  // Additional props for enhanced functionality
  showHome?: boolean;
  separator?: string;
}

export const Breadcrumb = ({ 
  basePath, 
  baseLabel, 
  currentName, 
  items,
  showHome = false,
  separator = "/"
}: BreadcrumbProps) => {
  // Build breadcrumb items
  let breadcrumbItems: BreadcrumbItem[] = [];
  
  if (showHome) {
    breadcrumbItems.push({ label: 'Home', href: '/' });
  }
  
  if (items) {
    breadcrumbItems = [...breadcrumbItems, ...items];
  } else if (basePath && baseLabel) {
    breadcrumbItems.push({ label: baseLabel, href: basePath });
  }

  return (
    <nav className="flex flex-wrap gap-2 p-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-[#5c738a] text-base font-medium leading-normal mx-2">
                {separator}
              </span>
            )}
            <Link 
              href={item.href} 
              className="text-[#5c738a] text-base font-medium leading-normal hover:text-[#3f7fbf] transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
        
        {currentName && (
          <li className="flex items-center">
            <span className="text-[#5c738a] text-base font-medium leading-normal mx-2">
              {separator}
            </span>
            <span className="text-[#101418] text-base font-medium leading-normal">
              {currentName}
            </span>
          </li>
        )}
        
        {items && !currentName && (
          <li className="flex items-center">
            <span className="text-[#5c738a] text-base font-medium leading-normal mx-2">
              {separator}
            </span>
            <span className="text-[#101418] text-base font-medium leading-normal">
              Book Session
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};
