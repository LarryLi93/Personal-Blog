"use client";

import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="px-6 py-24 border-t border-neutral-800">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-2xl font-bold text-white">About</h2>
        <p className="text-neutral-400 leading-relaxed">
          Exploring the intersection of personal growth, rational thinking, and creative independence. 
          This blog documents my journey to understand the world and myself better.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="text-neutral-500 hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="text-neutral-500 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="text-neutral-500 hover:text-white transition-colors">
            Email
          </a>
        </div>
      </div>
    </section>
  );
};
