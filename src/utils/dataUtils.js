// Utility functions for data management and calculations

export const calculateTierDistribution = (foodItems, getAverageScore, getTier) => {
  const distribution = {
    Good: 0,
    OK: 0,
    Maybe: 0,
    NO: 0
  };

  foodItems.forEach(food => {
    const avgScore = getAverageScore(food.id);
    const tier = getTier(avgScore);
    distribution[tier]++;
  });

  return distribution;
};

export const getTopRatedItems = (foodItems, getAverageScore, limit = 5) => {
  return [...foodItems]
    .map(food => ({
      ...food,
      avgScore: getAverageScore(food.id)
    }))
    .filter(food => food.avgScore > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, limit);
};

export const getCategoryStats = (foodItems, getAverageScore) => {
  const categoryStats = {};
  
  foodItems.forEach(food => {
    if (!categoryStats[food.category]) {
      categoryStats[food.category] = {
        totalItems: 0,
        ratedItems: 0,
        averageScore: 0,
        totalScore: 0
      };
    }
    
    categoryStats[food.category].totalItems++;
    const avgScore = getAverageScore(food.id);
    
    if (avgScore > 0) {
      categoryStats[food.category].ratedItems++;
      categoryStats[food.category].totalScore += avgScore;
    }
  });

  // Calculate averages
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    if (stats.ratedItems > 0) {
      stats.averageScore = stats.totalScore / stats.ratedItems;
    }
  });

  return categoryStats;
};

export const formatScore = (score) => {
  if (score === 0) return 'N/A';
  return score.toFixed(1);
};

export const getTierBadgeStyle = (tier) => {
  const baseStyle = 'px-2 py-1 text-xs font-medium rounded-full border';
  
  switch (tier) {
    case 'Good':
      return `${baseStyle} bg-green-100 text-green-800 border-green-200`;
    case 'OK':
      return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-200`;
    case 'Maybe':
      return `${baseStyle} bg-orange-100 text-orange-800 border-orange-200`;
    case 'NO':
      return `${baseStyle} bg-red-100 text-red-800 border-red-200`;
    default:
      return `${baseStyle} bg-gray-100 text-gray-800 border-gray-200`;
  }
};

export const exportRatingsData = (foodItems, ratings) => {
  const data = {
    exportDate: new Date().toISOString(),
    foodItems,
    ratings,
    summary: {
      totalItems: foodItems.length,
      totalRatings: ratings.length,
      categories: [...new Set(foodItems.map(item => item.category))]
    }
  };
  
  return JSON.stringify(data, null, 2);
};

export const importRatingsData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    return {
      success: true,
      foodItems: data.foodItems || [],
      ratings: data.ratings || []
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON format'
    };
  }
};
