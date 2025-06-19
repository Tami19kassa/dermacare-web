import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { getScanHistory, type ScanHistoryItem } from '../../services/firestoreService';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../components/Spinner';

const ScanHistory: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          const history = await getScanHistory(user.uid);
          setHistoryItems(history);
          setError(null);
        } catch (err) {
          setError(t('failed_to_load_scan_history'));
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [user, t]);

  if (isLoading) {
    return <Spinner />;
  }
  
  if (error) {
     return (
      <div className="text-center text-sm text-red-500 py-8">
        {error}
      </div>
    );
  }

  if (historyItems.length === 0) {
    return (
      <div className="text-center text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark py-8">
        {t('no_scan_history')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historyItems.map(item => (
        <div key={item.id} className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/50 cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">{item.condition}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.confidence > 90 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {item.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center mt-1 text-xs text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
            <FiClock className="mr-1.5" />
            <span>{item.timestamp.toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScanHistory;