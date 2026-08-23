import { PublicPageView } from './CmsContext';

export interface RouteMatch {
  view: PublicPageView;
  articleIdOrSlug: string | null;
  bookId: string | null;
  blogId: string | null;
  lokgeetId: string | null;
  shabdkoshId: string | null;
  paheliId: string | null;
  memberId: string | null;
  issueId: string | null;
  tab: string | null;
  isNotFound: boolean;
}

const DOMAIN_URL = 'https://pawari-shodh-patrika.vercel.app';

export function getCanonicalUrl(path = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${DOMAIN_URL}${cleanPath}`;
}

export function getUrlForBook(bookId: string): string {
  return `/book/${bookId}`;
}

export function getUrlForBlog(blogId: string): string {
  return `/blog/${blogId}`;
}

export function getUrlForLokgeet(lokgeetId: string): string {
  return `/lokgeet/${lokgeetId}`;
}

export function getUrlForShabdkosh(shabdkoshId: string): string {
  return `/shabdkosh/${shabdkoshId}`;
}

export function getUrlForPaheli(paheliId: string): string {
  return `/paheli/${paheliId}`;
}

export function getUrlForMember(memberId: string): string {
  return `/editorial-board/${memberId}`;
}

/**
 * Parse current window location pathname and search params into structured route match
 */
export function parseRouteFromUrl(): RouteMatch {
  try {
    const pathname = window.location.pathname.replace(/\/+/g, '/').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    // Check query params / hash fallbacks first for legacy deep links
    const articleParam = searchParams.get('article') || searchParams.get('paper') || searchParams.get('id');
    if (articleParam && (pathname === '/' || pathname.includes('article'))) {
      return { view: 'article_detail', articleIdOrSlug: articleParam, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (hash.startsWith('#/article/')) {
      const targetId = hash.replace('#/article/', '').split('?')[0];
      if (targetId) return { view: 'article_detail', articleIdOrSlug: targetId, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    // 1. Separate Book Canonical Path: /book/:id or /books-literature?book=:id
    if (pathname.startsWith('/book/')) {
      const bookId = pathname.replace('/book/', '').trim();
      return { view: 'books_blogs', articleIdOrSlug: null, bookId, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'books', isNotFound: false };
    }
    const bookParam = searchParams.get('book');
    if (bookParam) {
      return { view: 'books_blogs', articleIdOrSlug: null, bookId: bookParam, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'books', isNotFound: false };
    }

    // 2. Separate Blog Canonical Path: /blog/:id or /books-literature?blog=:id
    if (pathname.startsWith('/blog/')) {
      const blogId = pathname.replace('/blog/', '').trim();
      return { view: 'books_blogs', articleIdOrSlug: null, bookId: null, blogId, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'blogs', isNotFound: false };
    }
    const blogParam = searchParams.get('blog');
    if (blogParam) {
      return { view: 'books_blogs', articleIdOrSlug: null, bookId: null, blogId: blogParam, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'blogs', isNotFound: false };
    }

    // 3. Separate Lokgeet Canonical Path: /lokgeet/:id or /lokgeet?id=:id
    if (pathname.startsWith('/lokgeet/')) {
      const lokgeetId = pathname.replace('/lokgeet/', '').trim();
      return { view: 'pawari_lokgeet', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'lokgeet', isNotFound: false };
    }
    const lokgeetParam = searchParams.get('lokgeet') || (pathname === '/lokgeet' ? searchParams.get('id') : null);
    if (lokgeetParam) {
      return { view: 'pawari_lokgeet', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: lokgeetParam, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'lokgeet', isNotFound: false };
    }

    // 4. Separate Shabdkosh Canonical Path: /shabdkosh/:id or /shabdkosh?id=:id
    if (pathname.startsWith('/shabdkosh/')) {
      const shabdkoshId = pathname.replace('/shabdkosh/', '').trim();
      return { view: 'pawari_shabdkosh', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId, paheliId: null, memberId: null, issueId: null, tab: 'shabdkosh', isNotFound: false };
    }
    const shabdkoshParam = searchParams.get('shabdkosh') || (pathname === '/shabdkosh' ? searchParams.get('id') : null);
    if (shabdkoshParam) {
      return { view: 'pawari_shabdkosh', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: shabdkoshParam, paheliId: null, memberId: null, issueId: null, tab: 'shabdkosh', isNotFound: false };
    }

    // 5. Separate Paheli Canonical Path: /paheli/:id or /paheli?id=:id
    if (pathname.startsWith('/paheli/')) {
      const paheliId = pathname.replace('/paheli/', '').trim();
      return { view: 'pawari_paheli', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId, memberId: null, issueId: null, tab: 'paheli', isNotFound: false };
    }
    const paheliParam = searchParams.get('paheli') || (pathname === '/paheli' ? searchParams.get('id') : null);
    if (paheliParam) {
      return { view: 'pawari_paheli', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: paheliParam, memberId: null, issueId: null, tab: 'paheli', isNotFound: false };
    }

    // 6. Separate Sahityakar / Member Canonical Path: /editorial-board/:id or /editorial-board?member=:id
    if (pathname.startsWith('/editorial-board/')) {
      const memberId = pathname.replace('/editorial-board/', '').trim();
      if (memberId && memberId !== 'board') {
        return { view: 'editorial_board', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId, issueId: null, tab: null, isNotFound: false };
      }
    }
    const memberParam = searchParams.get('member') || searchParams.get('editor') || searchParams.get('sahityakar');
    if (memberParam) {
      return { view: 'editorial_board', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: memberParam, issueId: null, tab: null, isNotFound: false };
    }

    // Exact or prefix path matching
    if (pathname === '/' || pathname === '/home') {
      return { view: 'home', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/about' || pathname === '/about-us') {
      return { view: 'about', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/current-issue' || pathname === '/current') {
      return { view: 'current_issue', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/archives' || pathname === '/archive') {
      const issueId = searchParams.get('issue');
      return { view: 'archive', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId, tab: null, isNotFound: false };
    }

    if (pathname.startsWith('/issue/')) {
      const issueId = pathname.replace('/issue/', '').trim();
      return { view: 'archive', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: issueId || null, tab: null, isNotFound: false };
    }

    if (pathname === '/articles' || pathname === '/books-literature' || pathname === '/books-blogs' || pathname === '/writers' || pathname === '/authors' || pathname === '/literature') {
      const tab = searchParams.get('tab') || null;
      return { view: 'books_blogs', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab, isNotFound: false };
    }

    if (pathname === '/shabdkosh' || pathname === '/pawari-shabdkosh') {
      return { view: 'pawari_shabdkosh', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'shabdkosh', isNotFound: false };
    }

    if (pathname === '/paheli' || pathname === '/pawari-paheli') {
      return { view: 'pawari_paheli', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'paheli', isNotFound: false };
    }

    if (pathname === '/lokgeet' || pathname === '/pawari-lokgeet') {
      return { view: 'pawari_lokgeet', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'lokgeet', isNotFound: false };
    }

    if (pathname === '/quiz' || pathname === '/pawari-quiz') {
      return { view: 'pawari_quiz', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: 'quiz', isNotFound: false };
    }

    if (pathname.startsWith('/article/') || pathname.startsWith('/articles/')) {
      const slugOrId = pathname.replace(/^\/articles?\//, '').trim();
      if (slugOrId) {
        return { view: 'article_detail', articleIdOrSlug: slugOrId, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
      }
    }

    if (pathname === '/editorial-board' || pathname === '/editorial_board') {
      return { view: 'editorial_board', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/author-guidelines' || pathname === '/author_guidelines') {
      return { view: 'author_guidelines', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/submit-manuscript' || pathname === '/submit_manuscript') {
      return { view: 'submit_manuscript', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/contact' || pathname === '/contact-us') {
      return { view: 'contact', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return { view: 'admin', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
    }

    // Unmatched path -> 404 Not Found
    return { view: 'home', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: true };
  } catch (e) {
    return { view: 'home', articleIdOrSlug: null, bookId: null, blogId: null, lokgeetId: null, shabdkoshId: null, paheliId: null, memberId: null, issueId: null, tab: null, isNotFound: false };
  }
}

/**
 * Generates clean canonical URL path for a view
 */
export function getUrlForView(view: PublicPageView, articleIdOrSlug?: string | null, issueId?: string | null): string {
  switch (view) {
    case 'home': return '/';
    case 'about': return '/about';
    case 'current_issue': return '/current-issue';
    case 'archive': return issueId ? `/issue/${issueId}` : '/archives';
    case 'articles':
    case 'books_blogs': return '/books-literature';
    case 'pawari_shabdkosh': return '/shabdkosh';
    case 'pawari_paheli': return '/paheli';
    case 'pawari_lokgeet': return '/lokgeet';
    case 'pawari_quiz': return '/quiz';
    case 'article_detail': return articleIdOrSlug ? `/articles/${articleIdOrSlug}` : '/current-issue';
    case 'editorial_board': return '/editorial-board';
    case 'author_guidelines': return '/author-guidelines';
    case 'submit_manuscript': return '/submit-manuscript';
    case 'contact': return '/contact';
    case 'admin': return '/admin';
    default: return '/';
  }
}

/**
 * Programmatically updates window location using History API
 */
export function navigateTo(view: PublicPageView, articleIdOrSlug?: string | null, issueId?: string | null) {
  const targetUrl = getUrlForView(view, articleIdOrSlug, issueId);
  if (window.location.pathname !== targetUrl) {
    window.history.pushState({ view, articleIdOrSlug, issueId }, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
  }
}
