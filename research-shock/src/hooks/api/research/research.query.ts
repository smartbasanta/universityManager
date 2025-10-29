import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { researchAPIService, CommentPostData, CommentUpdateData } from "./research.api";
import { toast } from "react-toastify";
import { isArray } from "util";

export function useAddResearchNews() {
  return useMutation({
    mutationFn: researchAPIService.addResearchNews,
    onSuccess: (data, variables) => {
      if (variables.status === "draft") {
        toast.success("Research news saved as draft successfully");
      } else if (variables.status === "published") {
        toast.success("Research news published successfully");
      }
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "An unknown error occurred");
      }
    },
  });
}

export function useGetResearchNewsByStatus(status: "draft" | "published" | "archived") {
  return useQuery({
    queryKey: ["research-news", status],
    queryFn: () => researchAPIService.getResearchNewsByStatus(status),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetResearchNewsById(id: string) {
  return useQuery({
    queryKey: ["research-news", id],
    queryFn: () => researchAPIService.getResearchNewsById(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateResearchNews() {
  return useMutation({
    mutationFn: researchAPIService.updateResearchNews,
    onSuccess: (data, variables) => {
      toast.success("Research news updated successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update research news");
      }
    },
  });
}

export function useDeleteResearchNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: researchAPIService.deleteResearchNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-news"] });
      queryClient.invalidateQueries({ queryKey: ["research-news", "draft"] });
      queryClient.invalidateQueries({ queryKey: ["research-news", "published"] });
      queryClient.invalidateQueries({ queryKey: ["research-news", "archived"] });
      
      toast.success("Research news deleted successfully");
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to delete research news");
      }
    },
  });
}

export function useUpdateResearchNewsStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      researchAPIService.updateResearchNewsStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["research-news"],
        exact: false 
      });
      
      const statusMessages: { [key: string]: string } = {
        'published': 'Research news moved to Live successfully',
        'archived': 'Research news moved to Archive successfully',
        'draft': 'Research news moved to Draft successfully'
      };
      
      toast.success(statusMessages[variables.status] || 'Research news status updated successfully');
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update research news status");
      }
    },
  });
}

// Comment-related hooks
export function usePostComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: researchAPIService.postComment,
    onSuccess: (data, variables) => {
      toast.success("Comment posted successfully");
      // Invalidate and refetch comments for the specific research news
      queryClient.invalidateQueries({ 
        queryKey: ["comments", "top-level", variables.researchNewsId] 
      });
      
      // If it's a reply, also invalidate the parent comment's replies
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({ 
          queryKey: ["comments", "replies", variables.parentCommentId] 
        });
      }
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to post comment");
      }
    },
  });
}

export function useGetTopLevelComments(researchNewsId: string) {
  return useQuery({
    queryKey: ["comments", "top-level", researchNewsId],
    queryFn: () => researchAPIService.getTopLevelComments(researchNewsId),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!researchNewsId,
    
  });
  
}


export function useGetCommentReplies(commentId: string, enabled = false) {
  return useQuery({
    queryKey: ["comments", "replies", commentId],
    queryFn: () => researchAPIService.getCommentReplies(commentId),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enabled && !!commentId,
  });
}

// NEW: Update comment hook
export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, commentData }: { commentId: string; commentData: CommentUpdateData }) => 
      researchAPIService.updateComment(commentId, commentData),
    onSuccess: (data) => {
      toast.success("Comment updated successfully");
      // Invalidate all comment-related queries to refresh the UI
      queryClient.invalidateQueries({ 
        queryKey: ["comments"],
        exact: false 
      });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update comment");
      }
    },
  });
}

// NEW: Delete comment hook
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: researchAPIService.deleteComment,
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      // Invalidate all comment-related queries to refresh the UI
      queryClient.invalidateQueries({ 
        queryKey: ["comments"],
        exact: false 
      });
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to delete comment");
      }
    },
  });
}

// Like/Unlike hooks - ADD THESE
export function useToggleLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: researchAPIService.toggleLike,
    onSuccess: (data, researchNewsId) => {
      // Invalidate the is-liked query for this specific research news
      queryClient.invalidateQueries({ 
        queryKey: ["research-news", "is-liked", researchNewsId] 
      });
      
      // Optional: Show success message
      toast.success(data.message || (data.liked ? "Liked successfully" : "Unliked successfully"));
    },
    onError: (err: any) => {
      if (isArray(err.response?.data?.message)) {
        err.response?.data?.message.forEach((message: any) => toast.error(message));
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to toggle like");
      }
    },
  });
}

export function useIsLiked(id: string) {
  return useQuery({
    queryKey: ["research-news", "is-liked", id],
    queryFn: () => researchAPIService.isLiked(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id, // Only run query if id exists
  });
}

