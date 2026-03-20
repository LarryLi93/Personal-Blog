import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { siteConfig, seoDefaults } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  
  // Get all articles
  const articles = getAllArticles();
  
  // Article pages
  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}/`,
    lastModified: new Date(article.date || Date.now()),
    changeFrequency: seoDefaults.article.changeFrequency,
    priority: seoDefaults.article.priority,
  }));

  // Static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: seoDefaults.home.changeFrequency,
      priority: seoDefaults.home.priority,
    },
  ];

  return [...staticUrls, ...articleUrls];
}
