import React from 'react';
import type { Message } from './MainContent';

interface ChatBubbleProps {
  msg: Message;
  isLastMessage: boolean;
  isTyping: boolean;
  typingText: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ msg, isLastMessage, isTyping, typingText }) => {
  const isUser = msg.sender === 'user';
  const textToShow = isLastMessage && isTyping ? typingText : msg.text;

  // --- STYLE DEFINITIONS ---

  // Base classes for all chat bubbles
  const bubbleBaseClasses = "p-4 rounded-2xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words";
  
  // **CRITICAL FIX**: Explicitly define text color for high contrast in both modes.
  // This class will be applied directly to the text container.
  const textColorClasses = "text-gray-900 dark:text-gray-100";
  
  // Classes for the user's message bubble (right-aligned)
  const userBubbleContainerClasses = "flex justify-end";
  const userBubbleBgClasses = "bg-blue-100 dark:bg-blue-900/50";

  // Classes for the bot's message bubble (left-aligned)
  const botBubbleContainerClasses = "flex items-start gap-3.5";
  const botBubbleBgClasses = "bg-gray-200 dark:bg-gray-700";

  // --- RENDER LOGIC ---

  if (isUser) {
    return (
      <div className={userBubbleContainerClasses}>
        <div className={`${bubbleBaseClasses} ${userBubbleBgClasses} ${textColorClasses}`}>
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <div className={botBubbleContainerClasses}>
      <img className="w-8 h-8 rounded-full" src="/assets/images/logo.png" alt="Bot Avatar" />
      <div className={`${bubbleBaseClasses} ${botBubbleBgClasses} ${textColorClasses}`}>
        {textToShow}
        {isLastMessage && isTyping && (
           <span className="inline-block w-2 h-5 ml-1 bg-gray-600 dark:bg-gray-300 animate-pulse" aria-hidden="true"></span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;