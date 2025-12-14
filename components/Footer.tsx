import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
        <div className="mb-4 md:mb-0">
          <span className="font-serif italic text-white mr-2">Larry Li</span>
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">YouTube</a>
        </div>
      </div>
    </footer>
  );
};