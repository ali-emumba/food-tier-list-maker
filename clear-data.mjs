import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables
config();

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearOldData() {
  console.log('🗑️  Clearing old food items and ratings...');
  
  try {
    // Clear food items
    const foodItemsSnapshot = await getDocs(collection(db, 'foodItems'));
    const foodItemsBatch = writeBatch(db);
    
    foodItemsSnapshot.docs.forEach((docSnapshot) => {
      foodItemsBatch.delete(doc(db, 'foodItems', docSnapshot.id));
    });
    
    await foodItemsBatch.commit();
    console.log(`✅ Deleted ${foodItemsSnapshot.docs.length} old food items`);
    
    // Clear ratings
    const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
    const ratingsBatch = writeBatch(db);
    
    ratingsSnapshot.docs.forEach((docSnapshot) => {
      ratingsBatch.delete(doc(db, 'ratings', docSnapshot.id));
    });
    
    await ratingsBatch.commit();
    console.log(`✅ Deleted ${ratingsSnapshot.docs.length} old ratings`);
    
    console.log('🎉 Data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Run clear operation
clearOldData();
