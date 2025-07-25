import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRatings } from '../hooks/useFirebase';

const RatingModal = ({ foodItem, food, isOpen = true, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [userScore, setUserScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle both foodItem and food props for backwards compatibility
  const item = foodItem || food;
  
  if (!item) {
    return null;
  }

  // Get ratings for this food item
  const { ratings, loading: ratingsLoading } = useRatings(item.id);
  
  // Calculate average score and tier
  const averageScore = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length 
    : 0;
    
  const getTier = (score) => {
    if (score >= 9) return 'Good';
    if (score >= 7) return 'OK';
    if (score >= 5) return 'Maybe';
    return 'NO';
  };
  
  const tier = getTier(averageScore);
  
  // Find current user's rating
  const currentUserRating = ratings.find(r => r.userId === user?.uid);

  useEffect(() => {
    if (currentUserRating) {
      setUserScore(currentUserRating.score);
    } else {
      setUserScore(0);
    }
  }, [currentUserRating]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userScore < 0 || userScore > 10) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        // Use the new Firebase-based onSubmit prop
        await onSubmit(userScore);
      } else {
        // Fallback to old local store method
        addRating(item.id, userScore);
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 500);
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      setIsSubmitting(false);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Good':
        return 'text-green-600 bg-green-100';
      case 'OK':
        return 'text-yellow-600 bg-yellow-100';
      case 'Maybe':
        return 'text-orange-600 bg-orange-100';
      case 'NO':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Rate {item.name}
              </h3>
              <p className="text-sm text-gray-500">Category: {item.category}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>          {/* Current Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Average Score:</span>
              <span className="text-xl font-bold text-primary-600">
                {averageScore > 0 ? averageScore.toFixed(1) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tier:</span>
              <span className={`px-2 py-1 text-sm font-medium rounded ${getTierColor(tier)}`}>
                {tier}
              </span>
            </div>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating (0-10):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={userScore}
                  onChange={(e) => setUserScore(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={userScore}
                  onChange={(e) => setUserScore(parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : currentUserRating ? 'Update Rating' : 'Submit Rating'}
            </button>
          </form>          {/* Other Users' Ratings */}
          {ratings.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">All Ratings:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {ratings.map((rating, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{rating.userName}:</span>
                    <span className="font-medium text-primary-600">{rating.score}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
