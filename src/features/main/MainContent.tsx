// src/components/MainContent/MainContent.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { getGeminiChatResponse } from '../../services/geminiService';
import { performScan } from '../../services/predictionService';
import PredictionModal from '../scanner/PredictionModal';
import InitialView from './InitialView';
import ChatView from './ChatView';
import ChatInput from './ChatInput';

export interface Message { text: string; sender: 'user' | 'bot'; }
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
    const [typingText, setTypingText] = useState('');
    
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
            setTypingText(typingChunks.slice(0, currentChunkIndex).join(' '));
            
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
            setTypingText('');
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
        setTypingText('');
    };

    return (
        <>
            <div className="flex flex-col h-full min-h-0 w-full">
                {/* Scrollable container with safe area padding */}
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto min-h-0"
                    style={{ 
                      paddingBottom: 'max(40px, env(safe-area-inset-bottom))' 
                    }}
                >
                    <div className="max-w-4xl mx-auto p-4 ">
                        {messages.length === 0 ? (
                            <InitialView />
                        ) : (
                            <ChatView 
                                messages={messages}
                                resetChat={resetChat}
                                isTyping={isTyping}
                                typingText={typingText}
                                typingIndex={currentChunkIndex}
                                isLoading={isLoading}
                            />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <ChatInput 
                    input={input}
                    setInput={setInput}
                    isLoading={isLoading}
                    handleFormSubmit={handleFormSubmit}
                    triggerFileSelect={triggerFileSelect}
                    fileInputRef={fileInputRef}
                    handleImageChange={handleImageChange}

                />
                <div className="lg:mb-10 md:mb-10"></div>
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