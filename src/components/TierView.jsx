import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useFoodItems, useAllRatings, addRating } from '../hooks/useFirebase';
import { useAuth } from '../hooks/useAuth';
import FoodItemCard from './FoodItemCard';
import RatingModal from './RatingModal';

const TierView = () => {
  const { user } = useAuth();
  const { foodItems, loading: foodItemsLoading } = useFoodItems();
  const { ratings, loading: ratingsLoading } = useAllRatings();
  const {
    openRatingModal,
    closeRatingModal,
    isRatingModalOpen,
    selectedFoodItem,
    setFoodItems,
    setRatings
  } = useAppStore();

  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Helper functions that work with current data
  const getAverageRating = (foodId) => {
    const foodRatings = ratings.filter(r => r.foodItemId === foodId);
    
    if (foodRatings.length === 0) return 0;
    
    const sum = foodRatings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / foodRatings.length;
  };

  const getTier = (foodId) => {
    const averageRating = getAverageRating(foodId);
    
    if (averageRating >= 9) return { name: 'Good', color: 'green' };
    if (averageRating >= 7) return { name: 'OK', color: 'yellow' };
    if (averageRating >= 5) return { name: 'Maybe', color: 'orange' };
    return { name: 'NO', color: 'red' };
  };

  if (foodItemsLoading || ratingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading food items and ratings...</span>
      </div>
    );
  }  const sortedFoods = [...foodItems].sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id));
  
  // Group foods by tier
  const tierGroups = {
    'Good': [],
    'OK': [],
    'Maybe': [],
    'NO': []
  };

  sortedFoods.forEach(food => {
    const avgRating = getAverageRating(food.id);
    const tier = getTier(food.id);
    
    tierGroups[tier.name].push({
      ...food,
      averageRating: avgRating,
      tier: tier
    });
  });

  const handleFoodClick = (food) => {
    openRatingModal(food);
  };

  const handleRatingSubmit = async (score) => {
    if (!selectedFoodItem || !user) return;

    try {
      await addRating(selectedFoodItem.id, user.uid, user.displayName, score);
      closeRatingModal();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Good':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'OK':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Maybe':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'NO':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Good':
        return '🏆';
      case 'OK':
        return '👍';
      case 'Maybe':
        return '🤔';
      case 'NO':
        return '❌';
      default:
        return '⭐';
    }
  };

  const getTierDescription = (tier) => {
    switch (tier) {
      case 'Good':
        return 'Excellent items (9.0 - 10.0)';
      case 'OK':
        return 'Good items worth trying (7.0 - 8.9)';
      case 'Maybe':
        return 'Average items, might be worth trying (5.0 - 6.9)';
      case 'NO':
        return 'Items to avoid (0.0 - 4.9)';
      default:
        return 'Unrated items';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Food Tier Rankings
        </h1>
        <p className="text-gray-600">
          Items ranked by average user ratings
        </p>
      </div>

      {Object.entries(tierGroups).map(([tier, foods]) => (
        <div key={tier} className={`border-2 rounded-lg p-6 ${getTierColor(tier)}`}>
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{getTierIcon(tier)}</span>
            <div>
              <h2 className="text-2xl font-bold">{tier} Tier</h2>
              <p className="text-sm opacity-75">{getTierDescription(tier)}</p>
            </div>
            <div className="ml-auto text-sm font-medium">
              {foods.length} item{foods.length !== 1 ? 's' : ''}
            </div>
          </div>          {foods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {foods.map(food => (
                <div key={food.id} className="bg-white bg-opacity-50 rounded-lg">
                  <FoodItemCard
                    foodItem={food}
                    onRate={() => handleFoodClick(food)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items in this tier yet
            </div>
          )}
        </div>
      ))}

      {isRatingModalOpen && selectedFoodItem && (
        <RatingModal
          foodItem={selectedFoodItem}
          onSubmit={handleRatingSubmit}
          onClose={closeRatingModal}
        />
      )}
    </div>
  );
};

export default TierView;
