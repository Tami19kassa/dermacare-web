import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Feedback: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
 
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      setIsLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section>
      <h2 className="text-2xl font-medium mb-6 px-2">{t('feedback_title')}</h2>
      <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark p-6 rounded-2xl">
        <p className="mb-4 text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
          {t('feedback_desc')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            placeholder={t('your_feedback')} 
            rows={4} 
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
            required
          ></textarea>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? t('submitting') : t('submit_feedback')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Feedback;