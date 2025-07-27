 

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gemini-surface-dark rounded-2xl p-6 w-full max-w-sm flex flex-col items-center text-center animate-fadeIn" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 mb-4">
          <FiAlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gemini-text-secondary-dark mb-6">{message}</p>
        <div className="flex w-full space-x-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/20">
            {t('cancel', 'Cancel')}
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 font-semibold">
            {t('delete', 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
};