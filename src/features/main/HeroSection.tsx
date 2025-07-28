import React, { useState, useRef } from 'react';
// --- REMOVE THIS IMPORT --- It's no longer needed here
// import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiCamera, FiLoader } from 'react-icons/fi';
import { performScan, type Prediction } from '../../services/predictionService';
import { PredictionModal } from '../scanner/PredictionModal';
import { useModelStatus } from '../../hooks/useModelStatus';
import { type TFunction } from 'i18next'; // <-- IMPORT THE TYPE FOR 't'

// --- START: MODIFIED PROPS ---
interface HeroSectionProps {
  t: TFunction; // Add 't' function as a required prop
}

const HeroSection: React.FC<HeroSectionProps> = ({ t }) => { // <-- ACCEPT THE PROP
  // --- END: MODIFIED PROPS ---
  
  // --- REMOVE THIS LINE ---
  // const { t } = useTranslation(); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isModelReady = useModelStatus();

  // ... (the rest of your state and logic remains exactly the same)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictionResults, setPredictionResults] = useState<Prediction[]>([]);
  const [scannedImage, setScannedImage] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const toastId = toast.loading(t('analyzing')); // This will now work
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
      <div className="text-center p-8 bg-surface rounded-2xl shadow-md border border-black/5 dark:border-white/5">
        <h2 className="text-3xl font-extrabold text-text-primary mb-2">
          {t('hero_title')} {/* This will now correctly translate */}
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          {t('hero_subtitle')} {/* This will now correctly translate */}
        </p>

        <button
          onClick={triggerFileSelect}
          disabled={isScanning || !isModelReady}
          className="inline-flex items-center justify-center gap-3 px-8 py-3 text-white bg-gradient-to-r from-primary to-blue-400 rounded-full font-semibold shadow-lg hover:shadow-primary/40 hover:scale-105 disabled:bg-gray-400 disabled:shadow-none disabled:scale-100 disabled:cursor-wait transition-all duration-300 ease-in-out"
        >
          {isScanning || !isModelReady ? (
            <FiLoader className="animate-spin" size={20} />
          ) : (
            <FiCamera size={20} />
          )}

          <span className="text-lg">
            {isScanning 
              ? t('analyzing') 
              : !isModelReady 
                ? t('initializing_ai', 'Initializing AI...') // Add key for this
                : t('scan_now')} {/* This will now correctly translate */}
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