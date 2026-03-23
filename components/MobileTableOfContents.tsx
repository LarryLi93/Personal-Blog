"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface MobileTableOfContentsProps {
  content: string;
}

interface Heading {
  text: string;
  id: string;
  level: number;
}

export const MobileTableOfContents: React.FC<MobileTableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const parseHeadings = () => {
      const lines = content.split('\n');
      const parsed: Heading[] = [];
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
            
            parsed.push({ text, id, level: hashCount });
          }
        }
      });

      setHeadings(parsed);
    };

    parseHeadings();
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -80% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="xl:hidden fixed bottom-20 right-4 z-40 bg-neutral-800 text-white p-3 rounded-full shadow-lg border border-neutral-700 hover:bg-neutral-700 transition-all duration-300"
        style={{ right: 'max(16px, env(safe-area-inset-right))' }}
        aria-label={isOpen ? 'Close table of contents' : 'Open table of contents'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile TOC Drawer */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-30">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-20 bottom-0 w-72 max-w-[80vw] bg-neutral-900 border-l border-neutral-800 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500">
                Contents
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <ul className="space-y-4">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`block text-sm transition-colors duration-200 ${
                      activeId === heading.id
                        ? 'text-white font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
