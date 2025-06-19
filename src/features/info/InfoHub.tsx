import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiSun, FiDroplet, FiZap, FiBookOpen } from 'react-icons/fi';
import { useArticleModal } from '../../context/ArticleModalContext';

// This is a reusable component for each card in the hub.
const InfoHubCard: React.FC<{ topic: { id: string; title: string; icon: React.ReactNode; description: string; } }> = ({ topic }) => {
    // We get the function to open the modal from our global context.
    const { openArticleModal } = useArticleModal();

    return (
        // This is now a button that, when clicked, opens the article modal with the correct topic ID.
        <button 
            onClick={() => openArticleModal(topic.id)}
            className="text-left block w-full bg-gemini-surface-light dark:bg-gemini-surface-dark p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
            <div className="flex items-start space-x-4">
                <div className="text-gemini-blue text-2xl mt-1">{topic.icon}</div>
                <div>
                    <h4 className="font-medium text-gemini-text-light dark:text-gemini-text-dark">{topic.title}</h4>
                    <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{topic.description}</p>
                </div>
            </div>
        </button>
    );
};


// This is the main InfoHub component that renders the list of cards.
const InfoHub: React.FC = () => {
    const { t } = useTranslation();

    // This array is the single source of truth for the topics displayed in the Info Hub.
    // The `id` here is crucial as it's passed to the Gemini API.
    const topics = [
        { id: 'sun-protection', title: t('sun_protection_title'), icon: <FiSun />, description: t('sun_protection_desc') },
        { id: 'hydration-hacks', title: t('hydration_hacks_title'), icon: <FiDroplet />, description: t('hydration_hacks_desc') },
        { id: 'acne-solutions', title: t('acne_solutions_title'), icon: <FiZap />, description: t('acne_solutions_desc') },
        { id: 'reading-skincare-labels', title: t('reading_labels_title'), icon: <FiBookOpen />, description: t('reading_labels_desc') },
    ];

    return (
        <section>
            <h2 className="text-2xl font-medium mb-6 px-2">{t('information_hub')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topics.map(topic => <InfoHubCard key={topic.id} topic={topic} />)}
            </div>
        </section>
    );
};

export default InfoHub;