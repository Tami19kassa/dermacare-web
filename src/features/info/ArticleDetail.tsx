import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { getArticleDetail } from '../../services/geminiService';
import { Spinner } from '../../components/Spinner';
import { FiArrowLeft } from 'react-icons/fi';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  
  const [markdown, setMarkdown] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setError("Article topic is missing.");
        setIsLoading(false);
        return;
    };

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { markdown: content, imageUrl: img } = await getArticleDetail(
          id,
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
  }, [id, i18n.language]);

  const renderContent = () => {
    if (isLoading) {
        return <Spinner fullScreen />;
    }
    if (error) {
        return <div className="text-center text-red-500 p-8">{error}</div>;
    }
    return (
        <div className="bg-gemini-surface-light dark:bg-gemini-surface-dark rounded-2xl overflow-hidden shadow-lg">
            
            {imageUrl && (
                <img 
                    src={imageUrl} 
                    alt={id?.replace(/-/g, ' ')} 
                    className="w-full h-64 object-cover"
                />
            )}
            
            <article className="prose dark:prose-invert max-w-none p-6 md:p-8">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gemini-bg-light dark:bg-gemini-bg-dark">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gemini-blue mb-6 hover:underline">
          <FiArrowLeft />
          {t('back_to_home')}
        </Link>
        {renderContent()}
      </div>
    </div>
  );
};

export default ArticleDetail;