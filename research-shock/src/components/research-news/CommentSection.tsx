'use client';

import { useState } from 'react';
import { Comment } from '@/types/research/research';
import { CommentForm } from './CommentForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { ReportModal } from './ReportModal';
import { useAuthStore } from '@/stores/useAuth';
import { 
  useGetTopLevelComments, 
  usePostComment, 
  useGetCommentReplies,
  useUpdateComment,
  useDeleteComment
} from '@/hooks/api/research/research.query';
import { Edit2, Trash2 } from 'lucide-react';

interface CommentSectionProps {
  researchNewsId: string;
}

export const CommentSection = ({ researchNewsId }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [loadedReplies, setLoadedReplies] = useState<Set<string>>(new Set());
  const { isAuth, role, info } = useAuthStore();

  const isOwner = (comment: Comment) => {
      return isAuth && 
            role === 'student' && 
            comment.student?.id === info?.id;
    };
  
  // TanStack Query hooks
  const { 
    data: comments = [], 
    isLoading: commentsLoading, 
    error: commentsError,
    refetch: refetchComments
  } = useGetTopLevelComments(researchNewsId);
  
  
  const postCommentMutation = usePostComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    commentId: string;
    parentId?: string;
    commentText?: string;
    isReply?: boolean;
  }>({
    isOpen: false,
    commentId: '',
    commentText: '',
    isReply: false
  });
  
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    commentId: string;
    commentText?: string;
    author?: string;
  }>({
    isOpen: false,
    commentId: '',
    commentText: '',
    author: ''
  });

  // Handle new top-level comment
  const handleNewComment = async (content: string) => {
    try {
      await postCommentMutation.mutateAsync({
        text: content,
        researchNewsId
      });
    } catch (error) {
      throw error;
    }
  };

  // Handle reply to comment
  const handleReply = async (parentId: string, content: string) => {
    try {
      await postCommentMutation.mutateAsync({
        text: content,
        researchNewsId,
        parentCommentId: parentId
      });
      
      setReplyingTo(null);
    } catch (error) {
      throw error;
    }
  };

  // Handle edit comment
  const handleEditComment = (commentId: string, currentText: string) => {
    setEditingComment(commentId);
    setEditText(currentText);
  };

  // Handle save edit
  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        commentData: { text: editText.trim() }
      });
      
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Load replies for a comment
  const loadReplies = (commentId: string) => {
    setLoadedReplies(prev => new Set([...prev, commentId]));
  };

  // Modal handlers
  const openDeleteModal = (commentId: string, parentId?: string, commentText?: string, isReply = false) => {
    setDeleteModal({
      isOpen: true,
      commentId,
      parentId,
      commentText,
      isReply
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      commentId: '',
      commentText: '',
      isReply: false
    });
  };

  const confirmDelete = () => {
    handleDeleteComment(deleteModal.commentId);
  };

  const openReportModal = (commentId: string, commentText: string, author: string) => {
    setReportModal({
      isOpen: true,
      commentId,
      commentText,
      author
    });
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      commentId: '',
      commentText: '',
      author: ''
    });
  };

  const handleReport = (reason: string, details?: string) => {
    console.log('Reporting comment:', {
      commentId: reportModal.commentId,
      reason,
      details
    });
    closeReportModal();
  };

  const toggleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleReplyClick = (commentId: string) => {
    if (!loadedReplies.has(commentId)) {
      loadReplies(commentId);
    }
    toggleReply(commentId);
  };

  // Component to render replies with TanStack Query
  const RepliesSection = ({ commentId }: { commentId: string }) => {
    const { 
      data: replies = [], 
      isLoading: repliesLoading 
    } = useGetCommentReplies(commentId, loadedReplies.has(commentId));

    if (!loadedReplies.has(commentId)) return null;

    if (repliesLoading) {
      return (
        <div className="pl-[68px] py-2">
          <div className="animate-pulse flex gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      );
    }


    return (
      <>
        {replies.map((reply) => (
          <div key={reply.id} className="flex w-full flex-row items-start justify-start gap-3 p-4 pl-[68px]">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
              style={{ backgroundImage: `url("${reply.avatar}")` }}
            />
            <div className="flex h-full flex-1 flex-col items-start justify-start">
              <div className="flex w-full flex-row items-start justify-start gap-x-3">
                <p className="text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]">
                  {reply.author}
                </p>
                <p className="text-[#4e7097] text-sm font-normal leading-normal">
                  {reply.date}
                </p>
                
                {/* TEMPORARILY FORCE SHOW BUTTONS - Change this back when user ID matching works */}
                {(reply.isOwnComment || true) && editingComment !== reply.id && (
                  <div className="ml-auto flex gap-2">
                    <button 
                      onClick={() => handleEditComment(reply.id, reply.content)}
                      disabled={updateCommentMutation.isPending}
                      className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                      title="Edit reply"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(reply.id, commentId, reply.content, true)}
                      disabled={deleteCommentMutation.isPending}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                      title="Delete reply"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Edit mode for replies */}
              {editingComment === reply.id ? (
                <div className="w-full mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(reply.id)}
                      disabled={updateCommentMutation.isPending || !editText.trim()}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                    >
                      {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[#0e141b] text-sm font-normal leading-normal">
                  {reply.content}
                </p>
              )}
              
              {/* Reply actions (if not in edit mode) */}
              {editingComment !== reply.id && (
                <div className="flex gap-4 mt-2">
                  
                 

                  <button 
                    onClick={() => toggleReply(reply.id)}
                    className="flex items-center gap-1 text-[#4e7097] hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                  >
                    <span className="text-xs">Reply</span>
                  </button>
                </div>
              )}

              {replyingTo === reply.id && (
                <div className="mt-3 w-full">
                  <CommentForm 
                    onSubmit={(content) => handleReply(reply.id, content)}
                    placeholder={`Reply to ${reply.author}...`}
                    buttonText="Reply"
                    disabled={postCommentMutation.isPending}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );
  };

  if (commentsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full px-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="py-8 px-4">
        <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Comments
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/>
            </svg>
            <span className="font-medium">Failed to load comments</span>
          </div>
          <button
            onClick={() => refetchComments()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>
      
      <CommentForm 
        onSubmit={handleNewComment} 
        disabled={postCommentMutation.isPending}
      />
      
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                style={{ backgroundImage: `url("${comment.avatar}")` }}
              />
              <div className="flex h-full flex-1 flex-col items-start justify-start">
                <div className="flex w-full flex-row items-start justify-start gap-x-3">
                  <p className="text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]">
                    {comment.author}
                  </p>
                  <p className="text-[#4e7097] text-sm font-normal leading-normal">
                    {comment.date}
                  </p>
                  
                  {/* TEMPORARILY FORCE SHOW BUTTONS - Change back to comment.isOwnComment when user ID matching works */}
                 {isOwner(comment) && editingComment !== comment.id && (
                    <div className="ml-auto flex gap-2">
                      <button 
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        disabled={updateCommentMutation.isPending}
                        className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                        title="Edit comment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(comment.id, undefined, comment.content, false)}
                        disabled={deleteCommentMutation.isPending}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Edit mode for main comments */}
                {editingComment === comment.id ? (
                  <div className="w-full mt-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      maxLength={1000}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={updateCommentMutation.isPending || !editText.trim()}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
                      >
                        {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#0e141b] text-sm font-normal leading-normal">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
            
            {/* Comment Actions (if not in edit mode) */}
            {editingComment !== comment.id && (
              <div className="flex flex-wrap gap-4 px-4 py-2">
                <button 
                  onClick={() => handleReplyClick(comment.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="text-[#4e7097]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM32,80l81.56,63.24a8,8,0,0,0,8.88,0L204,80V192H32Z"/>
                    </svg>
                  </div>
                  <p className="text-[#4e7097] text-[13px] font-bold leading-normal tracking-[0.015em]">
                    Reply
                  </p>
                </button>
              </div>
            )}

            {replyingTo === comment.id && (
              <div className="px-4 pb-4 pl-[68px]">
                <CommentForm 
                  onSubmit={(content) => handleReply(comment.id, content)}
                  placeholder={`Reply to ${comment.author}...`}
                  buttonText="Reply"
                  disabled={postCommentMutation.isPending}
                />
              </div>
            )}
            
            <RepliesSection commentId={comment.id} />
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        commentText={deleteModal.commentText}
        isReply={deleteModal.isReply}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        onReport={handleReport}
        commentText={reportModal.commentText}
        author={reportModal.author}
      />
    </div>
  );
};
