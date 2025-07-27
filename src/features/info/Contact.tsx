import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth'; // <-- STEP 1: IMPORT useAuth HOOK
import { sendFeedbackMessage } from '../../services/firestoreService'; // <-- STEP 2: IMPORT YOUR SERVICE FUNCTION

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // <-- STEP 3: GET THE CURRENTLY LOGGED-IN USER
  const [isLoading, setIsLoading] = useState(false);
  
  // Create state to hold the form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
  });

  // Effect to pre-fill the email if the user is logged in
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email! }));
    }
  }, [user]);

  // Handle changes to any input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- STEP 4: IMPLEMENT THE SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard clause: User must be logged in to send a message.
    if (!user) {
      toast.error("You must be logged in to send a message.");
      return;
    }
    
    // Simple validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast.error("Please fill out all fields.");
        return;
    }

    setIsLoading(true);
    
    try {
      // Use the service function to send the data to Firestore
      await sendFeedbackMessage(user.uid, formData.email, formData.message);
      
      toast.success("Your message has been sent successfully!");
      
      // Reset the form fields after successful submission
      setFormData({
        fullName: '',
        email: user.email || '', // Keep email pre-filled
        message: '',
      });

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
            name="fullName" // Add name attribute
            placeholder={t('full_name')} 
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <input 
            type="email" 
            name="email" // Add name attribute
            placeholder={t('email')}
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue" 
            required 
          />
          <textarea 
            name="message" // Add name attribute
            placeholder={t('your_message')} 
            value={formData.message}
            onChange={handleChange}
            rows={4} 
            className="w-full p-3 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
            required
          ></textarea>
          <button 
            type="submit" 
            disabled={isLoading || !user} // Also disable the button if the user is not logged in
            className="px-5 py-2.5 font-semibold bg-gemini-blue text-white rounded-full hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? t('sending') : t('send_message')}
          </button>
          
          {!user && (
              <p className="text-xs text-center text-amber-400">
                  Please log in to send a message.
              </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;