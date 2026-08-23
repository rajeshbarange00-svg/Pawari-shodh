import React, { useState, useEffect } from 'react';
import { useCms } from '../../lib/CmsContext';
import { findLokgeet } from '../../lib/slugUtils';
import { PawariLokgeetItem } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { 
  Music, 
  Search, 
  User, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Volume2, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Link2, 
  Sparkles, 
  ArrowLeft, 
  BookOpen,
  Filter,
  Layers,
  Heart
} from 'lucide-react';

export const PawariLokgeetView: React.FC = () => {
  const { 
    lang, 
    lokgeetList, 
    lokgeetCategories, 
    setActiveView 
  } = useCms();

  const approvedLokgeet = (lokgeetList || []).filter(l => l.status !== 'draft' && l.status !== 'rejected');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'category'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const [selectedItem, setSelectedItem] = useState<PawariLokgeetItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLyricsId, setCopiedLyricsId] = useState<string | null>(null);

  const HINDI_LETTERS = [
    'all',
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'क', 'ख', 'ग', 'घ',
    'च', 'छ', 'ज', 'ट', 'ड', 'त', 'थ', 'द', 'न',
    'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'स', 'ह'
  ];

  // Sync from URL path on mount & popstate
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const pathname = decodeURIComponent(window.location.pathname.toLowerCase());
        if (pathname.startsWith('/lokgeet/')) {
          const slugOrId = pathname.replace('/lokgeet/', '').trim();
          if (slugOrId) {
            const found = findLokgeet(approvedLokgeet, slugOrId);
            if (found) {
              setSelectedItem(found);
              return;
            }
          }
        }
        setSelectedItem(null);
      } catch (e) {}
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [approvedLokgeet]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedLetter, sortBy]);

  const handleSelectItem = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setSelectedItem(item);
    const targetSlug = item.id;
    const targetUrl = `/lokgeet/${targetSlug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: 'pawari_lokgeet', lokgeetSlugOrId: targetSlug }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    if (window.location.pathname.startsWith('/lokgeet/')) {
      window.history.pushState({ view: 'pawari_lokgeet' }, '', '/lokgeet');
    }
  };

  const handleCopyLink = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/lokgeet/${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }).catch(() => {
      prompt('कॉपी करने के लिए लिंक:', url);
    });
  };

  const handleCopyLyrics = (item: PawariLokgeetItem) => {
    const text = `${item.title_pawari}\n${item.title_hindi ? '(' + item.title_hindi + ')\n' : ''}\n श्रेणी: ${item.category}\n ${item.singer_or_collector ? 'संग्रहकर्ता: ' + item.singer_or_collector + '\n' : ''}\n${item.lyrics_pawari}\n\n${item.lyrics_hindi_meaning ? 'भावार्थ:\n' + item.lyrics_hindi_meaning : ''}\n\n-- पवारी शोध पत्रिका (Pawari Shodh Patrika)`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLyricsId(item.id);
      setTimeout(() => setCopiedLyricsId(null), 2500);
    });
  };

  const handleWhatsAppShare = (item: PawariLokgeetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/lokgeet/${item.id}`;
    const text = encodeURIComponent(`🎵 पवारी लोकगीत: *${item.title_pawari}*\nश्रेणी: ${item.category}\n\nपढ़ें और सुनें:\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Filter and sort items
  const filteredItems = approvedLokgeet.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title_hindi && item.title_hindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.lyrics_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.singer_or_collector && item.singer_or_collector.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const matchesLetter = selectedLetter === 'all' || 
      item.title_pawari.trim().startsWith(selectedLetter) ||
      (item.title_hindi && item.title_hindi.trim().startsWith(selectedLetter));

    return matchesSearch && matchesCategory && matchesLetter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title_pawari.localeCompare(b.title_pawari, 'hi');
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category, 'hi');
    }
    // default newest
    return String(b.created_at || '').localeCompare(String(a.created_at || ''));
  });

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- BREADCRUMB / NAV CUE ----------------- */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <button onClick={() => setActiveView('home')} className="hover:text-red-900 transition font-medium">
          {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={handleBackToList} className="hover:text-red-900 transition font-medium">
          {lang === 'hi' ? 'लोकसाहित्य अर्काइव' : 'Folklore Archive'}
        </button>
        {selectedItem && (
          <>
            <span>/</span>
            <span className="text-red-950 font-bold truncate max-w-[200px]">{selectedItem.title_pawari}</span>
          </>
        )}
      </div>

      {/* ----------------- DETAIL VIEW ----------------- */}
      {selectedItem ? (
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* Top Back & Action Bar */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center space-x-2 text-xs font-bold text-red-950 hover:text-red-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? 'लोकगीत सूची पर वापस जाएं' : 'Back to Lokgeet Archive'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleWhatsAppShare(selectedItem, e)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'hi' ? 'व्हाट्सएप शेयर' : 'Share'}</span>
              </button>
              <button
                onClick={(e) => handleCopyLink(selectedItem, e)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedId === selectedItem.id ? (lang === 'hi' ? 'लिंक कॉपी हुआ' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* Song Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold rounded-full tracking-wide">
                🎵 {selectedItem.category}
              </span>
              {selectedItem.singer_or_collector && (
                <span className="text-xs text-slate-700 font-medium flex items-center space-x-1.5 bg-amber-50/70 px-3.5 py-1 rounded-full border border-amber-200/80">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>{lang === 'hi' ? 'संग्रहकर्ता / गवैया:' : 'Collector/Singer:'} <strong>{selectedItem.singer_or_collector}</strong></span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-red-950 tracking-tight leading-tight">
              {selectedItem.title_pawari}
            </h1>
            {selectedItem.title_hindi && (
              <p className="text-base text-slate-600 font-serif font-medium">
                ({selectedItem.title_hindi})
              </p>
            )}
          </div>

          {/* Optional Media */}
          {selectedItem.image_url && (
            <div className="max-h-80 rounded-2xl overflow-hidden border border-amber-200/80 shadow-sm bg-slate-50">
              <SafeImage src={selectedItem.image_url} alt={selectedItem.title_pawari} className="w-full h-full object-cover" />
            </div>
          )}

          {selectedItem.audio_url && (
            <div className="bg-amber-50/80 border border-amber-300/80 p-5 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-950">
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'पवारी लोकगीत ऑडियो सुनें:' : 'Listen Audio:'}</span>
              </div>
              <audio controls src={selectedItem.audio_url} className="w-full" />
            </div>
          )}

          {selectedItem.youtube_url && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                <span>{lang === 'hi' ? 'यूट्यूब पर वीडियो प्रसारण उपलब्ध' : 'YouTube Broadcast Available'}</span>
              </div>
              <a 
                href={selectedItem.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-1 transition"
              >
                <span>{lang === 'hi' ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Lyrics Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2">
                <Music className="w-5 h-5 text-amber-700" />
                <span>{lang === 'hi' ? 'लोकगीत के सम्पूर्ण बोल (Lyrics)' : 'Complete Lyrics'}</span>
              </h2>
              <button
                onClick={() => handleCopyLyrics(selectedItem)}
                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedLyricsId === selectedItem.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lang === 'hi' ? 'बोल कॉपी करें' : 'Copy Lyrics'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-50/50 border border-amber-200/80 p-6 sm:p-8 rounded-3xl text-slate-900 font-serif leading-relaxed shadow-xs">
              <pre className="text-base sm:text-lg font-serif text-slate-900 whitespace-pre-wrap leading-relaxed">
                {selectedItem.lyrics_pawari}
              </pre>
            </div>
          </div>

          {/* Hindi Meaning / भावार्थ */}
          {selectedItem.lyrics_hindi_meaning && (
            <div className="p-5 bg-amber-50/40 border border-amber-200/80 rounded-2xl space-y-2">
              <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'गीत का भावार्थ (हिंदी अर्थ):' : 'Meaning in Hindi:'}</span>
              </h3>
              <p className="text-sm text-slate-700 font-serif leading-relaxed">
                {selectedItem.lyrics_hindi_meaning}
              </p>
            </div>
          )}

          {/* Prev / Next Navigation in Detail */}
          <div className="pt-6 border-t border-amber-100 flex justify-between items-center gap-4">
            {(() => {
              const idx = approvedLokgeet.findIndex(l => l.id === selectedItem.id);
              const prev = idx > 0 ? approvedLokgeet[idx - 1] : null;
              const next = idx < approvedLokgeet.length - 1 ? approvedLokgeet[idx + 1] : null;

              return (
                <>
                  {prev ? (
                    <button
                      onClick={(e) => handleSelectItem(prev, e)}
                      className="px-4 py-2.5 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-1.5 transition max-w-[48%] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="truncate">{lang === 'hi' ? 'पिछला गीत: ' : 'Prev: '}{prev.title_pawari}</span>
                    </button>
                  ) : <div />}

                  {next ? (
                    <button
                      onClick={(e) => handleSelectItem(next, e)}
                      className="px-4 py-2.5 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-1.5 transition max-w-[48%] ml-auto cursor-pointer"
                    >
                      <span className="truncate">{lang === 'hi' ? 'अगला गीत: ' : 'Next: '}{next.title_pawari}</span>
                      <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>

        </div>
      ) : (
        /* ----------------- ARCHIVE LISTING VIEW ----------------- */
        <div className="space-y-6">
          
          {/* Header & Intro */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-amber-200/70 text-amber-950 text-xs font-bold uppercase rounded-full tracking-wider border border-amber-300">
                {lang === 'hi' ? 'सांस्कृतिक अर्काइव' : 'Cultural Archive'}
              </span>
              <span className="text-xs text-amber-900/70 font-mono font-bold">
                {approvedLokgeet.length} {lang === 'hi' ? 'लोकगीत संकलित' : 'Folk Songs'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-red-950 tracking-tight">
              {lang === 'hi' ? 'पवारी लोकगीत (Pawari Lokgeet Archive)' : 'Pawari Lokgeet Archive'}
            </h1>
            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed font-sans">
              {lang === 'hi'
                ? 'सतपुड़ा, ताप्ती अंचल और मध्य भारत की लोकगाथाओं, विवाह गीतों, भक्ति पदों एवं पारंपरिक पवारी लोकसाहित्य का व्यवस्थित व सुगम सांस्कृतिक अर्काइव।'
                : 'A curated cultural archive of folk songs, marriage ballads, devotional verses, and traditional oral literature from the Tapti and Satpura region.'}
            </p>
          </div>

          {/* Browse Controls & Search Bar */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'लोकगीत शीर्षक, श्रेणी या बोल खोजें...' : 'Search folk songs by title or lyrics...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-amber-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-600 font-medium hidden md:inline">{lang === 'hi' ? 'क्रम:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 bg-slate-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="default">{lang === 'hi' ? 'नवीनतम (Latest)' : 'Latest'}</option>
                  <option value="title">{lang === 'hi' ? 'शीर्षक (A-Z)' : 'Title (A-Z)'}</option>
                  <option value="category">{lang === 'hi' ? 'श्रेणी अनुसार' : 'By Category'}</option>
                </select>
              </div>
            </div>

            {/* Category Filter Chips */}
            {lokgeetCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1.5 text-xs">
                <span className="text-slate-600 font-semibold shrink-0">
                  {lang === 'hi' ? 'श्रेणी:' : 'Category:'}
                </span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-red-950 text-amber-300 shadow-xs'
                      : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200/70'
                  }`}
                >
                  {lang === 'hi' ? `सभी (${approvedLokgeet.length})` : `All (${approvedLokgeet.length})`}
                </button>
                {lokgeetCategories.map(cat => {
                  const count = approvedLokgeet.filter(l => l.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-red-950 text-amber-300 shadow-xs'
                          : 'bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-200/70'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* First Letter Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pt-2 pb-1.5 border-t border-amber-100 text-[11px]">
              <span className="text-slate-600 font-semibold shrink-0 mr-1">
                {lang === 'hi' ? 'वर्ण:' : 'Letter:'}
              </span>
              {HINDI_LETTERS.map(letChar => (
                <button
                  key={letChar}
                  onClick={() => setSelectedLetter(letChar)}
                  className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                    selectedLetter === letChar
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {letChar === 'all' ? (lang === 'hi' ? 'सभी वर्ण' : 'All') : letChar}
                </button>
              ))}
            </div>

          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center text-xs text-slate-600 px-1">
            <span>
              {lang === 'hi' ? 'प्रदर्शित लोकगीत:' : 'Showing folk songs:'} <strong className="text-red-950 font-serif font-bold">{sortedItems.length}</strong>
            </span>
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')} className="text-red-900 font-semibold hover:underline cursor-pointer">
                {lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filter'}
              </button>
            )}
          </div>

          {/* Clean Listing Cards (One content type archive style) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedItems.map(item => {
              const lyricsClean = item.lyrics_pawari.replace(/\n+/g, ' ').trim();
              const snippet = lyricsClean.slice(0, 110) + (lyricsClean.length > 110 ? '...' : '');

              return (
                <div
                  key={item.id}
                  onClick={(e) => handleSelectItem(item, e)}
                  className="bg-white border border-amber-900/15 hover:border-amber-500/70 rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 group shadow-xs hover:shadow-md cursor-pointer space-y-4"
                >
                  <div className="space-y-3">
                    {/* Category & Type */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-950 font-bold rounded-lg border border-amber-300/80">
                        🎵 {item.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.created_at ? item.created_at.slice(0, 10) : '2026'}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-red-950 group-hover:text-red-900 transition-colors leading-snug">
                        {item.title_pawari}
                      </h3>
                      {item.title_hindi && (
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          ({item.title_hindi})
                        </p>
                      )}
                    </div>

                    {/* Short Preview / Snippet */}
                    <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60 text-xs font-serif text-slate-800 italic leading-relaxed line-clamp-2">
                      "{snippet}"
                    </div>

                    {/* Source / Contributor */}
                    {item.singer_or_collector && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
                        <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">
                          {lang === 'hi' ? 'संग्रहकर्ता / गवैया:' : 'Source:'} <strong>{item.singer_or_collector}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer CTA */}
                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                    <button
                      onClick={(e) => handleSelectItem(item, e)}
                      className="px-4 py-2 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 text-amber-200 rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'पूरा देखें ➔' : 'View Full ➔'}</span>
                    </button>

                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleCopyLink(item, e)}
                        title="लिंक कॉपी करें"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => handleWhatsAppShare(item, e)}
                        title="व्हाट्सएप शेयर"
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 rounded-xl transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {sortedItems.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-amber-200/80 rounded-3xl space-y-3">
                <Music className="w-12 h-12 text-amber-300 mx-auto" />
                <h3 className="font-serif font-bold text-red-950 text-lg">
                  {lang === 'hi' ? 'कोई पवारी लोकगीत नहीं मिला' : 'No Folk Songs Found'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {lang === 'hi'
                    ? 'कृपया अपनी खोज शब्द बदलें या सभी श्रेणियाँ देखने के लिए फ़िल्टर रीसेट करें।'
                    : 'Try adjusting your search query or resetting filters.'}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedLetter('all'); }}
                  className="px-4 py-2 bg-red-950 text-amber-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {lang === 'hi' ? 'सभी लोकगीत दिखाएं' : 'Show All Folk Songs'}
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-amber-200/70 text-xs">
              <span className="text-slate-600">
                {lang === 'hi' ? 'प्रदर्शित:' : 'Showing:'} <strong className="font-serif text-slate-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</strong> - <strong className="font-serif text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, sortedItems.length)}</strong> ({sortedItems.length} {lang === 'hi' ? 'कुल' : 'total'})
              </span>

              <div className="flex items-center space-x-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-50 transition cursor-pointer"
                >
                  {lang === 'hi' ? 'पिछला' : 'Prev'}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pg
                        ? 'bg-red-950 text-amber-200 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/80'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-50 transition cursor-pointer"
                >
                  {lang === 'hi' ? 'अगला' : 'Next'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
