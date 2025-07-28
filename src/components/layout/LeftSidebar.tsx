import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiHelpCircle, FiInfo } from 'react-icons/fi';
import ScanHistory from '../../features/scanner/ScanHistory';
import Faq from '../../features/info/Faq';
import About from '../../features/info/About';
import Accordion from '../Accordion';

// ... (imports)

const LeftSidebar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-6 p-1">
      {/* FIX: Use the new theme-aware surface and text colors */}
      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-lg font-medium text-text-secondary mb-3 px-2">
          {t('scan_history')}
        </h2>
        <ScanHistory />
      </div>
      <div className="bg-surface rounded-2xl p-4 space-y-2">
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
export default LeftSidebar;