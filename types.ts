export type Category =
  | 'Learn'
  | 'Achieve'
  | 'Spirituality'
  | 'Model/Frame/System'
  | 'AI Solutions'
  | 'Personal Brand';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  coverImage: string;
  date: string;
  author: string;
  category: Category;
  tags?: string[];
  url?: string;
}

export type ViewMode = 'list' | 'detail';