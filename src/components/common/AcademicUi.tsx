import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadPdf } from '../../lib/pdfUtils';
import { Article } from '../../types';
import { 
  ShieldCheck, 
  Globe, 
  Clock, 
  FileCheck2, 
  Award, 
  CheckCircle2, 
  Download, 
  Eye, 
  Share2, 
  BookOpen, 
  Quote, 
  ChevronRight, 
  ExternalLink,
  Copy,
  Check,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

/* ==========================================================================
   1. ACADEMIC SECTION HEADER (3D Scholarly, left-aligned, bilingual)
   ========================================================================== */
interface AcademicSectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  badgeVariant?: 'maroon' | 'gold' | 'teal' | 'stone';
  title?: string;
  titleHindi?: string;
  titleEnglish?: string;
  subtitle?: string;
  descriptionHindi?: string;
  descriptionEnglish?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export const AcademicSectionHeader: React.FC<AcademicSectionHeaderProps> = ({
  badge,
  badgeIcon,
  badgeVariant = 'maroon',
  title,
  titleHindi,
  titleEnglish,
  subtitle,
  descriptionHindi,
  descriptionEnglish,
  actionLabel,
  actionHref,
  onAction,
  actionButton,
  className = ''
}) => {
  const { lang } = useCms();

  const finalTitle = title || (lang === 'hi' ? titleHindi : titleEnglish) || titleHindi || titleEnglish || '';
  const finalDesc = subtitle || (lang === 'hi' ? (descriptionHindi || descriptionEnglish) : (descriptionEnglish || descriptionHindi)) || '';

  const badgeStyles = {
    maroon: 'bg-red-950/10 text-red-950 border-red-900/25',
    gold: 'bg-amber-500/15 text-amber-950 border-amber-500/35',
    teal: 'bg-teal-900/10 text-teal-950 border-teal-800/25',
    stone: 'bg-stone-100 text-stone-800 border-stone-300'
  }[badgeVariant];

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-5 ${className}`}>
      <div className="space-y-2 max-w-3xl">
        {badge && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-2xs ${badgeStyles}`}>
            {badgeIcon || <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
            <span>{badge}</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
          {finalTitle}
        </h2>
        {finalDesc && (
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl font-sans">
            {finalDesc}
          </p>
        )}
      </div>

      {(actionButton || (actionLabel && onAction)) && (
        <div className="shrink-0">
          {actionButton || (
            <button
              onClick={onAction}
              className="gloss-3d-btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   2. TRUST BADGE MATRIX (Peer-Reviewed, Open Access, Zero APC, DOI, etc.)
   ========================================================================== */
export const TrustBadgeMatrix: React.FC<{ lang?: 'hi' | 'en'; className?: string }> = ({ lang: propLang, className = '' }) => {
  const { lang: contextLang } = useCms();
  const lang = propLang || contextLang;

  const badges = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      titleHi: 'डबल-ब्लाइंड पियर रिव्यू',
      titleEn: 'Double-Blind Review',
      subtitleHi: 'कठोर शैक्षणिक मानक',
      subtitleEn: 'Rigorous Standards',
      glow: 'from-emerald-500/10 to-transparent'
    },
    {
      icon: <Globe className="w-5 h-5 text-sky-700" />,
      titleHi: 'मुक्त पहुंच (Open Access)',
      titleEn: 'Open Access Journal',
      subtitleHi: 'CC BY-NC 4.0 लाइसेंस',
      subtitleEn: 'CC BY-NC 4.0 License',
      glow: 'from-sky-500/10 to-transparent'
    },
    {
      icon: <Award className="w-5 h-5 text-amber-700" />,
      titleHi: 'शून्य प्रकाशन शुल्क (Zero APC)',
      titleEn: 'Zero APC (Free)',
      subtitleHi: 'निःशुल्क शोध प्रकाशन',
      subtitleEn: 'No Submission Fees',
      glow: 'from-amber-500/10 to-transparent'
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-indigo-700" />,
      titleHi: 'द्विभाषी शोध पत्रिका',
      titleEn: 'Bilingual Publishing',
      subtitleHi: 'हिंदी एवं अंग्रेजी माध्यम',
      subtitleEn: 'Hindi & English',
      glow: 'from-indigo-500/10 to-transparent'
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-700" />,
      titleHi: 'अर्धवार्षिक प्रकाशन',
      titleEn: 'Half-Yearly Journal',
      subtitleHi: 'जून व दिसंबर अंक',
      subtitleEn: 'June & Dec Issues',
      glow: 'from-purple-500/10 to-transparent'
    },
    {
      icon: <Layers className="w-5 h-5 text-red-800" />,
      titleHi: 'स्थायी डिजिटल DOI',
      titleEn: 'Permanent DOI',
      subtitleHi: 'Zenodo / Crossref / Index',
      subtitleEn: 'Zenodo / Crossref',
      glow: 'from-red-500/10 to-transparent'
    },
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 ${className}`}>
      {badges.map((b, idx) => (
        <div 
          key={idx}
          className="gloss-3d-card rounded-2xl p-4 text-center flex flex-col items-center justify-between space-y-2 relative overflow-hidden group"
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${b.glow} pointer-events-none opacity-40 group-hover:opacity-70 transition`} />
          <div className="relative z-10 p-2.5 rounded-xl bg-white shadow-2xs border border-stone-200/80 group-hover:scale-105 transition duration-200">
            {b.icon}
          </div>
          <div className="relative z-10 space-y-0.5">
            <strong className="block font-serif font-bold text-stone-900 text-xs leading-tight">
              {lang === 'hi' ? b.titleHi : b.titleEn}
            </strong>
            <span className="text-[10px] text-stone-500 font-medium leading-tight block">
              {lang === 'hi' ? b.subtitleHi : b.subtitleEn}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ==========================================================================
   3. UNIFIED SCHOLARLY ARTICLE CARD (3D Glossy, rich metadata, elevated actions)
   ========================================================================== */
interface AcademicArticleCardProps {
  article: Article;
  lang?: 'hi' | 'en';
  onSelect?: () => void;
  onArticleClick?: (id: string) => void;
  onOpenPdf?: () => void;
  onPdfView?: (e: React.MouseEvent, article: Article) => void;
  onDownloadPdf?: () => void;
  onPdfDownload?: (e: React.MouseEvent, id: string, url: string, title?: string) => void;
  onShare?: () => void;
  onShareClick?: (article: Article) => void;
  onCiteClick?: (article: Article) => void;
  onCopyCitation?: (format: 'apa' | 'mla' | 'bibtex') => void;
  isCompact?: boolean;
}

export const AcademicArticleCard: React.FC<AcademicArticleCardProps> = ({
  article,
  lang: propLang,
  onSelect,
  onArticleClick,
  onOpenPdf,
  onPdfView,
  onDownloadPdf,
  onPdfDownload,
  onShare,
  onShareClick,
  onCiteClick,
  onCopyCitation,
  isCompact = false,
}) => {
  const { lang: contextLang, openPdfViewer, incrementArticleViews, incrementArticleDownloads } = useCms();
  const lang = propLang || contextLang;
  const [isAbstractOpen, setIsAbstractOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const title = lang === 'hi' ? (article.title_hindi || article.title_english) : (article.title_english || article.title_hindi);
  const secondaryTitle = lang === 'hi' ? article.title_english : article.title_hindi;
  const abstract = lang === 'hi' ? (article.abstract_hindi || article.abstract_english) : (article.abstract_english || article.abstract_hindi);

  const handleCardClick = () => {
    if (onArticleClick) {
      onArticleClick(article.id);
    } else if (onSelect) {
      onSelect();
    }
  };

  const handleCitation = (e: React.MouseEvent, format: 'apa' | 'mla' | 'bibtex') => {
    e.stopPropagation();
    if (onCiteClick) {
      onCiteClick(article);
      return;
    }
    if (onCopyCitation) {
      onCopyCitation(format);
      return;
    }
    const authors = article.authors ? article.authors.map((a: any) => a.name).join(', ') : 'Author';
    const year = article.year || '2026';
    const titleText = article.title_english || article.title_hindi;
    const vol = article.volume || '1';
    const iss = article.issue || '1';
    const pages = article.page_numbers || '01-15';
    const doi = article.doi || '10.5281/zenodo.18490543';

    let text = '';
    if (format === 'apa') {
      text = `${authors} (${year}). ${titleText}. Pawari Shodh Patrika, ${vol}(${iss}), ${pages}. https://doi.org/${doi}`;
    } else if (format === 'mla') {
      text = `${authors}. "${titleText}." Pawari Shodh Patrika, vol. ${vol}, no. ${iss}, ${year}, pp. ${pages}.`;
    } else if (format === 'bibtex') {
      text = `@article{psp_${article.id},\n  author = {${authors}},\n  title = {${titleText}},\n  journal = {Pawari Shodh Patrika},\n  volume = {${vol}},\n  number = {${iss}},\n  pages = {${pages}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  return (
    <article 
      onClick={handleCardClick}
      className="gloss-3d-card rounded-2xl p-5 sm:p-6 transition cursor-pointer flex flex-col justify-between space-y-4 group relative"
    >
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-stone-100/90 text-stone-700 font-bold border border-stone-200/80 shadow-2xs">
            Vol {article.volume || 1}, Iss {article.issue || 1} • {article.year || 2026}
          </span>
          {article.category && (
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-900 font-bold border border-amber-500/25 shadow-2xs">
              {article.category}
            </span>
          )}
          {article.doi && (
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-900 font-semibold border border-sky-200/80 hidden sm:inline shadow-2xs">
              DOI: {article.doi}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-stone-500 font-mono text-[11px]">
          {article.page_numbers && (
            <span className="bg-stone-100/60 px-2 py-0.5 rounded border border-stone-200/60">pp. {article.page_numbers}</span>
          )}
          {article.views !== undefined && (
            <span className="flex items-center space-x-1" title="Views">
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span>{article.views}</span>
            </span>
          )}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 group-hover:text-red-950 transition leading-snug">
          {title}
        </h3>
        {secondaryTitle && secondaryTitle !== title && (
          <p className="text-xs sm:text-sm text-stone-500 font-serif italic leading-snug">
            {secondaryTitle}
          </p>
        )}
      </div>

      {/* Authors & Institutions */}
      {article.authors && article.authors.length > 0 && (
        <div className="text-xs text-stone-700 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-stone-900">
              {article.authors.map(a => a.name).join(', ')}
            </span>
          </div>
          {article.authors[0]?.affiliation && (
            <div className="text-[11px] text-stone-500 flex items-center gap-1">
              <Building className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="truncate">{article.authors[0].affiliation}</span>
            </div>
          )}
        </div>
      )}

      {/* Abstract Snippet / Toggle */}
      {abstract && (
        <div className="space-y-1.5">
          <p className={`text-xs sm:text-sm text-stone-600 leading-relaxed ${isAbstractOpen ? '' : 'line-clamp-2'}`}>
            <span className="font-semibold text-stone-900">{lang === 'hi' ? 'सारांश: ' : 'Abstract: '}</span>
            {abstract}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAbstractOpen(!isAbstractOpen);
            }}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer inline-flex items-center gap-0.5"
          >
            <span>{isAbstractOpen ? (lang === 'hi' ? 'संक्षिप्त करें ↑' : 'Show Less ↑') : (lang === 'hi' ? 'पूरा सारांश पढ़ें ↓' : 'Read Abstract ↓')}</span>
          </button>
        </div>
      )}

      {/* Keywords */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{lang === 'hi' ? 'कीवर्ड:' : 'Keywords:'}</span>
          {article.keywords.slice(0, 4).map((kw, i) => (
            <span key={i} className="text-[10px] bg-stone-100/90 text-stone-700 px-2 py-0.5 rounded-md font-mono border border-stone-200/70">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Actions Row */}
      <div 
        className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          {/* Read Paper Button */}
          <button
            onClick={handleCardClick}
            className="gloss-3d-btn-maroon px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'hi' ? 'शोध पत्र पढ़ें' : 'Read Full Paper'}</span>
          </button>

          {/* Direct PDF View Button */}
          {article.pdf_url && (
            <button
              onClick={(e) => {
                if (onPdfView) {
                  onPdfView(e, article);
                } else if (onOpenPdf) {
                  onOpenPdf();
                } else {
                  incrementArticleViews(article.id);
                  openPdfViewer(article.pdf_url!, lang === 'hi' ? article.title_hindi : article.title_english);
                }
              }}
              className="gloss-3d-btn-secondary px-2.5 py-1.5 text-xs font-semibold rounded-xl flex items-center space-x-1 cursor-pointer"
              title="View PDF"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          {/* Download PDF Button */}
          {article.pdf_url && (
            <button
              onClick={(e) => {
                if (onPdfDownload) {
                  onPdfDownload(e, article.id, article.pdf_url!, `${article.slug || 'article'}.pdf`);
                } else if (onDownloadPdf) {
                  onDownloadPdf();
                } else {
                  incrementArticleDownloads(article.id);
                  downloadPdf(article.pdf_url!, `${article.slug || 'psp-article'}.pdf`);
                }
              }}
              className="gloss-3d-btn-secondary p-1.5 rounded-xl cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
            </button>
          )}
        </div>

        {/* Citation & Share */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={(e) => handleCitation(e, 'apa')}
            className="gloss-3d-btn-secondary px-2.5 py-1 text-[11px] font-mono rounded-lg flex items-center space-x-1 cursor-pointer"
            title="Cite Article (APA/MLA)"
          >
            {copiedFormat === 'apa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Quote className="w-3 h-3 text-amber-800" />}
            <span>{copiedFormat === 'apa' ? 'Copied' : 'Cite'}</span>
          </button>

          {(onShare || onShareClick) && (
            <button
              onClick={() => onShareClick ? onShareClick(article) : onShare?.()}
              className="gloss-3d-btn-secondary p-1.5 rounded-lg text-stone-600 hover:text-stone-900 cursor-pointer"
              title="Share Paper"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

/* ==========================================================================
   4. INDEXING & ACADEMIC REPOSITORIES BAR
   ========================================================================== */
export const AcademicIndexingBanner: React.FC<{ lang?: 'hi' | 'en'; className?: string }> = ({ lang: propLang, className = '' }) => {
  const { lang: contextLang } = useCms();
  const lang = propLang || contextLang;

  const indexingPartners = [
    { name: 'Zenodo / CERN', tag: 'Open DOI Archive', badge: 'DOI: 10.5281' },
    { name: 'Crossref', tag: 'Metadata Registry', badge: 'Registered' },
    { name: 'Google Scholar', tag: 'Academic Index', badge: 'Searchable' },
    { name: 'ROAD Directory', tag: 'ISSN Open Access', badge: 'Verified' },
    { name: 'OpenAIRE', tag: 'European Research', badge: 'Harvested' },
    { name: 'Internet Archive', tag: 'Permanent Preservation', badge: 'Archived' },
  ];

  return (
    <div className={`gloss-3d-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center border border-amber-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base leading-tight">
              {lang === 'hi' ? 'अकादमिक इंडेक्सिंग एवं शोध डेटाबेस' : 'Academic Indexing & Research Repositories'}
            </h3>
            <p className="text-[11px] text-stone-500">
              {lang === 'hi' ? 'स्थायी डिजिटल संरक्षण, डीओआई व अकादमिक खोज' : 'Permanent Digital Archiving, DOI & Indexing Standards'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-amber-900 bg-amber-500/10 border border-amber-500/30 font-semibold self-start sm:self-auto">
          <span>CC BY-NC 4.0</span>
          <span>•</span>
          <span>Open Access</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {indexingPartners.map((item, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-xl bg-white/80 border border-stone-200/80 text-center hover:border-amber-500/50 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-1.5 group"
          >
            <div>
              <span className="block font-bold text-xs text-stone-900 font-serif group-hover:text-red-950 transition">{item.name}</span>
              <span className="block text-[10px] text-stone-500 mt-0.5">{item.tag}</span>
            </div>
            <span className="inline-block text-[9px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

