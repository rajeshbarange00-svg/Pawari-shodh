import React from 'react';
import { 
  BookOpen, 
  Languages, 
  Music, 
  HelpCircle, 
  FileText, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Send, 
  Archive, 
  Users, 
  Library,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { Article, PawariShabdkoshItem, PawariLokgeetItem, PawariPaheliItem } from '../../types';
import { SAMPLE_SHABDKOSH, SAMPLE_PAHELI, SAMPLE_LOKGEET } from '../../data/pawariCulturalData';

export interface RelatedKnowledgeHubProps {
  contextType: 'article' | 'issue' | 'about' | 'editorial' | 'submission' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'book' | 'blog' | 'writer' | 'quiz' | 'general';
  category?: string;
  keywords?: string[];
  currentId?: string;
  className?: string;
}

export const RelatedKnowledgeHub: React.FC<RelatedKnowledgeHubProps> = ({
  contextType,
  category,
  keywords = [],
  currentId,
  className = ''
}) => {
  const { 
    lang, 
    articles, 
    issues, 
    shabdkoshList, 
    paheliList, 
    lokgeetList, 
    setActiveView, 
    setSelectedArticleId, 
    setSelectedIssueId, 
    setSelectedShabdkoshId, 
    setSelectedPaheliId, 
    setSelectedLokgeetId 
  } = useCms();

  // 1. Related Research Papers
  const relatedArticles = React.useMemo(() => {
    const published = articles.filter(a => !a.status || ['published', 'accepted', 'approved'].includes(a.status.toLowerCase()));
    if (contextType === 'article' && currentId) {
      return published
        .filter(a => a.id !== currentId && a.slug !== currentId && (a.category === category || a.keywords?.some(k => keywords.includes(k))))
        .slice(0, 3);
    }
    if (category) {
      const match = published.filter(a => a.category === category || a.category?.includes(category)).slice(0, 3);
      if (match.length > 0) return match;
    }
    return published.slice(0, 3);
  }, [articles, contextType, currentId, category, keywords]);

  // 2. Related Vocabulary (Shabdkosh)
  const relatedWords = React.useMemo(() => {
    const combined = [...(shabdkoshList || []), ...SAMPLE_SHABDKOSH];
    return combined.slice(0, 4);
  }, [shabdkoshList]);

  // 3. Related Folk Lore (Paheli & Lokgeet)
  const sampleRiddle = React.useMemo(() => {
    const combined = [...(paheliList || []), ...SAMPLE_PAHELI];
    return combined[0] || null;
  }, [paheliList]);

  const sampleSong = React.useMemo(() => {
    const combined = [...(lokgeetList || []), ...SAMPLE_LOKGEET];
    return combined[0] || null;
  }, [lokgeetList]);

  const handleNav = (view: PublicPageView, targetId?: string | null, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (view === 'article_detail' && targetId) setSelectedArticleId(targetId);
    if (view === 'pawari_shabdkosh' && targetId) setSelectedShabdkoshId(targetId);
    if (view === 'pawari_paheli' && targetId) setSelectedPaheliId(targetId);
    if (view === 'pawari_lokgeet' && targetId) setSelectedLokgeetId(targetId);

    setActiveView(view, targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={`bg-gradient-to-br from-amber-50/60 via-stone-50 to-orange-50/40 border border-amber-900/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-red-950 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'hi' ? 'परस्पर-संबद्ध शैक्षणिक व सांस्कृतिक संसाधन' : 'Interlinked Scholarly & Cultural Resources'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
            {lang === 'hi' ? 'संबंधित ज्ञान शाखाएँ एवं अग्रिम पठन' : 'Related Knowledge Hub & Further Reading'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Peer-Reviewed Research Connection */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-950 bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-md">
                <BookOpen className="w-3.5 h-3.5 text-red-800" />
                <span>{lang === 'hi' ? 'शोध पत्रिका आलेख' : 'Research Papers'}</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">Peer-Reviewed</span>
            </div>

            <h3 className="text-sm font-serif font-bold text-stone-900">
              {lang === 'hi' ? 'संबंधित विषय पर प्रकाशित शोध पत्र' : 'Related Research in Current Issue'}
            </h3>

            {relatedArticles.length > 0 ? (
              <ul className="space-y-2 pt-1 text-xs">
                {relatedArticles.slice(0, 2).map((art) => (
                  <li key={art.id} className="border-b border-stone-100 pb-1.5 last:border-0 last:pb-0">
                    <a
                      href={getUrlForView('article_detail', art.slug || art.id)}
                      onClick={(e) => handleNav('article_detail', art.slug || art.id, e)}
                      className="font-serif font-semibold text-stone-800 hover:text-red-900 line-clamp-2 transition leading-snug"
                    >
                      {lang === 'hi' ? art.title_hindi : (art.title_english || art.title_hindi)}
                    </a>
                    <span className="text-[10px] font-mono text-stone-500 block mt-0.5">
                      Vol. {art.volume} ({art.year}) • {art.category}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500 font-sans">
                {lang === 'hi' ? 'शोध पत्रिका के नवीन अंक में संपूर्ण शोध पत्र उपलब्ध हैं।' : 'Full articles available in the current journal archive.'}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <a
              href="/articles"
              onClick={(e) => handleNav('articles', null, e)}
              className="text-xs font-serif font-bold text-amber-900 hover:text-red-950 inline-flex items-center gap-1 group"
            >
              <span>{lang === 'hi' ? 'सभी शोध पत्र देखें' : 'View All Papers'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-700" />
            </a>
          </div>
        </div>

        {/* Card 2: Language & Shabdkosh / Folk Literature */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-950 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                <Languages className="w-3.5 h-3.5 text-amber-800" />
                <span>{lang === 'hi' ? 'पवारी भाषा एवं साहित्य' : 'Language & Shabdkosh'}</span>
              </span>
              <span className="text-[10px] font-mono text-amber-700 font-bold">100% संकलन</span>
            </div>

            <h3 className="text-sm font-serif font-bold text-stone-900">
              {lang === 'hi' ? 'डिजिटल शब्दकोश व पारम्परिक पहेलियाँ' : 'Pawari Shabdkosh & Riddles'}
            </h3>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1">
                <span className="text-[10px] font-mono text-amber-900 font-bold uppercase">
                  {lang === 'hi' ? '★ प्रमुख शब्दकोश पद' : 'Key Glossary Words'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {relatedWords.slice(0, 3).map((w, idx) => (
                    <a
                      key={idx}
                      href={getUrlForView('pawari_shabdkosh', null, null, null, null, w.slug || w.id)}
                      onClick={(e) => handleNav('pawari_shabdkosh', w.slug || w.id, e)}
                      className="px-2 py-0.5 bg-white text-stone-800 hover:text-red-950 font-serif font-bold rounded text-[11px] border border-stone-200 hover:border-amber-400 transition"
                    >
                      {w.word_pawari}
                    </a>
                  ))}
                </div>
              </div>

              {sampleRiddle && (
                <div className="p-2 bg-orange-50/60 rounded-xl border border-orange-200/60 text-[11px] text-stone-700">
                  <span className="font-bold text-orange-950 font-serif">{lang === 'hi' ? 'पहेली: ' : 'Riddle: '}</span>
                  <span className="italic font-serif line-clamp-1">"{sampleRiddle.riddle_pawari}"</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <a
              href="/shabdkosh"
              onClick={(e) => handleNav('pawari_shabdkosh', null, e)}
              className="text-xs font-serif font-bold text-amber-900 hover:text-red-950 inline-flex items-center gap-1 group"
            >
              <span>{lang === 'hi' ? 'शब्दकोश खोजें' : 'Explore Shabdkosh'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-700" />
            </a>
          </div>
        </div>

        {/* Card 3: Interactive Learning & Publication Action */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-2xs">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-950 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-md">
                <Award className="w-3.5 h-3.5 text-purple-800" />
                <span>{lang === 'hi' ? 'ज्ञान परीक्षा एवं योगदान' : 'Quiz & Publication'}</span>
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold">ई-प्रमाणपत्र</span>
            </div>

            <h3 className="text-sm font-serif font-bold text-stone-900">
              {lang === 'hi' ? 'सांस्कृतिक मूल्यांकन एवं शोध प्रस्तुति' : 'Interactive Assessment & Submission'}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पवारी संस्कृति ज्ञान परीक्षा में भाग लेकर आधिकारिक ई-प्रमाणपत्र प्राप्त करें अथवा अपना शोध पत्र सबमिट करें।'
                : 'Take the cultural certification exam or submit your original manuscript for the upcoming journal volume.'}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="/quiz"
                onClick={(e) => handleNav('pawari_quiz', null, e)}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 text-center text-xs font-serif font-bold transition flex items-center justify-center gap-1"
              >
                <Award className="w-3.5 h-3.5 text-purple-700" />
                <span>{lang === 'hi' ? 'क्विज़ दें' : 'Take Quiz'}</span>
              </a>

              <a
                href="/submit-manuscript"
                onClick={(e) => handleNav('submit_manuscript', null, e)}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 text-center text-xs font-serif font-bold transition flex items-center justify-center gap-1"
              >
                <Send className="w-3.5 h-3.5 text-rose-700" />
                <span>{lang === 'hi' ? 'लेख भेजें' : 'Submit Paper'}</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <a
              href="/author-guidelines"
              onClick={(e) => handleNav('author_guidelines', null, e)}
              className="text-xs font-serif font-bold text-amber-900 hover:text-red-950 inline-flex items-center gap-1 group"
            >
              <span>{lang === 'hi' ? 'लेखक दिशानिर्देश' : 'Author Guidelines'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-700" />
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};
