import { axiosPublicInstance } from "@/api/axois-config";

// --- NEW INTERFACE (matches NestJS Entity) ---
export interface ResearchArticle {
  id: string;
  createdAt: string;
  title: string;
  abstract: string;
  featuredImage: { url: string; alt: string } | null;
  category: string;
  tags: string[];
  status: string;
}

export const websiteResearchNewsAPI = {
  fetchResearchNews: async (params: { limit?: number } = {}): Promise<{ data: ResearchArticle[] }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // --- CORRECTED ENDPOINT ---
      const response = await axiosPublicInstance.get(`/website/research-news?${queryParams.toString()}`);

      // Map data to match old component props
      const mappedData = response.data.map((article: any) => ({
        ...article,
        date: new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        excerpt: article.abstract,
        image: article.featuredImage?.url,
        readTime: `${Math.ceil(article.article?.length / 1500 || 2)} min read`,
        keywords: article.tags,
      }));
      return { data: mappedData };
    } catch (error) {
      console.error('Error fetching research news:', error);
      throw error;
    }
  },
};