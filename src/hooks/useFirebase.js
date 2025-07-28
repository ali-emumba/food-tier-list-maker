import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAppStore } from '../store';

// Hook for managing food items with real-time updates
export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const foodItemsCollection = collection(db, 'foodItems');
    
    const unsubscribe = onSnapshot(foodItemsCollection, 
      (snapshot) => {
        const foodItemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFoodItems(foodItemsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching food items:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { foodItems, loading, error };
};

// Hook for managing ratings with real-time updates
export const useRatings = (foodItemId) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!foodItemId) return;

    const ratingsCollection = collection(db, 'ratings');
    const q = query(ratingsCollection, where('foodItemId', '==', foodItemId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ratingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRatings(ratingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [foodItemId]);

  return { ratings, loading };
};

// Hook for getting ALL ratings with real-time updates
export const useAllRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ratingsCollection = collection(db, 'ratings');
    
    const unsubscribe = onSnapshot(ratingsCollection, 
      (snapshot) => {
        const ratingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRatings(ratingsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching ratings:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { ratings, loading, error };
};

// Function to add a rating
export const addRating = async (foodItemId, userId, userName, score) => {
  try {
    const ratingId = `${foodItemId}_${userId}`;
    const ratingDoc = doc(db, 'ratings', ratingId);
    
    await setDoc(ratingDoc, {
      foodItemId,
      userId,
      userName,
      score,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

// Function to initialize sample data
export const initializeSampleData = async () => {
  try {
    const { sampleFoodItems } = await import('../store');
    const batch = writeBatch(db);
    
    // Check if data already exists
    const foodItemsSnapshot = await getDocs(collection(db, 'foodItems'));
    if (!foodItemsSnapshot.empty) {
      console.log('Sample data already exists');
      return;
    }
    
    // Add food items to batch
    sampleFoodItems.forEach(item => {
      const docRef = doc(db, 'foodItems', item.id);
      batch.set(docRef, {
        name: item.name,
        category: item.category,
        createdAt: new Date().toISOString()
      });
    });

    await batch.commit();
    console.log('Sample data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
};

// Function to add a new food item (admin only)
export const addFoodItem = async (foodItemData) => {
  try {
    // Create a unique ID based on the name
    const id = foodItemData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const foodItemDoc = doc(db, 'foodItems', id);
    
    await setDoc(foodItemDoc, {
      name: foodItemData.name,
      category: foodItemData.category,
      description: foodItemData.description || '',
      createdAt: new Date().toISOString(),
      addedBy: foodItemData.addedBy || 'admin'
    });
    
    console.log('Food item added successfully:', id);
    return { success: true, id };
  } catch (error) {
    console.error('Error adding food item:', error);
    throw error;
  }
};

// Function to update an existing food item (admin only)
export const updateFoodItem = async (foodItemId, updateData) => {
  try {
    const foodItemDoc = doc(db, 'foodItems', foodItemId);
    
    await updateDoc(foodItemDoc, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Food item updated successfully:', foodItemId);
    return { success: true, id: foodItemId };
  } catch (error) {
    console.error('Error updating food item:', error);
    throw error;
  }
};

// Function to delete a food item (admin only)
export const deleteFoodItem = async (foodItemId) => {
  try {
    // First, delete all ratings for this food item
    const ratingsQuery = query(
      collection(db, 'ratings'),
      where('foodItemId', '==', foodItemId)
    );
    const ratingsSnapshot = await getDocs(ratingsQuery);
    
    // Delete ratings in batch
    const batch = writeBatch(db);
    ratingsSnapshot.docs.forEach((ratingDoc) => {
      batch.delete(doc(db, 'ratings', ratingDoc.id));
    });
    
    // Delete the food item
    batch.delete(doc(db, 'foodItems', foodItemId));
    
    await batch.commit();
    
    console.log('Food item and related ratings deleted successfully:', foodItemId);
    return { success: true, id: foodItemId, deletedRatings: ratingsSnapshot.docs.length };
  } catch (error) {
    console.error('Error deleting food item:', error);
    throw error;
  }
};

export const useFirebase = () => {
  const { 
    setFoodItems, 
    setRatings, 
    setLoading, 
    setError, 
    foodItems, 
    ratings 
  } = useAppStore();

  // Initialize Firebase data
  const initializeFirebaseData = async () => {
    setLoading(true);
    try {
      // Load food items
      const foodItemsSnapshot = await getDocs(collection(db, 'foodItems'));
      const loadedFoodItems = foodItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Load ratings
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      const loadedRatings = ratingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setFoodItems(loadedFoodItems);
      setRatings(loadedRatings);
      setError(null);
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
      setError('Failed to load data from Firebase');
    } finally {
      setLoading(false);
    }
  };

  // Add or update rating in Firebase
  const saveRatingToFirebase = async (foodId, userName, score) => {
    try {
      const ratingsRef = collection(db, 'ratings');
      
      // Check if rating already exists
      const existingRatingQuery = query(
        ratingsRef,
        where('foodId', '==', foodId),
        where('userName', '==', userName)
      );
      
      const existingRatingSnapshot = await getDocs(existingRatingQuery);
      
      if (!existingRatingSnapshot.empty) {
        // Update existing rating
        const ratingDoc = existingRatingSnapshot.docs[0];
        await updateDoc(doc(db, 'ratings', ratingDoc.id), {
          score,
          updatedAt: new Date()
        });
      } else {
        // Add new rating
        await addDoc(ratingsRef, {
          foodId,
          userName,
          score,
          createdAt: new Date()
        });
      }
      
      setError(null);
      return true;
    } catch (error) {
      console.error('Error saving rating to Firebase:', error);
      setError('Failed to save rating');
      return false;
    }
  };

  // Add food item to Firebase
  const addFoodItemToFirebase = async (foodItem) => {
    try {
      const docRef = await addDoc(collection(db, 'foodItems'), {
        ...foodItem,
        createdAt: new Date()
      });
      
      setError(null);
      return docRef.id;
    } catch (error) {
      console.error('Error adding food item to Firebase:', error);
      setError('Failed to add food item');
      return null;
    }
  };

  // Initialize sample data in Firebase (if empty)
  const initializeSampleDataInFirebase = async () => {
    try {
      const foodItemsSnapshot = await getDocs(collection(db, 'foodItems'));
      
      if (foodItemsSnapshot.empty) {
        // Add sample food items if collection is empty
        const { sampleFoodItems } = await import('../store');
        
        const promises = sampleFoodItems.map(item => 
          addDoc(collection(db, 'foodItems'), {
            ...item,
            createdAt: new Date()
          })
        );
        
        await Promise.all(promises);
        console.log('Sample data initialized in Firebase');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      setError('Failed to initialize sample data');
    }
  };

  // Real-time listeners
  const setupRealtimeListeners = () => {
    // Listen to food items changes
    const unsubscribeFoodItems = onSnapshot(
      collection(db, 'foodItems'),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFoodItems(items);
      },
      (error) => {
        console.error('Error listening to food items:', error);
      }
    );

    // Listen to ratings changes
    const unsubscribeRatings = onSnapshot(
      collection(db, 'ratings'),
      (snapshot) => {
        const ratings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRatings(ratings);
      },
      (error) => {
        console.error('Error listening to ratings:', error);
      }
    );

    return () => {
      unsubscribeFoodItems();
      unsubscribeRatings();
    };
  };

  return {
    initializeFirebaseData,
    saveRatingToFirebase,
    addFoodItemToFirebase,
    initializeSampleDataInFirebase,
    setupRealtimeListeners
  };
};
