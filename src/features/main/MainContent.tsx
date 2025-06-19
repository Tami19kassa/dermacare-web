// MainContent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiSend, FiArrowLeft } from 'react-icons/fi';
import { getGeminiChatResponse } from '../../services/geminiService';
import { performScan } from '../../services/predictionService';
import ReactMarkdown from 'react-markdown';
import PredictionModal from '../scanner/PredictionModal';
import HeroSection from './HeroSection';
import Carousel from './Carousel';
import InfoHub from '../info/InfoHub';
import Contact from '../info/Contact';
import Feedback from '../info/Feedback';

interface Message { text: string; sender: 'user' | 'bot'; }
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];
interface Prediction { condition: string; confidence: number; }

const MainContent: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
    const [scannedImageUrl, setScannedImageUrl] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingChunks, setTypingChunks] = useState<string[]>([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Set initial scroll position to top
    useEffect(() => {
        if (messagesContainerRef.current && messages.length === 0) {
            messagesContainerRef.current.scrollTop = 0;
        }
    }, [messages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesContainerRef.current && messages.length > 0) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping, currentChunkIndex]);

    // Enhanced typing effect with chunk-based writing
    useEffect(() => {
        if (typingChunks.length > 0 && currentChunkIndex < typingChunks.length) {
            setIsTyping(true);
            
            const typingSpeed = Math.random() * 30 + 30; // 30-60ms
            
            const timer = setTimeout(() => {
                setCurrentChunkIndex(prev => prev + 1);
            }, typingSpeed);
            
            return () => clearTimeout(timer);
        } else if (typingChunks.length > 0) {
            // Typing complete
            setIsTyping(false);
            setTypingChunks([]);
            setCurrentChunkIndex(0);
        }
    }, [typingChunks, currentChunkIndex]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        
        const userMessage: Message = { 
            text: messageText, 
            sender: 'user'
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponseText = await getGeminiChatResponse(chatHistory, messageText);
            const botMessage: Message = { 
                text: botResponseText, 
                sender: 'bot' 
            };
            
            // Add bot message to history
            setMessages(prev => [...prev, botMessage]);
            
            // Start enhanced typing effect
            const chunks = chunkText(botResponseText);
            setTypingChunks(chunks);
            setCurrentChunkIndex(0);
            
            // Update chat history
            setChatHistory(prev => [
                ...prev,
                { role: 'user', parts: [{ text: messageText }] },
                { role: 'model', parts: [{ text: botResponseText }] }
            ]);
        } catch (error) {
            const errorMessage: Message = {
                text: "Sorry, I'm having trouble connecting.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Split text into chunks for more natural typing effect
    const chunkText = (text: string): string[] => {
        const chunks = [];
        const words = text.split(' ');
        let currentChunk = '';
        
        for (let i = 0; i < words.length; i++) {
            // Group 2-5 words together randomly
            const groupSize = Math.floor(Math.random() * 3) + 2;
            if (i % groupSize === 0 && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            currentChunk += words[i] + ' ';
        }
        
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    };
    
    // Get current displayed text for bot message
    const getTypingText = (fullText: string, index: number): string => {
        if (index === 0) return '';
        return typingChunks.slice(0, index).join(' ');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const result = await performScan(file);
            if (result) {
                setPredictionResult(result);
                setScannedImageUrl(URL.createObjectURL(file)); 
                setIsModalOpen(true);
            }
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // Reset chat and go back to initial view
    const resetChat = () => {
        setMessages([]);
        setChatHistory([]);
        setTypingChunks([]);
        setIsTyping(false);
    };

    return (
        <>
            <div className="flex flex-col h-full min-h-0 w-full">
                {/* Scrollable container */}
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto min-h-0"
                >
                    <div className="max-w-4xl mx-auto p-4">
                        {messages.length === 0 ? (
                            <div className="space-y-12">
                                <header className="py-8 text-center md:text-left">
                                    <h1 className="text-4xl md:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 mb-4">
                                        {t('hello_user', { name: user?.displayName || t('guest') })}
                                    </h1>
                                    <p className="text-lg text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
                                        {t('main_greeting')}
                                    </p>
                                </header>
                                
                                <HeroSection />
                                <Carousel />
                                <InfoHub />
                                <Contact />
                                <Feedback />
                                
                                <footer className="text-center py-6">
                                    <p className="text-xs text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
                                        {t('disclaimer')}
                                    </p>
                                </footer>
                            </div>
                        ) : (
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
                                
                                {/* Chat messages with proper width */}
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
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
                                            {msg.sender === 'bot' && isTyping && index === messages.length - 1 ? (
                                                <>
                                                    <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                                        {getTypingText(msg.text, currentChunkIndex)}
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
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Non-fixed chat input that doesn't cover sidebars */}
                <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-gemini-bg-light dark:bg-gemini-bg-dark">
                    <div className="max-w-2xl mx-auto"> {/* Constrained width */}
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
            </div>

            <PredictionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                prediction={predictionResult}
                scannedImage={scannedImageUrl}
            />
        </>
    );
};

export default MainContent;