#!/usr/bin/env node
/**
 * Seeds blog_articles from the Markdown files in ../articles/.
 *
 * Requires @supabase/supabase-js (already used elsewhere in this stack).
 * Run once, locally, never in a client-side or public context:
 *
 *   SUPABASE_URL=https://<project-ref>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role key> \
 *   node scripts/seed-blog-articles.mjs
 *
 * IMPORTANT: SUPABASE_SERVICE_ROLE_KEY bypasses RLS. Keep it in your local
 * shell / .env (gitignored) only — never in .env.local files that get
 * bundled client-side, never committed, never used from a browser context.
 * This is exactly the class of mistake behind the still-open service_role
 * exposure on ConstHunting — don't repeat it here.
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, '..', 'articles');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/** Minimal frontmatter parser — good enough for our flat, single-line fields. */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter block found');
  const [, fmBlock, body] = match;

  const data = {};
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^(\w+):\s*"(.*)"\s*$/);
    if (!m) continue;
    const [, key, value] = m;
    data[key] = value.replace(/\\"/g, '"');
  }
  return { data, body: body.trim() };
}

async function main() {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
  console.log(`Found ${files.length} article files in ${ARTICLES_DIR}`);

  const rows = files.map((file) => {
    const raw = readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { data, body } = parseFrontmatter(raw);
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      content: body,
      cover_image: data.coverImage,
      published: true,
      published_at: data.date,
    };
  });

  const { data: inserted, error } = await supabase
    .from('blog_articles')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug, title');

  if (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }

  console.log(`Upserted ${inserted.length} articles:`);
  for (const row of inserted) console.log(`  - ${row.slug}`);
}

main();
