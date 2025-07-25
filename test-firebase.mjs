import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { config } from 'dotenv';

config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    const foodItemsSnapshot = await getDocs(collection(db, 'foodItems'));
    console.log('✅ Firebase connected successfully!');
    console.log('📦 Food items in database:', foodItemsSnapshot.size);
    
    const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
    console.log('⭐ Ratings in database:', ratingsSnapshot.size);
    
    if (foodItemsSnapshot.size > 0) {
      console.log('\n📋 Sample food items:');
      let count = 0;
      foodItemsSnapshot.forEach((doc) => {
        if (count < 5) {
          const data = doc.data();
          console.log(`  - ${data.name} (${data.category})`);
          count++;
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
  }
}

testConnection();
