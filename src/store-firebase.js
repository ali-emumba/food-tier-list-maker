import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Sample food items data (for fallback/initialization)
export const sampleFoodItems = [
  // Fast Food
  { id: 'zinger-burger', name: 'Zinger Burger', category: 'Fast Food' },
  { id: 'chicken-nuggets', name: 'Chicken Nuggets', category: 'Fast Food' },
  { id: 'french-fries', name: 'French Fries', category: 'Fast Food' },
  { id: 'pizza-slice', name: 'Pizza Slice', category: 'Fast Food' },
  { id: 'fried-chicken', name: 'Fried Chicken', category: 'Fast Food' },

  // Desi
  { id: 'biryani', name: 'Biryani', category: 'Desi' },
  { id: 'karahi', name: 'Karahi', category: 'Desi' },
  { id: 'nihari', name: 'Nihari', category: 'Desi' },
  { id: 'pulao', name: 'Pulao', category: 'Desi' },
  { id: 'haleem', name: 'Haleem', category: 'Desi' },

  // Bakery
  { id: 'chocolate-cake', name: 'Chocolate Cake', category: 'Bakery' },
  { id: 'croissant', name: 'Croissant', category: 'Bakery' },
  { id: 'donuts', name: 'Donuts', category: 'Bakery' },
  { id: 'muffins', name: 'Muffins', category: 'Bakery' },
  { id: 'cookies', name: 'Cookies', category: 'Bakery' },

  // Drinks
  { id: 'coca-cola', name: 'Coca Cola', category: 'Drinks' },
  { id: 'fresh-juice', name: 'Fresh Juice', category: 'Drinks' },
  { id: 'coffee', name: 'Coffee', category: 'Drinks' },
  { id: 'tea', name: 'Tea', category: 'Drinks' },
  { id: 'smoothie', name: 'Smoothie', category: 'Drinks' },

  // Snacks
  { id: 'chips', name: 'Chips', category: 'Snacks' },
  { id: 'popcorn', name: 'Popcorn', category: 'Snacks' },
  { id: 'nuts', name: 'Mixed Nuts', category: 'Snacks' },
  { id: 'crackers', name: 'Crackers', category: 'Snacks' },
  { id: 'pretzels', name: 'Pretzels', category: 'Snacks' },
];

// Zustand store for application state
export const useAppStore = create(
  persist(
    (set, get) => ({
      // User state - managed by Firebase Auth
      user: null,
      isAuthenticated: false,
      
      // Food items from Firebase
      foodItems: [],
      
      // Ratings from Firebase  
      ratings: [],
      
      // UI state
      selectedCategory: 'All',
      currentView: 'dashboard', // dashboard, tier, stats
      isRatingModalOpen: false,
      selectedFoodItem: null,
      loading: false,
      error: null,

      // Auth actions - Firebase handles auth, this just updates local state
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
      }),

      // Data actions - for Firebase integration
      setFoodItems: (foodItems) => set({ foodItems }),
      setRatings: (ratings) => set({ ratings }),

      // UI actions
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setCurrentView: (view) => set({ currentView: view }),
      
      openRatingModal: (foodItem) => set({ 
        isRatingModalOpen: true, 
        selectedFoodItem: foodItem 
      }),
      
      closeRatingModal: () => set({ 
        isRatingModalOpen: false, 
        selectedFoodItem: null 
      }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Get user's rating for a specific food item
      getUserRating: (foodId) => {
        const { ratings, user } = get();
        if (!user) return null;
        
        return ratings.find(r => r.foodItemId === foodId && r.userId === user.uid)?.score || null;
      },

      // Get average rating for a food item
      getAverageRating: (foodId) => {
        const { ratings } = get();
        const foodRatings = ratings.filter(r => r.foodItemId === foodId);
        
        if (foodRatings.length === 0) return 0;
        
        const sum = foodRatings.reduce((acc, rating) => acc + rating.score, 0);
        return sum / foodRatings.length;
      },

      // Get tier for a food item based on average rating
      getTier: (foodId) => {
        const averageRating = get().getAverageRating(foodId);
        
        if (averageRating >= 9) return { name: 'Good', color: 'green' };
        if (averageRating >= 7) return { name: 'OK', color: 'yellow' };
        if (averageRating >= 5) return { name: 'Maybe', color: 'orange' };
        return { name: 'NO', color: 'red' };
      },

      // Get food items by category
      getFoodItemsByCategory: (category) => {
        const { foodItems } = get();
        if (category === 'All') return foodItems;
        return foodItems.filter(item => item.category === category);
      },

      // Get food items grouped by tier
      getFoodItemsByTier: () => {
        const { foodItems } = get();
        const tierGroups = {
          Good: [],
          OK: [],
          Maybe: [],
          NO: []
        };

        foodItems.forEach(item => {
          const tier = get().getTier(item.id);
          tierGroups[tier.name].push({
            ...item,
            averageRating: get().getAverageRating(item.id),
            tier: tier
          });
        });

        // Sort items within each tier by average rating (descending)
        Object.keys(tierGroups).forEach(tierName => {
          tierGroups[tierName].sort((a, b) => b.averageRating - a.averageRating);
        });

        return tierGroups;
      },

      // Get statistics
      getStatistics: () => {
        const { foodItems, ratings } = get();
        
        const totalItems = foodItems.length;
        const totalRatings = ratings.length;
        
        const tierGroups = get().getFoodItemsByTier();
        const tierDistribution = {
          Good: tierGroups.Good.length,
          OK: tierGroups.OK.length,
          Maybe: tierGroups.Maybe.length,
          NO: tierGroups.NO.length
        };

        // Top rated items
        const allItemsWithRatings = foodItems.map(item => ({
          ...item,
          averageRating: get().getAverageRating(item.id),
          ratingCount: ratings.filter(r => r.foodItemId === item.id).length
        }));

        const topRatedItems = allItemsWithRatings
          .filter(item => item.ratingCount > 0)
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 5);

        // Category performance
        const categories = ['Fast Food', 'Desi', 'Bakery', 'Drinks', 'Snacks'];
        const categoryStats = categories.map(category => {
          const categoryItems = foodItems.filter(item => item.category === category);
          const categoryRatings = categoryItems.map(item => get().getAverageRating(item.id));
          const validRatings = categoryRatings.filter(rating => rating > 0);
          
          return {
            category,
            averageRating: validRatings.length > 0 
              ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length 
              : 0,
            itemCount: categoryItems.length,
            ratedItemCount: validRatings.length
          };
        });

        return {
          totalItems,
          totalRatings,
          tierDistribution,
          topRatedItems,
          categoryStats
        };
      }
    }),
    {
      name: 'food-tier-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist UI state, not data that comes from Firebase
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        currentView: state.currentView,
      }),
    }
  )
);
