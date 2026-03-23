/**
 * Site configuration for SEO and meta data
 * Values are read from environment variables with fallbacks
 */

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.islarryli.com',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'LarryLi Blog',
  description: 'Exploring ideas on learning, achievement, spirituality, and AI solutions.',
  author: 'Larry Li',
  twitter: '@larryli', // Update with actual handle
  locale: 'en-US',
};

/**
 * Generate canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ''): string {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * SEO defaults for different page types
 */
export const seoDefaults = {
  article: {
    type: 'article' as const,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  },
  page: {
    type: 'website' as const,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  home: {
    type: 'website' as const,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  },
};
