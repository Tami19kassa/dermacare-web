// src/features/scanner/AnalysisResultModal.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiSave, FiLoader } from 'react-icons/fi';
import { Prediction, saveScanToHistory } from '../../services/predictionService';

interface AnalysisResultModalProps {
  imageFile: File | null;
  predictions: Prediction[];
  onClose: () => void;
}

export const AnalysisResultModal: React.FC<AnalysisResultModalProps> = ({
  imageFile,
  predictions,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  if (!imageFile) return null;

  const topPrediction = predictions[0];

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
        setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gemini-surface-dark rounded-2xl p-6 w-full max-w-md flex flex-col space-y-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-medium text-center">{t('analysis_complete')}</h2>
        <img src={URL.createObjectURL(imageFile)} alt="Scanned item" className="rounded-lg object-cover w-full h-48"/>
        
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
          <button onClick={handleSave} disabled={isSaving} className="flex-1 py-2 rounded-lg bg-gemini-blue hover:bg-blue-600 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {isSaving ? <FiLoader className="animate-spin"/> : <FiSave />}
            <span>{isSaving ? t('saving') : t('save_to_history')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
