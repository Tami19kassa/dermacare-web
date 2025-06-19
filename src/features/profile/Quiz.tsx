import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAward } from 'react-icons/fi';
import QuizModal from './QuizModal'; // <-- IMPORT THE MODAL

const Quiz: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <h3 className="text-lg font-medium text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-4">{t('skincare_quiz')}</h3>
        <div className="text-center bg-gemini-bg-light dark:bg-gemini-bg-dark p-6 rounded-2xl">
          <FiAward className="mx-auto text-4xl text-amber-500 mb-3" />
          <p className="text-sm mb-4">{t('start_quiz_desc')}</p>
          <button 
            onClick={() => setIsModalOpen(true)} // <-- OPEN THE MODAL
            className="px-4 py-2 text-sm font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 transition-opacity"
          >
            {t('start_quiz')}
          </button>
        </div>
      </div>

      {/* RENDER THE MODAL */}
      <QuizModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Quiz;