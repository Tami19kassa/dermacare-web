import React, { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
 
import HeroSection from './HeroSection';
import Carousel from './Carousel';
import InfoHub from '../info/InfoHub';
import Contact from '../info/Contact';
import Footer from '../info/Footer';
import SkinDiseaseInfoModal from '../info/SkinDiseaseInfoModal';
import About from '../info/About';
 
import { diseaseDatabase, type Disease } from '../../data/diseaseDatabase';
 
import {
  PiDotsThreeCircleVerticalBold, PiHandsClapping, PiShieldCheckeredBold, PiFireSimpleBold, PiVirusBold,
  PiCircleDashedBold, PiCouchBold, PiPersonSimpleRunBold, PiPlantBold, PiLightningBold, PiStickerBold,
  PiCirclesFourBold, PiPaintBrushHouseholdBold, PiMosqueBold, PiCircle
} from 'react-icons/pi';

 
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
 
const DiseaseCard: React.FC<{
    disease: Disease;
    onClick: () => void;
}> = ({ disease, onClick }) => {
    const { i18n } = useTranslation();
    const isAmharic = i18n.language === 'am';

    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center p-4 bg-surface rounded-2xl w-full text-center shadow-sm hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-primary/20 transition-all duration-300"
        >
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-background rounded-xl mb-4 text-3xl text-primary transition-all duration-300">
                {iconMap[disease.id]}
            </div>
            <h4 className="font-semibold text-sm text-text-primary leading-tight">
                {isAmharic ? disease.name.am : disease.name.en}
            </h4>
        </button>
    );
};
 
const InitialView: React.FC = () => {
  const { t } = useTranslation();  
  const { user } = useAuth();
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
 
  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={`py-12 ${className || ''}`}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-text-primary">{title}</h2>
      {children}
    </section>
  );

  return (
    <> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-cyan-400 mb-3">
            {t('hello_user', { name: user?.displayName?.split(' ')[0] || t('guest') })}
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('main_greeting')}
          </p>
        </header>
 
        <main className="space-y-16">
          
          <HeroSection t={t} />
          
          <Carousel />
          <InfoHub />
          
          <Section title={t('common_skin_diseases')}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {diseaseDatabase.map((disease) => (
                    <DiseaseCard
                        key={disease.id}
                        disease={disease}
                        onClick={() => setSelectedDiseaseId(disease.id)}
                    />
                ))}
            </div>
          </Section>
          
          <Section title={t('have_questions')}>
            <div className="max-w-3xl mx-auto">
              <Contact />
            </div>
          </Section>

          <Section title={t('about_dermacare')}>
            <div className="max-w-3xl mx-auto">
              <About />
            </div>
          </Section>

        </main>
      </div>
      
      {/* Footer is outside the main container to span full width */}
      <Footer />
      
      {/* Modal remains at the top level */}
      <SkinDiseaseInfoModal 
        isOpen={!!selectedDiseaseId} 
        diseaseId={selectedDiseaseId}
        onClose={() => setSelectedDiseaseId(null)} 
      />
    </>
  );
};

export default InitialView;