import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { getGeminiChatResponse } from '../../services/geminiService';
import toast from 'react-hot-toast';
import { performScan, type Prediction } from '../../services/predictionService';
import { PredictionModal } from '../scanner/PredictionModal';
import InitialView from './InitialView';
import ChatView from './ChatView';
import ChatInput from './ChatInput';

export interface Message { text: string; sender: 'user' | 'bot'; }
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

const MainContent: React.FC<{ className?: string }> = ({ className }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictionResults, setPredictionResults] = useState<Prediction[]>([]);
    const [scannedImageFile, setScannedImageFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingChunks, setTypingChunks] = useState<string[]>([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [typingText, setTypingText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isTyping && currentChunkIndex < typingChunks.length) {
            const timer = setTimeout(() => {
                setTypingText((prev) => prev + typingChunks[currentChunkIndex] + ' ');
                setCurrentChunkIndex((prev) => prev + 1);
            }, 50);
            return () => clearTimeout(timer);
        } else if (isTyping) {
            const finalMessage = typingChunks.join(' ');
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { text: finalMessage, sender: 'bot' };
                return newMessages;
            });
            setIsTyping(false);
        }
    }, [isTyping, typingChunks, currentChunkIndex]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        const userMessage: Message = { text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const botResponseText = await getGeminiChatResponse(chatHistory, messageText);
            setTypingChunks(botResponseText.split(' '));
            setCurrentChunkIndex(0);
            setTypingText('');
            setIsTyping(true);
            setMessages(prev => [...prev, { text: '', sender: 'bot' }]);
            setChatHistory(prev => [
                ...prev,
                { role: 'user', parts: [{ text: messageText }] },
                { role: 'model', parts: [{ text: botResponseText }] }
            ]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsScanning(true);
            const toastId = toast.loading('Analyzing image...');
            setScannedImageFile(file);
            const results = await performScan(file);
            toast.dismiss(toastId);
            setIsScanning(false);
            if (results && results.length > 0) {
                setPredictionResults(results);
                setIsModalOpen(true);
            }
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const resetChat = () => {
        setMessages([]);
        setChatHistory([]);
        setIsTyping(false);
        setTypingChunks([]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPredictionResults([]);
        setScannedImageFile(null);
    };

    return (
        <>
            <div className={`flex flex-col h-full ${className}`}>
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="max-w-4xl mx-auto p-4 pt-4 w-full">
                        {messages.length === 0 ? (
                            <InitialView />
                        ) : (
                            <ChatView 
                                messages={messages}
                                isLoading={isLoading}
                                resetChat={resetChat}
                                isTyping={isTyping}
                                typingText={typingText}
                                typingIndex={currentChunkIndex}
                            />
                        )}
                    </div>
                </div>
                <ChatInput 
                    input={input}
                    setInput={setInput}
                    isLoading={isLoading || isScanning}
                    handleFormSubmit={handleFormSubmit}
                    triggerFileSelect={triggerFileSelect}
                    fileInputRef={fileInputRef}
                    handleImageChange={handleImageChange}
                />
            </div>
            {isModalOpen && (
                <PredictionModal
                    imageFile={scannedImageFile}
                    predictions={predictionResults}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default MainContent;