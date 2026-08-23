import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight, 
  Clock, 
  Eye, 
  Tag, 
  PenTool 
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { SAMPLE_BLOGS, BlogItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';
import { SahityaFooter } from './SahityaFooter';
import { SahityaShareBar } from './SahityaShareBar';
import { createSlug } from '../../lib/slugUtils';

export interface ReviewsViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenBlogDetail?: (blog: BlogItem) => void;
  onOpenContributeModal?: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  onNavigateSection,
  onOpenBlogDetail,
  onOpenContributeModal
}) => {
  const { lang, blogs: cmsBlogs } = useCms();

  const rawBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;
  const approvedReviews = useMemo(() => {
    return rawBlogs.filter(
      b => b.status === 'approved' || b.status === 'published' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_'))
    );
  }, [rawBlogs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    approvedReviews.forEach(r => {
      const cat = r.category || 'साहित्य समीक्षा';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', labelHindi: 'सभी समीक्षाएं (All)', labelEnglish: 'All Reviews', count: approvedReviews.length },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        labelHindi: cat,
        labelEnglish: cat,
        count: counts[cat]
      }))
    ];
  }, [approvedReviews]);

  const filteredReviews = useMemo(() => {
    return approvedReviews.filter(review => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        review.title_hindi?.toLowerCase().includes(q) ||
        review.title_english?.toLowerCase().includes(q) ||
        review.author?.toLowerCase().includes(q) ||
        review.excerpt_hindi?.toLowerCase().includes(q) ||
        review.category?.toLowerCase().includes(q) ||
        review.tags?.some(t => t.toLowerCase().includes(q))
      );

      const matchesCategory = selectedCategory === 'all' || review.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [approvedReviews, searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी साहित्य समीक्षा एवं समालोचना"
        titleEnglish="Pawari Literary Reviews & Critical Discourse"
        subtitleHindi="पवारी ग्रंथों, लोकसाहित्य, भाषाई शोध निबंधों एवं कृतियों की निष्पक्ष समीक्षाएं व आलेख।"
        subtitleEnglish="Editorial reviews, critical monographs, and scholarly evaluations of contemporary Pawari literature and linguistics."
        icon={FileText}
        badgeHindi="साहित्यिक समालोचना"
        badgeEnglish="Critical Reviews"
        itemCount={approvedReviews.length}
        currentSection="reviews"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Shared Filter Bar */}
      <SahityaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={lang === 'hi' ? 'समीक्षा शीर्षक, आलोचक, समीक्षित कृति या विषय खोजें...' : 'Search review title, reviewer, topic, or tags...'}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalResultsCount={filteredReviews.length}
        onResetFilters={handleResetFilters}
      />

      {/* Reviews List Grid (Editorial Card Style) */}
      {filteredReviews.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई समीक्षा नहीं मिली"
          titleEnglish="No reviews match your query"
          descriptionHindi="आपके खोज शब्दों के अनुसार कोई समीक्षा अथवा आलेख नहीं मिला। कृपया भिन्न कीवर्ड खोजें।"
          descriptionEnglish="No literary reviews or articles matched your search criteria. Try modifying your filters."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((item) => {
            const blogSlug = item.id;
            return (
              <article
                key={item.id}
                onClick={() => onOpenBlogDetail && onOpenBlogDetail(item)}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative cursor-pointer hover:bg-amber-50/20 shadow-2xs"
              >
                <div className="space-y-3.5">
                  {/* Top Category & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-950 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {item.category || 'साहित्य समीक्षा'}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {item.date}
                      </span>
                      {item.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {item.read_time}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-950 group-hover:text-amber-900 transition-colors leading-snug">
                      {item.title_hindi}
                    </h3>
                    {item.title_english && (
                      <p className="text-xs text-stone-500 italic">
                        {item.title_english}
                      </p>
                    )}
                  </div>

                  {/* Reviewer / Author Byline */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold font-mono shrink-0">
                      <User className="w-4 h-4 text-stone-500" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {item.author}
                      </div>
                      {item.author_role && (
                        <div className="text-[11px] text-stone-500 font-mono">
                          {item.author_role}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Abstract / Excerpt */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 font-serif">
                    {item.excerpt_hindi}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-50 text-stone-600 border border-stone-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action & Share Footer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-900 group-hover:text-amber-950 transition">
                      <span>{lang === 'hi' ? 'पूरी समीक्षा पढ़ें' : 'Read Full Review'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </span>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SahityaShareBar
                      title={`पवारी समीक्षा: ${item.title_hindi}`}
                      subtitle={`समीक्षक: ${item.author}`}
                      url={`/blog/${item.id}`}
                      category={item.category || 'साहित्य समीक्षा'}
                      typeLabel="पवारी साहित्य समालोचना"
                      lang={lang}
                      variant="card"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Shared Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};

