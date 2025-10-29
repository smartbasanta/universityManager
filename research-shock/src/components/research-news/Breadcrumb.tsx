import Link from 'next/link';

interface BreadcrumbProps {
  articleTitle: string;
}

export const Breadcrumb = ({ articleTitle }: BreadcrumbProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Link 
        href="/research-news" 
        className="text-[#4e7097] text-base font-medium leading-normal hover:text-blue-600"
      >
        Research News
      </Link>
      <span className="text-[#4e7097] text-base font-medium leading-normal">/</span>
      <span className="text-[#0e141b] text-base font-medium leading-normal">{articleTitle}</span>
    </div>
  );
};
