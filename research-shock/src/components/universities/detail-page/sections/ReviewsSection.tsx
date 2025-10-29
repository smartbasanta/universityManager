"use client";

import { useState } from "react";
import { Star, MessageSquare, Edit2, Trash2, AlertTriangle, X } from "lucide-react";
import { 
  useGetUniversityReviews, 
  usePostUniversityReview, 
  useUpdateUniversityReview, 
  useDeleteUniversityReview 
} from "@/hooks/api/university/university.query";
import { useAuthStore } from '@/stores/useAuth'; 
import { Review } from "@/hooks/api/website/university.api";

interface ReviewsSectionProps {
  universityId: string;
  initialReviews: Review[]; // Accept the initial data from the parent
}

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  reviewText,
  isDeleting 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewText: string;
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Review</h3>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this review? This action cannot be undone.
          </p>
          
          {reviewText && (
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-400">
              <p className="text-sm text-gray-700 italic">
                "{reviewText.length > 100 ? reviewText.substring(0, 100) + '...' : reviewText}"
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReviewsSection = ({ universityId, initialReviews }: ReviewsSectionProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    message: ''
  });
  const [editReviewData, setEditReviewData] = useState({
    rating: 5,
    message: ''
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    reviewId: string;
    reviewText: string;
  }>({
    isOpen: false,
    reviewId: '',
    reviewText: ''
  });

  // TanStack Query hooks
  const {
    data: reviews = [], // Default to empty array
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews
  } = useGetUniversityReviews(universityId, initialReviews); // Pass initialData to the hook

  const postReviewMutation = usePostUniversityReview();
  const updateReviewMutation = useUpdateUniversityReview();
  const deleteReviewMutation = useDeleteUniversityReview();
  const { isAuth, info } = useAuthStore();
  
  const isOwner = (review: Review) => {
    return isAuth && info?.userType === 'student' && review.student?.id === info?.student?.id;
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.message.trim()) return;

    try {
      await postReviewMutation.mutateAsync({
        comment: newReview.message,
        rating: newReview.rating,
        universityId
      });

      setNewReview({ rating: 5, message: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review.id);
    setEditReviewData({
      rating: review.rating,
      message: review.message
    });
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editReviewData.message.trim()) return;

    try {
      await updateReviewMutation.mutateAsync({
        reviewId,
        reviewData: {
          comment: editReviewData.message,
          rating: editReviewData.rating
        }
      });

      setEditingReview(null);
      setEditReviewData({ rating: 5, message: '' });
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  // Open delete modal
  const openDeleteModal = (reviewId: string, reviewText: string) => {
    setDeleteModal({
      isOpen: true,
      reviewId,
      reviewText
    });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    if (!deleteReviewMutation.isPending) {
      setDeleteModal({
        isOpen: false,
        reviewId: '',
        reviewText: ''
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteReviewMutation.mutateAsync(deleteModal.reviewId);
      closeDeleteModal();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderEditableStars = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (reviewsLoading) {
    return (
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Loading Reviews...</h2>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviewsError) {
    return (
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Failed to load reviews</h2>
            <button
              onClick={() => refetchReviews()}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="reviews" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Student Reviews
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read what current and former students have to say about their experience
            </p>
          </div>

          {/* Rating Summary */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-gray-900 mr-4">
                  {averageRating.toFixed(1)}
                </span>
                {renderStars(Math.round(averageRating), 'lg')}
              </div>
              <p className="text-gray-600">
                Based on {reviews.length} student review{reviews.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                disabled={postReviewMutation.isPending}
                className="mt-6 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-50"
              >
                {postReviewMutation.isPending ? 'Submitting...' : 'Write a Review'}
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Write Your Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    {renderEditableStars(newReview.rating, (rating) => 
                      setNewReview({...newReview, rating})
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.message}
                      onChange={(e) => setNewReview({...newReview, message: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Share your thoughts about the university..."
                      required
                      maxLength={1000}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={postReviewMutation.isPending || !newReview.message.trim()}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      {postReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reviews List with Edit/Delete Buttons */}
          <div className="max-w-4xl mx-auto space-y-6">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{review.author}</h4>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    {editingReview === review.id ? (
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        {renderEditableStars(editReviewData.rating, (rating) => 
                          setEditReviewData({...editReviewData, rating})
                        )}
                      </div>
                    ) : (
                      renderStars(review.rating)
                    )}
                  </div>

                  {/* Edit/Delete buttons - Force show for testing, change to review.isOwnReview when working */}
                  {isOwner(review) && editingReview !== review.id && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditReview(review)}
                        disabled={updateReviewMutation.isPending}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                        title="Edit review"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(review.id, review.message)}
                        disabled={deleteReviewMutation.isPending}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingReview === review.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={editReviewData.message}
                        onChange={(e) => setEditReviewData({...editReviewData, message: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        maxLength={1000}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(review.id)}
                        disabled={updateReviewMutation.isPending || !editReviewData.message.trim()}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
                      >
                        {updateReviewMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setEditingReview(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 mb-4">{review.message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {reviews.length === 0 && (
            <div className="max-w-4xl mx-auto text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No reviews yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        reviewText={deleteModal.reviewText}
        isDeleting={deleteReviewMutation.isPending}
      />
    </>
  );
};
