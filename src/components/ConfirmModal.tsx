import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string; // Optional prop for the confirm button text
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Often you want to close the modal after confirming
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl p-6 w-full max-w-sm flex flex-col space-y-4 animate-fadeIn shadow-2xl border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-500/20">
            <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>

        <div className="text-center">
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
            <div className="mt-2">
                <p className="text-sm text-text-secondary">{message}</p>
            </div>
        </div>

        <div className="flex items-center space-x-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full bg-background hover:bg-black/5 dark:hover:bg-white/10 font-semibold text-text-secondary transition-colors"
          >
            {t('cancel', 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700/90 text-white font-semibold flex items-center justify-center gap-2 transition-opacity"
          >
            {confirmText || t('delete', 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
};