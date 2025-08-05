import { type TFunction } from 'i18next'; // <-- THE FIX IS HERE
 
const topics = [
    { id: 'sun-protection', titleKey: 'sun_protection_title' },
    { id: 'hydration-hacks', titleKey: 'hydration_hacks_title' },
    { id: 'acne-solutions', titleKey: 'acne_solutions_title' },
    { id: 'reading-skincare-labels', titleKey: 'reading_labels_title' },
];

 
export const getTopicTitle = (topicId: string, t: TFunction): string => {
    const topic = topics.find(t => t.id === topicId);
     
    return topic ? t(topic.titleKey) : 'Article';
};