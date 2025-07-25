import React, { useEffect } from 'react';
import { useAppStore } from '../store-firebase';
import { useAuth } from '../hooks/useAuth';
import { useFoodItems, useRatings, addRating } from '../hooks/useFirebase';
import Header from '../components/Header';
import FoodItemCard from '../components/FoodItemCard';
import RatingModal from '../components/RatingModal';
import TierView from '../components/TierView';
import StatsPanel from '../components/StatsPanel';

const Dashboard = () => {
  const { user } = useAuth();
  const { foodItems, loading: foodItemsLoading } = useFoodItems();
  const {
    selectedCategory,
    currentView,
    isRatingModalOpen,
    selectedFoodItem,
    setFoodItems,
    setRatings,
    setUser,
    openRatingModal,
    closeRatingModal,
    getFoodItemsByCategory,
  } = useAppStore();

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

  const displayedFoodItems = getFoodItemsByCategory(selectedCategory);

  const renderDashboardView = () => (
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
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tier':
        return <TierView />;
      case 'stats':
        return <StatsPanel />;
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderCurrentView()}
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
