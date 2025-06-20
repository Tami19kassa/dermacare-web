// src/components/MainContent/InitialView.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import HeroSection from './HeroSection';
import Carousel from './Carousel';
import InfoHub from '../info/InfoHub';
import Contact from '../info/Contact';
import Feedback from '../info/Feedback';
import Footer from '../info/Footer';

const InitialView: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      <header className="py-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 mb-4">
          {t('hello_user', { name: user?.displayName || t('guest') })}
        </h1>
        <p className="text-lg text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
          {t('main_greeting')}
        </p>
      </header>
      
      <HeroSection />
      <Carousel />
      <InfoHub />
      <Contact />
      <Feedback />
      <Footer />
      
      
    </div>
  );
};

export default InitialView;