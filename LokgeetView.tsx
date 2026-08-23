import React, { useState, useMemo, useEffect } from 'react';
import { 
  Music, 
  Search, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  ArrowLeft, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Headphones
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariLokgeetItem } from '../../types';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';
import { SahityaFooter } from './SahityaFooter';
import { SahityaShareBar } from './SahityaShareBar';
import { createSlug } from '../../lib/slugUtils';
import { GOPINATH_KALBHOR_LOKGEET_COLLECTION } from '../../data/pawariLokgeetGopinathData';
import { SAMPLE_LOKGEET } from '../../data/pawariCulturalData';

export interface LokgeetViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenContributeModal?: () => void;
}

export const LokgeetView: React.FC<LokgeetViewProps> = ({
  onNavigateSection,
  onOpenContributeModal
}) => {
  const { lang, lokgeetList, lokgeetCategories, setSelectedLokgeetId } = useCms();

  const allCombinedList = useMemo(() => {
    const combined = [...(lokgeetList || []), ...GOPINATH_KALBHOR_LOKGEET_COLLECTION, ...SAMPLE_LOKGEET];
    const map = new Map<string, PawariLokgeetItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        if (item.status === 'approved' || item.status === 'published' || (!item.status && !item.id.startsWith('contrib_'))) {
          map.set(item.id, item);
        }
      }
    });
    return Array.from(map.values());
  }, [lokgeetList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const categories = useMemo(() => {
    const rawCats = lokgeetCategories && lokgeetCategories.length > 0 
      ? lokgeetCategories 
      : ['विवाह गीत', 'भांवर व हल्दी गीत', 'फाग व होली', 'दिवारी व गोवर्धन', 'बिरहा व लोकगाथा', 'भजन व भक्ति', 'ऋतु व श्रम गीत'];

    const counts: Record<string, number> = {};
    allCombinedList.forEach(item => {
      const cat = item.category || (item as any).occasion || 'पारम्परिक';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', labelHindi: 'सभी लोकगीत (All)', labelEnglish: 'All Folk Songs', count: allCombinedList.length },
      ...rawCats.map(cat => ({
        id: cat,
        labelHindi: cat,
        labelEnglish: cat,
        count: counts[cat] || 0
      }))
    ];
  }, [lokgeetCategories, allCombinedList]);

  const filteredSongs = useMemo(() => {
    return allCombinedList.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const titlePawari = item.title_pawari || (item as any).title || '';
      const titleHindi = item.title_hindi || '';
      const lyrics = item.lyrics_pawari || (item as any).lyrics || '';
      const meaning = item.lyrics_hindi_meaning || (item as any).hindi_meaning || '';
      const occasion = (item as any).occasion || item.category || '';
      const singer = item.singer_or_collector || '';
      const cat = item.category || '';

      const matchesSearch = !q || (
        titlePawari.toLowerCase().includes(q) ||
        titleHindi.toLowerCase().includes(q) ||
        lyrics.toLowerCase().includes(q) ||
        meaning.toLowerCase().includes(q) ||
        occasion.toLowerCase().includes(q) ||
        singer.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory || occasion === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allCombinedList, searchQuery, selectedCategory]);

  const handlePlayAudio = (e: React.MouseEvent, song: PawariLokgeetItem) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (playingSongId === song.id) {
      window.speechSynthesis.cancel();
      setPlayingSongId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const titlePawari = song.title_pawari || (song as any).title || '';
    const lyrics = song.lyrics_pawari || (song as any).lyrics || '';
    const textToRead = `${titlePawari}। ${(lyrics || '').slice(0, 300).replace(/\n/g, '। ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingSongId(null);
    utterance.onerror = () => setPlayingSongId(null);

    window.speechSynthesis.speak(utterance);
    setPlayingSongId(song.id);
  };

  const handleOpenSongPage = (song: PawariLokgeetItem) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const slug = song.slug || createSlug(song.title_pawari || (song as any).title || song.id);
    setSelectedLokgeetId(slug);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी पारम्परिक लोकगीत संग्रह"
        titleEnglish="Pawari Traditional Folk Songs Archive"
        subtitleHindi="विवाह, बन्ना-बन्नी, भांवर, हल्दी, फाग, दिवारी, बिरहा एवं पारम्परिक लोकगाथाओं के प्रामाणिक बोल, भावार्थ व ऑडियो।"
        subtitleEnglish="Anthology of authentic folk songs documenting ritual wedding verses, seasonal melodies, agrarian labor songs, and oral epics."
        icon={Music}
        badgeHindi="मौखिक संगीत धरोहर"
        badgeEnglish="Folk Music Archive"
        itemCount={allCombinedList.length}
        currentSection="lokgeet"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Shared Filter Bar */}
      <SahityaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={lang === 'hi' ? 'लोकगीत का शीर्षक, बोल, अवसर या गायक से खोजें...' : 'Search by title, lyrics, occasion, or collector...'}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalResultsCount={filteredSongs.length}
        onResetFilters={handleResetFilters}
      />

      {/* Lokgeet Cards Grid - Each Card is a Direct Link to its Dedicated Page */}
      {filteredSongs.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई लोकगीत नहीं मिला"
          titleEnglish="No folk songs match your query"
          descriptionHindi="आपके द्वारा खोजे गए बोल या चयनित अवसर के अनुसार कोई लोकगीत नहीं मिला। कृपया भिन्न कीवर्ड खोजें।"
          descriptionEnglish="No folk songs matched your search criteria or occasion filter. Try searching with different keywords."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => {
            const titlePawari = song.title_pawari || (song as any).title || 'पवारी लोकगीत';
            const titleHindi = song.title_hindi || '';
            const categoryName = song.category || (song as any).occasion || 'पारम्परिक';
            const region = (song as any).region || 'सतपुड़ा अंचल';
            const lyrics = song.lyrics_pawari || (song as any).lyrics || '';
            const meaning = song.lyrics_hindi_meaning || (song as any).hindi_meaning || '';
            const songSlug = song.slug || createSlug(titlePawari || song.id);
            const isPlayingThis = playingSongId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handleOpenSongPage(song)}
                className="bg-white border border-stone-200/90 hover:border-amber-500 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4 group relative shadow-2xs hover:shadow-md cursor-pointer hover:bg-amber-50/20"
              >
                <div className="space-y-3.5">
                  {/* Top Category Badge & Audio Trigger */}
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {categoryName}
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-950 tracking-tight leading-snug group-hover:text-amber-900 transition-colors pt-1">
                        {titlePawari}
                      </h3>
                      {titleHindi && titleHindi !== titlePawari && (
                        <p className="text-xs text-stone-500 font-serif italic">
                          {titleHindi}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(e, song)}
                      className={`p-2.5 rounded-2xl border transition cursor-pointer shrink-0 ${
                        isPlayingThis
                          ? 'bg-red-500 text-white border-red-600 animate-pulse'
                          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                      title={isPlayingThis ? 'रोकें (Stop)' : 'बोल सुनें (Listen)'}
                    >
                      {isPlayingThis ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Lyrics Preview Box */}
                  <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200/60 group-hover:bg-amber-50/70 transition">
                    <div className="text-[10px] font-mono text-amber-900/80 font-bold uppercase mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3 text-amber-700" />
                        <span>{lang === 'hi' ? 'बोल (Lyrics)' : 'Lyrics Preview'}</span>
                      </span>
                      <span className="text-[9px] text-stone-500">{region}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-serif text-stone-800 leading-relaxed italic line-clamp-3 whitespace-pre-line">
                      "{lyrics}"
                    </p>
                  </div>

                  {/* Hindi Meaning preview if available */}
                  {meaning && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono font-semibold text-stone-500 uppercase">
                        {lang === 'hi' ? 'हिंदी भावार्थ:' : 'Hindi Meaning:'}
                      </span>
                      <p className="text-stone-600 line-clamp-2 leading-relaxed font-serif">
                        {meaning}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action & Social Sharing Footer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-900 group-hover:text-amber-950 transition">
                      <span>{lang === 'hi' ? 'सम्पूर्ण गीत व भावार्थ पढ़ें' : 'Read Full Song & Meaning'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </span>
                  </div>

                  {/* Direct Share Bar for Card */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <SahityaShareBar
                      title={`पवारी लोकगीत: ${titlePawari}`}
                      subtitle={`${categoryName} (${region})`}
                      url={`/lokgeet/${songSlug}`}
                      category={categoryName}
                      typeLabel="पवारी लोकगीत"
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

