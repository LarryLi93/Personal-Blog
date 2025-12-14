import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onHomeClick, 
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onHomeClick}
          className="block relative rounded-full overflow-hidden w-10 h-10 border border-neutral-700 hover:border-neutral-500 transition-colors"
          aria-label="Home"
        >
          <img 
            src="/imgs/author.png" 
            alt="Larry Li" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </button>
      </div>
    </header>
  );
};