# Blueprint for Twisted Alchemy CRM

## Overview

This document outlines the development of the Twisted Alchemy CRM application, focusing on core features for managing customers and orders for a woodworking business. The application will be built using React and Firebase, leveraging Firebase's authentication and Firestore database for data storage.

## Version 0.5 (Initial Setup & Authentication)

### Features:

*   User login and authentication using Firebase Authentication.
*   Basic user interface for login.

### Files Modified:

*   `src/App.jsx`: Main application component, handles routing and authentication flow.
*   `src/components/Login.jsx`: Login form component.
*   `src/auth.js`: Firebase authentication logic.

## Version 0.6 (Core CRM Features - Dashboard & Customers)

### Features:

*   **Dashboard Home Screen**: A main landing page after successful login.
*   **Customers Page**: Functionality to add, view, and edit customer details (name, phone, email, address).
*   **Firestore Integration**: All customer data will be stored and retrieved from Firestore.

### Plan and Steps:

1.  **Dependency Consistency**: Ensure `eslint` versions are consistent in `package.json` and `package-lock.json`.
2.  **Blueprint Update**: Update `blueprint.md` with details of the new features.
3.  **Firestore Rules Update**: Modify `firestore.rules` to allow read/write access to `customers` and `orders` collections for authenticated users.
4.  **Dashboard Component (`src/components/DashboardHome.jsx`)**: Create a new React component for the dashboard.
5.  **Customers Page Components (`src/pages/Customers.jsx`, `src/components/CustomerForm.jsx`)**: Create components for displaying and managing customer information.
6.  **App Routing (`src/App.jsx`)**: Implement routing for the new dashboard and customer pages using `react-router-dom`.
7.  **CSS Styling**: Add basic styling for the new components.
8.  **Run Sanity Checks**: Execute `npm install`, `npm run lint`, and `npm run build` to verify the application's integrity.
