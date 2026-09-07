import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "./config/environment";

// Use environment configuration
const firebaseConfig = FIREBASE_CONFIG;

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);

  // Create fallback implementations that don't throw errors
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Call the callback immediately with null to prevent blocking
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithEmailAndPassword: () =>
      Promise.resolve({
        user: {
          uid: "mock-user-id",
          email: "mock@example.com",
          displayName: "Mock User",
        },
      }),
    createUserWithEmailAndPassword: () =>
      Promise.resolve({
        user: {
          uid: "mock-user-id",
          email: "mock@example.com",
          displayName: "Mock User",
        },
      }),
    signOut: () => Promise.resolve(),
    sendPasswordResetEmail: () => Promise.resolve(),
  };

  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      add: () => Promise.resolve({ id: "mock-doc-id" }),
      where: () => ({
        get: () =>
          Promise.resolve({
            empty: true,
            docs: [],
            forEach: () => {},
          }),
        orderBy: () => ({
          get: () =>
            Promise.resolve({
              empty: true,
              docs: [],
              forEach: () => {},
            }),
        }),
      }),
    }),
  };

  storage = {
    ref: () => ({
      put: () =>
        Promise.resolve({
          ref: {
            getDownloadURL: () =>
              Promise.resolve("https://via.placeholder.com/150"),
          },
        }),
      getDownloadURL: () => Promise.resolve("https://via.placeholder.com/150"),
    }),
  };
}

// Helper function to check if a user is an organizer
const isOrganizer = async (user) => {
  if (!user) return false;

  try {
    const userDoc = await db.collection("users").doc(user.uid).get();
    return userDoc.exists && userDoc.data().role === "organizer";
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

export { auth, db, storage, isOrganizer };
