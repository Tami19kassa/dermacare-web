import React, { useState, useEffect } from 'react';
import { subscribeToAllFeedback, updateFeedbackStatus, type FeedbackMessage } from '../../services/firestoreService';
import { FiInbox } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/Spinner';

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToAllFeedback((newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });
 
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateFeedbackStatus(id, 'read');
      toast.success('Message archived.');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };
  
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/5 h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4 text-text-primary">Admin Inbox</h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center"><Spinner /> <span className="ml-2">Loading messages...</span></div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary">
          <FiInbox size={48} className="mb-4" />
          <p className="font-medium">All caught up!</p>
          <p className="text-sm">There are no new messages from users.</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-background/50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-text-primary">{msg.userEmail} ({msg.fullName})</p>
                  <p className="text-xs text-text-secondary">{msg.timestamp?.toLocaleString()}</p>
                </div>
                
                <button 
                  onClick={() => handleMarkAsRead(msg.id)} 
                  className="text-xs px-3 py-1 bg-primary text-white rounded-full hover:opacity-80"
                >
                  Mark as Read
                </button>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInbox;
 