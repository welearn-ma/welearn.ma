import { createClient } from "@supabase/supabase-js";
import type { BlogArticle } from "@/types/blog";

const BLOG_COLUMNS =
  "slug, title, excerpt, category, content, cover_image, published_at";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPublishedArticles(): Promise<BlogArticle[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_articles")
    .select(BLOG_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blog articles:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPublishedArticleSlugs(): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_articles")
    .select("slug")
    .eq("published", true);

  if (error) {
    console.error("Failed to fetch blog article slugs:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<BlogArticle | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_articles")
    .select(BLOG_COLUMNS)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch blog article:", error.message);
    return null;
  }

  return data;
}
