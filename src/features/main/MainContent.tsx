// src/features/main/MainContent.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { getGeminiChatResponse } from '../../services/geminiService';
import toast from 'react-hot-toast';

// Import our NEW services and modal
import { performScan, Prediction } from '../../services/predictionService';
import { AnalysisResultModal } from '../scanner/AnalysisResultModal'; // New Modal

import InitialView from './InitialView';
import ChatView from './ChatView';
import ChatInput from './ChatInput';

export interface Message { text: string; sender: 'user' | 'bot'; }
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

const MainContent: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    // States for Chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // States for Scanning Logic
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictionResults, setPredictionResults] = useState<Prediction[]>([]);
    const [scannedImageFile, setScannedImageFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const sendMessage = async (messageText: string) => {
        // ... (your existing sendMessage logic - no changes needed)
        if (!messageText.trim() || isLoading) return;
        const userMessage: Message = { text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const botResponseText = await getGeminiChatResponse(chatHistory, messageText);
            const botMessage: Message = { text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPredictionResults([]);
        setScannedImageFile(null);
    };

    return (
        <>
            <div className="flex flex-col h-full min-h-0 w-full">
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto min-h-0">
                    <div className="max-w-4xl mx-auto p-4 ">
                        {messages.length === 0 ? <InitialView /> : <ChatView messages={messages} isLoading={isLoading} />}
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
                <div className="lg:mb-20"></div>
            </div>

            {/* Use the NEW AnalysisResultModal */}
            {isModalOpen && (
                <AnalysisResultModal
                    imageFile={scannedImageFile}
                    predictions={predictionResults}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default MainContent;
