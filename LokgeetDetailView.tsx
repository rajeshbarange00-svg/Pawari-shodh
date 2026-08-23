import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Tag, 
  MapPin, 
  Calendar, 
  User, 
  BookOpen, 
  Share2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Check,
  Compass,
  FileText
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariLokgeetItem } from '../../types';
import { findLokgeet, createSlug } from '../../lib/slugUtils';
import { SahityaShareBar } from './SahityaShareBar';
import { GOPINATH_KALBHOR_LOKGEET_COLLECTION } from '../../data/pawariLokgeetGopinathData';
import { SAMPLE_LOKGEET } from '../../data/pawariCulturalData';

export interface LokgeetDetailViewProps {
  slugOrId: string;
  onBack?: () => void;
  onNavigateSection?: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
}

export const LokgeetDetailView: React.FC<LokgeetDetailViewProps> = ({
  slugOrId,
  onBack,
  onNavigateSection
}) => {
  const { lang, lokgeetList, setSelectedLokgeetId, setActiveView } = useCms();

  // Combine database Lokgeet with hardcoded collections to ensure every single song resolves cleanly
  const allLokgeet = useMemo(() => {
    const combined = [...(lokgeetList || []), ...GOPINATH_KALBHOR_LOKGEET_COLLECTION, ...SAMPLE_LOKGEET];
    const map = new Map<string, PawariLokgeetItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [lokgeetList]);

  // Current Lokgeet item
  const song = useMemo(() => {
    return findLokgeet(allLokgeet, slugOrId) || allLokgeet[0] || null;
  }, [allLokgeet, slugOrId]);

  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeStanzaIndex, setActiveStanzaIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    // Scroll smoothly to top on song change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slugOrId]);

  // Find prev/next song
  const currentIndex = allLokgeet.findIndex(s => s.id === song?.id || s.slug === song?.slug);
  const prevSong = currentIndex > 0 ? allLokgeet[currentIndex - 1] : null;
  const nextSong = currentIndex >= 0 && currentIndex < allLokgeet.length - 1 ? allLokgeet[currentIndex + 1] : null;

  // Related songs in same category or occasion
  const relatedSongs = useMemo(() => {
    if (!song) return [];
    const cat = song.category || (song as any).occasion || '';
    return allLokgeet
      .filter(s => s.id !== song.id && (s.category === cat || (s as any).occasion === cat || s.category?.includes(cat)))
      .slice(0, 4);
  }, [allLokgeet, song]);

  // Normalize fields
  const titlePawari = song?.title_pawari || (song as any)?.title || 'पवारी लोकगीत';
  const titleHindi = song?.title_hindi || '';
  const lyricsPawari = song?.lyrics_pawari || (song as any)?.lyrics || '';
  const lyricsHindiMeaning = song?.lyrics_hindi_meaning || (song as any)?.hindi_meaning || '';
  const categoryName = song?.category || (song as any)?.occasion || 'पारम्परिक लोकगीत';
  const occasionName = (song as any)?.occasion || song?.category || 'मांगलिक प्रसंग';
  const regionName = (song as any)?.region || 'सतपुड़ा-ताप्ती अंचल (बैतूल, छिंदवाड़ा, सिवनी, वर्धा)';
  const collector = song?.singer_or_collector || (song as any)?.contributor_name || 'गोपीनाथ कालभोर संकलन';
  const audioUrl = song?.audio_url || '';
  const youtubeUrl = song?.youtube_url || '';

  // Parse lyrics into stanzas
  const stanzas = useMemo(() => {
    if (!lyricsPawari) return [];
    return lyricsPawari.split(/\n\s*\n/).map(st => st.trim()).filter(Boolean);
  }, [lyricsPawari]);

  // Handle Speech Recitation
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveStanzaIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = lyricsPawari.replace(/[-*#_~]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveStanzaIndex(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveStanzaIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSelectSong = (targetSong: PawariLokgeetItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    const targetSlug = targetSong.slug || createSlug(targetSong.title_pawari || targetSong.id);
    setSelectedLokgeetId(targetSlug);
  };

  const handleBackToList = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedLokgeetId(null);
    }
  };

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/lokgeet/${song?.slug || song?.id || slugOrId}`
    : `/lokgeet/${song?.slug || song?.id || slugOrId}`;

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Music className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">लोकगीत उपलब्ध नहीं है</h2>
        <p className="text-stone-600 text-sm">यह लोकगीत हटाया गया हो सकता है या लिंक में त्रुटि हो सकती है।</p>
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 text-white font-bold text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सम्पूर्ण लोकगीत संग्रह पर लौटें</span>
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- TOP NAVIGATION BAR & BREADCRUMBS ---------------- */}
      <nav aria-label="Breadcrumb" className="bg-white border border-amber-900/15 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-800" />
            <span>{lang === 'hi' ? '← सम्पूर्ण लोकगीत संग्रह' : '← Back to Lokgeet'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (onNavigateSection) onNavigateSection('hub');
              else setActiveView('books_blogs');
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>{lang === 'hi' ? 'साहित्य हब' : 'Literature Hub'}</span>
          </button>
        </div>

        {/* Prev / Next Lokgeet Controls */}
        <div className="flex items-center gap-2">
          {prevSong && (
            <button
              type="button"
              onClick={() => handleSelectSong(prevSong)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title={prevSong.title_pawari || prevSong.title_hindi}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'पिछला गीत' : 'Previous'}</span>
            </button>
          )}

          {nextSong && (
            <button
              type="button"
              onClick={() => handleSelectSong(nextSong)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title={nextSong.title_pawari || nextSong.title_hindi}
            >
              <span className="hidden sm:inline">{lang === 'hi' ? 'अगला गीत' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* ---------------- MAIN LOKGEET HERO CARD ---------------- */}
      <header className="bg-gradient-to-b from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-800/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Category & Region Metadata Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900 text-white text-xs font-bold tracking-wide shadow-2xs">
            <Music className="w-3.5 h-3.5 text-amber-300" />
            <span>{categoryName}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-950 border border-orange-300/80 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-orange-700" />
            <span>{occasionName}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-stone-600" />
            <span>{regionName}</span>
          </span>
        </div>

        {/* Big Devanagari Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-950 leading-tight font-serif tracking-tight">
            {titlePawari}
          </h1>
          {titleHindi && titleHindi !== titlePawari && (
            <p className="text-base sm:text-lg text-amber-900/80 font-medium font-serif italic">
              हिंदी शीर्षक: {titleHindi}
            </p>
          )}
        </div>

        {/* Collector / Contributor Attribution */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-amber-900/10 text-xs sm:text-sm text-stone-700">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-900">
              <User className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-stone-900">{lang === 'hi' ? 'संकलनकर्ता / गायक:' : 'Collector / Singer:'}</strong> {collector}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-orange-100 text-orange-900">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-stone-900">{lang === 'hi' ? 'माध्यम:' : 'Tradition:'}</strong> पवारी-भोयरी मौखिक लोक-परम्परा
            </span>
          </div>
        </div>

        {/* ---------------- AUDIO & SPEECH SYNTHESIS ENGINE ---------------- */}
        <div className="bg-amber-900 text-amber-50 rounded-2xl p-4 sm:p-5 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-800 text-amber-200 border border-amber-700">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-amber-100 flex items-center gap-2">
                <span>{lang === 'hi' ? 'लोकगीत स्वर-पाठ सुनें (Audio Recitation)' : 'Listen to Lokgeet Voice'}</span>
                {isPlayingAudio && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] animate-pulse">
                    सक्रिय (Playing)
                  </span>
                )}
              </h3>
              <p className="text-xs text-amber-300/80">
                {lang === 'hi'
                  ? 'पवारी लोक-लय और उच्चारण का अनुभव करने के लिए ऑडियो पाठ सुनें।'
                  : 'Listen to the traditional recitation rhythm and phonetic pronunciation.'}
              </p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* Speed selection */}
            <div className="flex items-center gap-1 bg-amber-950/60 rounded-lg p-1 border border-amber-700/50 text-[11px] font-mono">
              {[0.75, 0.9, 1.0].map(speed => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setAudioSpeed(speed)}
                  className={`px-2 py-1 rounded cursor-pointer transition ${
                    audioSpeed === speed
                      ? 'bg-amber-500 text-amber-950 font-bold'
                      : 'text-amber-300 hover:text-white'
                  }`}
                  title={`${speed}x गति`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-md ${
                isPlayingAudio
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'विराम दें (Pause)' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{lang === 'hi' ? 'गीत सुनें (Play)' : 'Play Recitation'}</span>
                </>
              )}
            </button>

            {/* If there's an external custom audio file */}
            {audioUrl && (
              <a
                href={audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 text-xs font-semibold border border-amber-600 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मूल ऑडियो' : 'Original Track'}</span>
              </a>
            )}
          </div>
        </div>

      </header>

      {/* ---------------- SOCIAL SHARING BAR ---------------- */}
      <SahityaShareBar
        title={`पवारी लोकगीत: ${titlePawari}`}
        subtitle={titleHindi ? `हिंदी: ${titleHindi} (${categoryName})` : `${categoryName} - सतपुड़ा ताप्ती अंचल`}
        url={`/lokgeet/${song.slug || song.id}`}
        category={categoryName}
        typeLabel="पवारी लोकगीत"
        lang={lang}
        variant="full"
      />

      {/* ---------------- FULL LYRICS (STANZA BY STANZA) ---------------- */}
      <section className="bg-white border-2 border-amber-900/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-amber-950 font-serif">
                {lang === 'hi' ? 'पवारी लोकगीत के बोल (Lyrics)' : 'Authentic Lyrics'}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {lang === 'hi' ? 'पारम्परिक पद एवं अंतरे' : 'Traditional Stanzas & Chorus'}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            {stanzas.length} {lang === 'hi' ? 'अंतरे' : 'Stanzas'}
          </span>
        </div>

        {/* Formatted Lyrics Box */}
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-6 sm:p-8 space-y-6">
          {stanzas.length > 0 ? (
            stanzas.map((stanza, idx) => (
              <div 
                key={idx} 
                className="space-y-1 relative pl-6 border-l-2 border-amber-400/80 hover:border-amber-600 transition"
              >
                <span className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-200 border border-amber-500 text-[10px] font-mono font-bold flex items-center justify-center text-amber-950">
                  {idx + 1}
                </span>
                <p className="text-lg sm:text-xl md:text-2xl text-stone-900 font-serif leading-relaxed whitespace-pre-line tracking-wide">
                  {stanza}
                </p>
              </div>
            ))
          ) : (
            <p className="text-lg sm:text-xl text-stone-900 font-serif leading-relaxed whitespace-pre-line">
              {lyricsPawari}
            </p>
          )}
        </div>
      </section>

      {/* ---------------- CULTURAL MEANING & CONTEXT ---------------- */}
      {lyricsHindiMeaning && (
        <section className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-orange-200/70">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-900">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-950 font-serif">
                {lang === 'hi' ? 'सांस्कृतिक भावार्थ व लोक-संदर्भ (Meaning & Context)' : 'Cultural Context & Meaning'}
              </h2>
              <p className="text-xs text-stone-600">
                {lang === 'hi' ? 'गीत में वर्णित सामाजिक, रीति-रिवाज एवं मानवीय भाव' : 'Folkloric symbolism, social rituals and emotion'}
              </p>
            </div>
          </div>

          <div className="prose prose-stone max-w-none text-stone-800 text-base sm:text-lg leading-relaxed font-serif whitespace-pre-line bg-white/80 p-5 rounded-2xl border border-orange-100">
            {lyricsHindiMeaning}
          </div>
        </section>
      )}

      {/* ---------------- CULTURAL IMPORTANCE CALLOUT ---------------- */}
      <div className="bg-stone-900 text-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-base uppercase tracking-wider font-mono">
            {lang === 'hi' ? 'पवारी लोक-संस्कृति की धरोहर' : 'Cultural Significance'}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          {lang === 'hi'
            ? 'पवारी लोकगीत केवल मनोरंजन का माध्यम नहीं हैं, अपितु वे सतपुड़ा की वादियों में पीढ़ी-दर-पीढ़ी संजोई गई ऐतिहासिक स्मृतियों, वैवाहिक संस्कारों, कृषि जीवन एवं माँ ताप्ती की अगाध भक्ति का सजीव दस्तावेज हैं।'
            : 'Pawari folk songs embody centuries of oral wisdom, agricultural rhythms, marriage ceremonies, and deep reverence for the sacred Tapti river.'}
        </p>
      </div>

      {/* ---------------- RELATED LOKGEET COLLECTION ---------------- */}
      {relatedSongs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                <Music className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                {lang === 'hi' ? `इसी प्रसंग के अन्य लोकगीत (${categoryName})` : 'Related Lokgeet in this Category'}
              </h2>
            </div>
            
            <button
              type="button"
              onClick={handleBackToList}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 transition cursor-pointer"
            >
              {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedSongs.map(rel => {
              const relTitlePawari = rel.title_pawari || (rel as any).title || 'पवारी लोकगीत';
              const relTitleHindi = rel.title_hindi || '';
              const relCategory = rel.category || (rel as any).occasion || 'पारम्परिक';
              const relExcerpt = (rel.lyrics_pawari || (rel as any).lyrics || '').slice(0, 80);

              return (
                <div
                  key={rel.id}
                  onClick={() => handleSelectSong(rel)}
                  className="group bg-white hover:bg-amber-50/40 border border-stone-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 transition shadow-2xs hover:shadow-sm cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {relCategory}
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition" />
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-950 font-serif transition">
                      {relTitlePawari}
                    </h3>
                    {relTitleHindi && relTitleHindi !== relTitlePawari && (
                      <p className="text-xs text-stone-600 italic">
                        {relTitleHindi}
                      </p>
                    )}

                    {relExcerpt && (
                      <p className="text-xs text-stone-500 line-clamp-2 pt-1 font-serif">
                        "{relExcerpt}..."
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                    <span>{lang === 'hi' ? 'सम्पूर्ण गीत व अर्थ पढ़ें' : 'Read Full Song'}</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-amber-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- BOTTOM FOOTER ACTIONS ---------------- */}
      <footer className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>{lang === 'hi' ? 'सम्पूर्ण लोकगीत संग्रह पर लौटें' : 'Back to Lokgeet Collection'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer"
          >
            ↑ {lang === 'hi' ? 'शीर्ष पर जाएं' : 'Back to Top'}
          </button>
        </div>
      </footer>

    </article>
  );
};
