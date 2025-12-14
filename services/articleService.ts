import { Article } from '../types';

const markdownFiles = import.meta.glob('../articles/*.md', {
  eager: true,
  as: 'raw'
}) as Record<string, string>;

const parseFrontmatter = (raw: string): { meta: Partial<Article>; body: string } => {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*\n?([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }

  const [, frontmatter, body] = match;
  const metaLines = frontmatter
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const meta: Record<string, string> = {};
  for (const line of metaLines) {
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) continue;
    const value = rest.join(':').trim().replace(/^"(.*)"$/, '$1');
    meta[key.trim()] = value;
  }

  return { meta, body: body.trim() };
};

const loadArticlesFromMarkdown = (): Article[] => {
  return Object.entries(markdownFiles).map(([path, raw]) => {
    const { meta, body } = parseFrontmatter(raw);

    return {
      id: meta.id ?? path,
      slug: meta.slug ?? path,
      title: meta.title ?? 'Untitled',
      excerpt: meta.excerpt ?? '',
      date: meta.date ?? '',
      author: meta.author ?? '',
      category: (meta.category as Article['category']) ?? 'Learning',
      coverImage: meta.coverImage ?? '',
      url: meta.url,
      tags: meta.tags ? meta.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      content: body
    };
  });
};

export const getArticles = async (): Promise<Article[]> => {
  const articles = loadArticlesFromMarkdown();
  return articles;
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const articles = loadArticlesFromMarkdown();
  return articles.find(article => article.slug === slug);
};