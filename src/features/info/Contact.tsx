import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // <-- IMPORT useAuth
import { sendFeedbackMessage } from '../../services/firestoreService'; // <-- IMPORT your service function

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // <-- Get the currently logged-in user
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fullName, setFullName] = useState(''); // State for name
  const [email, setEmail] = useState(user?.email || ''); // State for email, pre-filled if available

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to send a message.");
      return;
    }
    if (!message.trim() || !fullName.trim() || !email.trim()) {
        toast.error("Please fill out all fields.");
        return;
    }

    setIsLoading(true);
    
    try {
      // Use the service function to send the data to Firestore
      await sendFeedbackMessage(user.uid, email, message.trim());
      toast.success("Your message has been sent successfully!");
      
      // Reset the form after successful submission
      setMessage('');
      setFullName('');
      setEmail(user.email || ''); // Reset email to default
      (e.target as HTMLFormElement).reset(); // This helps clear form fields visually
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error("Feedback submission error:", error);
    } finally {
      setIsLoading(false);
    }
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <input 
            type="email" 
            placeholder={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <textarea 
            placeholder={t('your_message')} 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4} 
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
            required
          ></textarea>
          <button 
            type="submit" 
            disabled={isLoading || !user} // Also disable if not logged in
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