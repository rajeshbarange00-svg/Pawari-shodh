import { Article } from '../types';
import { BookItem, BlogItem } from '../data/booksBlogsData';

/**
 * Deduplicate articles array ensuring strictly unique IDs and slugs across all datasets.
 * Merges richer fields when duplicate references are found.
 */
export function deduplicateArticles(items: (Article | null | undefined)[]): Article[] {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const result: Article[] = [];

  for (const art of items) {
    if (!art) continue;
    const effId = String(art.id || '').trim();
    const effSlug = String(art.slug || '').trim();

    if (!effId && !effSlug) continue;

    const hasSeenId = effId ? seenIds.has(effId) : false;
    const hasSeenSlug = effSlug ? seenSlugs.has(effSlug) : false;

    if (hasSeenId || hasSeenSlug) {
      // Find existing entry and merge richer data
      const existingIdx = result.findIndex(a => 
        (effId && a.id === effId) || (effSlug && a.slug === effSlug)
      );
      if (existingIdx !== -1) {
        const existing = result[existingIdx];
        result[existingIdx] = {
          ...art,
          ...existing,
          // Preserve whichever field has valuable data
          id: existing.id || effId,
          slug: existing.slug || effSlug,
          title_hindi: existing.title_hindi || art.title_hindi,
          title_english: existing.title_english || art.title_english,
          pdf_url: existing.pdf_url || art.pdf_url,
          pdf_storage_path: existing.pdf_storage_path || art.pdf_storage_path,
          full_text_introduction: existing.full_text_introduction || art.full_text_introduction,
          content_mode: existing.content_mode || art.content_mode,
          authors: (existing.authors && existing.authors.length > 0) ? existing.authors : art.authors,
          views_count: Math.max(existing.views_count || 0, art.views_count || 0),
          downloads_count: Math.max(existing.downloads_count || 0, art.downloads_count || 0),
          revisions_history: existing.revisions_history?.length ? existing.revisions_history : art.revisions_history
        };
      }
      continue;
    }

    if (effId) seenIds.add(effId);
    if (effSlug) seenSlugs.add(effSlug);
    result.push(art);
  }

  return result;
}

/**
 * Generic deduplication for list entities by unique ID or fallback key
 */
export function deduplicateById<T extends { id?: string; slug?: string }>(items: (T | null | undefined)[]): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (!item) continue;
    const key = String(item.id || item.slug || '').trim();
    if (!key) continue;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

