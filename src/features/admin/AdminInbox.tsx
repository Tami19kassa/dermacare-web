import React, { useState, useEffect } from 'react';
import { subscribeToAllFeedback, updateFeedbackStatus, type FeedbackMessage } from '../../services/firestoreService';
import { FiInbox, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ConversationView from './ConversationView'; // <-- IMPORT

const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<FeedbackMessage | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAllFeedback((newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    // If this message is currently open, close it first
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    try {
      await updateFeedbackStatus(id, 'read');
      toast.success('Message marked as read.');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleSelectMessage = (message: FeedbackMessage) => {
    // Toggle conversation view
    setSelectedMessage(prev => (prev?.id === message.id ? null : message));
  };
  
  return (
    <div className="bg-gemini-surface-dark rounded-2xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">Admin Inbox</h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gemini-text-secondary-dark">
          <FiInbox size={48} className="mb-4" />
          <p className="font-medium">All caught up!</p>
          <p className="text-sm">There are no new messages from users.</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{msg.userEmail}  </p>
                  <p className="text-xs text-gemini-text-secondary-dark">{msg.timestamp.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleSelectMessage(msg)} className="text-xs px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 flex items-center gap-2">
                    <FiMessageSquare size={14}/> Reply
                  </button>
                  <button onClick={() => handleMarkAsRead(msg.id)} className="text-xs px-3 py-1 bg-gemini-blue rounded-full hover:opacity-80">
                    Mark as Read
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm">{msg.message}</p>
              
              {/* Conditionally render the conversation view */}
              {selectedMessage?.id === msg.id && (
                <ConversationView originalMessage={selectedMessage} onClose={() => setSelectedMessage(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInbox;