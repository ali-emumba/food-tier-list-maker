import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';
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
const auth = getAuth(app);
const db = getFirestore(app);

// Sample food items data
const sampleFoodItems = [
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

// Demo users
const demoUsers = [
  {
    email: 'ali.usman@foodtier.com',
    password: '123456',
    displayName: 'Ali Usman'
  },
  {
    email: 'syeda.duaa@foodtier.com',
    password: 'volleyballteamcaptainthatbeatpunjabcollege',
    displayName: 'Syeda Duaa Fatima'
  }
];

async function createDemoUsers() {
  console.log('🔧 Creating demo users...');
  
  for (const userData of demoUsers) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Store additional user data
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userData.email,
        displayName: userData.displayName,
        createdAt: new Date().toISOString(),
        isDefaultUser: true
      });

      console.log(`✅ Created user: ${userData.displayName}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️  User ${userData.displayName} already exists`);
      } else {
        console.error(`❌ Error creating user ${userData.displayName}:`, error.message);
      }
    }
  }
}

async function initializeFoodItems() {
  console.log('🍕 Initializing food items...');
  
  try {
    const batch = writeBatch(db);
    
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
    console.log('✅ Food items initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing food items:', error);
  }
}

async function setupProject() {
  console.log('🚀 Setting up Food Tier List project...');
  
  try {
    await createDemoUsers();
    await initializeFoodItems();    console.log('🎉 Project setup complete!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('1. Email: ali.usman@foodtier.com, Password: 123456');
    console.log('2. Email: syeda.duaa@foodtier.com, Password: volleyballteamcaptainthatbeatpunjabcollege');
    console.log('\n🌐 Start your app with: npm run dev');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run setup
setupProject();
