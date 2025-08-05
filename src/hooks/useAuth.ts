import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User  
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import { updateUserProfile as updateFirestoreProfile } from '../services/firestoreService';
 
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
 
  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, { displayName });
    await updateFirestoreProfile(userCredential.user.uid, { name: displayName, email: email });
  };
 
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
 
  const logout = () => {
    return signOut(auth);
  };
 
  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };
 
  const uploadAndUpdateProfilePicture = async (file: File): Promise<string> => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
 
    const filePath = `profile_images/${auth.currentUser.uid}`;
    const storageRef = ref(storage, filePath);
 
    await uploadBytes(storageRef, file);
 
    const photoURL = await getDownloadURL(storageRef);
 
    await updateProfile(auth.currentUser, { photoURL });
  
    await updateFirestoreProfile(auth.currentUser.uid, { photoURL });
 
    return photoURL;
  };
 
  const updateDisplayName = async (newDisplayName: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    if (!newDisplayName.trim()) throw new Error("Display name cannot be empty.");
 
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