import { initializeSampleData } from './hooks/useFirebase.js';

// Simple script to initialize Firebase with sample data
console.log('🔥 Initializing Firebase sample data...');

async function setupData() {
  try {
    await initializeSampleData();
    console.log('✅ Sample data initialized successfully!');
    console.log('You can now use the Food Tier List Maker with Firebase backend.');
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    console.log('Make sure you have configured Firebase properly in firebase.js');
  }
}

setupData();
