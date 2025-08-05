import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiSave, FiLoader, FiAlertTriangle } from 'react-icons/fi';  
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

  // Logic is unchanged
  if (!imageFile || !predictions || predictions.length === 0) return null;
  const topPrediction = predictions[0];
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
     
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        
        className="bg-surface rounded-2xl p-6 w-full max-w-md flex flex-col space-y-4 animate-fadeIn shadow-2xl border border-black/10 dark:border-white/10" 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-text-primary">
          {t('analysis_complete')}
        </h2>
        
        <img 
          src={URL.createObjectURL(imageFile)} 
          alt="Scanned item" 
          className="rounded-lg object-cover w-full h-48"
        />
       
        {isSeriousCondition && (
          <div className="border-l-4 border-red-500 bg-red-500/10 p-4 rounded-r-lg text-left">
            <div className="flex items-center">
              <FiAlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={20} />
              <h3 className="font-bold text-red-600 dark:text-red-400 text-base">Potential Serious Condition Detected</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2 pl-8">
              <strong>This is not a diagnosis.</strong> Please consult a qualified dermatologist immediately.
            </p>
          </div>
        )}
        {isHealthy && (
          <div className="border-l-4 border-green-500 bg-green-500/10 p-3 rounded-r-lg text-left">
            <p className="text-sm text-green-700 dark:text-green-400">
              No specific skin condition was detected. Continue with your regular skincare routine.
            </p>
          </div>
        )}
 
        <div className="space-y-3 pt-2">
          <p className="font-semibold text-sm text-text-secondary">{t('top_predictions')}:</p>
          {predictions.map((p, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg flex items-center justify-between text-text-primary ${index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-background'}`}
            >
              <span className="font-medium text-base">{p.condition}</span>
              <span className={`font-bold text-base ${index === 0 ? 'text-primary' : 'text-text-secondary'}`}>
                {(p.confidence * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        
      
        <div className="text-xs text-center text-amber-700 dark:text-amber-400 bg-amber-500/10 p-3 rounded-lg">
          <strong>{t('disclaimer_title')}:</strong> {t('disclaimer')}
        </div>
        
       
        <div className="flex items-center space-x-4 pt-2">
          <button 
            onClick={onClose} 
            disabled={isSaving} 
            className="flex-1 py-2.5 rounded-full bg-background hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 font-semibold text-text-secondary transition-colors"
          >
            {t('discard')}
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || isHealthy} 
            className="flex-1 py-2.5 rounded-full bg-primary hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSaving ? <FiLoader className="animate-spin"/> : <FiSave />}
            <span>{isSaving ? t('saving') : t('save_to_history')}</span>
          </button>
        </div>
      </div>
    </div>
    
  );
};