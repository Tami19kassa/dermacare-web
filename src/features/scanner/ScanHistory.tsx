// src/features/scanner/ScanHistory.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { deleteScanResult, type ScanHistoryItem } from '../../services/firestoreService';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { Spinner } from '../../components/Spinner';

const ScanHistory: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const historyCollectionRef = collection(db, 'scanHistory');
      const q = query(
        historyCollectionRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
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
        toast.error(t('failed_to_load_scan_history'));
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup on unmount
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user, t]);

  const handleDelete = async (scanId: string) => {
    if (window.confirm(t('confirm_delete_scan'))) {
      try {
        await deleteScanResult(scanId);
        toast.success(t('scan_deleted'));
      } catch (error) {
        toast.error(t('failed_to_delete_scan'));
      }
    }
  };

  if (loading) return <Spinner />;

  if (history.length === 0) {
    return <div className="text-center text-sm text-gemini-text-secondary-dark py-8">{t('no_scan_history')}</div>;
  }

  return (
    <div className="space-y-3">
      {history.map(item => (
        <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5">
          <img src={item.imageUrl} alt={item.condition} className="w-10 h-10 rounded-md object-cover" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.condition}</p>
            <p className="text-xs text-gemini-text-secondary-dark">{item.timestamp.toLocaleDateString()}</p>
          </div>
          <span className="text-sm font-semibold">{item.confidence.toFixed(0)}%</span>
          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full hover:bg-red-500/20 text-red-500">
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScanHistory;
