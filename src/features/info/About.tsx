import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
      // The outer div and title have been removed
      <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
        {t('about_desc')}
      </p>
  );
};

export default About;