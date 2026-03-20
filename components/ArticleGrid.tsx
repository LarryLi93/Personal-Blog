"use client";

import React from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  loading?: boolean;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ 
  articles, 
  loading = false 
}) => {
  if (loading) {
    return (
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-video bg-neutral-800 rounded"></div>
                <div className="h-6 bg-neutral-800 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-800 rounded w-full"></div>
                <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-neutral-500 text-lg">No articles found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};
