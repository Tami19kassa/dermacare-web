import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiHelpCircle, FiInfo } from 'react-icons/fi';

import Header from './Header';
import MobileDrawer from './MobileDrawer';
import MainContent from '../../features/main/MainContent';
import ScanHistory from '../../features/scanner/ScanHistory';
import Profile from '../../features/profile/Profile';
import Quiz from '../../features/profile/Quiz';
import Faq from '../../features/info/Faq';
import About from '../../features/info/About';
import Accordion from '../Accordion';
import ArticleModal from '../../features/info/ArticleModal';

const LeftSidebar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-6 p-1">
      <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl p-4">
        <h2 className="text-lg font-medium text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mb-3 px-2">
          {t('scan_history')}
        </h2>
        <ScanHistory />
      </div>
      <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl p-4 space-y-2">
        <Accordion title={t('faq')} icon={<FiHelpCircle size={20}/>}>
            <Faq />
        </Accordion>
        <Accordion title={t('about_dermacare')} icon={<FiInfo size={20}/>}>
            <About />
        </Accordion>
      </div>
    </div>
  );
};

const RightSidebar: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6 p-1">
        <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl p-4">
            <Profile />
        </div>
        <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl p-4">
            <Quiz />
        </div>
    </div>
  );
};

const Layout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="relative flex flex-col h-screen bg-gemini-bg-light dark:bg-gemini-bg-dark">
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
            
            <div className="flex-1 overflow-hidden">
                {/* Large Screen Layout */}
                <div className="hidden xl:grid grid-cols-12 gap-6 h-full p-4">
                    <aside className="col-span-3 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0">
                            <LeftSidebar />
                        </div>
                    </aside>
                    <main className="col-span-6 h-full flex flex-col min-h-0">
                        <MainContent />
                    </main>
                    <aside className="col-span-3 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0">
                            <RightSidebar />
                        </div>
                    </aside>
                </div>

                {/* Medium Screen Layout */}
                <div className="hidden md:grid xl:hidden grid-cols-12 gap-6 h-full p-4">
                    <aside className="col-span-4 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0 space-y-6">
                            <RightSidebar />
                            <LeftSidebar />
                        </div>
                    </aside>
                    <main className="col-span-8 h-full flex flex-col min-h-0">
                        <MainContent />
                    </main>
                </div>

                {/* Small Screen Layout */}
                <div className="block md:hidden h-full">
                    <MainContent />
                </div>
            </div>
            
            <MobileDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <ArticleModal />
        </div>
    );
};

export default Layout;