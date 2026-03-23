"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  wordCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false,
  backHref = "/",
  wordCount,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center relative">
        
        {/* Left: Back Button */}
        <div className="flex-shrink-0">
          {showBackButton && (
            <Link 
              href={backHref}
              className="group inline-flex items-center text-neutral-400 hover:text-white transition-colors text-xs sm:text-sm font-medium px-2 sm:px-3 py-2 border border-neutral-700 rounded-lg hover:border-white/30 hover:bg-neutral-800/50"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          )}
        </div>
        
        {/* Center: Logo (绝对居中) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link 
            href="/"
            className="block relative rounded-full overflow-hidden w-10 h-10 border border-neutral-700 hover:border-neutral-500 transition-colors"
            aria-label="Home"
          >
            <img 
              src="/imgs/author.png" 
              alt="Larry Li" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          </Link>
        </div>
        
        {/* Right: Word Count */}
        <div className="flex-shrink-0 ml-auto">
          {wordCount !== undefined && wordCount > 0 && (
            <div className="flex items-center text-neutral-400 text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 border border-neutral-700 rounded-lg bg-neutral-900/50">
              <FileText className="w-4 h-4 mr-1 sm:mr-2" />
              <span>{wordCount.toLocaleString()} <span className="hidden sm:inline">Words</span></span>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};
