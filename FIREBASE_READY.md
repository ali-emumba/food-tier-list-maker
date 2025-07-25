# 🔥 Firebase Setup Complete!

## ✅ Your Configuration is Ready

Your Firebase project `food-tier-list` is configured. Now follow these steps:

## Step 1: Enable Authentication (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/project/food-tier-list/authentication)
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. **Enable**: ✅ Email/Password
6. Click "Save"

## Step 2: Enable Firestore Database (Required)

1. Go to [Firestore Database](https://console.firebase.google.com/project/food-tier-list/firestore)
2. Click "Create database"
3. **Important**: Choose "Start in test mode"
4. Select location (choose closest to your users)
5. Click "Done"

## Step 3: Set Security Rules (Important)

1. In Firestore, go to "Rules" tab
2. Replace with this code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 4: Create Demo Users

**Option A: Manual Creation (Recommended)**

1. Go to [Authentication > Users](https://console.firebase.google.com/project/food-tier-list/authentication/users)
2. Click "Add user"
3. Create these users:
   - Email: `ali.usman@foodtier.com`, Password: `1234`
   - Email: `syeda.duaa@foodtier.com`, Password: `volleyballteamcaptainthatbeatpunjabcollege`

**Option B: Let users sign up**

- Users can create their own accounts using the signup form

## Step 5: Test Your App

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Try logging in with demo credentials or create a new account

## 🎉 You're Ready!

Your Food Tier List Maker is now connected to Firebase with:

- ✅ Real-time authentication
- ✅ Cloud database storage
- ✅ Multi-user support
- ✅ Live data synchronization

The food items will be automatically created when you first run the app!
