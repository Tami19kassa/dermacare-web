import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';

const Settings: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="w-full mt-6">
            <h3 className="text-lg font-medium text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-4">
                {t('settings')}
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">{t('theme')}</label>
                    <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-neutral-700 rounded-full">
                        <button onClick={() => theme !== 'light' && toggleTheme()} className={`w-full flex justify-center items-center space-x-2 text-sm py-1.5 rounded-full ${theme === 'light' ? 'bg-white dark:bg-neutral-800 shadow' : ''}`}>
                            <FiSun/> <span>{t('light')}</span>
                        </button>
                        <button onClick={() => theme !== 'dark' && toggleTheme()} className={`w-full flex justify-center items-center space-x-2 text-sm py-1.5 rounded-full ${theme === 'dark' ? 'bg-white dark:bg-neutral-800 shadow' : ''}`}>
                            <FiMoon/> <span>{t('dark')}</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="language" className="block text-sm font-medium mb-2">{t('language')}</label>
                    <select
                        id="language"
                        value={i18n.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="w-full p-2 bg-gray-200 dark:bg-neutral-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
                    >
                        <option value="en">English</option>
                        <option value="am">አማርኛ</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;