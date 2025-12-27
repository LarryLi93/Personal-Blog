import React, { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

// 添加自定义滚动条样式
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #262626;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #525252;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #737373;
  }
`;
document.head.appendChild(styleSheet);

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 解析Markdown内容中的标题并生成slug ID
  useEffect(() => {
    const parseHeadings = () => {
      const lines = content.split('\n');
      const headings: TocItem[] = [];
      const idCounts: Record<string, number> = {};
      
      lines.forEach((line) => {
        // 简单的标题匹配
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('#')) {
          const hashCount = (trimmedLine.match(/^#+/)?.[0]?.length) || 0;
          
          if (hashCount === 1 || hashCount === 2) {
            const text = trimmedLine.substring(hashCount).trim().replace(/\*\*/g, '');
            
            // 生成slug格式的ID，保留中文字符
            const baseId = text
              .toLowerCase()
              .replace(/[\s]+/g, '-') // 空格替换为短横线
              .replace(/[^\w\s-一-龯]/g, '') // 移除特殊字符，但保留中文字符 (一-龯是Unicode中文字符范围)
              .replace(/-+/g, '-') // 多个短横线合并为一个
              .replace(/^-+|-+$/g, '') // 移除开头和结尾的短横线
              .trim();
            
            // 确保ID唯一性
            const id = idCounts[baseId] ? `${baseId}-${idCounts[baseId] + 1}` : baseId;
            idCounts[baseId] = (idCounts[baseId] || 0) + 1;
            
            headings.push({
              id,
              text,
              level: hashCount
            });
          }
        }
      });
      
      setTocItems(headings);
    };

    parseHeadings();
  }, [content]);

  // 监听滚动位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // 偏移量

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const item = tocItems[i];
        const element = document.getElementById(item.id);
        
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    if (tocItems.length > 0) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // 初始化时调用一次
      
      // 延迟检查，确保DOM已渲染
      setTimeout(handleScroll, 100);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // 平滑滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 考虑固定导航栏的高度
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>


      {/* 目录导航 */}
      <div className={`
        hidden lg:block fixed z-40 bg-neutral-900/95 backdrop-blur-md 
        border border-neutral-700 rounded-xl shadow-xl
        transition-all duration-300 ease-in-out
        min-w-[12rem]
      `}
      style={{right: `20px`, top: `5.5rem`, maxHeight: `calc(100vh - 6rem)`, width: `min(70vh, 100%)`, maxWidth: `70vh`}}
      >
        {/* 标题栏 */}
        <div className="flex items-center p-4 border-b border-neutral-700">
          <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
            Structure
          </h3>
        </div>

        {/* 目录列表 */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: `calc(100vh - 8rem)` }}>
          <nav className="p-2">
            <ul className="space-y-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-all duration-200
                      hover:bg-neutral-800 hover:text-white
                      ${activeId === item.id 
                        ? 'bg-neutral-800 text-white border-white' 
                        : 'text-neutral-400'
                      }
                      ${item.level === 1 ? 'font-semibold' : ''}
                      ${item.level === 2 ? 'ml-4' : ''}
                    `}
                  >
                    <span className="whitespace-normal break-words">{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};