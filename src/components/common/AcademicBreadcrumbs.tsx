import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';

export interface BreadcrumbItem {
  label: string;
  labelEn?: string;
  view?: PublicPageView;
  articleIdOrSlug?: string | null;
  issueId?: string | null;
  bookId?: string | null;
  blogId?: string | null;
  itemSlugOrId?: string | null;
  writerId?: string | null;
  tab?: string | null;
  href?: string;
  onClick?: () => void;
}

interface AcademicBreadcrumbsProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  compactOnMobile?: boolean;
}

export const AcademicBreadcrumbs: React.FC<AcademicBreadcrumbsProps> = ({
  items,
  showBackButton = false,
  onBackClick,
  className = '',
  compactOnMobile = true
}) => {
  const { lang, setActiveView, setSelectedArticleId, setSelectedIssueId, setSelectedLokgeetId, setSelectedShabdkoshId, setSelectedPaheliId, setSelectedWriterId, setSelectedBlogId } = useCms();

  const handleItemClick = (item: BreadcrumbItem, e: React.MouseEvent) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
      return;
    }

    if (item.view) {
      e.preventDefault();
      if (item.articleIdOrSlug) setSelectedArticleId(item.articleIdOrSlug);
      if (item.issueId) setSelectedIssueId(item.issueId);
      if (item.itemSlugOrId) {
        if (item.view === 'pawari_lokgeet') setSelectedLokgeetId(item.itemSlugOrId);
        if (item.view === 'pawari_shabdkosh') setSelectedShabdkoshId(item.itemSlugOrId);
        if (item.view === 'pawari_paheli') setSelectedPaheliId(item.itemSlugOrId);
      }
      if (item.writerId) setSelectedWriterId(item.writerId);
      if (item.blogId) setSelectedBlogId(item.blogId);

      setActiveView(item.view, item.articleIdOrSlug, item.issueId, item.bookId, item.blogId || item.itemSlugOrId, false, item.writerId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedArticleId(null);
    setSelectedIssueId(null);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center justify-between gap-2 py-2.5 px-3.5 sm:px-4 bg-amber-50/70 border border-amber-900/10 rounded-2xl text-xs text-stone-700 font-sans shadow-2xs backdrop-blur-xs ${className}`}
    >
      <div className="flex items-center flex-wrap gap-1.5 min-w-0">
        {/* Home Link */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="inline-flex items-center space-x-1 font-semibold text-stone-600 hover:text-red-950 transition group shrink-0"
          title={lang === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}
        >
          <Home className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-serif">{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
        </a>

        {/* Dynamic Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const displayLabel = lang === 'hi' ? item.label : (item.labelEn || item.label);
          const itemHref = item.href || (item.view ? getUrlForView(item.view, item.articleIdOrSlug, item.issueId, item.bookId, item.blogId || item.itemSlugOrId, false, item.writerId) : '#');

          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" aria-hidden="true" />
              {isLast ? (
                <span 
                  className="font-bold text-red-950 truncate max-w-[180px] sm:max-w-[320px] md:max-w-[420px] font-serif"
                  aria-current="page"
                  title={displayLabel}
                >
                  {displayLabel}
                </span>
              ) : (
                <a
                  href={itemHref}
                  onClick={(e) => handleItemClick(item, e)}
                  className="font-medium text-stone-600 hover:text-red-900 hover:underline transition truncate max-w-[120px] sm:max-w-[180px]"
                >
                  {displayLabel}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Optional Back Button */}
      {showBackButton && (
        <button
          type="button"
          onClick={() => {
            if (onBackClick) onBackClick();
            else window.history.back();
          }}
          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-stone-600 hover:text-red-950 bg-white/80 hover:bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs transition shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3 text-amber-700" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'पीछे जाएं' : 'Back'}</span>
        </button>
      )}
    </nav>
  );
};
