import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { FiX, FiLogOut } from 'react-icons/fi';
import ScanHistory from '../../features/scanner/ScanHistory';
import Profile from '../../features/profile/Profile';
import Quiz from '../../features/profile/Quiz';
import Faq from '../../features/info/Faq';
import About from '../../features/info/About';
import AppControls from '../../features/settings/AppControls';

interface MobileDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const DrawerSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl p-4">
      <h3 className="text-lg font-medium text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-3 px-2">{title}</h3>
      {children}
    </div>
);

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
      <aside
        className="fixed top-0 left-0 h-full w-4/S5 max-w-sm bg-gemini-bg-light dark:bg-gemini-bg-dark z-50 overflow-y-auto p-4 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-medium">{t('menu')}</h2>
            <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
                <FiX size={24}/>
            </button>
        </div>
        
        <DrawerSection title={t('profile')}><Profile /></DrawerSection>
        <DrawerSection title={t('skincare_quiz')}><Quiz /></DrawerSection>
        <DrawerSection title={t('scan_history')}><ScanHistory /></DrawerSection>
        <DrawerSection title={t('resources')}>
            <Faq />
            <About />
        </DrawerSection>
        <DrawerSection title={t('application')}>
            <AppControls />
        </DrawerSection> 

        <button onClick={logout} className="w-full text-left p-3 flex items-center space-x-3 rounded-full hover:bg-red-500/10 text-red-500 font-medium">
          <FiLogOut />
          <span>{t('logout')}</span>
        </button>
      </aside>
    </div>
  );
};

export default MobileDrawer;