"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/types';
import { ArrowUp } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { MobileTableOfContents } from './MobileTableOfContents';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface ArticleViewProps {
  article: Article;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article }) => {
  const [headingIdMap, setHeadingIdMap] = useState<Record<string, string>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const preprocessMarkdown = (content: string) => {
    let processedContent = content.replace(/([^\s])\s\s\n/g, '$1\n\n');
    processedContent = processedContent.replace(/(\n|^)(#+ .+)/g, '\n$2\n');
    return processedContent;
  };

  useEffect(() => {
    const parseHeadings = () => {
      const lines = article.content.split('\n');
      const headingMap: Record<string, string> = {};
      const idCounts: Record<string, number> = {};
      
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('#')) {
          const hashCount = (trimmedLine.match(/^#+/)?.[0]?.length) || 0;
          
          if (hashCount === 1) {
            const text = trimmedLine.substring(hashCount).trim().replace(/\*\*/g, '');
            
            const baseId = text
              .toLowerCase()
              .replace(/[\s]+/g, '-')
              .replace(/[^\w\s-一-龯]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')
              .trim();
            
            const id = idCounts[baseId] ? `${baseId}-${idCounts[baseId] + 1}` : baseId;
            idCounts[baseId] = (idCounts[baseId] || 0) + 1;
            
            headingMap[text] = id;
          }
        }
      });
      
      setHeadingIdMap(headingMap);
    };

    parseHeadings();
  }, [article.content]);

  return (
    <div className="animate-fade-in pb-20">
      <article className="max-w-3xl mx-auto px-6">
        {/* Article Header */}
        <header className="mb-12 text-center pt-8">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold tracking-widest text-neutral-500 uppercase mb-6">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight break-words">
            {article.title}
          </h1>
          
          <p className="text-xl text-neutral-400 font-light leading-relaxed mb-8">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
            <span className="px-3 py-1 bg-neutral-800 rounded-full">#{article.category}</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="mb-12">
            <div className="aspect-video overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
              <img 
                src={article.coverImage} 
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale opacity-90"
              />
            </div>
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-headings:mb-8
            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6
            prose-a:text-white prose-a:underline prose-a:decoration-neutral-600 prose-a:underline-offset-4 hover:prose-a:decoration-white
            prose-blockquote:border-l-white prose-blockquote:text-neutral-400 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:my-6
            prose-strong:text-white prose-strong:font-bold
            prose-li:text-neutral-300
            prose-img:rounded-sm prose-img:grayscale prose-img:hover:grayscale-0 prose-img:transition-all
            prose-code:text-pink-400 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded
            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
            prose-table:border-neutral-700 prose-th:border-neutral-700 prose-td:border-neutral-700
            space-y-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              h1: ({children}) => {
                const getTextContent = (children: React.ReactNode): string => {
                  if (typeof children === 'string') return children;
                  if (Array.isArray(children)) return children.map(getTextContent).join('');
                  if (typeof children === 'object' && children !== null) {
                    const props = (children as { props?: { children?: React.ReactNode } }).props;
                    if (props?.children) return getTextContent(props.children);
                  }
                  return '';
                };
                
                const text = getTextContent(children);
                const id = headingIdMap[text] || '';
                return <h1 id={id} className="!text-3xl !font-bold !text-white !mt-0 !mb-10 !leading-tight !tracking-tight">{children}</h1>;
              },
              h2: ({children}) => {
                const getTextContent = (children: React.ReactNode): string => {
                  if (typeof children === 'string') return children;
                  if (Array.isArray(children)) return children.map(getTextContent).join('');
                  if (typeof children === 'object' && children !== null) {
                    const props = (children as { props?: { children?: React.ReactNode } }).props;
                    if (props?.children) return getTextContent(props.children);
                  }
                  return '';
                };
                
                const text = getTextContent(children);
                const id = headingIdMap[text] || '';
                return <h2 id={id} className="!text-2xl !font-bold !text-white !mt-10 !mb-8 !leading-tight !tracking-tight">{children}</h2>;
              },
              h3: ({children, ...props}) => <h3 {...props} className="!text-xl !font-bold !text-white !mt-8 !mb-6 !leading-tight !tracking-tight">{children}</h3>,
              h4: ({children, ...props}) => <h4 {...props} className="!text-xl !font-bold !text-white !mt-6 !mb-4 !leading-tight !tracking-tight">{children}</h4>,
              h5: ({children, ...props}) => <h5 {...props} className="!text-lg !font-bold !text-white !mt-4 !mb-3 !leading-tight !tracking-tight">{children}</h5>,
              h6: ({children, ...props}) => <h6 {...props} className="!text-base !font-bold !text-white !mt-4 !mb-2 !leading-tight !tracking-tight">{children}</h6>,
              p: ({children, ...props}) => <p className="!mb-6 !leading-relaxed text-neutral-300" {...props}>{children}</p>,
              blockquote: ({children, ...props}) => (
                <blockquote 
                  {...props} 
                  className="!border-l-4 !border-white !pl-6 !my-6 !bg-[rgb(255,255,255,0.2)] !py-3 !leading-relaxed !text-neutral-300 !font-serif !italic [&>p]:!mb-0"
                >
                  {children}
                </blockquote>
              ),
              hr: (props) => <hr className="!my-12 !border-neutral-700" {...props} />,
            }}
          >
            {preprocessMarkdown(article.content)}
          </ReactMarkdown>
        </div>
      </article>
      
      {/* Table of Contents - Desktop */}
      <TableOfContents content={article.content} />
      
      {/* Table of Contents - Mobile */}
      <MobileTableOfContents content={article.content} />
      
      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 z-50 bg-white text-black p-3 rounded-full shadow-lg hover:bg-neutral-200 transition-all duration-300 animate-fade-in"
          style={{right: 'max(16px, env(safe-area-inset-right))'}}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
