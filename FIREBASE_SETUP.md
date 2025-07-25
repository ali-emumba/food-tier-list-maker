# Firebase Setup Guide

This document explains how to set up Firebase for the Food Tier List Maker application.

## Prerequisites

1. A Google account
2. Access to the [Firebase Console](https://console.firebase.google.com)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "food-tier-list")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose one close to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon and select "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a name (e.g., "Food Tier List Web")
5. Copy the Firebase configuration object

## Step 4: Update Your App Configuration

Replace the placeholder values in `src/firebase.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## Step 5: Set Up Firestore Collections

The app will automatically create the necessary collections when you first use it. However, you can manually create them:

### Collections Structure

#### `foodItems` Collection

```javascript
// Document structure
{
  id: "auto-generated-id",
  name: "Zinger Burger",
  category: "Fast Food",
  createdAt: timestamp
}
```

#### `ratings` Collection

```javascript
// Document structure
{
  id: "auto-generated-id",
  foodId: "reference-to-food-item-id",
  userName: "Ali Usman",
  score: 8,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Step 6: Initialize Sample Data (Optional)

If you want to populate your Firestore with sample data:

1. Open your app in the browser
2. Log in with one of the demo accounts
3. The app will automatically create sample food items
4. Start rating items to create sample data

## Step 7: Security Rules (Production)

For production, update your Firestore security rules. In the Firebase Console:

1. Go to "Firestore Database" > "Rules"
2. Update the rules (example below):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for now
    // In production, you should implement proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For better security in production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Food items are readable by all, writable by authenticated users
    match /foodItems/{foodId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Ratings are readable by all, but users can only write their own
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.auth.token.name == resource.data.userName;
      allow update: if request.auth != null
                    && request.auth.token.name == resource.data.userName;
    }
  }
}
```

## Step 8: Enable Authentication (Optional)

If you want to implement real authentication instead of hardcoded users:

1. Go to "Authentication" in the Firebase Console
2. Click "Get started"
3. Choose sign-in methods (Email/Password, Google, etc.)
4. Update your app to use Firebase Auth instead of hardcoded credentials

## Environment Variables (Recommended)

For security, consider using environment variables for your Firebase config:

1. Create a `.env` file in your project root:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/firebase.js` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

3. Add `.env` to your `.gitignore` file

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check your Firestore security rules
2. **Project Not Found**: Verify your project ID is correct
3. **Network Issues**: Ensure your internet connection is stable
4. **Quota Exceeded**: Check your Firebase usage limits

### Testing Firebase Connection

The app includes error handling and will display connection issues in the browser console. Check the developer tools if you encounter problems.

## Deployment

When deploying to production:

1. Update security rules
2. Use environment variables
3. Consider enabling Firebase Hosting for easy deployment
4. Set up monitoring and analytics

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)
