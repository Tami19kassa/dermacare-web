import React from 'react';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

// Define the structure of a prediction result
interface Prediction {
    condition: string;
    confidence: number;
}

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  scannedImage: string; // URL of the image that was scanned
}

const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, prediction, scannedImage }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      {/* Modal Panel */}
      <div 
        className="bg-gemini-surface-light dark:bg-gemini-surface-dark w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700">
            <FiX />
        </button>

        <h2 className="text-2xl font-medium mb-4 text-center">{t('analysis_complete')}</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <img src={scannedImage} alt="Scanned skin concern" className="w-40 h-40 object-cover rounded-xl"/>
            <div className="flex-1 text-center md:text-left">
                <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('top_prediction')}</p>
                <p className="text-3xl font-semibold text-gemini-blue my-1">{prediction?.condition || t('unknown')}</p>
                <p className="font-mono text-lg">{((prediction?.confidence || 0) * 100).toFixed(1)}% {t('confidence')}</p>
            </div>
        </div>

        <div className="mt-6 p-4 bg-amber-100/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
            <p><strong>{t('disclaimer_title')}:</strong> {t('disclaimer')}</p>
        </div>

        <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90">
                {t('got_it')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;