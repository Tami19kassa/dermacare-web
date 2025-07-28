import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { FiX, FiLogOut } from 'react-icons/fi';

// Import all the components that will be displayed in the drawer
import ScanHistory from '../../features/scanner/ScanHistory';
import Profile from '../../features/profile/Profile';
import Quiz from '../../features/profile/Quiz';
import Faq from '../../features/info/Faq';
import About from '../../features/info/About';
import AppControls from '../../features/settings/AppControls';
import Contact from '../../features/info/Contact'; // <-- Assuming you want a contact section

interface MobileDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// A reusable, styled container for each section in the drawer
const DrawerSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-4 px-2">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
);

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth(); // Assuming useAuth provides a logout function

  // --- NEW: Add a transition effect for the drawer ---
  const drawerClasses = `fixed top-0 left-0 h-full w-full max-w-sm bg-background z-50 overflow-y-auto p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;
  const backdropClasses = `fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`;

  return (
    // Backdrop overlay
    <div 
      className={backdropClasses} 
      onClick={() => setIsOpen(false)}
      aria-hidden={!isOpen}
    >
      {/* Drawer content */}
      <aside
        className={drawerClasses}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* --- 1. MODIFIED HEADER --- */}
        <header className="flex justify-between items-center mb-6 px-2">
            <h2 id="drawer-title" className="text-xl font-bold text-text-primary">
              {t('menu')}
            </h2>
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Close menu"
            >
                <FiX size={24}/>
            </button>
        </header>
        
        {/* --- 2. GROUPED & STYLED SECTIONS --- */}
        <div className="space-y-6">
          <DrawerSection title={t('profile')}>
            <Profile />
          </DrawerSection>

          <DrawerSection title={t('activities')}>
            <Quiz />
            <ScanHistory />
          </DrawerSection>
          
          <DrawerSection title={t('resources')}>
            <Faq />
            <About />
          </DrawerSection>
          
          <DrawerSection title={t('support')}>
            <Contact />
          </DrawerSection>
          
          <DrawerSection title={t('settings')}>
            <AppControls />
          </DrawerSection> 
        </div>

        {/* --- 3. MODIFIED LOGOUT BUTTON --- */}
        {user && (
          <div className="mt-8">
            <button 
              onClick={logout} 
              className="w-full text-left p-3 flex items-center space-x-3 rounded-xl bg-surface hover:bg-red-500/10 text-red-500 font-medium transition-colors"
            >
              <FiLogOut size={20} />
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default MobileDrawer;