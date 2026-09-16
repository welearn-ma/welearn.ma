export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  content: string;
  cover_image: string | null;
  published_at: string;
};
