// src/features/main/HeroSection.tsx

import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';
import { performScan, type Prediction } from '../../services/predictionService';
import { PredictionModal } from '../scanner/PredictionModal'; // Assuming this is your modal

const HeroSection: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionResults, setPredictionResults] = useState<Prediction[]>([]);
  const [scannedImage, setScannedImage] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const toastId = toast.loading(t('analyzing')); // Use translated text
      setScannedImage(file);
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
        {/* Use the t() function for all user-facing text */}
        <h2 className="text-3xl font-bold mb-4">{t('hero_title', 'AI-Powered Skin Analysis')}</h2>
        <p className="text-lg text-gemini-text-secondary-dark mb-6">
          {t('hero_subtitle', 'Get instant insights into your skin concerns. Just upload a photo.')}
        </p>

        <button
          onClick={triggerFileSelect}
          disabled={isScanning}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-gemini-blue rounded-full font-semibold hover:bg-blue-600 disabled:bg-gray-500 transition-colors"
        >
          <FiCamera />
          <span>{isScanning ? t('analyzing', 'Analyzing...') : t('scan_now', 'Scan Now')}</span>
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