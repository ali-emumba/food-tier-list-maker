import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { useFoodItems, useRatings, addRating } from '../hooks/useFirebase';
import Header from '../components/Header';
import FoodItemCard from '../components/FoodItemCard';
import RatingModal from '../components/RatingModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { foodItems, loading: foodItemsLoading } = useFoodItems();
  const {
    selectedCategory,
    isRatingModalOpen,
    selectedFoodItem,
    setFoodItems,
    setRatings,
    setUser,
    setSelectedCategory,
    openRatingModal,
    closeRatingModal,
    getFoodItemsByCategory,
  } = useAppStore();

  // Available categories based on new food items
  const categories = ['All', 'Diet Meals', 'Curry', 'Rice', 'Snacks'];

  // Update store with Firebase user
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  // Update store with Firebase food items
  useEffect(() => {
    if (foodItems && foodItems.length > 0) {
      setFoodItems(foodItems);
    }
  }, [foodItems, setFoodItems]);

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

  if (foodItemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading food items...</span>
        </div>
      </div>
    );
  }

  const displayedFoodItems = selectedCategory === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Category Filter */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.displayName}!
            </h1>
            <p className="text-gray-600 mb-6">
              Rate your favorite food items across {categories.length - 1} categories and see how they rank.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({foodItems.filter(item => item.category === category).length})
                    </span>
                  )}
                  {category === 'All' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({foodItems.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedFoodItems.map((foodItem) => (
              <FoodItemCard
                key={foodItem.id}
                foodItem={foodItem}
                onRate={() => openRatingModal(foodItem)}
              />
            ))}
            {displayedFoodItems.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No food items found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>

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

export default Dashboard;
