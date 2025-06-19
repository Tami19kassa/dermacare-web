import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiChevronDown } from 'react-icons/fi';

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <details className="group border-b border-gray-200 dark:border-neutral-700 py-3 last:border-none">
    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
      <span>{q}</span>
      <span className="transition group-open:rotate-180">
        <FiChevronDown />
      </span>
    </summary>
    <p className="text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mt-3 group-open:animate-fadeIn">
      {a}
    </p>
  </details>
);

const Faq: React.FC = () => {
    const { t } = useTranslation();
    const faqData = [
        { question: t('faq_q1'), answer: t('faq_a1') },
        { question: t('faq_q2'), answer: t('faq_a2') },
        { question: t('faq_q3'), answer: t('faq_a3') }
    ];

    return (
        // The outer div and title have been removed
        <div className="space-y-2">
            {faqData.map((item, index) => <FaqItem key={index} q={item.question} a={item.answer} />)}
        </div>
    );
};

export default Faq;