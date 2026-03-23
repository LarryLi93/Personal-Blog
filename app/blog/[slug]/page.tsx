import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { ArticleView } from '@/components/ArticleView';
import { Footer } from '@/components/Footer';
import { ArticleSchema } from '@/components/ArticleSchema';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { siteConfig, getCanonicalUrl } from '@/lib/config';

// 计算文章字数（排除 Markdown 标记）
function calculateWordCount(content: string): number {
  // 移除 Markdown 标记
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*|\*|__|_|~~|`/g, '') // 移除粗体、斜体、删除线、代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 将链接转换为文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`([^`]+)`/g, '$1') // 将行内代码转换为文本
    .replace(/>\s/g, '') // 移除引用标记
    .replace(/-\s|\*\s|\+\s/g, '') // 移除列表标记
    .replace(/\|/g, '') // 移除表格分隔符
    .replace(/---|___|\*\*\*/g, '') // 移除分隔线
    .replace(/\s+/g, ''); // 移除所有空白字符
  
  // 统计字符数（适用于中英文混合）
  return cleanContent.length;
}

interface Props {
  params: { slug: string };
}

// Generate static params for all articles
export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  let article = null;
  try {
    article = getArticleBySlug(slug) || getArticleBySlug(decodeURIComponent(slug));
  } catch (e) {
    article = getArticleBySlug(slug);
  }

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | ${siteConfig.name}`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    keywords: article.tags || [article.category],
    alternates: {
      canonical: getCanonicalUrl(`/blog/${slug}`),
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = params;
  
  // Try finding article directly or with decoding
  let article = null;
  try {
    article = getArticleBySlug(slug) || getArticleBySlug(decodeURIComponent(slug));
  } catch (e) {
    article = getArticleBySlug(slug);
  }

  if (!article) {
    // Also try checking against all articles explicitly
    const articles = getAllArticles();
    article = articles.find(a => encodeURIComponent(a.slug) === slug || a.slug === slug);
    if (!article) {
      notFound();
    }
  }

  const canonicalUrl = getCanonicalUrl(`/blog/${slug}`);
  const wordCount = calculateWordCount(article.content);

  return (
    <>
      <ArticleSchema article={article} url={canonicalUrl} />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
        <Header showBackButton={true} backHref="/" wordCount={wordCount} />

        <main className="min-h-[calc(100vh-theme(spacing.20)-theme(spacing.24))]">
          <ArticleView article={article} />
        </main>

        <Footer />
      </div>
    </>
  );
}
