/**
 * Utility functions for generating, normalizing, and handling canonical slugs.
 */

export function createSlug(title: string, fallbackId: string = ''): string {
  if (!title || title.trim() === '') {
    return fallbackId ? `item-${fallbackId}` : `item-${Date.now()}`;
  }

  // Clean whitespace and special punctuation
  let slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F-]/g, '') // Keep alphanumeric, Devanagari, spaces, hyphens
    .replace(/[\s_]+/g, '-')              // Convert spaces and underscores to hyphens
    .replace(/-+/g, '-')                  // Collapse multiple consecutive hyphens
    .replace(/^-+|-+$/g, '');             // Trim leading/trailing hyphens

  if (!slug || slug.trim() === '') {
    slug = fallbackId ? `item-${fallbackId}` : `item-${Date.now()}`;
  }
  return slug;
}

import { Article } from '../types';

export function findGenericItem<T extends Record<string, any>>(
  items: T[], 
  identifier: string | null, 
  extraFields: string[] = []
): T | null {
  if (!identifier) return null;
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}

  if (!cleanId) return null;

  // 1. Direct ID match
  let found = items.find(item => item.id && String(item.id).toLowerCase() === cleanId);
  if (found) return found;

  // 2. Direct Slug match
  found = items.find(item => item.slug && String(item.slug).toLowerCase() === cleanId);
  if (found) return found;

  // 3. Prefixed/suffixed ID match (e.g. "book-xyz", "blog-xyz", "writer-xyz", "art-xyz")
  found = items.find(item => {
    if (!item.id) return false;
    const lowerId = String(item.id).toLowerCase();
    return lowerId.endsWith(`-${cleanId}`) || lowerId === `item-${cleanId}` || lowerId === `art-${cleanId}`;
  });
  if (found) return found;

  // 4. Normalized slugified title/name field match
  const targetSlug = createSlug(cleanId);
  found = items.find(item => {
    if (item.slug && createSlug(String(item.slug)) === targetSlug) return true;

    const candidateValues = [
      item.title,
      item.title_hindi,
      item.title_english,
      item.name,
      item.name_hindi,
      item.name_english,
      item.word_pawari,
      item.riddle_pawari,
      item.song_title_pawari,
      ...extraFields.map(f => item[f])
    ].filter(Boolean);

    return candidateValues.some(val => createSlug(String(val)) === targetSlug);
  });
  if (found) return found;

  // 5. Prefix/substring search on ID or slug for longer identifiers (>= 6 chars)
  if (cleanId.length >= 6) {
    found = items.find(item => {
      const lowerId = item.id ? String(item.id).toLowerCase() : '';
      const lowerSlug = item.slug ? String(item.slug).toLowerCase() : '';
      return lowerId.startsWith(cleanId) || lowerSlug.startsWith(cleanId) || cleanId.startsWith(lowerSlug);
    });
  }

  return found || null;
}

export function findArticle(articles: Article[], identifier: string | null): Article | null {
  if (!identifier) return null;
  const legacyMap: Record<string, string> = {
    '1': articles[0]?.id || '',
    '2': articles[1]?.id || '',
    '3': articles[2]?.id || '',
    'art-1': articles[0]?.id || '',
    'art-2': articles[1]?.id || '',
    'vol-1-issue-1-art-1': articles[0]?.id || ''
  };
  let cleanId = identifier.trim().toLowerCase();
  try {
    cleanId = decodeURIComponent(cleanId).trim().toLowerCase();
  } catch (e) {}

  if (legacyMap[cleanId]) {
    const legacyFound = articles.find(a => a.id === legacyMap[cleanId]);
    if (legacyFound) return legacyFound;
  }

  return findGenericItem(articles, identifier, ['abstract_hindi', 'abstract_english']);
}

export function findBook<T extends Record<string, any>>(books: T[], identifier: string | null): T | null {
  return findGenericItem(books, identifier, ['author_name', 'publisher']);
}

export function findBlog<T extends Record<string, any>>(blogs: T[], identifier: string | null): T | null {
  return findGenericItem(blogs, identifier, ['author_name', 'category']);
}

export function findWriter<T extends Record<string, any>>(writers: T[], identifier: string | null): T | null {
  return findGenericItem(writers, identifier, ['author_id', 'pen_name']);
}

export function findLokgeet<T extends Record<string, any>>(lokgeet: T[], identifier: string | null): T | null {
  return findGenericItem(lokgeet, identifier, ['song_title_pawari', 'category']);
}

export function findPaheli<T extends Record<string, any>>(paheli: T[], identifier: string | null): T | null {
  return findGenericItem(paheli, identifier, ['riddle_pawari', 'answer_hindi']);
}

export function findShabdkosh<T extends Record<string, any>>(shabdkosh: T[], identifier: string | null): T | null {
  return findGenericItem(shabdkosh, identifier, ['word_pawari', 'meaning_hindi']);
}

export function ensureUniqueSlug(
  title: string, 
  fallbackId: string = '', 
  itemsListOrSlugs: Array<{ id: string; slug?: string }> | string[] = [], 
  currentSlug: string = ''
): string {
  let baseSlug = createSlug(title, fallbackId);
  let uniqueSlug = baseSlug;
  let counter = 1;

  let existingSlugs: string[] = [];
  if (Array.isArray(itemsListOrSlugs)) {
    if (itemsListOrSlugs.length > 0 && typeof itemsListOrSlugs[0] === 'string') {
      existingSlugs = itemsListOrSlugs as string[];
    } else {
      existingSlugs = (itemsListOrSlugs as Array<{ id: string; slug?: string }>)
        .filter(item => item.id !== fallbackId)
        .map(item => item.slug)
        .filter(Boolean) as string[];
    }
  }

  if (currentSlug) {
    existingSlugs = existingSlugs.filter(s => s !== currentSlug);
  }

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

