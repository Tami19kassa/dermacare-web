import { db } from '../firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  addDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';

// Define a type for Scan History items for type safety
export interface ScanHistoryItem {
  id: string;
  imageUrl: string;
  condition: string;
  confidence: number;
  timestamp: Date;
}

// --- PROFILE FUNCTIONS ---

/**
 * Creates or updates a user's document in the 'users' collection.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param data - An object containing the profile data to set or merge.
 */
export const updateUserProfile = async (uid: string, data: object) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { ...data, lastUpdated: serverTimestamp() }, { merge: true });
};

/**
 * Fetches a user's profile document from Firestore.
 * @param uid - The user's unique ID.
 * @returns The user's data object, or null if not found.
 */
export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};


// --- SCAN HISTORY FUNCTIONS ---

/**
 * Fetches the most recent scan history for a given user.
 * @param uid - The user's unique ID.
 * @param count - The number of history items to fetch.
 * @returns A promise that resolves to an array of ScanHistoryItem objects.
 */
export const getScanHistory = async (uid: string, count: number = 10): Promise<ScanHistoryItem[]> => {
  const historyCollection = collection(db, 'scanHistory');
  const q = query(
    historyCollection,
    where('userId', '==', uid),
    orderBy('timestamp', 'desc'),
    limit(count)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
      condition: data.condition,
      confidence: data.confidence,
      timestamp: data.timestamp.toDate(), // Convert Firestore Timestamp to JS Date
    };
  });
};

/**
 * Adds a new scan result to the 'scanHistory' collection.
 * @param uid - The user's unique ID.
 * @param result - The prediction result object.
 */
export const addScanResult = async (uid: string, result: { imageUrl: string; condition: string; confidence: number }) => {
    const historyCollection = collection(db, 'scanHistory');
    await addDoc(historyCollection, {
        ...result,
        userId: uid,
        timestamp: serverTimestamp()
    });
};


// --- QUIZ FUNCTIONS ---

/**
 * Fetches the user's current total quiz score and list of answered question IDs.
 * @param uid - The user's unique ID.
 * @returns A promise resolving to an object with the user's quiz stats.
 */
export const getUserQuizStats = async (uid: string): Promise<{ score: number; answeredIds: string[] }> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      score: data.quizScore || 0,
      answeredIds: data.answeredQuestionIds || [],
    };
  }
  return { score: 0, answeredIds: [] }; // Default for new users
};

/**
 * Updates a user's quiz stats atomically after a quiz is completed.
 * @param uid - The user's unique ID.
 * @param scoreGained - The number of correct answers in the last session.
 * @param newAnsweredIds - An array of the new question IDs to add to the user's history.
 */
export const updateUserQuizStats = async (uid: string, scoreGained: number, newAnsweredIds: string[]) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    // Atomically increment the total score by the amount gained in this session.
    quizScore: increment(scoreGained),
    // Atomically add all new answered question IDs to the existing array, without duplicates.
    answeredQuestionIds: arrayUnion(...newAnsweredIds),
  });
};