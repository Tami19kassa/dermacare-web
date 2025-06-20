import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from './MainContent'; // Add type-only import

interface ChatBubbleProps {
  msg: Message;
  isTyping: boolean;
  typingText: string;
  isLastMessage: boolean;
  typingIndex: number;
  index: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  msg,
  isTyping,
  typingText,
  isLastMessage,
  typingIndex,
  index
}) => {
  return (
    <div 
      className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}
    >
      {msg.sender === 'bot' && (
        <img 
          className="w-8 h-8 rounded-full" 
          src="/assets/images/logo.png" 
          alt="Bot Avatar" 
        />
      )}
      <div className={`p-3 rounded-2xl ${msg.sender === 'user' 
        ? 'bg-gemini-blue text-white rounded-br-none max-w-[80%]' 
        : 'bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-bl-none max-w-[80%]'}`}
      >
        {msg.sender === 'bot' && isTyping && isLastMessage && typingIndex === index ? (
          <>
            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
              {typingText}
            </ReactMarkdown>
            <span className="ml-1 inline-block w-2 h-4 bg-gray-500 animate-pulse"></span>
          </>
        ) : (
          <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
            {msg.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;