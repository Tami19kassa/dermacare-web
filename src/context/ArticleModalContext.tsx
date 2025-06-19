import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface ArticleModalContextType {
  isModalOpen: boolean;
  topicId: string | null;
  openArticleModal: (id: string) => void;
  closeArticleModal: () => void;
}

const ArticleModalContext = createContext<ArticleModalContextType | undefined>(undefined);

export const useArticleModal = () => {
  const context = useContext(ArticleModalContext);
  if (!context) {
    throw new Error('useArticleModal must be used within an ArticleModalProvider');
  }
  return context;
};

interface ArticleModalProviderProps {
  children: ReactNode;
}

export const ArticleModalProvider: React.FC<ArticleModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);

  const openArticleModal = (id: string) => {
    setTopicId(id);
    setIsModalOpen(true);
  };

  const closeArticleModal = () => {
    setIsModalOpen(false);
    setTopicId(null);
  };

  return (
    <ArticleModalContext.Provider value={{ isModalOpen, topicId, openArticleModal, closeArticleModal }}>
      {children}
    </ArticleModalContext.Provider>
  );
};