import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Article } from '../types';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import remarkBreaks from 'remark-breaks';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  // 生成唯一标题ID的映射
  const [headingIdMap, setHeadingIdMap] = React.useState<Record<string, string>>({});
  // 控制返回顶部按钮的可见性
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  // 屏幕宽度状态，用于动态计算位置
  const [screenWidth, setScreenWidth] = React.useState<number>(window.innerWidth);

  // 监听滚动事件，控制返回顶部按钮的显示/隐藏
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 监听窗口大小变化，更新屏幕宽度
  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 返回顶部函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 预处理Markdown内容，修复中英文段落分割问题
  const preprocessMarkdown = (content: string) => {
    // 将双空格+换行替换为真正的段落分隔
    let processedContent = content.replace(/([^\s])\s\s\n/g, '$1\n\n');
    
    // 确保标题前后有适当的换行，以便正确解析
    processedContent = processedContent.replace(/(\n|^)(#+ .+)/g, '\n$2\n');

    return processedContent;
  };

  // 解析Markdown内容中的标题并生成唯一ID映射
  React.useEffect(() => {
    const parseHeadings = () => {
      const lines = article.content.split('\n');
      const headingMap: Record<string, string> = {};
      const idCounts: Record<string, number> = {};
      
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('#')) {
          const hashCount = (trimmedLine.match(/^#+/)?.[0]?.length) || 0;
          
          if (hashCount === 1 || hashCount === 2) {
            // 与TableOfContents组件保持一致的处理方式
            const text = trimmedLine.substring(hashCount).trim().replace(/\*\*/g, '');
            
            // 生成与TableOfContents组件一致的ID
            const baseId = text
              .toLowerCase()
              .replace(/[\s]+/g, '-')
              .replace(/[^\w\s-一-龯]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')
              .trim();
            
            // 确保ID唯一性
            const id = idCounts[baseId] ? `${baseId}-${idCounts[baseId] + 1}` : baseId;
            idCounts[baseId] = (idCounts[baseId] || 0) + 1;
            
            headingMap[text] = id;
          }
        }
      });
      
      setHeadingIdMap(headingMap);
    };

    parseHeadings();
  }, [article.content]);

  return (
    <div className="animate-fade-in pb-20">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="group flex items-center text-neutral-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>
      </div>

      <article className="max-w-3xl mx-auto px-6">
        {/* Article Header */}
        <header className="mb-12 text-center pt-8">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold tracking-widest text-neutral-500 uppercase mb-6">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight break-words">
            {article.title}
          </h1>
          
          <p className="text-xl text-neutral-400 font-light leading-relaxed mb-8">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
            <span className="px-3 py-1 bg-neutral-800 rounded-full">#{article.category}</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="mb-12">
            <div className="aspect-video overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800">
              <img 
                src={article.coverImage} 
                alt={article.title}
                loading="lazy"
                decoding="async"
                sizes="100px"
                className="w-full h-full object-cover grayscale opacity-90"
              />
            </div>
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-headings:mb-8
            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6
            prose-a:text-white prose-a:underline prose-a:decoration-neutral-600 prose-a:underline-offset-4 hover:prose-a:decoration-white
            prose-blockquote:border-l-white prose-blockquote:text-neutral-400 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:my-6
            prose-strong:text-white prose-strong:font-bold
            prose-li:text-neutral-300
            prose-img:rounded-sm prose-img:grayscale prose-img:hover:grayscale-0 prose-img:transition-all
            prose-code:text-pink-400 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded
            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
            prose-table:border-neutral-700 prose-th:border-neutral-700 prose-td:border-neutral-700
            space-y-6">
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]} // 使用插件
            components={{
              h1: ({node, children, ...props}) => {
                // 提取纯文本内容用于ID查找
                const getTextContent = (children: React.ReactNode): string => {
                  if (typeof children === 'string') return children;
                  if (Array.isArray(children)) return children.map(getTextContent).join('');
                  if (typeof children === 'object' && children !== null) {
                    // @ts-ignore
                    if (children.props && children.props.children) {
                      // @ts-ignore
                      return getTextContent(children.props.children);
                    }
                  }
                  return '';
                };
                
                // 使用预生成的唯一ID
                const text = getTextContent(children);
                const id = headingIdMap[text] || '';
                return <h1 id={id} {...props} className="!text-3xl !font-bold !text-white !mt-0 !mb-10 !leading-tight !tracking-tight">{children}</h1>;
              },
              h2: ({node, children, ...props}) => {
                // 提取纯文本内容用于ID查找
                const getTextContent = (children: React.ReactNode): string => {
                  if (typeof children === 'string') return children;
                  if (Array.isArray(children)) return children.map(getTextContent).join('');
                  if (typeof children === 'object' && children !== null) {
                    // @ts-ignore
                    if (children.props && children.props.children) {
                      // @ts-ignore
                      return getTextContent(children.props.children);
                    }
                  }
                  return '';
                };
                
                // 使用预生成的唯一ID
                const text = getTextContent(children);
                const id = headingIdMap[text] || '';
                return <h2 id={id} {...props} className="!text-2xl !font-bold !text-white !mt-10 !mb-8 !leading-tight !tracking-tight">{children}</h2>;
              },
              h3: ({node, children, ...props}) => {
                return <h3 {...props} className="!text-xl !font-bold !text-white !mt-8 !mb-6 !leading-tight !tracking-tight">{children}</h3>;
              },
              h4: ({node, children, ...props}) => {
                return <h4 {...props} className="!text-xl !font-bold !text-white !mt-6 !mb-4 !leading-tight !tracking-tight">{children}</h4>;
              },
              h5: ({node, children, ...props}) => {
                return <h5 {...props} className="!text-lg !font-bold !text-white !mt-4 !mb-3 !leading-tight !tracking-tight">{children}</h5>;
              },
              h6: ({node, children, ...props}) => {
                return <h6 {...props} className="!text-base !font-bold !text-white !mt-4 !mb-2 !leading-tight !tracking-tight">{children}</h6>;
              },
              p: ({node, children, ...props}) => <p className="!mb-6 !leading-relaxed text-neutral-300" {...props}>{children}</p>,
              blockquote: ({node, children, ...props}) => {
                return (
                  <blockquote 
                    {...props} 
                    className="!border-l-4 !border-white !pl-6 !my-6 !bg-[rgb(255,255,255,0.2)] !py-3 !leading-relaxed !text-neutral-300 !font-serif !italic [&>p]:!mb-0"
                  >
                    {children}
                  </blockquote>
                );
              },
              hr: ({node, ...props}) => <hr className="!my-12 !border-neutral-700" {...props} />,
            }}
          >
            {preprocessMarkdown(article.content)}
          </ReactMarkdown>
        </div>
      </article>
      
      {/* 目录导航 */}
      <TableOfContents content={article.content} />
      
      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 z-50 bg-white text-black p-3 rounded-full shadow-lg hover:bg-neutral-200 transition-all duration-300 animate-fade-in"
          style={{right: `20px`}}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};