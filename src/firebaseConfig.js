import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCH6cJLYv2WYGY-6R45TEsSPAMjlcHIPdA",
  authDomain: "freshathon-fee63.firebaseapp.com",
  projectId: "freshathon-fee63",
  storageBucket: "freshathon-fee63.firebasestorage.app",
  messagingSenderId: "150543082382",
  appId: "1:150543082382:web:44e451a6d2ddcb0aabbadf",
  measurementId: "G-S59Y5BPB26",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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
