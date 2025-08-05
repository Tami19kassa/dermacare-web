import React from 'react';
import { useTranslation } from 'react-i18next';
import { getDiseaseById } from '../../data/diseaseDatabase';
import { FiX, FiCheckCircle } from 'react-icons/fi';

interface SkinDiseaseInfoModalProps {
  diseaseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}
 
const ListItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start">
        <div className="flex-shrink-0 bg-green-100 dark:bg-green-800/30 p-2 rounded-full mr-3 mt-1">
            <FiCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-gray-600 dark:text-gray-300 flex-1">{text}</span>
    </li>
);

const SkinDiseaseInfoModal: React.FC<SkinDiseaseInfoModalProps> = ({ diseaseId, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isAmharic = i18n.language === 'am';
  const disease = getDiseaseById(diseaseId);

  if (!isOpen || !disease) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isAmharic ? disease.name.am : disease.name.en}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <FiX className="h-6 w-6" />
            </button>
        </div>
 
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            
            <div className="w-full md:w-1/3 h-64 flex-shrink-0">
              <img 
                src={disease.image} 
                alt={isAmharic ? disease.name.am : disease.name.en}
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{isAmharic ? "መግለጫ" : "Description"}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{isAmharic ? disease.description.am : disease.description.en}</p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{isAmharic ? "ምልክቶች" : "Symptoms"}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {(isAmharic ? disease.symptoms.am : disease.symptoms.en).map((symptom, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300">{symptom}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{isAmharic ? "ቤተሰብ ሕክምና" : "Homemade Treatment"}</h3>
              <ul className="space-y-3">
                {(isAmharic ? disease.homeTreatments.am : disease.homeTreatments.en).map((treatment, i) => (
                   <ListItem key={i} text={treatment} />
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{isAmharic ? "ዶክተር ሕክምና" : "Doctor Treatment"}</h3>
              <ul className="space-y-3">
                 {(isAmharic ? disease.doctorTreatments.am : disease.doctorTreatments.en).map((treatment, i) => (
                   <ListItem key={i} text={treatment} />
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-6">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{isAmharic ? "መልካም ልምዶች" : "Best Habits"}</h3>
            <ul className="space-y-3">
               {(isAmharic ? disease.bestHabits.am : disease.bestHabits.en).map((habit, i) => (
                   <ListItem key={i} text={habit} />
                ))}
            </ul>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default SkinDiseaseInfoModal;