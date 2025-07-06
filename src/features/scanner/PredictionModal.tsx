// src/features/scanner/PredictionModal.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiSave, FiLoader } from 'react-icons/fi';
import { type Prediction, saveScanToHistory } from '../../services/predictionService';

interface PredictionModalProps {
  imageFile: File | null;
  predictions: Prediction[];
  onClose: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  imageFile,
  predictions,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  if (!imageFile || !predictions || predictions.length === 0) return null;

  const topPrediction = predictions[0];

  // Check for special case IDs to show specific UI elements
  const isSeriousCondition = topPrediction?.id === 'malignant_lesion';
  const isHealthy = topPrediction?.id === 'healthy';

  const handleSave = async () => {
    if (!imageFile || !topPrediction) return;
    
    setIsSaving(true);
    const toastId = toast.loading('Saving to history...');
    try {
        await saveScanToHistory(imageFile, topPrediction);
        toast.success('Saved successfully!', { id: toastId });
        onClose();
    } catch (error) {
        toast.error('Failed to save to history.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gemini-surface-dark rounded-2xl p-6 w-full max-w-md flex flex-col space-y-4 animate-fadeIn" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-medium text-center">{t('analysis_complete')}</h2>
        <img src={URL.createObjectURL(imageFile)} alt="Scanned item" className="rounded-lg object-cover w-full h-48"/>
        
        {/* --- CRITICAL WARNING BLOCK --- */}
        {isSeriousCondition && (
          <div className="border-2 border-red-500 bg-red-900/30 p-3 rounded-lg text-center">
            <h3 className="font-bold text-red-400 text-lg">Potential Serious Condition Detected</h3>
            <p className="text-sm text-red-300 mt-1">
              Our analysis suggests a possibility of a malignant lesion. 
              <strong>This is not a diagnosis.</strong> Please consult a qualified dermatologist immediately for a professional evaluation.
            </p>
          </div>
        )}

        {/* --- "HEALTHY" RESULT BLOCK --- */}
        {isHealthy && (
          <div className="border border-green-500 bg-green-900/30 p-3 rounded-lg text-center">
            <p className="text-sm text-green-300">
              No specific skin condition was detected in the analysis. For general skin health, continue with your regular skincare routine.
            </p>
          </div>
        )}

        <div className="predictions-list space-y-2">
          <p className="font-semibold text-sm text-gemini-text-secondary-dark">{t('top_predictions')}:</p>
          {predictions.map((p, index) => (
            <div key={index} className={`p-2 rounded-lg flex items-center justify-between text-white ${index === 0 ? 'bg-gemini-blue/20' : 'bg-white/5'}`}>
              <span className="font-medium">{p.condition}</span>
              <span className={`font-semibold ${index === 0 ? 'text-gemini-blue' : ''}`}>
                {(p.confidence * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-center text-amber-200 bg-amber-900/20 p-2 rounded-lg">
          <strong>{t('disclaimer_title')}:</strong> {t('disclaimer')}
        </div>
        
        <div className="flex items-center space-x-4">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50">
            {t('discard')}
          </button>
          <button onClick={handleSave} disabled={isSaving || isHealthy} className="flex-1 py-2 rounded-lg bg-gemini-blue hover:bg-blue-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? <FiLoader className="animate-spin"/> : <FiSave />}
            <span>{isSaving ? t('saving') : t('save_to_history')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};