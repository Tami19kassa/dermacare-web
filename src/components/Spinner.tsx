import React from 'react';

interface SpinnerProps {
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gemini-bg-light dark:bg-gemini-bg-dark z-50">
        <div className="w-12 h-12 border-4 border-gemini-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 border-4 border-gemini-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};