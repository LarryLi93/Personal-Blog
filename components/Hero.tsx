import React, { useState, useEffect } from 'react';
import { initializeVisitCount, subscribeToVisitCount } from '../services/globalVisitService';

export const Hero: React.FC = () => {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // 初始化访问计数并订阅计数变化
    const initAndSubscribe = async () => {
      try {
        // 确保访问计数已初始化
        await initializeVisitCount();
      } catch (error) {
        console.error('Failed to initialize visit count:', error);
        setVisitCount(0);
      }
    };
    
    initAndSubscribe();
    
    // 订阅访问人数变化
    const unsubscribe = subscribeToVisitCount((count) => {
      setVisitCount(count);
    });
    
    // 清理函数
    return unsubscribe;
  }, []);

  return (
    <section className="pt-24 pb-16 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xs tracking-[0.2em] uppercase">
          Larry Li
        </h2>
        <h1 className="text-5xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.1]" style={{ lineHeight: '1.2' }}>
          Fail Less.Achieve More.Enjoy Life. <br />
          {visitCount !== null ? `（with ${visitCount.toLocaleString()} Peoples）` : '（with 0 Peoples）'}
        </h1>
        <p className="text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light">
          Deep dives on Human Growth. Spiritual Insight. Rational Wisdom & Independent Income.
        </p>
      </div>
    </section>
  );
};