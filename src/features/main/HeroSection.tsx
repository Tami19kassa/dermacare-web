import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { performScan, type Prediction } from '../../services/predictionService';
import { FiCamera } from 'react-icons/fi';
import PredictionModal from '../scanner/PredictionModal';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State is now managed here
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
    const [scannedImage, setScannedImage] = useState<File | null>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const result = await performScan(file);
            if (result) {
                // Set the state to show the modal
                setPredictionResult(result);
                setScannedImage(file);
                setIsModalOpen(true);
            }
        }
        // Reset the file input to allow uploading the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <section className="text-center">
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/jpeg, image/png" />
                <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark p-8 rounded-2xl">
                    <h2 className="text-2xl font-medium mb-2">{t('instant_analysis_title')}</h2>
                    <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-6 max-w-lg mx-auto">
                        {t('instant_analysis_desc')}
                    </p>
                    <button onClick={triggerFileSelect} className="inline-flex items-center space-x-2 px-6 py-3 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 transition-opacity">
                        <FiCamera />
                        <span>{t('upload_image')}</span>
                    </button>
                </div>
            </section>

            <PredictionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                prediction={predictionResult}
                scannedImage={scannedImage}
            />
        </>
    );
};

export default HeroSection;