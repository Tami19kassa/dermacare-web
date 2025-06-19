import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { performScan } from '../../services/predictionService';
import { FiCamera } from 'react-icons/fi';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await performScan(file);
        }
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className="text-center">
            {/* Hidden file input, just like before */}
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
                    <span>{t('scan_with_camera')}</span>
                </button>
            </div>
        </section>
    );
};

export default HeroSection;