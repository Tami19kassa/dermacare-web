import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { getGeminiChatResponse } from '../../services/geminiService';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

const Chatbot: React.FC = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        { text: t('chat_greeting'), sender: 'bot' }
    ]);
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessageText = input;
        setInput('');
        setMessages(prev => [...prev, { text: userMessageText, sender: 'user' }]);
        setIsLoading(true);

        try {
            const botResponseText = await getGeminiChatResponse(chatHistory, userMessageText);
            setMessages(prev => [...prev, { text: botResponseText, sender: 'bot' }]);
            setChatHistory(prev => [
                ...prev,
                { role: 'user', parts: [{ text: userMessageText }] },
                { role: 'model', parts: [{ text: botResponseText }] }
            ]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                         {msg.sender === 'bot' && <img className="w-8 h-8 rounded-full" src="/assets/images/logo.png" alt="Bot Avatar" />}
                        <div className={`p-3 rounded-2xl max-w-xs ${msg.sender === 'user' ? 'bg-gemini-blue text-white rounded-br-none' : 'bg-gray-200 dark:bg-neutral-700 rounded-bl-none'}`}>
                           <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-2.5">
                        <img className="w-8 h-8 rounded-full" src="/assets/images/logo.png" alt="Bot Avatar" />
                        <div className="p-4 rounded-2xl bg-gray-200 dark:bg-neutral-700 flex items-center space-x-2">
                           <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                           <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="mt-4 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chat_placeholder')}
                    className="w-full p-3 pl-4 pr-12 bg-gray-200 dark:bg-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gemini-blue"
                    disabled={isLoading}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gemini-blue text-white rounded-full disabled:opacity-50" disabled={isLoading || !input.trim()}>
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;