import React from 'react';
import { useAppStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { useFoodItems, useAllRatings } from '../hooks/useFirebase';
import { calculateTierDistribution, getTopRatedItems, getCategoryStats } from '../utils/dataUtils';

const StatsPanel = () => {
  const { user } = useAuth();
  const { foodItems, loading: foodItemsLoading } = useFoodItems();
  const { ratings, loading: ratingsLoading } = useAllRatings();
  const {
    setFoodItems,
    setRatings
  } = useAppStore();

  // Update store with Firebase data
  React.useEffect(() => {
    if (foodItems && foodItems.length > 0) {
      setFoodItems(foodItems);
    }
  }, [foodItems, setFoodItems]);

  React.useEffect(() => {
    if (ratings && ratings.length >= 0) {
      setRatings(ratings);
    }
  }, [ratings, setRatings]);

  // Helper functions that work with current Firebase data
  const getAverageRating = (foodId) => {
    const foodRatings = ratings.filter(r => r.foodItemId === foodId);
    
    if (foodRatings.length === 0) return 0;
    
    const sum = foodRatings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / foodRatings.length;
  };
  const getTier = (averageRating) => {
    if (averageRating >= 9) return 'Good';
    if (averageRating >= 7) return 'OK';
    if (averageRating >= 5) return 'Maybe';
    return 'NO';
  };

  if (foodItemsLoading || ratingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading statistics...</span>
      </div>
    );
  }  const tierDistribution = calculateTierDistribution(foodItems, getAverageRating, getTier);
  const topRatedItems = getTopRatedItems(foodItems, getAverageRating, 3);
  const categoryStats = getCategoryStats(foodItems, getAverageRating);
  const userRatings = ratings.filter(r => r.userId === user?.uid);

  const totalRatedItems = foodItems.filter(food => getAverageRating(food.id) > 0).length;
  const ratingPercentage = foodItems.length > 0 ? (totalRatedItems / foodItems.length) * 100 : 0;

  // Calculate max tier count for proper bar scaling
  const maxTierCount = Math.max(...Object.values(tierDistribution));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        📊 Statistics Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Items */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{foodItems.length}</div>
          <div className="text-sm text-blue-600">Total Items</div>
        </div>

        {/* Your Ratings */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{userRatings.length}</div>
          <div className="text-sm text-green-600">Your Ratings</div>
        </div>

        {/* Completion */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{Math.round(ratingPercentage)}%</div>
          <div className="text-sm text-purple-600">Items Rated</div>
        </div>

        {/* Total Ratings */}
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{ratings.length}</div>
          <div className="text-sm text-orange-600">Total Ratings</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Tier Distribution</h3>
          <div className="space-y-2">
            {Object.entries(tierDistribution).map(([tier, count]) => (
              <div key={tier} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {tier === 'Good' && '🏆'} 
                  {tier === 'OK' && '👍'} 
                  {tier === 'Maybe' && '🤔'} 
                  {tier === 'NO' && '❌'} 
                  {tier}
                </span>                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        tier === 'Good' ? 'bg-green-500' :
                        tier === 'OK' ? 'bg-yellow-500' :
                        tier === 'Maybe' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${maxTierCount > 0 ? (count / maxTierCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Items */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Top Rated Items</h3>
          <div className="space-y-2">
            {topRatedItems.length > 0 ? (
              topRatedItems.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="text-sm text-gray-700 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-primary-600">
                    {item.avgScore.toFixed(1)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No rated items yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900">{category}</div>
              <div className="text-xs text-gray-600">
                {stats.ratedItems}/{stats.totalItems} items rated
              </div>
              <div className="text-lg font-bold text-primary-600">
                {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
