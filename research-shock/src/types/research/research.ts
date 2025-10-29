export interface ResearchArticle {
  id: string;
  title: string;
  author?: string;
  authorLink?: string;
  institution?: string;
  institutionLink?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  readTime?: string;
  tags?: string[];
  status?: 'published' | 'featured' | 'trending' | 'draft' | 'archived';
  keywords?: string[];
  paperLink?: string;
  doi?: string;
  abstract?: string;
  content?: string;
  sections?: ResearchSection[];
  // API specific fields
  createdAt?: string;
  updatedAt?: string;
  featuredImage?: string;
  youtubeUrl?: string | null;
  article?: string;
  auth?: any | null;
}

export interface ResearchSection {
  id: string;
  title?: string;
  content?: string;
  type: 'text' | 'list' | 'grid' | 'timeline' | 'quote' | 'callout';
  items?: string[];
  gridItems?: GridItem[];
  timelineItems?: TimelineItem[];
  quote?: {
    text: string;
    author: string;
  };
}

export interface GridItem {
  title: string;
  description: string;
  highlight?: string;
}

export interface TimelineItem {
  phase?: string;
  title: string;
  description: string;
  status?: 'completed' | 'current' | 'planned';
}

// Updated Comment interface to match your API schema
export interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  student: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    address: string;
    photo: string;
    phone: string;
    date_of_birth: string;
  };
  likes?: number;
  dislikes?: number;
  replies?: Comment[];
  isOwnComment?: boolean;
}

export interface CategoryFilter {
  id: string;
  label: string;
  count?: number;
  isActive?: boolean;
}

export interface SearchFilters {
  query: string;
  category: string;
  sortBy: 'date' | 'relevance' | 'popularity';
  dateRange?: {
    from: string;
    to: string;
  };
}

// Additional interfaces for API compatibility
export interface Tag {
  id: string;
  label: string;
  count?: number;
}

export interface ResearchNewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
  status?: string;
}

export interface ResearchNewsResponse {
  data: ResearchArticle[];
  total: number;
  page: number;
  limit: number;
}
