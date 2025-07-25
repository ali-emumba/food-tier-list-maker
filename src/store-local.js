import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Hardcoded users as specified
export const users = [
  { name: 'Ali Usman', password: '1234' },
  { name: 'Syeda Duaa Fatima', password: 'volleyballteamcaptainthatbeatpunjabcollege' }
];

// Sample food items data
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
      // Authentication state
      currentUser: null,
      isAuthenticated: false,

      // Food items and ratings
      foodItems: [],
      ratings: [],
      isLoading: false,
      error: null,

      // Authentication actions
      login: (username, password) => {
        const user = users.find(u => u.name === username && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true, error: null });
          return true;
        } else {
          set({ error: 'Invalid credentials' });
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Data actions
      setFoodItems: (items) => set({ foodItems: items }),
      setRatings: (ratings) => set({ ratings: ratings }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Add or update rating
      addRating: (foodId, score) => {
        const { currentUser, ratings } = get();
        if (!currentUser) return;

        const existingRatingIndex = ratings.findIndex(
          r => r.foodId === foodId && r.userName === currentUser.name
        );

        let newRatings;
        if (existingRatingIndex !== -1) {
          // Update existing rating
          newRatings = [...ratings];
          newRatings[existingRatingIndex].score = score;
        } else {
          // Add new rating
          newRatings = [...ratings, {
            id: `${foodId}-${currentUser.name}-${Date.now()}`,
            foodId,
            userName: currentUser.name,
            score
          }];
        }

        set({ ratings: newRatings });
      },

      // Get average score for a food item
      getAverageScore: (foodId) => {
        const { ratings } = get();
        const foodRatings = ratings.filter(r => r.foodId === foodId);
        if (foodRatings.length === 0) return 0;
        const sum = foodRatings.reduce((acc, r) => acc + r.score, 0);
        return sum / foodRatings.length;
      },

      // Get ratings for a specific food item
      getFoodRatings: (foodId) => {
        const { ratings } = get();
        return ratings.filter(r => r.foodId === foodId);
      },

      // Get tier for a score
      getTier: (score) => {
        if (score >= 9) return 'Good';
        if (score >= 7) return 'OK';
        if (score >= 5) return 'Maybe';
        return 'NO';
      },

      // Get food items sorted by average score
      getSortedFoodItems: () => {
        const { foodItems, getAverageScore } = get();
        return [...foodItems].sort((a, b) => getAverageScore(b.id) - getAverageScore(a.id));
      },

      // Get food items grouped by category and sorted
      getFoodItemsByCategory: () => {
        const { getSortedFoodItems } = get();
        const sorted = getSortedFoodItems();
        const grouped = {};
        
        sorted.forEach(item => {
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          grouped[item.category].push(item);
        });

        return grouped;
      },

      // Initialize with sample data if needed
      initializeSampleData: () => {
        const { foodItems } = get();
        if (foodItems.length === 0) {
          set({ foodItems: sampleFoodItems });
        }
      }
    }),
    {
      name: 'food-tier-app-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        foodItems: state.foodItems,
        ratings: state.ratings,
      }),
    }
  )
);
