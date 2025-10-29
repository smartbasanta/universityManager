import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ResearchDetail } from '@/components/research-news/ResearchDetail';
import { websiteResearchNewsAPI } from '@/hooks/api/website/research-news.api';
import type { ResearchArticle } from '@/hooks/api/website/research-news.api';

interface PageProps {
  params: {
    id: string;
  };
}

// Server-side function to fetch article data
async function getResearchArticleById(id: string): Promise<ResearchArticle | null> {
  try {
    const article = await websiteResearchNewsAPI.fetchArticleById(id);
    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ResearchArticlePage({ params }: PageProps) {
  const article = await getResearchArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Transform the article data - remove sections assignment
  const transformedArticle: ResearchArticle = {
    ...article,
    // Ensure the image uses fallback if needed
    image: article.image || '/no-image.jpg',
  };

  return (
    <div 
      className="relative flex flex-col bg-slate-50 min-h-screen" 
      style={{ fontFamily: '"Public Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex flex-col">
        <Header />
        
        <div className="flex flex-1 justify-center py-5">
          <ResearchDetail article={transformedArticle} />
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const article = await getResearchArticleById(params.id);
  
  if (!article) {
    return {
      title: 'Research Article Not Found',
    };
  }

  return {
    title: `${article.title} - ResearchShock`,
    description: article.abstract,
    openGraph: {
      title: article.title,
      description: article.abstract,
      images: article.image && article.image !== '/no-image.jpg' ? [article.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.abstract,
      images: article.image && article.image !== '/no-image.jpg' ? [article.image] : [],
    },
  };
}
