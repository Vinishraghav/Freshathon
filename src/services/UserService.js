import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { 
  updateProfile, 
  updateEmail, 
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";

/**
 * UserService - A service for handling user profile operations
 */
class UserService {
  /**
   * Get user profile data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} The user profile data
   */
  async getUserProfile(userId) {
    try {
      // First check if user exists in the users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // User exists in the collection
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      
      // If not found in collection, check if there's a document with the user ID
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        return { id: userDocSnap.id, ...userDocSnap.data() };
      }
      
      // If no user profile found, return basic info from auth
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        return {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          role: "student" // Default role
        };
      }
      
      throw new Error("User profile not found");
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }
  
  /**
   * Update user profile data
   * @param {string} userId - The user ID
   * @param {Object} profileData - The profile data to update
   * @returns {Promise<void>}
   */
  async updateUserProfile(userId, profileData) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.uid !== userId) {
        throw new Error("Unauthorized");
      }
      
      // Update Firebase Auth profile if needed
      const authUpdates = {};
      if (profileData.displayName !== undefined) {
        authUpdates.displayName = profileData.displayName;
      }
      if (profileData.photoURL !== undefined) {
        authUpdates.photoURL = profileData.photoURL;
      }
      
      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(currentUser, authUpdates);
      }
      
      // Update email if provided
      if (profileData.email !== undefined && profileData.email !== currentUser.email) {
        await updateEmail(currentUser, profileData.email);
      }
      
      // Check if user exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const firestoreData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };
      
      // Remove auth-specific fields from Firestore data
      delete firestoreData.password;
      delete firestoreData.newPassword;
      delete firestoreData.currentPassword;
      
      if (!querySnapshot.empty) {
        // Update existing document
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), firestoreData);
      } else {
        // Create new document with user ID
        await setDoc(doc(db, "users", userId), {
          uid: userId,
          ...firestoreData,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }
  
  /**
   * Update user password
   * @param {string} currentPassword - The current password
   * @param {string} newPassword - The new password
   * @returns {Promise<void>}
   */
  async updateUserPassword(currentPassword, newPassword) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
  
  /**
   * Upload user profile picture
   * @param {File} file - The image file to upload
   * @returns {Promise<string>} The download URL of the uploaded image
   */
  async uploadProfilePicture(file) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with the new photo URL
      await updateProfile(currentUser, { photoURL: downloadURL });
      
      // Update Firestore user document
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          photoURL: downloadURL,
          updatedAt: serverTimestamp()
        });
      }
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  }
  
  /**
   * Delete user profile picture
   * @returns {Promise<void>}
   */
  async deleteProfilePicture() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.photoURL) {
        return;
      }
      
      // Extract the path from the URL
      const photoURL = currentUser.photoURL;
      if (photoURL.includes("firebase") && photoURL.includes("profile_pictures")) {
        // This is a Firebase Storage URL, so we can delete it
        const storageRef = ref(storage, photoURL);
        await deleteObject(storageRef);
      }
      
      // Update user profile to remove the photo URL
      await updateProfile(currentUser, { photoURL: null });
      
      // Update Firestore user document
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          photoURL: null,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      throw error;
    }
  }
  
  /**
   * Get user event history
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} The user's event history
   */
  async getUserEventHistory(userId) {
    try {
      // Get events the user has registered for
      const registrationsRef = collection(db, "registrations");
      const q = query(
        registrationsRef, 
        where("userId", "==", userId),
        orderBy("registeredAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      
      // Get the actual event data for each registration
      const eventPromises = querySnapshot.docs.map(async (doc) => {
        const eventId = doc.data().eventId;
        const eventDoc = await getDoc(doc(db, "events", eventId));
        
        if (eventDoc.exists()) {
          return { 
            id: eventDoc.id, 
            ...eventDoc.data(), 
            registrationId: doc.id,
            registeredAt: doc.data().registeredAt?.toDate() || null,
            status: doc.data().status || "registered"
          };
        }
        return null;
      });
      
      const events = await Promise.all(eventPromises);
      return events.filter(event => event !== null);
    } catch (error) {
      console.error("Error getting user event history:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new UserService();
