import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset link sent! Check your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gemini-bg-light dark:bg-gemini-bg-dark p-4">
      <div className="w-full max-w-md bg-gemini-surface-light dark:bg-gemini-surface-dark p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
           <img src="/assets/images/logo.png" alt="Dermacare Logo" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-medium text-gemini-text-light dark:text-gemini-text-dark">{t('reset_password')}</h1>
          <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{t('reset_password_instructions')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark" />
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-12 bg-gray-100 dark:bg-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-gemini-blue"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-gemini-blue text-white font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? `${t('send_reset_link')}...` : t('send_reset_link')}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
          {t('remember_password')}{' '}
          <Link to="/login" className="font-medium text-gemini-blue hover:underline">
            {t('sign_in')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;