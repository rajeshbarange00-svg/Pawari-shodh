import React from 'react';
import { 
  BookOpen, 
  Languages, 
  Music, 
  HelpCircle, 
  Library, 
  Award, 
  Sparkles,
  ChevronRight,
  Landmark,
  FileText
} from 'lucide-react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';

export interface TopicCluster {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  icon: React.ComponentType<{ className?: string }>;
  targetView: PublicPageView;
  tab?: string;
  articleCategory?: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  itemCountBadge?: string;
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'linguistics',
    titleHindi: 'भाषा एवं भाषाविज्ञान',
    titleEnglish: 'Language & Linguistics',
    descriptionHindi: 'पवारी व्याकरण, शब्दकोश, ध्वनिविज्ञान एवं भाषा शोध',
    descriptionEnglish: 'Pawari grammar, lexicography, phonetics & linguistic research',
    icon: Languages,
    targetView: 'pawari_shabdkosh',
    tab: 'shabdkosh',
    articleCategory: 'भाषाविज्ञान (Linguistics)',
    colorBg: 'bg-amber-50 hover:bg-amber-100/80',
    colorBorder: 'border-amber-200/80 hover:border-amber-400',
    colorText: 'text-amber-950',
    itemCountBadge: 'शब्दकोश + शोध'
  },
  {
    id: 'folklore',
    titleHindi: 'लोक साहित्य एवं मौखिक परम्परा',
    titleEnglish: 'Folklore & Oral Traditions',
    descriptionHindi: 'पारम्परिक लोकगीत, पहेलियाँ, लोकगाथाएँ एवं रीति-रिवाज',
    descriptionEnglish: 'Traditional folk songs, riddles, ballads & living heritage',
    icon: Music,
    targetView: 'pawari_lokgeet',
    tab: 'lokgeet',
    articleCategory: 'लोक साहित्य (Folklore)',
    colorBg: 'bg-orange-50 hover:bg-orange-100/80',
    colorBorder: 'border-orange-200/80 hover:border-orange-400',
    colorText: 'text-orange-950',
    itemCountBadge: '400+ पहेलियाँ + गीत'
  },
  {
    id: 'history_ethnography',
    titleHindi: 'इतिहास, वंशावली एवं नृवंशविज्ञान',
    titleEnglish: 'History & Ethnography',
    descriptionHindi: 'क्षेत्रीय इतिहास, परमार/पंवार वंश परम्परा एवं जनजातीय अध्ययन',
    descriptionEnglish: 'Regional history, Parmar lineage & Central Indian ethnography',
    icon: Landmark,
    targetView: 'articles',
    articleCategory: 'इतिहास एवं संस्कृति (History)',
    colorBg: 'bg-stone-50 hover:bg-stone-100/80',
    colorBorder: 'border-stone-200/80 hover:border-stone-400',
    colorText: 'text-stone-900',
    itemCountBadge: 'ऐतिहासिक शोध'
  },
  {
    id: 'digital_library_reviews',
    titleHindi: 'डिजिटल ग्रंथालय व पुस्तक समीक्षाएँ',
    titleEnglish: 'Books, Writers & Reviews',
    descriptionHindi: 'पवारी साहित्यकार, संदर्भ पुस्तकें, ई-ग्रंथालय व आलोचनात्मक समीक्षाएँ',
    descriptionEnglish: 'Pawari authors, digital reference books & scholarly reviews',
    icon: Library,
    targetView: 'books_blogs',
    tab: 'books',
    colorBg: 'bg-emerald-50 hover:bg-emerald-100/80',
    colorBorder: 'border-emerald-200/80 hover:border-emerald-400',
    colorText: 'text-emerald-950',
    itemCountBadge: 'ग्रंथालय व समीक्षा'
  },
  {
    id: 'quiz_cultural_learning',
    titleHindi: 'ज्ञान परीक्षा एवं सांस्कृतिक शिक्षण',
    titleEnglish: 'Quiz & Cultural Learning',
    descriptionHindi: 'संस्कृति ज्ञान परीक्षा, ई-प्रमाणपत्र एवं इंटरैक्टिव अभ्यास',
    descriptionEnglish: 'Cultural knowledge assessment, certificates & practice',
    icon: Award,
    targetView: 'pawari_quiz',
    tab: 'quiz',
    colorBg: 'bg-purple-50 hover:bg-purple-100/80',
    colorBorder: 'border-purple-200/80 hover:border-purple-400',
    colorText: 'text-purple-950',
    itemCountBadge: 'प्रमाणपत्र परीक्षा'
  },
  {
    id: 'editorial_publishing',
    titleHindi: 'शोध प्रकाशन एवं अनुक्रमण व्यवस्था',
    titleEnglish: 'Journal, Indexing & Submissions',
    descriptionHindi: 'पीर-रिव्यू प्रक्रिया, DOI आवंटन, लेखक दिशानिर्देश व अनुक्रमण',
    descriptionEnglish: 'Peer review protocols, Zenodo DOI & author guidelines',
    icon: FileText,
    targetView: 'author_guidelines',
    colorBg: 'bg-rose-50 hover:bg-rose-100/80',
    colorBorder: 'border-rose-200/80 hover:border-rose-400',
    colorText: 'text-rose-950',
    itemCountBadge: 'Double-Blind Review'
  }
];

interface TopicClusterNavProps {
  currentClusterId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'compact' | 'full' | 'ribbon';
}

export const TopicClusterNav: React.FC<TopicClusterNavProps> = ({
  currentClusterId,
  title,
  subtitle,
  className = '',
  variant = 'full'
}) => {
  const { lang, setActiveView, setSelectedArticleId, setSelectedIssueId } = useCms();

  const handleClusterClick = (cluster: TopicCluster, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedArticleId(null);
    setSelectedIssueId(null);
    setActiveView(cluster.targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'ribbon') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-serif font-bold text-stone-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'hi' ? 'विषयवार ज्ञान संकुल (Topic Clusters):' : 'Explore by Topic Clusters:'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TOPIC_CLUSTERS.map((cluster) => {
            const Icon = cluster.icon;
            const isCurrent = cluster.id === currentClusterId;
            const href = getUrlForView(cluster.targetView);
            return (
              <a
                key={cluster.id}
                href={href}
                onClick={(e) => handleClusterClick(cluster, e)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-serif font-semibold border transition shadow-2xs ${
                  isCurrent
                    ? 'bg-red-950 text-amber-200 border-red-900 shadow-sm'
                    : `${cluster.colorBg} ${cluster.colorBorder} ${cluster.colorText}`
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'hi' ? cluster.titleHindi : cluster.titleEnglish}</span>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'hi' ? 'अकादमिक एवं सांस्कृतिक ज्ञान संकुल' : 'Interlinked Knowledge Clusters'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            {title || (lang === 'hi' ? 'विषयवार परस्पर-संबद्ध अध्ययन संकुल' : 'Topic-Based Research & Cultural Clusters')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-sans">
            {subtitle || (lang === 'hi' 
              ? 'शोध पत्रिका, शब्दकोश, लोकगीत, पहेलियाँ, समीक्षा एवं ज्ञान परीक्षा के बीच व्यवस्थित अंतर-संबंध।' 
              : 'Seamless semantic interlinking across peer-reviewed papers, dictionaries, songs, and literary archives.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPIC_CLUSTERS.map((cluster) => {
          const Icon = cluster.icon;
          const isCurrent = cluster.id === currentClusterId;
          const href = getUrlForView(cluster.targetView);

          return (
            <a
              key={cluster.id}
              href={href}
              onClick={(e) => handleClusterClick(cluster, e)}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between space-y-3 group cursor-pointer ${
                isCurrent
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                  : `${cluster.colorBg} ${cluster.colorBorder}`
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-stone-200/60 flex items-center justify-center text-amber-800 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  {cluster.itemCountBadge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/90 border border-stone-200 text-stone-700">
                      {cluster.itemCountBadge}
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-serif font-bold ${cluster.colorText} group-hover:text-red-950 transition leading-snug`}>
                  {lang === 'hi' ? cluster.titleHindi : cluster.titleEnglish}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed font-sans line-clamp-2">
                  {lang === 'hi' ? cluster.descriptionHindi : cluster.descriptionEnglish}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-serif font-bold text-amber-900 group-hover:text-red-950">
                <span>{lang === 'hi' ? 'अन्वेषण करें' : 'Explore Cluster'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-700" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
