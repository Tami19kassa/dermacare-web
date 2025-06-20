// src/components/MainContent/ChatInput.tsx
import React from 'react';
import { FiCamera, FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  handleFormSubmit: (e: React.FormEvent) => void;
  triggerFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  isLoading,
  handleFormSubmit,
  triggerFileSelect,
  fileInputRef,
  handleImageChange
}) => {
  const { t } = useTranslation();

  return (
    <div 
      className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-gemini-bg-light dark:bg-gemini-bg-dark"
      style={{
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleFormSubmit} className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/jpeg, image/png" 
          />
          <button 
            type="button" 
            onClick={triggerFileSelect} 
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-full text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark hover:bg-gray-200 dark:hover:bg-neutral-600" 
            title={t('upload_scan_title')} 
            disabled={isLoading}
          >
            <FiCamera className="text-lg" />
          </button>
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={t('chat_placeholder')} 
            className="w-full py-3 pl-12 pr-12 bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-full focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            disabled={isLoading} 
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gemini-blue text-white rounded-full hover:opacity-90 disabled:opacity-50" 
            title={t('submit_query_title')}
          >
            <FiSend className="text-lg" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;