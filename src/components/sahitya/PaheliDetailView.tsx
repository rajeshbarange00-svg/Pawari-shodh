import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Volume2, 
  Tag, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariPaheliItem } from '../../types';
import { findPaheli, createSlug } from '../../lib/slugUtils';
import { SahityaShareBar } from './SahityaShareBar';
import { SAMPLE_PAHELI } from '../../data/pawariCulturalData';

export interface PaheliDetailViewProps {
  slugOrId: string;
  onBack?: () => void;
  onNavigateSection?: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
}

export const PaheliDetailView: React.FC<PaheliDetailViewProps> = ({
  slugOrId,
  onBack,
  onNavigateSection
}) => {
  const { lang, paheliList, setSelectedPaheliId, setActiveView } = useCms();
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Combine database with sample riddles
  const allPahelis = useMemo(() => {
    const combined = [...(paheliList || []), ...SAMPLE_PAHELI];
    const map = new Map<string, PawariPaheliItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [paheliList]);

  // Resolve current riddle
  const paheli = useMemo(() => {
    return findPaheli(allPahelis, slugOrId) || allPahelis[0] || null;
  }, [allPahelis, slugOrId]);

  useEffect(() => {
    setIsAnswerRevealed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [slugOrId]);

  // Prev / Next Riddle
  const currentIndex = allPahelis.findIndex(p => p.id === paheli?.id || p.slug === paheli?.slug);
  const prevPaheli = currentIndex > 0 ? allPahelis[currentIndex - 1] : null;
  const nextPaheli = currentIndex >= 0 && currentIndex < allPahelis.length - 1 ? allPahelis[currentIndex + 1] : null;

  // Related Riddles in same category
  const relatedPahelis = useMemo(() => {
    if (!paheli) return [];
    const cat = paheli.category || 'पारम्परिक';
    return allPahelis
      .filter(p => p.id !== paheli.id && (p.category === cat || p.category?.includes(cat)))
      .slice(0, 4);
  }, [allPahelis, paheli]);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[-*#_~]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectPaheli = (targetPaheli: PawariPaheliItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const targetSlug = targetPaheli.slug || createSlug(targetPaheli.riddle_pawari || targetPaheli.id);
    setSelectedPaheliId(targetSlug);
  };

  const handleBackToList = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedPaheliId(null);
    }
  };

  if (!paheli) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">पहेली उपलब्ध नहीं है</h2>
        <p className="text-stone-600 text-sm">यह पहेली नहीं मिली या हटाई गई है।</p>
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 text-white font-bold text-sm cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सम्पूर्ण पहेली संग्रह पर लौटें</span>
        </button>
      </div>
    );
  }

  const riddlePawari = paheli.riddle_pawari || (paheli as any).riddle_hindi || 'पवारी पहेली';
  const riddleHindi = (paheli as any).riddle_hindi || '';
  const answerHindi = paheli.answer_hindi || (paheli as any).answer || '';
  const explanationHindi = (paheli as any).explanation_hindi || (paheli as any).explanation || '';
  const category = paheli.category || 'पारम्परिक पहेली';

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
            <span>{lang === 'hi' ? '← सम्पूर्ण पहेली संग्रह' : '← Back to Riddles'}</span>
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

        {/* Prev / Next Riddle Controls */}
        <div className="flex items-center gap-2">
          {prevPaheli && (
            <button
              type="button"
              onClick={() => handleSelectPaheli(prevPaheli)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'पिछली पहेली' : 'Previous'}</span>
            </button>
          )}

          {nextPaheli && (
            <button
              type="button"
              onClick={() => handleSelectPaheli(nextPaheli)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <span className="hidden sm:inline">{lang === 'hi' ? 'अगली पहेली' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* ---------------- MAIN PAHELI CARD ---------------- */}
      <header className="bg-gradient-to-b from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-800/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900 text-white text-xs font-bold tracking-wide shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>{category}</span>
          </span>

          {/* Voice recitation button */}
          <button
            type="button"
            onClick={() => handleSpeak(riddlePawari)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              isPlayingAudio 
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
            <span>{lang === 'hi' ? 'बोलकर सुनें' : 'Listen'}</span>
          </button>
        </div>

        {/* Riddle Text in Big Typography */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 sm:p-8 space-y-3 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
            {lang === 'hi' ? 'पवारी पहेली (Riddle in Pawari):' : 'Pawari Riddle:'}
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-950 font-serif leading-relaxed">
            "{riddlePawari}"
          </p>
          {riddleHindi && riddleHindi !== riddlePawari && (
            <p className="text-sm sm:text-base text-stone-600 font-serif italic pt-2">
              हिंदी भाव: "{riddleHindi}"
            </p>
          )}
        </div>

        {/* Interactive Reveal Box */}
        <div className="bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 text-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="font-bold text-base text-stone-900">
              {lang === 'hi' ? 'क्या आप इसका उत्तर बूझ सकते हैं?' : 'Can you solve this riddle?'}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === 'hi' ? 'उत्तर देखने के लिए नीचे दिए बटन पर क्लिक करें' : 'Click the button below to reveal the answer'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAnswerRevealed(prev => !prev)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition cursor-pointer shadow-md ${
              isAnswerRevealed
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-900'
                : 'bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white animate-pulse'
            }`}
          >
            {isAnswerRevealed ? (
              <>
                <EyeOff className="w-4 h-4 text-stone-700" />
                <span>{lang === 'hi' ? 'उत्तर छिपाएं (Hide Answer)' : 'Hide Answer'}</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'उत्तर देखें (Reveal Answer)' : 'Reveal Answer'}</span>
              </>
            )}
          </button>

          {isAnswerRevealed && (
            <div className="pt-4 border-t border-stone-200 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-mono text-xs font-bold uppercase">{lang === 'hi' ? 'सही उत्तर:' : 'Correct Answer:'}</span>
                <span className="text-lg sm:text-xl font-extrabold font-serif">{answerHindi}</span>
              </div>

              {explanationHindi && (
                <p className="text-sm sm:text-base text-stone-700 font-serif max-w-xl mx-auto leading-relaxed pt-2">
                  <strong className="text-stone-900">{lang === 'hi' ? 'लोक व्याख्या:' : 'Explanation:'}</strong> {explanationHindi}
                </p>
              )}
            </div>
          )}
        </div>

      </header>

      {/* ---------------- SOCIAL SHARING BAR ---------------- */}
      <SahityaShareBar
        title={`पवारी पहेली: "${riddlePawari}"`}
        subtitle={`पवारी लोक-पहेली बूझें व मित्रों के साथ साझा करें`}
        url={`/paheli/${paheli.slug || paheli.id}`}
        category={category}
        typeLabel="पवारी पहेली"
        lang={lang}
        variant="full"
      />

      {/* ---------------- RELATED PAHELIS ---------------- */}
      {relatedPahelis.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif">
                {lang === 'hi' ? `अन्य पवारी पहेलियाँ (${category})` : 'Related Riddles'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPahelis.map(rel => (
              <div
                key={rel.id}
                onClick={() => handleSelectPaheli(rel)}
                className="group bg-white hover:bg-amber-50/40 border border-stone-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 transition shadow-2xs hover:shadow-sm cursor-pointer flex flex-col justify-between space-y-3"
              >
                <p className="text-base font-bold text-stone-900 group-hover:text-amber-950 font-serif line-clamp-2">
                  "{rel.riddle_pawari}"
                </p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-900 font-bold">
                  <span>{lang === 'hi' ? 'बूझें व उत्तर देखें' : 'Solve Riddle'}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BOTTOM ACTIONS ---------------- */}
      <footer className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBackToList}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>{lang === 'hi' ? 'सम्पूर्ण पहेली संग्रह पर लौटें' : 'Back to Riddles'}</span>
        </button>
      </footer>

    </article>
  );
};
