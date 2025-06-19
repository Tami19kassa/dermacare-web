import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending the message
    setTimeout(() => {
      toast.success("Your message has been sent!");
      setIsLoading(false);
      // Here you would typically clear the form fields
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section>
      <h2 className="text-2xl font-medium mb-6 px-2">{t('contact_us_title')}</h2>
      <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark p-6 rounded-2xl">
        <p className="mb-4 text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
          {t('contact_us_desc')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder={t('full_name')} 
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <input 
            type="email" 
            placeholder={t('email')}
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <textarea 
            placeholder={t('your_message')} 
            rows={4} 
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
            required
          ></textarea>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? t('sending') : t('send_message')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;