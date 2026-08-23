import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { PawariPaheliItem } from '../../types';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFilterBar } from './SahityaFilterBar';
import { SahityaEmptyState } from './SahityaEmptyState';
import { SahityaFooter } from './SahityaFooter';
import { SahityaShareBar } from './SahityaShareBar';
import { createSlug } from '../../lib/slugUtils';
import { SAMPLE_PAHELI } from '../../data/pawariCulturalData';

export interface PaheliViewProps {
  onNavigateSection: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenContributeModal?: () => void;
}

export const PaheliView: React.FC<PaheliViewProps> = ({
  onNavigateSection,
  onOpenContributeModal
}) => {
  const { lang, paheliList, setSelectedPaheliId } = useCms();

  const allPahelis = useMemo(() => {
    const combined = [...(paheliList || []), ...SAMPLE_PAHELI];
    const map = new Map<string, PawariPaheliItem>();
    combined.forEach(item => {
      if (item && item.id && !map.has(item.id)) {
        if (item.status === 'approved' || item.status === 'published' || (!item.status && !item.id.startsWith('contrib_'))) {
          map.set(item.id, item);
        }
      }
    });
    return Array.from(map.values());
  }, [paheliList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    allPahelis.forEach(item => {
      const cat = item.category || 'पारम्परिक';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return [
      { id: 'all', labelHindi: 'सभी पहेलियाँ (All)', labelEnglish: 'All Riddles', count: allPahelis.length },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        labelHindi: cat,
        labelEnglish: cat,
        count: counts[cat]
      }))
    ];
  }, [allPahelis]);

  const filteredPahelis = useMemo(() => {
    return allPahelis.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const riddlePawari = item.riddle_pawari || (item as any).riddle_hindi || '';
      const riddleHindi = (item as any).riddle_hindi || '';
      const answer = item.answer_hindi || (item as any).answer || '';
      const explanation = (item as any).explanation_hindi || (item as any).explanation || '';
      const cat = item.category || '';

      const matchesSearch = !q || (
        riddlePawari.toLowerCase().includes(q) ||
        riddleHindi.toLowerCase().includes(q) ||
        answer.toLowerCase().includes(q) ||
        explanation.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPahelis, searchQuery, selectedCategory]);

  const toggleReveal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRevealedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRevealAll = () => {
    const next: Record<string, boolean> = {};
    filteredPahelis.forEach(p => { next[p.id] = true; });
    setRevealedMap(next);
  };

  const handleHideAll = () => {
    setRevealedMap({});
  };

  const handleOpenPaheliPage = (item: PawariPaheliItem) => {
    const slug = item.slug || createSlug(item.riddle_pawari || item.id);
    setSelectedPaheliId(slug);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Shared Header */}
      <SahityaHeader
        titleHindi="पवारी पारम्परिक पहेलियाँ"
        titleEnglish="Pawari Folklore Riddles (Paheli)"
        subtitleHindi="ग्रामीण जीवन, खेती-किसानी, पशु-पक्षी, प्रकृति एवं लोक-ज्ञान पर आधारित मनोरंजक एवं ज्ञानवर्धक पहेलियाँ।"
        subtitleEnglish="Authentic cultural riddles and folklore brainteasers reflecting rural agrarian life, Satpura ecology, and ancestral wisdom."
        icon={HelpCircle}
        badgeHindi="मौखिक लोकसाहित्य"
        badgeEnglish="Oral Folklore"
        itemCount={allPahelis.length}
        currentSection="paheli"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Shared Filter Bar */}
      <SahityaFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={lang === 'hi' ? 'पहेली के बोल, उत्तर या विषय से खोजें...' : 'Search riddle, answer, or theme...'}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalResultsCount={filteredPahelis.length}
        onResetFilters={handleResetFilters}
        extraControls={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRevealAll}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सभी उत्तर दिखाएं' : 'Show All'}</span>
            </button>
            <button
              type="button"
              onClick={handleHideAll}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'छिपाएं' : 'Hide All'}</span>
            </button>
          </div>
        }
      />

      {/* Paheli Cards Grid */}
      {filteredPahelis.length === 0 ? (
        <SahityaEmptyState
          titleHindi="कोई पहेली नहीं मिली"
          titleEnglish="No riddles match your search"
          descriptionHindi="आपके द्वारा खोजे गए शब्दों के अनुसार कोई पहेली नहीं मिली। कृपया नया कीवर्ड खोजें या श्रेणी बदलें।"
          descriptionEnglish="No folklore riddles matched your query or selected category. Try searching for different keywords or resetting filters."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPahelis.map((item, idx) => {
            const isRevealed = Boolean(revealedMap[item.id]);
            const riddlePawari = item.riddle_pawari || (item as any).riddle_hindi || 'पवारी पहेली';
            const riddleHindi = (item as any).riddle_hindi || '';
            const answerHindi = item.answer_hindi || (item as any).answer || '';
            const explanationHindi = (item as any).explanation_hindi || (item as any).explanation || '';
            const category = item.category || 'पारम्परिक';
            const paheliSlug = item.slug || createSlug(riddlePawari || item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleOpenPaheliPage(item)}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative cursor-pointer hover:bg-amber-50/20 shadow-2xs"
              >
                <div className="space-y-3">
                  {/* Top Badge & Counter */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                      पहेली #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {category}
                    </span>
                  </div>

                  {/* Riddle Text (Pawari) */}
                  <div className="space-y-1.5">
                    <p className="text-base sm:text-lg font-serif font-bold text-amber-950 leading-relaxed italic group-hover:text-amber-900 transition">
                      "{riddlePawari}"
                    </p>

                    {riddleHindi && riddleHindi !== riddlePawari && (
                      <p className="text-xs text-stone-600 leading-relaxed font-serif">
                        <span className="font-semibold text-stone-500 mr-1 font-mono">{lang === 'hi' ? 'हिंदी भाव:' : 'Hindi:'}</span>
                        {riddleHindi}
                      </p>
                    )}
                  </div>

                  {/* Interactive Reveal Area */}
                  <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                    {isRevealed ? (
                      <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-300/80 rounded-2xl p-4 space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lang === 'hi' ? 'पहेली का उत्तर:' : 'Answer:'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleReveal(e, item.id)}
                            className="text-[11px] text-stone-500 hover:text-stone-700 font-medium cursor-pointer"
                          >
                            {lang === 'hi' ? 'छिपाएं' : 'Hide'}
                          </button>
                        </div>
                        <div className="text-base font-serif font-bold text-stone-900">
                          {answerHindi}
                        </div>
                        {explanationHindi && (
                          <p className="text-xs text-stone-600 leading-relaxed pt-1 border-t border-amber-200/60 font-serif">
                            <span className="font-semibold text-stone-700">{lang === 'hi' ? 'संदर्भ: ' : 'Context: '}</span>
                            {explanationHindi}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => toggleReveal(e, item.id)}
                        className="w-full py-2.5 px-3 rounded-2xl bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>{lang === 'hi' ? 'उत्तर जानें (Reveal Answer)' : 'Reveal Answer'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Action & Share Footer */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-900 group-hover:text-amber-950 transition">
                      <span>{lang === 'hi' ? 'विस्तृत पहेली पृष्ठ' : 'Full Riddle Page'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </span>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SahityaShareBar
                      title={`पवारी पहेली: "${riddlePawari}"`}
                      subtitle={`पहेली बूझें व मित्रों से पूछें`}
                      url={`/paheli/${paheliSlug}`}
                      category={category}
                      typeLabel="पवारी पहेली"
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

