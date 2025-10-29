import Link from 'next/link';
import { ResearchArticle } from '@/types/research/research';

interface ResearchCardProps {
  article: ResearchArticle;
}

export const ResearchCard = ({ article }: ResearchCardProps) => {
  return (
    <Link href={`/landing/research-news/${article.id}`}>
      <div className="flex flex-col gap-3 pb-3 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg overflow-hidden">
        <div
          className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover"
          style={{ backgroundImage: `url("${article.image}")` }}
        />
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block bg-[#e4ecf7] text-[#1a2e55] text-xs font-medium px-2 py-1 rounded-full">
              {article.category}
            </span>
            {article.readTime && (
              <span className="text-[#637588] text-xs">
                {article.readTime}
              </span>
            )}
          </div>
          <h3 className="text-[#111418] text-base font-medium leading-normal line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-[#637588]">
            <span>By {article.author}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
