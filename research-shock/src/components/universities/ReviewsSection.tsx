import { Star, MessageSquare } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { Review } from '@/hooks/api/website/university.api';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';
import { motion } from 'framer-motion';

interface ReviewsSectionProps {
  universityId: string;
}

export const ReviewsSection = ({ universityId }: ReviewsSectionProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['universityGeneralSectionsReviews', universityId],
    queryFn: () => websiteUniversityAPI.fetchGeneralSectionData(universityId),
    staleTime: 1000 * 60 * 5,
  });
  const reviews = data?.reviews || [];
  if (isLoading) {
    return <UniversitySkeleton />;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">Failed to load reviews.</div>;
  }
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-2xl font-semibold text-gray-800 mb-2">No Reviews Yet</p>
        <p className="text-gray-600">Be the first to share your experience with the community!</p>
      </div>
    );
  }
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
    : 0;
  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
            } transition-colors`}
          />
        ))}
      </div>
    );
  };
  return (
    <section id="reviews" className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Student Reviews</h2>
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center shadow-md">
        <div className="flex items-center justify-center mb-4">
          <span className="text-6xl font-extrabold text-gray-900 mr-4">
            {averageRating.toFixed(1)}
          </span>
          {renderStars(averageRating, 'lg')}
        </div>
        <p className="text-gray-600 text-lg font-medium">
          Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review: Review, i) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {review.student?.photo ? (
                  <img
                    src={review.student.photo}
                    alt={review.student.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {review.student?.name?.[0] || 'A'}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{review.student?.name || 'Anonymous'}</h4>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};