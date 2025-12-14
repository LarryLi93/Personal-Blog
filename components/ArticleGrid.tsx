import React from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  onArticleClick: (slug: string) => void;
  loading: boolean;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, onArticleClick, loading }) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-neutral-900 rounded"></div>
            <div className="h-6 bg-neutral-900 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-900 rounded w-full"></div>
            <div className="h-4 bg-neutral-900 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 pb-12">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          onClick={onArticleClick} 
        />
      ))}
    </div>
  );
};