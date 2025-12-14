import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ArticleGrid } from './components/ArticleGrid';
import { ArticleView } from './components/ArticleView';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { getArticles, getArticleBySlug } from './services/articleService';
import { initializeVisitCount } from './services/globalVisitService';
import { Article, Category } from './types';

function App() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Category Filtering
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categories: Category[] = [
    'Learn',
    'Achieve',
    'Spirituality',
    'Model/Frame/System',
    'AI Solutions',
    'Personal Brand'
  ];

  // Initial load
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // 记录访问次数 - 使用全局服务确保只调用一次
  useEffect(() => {
    initializeVisitCount().catch(err => {
      console.error('Failed to initialize visit count:', err);
    });
  }, []);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory]);

  // Handle navigation to article
  const handleArticleClick = async (slug: string) => {
    setLoading(true);
    setCurrentArticleSlug(slug);
    // Simulate fetching specific article or find in state
    const article = await getArticleBySlug(slug);
    if (article) {
        setCurrentArticle(article);
        setView('detail');
        window.scrollTo(0, 0);
    }
    setLoading(false);
  };

  // Handle back to home
  const handleHomeClick = () => {
    setView('list');
    setCurrentArticleSlug(null);
    setCurrentArticle(null);
    window.scrollTo(0, 0);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const filteredArticles = selectedCategory 
    ? articles.filter(article => article.category === selectedCategory)
    : articles;
  
  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Header onHomeClick={handleHomeClick} />
      
      <main className="min-h-[calc(100vh-theme(spacing.20)-theme(spacing.24))]">
        {view === 'list' && (
          <>
            <Hero />
            
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
                            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                            className={`text-sm font-medium transition-all tracking-wide ${
                            selectedCategory === category 
                                ? 'text-white underline decoration-2 underline-offset-8' 
                                : ' hover:text-white'
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

            <ArticleGrid 
              articles={visibleArticles} 
              onArticleClick={handleArticleClick} 
              loading={loading}
            />

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

            <AboutSection />
          </>
        )}

        {view === 'detail' && currentArticle && (
          <ArticleView 
            article={currentArticle} 
            onBack={handleHomeClick} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;