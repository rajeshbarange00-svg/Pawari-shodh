import React, { useState, useMemo } from 'react';
import { 
  Book, 
  Search, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Check, 
  Copy,
  ChevronRight,
  FileText,
  Building
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { SAMPLE_BOOKS, BookItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';
import { SahityaFooter } from './SahityaFooter';
import { SahityaShareBar } from './SahityaShareBar';
import { createSlug } from '../../lib/slugUtils';

export interface BooksLibraryViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenBookDetail?: (book: BookItem) => void;
  onOpenContributeModal?: () => void;
}

export const BooksLibraryView: React.FC<BooksLibraryViewProps> = ({
  onNavigateSection,
  onOpenBookDetail,
  onOpenContributeModal
}) => {
  const { lang, books: cmsBooks, openPdfViewer } = useCms();

  const rawBooks = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const approvedBooks = useMemo(() => {
    return rawBooks.filter(
      b => b.status === 'approved' || b.status === 'published' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_'))
    );
  }, [rawBooks]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    approvedBooks.forEach(b => {
      const cat = b.category || 'शोध ग्रंथ';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', labelHindi: 'सभी ग्रंथ (All)', labelEnglish: 'All Books', count: approvedBooks.length },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        labelHindi: cat,
        labelEnglish: cat,
        count: counts[cat]
      }))
    ];
  }, [approvedBooks]);

  const filteredBooks = useMemo(() => {
    return approvedBooks.filter(book => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        book.title_hindi?.toLowerCase().includes(q) ||
        book.title_english?.toLowerCase().includes(q) ||
        book.authors?.toLowerCase().includes(q) ||
        book.publisher?.toLowerCase().includes(q) ||
        book.synopsis_hindi?.toLowerCase().includes(q) ||
        book.category?.toLowerCase().includes(q)
      );

      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [approvedBooks, searchQuery, selectedCategory]);

  const featuredBook = useMemo(() => {
    return approvedBooks.find(b => b.is_featured) || approvedBooks[0];
  }, [approvedBooks]);

  const nonFeaturedBooks = useMemo(() => {
    return filteredBooks.filter(b => b.id !== (searchQuery ? '' : featuredBook?.id));
  }, [filteredBooks, featuredBook, searchQuery]);

  const handleCopyLink = (book: BookItem) => {
    const url = `${window.location.origin}/book/${book.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedId(book.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी शोध ग्रंथ एवं ई-पुस्तक डिजिटल लाइब्रेरी"
        titleEnglish="Pawari Research Books & Digital Library"
        subtitleHindi="माँ ताप्ती पवारी शोध संस्थान व विद्वानों द्वारा रचित प्रामाणिक संदर्भ ग्रंथ, शब्दकोश एवं ई-बुक्स।"
        subtitleEnglish="Curated repository of academic monographs, lexicographical publications, and peer-reviewed cultural literature."
        icon={Book}
        badgeHindi="संदर्भ साहित्य संग्रहालय"
        badgeEnglish="Scholarly Library"
        itemCount={approvedBooks.length}
        currentSection="books"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Featured Book Banner (if no active search) */}
      {!searchQuery && selectedCategory === 'all' && featuredBook && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-red-950 text-stone-100 p-6 sm:p-8 border border-stone-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Book Cover Image */}
            <div className="flex justify-center md:justify-start">
              <div className="w-44 sm:w-52 h-60 sm:h-72 rounded-xl overflow-hidden shadow-2xl border border-amber-400/30 shrink-0 bg-stone-950 relative group">
                <SafeImage
                  src={featuredBook.cover_image}
                  alt={featuredBook.title_hindi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px] font-mono shadow-md">
                  ★ {lang === 'hi' ? 'विशेष ग्रंथ' : 'Featured Work'}
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  {featuredBook.category} • {featuredBook.publication_year}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 leading-tight">
                  {featuredBook.title_hindi}
                </h2>
                {featuredBook.title_english && (
                  <p className="text-sm text-stone-400 italic">
                    {featuredBook.title_english}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{featuredBook.authors}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>{featuredBook.publisher}</span>
                </div>
                {featuredBook.pages && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredBook.pages} {lang === 'hi' ? 'पृष्ठ' : 'Pages'}</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                {featuredBook.synopsis_hindi}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {onOpenBookDetail && (
                  <button
                    type="button"
                    onClick={() => onOpenBookDetail(featuredBook)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'ग्रंथ का पूर्ण विवरण देखें' : 'View Full Details'}</span>
                  </button>
                )}

                {featuredBook.sample_pdf_url && openPdfViewer && (
                  <button
                    type="button"
                    onClick={() => openPdfViewer(featuredBook.sample_pdf_url!, featuredBook.title_hindi)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs border border-stone-700 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'hi' ? 'नमूना ई-बुक पढ़ें' : 'Read Sample PDF'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shared Filter Bar */}
      <SahityaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={lang === 'hi' ? 'ग्रंथ का शीर्षक, लेखक, प्रकाशक या विषय खोजें...' : 'Search by book title, author, publisher, or subject...'}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalResultsCount={filteredBooks.length}
        onResetFilters={handleResetFilters}
      />

      {/* Library Grid */}
      {filteredBooks.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई ग्रंथ नहीं मिला"
          titleEnglish="No books match your criteria"
          descriptionHindi="आपके द्वारा खोजे गए शीर्षक अथवा चयनित श्रेणी के अंतर्गत कोई पुस्तक उपलब्ध नहीं है। कृपया फ़िल्टर बदलें।"
          descriptionEnglish="No publications matched your search query or category. Try modifying search terms or resetting filters."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery ? filteredBooks : nonFeaturedBooks).map((book) => {
            const bookSlug = book.id;
            return (
              <div
                key={book.id}
                onClick={() => onOpenBookDetail && onOpenBookDetail(book)}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative cursor-pointer hover:bg-amber-50/20 shadow-2xs"
              >
                <div className="space-y-4">
                  {/* Top Cover & Title Row */}
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-inner">
                      <SafeImage
                        src={book.cover_image}
                        alt={book.title_hindi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                        {book.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-amber-950 group-hover:text-amber-900 transition-colors line-clamp-2 leading-snug">
                        {book.title_hindi}
                      </h3>
                      <div className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                        <User className="w-3 h-3 text-stone-400" />
                        <span className="line-clamp-1">{book.authors}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-mono border-t border-b border-stone-100 py-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {book.publication_year}
                    </span>
                    {book.publisher && (
                      <span className="line-clamp-1">
                        • {book.publisher}
                      </span>
                    )}
                    {book.pages && (
                      <span>
                        • {book.pages} {lang === 'hi' ? 'पृष्ठ' : 'pp'}
                      </span>
                    )}
                  </div>

                  {/* Synopsis Preview */}
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 font-serif">
                    {book.synopsis_hindi}
                  </p>
                </div>

                {/* Card Action & Share Footer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-900 group-hover:text-amber-950 transition">
                      <span>{lang === 'hi' ? 'विस्तृत पुस्तक पृष्ठ' : 'Book Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </span>
                    {book.sample_pdf_url && openPdfViewer && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPdfViewer(book.sample_pdf_url!, book.title_hindi);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold transition"
                      >
                        PDF प्रीव्यू
                      </button>
                    )}
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SahityaShareBar
                      title={`पवारी ग्रंथ: ${book.title_hindi}`}
                      subtitle={`लेखक: ${book.authors}`}
                      url={`/book/${book.id}`}
                      category={book.category}
                      typeLabel="पवारी संदर्भ ग्रंथ"
                      lang={lang}
                      variant="card"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};
