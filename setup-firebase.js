#!/usr/bin/env node

// Firebase Setup Script for Food Tier List Maker
// This script helps set up Firebase configuration and initial data

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { setupInitialData } from './utils/initFirebaseData.js';

// Check if we're running in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Instructions for Firebase setup
console.log(`
🔥 Firebase Setup for Food Tier List Maker
==========================================

Step 1: Create a Firebase Project
---------------------------------
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it "food-tier-list" (or your preferred name)
4. Enable Google Analytics (optional)

Step 2: Enable Authentication
-----------------------------
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

Step 3: Enable Firestore Database
---------------------------------
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in "test mode" for development
4. Choose a location near your users

Step 4: Get Configuration
-------------------------
1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a name
5. Copy the configuration object

Step 5: Update Firebase Configuration
------------------------------------
Replace the configuration in src/firebase.js with your actual values:

const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

Step 6: Set Firestore Security Rules
------------------------------------
Go to Firestore Database > Rules and use these development rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

Step 7: Initialize Sample Data
------------------------------
After setting up Firebase, run this script to add sample food items
and create demo user accounts.

Note: You'll need to manually create the demo user accounts:
- Email: ali.usman@foodtier.com, Password: 1234
- Email: syeda.duaa@foodtier.com, Password: volleyballteamcaptainthatbeatpunjabcollege

Or allow users to sign up with their own credentials.

Step 8: Deploy (Optional)
------------------------
To deploy your app:
1. Install Firebase CLI: npm install -g firebase-tools
2. Login: firebase login
3. Initialize: firebase init hosting
4. Build: npm run build
5. Deploy: firebase deploy

🎉 Your Food Tier List Maker will be ready!
`);

// If configuration is provided, attempt to initialize data
const tryInitializeData = async () => {
  try {
    console.log('\n🚀 Attempting to initialize sample data...');
    await setupInitialData();
  } catch (error) {
    console.log('\n⚠️  Could not initialize data automatically.');
    console.log('   This is normal if Firebase is not configured yet.');
    console.log('   Complete the setup steps above first.');
  }
};

if (isDevelopment) {
  tryInitializeData();
}
