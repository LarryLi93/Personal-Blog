"use client";

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="px-6 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-neutral-500">
          © {currentYear} Larry Li. All rights reserved.
        </p>
        <p className="text-sm text-neutral-600">
          Built with curiosity and caffeine.
        </p>
      </div>
    </footer>
  );
};
