// src/features/main/HeroSection.tsx

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import { performScan, type Prediction } from '../../services/predictionService';
import { PredictionModal } from '../scanner/PredictionModal';
import { useModelStatus } from '../../hooks/useModelStatus'; // <-- IMPORT THE NEW HOOK

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- USE THE HOOK TO GET THE MODEL'S STATUS ---
  const isModelReady = useModelStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionResults, setPredictionResults] = useState<Prediction[]>([]);
  const [scannedImage, setScannedImage] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const toastId = toast.loading(t('analyzing'));
      setScannedImage(file);
      
      // We no longer need to check if model is initialized here, the button being enabled is the check.
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
    setScannedImage(null);
  };

  return (
    <>
      <div className="text-center p-8 bg-gemini-surface-dark rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">{t('hero_title', 'AI-Powered Skin Analysis')}</h2>
        <p className="text-lg text-gemini-text-secondary-dark mb-6">
          {t('hero_subtitle', 'Get instant insights into your skin concerns. Just upload a photo.')}
        </p>

        <button
          onClick={triggerFileSelect}
          // --- UPDATE THE DISABLED LOGIC ---
          disabled={isScanning || !isModelReady} 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-gemini-blue rounded-full font-semibold hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-wait transition-colors"
        >
          <FiCamera />
          {/* --- UPDATE THE BUTTON TEXT --- */}
          <span>
            {isScanning 
              ? t('analyzing', 'Analyzing...') 
              : !isModelReady 
                ? 'Initializing AI...' 
                : t('scan_now', 'Scan Now')}
          </span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
        />
      </div>

      {isModalOpen && (
        <PredictionModal
          imageFile={scannedImage}
          predictions={predictionResults}
          onClose={handleCloseModal}
        />
      )}
    </>   
  );
};

export default HeroSection;