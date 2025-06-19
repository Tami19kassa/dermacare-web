import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiCheck, FiX, FiAward, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { getNewQuizQuestions, type QuizQuestion } from '../../services/geminiService';
import { getUserQuizStats, updateUserQuizStats } from '../../services/firestoreService';

type QuizStatus = 'initial' | 'loading' | 'active' | 'feedback' | 'completed' | 'error' | 'no_questions';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [status, setStatus] = useState<QuizStatus>('initial');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Effect to reset the quiz state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => { // Delay reset to allow for a closing animation if you add one
            setStatus('initial');
            setQuestions([]);
        }, 300);
    }
  }, [isOpen]);

  const startQuiz = async () => {
    if (!user) return;
    setStatus('loading');
    setErrorMessage('');

    try {
      const stats = await getUserQuizStats(user.uid);
      const fetchedQuestions = await getNewQuizQuestions(
        i18n.language === 'am' ? 'Amharic' : 'English',
        stats.answeredIds
      );

      if (fetchedQuestions === null) {
        throw new Error(t('quiz_fetch_error'));
      }
      
      if (fetchedQuestions.length === 0) {
        setStatus('no_questions');
      } else {
        setQuestions(fetchedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setStatus('active');
      }
    } catch (error: any) {
        console.error("Error starting quiz:", error);
        setErrorMessage(error.message || t('quiz_fetch_error'));
        setStatus('error');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (status === 'active') {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === questions[currentIndex].correct_answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
    setStatus('feedback');
  };
  
  const handleNextQuestion = async () => {
    const isLastQuestion = currentIndex === questions.length - 1;

    if (isLastQuestion) {
        setIsSaving(true);
        if (user && score > 0) {
            try {
                const answeredIds = questions.map(q => q.id.toString());
                await updateUserQuizStats(user.uid, score, answeredIds);
            } catch (error) {
                console.error("Failed to save quiz stats:", error);
                // Optionally show a toast error to the user
            }
        }
        setIsSaving(false);
        setStatus('completed');
    } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setStatus('active');
    }
  };

  const resetQuiz = () => {
    setStatus('initial');
    setQuestions([]);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl mx-auto text-gemini-blue" /></div>;
      
      case 'error':
          return (
            <div className="text-center p-10">
                <FiAlertTriangle size={48} className="mx-auto text-red-500 mb-4"/>
                <h3 className="text-xl font-medium mb-2">{t('error_title')}</h3>
                <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{errorMessage}</p>
                <button onClick={startQuiz} className="mt-6 px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full">{t('try_again')}</button>
            </div>
          );

      case 'no_questions':
          return (
            <div className="text-center p-10">
                <FiAward size={48} className="mx-auto text-amber-500 mb-4"/>
                <h3 className="text-xl font-medium mb-2">{t('quiz_all_done_title')}</h3>
                <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('quiz_all_done_desc')}</p>
                <button onClick={onClose} className="mt-6 px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full">{t('close')}</button>
            </div>
          );

      case 'active':
      case 'feedback':
        const question = questions[currentIndex];
        if (!question) return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl mx-auto text-gemini-blue" /></div>;
        
        return (
            <div>
                <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('question')} {currentIndex + 1} / {questions.length}</p>
                <h3 className="text-lg font-medium my-4">{question.question}</h3>
                <div className="space-y-3">
                    {question.options.map(option => {
                        let buttonClass = "w-full text-left p-3 rounded-lg border-2 transition-colors ";
                        const isSelected = selectedAnswer === option;
                        const isTheCorrectAnswer = option === question.correct_answer;

                        if (status === 'feedback') {
                            if (isTheCorrectAnswer) {
                                buttonClass += "bg-green-100 dark:bg-green-900/50 border-green-500";
                            } else if (isSelected && !isCorrect) {
                                buttonClass += "bg-red-100 dark:bg-red-900/50 border-red-500";
                            } else {
                                buttonClass += "border-transparent bg-gemini-bg-light dark:bg-gemini-bg-dark opacity-60";
                            }
                        } else {
                            buttonClass += isSelected ? "border-gemini-blue bg-blue-500/10" : "border-transparent bg-gemini-bg-light dark:bg-gemini-bg-dark hover:bg-gray-200 dark:hover:bg-neutral-700";
                        }
                        
                        return (
                            <button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={status === 'feedback'}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                <div className="mt-6 text-right">
                    {status === 'active' ? (
                        <button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full disabled:opacity-50">{t('submit')}</button>
                    ) : (
                        <button onClick={handleNextQuestion} className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full">
                            {currentIndex === questions.length - 1 ? t('finish_quiz') : t('next_question')}
                        </button>
                    )}
                </div>
            </div>
        )
      
      case 'completed':
        return (
            <div className="text-center p-10">
                <FiAward size={48} className="mx-auto text-amber-500 mb-4"/>
                <h3 className="text-xl font-medium mb-2">{t('quiz_complete_title')}</h3>
                <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('you_scored')} {score} / {questions.length}</p>
                {isSaving ? (
                    <div className="flex justify-center my-4"><FiLoader className="animate-spin" /></div>
                ) : (
                    <div className="flex space-x-4 justify-center mt-6">
                        <button onClick={resetQuiz} className="px-5 py-2.5 font-semibold bg-gray-200 dark:bg-neutral-700 text-gemini-text-light dark:text-gemini-text-dark rounded-full">{t('play_again')}</button>
                        <button onClick={onClose} className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full">{t('close')}</button>
                    </div>
                )}
            </div>
        );

      default: // 'initial' state
        return (
            <div className="text-center p-10">
                <FiAward size={48} className="mx-auto text-gemini-blue mb-4"/>
                <h3 className="text-xl font-medium mb-2">{t('skincare_quiz')}</h3>
                <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('start_quiz_desc')}</p>
                <button onClick={startQuiz} className="mt-6 px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full">{t('start_quiz')}</button>
            </div>
        );
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default QuizModal;