import { axiosPrivateInstance } from "@/api/axois-config";
import { fixPhotoUrl } from '@/utils/imageUtils';
import { useAuthStore } from "@/stores";

const researchAPIRoutes = {
  addResearchNews: "/research-news",
  getResearchNewsByStatus: (status: string) => `/research-news?status=${status}`,
  getResearchNewsById: (id: string) => `/research-news/${id}`,
  updateResearchNews: (id: string) => `/research-news/${id}`,
  deleteResearchNews: (id: string) => `/research-news/${id}`,
  updateResearchNewsStatus: (id: string) => `/research-news/${id}`,

  toggleLike: (id: string) => `/research-news/toggle-like/${id}`,
  isLiked: (id: string) => `/research-news/is-liked/${id}`,
  
  // Comment API routes
  postComment: "/research-news/comment",
  getTopLevelComments: (researchNewsId: string) => `/research-news/comment/top-level/${researchNewsId}`,
  getCommentReplies: (commentId: string) => `/research-news/comment/replies/${commentId}`,
  updateComment: (id: string) => `/research-news/comments/${id}`,
  deleteComment: (id: string) => `/research-news/comments/${id}`,
};

export interface LikeToggleResponse {
  liked: boolean;
  message: string;
}

export interface IsLikedResponse {
  isLiked: boolean;
}

// Comment-related interfaces based on your API response
export interface CommentPostData {
  text: string;
  researchNewsId: string;
  parentCommentId?: string;
}

export interface CommentUpdateData {
  text?: string;
}

export interface CommentAPIResponse {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
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
  researchNewsId?: string;
  parentCommentId?: string;
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
  isOwnComment?: boolean;
}

export interface CommentsResponse {
  data: CommentAPIResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

const getUserAvatar = (student: CommentAPIResponse['student']): string => {
 
  
  // Priority order: pp -> photo -> default
  const avatarUrl =  student?.photo;
  
  if (avatarUrl && typeof avatarUrl === 'string') {
    // Handle relative paths
    if (avatarUrl.startsWith('/uploads/')) {
      const baseUrl ='http://localhost:4000';
      const fullUrl = `${baseUrl}${avatarUrl}`;
      return fixPhotoUrl(fullUrl);
    }
    
    // Handle URLs that might contain "undefined"
    const fixedUrl = fixPhotoUrl(avatarUrl);
    if (fixedUrl) {
      return fixedUrl;
    }
  }
  
  // Default avatar for students
  return '/ambassador-default.png';
};


const getUserName = (student: CommentAPIResponse['student']): string => {
  return student?.name || 'Anonymous User';
};

const formatCommentDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const transformComment = (apiComment: CommentAPIResponse, currentUserId?: any): Comment => {
  console.log('Transform Comment Debug:', {
    commentStudentId: apiComment.student?.id,
    currentUserId: currentUserId,
    isMatch: apiComment.student?.id === currentUserId
  });
  
  return {
    id: apiComment.id,
    author: getUserName(apiComment.student),
    avatar: getUserAvatar(apiComment.student),
    date: formatCommentDate(apiComment.createdAt),
    content: apiComment.text,
    likes: apiComment.likesCount || 0,
    dislikes: apiComment.dislikesCount || 0,
    replies: [], // Replies are loaded separately
    isOwnComment: currentUserId ? apiComment.student?.id === currentUserId : false
  };
};

export const researchAPIService = {
  addResearchNews: async (newsData: any) => {
    const response = await axiosPrivateInstance.post(researchAPIRoutes.addResearchNews, newsData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },

  getResearchNewsByStatus: async (status: string) => {
    const response = await axiosPrivateInstance.get(researchAPIRoutes.getResearchNewsByStatus(status));
    return response.data;
  },

  getResearchNewsById: async (id: string) => {
    const response = await axiosPrivateInstance.get(researchAPIRoutes.getResearchNewsById(id));
    return response.data;
  },

  updateResearchNews: async (newsData: any) => {
    const { id, ...updateData } = newsData;
    const response = await axiosPrivateInstance.patch(researchAPIRoutes.updateResearchNews(id), updateData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },

  updateResearchNewsStatus: async (id: string, status: string) => {
    const response = await axiosPrivateInstance.patch(researchAPIRoutes.updateResearchNewsStatus(id), 
      { status }, 
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  },

  deleteResearchNews: async (id: string) => {
    const response = await axiosPrivateInstance.delete(researchAPIRoutes.deleteResearchNews(id));
    return response.data;
  },

  // Comment API methods updated for your actual API structure (same pattern as university reviews)
  postComment: async (commentData: CommentPostData): Promise<Comment> => {
    const response = await axiosPrivateInstance.post(researchAPIRoutes.postComment, commentData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    // Get current user info for ownership determination
    let currentUserId: any;
    try {
      const userResponse = await axiosPrivateInstance.get('/auth/user-info');
      currentUserId = userResponse.data.id || 
                     userResponse.data.student?.id ||
                     userResponse.data.studentId;
    } catch (error) {
      console.error('Could not get current user info:', error);
    }
    
    return transformComment(response.data, currentUserId);
  },

  getTopLevelComments: async (researchNewsId: string): Promise<Comment[]> => {
    const response = await axiosPrivateInstance.get(researchAPIRoutes.getTopLevelComments(researchNewsId));
    const comments = response.data || [];
    
    // Get current user info for ownership determination
    let currentUserId: any;
    try {
      const userResponse = await axiosPrivateInstance.get('/auth/user-info');
      console.log('Full User Response:', userResponse.data);
      
      // Try different possible user ID fields
      currentUserId = userResponse.data.id || 
                     userResponse.data.student?.id ||
                     userResponse.data.studentId;
      
      console.log('Current User ID:', currentUserId);
    } catch (error) {
      console.error('User info fetch failed:', error);
    }
    
    return comments.map((comment: CommentAPIResponse) => transformComment(comment, currentUserId));
  },

  getCommentReplies: async (commentId: string): Promise<Comment[]> => {
    const response = await axiosPrivateInstance.get(researchAPIRoutes.getCommentReplies(commentId));
    const replies = response.data || [];
    
    // Get current user info for ownership determination
    let currentUserId: any;
    try {
      const userResponse = await axiosPrivateInstance.get('/auth/user-info');
      currentUserId = userResponse.data.id || 
                     userResponse.data.student?.id ||
                     userResponse.data.studentId;
    } catch (error) {
      console.error('User info fetch failed:', error);
    }
    
    return replies.map((reply: CommentAPIResponse) => transformComment(reply, currentUserId));
  },

  updateComment: async (commentId: string, commentData: CommentUpdateData): Promise<Comment> => {
    const response = await axiosPrivateInstance.patch(researchAPIRoutes.updateComment(commentId), commentData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    // Get current user info for ownership determination
    let currentUserId: any;
    try {
      const userResponse = await axiosPrivateInstance.get('/auth/user-info');
      currentUserId = userResponse.data.id || 
                     userResponse.data.student?.id ||
                     userResponse.data.studentId;
    } catch (error) {
      console.error('Could not get current user info:', error);
    }
    
    return transformComment(response.data, currentUserId);
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await axiosPrivateInstance.delete(researchAPIRoutes.deleteComment(commentId));
  },
    toggleLike: async (id: string): Promise<LikeToggleResponse> => {
    const response = await axiosPrivateInstance.post(researchAPIRoutes.toggleLike(id));
    return response.data;
  },

  isLiked: async (id: string): Promise<IsLikedResponse> => {
    const response = await axiosPrivateInstance.get(researchAPIRoutes.isLiked(id));
    return response.data;
  },
};
