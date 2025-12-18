import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import type { Review } from '../services/api';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getReviews();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1a2233] to-[#2d3748] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Customer Reviews</h2>
          <p className="text-xl text-gray-300">What our Pakistani food lovers say about us</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#e6c200] rounded-full flex items-center justify-center text-[#1a2233] font-bold text-lg">
                  {review.userName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-800 text-lg">{review.userName}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">"{review.comment}"</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(review.createdAt)}</span>
                <span className="text-[#FFD700] font-semibold">Verified Customer</span>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No reviews yet</h3>
            <p className="text-gray-300">Be the first to share your experience with us!</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#1a2233] mb-4">Share Your Experience</h3>
            <p className="text-gray-600 mb-6">We'd love to hear about your dining experience at Dastarkhwan</p>
            <button className="bg-[#FFD700] text-[#1a2233] px-8 py-3 rounded-lg font-semibold hover:bg-[#e6c200] transition-colors">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 