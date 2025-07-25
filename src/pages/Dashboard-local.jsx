import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import RatingModal from '../components/RatingModal';
import Header from '../components/Header';
import FoodItemCard from '../components/FoodItemCard';
import TierView from '../components/TierView';
import StatsPanel from '../components/StatsPanel';

const Dashboard = () => {
  const {
    currentUser,
    foodItems,
    getFoodItemsByCategory,
    initializeSampleData,
    getAverageScore,
    getTier,
  } = useAppStore();

  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    initializeSampleData();
  }, []);

  const categorizedFoods = getFoodItemsByCategory();
  const categories = ['Fast Food', 'Desi', 'Bakery', 'Drinks', 'Snacks'];

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'OK':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Maybe':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">          {activeView === 'dashboard' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {currentUser?.name}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Rate your favorite food items and see how they rank in our tier list.
                </p>
              </div>

              <StatsPanel />

              {categories.map((category) => {
                const categoryFoods = categorizedFoods[category] || [];
                
                if (categoryFoods.length === 0) return null;

                return (
                  <div key={category} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryFoods.map((food) => {
                        const avgScore = getAverageScore(food.id);
                        const tier = getTier(avgScore);
                        
                        return (
                          <FoodItemCard
                            key={food.id}
                            food={food}
                            avgScore={avgScore}
                            tier={tier}
                            onClick={() => handleFoodClick(food)}
                            getTierColor={getTierColor}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {foodItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">Loading food items...</div>
                </div>
              )}
            </>          ) : activeView === 'stats' ? (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Statistics & Analytics
                </h1>
                <p className="mt-2 text-gray-600">
                  Detailed insights into your food ratings and preferences.
                </p>
              </div>
              <StatsPanel />
            </div>
          ) : (
            <TierView />
          )}
        </div>
      </main>

      {isModalOpen && selectedFood && (
        <RatingModal
          food={selectedFood}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
