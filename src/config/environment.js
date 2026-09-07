/**
 * Environment configuration for the Eventsphere application
 *
 * This file provides environment-specific configuration values.
 * For local development, values are hardcoded.
 * For production, values should be set in environment variables.
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",

  // Timeout for API requests in milliseconds
  TIMEOUT: process.env.REACT_APP_API_TIMEOUT || 30000,
};

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyCH6cJLYv2WYGY-6R45TEsSPAMjlcHIPdA",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "freshathon-fee63.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "freshathon-fee63",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "freshathon-fee63.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "150543082382",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:150543082382:web:44e451a6d2ddcb0aabbadf",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-S59Y5BPB26",
};

// Maps API configuration
export const MAPS_CONFIG = {
  API_KEY:
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
    "AIzaSyBhYUMM2nXhGRuXJ-_m4yvzHLTYP_fuLG4", // Replace with your actual API key in production
  DEFAULT_CENTER: {
    lat: 20.5937,
    lng: 78.9629,
  },
  DEFAULT_ZOOM: 5,
  NEARBY_PLACES_TYPES: [
    { id: "restaurant", name: "Restaurants" },
    { id: "cafe", name: "Cafes" },
    { id: "hotel", name: "Hotels" },
    { id: "parking", name: "Parking" },
    { id: "atm", name: "ATMs" },
    { id: "hospital", name: "Hospitals" },
    { id: "pharmacy", name: "Pharmacies" },
    { id: "gas_station", name: "Gas Stations" },
    { id: "shopping_mall", name: "Shopping Malls" },
  ],
};

// Application configuration
export const APP_CONFIG = {
  // Application name
  APP_NAME: "Eventsphere",

  // Application version
  VERSION: "1.0.0",

  // Default pagination limit
  DEFAULT_PAGE_LIMIT: 12,

  // Maximum file upload size in bytes (5MB)
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024,

  // Supported file types for uploads
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],

  // Default nearby events radius in kilometers
  NEARBY_RADIUS: 100,
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: true,
  ENABLE_REMINDERS: true,
  ENABLE_SHARING: true,
  ENABLE_MAPS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_BOOKMARKS: true,
  ENABLE_LOCATION_SEARCH: true,
  ENABLE_NEARBY_PLACES: true,
  ENABLE_DIRECTIONS: true,
  ENABLE_USER_LOCATION: true,
};

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";
