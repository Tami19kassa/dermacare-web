import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { getUserQuizStats } from '../../services/firestoreService';
import { FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import QuizModal from './QuizModal';

const Quiz: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        const stats = await getUserQuizStats(user.uid);
        setAnsweredIds(stats.answeredIds);
      };
      fetchStats();
    }
  }, [user, isModalOpen]);

  const handleStartQuiz = () => {
    if (!user) {
      toast.error("Please log in to take the quiz.");
      return;
    }
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t('skincare_quiz')}</h3>
        <div className="text-center bg-background p-6 rounded-2xl">
          <FiAward className="mx-auto text-4xl text-amber-500 mb-3" />
          <p className="text-sm text-text-secondary mb-4">{t('start_quiz_desc')}</p>
          
          <button 
            onClick={handleStartQuiz}
             
            className="px-6 py-2 text-sm font-semibold bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
          >
            {t('start_quiz')}
          </button>
           

        </div>
      </div>

     <QuizModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
         
         
      />
    </>
  );
};

export default Quiz;