import React from 'react';
import { Article } from '../types';
import { ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (slug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (article.url) {
      e.preventDefault();
      window.open(article.url, '_blank', 'noopener,noreferrer');
    } else {
      onClick(article.slug);
    }
  };

  return (
    <div className="group flex flex-col space-y-4 cursor-pointer" onClick={handleClick}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-video bg-neutral-900 w-full">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm border border-white/10">
                {article.category}
            </span>
            {article.url && (
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-100 text-black backdrop-blur-sm border border-white/10 flex items-center gap-1">
                External
              </span>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-3 flex-grow">
        <h3 className="text-xl md:text-2xl font-bold leading-tight text-white group-hover:underline decoration-1 underline-offset-4 flex items-start gap-2">
          {article.title}
          {article.url && <ExternalLink className="w-5 h-5 text-neutral-500 mt-0.5 flex-shrink-0" />}
        </h3>
        
        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        <div className="pt-2 mt-auto">
          <span className="inline-block text-white font-serif italic text-sm underline decoration-neutral-700 underline-offset-4 group-hover:decoration-white transition-all">
            {article.url ? 'Visit Link' : 'Read Full Post'}
          </span>
        </div>

        <div className="pt-4 flex items-center text-xs text-neutral-500 font-medium tracking-wide uppercase">
          <span>{article.author}</span>
          <span className="mx-2">•</span>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );
};