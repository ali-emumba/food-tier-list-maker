import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRatings } from '../hooks/useFirebase';

const FoodItemCard = ({ foodItem, food, onRate, onClick }) => {
  const { user } = useAuth();
  
  // Handle both prop names for backwards compatibility
  const item = foodItem || food;
  
  // Safety check
  if (!item || !item.id) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Get real-time ratings from Firebase
  const { ratings } = useRatings(item.id);
  
  // Calculate average rating from Firebase data
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length 
    : 0;
    
  // Get current user's rating
  const userRating = ratings.find(r => r.userId === user?.uid)?.score || null;
    // Calculate tier
  const getTierName = (score) => {
    if (score >= 9) return 'Good';
    if (score >= 7) return 'OK';
    if (score >= 5) return 'Maybe';
    return 'NO';
  };
  
  const getTierColorClass = (score) => {
    if (score >= 9) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 5) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const tier = {
    name: getTierName(averageRating),
    colorClass: getTierColorClass(averageRating)
  };
  
  const handleClick = () => {
    if (onRate) {
      onRate();
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.name}
        </h3>        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${tier.colorClass}`}
        >
          {tier.name}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Category: {item.category}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            {userRating !== null ? `You: ${userRating}/10` : 'Not rated'}
          </div>
        </div>
      </div>
      
      <div className="mt-3 bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(averageRating / 10) * 100}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-400 text-center mt-2">
        Click to rate
      </div>
    </div>
  );
};

export default FoodItemCard;
