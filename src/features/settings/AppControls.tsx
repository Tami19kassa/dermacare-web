import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';

const AppControls: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        
        <div className="w-full flex items-center space-x-4">
           
            <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-neutral-700 rounded-full">
                <button title={t('light')} onClick={() => theme !== 'light' && toggleTheme()} className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-white dark:bg-neutral-800 shadow' : ''}`}>
                    <FiSun size={16}/>
                </button>
                <button title={t('dark')} onClick={() => theme !== 'dark' && toggleTheme()} className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-white dark:bg-neutral-800 shadow' : ''}`}>
                    <FiMoon size={16}/>
                </button>
            </div>

            {/* Language Selector */}
            <div>
                <select
                    id="language"
                    aria-label={t('language')}
                    value={i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="p-2 bg-gray-200 dark:bg-neutral-700 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue text-sm"
                >
                    <option value="en">English</option>
                    <option value="am">አማርኛ</option>
                </select>
            </div>
        </div>
    );
};

export default AppControls;