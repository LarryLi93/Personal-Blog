import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { ArticleFilter } from '@/components/ArticleFilter';
import { getAllArticles, getAllCategories } from '@/lib/articles';

export default function Home() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Header />

      <main className="min-h-[calc(100vh-theme(spacing.20)-theme(spacing.24))]">
        <Hero />

        <ArticleFilter articles={articles} categories={categories} />

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
