import { type TFunction } from 'i18next'; // <-- THE FIX IS HERE

// This is the single source of truth for our topics.
// It matches the data in InfoHub.tsx.
const topics = [
    { id: 'sun-protection', titleKey: 'sun_protection_title' },
    { id: 'hydration-hacks', titleKey: 'hydration_hacks_title' },
    { id: 'acne-solutions', titleKey: 'acne_solutions_title' },
    { id: 'reading-skincare-labels', titleKey: 'reading_labels_title' },
];

/**
 * A helper function to get the translated display title for a given topic ID.
 * @param topicId - The unique ID of the topic (e.g., 'sun-protection').
 * @param t - The translation function from the `useTranslation` hook.
 * @returns The translated string for the topic's title.
 */
export const getTopicTitle = (topicId: string, t: TFunction): string => {
    const topic = topics.find(t => t.id === topicId);
    // Use the translation function `t` to get the string from the corresponding titleKey.
    // Provide a fallback title if the topic isn't found.
    return topic ? t(topic.titleKey) : 'Article';
};