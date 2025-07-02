// src/features/scanner/ScanHistory.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onSnapshot, collection, query, where, orderBy, limit, getCountFromServer } from 'firebase/firestore';
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
  
  // State for "Show More"
  const [displayLimit, setDisplayLimit] = useState(3);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);

  // State for custom confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scanIdToDelete, setScanIdToDelete] = useState<string | null>(null);

  // Effect to get the total number of scans for the current user
  useEffect(() => {
    if (user) {
      const getCount = async () => {
        const historyCollectionRef = collection(db, 'scanHistory');
        const q = query(historyCollectionRef, where('userId', '==', user.uid));
        const snapshot = await getCountFromServer(q);
        setTotalHistoryCount(snapshot.data().count);
      };
      getCount();
    }
  }, [user]);

  // Effect to fetch the limited list of scans for display
  useEffect(() => {
    if (user) {
      setLoading(true);
      const historyCollectionRef = collection(db, 'scanHistory');
      const q = query(
        historyCollectionRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(displayLimit)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userHistory = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        } as ScanHistoryItem));
        setHistory(userHistory);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user, displayLimit]);

  const handleAttemptDelete = (scanId: string) => {
    setScanIdToDelete(scanId);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!scanIdToDelete || !user) return;
    try {
      await deleteScanResult(scanIdToDelete);
      toast.success(t('scan_deleted'));
    } catch (error) {
      toast.error(t('failed_to_delete_scan'));
    } finally {
      setIsConfirmOpen(false);
      setScanIdToDelete(null);
    }
  };

  if (loading && history.length === 0) return <Spinner />;

  return (
    <>
      <div className="flex flex-col">
        <div className="space-y-3">
          {history.length === 0 && !loading ? (
            <p className="text-center text-sm text-gemini-text-secondary-dark py-8">{t('no_scan_history')}</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5">
                <img src={item.imageUrl} alt={item.condition} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.condition}</p>
                  <p className="text-xs text-gemini-text-secondary-dark">{item.timestamp.toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold">{item.confidence.toFixed(0)}%</span>
                <button onClick={() => handleAttemptDelete(item.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-500">
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {history.length < totalHistoryCount && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setDisplayLimit(prev => prev + 3)}
              className="text-sm font-semibold text-gemini-blue hover:underline"
            >
              {t('show_more')}
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