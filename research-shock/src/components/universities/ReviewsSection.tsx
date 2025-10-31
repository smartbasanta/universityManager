import { Star, MessageSquare } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { websiteUniversityAPI } from '@/hooks/api/website/university.api';
import type { Review } from '@/hooks/api/website/university.api';
import UniversitySkeleton from '@/components/universities/UniversitySkeleton';

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
    return (
      <div className="py-8">
        <UniversitySkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        Failed to load reviews.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-xl font-medium">No reviews yet</p>
        <p className="text-sm mt-2">Be the first to share your experience!</p>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
    return (
      <div className="flex items-center">
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

  return (
    <section id="reviews" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Student Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl font-extrabold text-gray-900 mr-4 leading-none">
            {averageRating.toFixed(1)}
          </span>
          {renderStars(Math.round(averageRating), 'lg')}
        </div>
        <p className="text-gray-600 text-lg">
          Based on {reviews.length} student review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review: Review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {review.student?.photo && (
                  <img 
                    src={review.student.photo} 
                    alt={review.student.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{review.student?.name || 'Anonymous'}</h4>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
