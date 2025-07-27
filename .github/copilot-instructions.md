# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a React Vite application for a Food Tier List Maker with Firebase integration. The application allows users to create accounts and rate food items across different categories with real-time statistics and tier rankings.

## Tech Stack

- React with Vite
- Firebase (Firestore + Auth)
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management

## Key Features

- User authentication (sign up/sign in with Firebase Auth)
- Food items categorized by type (Diet Meals, Curry, Rice, Snacks)
- Rating system (0-10) for each food item
- Tier system based on average scores (Good: 9-10, OK: 7-8.9, Maybe: 5-6.9, NO: below 5)
- Real-time statistics dashboard with charts and analytics
- Category filtering and live data updates
- Firebase Firestore for data persistence and real-time sync

## Code Style Guidelines

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Use TypeScript-style prop validation where possible
