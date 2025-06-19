import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { getArticleDetail } from '../../services/geminiService';
import { Spinner } from '../../components/Spinner';
import { FiX } from 'react-icons/fi';
import { useArticleModal } from '../../context/ArticleModalContext';
import { getTopicTitle } from '../../utils/topicData'; // We will create this helper

const ArticleModal: React.FC = () => {
  const { isModalOpen, topicId, closeArticleModal } = useArticleModal();
  const { t, i18n } = useTranslation();
  
  const [markdown, setMarkdown] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the display title for the article
  const articleTitle = topicId ? getTopicTitle(topicId, t) : '';

  useEffect(() => {
    if (topicId) {
      const fetchArticle = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const { markdown: content, imageUrl: img } = await getArticleDetail(
            topicId,
            i18n.language === 'am' ? 'Amharic' : 'English'
          );
          setMarkdown(content);
          setImageUrl(img);
        } catch (err: any) {
          setError(err.message || 'Failed to load article.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticle();
    }
  }, [topicId, i18n.language]);

  if (!isModalOpen) return null;

  const renderContent = () => {
    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><Spinner /></div>;
    }
    if (error) {
        return <div className="flex-grow flex items-center justify-center text-red-500 p-6">{error}</div>;
    }
    return (
        <>
          {imageUrl && (
              <img 
                  src={imageUrl} 
                  alt={articleTitle} 
                  className="w-full h-56 object-cover flex-shrink-0"
              />
          )}
          {/* --- THIS IS THE CORRECTED STRUCTURE --- */}
          <div className="flex-grow overflow-y-auto min-h-0 p-6 md:p-8">
                {/* 1. The Title is now OUTSIDE the prose container */}
                <h1 className="text-3xl font-bold mb-4 text-gemini-text-light dark:text-gemini-text-dark">
                    {articleTitle}
                </h1>
                {/* 2. The article content is INSIDE the prose container for readability */}
                <article className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </article>
          </div>
        </>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={closeArticleModal}>
      <div 
        className="bg-gemini-surface-light dark:bg-gemini-surface-dark w-full max-w-3xl rounded-2xl shadow-lg relative flex flex-col"
        style={{ height: 'calc(100vh - 4rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={closeArticleModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 z-20">
            <FiX />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ArticleModal;