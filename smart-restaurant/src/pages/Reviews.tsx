/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  helpfulVotes: number;
  isVerified: boolean;
  photos?: string[];
  businessResponse?: {
    text: string;
    date: string;
  };
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      customerName: "John Doe",
      rating: 5,
      title: "Exceptional Dining Experience",
      comment: "Amazing food and service! The staff was very friendly and the atmosphere was great. The steak was cooked to perfection and the dessert selection was outstanding.",
      date: "2024-03-15",
      likes: 12,
      helpfulVotes: 8,
      isVerified: true,
      photos: [
        "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg",
        "https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg"
      ],
      businessResponse: {
        text: "Thank you for your wonderful review! We're thrilled you enjoyed your experience with us.",
        date: "2024-03-16"
      }
    },
    {
      id: 2,
      customerName: "Sarah Smith",
      rating: 4,
      title: "Great Food, Cozy Atmosphere",
      comment: "Great experience overall. The food was delicious and the service was prompt. The pasta dishes are particularly noteworthy.",
      date: "2024-03-14",
      likes: 8,
      helpfulVotes: 5,
      isVerified: true,
      photos: ["https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg"]
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      rating: 5,
      title: "Best Restaurant in Town",
      comment: "Best restaurant in town! The menu has great variety and everything tastes amazing. The staff goes above and beyond to make you feel welcome.",
      date: "2024-03-13",
      likes: 15,
      helpfulVotes: 12,
      isVerified: true,
      photos: [
        "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg",
        "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg"
      ]
    }
  ]);

  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'likes' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    photos: [] as string[]
  });

  const handleLike = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const handleHelpful = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulVotes: review.helpfulVotes + 1 }
        : review
    ));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!newReview.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!newReview.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    const review: Review = {
      id: reviews.length + 1,
      customerName: "You", // In a real app, this would be the logged-in user's name
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      helpfulVotes: 0,
      isVerified: true,
      photos: newReview.photos
    };

    setReviews([review, ...reviews]);
    setShowReviewForm(false);
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      photos: []
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setNewReview(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const sortedAndFilteredReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'likes':
          return b.likes - a.likes;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h1>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Write a Review</h2>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className="text-2xl focus:outline-none"
                        >
                          {star <= newReview.rating ? (
                            <StarIcon className="h-8 w-8 text-yellow-400" />
                          ) : (
                            <StarOutlineIcon className="h-8 w-8 text-yellow-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Summarize your experience"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-32"
                      placeholder="Share your experience with others"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newReview.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters and Sort */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === 'recent' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === 'rating' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Highest Rated
                </button>
                <button
                  onClick={() => setSortBy('helpful')}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === 'helpful' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Most Helpful
                </button>
              </div>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`px-3 py-1 rounded-lg ${
                      filterRating === rating 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {rating} ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sortedAndFilteredReviews.map(review => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{review.customerName}</h3>
                      {review.isVerified && (
                        <span className="text-blue-500" title="Verified Purchase">
                          <CheckBadgeIcon className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl mr-1">★</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </div>

                <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.comment}</p>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {review.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Business Response */}
                {review.businessResponse && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-orange-500">Restaurant Response</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.businessResponse.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.businessResponse.text}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(review.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-orange-500"
                    >
                      <span>👍</span>
                      <span>{review.likes}</span>
                    </button>
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-orange-500"
                    >
                      <span>Helpful</span>
                      <span>({review.helpfulVotes})</span>
                    </button>
                  </div>
                  <button
                    className="text-gray-500 hover:text-orange-500"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 