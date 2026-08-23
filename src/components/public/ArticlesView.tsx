import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
import { SharePaperModal } from '../common/SharePaperModal';
import { SafeImage } from '../common/SafeImage';
import { 
  Search, 
  Download, 
  Eye, 
  BookOpen, 
  Layers, 
  X, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  Archive, 
  Share2,
  Calendar,
  Filter,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const ArticlesView: React.FC = () => {
  const { 
    lang, 
    articles, 
    issues, 
    setSelectedArticleId, 
    setActiveView, 
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads
  } = useCms();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedIssueFilter, setSelectedIssueFilter] = useState<string>('all'); // 'all' or `${volume}_${issue_number}`
  const [activeTab, setActiveTab] = useState<'by_issue' | 'search_all'>('by_issue');
  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);

  const publishedArticles = articles.filter(a => a.status !== 'draft' && a.status !== 'rejected');
  const publishedIssues = issues.filter(i => i.status !== 'draft' && i.status !== 'archived_hidden');

  // Group issues by volume
  const volumesMap = useMemo(() => {
    const grouped: Record<number, typeof issues> = {};
    publishedIssues.forEach(iss => {
      if (!grouped[iss.volume]) grouped[iss.volume] = [];
      grouped[iss.volume].push(iss);
    });
    Object.keys(grouped).forEach(vol => {
      grouped[Number(vol)].sort((a, b) => b.issue_number - a.issue_number);
    });
    return grouped;
  }, [publishedIssues]);

  const volumeNumbers = useMemo(() => Object.keys(volumesMap).map(Number).sort((a, b) => b - a), [volumesMap]);

  // Categories list
  const categories = Array.from(new Set(publishedArticles.map(a => a.category).filter(Boolean)));

  // Filtered articles
  const filteredArticles = publishedArticles.filter(art => {
    const query = search.toLowerCase();
    const titleMatch = art.title_hindi.toLowerCase().includes(query) || art.title_english.toLowerCase().includes(query);
    const authorMatch = art.authors.some(a => a.name.toLowerCase().includes(query) || a.affiliation?.toLowerCase().includes(query));
    const keywordMatch = art.keywords.some(k => k.toLowerCase().includes(query));
    const doiMatch = art.doi?.toLowerCase().includes(query);
    const matchesSearch = !query || titleMatch || authorMatch || keywordMatch || doiMatch;

    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || art.language === selectedLanguage;
    const matchesIssue = selectedIssueFilter === 'all' || `${art.volume}_${art.issue}` === selectedIssueFilter;

    return matchesSearch && matchesCategory && matchesLanguage && matchesIssue;
  });

  const handleArticleClick = (artId: string) => {
    setSelectedArticleId(artId);
    incrementArticleViews(artId);
    setActiveView('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfView = (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    incrementArticleViews(art.id);
    handleArticleClick(art.slug || art.id);
  };

  const handlePdfDownload = (e: React.MouseEvent, artId: string, pdfUrl: string, title?: string) => {
    e.stopPropagation();
    incrementArticleDownloads(artId);
    downloadPdf(pdfUrl, title || 'article.pdf');
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLanguage('all');
    setSelectedIssueFilter('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-8 shadow-md border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 font-mono text-xs uppercase tracking-wider mb-1">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'पुराने अंक एवं प्रकाशित शोध पत्र' : 'Archives & Published Research Papers'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              {lang === 'hi' ? 'पुराने अंक एवं प्रकाशित शोध पत्र संग्रह' : 'Journal Archives & Research Papers'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
              {lang === 'hi'
                ? 'पवारी शोध पत्रिका के सभी प्रकाशित अंकों एवं शोध पत्रों का एकीकृत संग्रह। अंकवार अथवा विषयवार अध्ययन करें।'
                : 'Complete integrated archive of published issues and peer-reviewed research papers in Pawari Shodh Patrika.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-amber-500/20 shrink-0">
            <button
              onClick={() => setActiveTab('by_issue')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'by_issue'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{lang === 'hi' ? 'अंक अनुसार (Volume & Issue)' : 'Browse by Issue'}</span>
            </button>
            <button
              onClick={() => setActiveTab('search_all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'search_all'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-amber-100 hover:bg-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'hi' ? 'खोज एवं सभी लेख (Search All)' : 'Search All Articles'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Visible in both views) */}
      <div className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'hi' ? 'शोध पत्र शीर्षक, लेखक, कीवर्ड या DOI से खोजें...' : 'Search by title, author, keyword or DOI...'}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Issue Selector Dropdown */}
          <div className="w-full sm:w-64">
            <select
              value={selectedIssueFilter}
              onChange={(e) => setSelectedIssueFilter(e.target.value)}
              className="w-full p-2.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">{lang === 'hi' ? 'सभी अंक (All Volumes & Issues)' : 'All Volumes & Issues'}</option>
              {publishedIssues.map(iss => (
                <option key={iss.id} value={`${iss.volume}_${iss.issue_number}`}>
                  Vol. {iss.volume}, Issue {iss.issue_number} ({iss.year}) — {iss.title_hindi || iss.title_english}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-100">
          <div>
            <label className="block text-slate-600 font-medium mb-1">{lang === 'hi' ? 'विषय श्रेणी (Category)' : 'Category'}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">{lang === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">{lang === 'hi' ? 'भाषा (Language)' : 'Language'}</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">{lang === 'hi' ? 'सभी भाषाएँ (All Languages)' : 'All Languages'}</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="English">English</option>
              <option value="Pawari">Pawari (पवारी)</option>
            </select>
          </div>

          <div className="flex items-end justify-between font-mono text-[11px] text-slate-500 pb-1">
            <span>{filteredArticles.length} {lang === 'hi' ? 'शोध पत्र उपलब्ध' : 'Articles Found'}</span>
            {(search || selectedCategory !== 'all' || selectedLanguage !== 'all' || selectedIssueFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-red-900 font-bold hover:underline"
              >
                {lang === 'hi' ? 'फ़िल्टर रिसेट करें' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'by_issue' ? (
        /* VOLUME & ISSUE ARCHIVE BROWSER WITH INTEGRATED PAPERS */
        <div className="space-y-8">
          {volumeNumbers.map(volNum => {
            const volIssues = volumesMap[volNum];

            return (
              <div key={volNum} className="bg-white border border-amber-900/15 rounded-2xl p-6 shadow-2xs space-y-6">
                
                {/* Volume Header */}
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-red-900" />
                    <div>
                      <h2 className="text-xl font-serif font-bold text-red-950">
                        Volume {volNum} ({volIssues[0]?.year || '2026'})
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        {volIssues.length} {lang === 'hi' ? 'प्रकाशित अंक' : 'Published Issues'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issues Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {volIssues.map(iss => {
                    const issueArticles = publishedArticles.filter(
                      a => Number(a.volume) === Number(iss.volume) && Number(a.issue) === Number(iss.issue_number)
                    );

                    const isFilterActive = selectedIssueFilter === `${iss.volume}_${iss.issue_number}`;

                    return (
                      <div 
                        key={iss.id}
                        className={`bg-slate-50 rounded-2xl border transition-all p-5 shadow-2xs space-y-4 flex flex-col justify-between ${
                          isFilterActive ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/40' : 'border-slate-200 hover:border-amber-400/60'
                        }`}
                      >
                        {/* Issue Header Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase ${
                              iss.status === 'current' 
                                ? 'bg-amber-500 text-red-950 shadow-2xs' 
                                : 'bg-red-100 text-red-950'
                            }`}>
                              {iss.status === 'current' ? (lang === 'hi' ? '★ वर्तमान अंक' : '★ Current Issue') : `Vol. ${iss.volume}, Issue ${iss.issue_number}`}
                            </span>
                            <span className="text-xs font-mono text-slate-600 font-semibold">{iss.month} {iss.year}</span>
                          </div>

                          <div className="flex gap-4 items-start">
                            {/* Cover Image */}
                            <div className="w-24 aspect-3/4 max-h-36 shrink-0 rounded-lg overflow-hidden border border-amber-500/30 bg-slate-900 shadow-md">
                              <SafeImage 
                                src={iss.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'} 
                                alt={iss.title_english} 
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="space-y-1.5 flex-1 min-w-0">
                              <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg leading-snug">
                                {lang === 'hi' ? iss.title_hindi : iss.title_english}
                              </h3>
                              {iss.description_hindi && (
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                  {lang === 'hi' ? iss.description_hindi : iss.description_english}
                                </p>
                              )}
                              <div className="pt-1 text-xs font-bold text-red-900 font-mono flex items-center space-x-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>{issueArticles.length} {lang === 'hi' ? 'प्रकाशित शोध पत्र' : 'Published Papers'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Issue Action & Embedded Papers */}
                        <div className="pt-3 border-t border-slate-200 space-y-3">
                          <button
                            onClick={() => {
                              if (isFilterActive) {
                                setSelectedIssueFilter('all');
                              } else {
                                setSelectedIssueFilter(`${iss.volume}_${iss.issue_number}`);
                              }
                            }}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition ${
                              isFilterActive 
                                ? 'bg-amber-500 text-red-950 shadow-xs' 
                                : 'bg-red-950 text-amber-100 hover:bg-red-900'
                            }`}
                          >
                            <span>
                              {isFilterActive 
                                ? (lang === 'hi' ? 'सभी अंक देखें (Clear Filter)' : 'Show All Issues') 
                                : (lang === 'hi' ? `इस अंक के ${issueArticles.length} शोध पत्र देखें` : `Explore ${issueArticles.length} Papers in Issue`)}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* List of Articles for this issue */}
                          <div className="space-y-2 pt-1">
                            {issueArticles.length === 0 ? (
                              <p className="text-xs text-slate-500 italic text-center py-2">
                                {lang === 'hi' ? 'इस अंक में कोई प्रकाशित लेख नहीं हैं।' : 'No papers in this issue.'}
                              </p>
                            ) : (
                              issueArticles.map(art => (
                                <div
                                  key={art.id}
                                  onClick={() => handleArticleClick(art.id)}
                                  className="bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl p-3 shadow-2xs transition cursor-pointer space-y-2 group"
                                >
                                  <div className="flex items-center justify-between text-[11px] font-mono">
                                    <div className="flex items-center space-x-1.5">
                                      <span className="bg-red-100 text-red-950 font-bold px-2 py-0.5 rounded text-[10px]">
                                        {art.category}
                                      </span>
                                      {(art.content_mode === 'full_text' || art.full_text_introduction) && (
                                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                                          Full-Text Available
                                        </span>
                                      )}
                                    </div>
                                    {art.page_numbers && (
                                      <span className="text-slate-500">pp. {art.page_numbers}</span>
                                    )}
                                  </div>

                                  <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
                                    <a
                                      href={getUrlForView('article_detail', art.slug || art.id)}
                                      onClick={(e) => {
                                        if (!e.metaKey && !e.ctrlKey) {
                                          e.preventDefault();
                                          handleArticleClick(art.slug || art.id);
                                        }
                                      }}
                                      className="hover:underline"
                                    >
                                      {lang === 'hi' ? art.title_hindi : art.title_english}
                                    </a>
                                  </h4>

                                  <p className="text-[11px] font-semibold text-slate-700">
                                    {art.authors.map(a => a.name).join('; ')}
                                  </p>

                                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                                    <span className="text-red-900 font-bold group-hover:underline flex items-center space-x-1">
                                      <span>{lang === 'hi' ? 'विवरण एवं सार' : 'Read Abstract'}</span>
                                      <ChevronRight className="w-3 h-3" />
                                    </span>

                                    <div className="flex items-center space-x-1.5">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShareModalArticle(art);
                                        }}
                                        className="p-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 hover:bg-emerald-100"
                                        title="Share"
                                      >
                                        <Share2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => handlePdfView(e, art)}
                                        className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-bold hover:bg-slate-200"
                                      >
                                        PDF View
                                      </button>
                                      <button
                                        onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                                        className="p-1 bg-amber-500 text-red-950 rounded hover:bg-amber-600"
                                        title="Download PDF"
                                      >
                                        <Download className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* FLAT SEARCH & ALL ARTICLES LIST VIEW */
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 space-y-2 border border-slate-200">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-serif font-semibold text-lg">{lang === 'hi' ? 'कोई शोध पत्र नहीं मिला' : 'No research articles match your criteria'}</p>
              <p className="text-xs">{lang === 'hi' ? 'कृपया अपनी खोज अथवा फ़िल्टर बदलकर प्रयास करें।' : 'Try modifying your search keywords or filters.'}</p>
            </div>
          ) : (
            filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleArticleClick(art.id)}
                className="bg-white hover:bg-amber-50/50 border border-amber-900/10 hover:border-amber-400/50 rounded-2xl p-6 shadow-2xs hover:shadow-md transition cursor-pointer space-y-3 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                      Vol {art.volume} Issue {art.issue} ({art.year})
                    </span>
                    <span className="bg-red-100 text-red-950 font-semibold px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {art.language}
                    </span>
                    {art.page_numbers && (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                        pp. {art.page_numbers}
                      </span>
                    )}
                    <span className="bg-emerald-100 text-emerald-950 font-semibold px-2 py-0.5 rounded text-[10px]">
                      Open Access
                    </span>
                    {(art.content_mode === 'full_text' || art.full_text_introduction) && (
                      <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] shadow-2xs">
                        Full-Text Article (पूर्ण पाठ आलेख)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500 font-mono text-[11px]">
                    <span>DOI:</span>
                    <a
                      href={`https://doi.org/${art.doi || '10.5281/zenodo'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-amber-600 hover:text-amber-700 hover:underline flex items-center space-x-0.5"
                    >
                      <span>{art.doi || '10.5281/zenodo'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 group-hover:text-red-950 leading-snug">
                    <a 
                      href={getUrlForView('article_detail', art.slug || art.id)}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleArticleClick(art.slug || art.id);
                        }
                      }}
                      className="hover:underline"
                    >
                      {lang === 'hi' ? art.title_hindi : art.title_english}
                    </a>
                  </h2>
                  {art.title_english && art.title_hindi && (
                    <p className="text-xs sm:text-sm font-serif italic text-slate-600">
                      {lang === 'hi' ? art.title_english : art.title_hindi}
                    </p>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  {art.authors.map(a => `${a.name}${a.affiliation ? ` (${a.affiliation})` : ''}`).join('; ')}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                </p>

                {art.keywords && art.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-mono border border-slate-200/60">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-4">
                    <a 
                      href={getUrlForView('article_detail', art.slug || art.id)}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleArticleClick(art.slug || art.id);
                        }
                      }}
                      className="text-red-900 font-bold hover:underline"
                    >
                      {lang === 'hi' ? 'पूर्ण शोध पत्र एवं विवरण →' : 'Read Full Manuscript →'}
                    </a>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span className="flex items-center space-x-1" title="Views">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{art.views_count || 0} views</span>
                      </span>
                      <span className="flex items-center space-x-1" title="Downloads">
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        <span>{art.downloads_count || 0} downloads</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareModalArticle(art);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1 shadow-2xs"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                    </button>
                    <button
                      onClick={(e) => handlePdfView(e, art)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                    <button
                      onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded-lg transition flex items-center space-x-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Share Modal */}
      <SharePaperModal
        article={shareModalArticle}
        isOpen={!!shareModalArticle}
        onClose={() => setShareModalArticle(null)}
        lang={lang}
      />

    </div>
  );
};

