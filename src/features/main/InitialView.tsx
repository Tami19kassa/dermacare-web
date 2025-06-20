import React, { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

// Import all the building block components
import HeroSection from './HeroSection';
import Carousel from './Carousel';
import InfoHub from '../info/InfoHub';
import Contact from '../info/Contact';
import Feedback from '../info/Feedback';
import Footer from '../info/Footer';
import SkinDiseaseInfoModal from '../info/SkinDiseaseInfoModal';

// Import the data and the type definition
import { diseaseDatabase, type Disease } from '../../data/diseaseDatabase';

// Import the icons that will be used
import {
  PiDotsThreeCircleVerticalBold, PiHandsClapping, PiShieldCheckeredBold, PiFireSimpleBold, PiVirusBold,
  PiCircleDashedBold, PiCouchBold, PiPersonSimpleRunBold, PiPlantBold, PiLightningBold, PiStickerBold,
  PiCirclesFourBold, PiPaintBrushHouseholdBold, PiMosqueBold, PiCircle
} from 'react-icons/pi';

// --- THIS IS THE ICON MAP ---
// It maps the disease 'id' string from our data to an actual React icon component.
const iconMap: { [key: string]: ReactElement } = {
  acne: <PiDotsThreeCircleVerticalBold />,
  eczema: <PiHandsClapping />,
  psoriasis: <PiShieldCheckeredBold />,
  rosacea: <PiFireSimpleBold />,
  warts: <PiVirusBold />,
  ringworm: <PiCircleDashedBold />,
  "cold-sores": <PiCouchBold />,
  "athletes-foot": <PiPersonSimpleRunBold />,
  "contact-dermatitis": <PiPlantBold />,
  shingles: <PiLightningBold />,
  impetigo: <PiStickerBold />,
  "seborrheic-dermatitis": <PiCirclesFourBold />,
  vitiligo: <PiPaintBrushHouseholdBold />,
  hives: <PiMosqueBold />,
  boils: <PiCircle />,
};

// The card component now looks up the icon from the map using the disease id
const DiseaseCard: React.FC<{
    disease: Disease;
    onClick: () => void;
}> = ({ disease, onClick }) => {
    const { i18n } = useTranslation();
    const isAmharic = i18n.language === 'am';

    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center p-4 bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl w-full text-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-300"
        >
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-2xl mb-3 text-3xl text-gemini-blue group-hover:bg-gemini-blue group-hover:text-white transition-all duration-300">
                {/* Use the disease.id to get the correct icon from the map */}
                {iconMap[disease.id]}
            </div>
            <h4 className="font-semibold text-sm text-gemini-text-light dark:text-gemini-text-dark">
                {isAmharic ? disease.name.am : disease.name.en}
            </h4>
        </button>
    );
};


const InitialView: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-12">
        <header className="py-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 mb-4">
            {t('hello_user', { name: user?.displayName || t('guest') })}
          </h1>
          <p className="text-lg text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">
            {t('main_greeting')}
          </p>
        </header>
        
        <HeroSection />
        <Carousel />
        <InfoHub />
        
        <section>
            <h2 className="text-2xl font-medium mb-6 px-2">{t('common_skin_diseases')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {diseaseDatabase.map((disease) => (
                    <DiseaseCard
                        key={disease.id}
                        disease={disease}
                        onClick={() => setSelectedDiseaseId(disease.id)}
                    />
                ))}
            </div>
        </section>
        
        <Contact />
        <Feedback />
        <Footer />
      </div>
      
      <SkinDiseaseInfoModal 
        isOpen={!!selectedDiseaseId} 
        diseaseId={selectedDiseaseId}
        onClose={() => setSelectedDiseaseId(null)} 
      />
    </>
  );
};

export default InitialView;