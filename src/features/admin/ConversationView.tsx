import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToConversation, sendAdminReply, type FeedbackMessage } from '../../services/firestoreService';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ConversationViewProps {
  originalMessage: FeedbackMessage;
  onClose: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ originalMessage, onClose }) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToConversation(originalMessage.id, (newReplies) => {
      setReplies(newReplies);
    });
    return () => unsubscribe();
  }, [originalMessage.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;

    setIsSending(true);
    try {
      await sendAdminReply(originalMessage.id, user.uid, replyText.trim());
      setReplyText('');
    } catch (error) {
      toast.error('Failed to send reply.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4 border-t border-white/10 pt-4 flex flex-col h-[400px]">
      {/* Chat History */}
      <div className="overflow-y-auto flex-1 space-y-3 pr-2">
        {/* Original Message */}
        <div className="p-3 rounded-lg bg-white/5 max-w-md">
          <p className="font-bold text-sm">{originalMessage.userEmail}</p>
          <p className="text-sm">{originalMessage.message}</p>
        </div>
        {/* Replies */}
        {replies.map(reply => (
          <div key={reply.id} className={`flex ${reply.isFromAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-md ${reply.isFromAdmin ? 'bg-gemini-blue text-white' : 'bg-white/5'}`}>
              <p className="text-sm">{reply.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      <form onSubmit={handleSendReply} className="mt-4 relative">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          className="w-full p-3 pl-4 pr-12 bg-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-gemini-blue"
        />
        <button type="submit" disabled={isSending} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gemini-blue text-white rounded-full disabled:opacity-50">
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ConversationView;