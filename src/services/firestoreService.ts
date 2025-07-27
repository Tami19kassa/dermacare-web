import { db } from '../firebase';
import {
  onSnapshot, 
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
  deleteDoc, 
  increment,
  arrayUnion,
} from 'firebase/firestore';

export interface FeedbackMessage {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  timestamp: Date;
  status: 'new' | 'read' | 'resolved';
  isFromAdmin: boolean;
}

export const sendFeedbackMessage = async (uid: string, email: string, message: string): Promise<void> => {
  const feedbackCollection = collection(db, 'user_feedback');
  await addDoc(feedbackCollection, {
    userId: uid,
    userEmail: email,
    message: message,
    timestamp: serverTimestamp(),
    status: 'new',
    isFromAdmin: false,
  });
};

/**
 * [ADMIN ONLY] Subscribes to all new feedback messages in real-time.
 * @param callback The function to call with the new list of messages.
 * @returns An unsubscribe function from onSnapshot.
 */
export const subscribeToAllFeedback = (callback: (messages: FeedbackMessage[]) => void) => {
  const feedbackCollection = collection(db, 'user_feedback');
  const q = query(
    feedbackCollection,
    where('status', '==', 'new'),
    orderBy('timestamp', 'desc') // <-- CHANGE: 'asc' to 'desc' for newest first
  );

  // Return the unsubscribe function so the component can clean up the listener
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    } as FeedbackMessage));
    callback(messages);
  });
};

/**
 * [ADMIN ONLY] Updates the status of a specific feedback message.
 */
export const updateFeedbackStatus = async (messageId: string, newStatus: 'read' | 'resolved'): Promise<void> => {
  const messageRef = doc(db, 'user_feedback', messageId);
  await updateDoc(messageRef, { status: newStatus });
};

// Define and EXPORT a type for Scan History items for type safety
export interface ScanHistoryItem {
  id: string;
  imageUrl: string;
  condition: string;
  confidence: number;
  timestamp: Date;
}

// --- PROFILE FUNCTIONS ---
// ... (your existing updateUserProfile and getUserProfile functions - no changes needed) ...
export const updateUserProfile = async (uid: string, data: object) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { ...data, lastUpdated: serverTimestamp() }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};


// --- SCAN HISTORY FUNCTIONS ---
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
      timestamp: data.timestamp.toDate(),
    };
  });
};

export const addScanResult = async (uid: string, result: { imageUrl: string; condition: string; confidence: number }) => {
    const historyCollection = collection(db, 'scanHistory');
    await addDoc(historyCollection, {
        ...result,
        userId: uid,
        timestamp: serverTimestamp()
    });
};

// [NEW FUNCTION]
export const deleteScanResult = async (scanId: string): Promise<void> => {
    const scanDocRef = doc(db, 'scanHistory', scanId);
    await deleteDoc(scanDocRef);
};

 
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
  return { score: 0, answeredIds: [] };
};

export const updateUserQuizStats = async (uid: string, scoreGained: number, newAnsweredIds: string[]) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    quizScore: increment(scoreGained),
    answeredQuestionIds: arrayUnion(...newAnsweredIds),
  });
};
