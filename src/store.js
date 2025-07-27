import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Sample food items data (for fallback/initialization)
export const sampleFoodItems = [
  // DIET MEALS
  { id: 'grilled-chicken-veggies', name: 'Grilled Chicken – Veggies/sauce', category: 'Diet Meals' },
  { id: 'lemon-chicken-veggies', name: 'Lemon Chicken – Veggies/sauce', category: 'Diet Meals' },
  { id: 'peri-peri-chicken-veggies', name: 'Peri Peri Chicken – Veggies/sauce', category: 'Diet Meals' },
  { id: 'bbq-chicken-veggies', name: 'Bar BQ Chicken – Veggies/sauce', category: 'Diet Meals' },
  { id: 'garlic-pepper-chicken', name: 'Garlic & Pepper Chicken – Veggies/sauce', category: 'Diet Meals' },
  { id: 'teriyaki-chicken-rice', name: 'Teriyaki Chicken – Rice/veggies', category: 'Diet Meals' },
  { id: 'lemon-chicken-skewers', name: 'Lemon Chicken Skewers – Rice/veggies', category: 'Diet Meals' },
  { id: 'chicken-chili-dry', name: 'Chicken Chili Dry – Rice/veggies', category: 'Diet Meals' },
  { id: 'chicken-shashlik', name: 'Chicken Shashlik – Rice/veggies', category: 'Diet Meals' },
  { id: 'chicken-manchurian', name: 'Chicken Manchurian – Rice/veggies', category: 'Diet Meals' },
  { id: 'chicken-tortilla-wrap', name: 'Chicken Tortilla Wrap – Coleslaw', category: 'Diet Meals' },
  { id: 'chicken-tikka-sandwich', name: 'Chicken Tikka Sandwich (Brown Bread) – Coleslaw', category: 'Diet Meals' },
  { id: 'grilled-chicken-sandwich', name: 'Grilled Chicken Sandwich (Brown Bread) – Coleslaw', category: 'Diet Meals' },
  { id: 'chicken-euro-sandwich', name: 'Chicken Euro Sandwich (Pita Bread) – Coleslaw', category: 'Diet Meals' },
  { id: 'chicken-roast', name: 'Chicken Roast – Mash potato/sauce', category: 'Diet Meals' },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken – Mash potato/sauce', category: 'Diet Meals' },
  { id: 'chicken-combo-pasta', name: 'Chicken Combo Pasta/Salad', category: 'Diet Meals' },

  // CURRY
  { id: 'chicken-handi', name: 'Chicken Handi (Boneless)', category: 'Curry' },
  { id: 'chicken-karahi', name: 'Chicken Karahi', category: 'Curry' },
  { id: 'kabab-karahi', name: 'Kabab Karahi', category: 'Curry' },
  { id: 'tawwa-chicken', name: 'Tawwa Chicken', category: 'Curry' },
  { id: 'butter-chicken', name: 'Butter Chicken (Boneless)', category: 'Curry' },
  { id: 'dhuwan-chicken', name: 'Dhuwan Chicken', category: 'Curry' },
  { id: 'achari-chicken', name: 'Achari Chicken', category: 'Curry' },
  { id: 'chicken-kofta', name: 'Chicken Kofta', category: 'Curry' },
  { id: 'chicken-nihari', name: 'Chicken Nihari', category: 'Curry' },
  { id: 'chicken-qorma', name: 'Chicken Qorma', category: 'Curry' },
  { id: 'chicken-aloo-curry', name: 'Chicken Aloo Curry', category: 'Curry' },
  { id: 'smoked-qeema', name: 'Smoked Qeema', category: 'Curry' },
  { id: 'chapli-kabab', name: 'Chapli Kabab', category: 'Curry' },
  { id: 'murgh-chana', name: 'Murgh Chana', category: 'Curry' },
  { id: 'qeema-aloo', name: 'Qeema Aloo', category: 'Curry' },
  { id: 'qeema-shimla', name: 'Qeema Shimla', category: 'Curry' },
  { id: 'haleem', name: 'Haleem', category: 'Curry' },
  { id: 'palak-chicken', name: 'Palak Chicken', category: 'Curry' },
  { id: 'palak-paneer', name: 'Palak Paneer', category: 'Curry' },
  { id: 'kari-pakora', name: 'Kari Pakora', category: 'Curry' },
  { id: 'achaari-chanay', name: 'Achaari Chanay', category: 'Curry' },
  { id: 'makhni-daal', name: 'Makhni Daal', category: 'Curry' },
  { id: 'daal-maash', name: 'Daal Maash', category: 'Curry' },
  { id: 'aloo-bhujia', name: 'Aloo Bhujia', category: 'Curry' },
  { id: 'anda-aloo-curry', name: 'Anda Aloo Curry', category: 'Curry' },
  { id: 'mix-sabzi', name: 'Mix Sabzi', category: 'Curry' },

  // RICE
  { id: 'singaporean-rice', name: 'Singaporean Rice', category: 'Rice' },
  { id: 'chicken-pulao-kabab', name: 'Chicken Pulao Kabab', category: 'Rice' },
  { id: 'afghani-pulao', name: 'Afghani Pulao', category: 'Rice' },
  { id: 'chicken-biryani', name: 'Chicken Biryani', category: 'Rice' },
  { id: 'shola-biryani', name: 'Shola Biryani', category: 'Rice' },
  { id: 'qeema-biryani', name: 'Qeema Biryani', category: 'Rice' },
  { id: 'pulao-biryani', name: 'Pulao Biryani', category: 'Rice' },
  { id: 'chicken-jalfrezi-rice', name: 'Chicken Jalfrezi/Rice', category: 'Rice' },
  { id: 'chicken-veg-pulao', name: 'Chicken Veg Pulao', category: 'Rice' },
  { id: 'chana-pulao', name: 'Chana Pulao', category: 'Rice' },
  { id: 'vegetable-pulao', name: 'Vegetable Pulao', category: 'Rice' },
  { id: 'daal-chawal', name: 'Daal Chawal (Mix, Masar, Lobia)', category: 'Rice' },

  // SNACKS
  { id: 'white-sauce-pasta', name: 'White Sauce Pasta', category: 'Snacks' },
  { id: 'red-sauce-pasta', name: 'Red Sauce Pasta', category: 'Snacks' },
  { id: 'chicken-veg-macaroni', name: 'Chicken Veg Macaroni', category: 'Snacks' },
  { id: 'chicken-spaghetti', name: 'Chicken Spaghetti', category: 'Snacks' },
  { id: 'chicken-broast-fries', name: 'Chicken Broast–Fries', category: 'Snacks' },
  { id: 'crispy-chicken-burger', name: 'Crispy Chicken Burger–Fries', category: 'Snacks' },
  { id: 'chicken-tikka-wrap', name: 'Chicken Tikka Wrap–Fries', category: 'Snacks' },
  { id: 'chicken-shawarma', name: 'Chicken Shawarma–Fries', category: 'Snacks' },
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
      },      // Get food items by category
      getFoodItemsByCategory: (category) => {
        const { foodItems } = get();
        if (category === 'All') return foodItems;
        return foodItems.filter(item => item.category === category);
      },

      // Get food items sorted by average rating
      getSortedFoodItems: () => {
        const { foodItems } = get();
        return [...foodItems].sort((a, b) => get().getAverageRating(b.id) - get().getAverageRating(a.id));
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
          .slice(0, 5);        // Category performance
        const categories = ['Diet Meals', 'Curry', 'Rice', 'Snacks'];
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
