"use client";

import React, { useState, useEffect } from 'react';
import { initializeVisitCount, subscribeToVisitCount } from '@/lib/globalVisitService';

export const Hero: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const initAndSubscribe = async () => {
      try {
        await initializeVisitCount();
      } catch (error) {
        console.error('Failed to initialize visit count:', error);
        setVisitCount(10012);
      }
    };
    
    initAndSubscribe();
    
    const unsubscribe = subscribeToVisitCount((count) => {
      setVisitCount(count);
    });
    
    return unsubscribe;
  }, []);

  return (
    <section className="pt-24 pb-16 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xs tracking-[0.2em] uppercase">
          Larry Li
        </h2>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]" style={{ lineHeight: '1.2' }}>
          Beyond The Walls. Into The Wildness.
        </h1>
        <p className="text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light">
          Deep dives on Human Growth. Spiritual Insight. Rational Wisdom & Independent Income.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white/10 transition-all duration-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-base font-medium text-neutral-300">
              {visitCount !== null ? (
                <span>
                  <strong className="text-white font-bold">{visitCount.toLocaleString()}</strong> explorers joined the journey
                </span>
              ) : (
                'Loading...'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
