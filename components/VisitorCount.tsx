"use client";

import { useState, useEffect } from 'react';

export const VisitorCount: React.FC = () => {
  const [count, setCount] = useState<number>(10012);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    const NAMESPACE = 'curiosity-blog';
    const KEY = 'visits';
    const STORAGE_KEY = 'has_visited_blog';

    // 检查是否是新访客（本地去重）
    const hasVisited = localStorage.getItem(STORAGE_KEY);
    
    // 获取当前计数
    fetch(`https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.value) {
          setCount(data.value);
        }
      })
      .catch(() => {
        // API 失败时使用默认值
        setCount(10012);
      });

    // 如果是新访客，增加计数
    if (!hasVisited) {
      fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.value) {
            setCount(data.value);
            setIsNewVisitor(true);
          }
        })
        .catch(console.error);
      
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, []);

  return (
    <span className="text-neutral-500 text-sm">
      (with {count.toLocaleString()} Peoples)
      {isNewVisitor && (
        <span className="ml-2 text-xs text-green-500 animate-pulse">+1</span>
      )}
    </span>
  );
};
