import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, children }) => {
  return (
    <details className="group">
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/50">
        <div className="flex items-center space-x-3">
          <span className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark">{icon}</span>
          <span>{title}</span>
        </div>
        <span className="transition group-open:rotate-180">
          <FiChevronDown />
        </span>
      </summary>
      <div className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mt-3 px-3 group-open:animate-fadeIn">
        {children}
      </div>
    </details>
  );
};

export default Accordion;