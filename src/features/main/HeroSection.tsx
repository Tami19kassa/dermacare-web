import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { performScan, type Prediction } from '../../services/predictionService';
import { FiCamera } from 'react-icons/fi';
import PredictionModal from '../scanner/PredictionModal';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- State to control the Prediction Modal ---
    // This state is managed by the HeroSection, which is the parent component.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
    const [scannedImage, setScannedImage] = useState<File | null>(null);

    /**
     * This function is called when the user selects a file from their device.
     */
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 1. Call the performScan service. This will only get the prediction, it will NOT save.
            const result = await performScan(file);

            // 2. If the scan was successful, update our state to show the modal.
            if (result) {
                setPredictionResult(result);
                setScannedImage(file); // Pass the original File object to the modal
                setIsModalOpen(true);
            }
        }
        
        // Reset the file input so the user can upload the same file again if they want
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /**
     * A helper function to programmatically click our hidden file input element.
     */
    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {/* The main UI section with the "Upload Image" button */}
            <section className="text-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/jpeg, image/png"
                />
                <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark p-8 rounded-2xl">
                    <h2 className="text-2xl font-medium mb-2">{t('instant_analysis_title')}</h2>
                    <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-6 max-w-lg mx-auto">
                        {t('instant_analysis_desc')}
                    </p>
                    <button
                        onClick={triggerFileSelect}
                        className="inline-flex items-center space-x-2 px-6 py-3 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 transition-opacity"
                    >
                        <FiCamera />
                        <span>{t('upload_image')}</span>
                    </button>
                </div>
            </section>

            {/*
              Render the modal component here.
              We pass it the state it needs (isOpen, prediction, image) and a function
              to close itself (onClose). The modal now handles all of its own display
              and save logic internally.
            */}
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