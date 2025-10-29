import { axiosPublicInstance } from "@/api/axois-config";

export interface ResearchNewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
  status?: string;
}

export interface ResearchArticle {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  abstract: string;
  featuredImage: string;
  youtubeUrl: string | null;
  article: string;
  category: string;
  tags: string[];
  paperLink: string;
  status: string;
  auth: any | null;
  // Computed fields for display compatibility
  author?: string;
  date?: string;
  excerpt?: string;
  image?: string;
  readTime?: string;
  keywords?: string[];
  content?: string;
  authorLink?: string;
  institution?: string;
  institutionLink?: string;
  doi?: string;
}

export interface ResearchNewsResponse {
  data: ResearchArticle[];
  total: number;
  page: number;
  limit: number;
}

export interface TagsResponse {
  data: string[];
}

// Comment-related interfaces
export interface CommentPostData {
  text: string;
  researchNewsId: string;
  parentCommentId?: string;
}

export interface CommentAPIResponse {
  id: string;
  text: string;
  researchNewsId: string;
  parentCommentId?: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  dislikesCount?: number;
  repliesCount?: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export interface CommentsResponse {
  data: CommentAPIResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

// Helper function to get valid image URL
const getValidImageUrl = (featuredImage: string | null | undefined): string => {
  if (!featuredImage || 
      featuredImage === 'undefinedundefined' || 
      featuredImage === 'undefined' || 
      featuredImage === 'null' || 
      featuredImage.trim() === '') {
    return '/no-image.jpg';
  }
  return featuredImage;
};

// Helper function to get user avatar
const getUserAvatar = (user: CommentAPIResponse['user']): string => {
  if (user?.avatar) return user.avatar;
  if (user?.profileImage) return user.profileImage;
  // Default avatar
  return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwMf-CnIhrNtEolQ7A5bQmtId2vOfGm9bykNNZLvgcgg-5_UgMNboHDZSNBROUr8GFPFek_TevA7GhP8UJ8NYqkF380UQ1222juVQSGHGHGNs8O0HtpgLczHJ0hFxl6PK6hiaE27EHzlq853dfQzliSzTS6B8w82g1LLYzTi4H6Twg4c7PGrE8DS59P8s4WzJejMW5U7aUjtfR5lxZaBFqVRu39f4tsJTD6qJTn_MztZUdCRGGjM--pPC4a8NnUG8fJYOnQKM8qPI';
};

// Helper function to get user name
const getUserName = (user: CommentAPIResponse['user']): string => {
  if (user?.name) return user.name;
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
  if (user?.firstName) return user.firstName;
  return 'Anonymous User';
};

// Helper function to format date
const formatCommentDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to transform API comment to UI comment
const transformComment = (apiComment: CommentAPIResponse): Comment => ({
  id: apiComment.id,
  author: getUserName(apiComment.user),
  avatar: getUserAvatar(apiComment.user),
  date: formatCommentDate(apiComment.createdAt),
  content: apiComment.text,
  likes: apiComment.likesCount || 0,
  dislikes: apiComment.dislikesCount || 0,
  replies: [] // Replies are loaded separately
});

export const websiteResearchNewsAPI = {
  fetchResearchNews: async (params: ResearchNewsQueryParams): Promise<ResearchNewsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }
      if (params.tags && params.tags.length > 0) {
        params.tags.forEach(tag => queryParams.append('tags', tag));
      }
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      
      queryParams.append('status', 'published');

      const response = await axiosPublicInstance.get(`/research-news/website/all?${queryParams.toString()}`);
      
      const transformedData = {
        ...response.data,
        data: response.data.data
          ?.filter((article: ResearchArticle) => article.status === 'published')
          ?.map((article: ResearchArticle) => ({
            ...article,
            author: article.auth?.name || article.auth?.firstName + ' ' + article.auth?.lastName || 'Unknown Author',
            date: new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            excerpt: article.abstract || '',
            image: getValidImageUrl(article.featuredImage),
            readTime: article.article 
              ? `${Math.max(1, Math.ceil(article.article.replace(/<[^>]*>/g, '').length / 200))} min read`
              : '1 min read',
            keywords: article.tags || [],
            content: article.article || '',
          })) || []
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching research news:', error);
      throw error;
    }
  },

  fetchTags: async (): Promise<string[]> => {
    try {
      const response = await axiosPublicInstance.get('/research-news/website/tags');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },

  fetchArticleById: async (id: string): Promise<ResearchArticle> => {
    try {
      const response = await axiosPublicInstance.get(`/research-news/website/${id}`);
      
      if (response.data.status !== 'published') {
        throw new Error('Article not found or not published');
      }
      
      const article: ResearchArticle = {
        ...response.data,
        author: response.data.auth?.name || response.data.auth?.firstName + ' ' + response.data.auth?.lastName || 'Unknown Author',
        authorLink: response.data.auth?.profileLink || '#',
        institution: response.data.auth?.institution || 'Research Institution',
        institutionLink: response.data.auth?.institutionLink || '#',
        date: new Date(response.data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        excerpt: response.data.abstract || '',
        image: getValidImageUrl(response.data.featuredImage),
        readTime: response.data.article 
          ? `${Math.max(1, Math.ceil(response.data.article.replace(/<[^>]*>/g, '').length / 200))} min read`
          : '1 min read',
        keywords: response.data.tags || [],
        content: response.data.article || '',
        doi: response.data.doi || '',
      };
      
      return article;
    } catch (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
  },

  verifyPublishedStatus: (articles: ResearchArticle[]): boolean => {
    return articles.every((article: ResearchArticle) => article.status === 'published');
  },

  // Comment-related API functions
  postComment: async (commentData: CommentPostData): Promise<Comment> => {
    try {
      const response = await axiosPublicInstance.post('/research-news/comment', commentData);
      return transformComment(response.data);
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  },

  fetchTopLevelComments: async (researchNewsId: string): Promise<Comment[]> => {
    try {
      const response = await axiosPublicInstance.get(`/research-news/comment/top-level/${researchNewsId}`);
      const comments = response.data.data || response.data || [];
      return comments.map((comment: CommentAPIResponse) => transformComment(comment));
    } catch (error) {
      console.error('Error fetching top-level comments:', error);
      throw error;
    }
  },

  fetchCommentReplies: async (commentId: string): Promise<Comment[]> => {
    try {
      const response = await axiosPublicInstance.get(`/research-news/comment/replies/${commentId}`);
      const replies = response.data.data || response.data || [];
      return replies.map((reply: CommentAPIResponse) => transformComment(reply));
    } catch (error) {
      console.error('Error fetching comment replies:', error);
      throw error;
    }
  }
};
