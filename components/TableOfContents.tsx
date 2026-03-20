"use client";

import React, { useState, useEffect } from 'react';

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  text: string;
  id: string;
  level: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
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
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-64 max-h-[70vh] overflow-y-auto">
      <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">
        Contents
      </div>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block text-sm transition-colors duration-200 ${
                activeId === heading.id
                  ? 'text-white font-medium'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
