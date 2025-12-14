import React from 'react';
import { Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-neutral-900 bg-black">
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">
          About Me
        </h3>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Who Is Larry Li?
        </h2>
        <p className="text-neutral-400 text-lg font-light">
          Just a human being who wants to explore human existence.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
        <div className="flex-shrink-0 flex flex-col items-center space-y-6">
          <div className="w-64 h-64 rounded-full overflow-hidden border border-neutral-800">
            <img 
              src="/imgs/author.png" 
              alt="Larry Li" 
              className="w-full h-full object-cover grayscale contrast-110"
            />
          </div>
          <div className="flex gap-6 text-neutral-400">
             <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
             <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
             <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
             <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="flex-1 space-y-6 text-neutral-300 leading-relaxed font-light text-center md:text-left text-lg">
          <h3 className="text-3xl font-bold text-white tracking-tight">Hey, I'm Larry.</h3>
          <p>
              As a full-time AI product expert, with a passion for digital creation and writing, I am fascinated by the convergence of AI, spirituality, execution, and human potential. 
          </p>
          <p>
              Previously, I built scalable systems for Fortune 500 companies. Now, I write about software architecture, productivity, and how to create meaningful, in-depth articles as well as knowledge-based paid products (spanning software, hardware, and handcrafted goods) in the digital age.          </p>
          <p className="font-medium text-white pt-2">
             For those wondering, I am not accepting calls or consulting work at the moment. If you'd like to learn from me, just read the articles above.
          </p>
        </div>
      </div>
    </section>
  );
};