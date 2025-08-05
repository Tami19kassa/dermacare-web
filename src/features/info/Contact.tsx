import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { sendFeedbackMessage } from '../../services/firestoreService';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to send a message.");
      return;
    }
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsLoading(true);
    try {
      await sendFeedbackMessage(user.uid, formData.email, formData.message, formData.fullName);
      toast.success("Your message has been sent successfully!");
      setFormData({ fullName: '', email: user.email || '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <section>
      <h2 className="text-2xl font-medium mb-6 px-2 text-text-primary">{t('contact_us_title')}</h2>
      <div className="bg-surface p-6 rounded-2xl shadow-md border border-black/5 dark:border-white/5">
        <p className="mb-4 text-sm text-text-secondary">
          {t('contact_us_desc')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input 
            type="text" name="fullName" placeholder={t('full_name')} 
            value={formData.fullName} onChange={handleChange}
            className="w-full p-3 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
            required 
          />
          <input 
            type="email" name="email" placeholder={t('email')}
            value={formData.email} onChange={handleChange}
            className="w-full p-3 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
            required 
          />
          <textarea 
            name="message" placeholder={t('your_message')} 
            value={formData.message} onChange={handleChange}
            rows={4} 
            className="w-full p-3 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          ></textarea>
          
          <button 
            type="submit" 
            disabled={isLoading || !user}
            
            className="w-full px-5 py-2.5 font-semibold bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? t('sending') : t('send_message')}
          </button>
          
          
          {!user && (
              <p className="text-xs text-center text-amber-500 dark:text-amber-400">
                  Please log in to send a message.
              </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;