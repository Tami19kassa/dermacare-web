import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User // It's good practice to import types explicitly
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import { updateUserProfile as updateFirestoreProfile } from '../services/firestoreService';

// Define the shape of the context value for clarity
interface AuthHookValue {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  uploadAndUpdateProfilePicture: (file: File) => Promise<string>;
  updateDisplayName: (newDisplayName: string) => Promise<void>;
}

export const useAuth = (): AuthHookValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  /**
   * Registers a new user with email, password, and a display name.
   */
  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // After creating the user, update their profile in both Auth and Firestore
    await updateProfile(userCredential.user, { displayName });
    await updateFirestoreProfile(userCredential.user.uid, { name: displayName, email: email });
  };

  /**
   * Signs in an existing user with their email and password.
   */
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signs out the current user.
   */
  const logout = () => {
    return signOut(auth);
  };

  /**
   * Sends a password reset email to the specified email address.
   */
  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  /**
   * Uploads a new profile picture, updates the user's Auth profile, and Firestore document.
   * @param file - The image file to upload.
   * @returns The public download URL of the uploaded image.
   */
  const uploadAndUpdateProfilePicture = async (file: File): Promise<string> => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");

    // 1. Create a reference to the file in Firebase Storage
    const filePath = `profile_images/${auth.currentUser.uid}`;
    const storageRef = ref(storage, filePath);

    // 2. Upload the file
    await uploadBytes(storageRef, file);

    // 3. Get the public download URL
    const photoURL = await getDownloadURL(storageRef);

    // 4. Update the user's profile in Firebase Authentication
    await updateProfile(auth.currentUser, { photoURL });

    // 5. Update the user's profile in the Firestore database
    await updateFirestoreProfile(auth.currentUser.uid, { photoURL });

    // Return the new URL so the UI can update instantly
    return photoURL;
  };

  /**
   * Updates the display name for the current user in both Auth and Firestore.
   * @param newDisplayName - The new name for the user.
   */
  const updateDisplayName = async (newDisplayName: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    if (!newDisplayName.trim()) throw new Error("Display name cannot be empty.");

    // 1. Update the profile in Firebase Authentication
    await updateProfile(auth.currentUser, {
      displayName: newDisplayName,
    });

    // 2. Update the profile in the Firestore database
    await updateFirestoreProfile(auth.currentUser.uid, {
      name: newDisplayName,
    });
  };

  return {
    ...context,
    register,
    login,
    logout,
    resetPassword,
    uploadAndUpdateProfilePicture,
    updateDisplayName
  };
};