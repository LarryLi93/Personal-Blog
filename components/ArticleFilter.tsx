"use client";

import React, { useState, useMemo } from 'react';
import { ArticleGrid } from './ArticleGrid';
import { Article, Category } from '@/types';

interface ArticleFilterProps {
  articles: Article[];
  categories: Category[];
}

export function ArticleFilter({ articles, categories }: ArticleFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredArticles = useMemo(() => {
    return selectedCategory
      ? articles.filter((article) => article.category === selectedCategory)
      : articles;
  }, [articles, selectedCategory]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setVisibleCount(12);
  };

  return (
    <>
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 min-h-[2rem]">
          <span className="text-xs font-bold tracking-[0.2em] uppercase">
            Filter:
          </span>
          <div className="flex flex-wrap gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`text-sm font-medium transition-all tracking-wide ${
                  selectedCategory === category
                    ? 'text-white underline decoration-2 underline-offset-8'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-neutral-600 hover:text-neutral-400 border border-neutral-800 px-2 py-1 rounded ml-auto md:ml-0 animate-[fadeIn_0.2s_ease-in-out]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <ArticleGrid articles={visibleArticles} />

      {hasMore && (
        <div className="flex justify-center pb-24">
          <button
            onClick={handleLoadMore}
            className="px-8 py-4 border border-neutral-800 text-neutral-400 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
