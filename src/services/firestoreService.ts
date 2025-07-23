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
  deleteDoc, 
  increment,
  arrayUnion,
} from 'firebase/firestore';

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
