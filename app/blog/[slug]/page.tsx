import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { ArticleView } from '@/components/ArticleView';
import { Footer } from '@/components/Footer';
import { ArticleSchema } from '@/components/ArticleSchema';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { siteConfig, getCanonicalUrl } from '@/lib/config';

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

  return (
    <>
      <ArticleSchema article={article} url={canonicalUrl} />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
        <Header showBackButton={true} backHref="/" />

        <main className="min-h-[calc(100vh-theme(spacing.20)-theme(spacing.24))]">
          <ArticleView article={article} />
        </main>

        <Footer />
      </div>
    </>
  );
}
