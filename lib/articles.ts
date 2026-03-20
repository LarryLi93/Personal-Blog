import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, Category } from '@/types';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// English stop words to remove for better SEO
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
  'dare', 'ought', 'used', 'it', 'its', 'itself', 'this', 'that', 'these',
  'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'whose', 'why', 'how',
  'where', 'when', 's', 't', 'just', 'don', 'now', 'only', 'also', 'very',
  'too', 'so', 'as', 'if', 'then', 'than', 'once', 'here', 'there', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'into', 'over', 'under', 'again', 'further', 'then', 'once'
]);

/**
 * Convert text to SEO-friendly slug
 * - Lowercase
 * - Remove stop words
 * - Replace special chars and spaces with hyphens
 * - Remove multiple consecutive hyphens
 * - Trim to max length while preserving whole words
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove punctuation except hyphens and spaces
    .replace(/[^\w\s\-]/g, '')
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Split into words, filter out stop words, rejoin
    .split('-')
    .filter(word => word.length > 0 && !STOP_WORDS.has(word))
    .join('-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Trim hyphens from ends
    .replace(/^-+|-+$/g, '');
}

/**
 * Create SEO-optimized slug from text
 * Uses smart truncation to keep within optimal length (50-60 chars)
 */
export function createSEOSlug(text: string, maxLength: number = 60): string {
  let slug = slugify(text);
  
  // If slug is already within limit, return it
  if (slug.length <= maxLength) return slug;
  
  // Smart truncation: cut at word boundary
  const truncated = slug.substring(0, maxLength);
  const lastHyphen = truncated.lastIndexOf('-');
  
  // If there's a hyphen in the last 10 chars, cut there
  if (lastHyphen > maxLength - 15 && lastHyphen > 0) {
    return truncated.substring(0, lastHyphen);
  }
  
  return truncated;
}

export function getAllArticles(): Article[] {
  // Ensure directory exists
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Use frontmatter slug directly if provided (assumed to be pre-optimized)
      // Otherwise generate from title
      const slug = data.slug 
        ? data.slug.toString().toLowerCase().trim()
        : createSEOSlug(data.title || fileName.replace(/\.md$/, ''));

      return {
        id: String(data.id || slug),
        slug: slug,
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        content: content.replace(/\.\/imgs\//g, '/imgs/'),
        date: data.date ? data.date.trim() : '',
        author: data.author || 'Larry Li',
        category: (data.category as Category) || 'Learn',
        coverImage: data.coverImage ? data.coverImage.replace(/^\.\//, '/') : '',
        tags: Array.isArray(data.tags) 
          ? data.tags 
          : typeof data.tags === 'string'
            ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [],
        url: data.url,
      };
    });

  // Sort by date (descending) or id if available
  return allArticles.sort((a, b) => {
    // If date is available, sort by date
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    // Fallback to numeric id sorting
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    
    if (!isNaN(idA) && !isNaN(idB)) {
      return idB - idA;
    }
    
    // Last fallback: string comparison
    return b.id.localeCompare(a.id);
  });
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    // ignore
  }
  
  return articles.find((article) => {
    // Exact match
    if (article.slug === slug || article.slug === decodedSlug) return true;
    
    // Check encoded version
    if (encodeURIComponent(article.slug) === slug || encodeURIComponent(article.slug) === decodedSlug) return true;
    
    // Check with encodeURIComponent on both sides
    if (encodeURIComponent(article.slug) === encodeURIComponent(slug) || 
        encodeURIComponent(article.slug) === encodeURIComponent(decodedSlug)) return true;
    
    // Fallback comparison handling special characters and spaces
    const normalize = (s: string) => s.toLowerCase().replace(/[\s\-\_]+/g, '');
    if (normalize(article.slug) === normalize(slug) || 
        normalize(article.slug) === normalize(decodedSlug)) return true;
        
    return false;
  }) || null;
}

export function getAllSlugs(): string[] {
  const articles = getAllArticles();
  return articles.map((article) => article.slug);
}

export function getAllCategories(): Category[] {
  return [
    'Learn',
    'Achieve',
    'Spirituality',
    'Model/Frame/System',
    'AI Solutions',
    'Personal Brand'
  ];
}
