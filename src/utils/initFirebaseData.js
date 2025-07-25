import { initializeSampleData } from '../hooks/useFirebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const initializeDefaultUsers = async () => {
  const defaultUsers = [
    {
      email: 'ali.usman@foodtier.com',
      password: '1234',
      displayName: 'Ali Usman'
    },
    {
      email: 'syeda.duaa@foodtier.com', 
      password: 'volleyballteamcaptainthatbeatpunjabcollege',
      displayName: 'Syeda Duaa Fatima'
    }
  ];

  console.log('🔧 Initializing default users...');

  for (const userData of defaultUsers) {
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
};

export const setupInitialData = async () => {
  try {
    console.log('🚀 Setting up initial data for Firebase...');
    
    // Initialize food items
    await initializeSampleData();
    console.log('✅ Food items initialized');
    
    // Initialize default users
    await initializeDefaultUsers();
    console.log('✅ Default users initialized');
    
    console.log('🎉 Initial data setup complete!');
  } catch (error) {
    console.error('❌ Error setting up initial data:', error);
  }
};
