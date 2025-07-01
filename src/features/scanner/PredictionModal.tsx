import React, { useState } from 'react';
import { FiX, FiSave, FiLoader } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { type Prediction } from '../../services/predictionService';
import toast from 'react-hot-toast';
import { auth, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addScanResult } from '../../services/firestoreService';
import { getDiseaseById } from '../../data/diseaseDatabase';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  scannedImage: File | null; // <-- We receive the original File
}

const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, prediction, scannedImage }) => {
  const { t, i18n } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const isAmharic = i18n.language === 'am';

  const diseaseInfo = React.useMemo(() => {
    if (!prediction?.condition) return null;
    const diseaseId = prediction.condition.replace(/\s+/g, '-').toLowerCase();
    return getDiseaseById(diseaseId);
  }, [prediction]);

  // THIS IS THE NEW SAVE LOGIC
  const handleSaveResult = async () => {
      const user = auth.currentUser;
      if (!user || !prediction || !scannedImage) {
          toast.error("Cannot save result. Missing required data.");
          return;
      }
      setIsSaving(true);
      const toastId = toast.loading('Saving result to your history...');
      try {
          // Now we upload to OUR Firebase Storage
          const filePath = `scans/${user.uid}/${Date.now()}_${scannedImage.name}`;
          const storageRef = ref(storage, filePath);
          await uploadBytes(storageRef, scannedImage);
          const imageUrl = await getDownloadURL(storageRef);

          // And save to OUR Firestore
          await addScanResult(user.uid, {
              imageUrl: imageUrl,
              condition: prediction.condition,
              confidence: prediction.confidence * 100,
          });
          toast.success("Result saved to your history!", { id: toastId });
          onClose(); // Close the modal after a successful save
      } catch (error) {
          console.error("Failed to save result:", error);
          toast.error("Could not save result. Please try again.", { id: toastId });
      } finally {
          setIsSaving(false);
      }
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
         <div 
           className="bg-gemini-surface-light dark:bg-gemini-surface-dark w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn"
           onClick={(e) => e.stopPropagation()}
         >
           <h2 className="text-2xl font-medium mb-4 text-center">{t('analysis_complete')}</h2>
           
           <div className="text-center">
               {scannedImage && <img src={URL.createObjectURL(scannedImage)} alt="Scanned skin concern" className="w-40 h-40 object-cover rounded-xl mx-auto"/>}
               <div className="mt-4">
                   <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('top_prediction')}</p>
                   {/* Add a safety check here as well */}
                   <p className="text-3xl font-semibold text-gemini-blue my-1">{prediction?.condition || t('unknown')}</p>
                   <p className="font-mono text-lg">{((prediction?.confidence || 0) * 100).toFixed(1)}% {t('confidence')}</p>
               </div>
           </div>
           
           {diseaseInfo && (
               <div className="mt-4 text-center">
                   <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
                       {isAmharic ? diseaseInfo.description.am : diseaseInfo.description.en}
                   </p>
               </div>
           )}
   
           <div className="mt-6 p-4 bg-amber-100/50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
               <p><strong>{t('disclaimer_title')}:</strong> {t('disclaimer')}</p>
           </div>
   
           <div className="mt-6 flex justify-end space-x-4">
               <button onClick={onClose} className="px-5 py-2.5 font-semibold bg-gray-200 dark:bg-neutral-700 rounded-full hover:opacity-90">
                   {t('discard')}
               </button>
               <button onClick={handleSaveResult} disabled={isSaving || !prediction} className="inline-flex items-center space-x-2 px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 disabled:opacity-50">
                 {isSaving ? <FiLoader className="animate-spin"/> : <FiSave />}
                 <span>{isSaving ? t('saving') : t('save_to_history')}</span>
               </button>
           </div>
         </div>
       </div>
  );
};

export default PredictionModal;