import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onSnapshot, collection, query, where, orderBy, limit, getCountFromServer, Timestamp } from 'firebase/firestore'; // <-- IMPORT Timestamp
import { auth, db } from '../../firebase';
import { deleteScanResult, type ScanHistoryItem } from '../../services/firestoreService';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { Spinner } from '../../components/Spinner';
import { ConfirmModal } from '../../components/ConfirmModal';

const ScanHistory: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [displayLimit, setDisplayLimit] = useState(3);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);

  // State for the confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scanIdToDelete, setScanIdToDelete] = useState<string | null>(null);

  // --- IMPROVEMENT 1: Fetch total count only once or when user changes ---
  useEffect(() => {
    if (user) {
      const getCount = async () => {
        try {
          const historyCollectionRef = collection(db, 'scanHistory');
          const q = query(historyCollectionRef, where('userId', '==', user.uid));
          const snapshot = await getCountFromServer(q);
          setTotalHistoryCount(snapshot.data().count);
        } catch (error) {
          console.error("Failed to get total scan count:", error);
        }
      };
      getCount();
    } else {
      setTotalHistoryCount(0);  
    }
  }, [user]);

  // Effect to fetch the limited list of scans for display
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;  
    }

    setLoading(true);
    const historyCollectionRef = collection(db, 'scanHistory');
    const q = query(
      historyCollectionRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(displayLimit)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // --- IMPROVEMENT 2: Safer data mapping ---
      const userHistory = snapshot.docs.map(doc => {
        const data = doc.data();
        // Check if timestamp exists and is a Firestore Timestamp before converting
        const timestamp = data.timestamp instanceof Timestamp 
          ? data.timestamp.toDate() 
          : new Date(); // Fallback to current date if timestamp is invalid

        return {
          id: doc.id,
          imageUrl: data.imageUrl || '', // Provide fallback for missing data
          condition: data.condition || 'Unknown',
          confidence: data.confidence || 0,
          timestamp: timestamp,
        } as ScanHistoryItem;
      });
      setHistory(userHistory);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scan history:", error);
      toast.error("Could not load scan history.");
      setLoading(false);
    });
 
    return () => unsubscribe();
  }, [user, displayLimit]);
 
  const handleAttemptDelete = useCallback((scanId: string) => {
    setScanIdToDelete(scanId);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!scanIdToDelete) return;  
    setIsConfirmOpen(false);
    
    const toastId = toast.loading('Deleting scan...');
    try {
      await deleteScanResult(scanIdToDelete);
      toast.success(t('scan_deleted'), { id: toastId });
       
    } catch (error) {
      toast.error(t('failed_to_delete_scan'), { id: toastId });
    } finally {
       
      setScanIdToDelete(null);
    }
  }, [scanIdToDelete, t]);

  if (loading && history.length === 0) {
    return <div className="text-center py-8"><Spinner /></div>;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="space-y-3">
          {history.length === 0 && !loading ? (
            <p className="text-center text-sm text-text-secondary py-8">{t('no_scan_history')}</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface transition-colors">
                <img src={item.imageUrl} alt={item.condition} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-text-primary">{item.condition}</p>
                  <p className="text-xs text-text-secondary">{item.timestamp.toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{item.confidence.toFixed(0)}%</span>
                <button 
                  onClick={() => handleAttemptDelete(item.id)} 
                  className="p-2 rounded-full hover:bg-red-500/20 text-red-500 transition-colors"
                  aria-label={`Delete scan for ${item.condition}`}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
  
        {history.length > 0 && history.length < totalHistoryCount && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setDisplayLimit(prev => prev + 3)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t('show_more')} ({history.length}/{totalHistoryCount})
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('delete_confirmation_title', 'Delete Scan')}
        message={t('delete_confirmation_message', 'Are you sure you want to permanently delete this scan result? This action cannot be undone.')}
      />
    </>
  );
};

export default ScanHistory;