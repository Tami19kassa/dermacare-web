import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Spinner } from '../../components/Spinner';

const Login: React.FC = () => {
  const { t } = useTranslation();

  // State variables for the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);

  // Function to handle the form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Use Firebase SDK to sign in the user
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // On success, the AuthProvider's onAuthStateChanged listener will automatically
      // update the user state, and the Auth/Guest routes will handle the redirect.
      toast.success('Login successful!');
    } catch (error: any) {
      // Provide a more user-friendly error message
      const errorMessage = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password. Please try again.'
        : 'Failed to log in. Please check your credentials.';
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container that fills the screen and centers the form
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background Image and Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/images/auth-bg.jpg" // Make sure you have an image at this path in your public folder
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"/>
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 w-full max-w-md bg-surface/70 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">{t('log_in')}</h1>
          <p className="text-text-secondary mt-2">{t('welcome_back')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email')}
            className="w-full p-3 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            required
            autoComplete="email"
          />
          {/* Password Input */}
          <div className="relative">
            <input
              type={obscurePassword ? 'password' : 'text'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
              className="w-full p-3 pr-10 bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              aria-label={obscurePassword ? 'Show password' : 'Hide password'}
            >
              {obscurePassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="font-medium text-primary hover:underline">
              {t('forgot_password')}?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-semibold bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center transition-opacity"
          >
            {isLoading ? <Spinner /> : t('log_in')}
          </button>
        </form>
        
        {/* Link to Register Page */}
        <p className="text-center text-sm text-text-secondary mt-8">
          {t('dont_have_account')}?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;