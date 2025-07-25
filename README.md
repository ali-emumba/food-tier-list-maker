# Food Tier List Maker

A React application built with Vite that allows users to rate food items and see them organized in tier lists. Features Firebase integration for authentication and real-time data persistence.

## 🚀 Features

- **Firebase Authentication**: Secure user authentication with email/password
- **Real-time Database**: Live updates using Firebase Firestore
- **Food Categories**: Items organized by Fast Food, Desi, Bakery, Drinks, and Snacks
- **Rating System**: Rate food items from 0-10 with a user-friendly modal interface
- **Tier Classification**: Automatic tier assignment (Good: 9-10, OK: 7-8.9, Maybe: 5-6.9, NO: below 5)
- **Multi-user Support**: See ratings from all users with real-time averages
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Analytics Dashboard**: Comprehensive statistics and insights

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Routing**: React Router v6
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase project with Firestore and Auth enabled

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd food-tier-list-maker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase** (See [Firebase Setup](#firebase-setup) below)

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "food-tier-list" (or your preferred name)
4. Enable Google Analytics (optional)

### Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider

### Step 3: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in "test mode" for development
4. Choose a location near your users

### Step 4: Get Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app with a name
5. Copy the configuration object

### Step 5: Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Step 6: Set Firestore Security Rules

Go to Firestore Database > Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 7: Create Demo Users (Optional)

You can create demo accounts manually in Firebase Auth:

- Email: `ali.usman@foodtier.com`, Password: `1234`
- Email: `syeda.duaa@foodtier.com`, Password: `volleyballteamcaptainthatbeatpunjabcollege`

Or let users sign up with their own credentials.

## 🎮 Usage

1. **Authentication**: Sign in with existing credentials or create a new account
2. **Browse Food Items**: View 25 food items across 5 categories
3. **Rate Items**: Click on any food item to open the rating modal (0-10 scale)
4. **View Tiers**: Switch to "Tier View" to see items grouped by rating tiers
5. **Check Statistics**: View comprehensive analytics in the "Stats" section
6. **Real-time Updates**: See other users' ratings update in real-time

## 📊 Tier System

- **Good** (9.0-10.0): Green tier - Highly recommended items
- **OK** (7.0-8.9): Yellow tier - Decent items worth trying
- **Maybe** (5.0-6.9): Orange tier - Average items, try if curious
- **NO** (0.0-4.9): Red tier - Not recommended items

## 🏗 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Header.jsx     # Navigation and view switching
│   ├── FoodItemCard.jsx # Individual food item display
│   ├── RatingModal.jsx # Rating submission modal
│   ├── TierView.jsx   # Tier-based rankings view
│   └── StatsPanel.jsx # Analytics dashboard
├── hooks/             # Custom React hooks
│   ├── useAuth.js     # Firebase authentication
│   └── useFirebase.js # Firebase operations
├── pages/             # Main application pages
│   ├── Login.jsx      # Authentication page
│   └── Dashboard.jsx  # Main dashboard
├── utils/             # Utility functions
│   └── dataUtils.js   # Data calculations
├── App.jsx           # Main app component
├── firebase.js       # Firebase configuration
└── store.js          # Zustand state management
```

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**

   ```bash
   firebase login
   ```

3. **Initialize hosting**

   ```bash
   firebase init hosting
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

### Other Platforms

The app can also be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Just build with `npm run build` and upload the `dist` folder.

## 🛠 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Vite teams for excellent developer tools
- Firebase for backend infrastructure
- Tailwind CSS for styling utilities
- Zustand for state management

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd food-items-rating
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase (optional):

   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your Firebase config and update `src/firebase.js`

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 👤 Demo Accounts

Use these credentials to log in:

- **User 1**:

  - Username: `Ali Usman`
  - Password: `1234`

- **User 2**:
  - Username: `Syeda Duaa Fatima`
  - Password: `volleyballteamcaptainthatbeatpunjabcollege`

## 🗄️ Database Structure

### Firestore Collections

#### `foodItems`

```javascript
{
  id: "burger",
  name: "Zinger Burger",
  category: "Fast Food",
  createdAt: timestamp
}
```

#### `ratings`

```javascript
{
  id: "rating_id",
  foodId: "burger",
  userName: "Ali Usman",
  score: 8,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎯 Usage

1. **Login**: Use one of the demo accounts to sign in
2. **Browse Food Items**: View items organized by category
3. **Rate Items**: Click on any food item to open the rating modal
4. **Submit Ratings**: Use the slider or input field to rate items (0-10)
5. **View Tiers**: Items are automatically categorized into tiers based on average scores
6. **See Other Ratings**: View all user ratings for each item in the modal

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FoodItemCard.jsx # Individual food item display
│   ├── Header.jsx       # Navigation header
│   └── RatingModal.jsx  # Rating submission modal
├── hooks/              # Custom React hooks
│   └── useFirebase.js  # Firebase operations
├── pages/              # Main application pages
│   ├── Dashboard.jsx   # Main food tier list view
│   └── Login.jsx       # Authentication page
├── utils/              # Utility functions
├── firebase.js         # Firebase configuration
├── store.js           # Zustand state management
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## 🎨 Tier System

Items are automatically classified based on their average user ratings:

- **🏆 Good** (9.0 - 10.0): Excellent items
- **👍 OK** (7.0 - 8.9): Good items worth trying
- **🤔 Maybe** (5.0 - 6.9): Average items, might be worth trying
- **❌ NO** (0.0 - 4.9): Items to avoid

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

3. Configure Firebase hosting (optional):
   ```bash
   npm install -g firebase-tools
   firebase init hosting
   firebase deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Firebase for backend services
- Zustand for simple state management+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
