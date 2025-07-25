import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';
import type { Message } from './MainContent'; // Add type-only import

interface ChatViewProps {
  messages: Message[];
  resetChat: () => void;
  isTyping: boolean;
  typingText: string;
  typingIndex: number;
  isLoading: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  resetChat,
  isTyping,
  typingText,
  typingIndex,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Back button at the top */}
      <div className="flex items-center mb-4">
        <button 
          onClick={resetChat}
          className="flex items-center text-gemini-blue hover:text-gemini-blue-dark transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          {t('back_to_home')}
        </button>
      </div>
      
      {/* Chat messages */}
      {messages.map((msg, index) => (
        <ChatBubble 
          key={index}
          msg={msg}
          isTyping={isTyping}
          typingText={typingText}
          isLastMessage={index === messages.length - 1}
          typingIndex={typingIndex}
          index={index}
        />
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-3.5">
          <img className="w-8 h-8 rounded-full" src="/assets/images/logo.png" alt="Bot Avatar" />
          <div className="p-4 rounded-2xl bg-gemini-surface-light dark:bg-gemini-surface-dark flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;