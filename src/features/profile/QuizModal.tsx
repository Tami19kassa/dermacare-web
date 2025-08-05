import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAward, FiLoader, FiAlertTriangle, FiPlay, FiX, FiCheckSquare, FiArrowRight, FiRepeat, FiSave } from 'react-icons/fi';
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

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStatus('initial');
        setQuestions([]);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setErrorMessage('');
      }, 300); // Delay reset to allow for closing animation
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
      setStatus('completed'); // Move to completed screen first
      setIsSaving(true);
      if (user && score > 0) {
        try {
          const answeredIds = questions.map(q => q.id.toString());
          await updateUserQuizStats(user.uid, score, answeredIds);
        } catch (error) {
          console.error("Failed to save quiz stats:", error);
          // Optionally show a toast error here
        }
      }
      setIsSaving(false);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setStatus('active');
    }
  };

  const resetQuiz = () => {
    setStatus('initial');
  };

  const getTitle = () => {
    switch (status) {
      case 'initial':
        return t('skincare_quiz');
      case 'loading':
        return t('loading_quiz');
      case 'active':
      case 'feedback':
        return `${t('question')} ${currentIndex + 1} / ${questions.length}`;
      case 'completed':
        return t('quiz_complete_title');
      case 'no_questions':
        return t('quiz_all_done_title');
      case 'error':
        return t('error_title');
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl mx-auto text-primary" /></div>;

      case 'error':
        return (
          <div className="border-l-4 border-red-500 bg-red-500/10 p-4 rounded-r-lg text-left">
            <div className="flex items-center">
              <FiAlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        );

      case 'no_questions':
          return (
            <div className="text-center p-6 space-y-4">
                <FiAward size={40} className="mx-auto text-amber-500"/>
                <p className="text-sm text-text-secondary">{t('quiz_all_done_desc')}</p>
            </div>
          );

      case 'active':
      case 'feedback':
        const question = questions[currentIndex];
        if (!question) return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl mx-auto text-primary" /></div>;
        return (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-center text-text-primary px-2">{question.question}</h3>
            <div className="space-y-3 pt-2">
              {question.options.map(option => {
                const isSelected = selectedAnswer === option;
                const isTheCorrectAnswer = option === question.correct_answer;
                let buttonClass = "w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm font-medium ";

                if (status === 'feedback') {
                  if (isTheCorrectAnswer) {
                    buttonClass += "bg-green-500/15 border-green-500/30 text-green-800 dark:text-green-300";
                  } else if (isSelected && !isCorrect) {
                    buttonClass += "bg-red-500/15 border-red-500/30 text-red-800 dark:text-red-300";
                  } else {
                    buttonClass += "bg-background border-transparent opacity-60";
                  }
                } else {
                  buttonClass += isSelected
                    ? "bg-primary/20 border-primary/30"
                    : "bg-background hover:bg-black/5 dark:hover:bg-white/10 border-transparent";
                }
                return (
                  <button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={status === 'feedback'}>
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        );

      case 'completed':
        return (
            <div className="text-center p-6 space-y-4">
                <FiAward size={48} className="mx-auto text-amber-500"/>
                <p className="text-base text-text-secondary">{t('you_scored')}</p>
                <p className="text-3xl font-bold text-text-primary">{score} / {questions.length}</p>
                 {isSaving && <div className="flex justify-center items-center gap-2 text-sm text-text-secondary"><FiLoader className="animate-spin" /><span>{t('saving')}</span></div>}
            </div>
        );

      default: // 'initial'
        return (
          <div className="text-center p-6 space-y-4">
            <FiAward size={40} className="mx-auto text-primary" />
            <p className="text-sm text-text-secondary">{t('start_quiz_desc')}</p>
          </div>
        );
    }
  };

  const renderFooter = () => {
    const isPrimaryButtonDisabled =
      (status === 'active' && !selectedAnswer) ||
      status === 'loading' ||
      isSaving;

    return (
        <div className="flex items-center space-x-4 pt-2">
            {/* Secondary Button */}
            <button
                onClick={status === 'completed' || status === 'no_questions' || status === 'error' ? resetQuiz : onClose}
                disabled={status === 'loading' || isSaving}
                className="flex-1 py-2.5 rounded-full bg-background hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 font-semibold text-text-secondary transition-colors"
            >
                {status === 'completed' || status === 'no_questions' || status === 'error' ? t('play_again') : t('discard')}
            </button>
            
            {/* Primary Button */}
            <button
                onClick={() => {
                    if (status === 'initial') startQuiz();
                    if (status === 'active') handleSubmitAnswer();
                    if (status === 'feedback') handleNextQuestion();
                    if (status === 'error') startQuiz();
                    if (status === 'completed' || status === 'no_questions') onClose();
                }}
                disabled={isPrimaryButtonDisabled}
                className="flex-1 py-2.5 rounded-full bg-primary hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
                {status === 'loading' && <><FiLoader className="animate-spin" /><span>{t('loading')}</span></>}
                {status === 'initial' && <><FiPlay/><span>{t('start_quiz')}</span></>}
                {status === 'active' && <><FiCheckSquare/><span>{t('submit')}</span></>}
                {status === 'feedback' && <><FiArrowRight/><span>{currentIndex === questions.length - 1 ? t('finish_quiz') : t('next_question')}</span></>}
                {status === 'error' && <><FiRepeat/><span>{t('try_again')}</span></>}
                {(status === 'completed' || status === 'no_questions') && <><FiX/><span>{t('close')}</span></>}
            </button>
        </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-6 w-full max-w-md flex flex-col space-y-4 animate-fadeIn shadow-2xl border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center text-text-primary">
          {getTitle()}
        </h2>

        <div className="min-h-[150px] flex flex-col justify-center">
            {renderContent()}
        </div>

        {renderFooter()}
      </div>
    </div>
  );
};

export default QuizModal;