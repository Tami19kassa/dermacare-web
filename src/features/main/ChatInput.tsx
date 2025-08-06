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
        // FIX 1: The main container now matches the page's dark background.
        // I've removed `bg-white` and am using specific dark mode colors.
        // The top border adds a subtle separation from the chat content above.
        <div className="px-4 pb-4 pt-3 bg-gray-50 dark:bg-[#131314] border-t border-gray-200 dark:border-gray-700/50">
            
            {/* FIX 2: The form is the visible input bar. It has a slightly lighter dark color to stand out. */}
            <form
                onSubmit={handleFormSubmit}
                className="max-w-4xl mx-auto flex items-center p-1 rounded-full bg-gray-200 dark:bg-[#1E1F22] shadow-sm"
            >
                {/* FIX 3: Camera icon color is adjusted for better contrast and a modern feel. */}
                <button
                    type="button"
                    onClick={triggerFileSelect}
                    disabled={isLoading}
                    className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 transition-colors"
                    aria-label="Upload an image"
                >
                    <FiCamera size={20} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />

                {/* The input field itself uses transparent background to show the form's color. */}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('Dermacare AI ይጠይቁ...')}
                    disabled={isLoading}
                    className="flex-1 w-full bg-transparent px-3 py-2 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                />

                {/* FIX 4: The send button style is updated to be solid and clear, matching user expectation. */}
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <FiSend size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;