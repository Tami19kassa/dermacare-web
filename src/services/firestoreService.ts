import { db } from '../firebase';
// --- FIX: Import 'Functions' as a type to satisfy verbatimModuleSyntax ---
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
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
  onSnapshot,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

//======================================================================
//  TYPE DEFINITIONS
//======================================================================

export interface ScanHistoryItem {
  id: string;
  imageUrl: string;
  condition: string;
  confidence: number;
  timestamp: Date;
}

export interface FeedbackMessage {
  id: string;
  userId: string;
  userEmail: string;
  fullName: string;
  message: string;
  timestamp: Date;
  status: 'new' | 'read' | 'resolved';
  isFromAdmin: boolean;
}

//======================================================================
//  PROFILE & USER DATA FUNCTIONS
//======================================================================

export const updateUserProfile = async (uid: string, data: object): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { ...data, lastUpdated: serverTimestamp() }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
};

//======================================================================
//  SCAN HISTORY FUNCTIONS
//======================================================================

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

export const addScanResult = async (uid: string, result: { imageUrl: string; condition: string; confidence: number }): Promise<void> => {
    const historyCollection = collection(db, 'scanHistory');
    await addDoc(historyCollection, {
        ...result,
        userId: uid,
        timestamp: serverTimestamp()
    });
};

export const deleteScanResult = async (scanId: string): Promise<void> => {
    const scanDocRef = doc(db, 'scanHistory', scanId);
    await deleteDoc(scanDocRef);
};

//======================================================================
//  QUIZ STATS FUNCTIONS
//======================================================================

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

export const updateUserQuizStats = async (uid: string, scoreGained: number, newAnsweredIds: string[]): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    quizScore: increment(scoreGained),
    answeredQuestionIds: arrayUnion(...newAnsweredIds),
  });
};

//======================================================================
//  ADMIN MESSAGING & FEEDBACK FUNCTIONS
//======================================================================

export const sendFeedbackMessage = async (uid: string, email: string, message: string, fullName: string): Promise<void> => {
  const feedbackCollection = collection(db, 'user_feedback');
  await addDoc(feedbackCollection, {
    userId: uid,
    userEmail: email,
    fullName: fullName,
    message: message,
    timestamp: serverTimestamp(),
    status: 'new',
    isFromAdmin: false,
  });
};

export const subscribeToAllFeedback = (callback: (messages: FeedbackMessage[]) => void) => {
  const feedbackCollection = collection(db, 'user_feedback');
  const q = query(
    feedbackCollection,
    where('status', '==', 'new'),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      } as FeedbackMessage));
      callback(messages);
    },
    (error) => {
      console.error("Feedback subscription error:", error);
      toast.error("Error: Could not connect to the message inbox.");
      callback([]); // Return empty array on error to stop loading spinners
    }
  );
};

export const subscribeToConversation = (messageId: string, callback: (messages: any[]) => void) => {
  const repliesCollection = collection(db, 'user_feedback', messageId, 'replies');
  const q = query(repliesCollection, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const replies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }));
    callback(replies);
  });
};

export const sendAdminReply = async (messageId: string, adminUid: string, message: string): Promise<void> => {
  const replyCollection = collection(db, 'user_feedback', messageId, 'replies');
  await addDoc(replyCollection, {
    message: message,
    senderId: adminUid,
    timestamp: serverTimestamp(),
    isFromAdmin: true,
  });
};

export const updateFeedbackStatus = async (messageId: string, newStatus: 'read' | 'resolved'): Promise<void> => {
  const messageRef = doc(db, 'user_feedback', messageId);
  await updateDoc(messageRef, { status: newStatus });
};

//======================================================================
//  CLOUD FUNCTIONS CALLABLES (FOR ADMIN ROLE MANAGEMENT)
//======================================================================

// --- FIX: Lazy initialization to prevent deployment timeouts ---
let functionsInstance: Functions | null = null;
const getFunctionsInstance = () => {
    if (functionsInstance === null) {
        functionsInstance = getFunctions();
    }
    return functionsInstance;
}

/**
 * [ADMIN ONLY] Calls the 'addAdminRole' Cloud Function.
 */
export const makeUserAdmin = httpsCallable(getFunctionsInstance(), 'addAdminRole');

/**
 * [ADMIN ONLY] Calls the 'removeAdminRole' Cloud Function.
 */
export const removeAdminRole = httpsCallable(getFunctionsInstance(), 'removeAdminRole');