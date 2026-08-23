import React, { useState, useEffect } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getCanonicalUrl, getUrlForView } from '../../lib/router';
import { updateMetaTags } from '../../lib/seo';
import { CustomSectionBlock } from '../../types';
import { getEmbeddablePdfUrl, downloadPdf } from '../../lib/pdfUtils';
import { PdfCanvasViewer } from '../common/PdfCanvasViewer';
import { SharePaperModal } from '../common/SharePaperModal';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  Mail, 
  Building, 
  FileText,
  Quote,
  ShieldCheck,
  ExternalLink,
  Printer,
  List,
  Calendar,
  ZoomIn,
  ZoomOut,
  Award,
  Hash,
  Sparkles,
  Info,
  X
} from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { 
    lang, 
    articles, 
    selectedArticleId, 
    setActiveView, 
    openPdfViewer, 
    incrementArticleDownloads,
    loadingData,
    settings,
    fetchArticleByIdOrSlug
  } = useCms();

  const [fetchingTargetArticle, setFetchingTargetArticle] = useState(false);

  const article = selectedArticleId 
    ? articles.find(a => a.id === selectedArticleId || a.slug === selectedArticleId) 
    : articles[0];

  useEffect(() => {
    let isMounted = true;
    if (selectedArticleId && !article && !loadingData && fetchArticleByIdOrSlug) {
      setFetchingTargetArticle(true);
      fetchArticleByIdOrSlug(selectedArticleId).finally(() => {
        if (isMounted) setFetchingTargetArticle(false);
      });
    }
    return () => { isMounted = false; };
  }, [selectedArticleId, article, loadingData, fetchArticleByIdOrSlug]);

  const hasFullText = Boolean(
    article?.content_mode === 'full_text' ||
    article?.full_text_introduction ||
    article?.full_text_results_discussion ||
    article?.full_text_methodology ||
    (article?.custom_sections && article.custom_sections.length > 0)
  );

  const [activeTab, setActiveTab] = useState<'full_text' | 'abstract' | 'pdf' | 'citation'>(
    hasFullText ? 'full_text' : 'abstract'
  );
  const [selectedFigure, setSelectedFigure] = useState<CustomSectionBlock | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [displayPdfUrl, setDisplayPdfUrl] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        setReadingProgress(Math.min(100, (scrollTop / scrollHeight) * 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (article?.pdf_url) {
      const { displayUrl, cleanup } = getEmbeddablePdfUrl(article.pdf_url);
      setDisplayPdfUrl(displayUrl);
      return () => cleanup();
    } else {
      setDisplayPdfUrl('');
    }
  }, [article?.pdf_url]);

  useEffect(() => {
    if (!article) return;
    updateMetaTags('article_detail', settings, article, lang);
  }, [article, settings, lang]);

  useEffect(() => {
    if (hasFullText && activeTab !== 'full_text' && activeTab !== 'pdf' && activeTab !== 'citation') {
      setActiveTab('full_text');
    }
  }, [selectedArticleId, hasFullText]);

  if ((loadingData || fetchingTargetArticle) && selectedArticleId && !article) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 text-center text-slate-600 font-serif space-y-4 bg-white rounded-3xl border border-amber-900/10 shadow-md">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-amber-950">
          {lang === 'hi' ? 'शोध पत्र लोड हो रहा है, कृपया प्रतीक्षा करें...' : 'Loading research paper, please wait...'}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 text-center text-slate-600 font-serif space-y-4 bg-white rounded-3xl border border-amber-900/10 shadow-md">
        <h3 className="text-lg font-bold text-red-950">{lang === 'hi' ? 'शोध पत्र नहीं मिला' : 'Research Paper Not Found'}</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {lang === 'hi' ? 'यह शोध पत्र हटा दिया गया है या शेयर लिंक अमान्य है।' : 'This research paper may have been removed or the shared link is invalid.'}
        </p>
        <button 
          onClick={() => setActiveView('articles')} 
          className="mt-2 px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl shadow transition"
        >
          {lang === 'hi' ? 'सभी शोध पत्र देखें' : 'View All Research Papers'}
        </button>
      </div>
    );
  }

  const authorsText = article.authors.map(a => a.name).join(', ');
  const journalTitle = 'Pawari Shodh Patrika';
  const doiText = article.doi || `10.5281/zenodo.psp.${article.year}.${article.id}`;

  // Citations
  const citations = {
    apa: article.citation_text || `${authorsText}. (${article.year}). ${article.title_english || article.title_hindi}. ${journalTitle}, ${article.volume}(${article.issue}), ${article.page_numbers || '01-15'}. https://doi.org/${doiText}`,
    mla: `${authorsText}. "${article.title_english || article.title_hindi}." ${journalTitle}, vol. ${article.volume}, no. ${article.issue}, ${article.year}, pp. ${article.page_numbers || '01-15'}.`,
    chicago: `${authorsText}. "${article.title_english || article.title_hindi}." ${journalTitle} ${article.volume}, no. ${article.issue} (${article.year}): ${article.page_numbers || '01-15'}.`
  };

  const handleCopyCitation = (type: keyof typeof citations) => {
    navigator.clipboard.writeText(citations[type]);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleCopyFullText = () => {
    const sections = [
      article.title_hindi,
      article.title_english,
      `Authors: ${authorsText}`,
      `Abstract (Hindi): ${article.abstract_hindi}`,
      `Abstract (English): ${article.abstract_english}`,
      article.full_text_introduction,
      article.full_text_literature_review,
      article.full_text_methodology,
      article.full_text_results_discussion,
      article.full_text_conclusion,
      article.full_text_acknowledgement,
      article.references ? `References:\n${article.references.join('\n')}` : ''
    ].filter(Boolean).join('\n\n');

    navigator.clipboard.writeText(sections);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownload = () => {
    if (article.id && (displayPdfUrl || article.pdf_url)) {
      incrementArticleDownloads(article.id);
      downloadPdf(displayPdfUrl || article.pdf_url, `${article.title_english || 'article'}.pdf`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render text paragraphs with comfortable spacing
  const renderFormattedParagraphs = (text?: string) => {
    if (!text) return null;
    return text.split('\n\n').map((para, i) => (
      <p key={i} className="mb-4 leading-relaxed font-sans text-slate-800 text-justify">
        {para.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j < para.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const fontSizeClasses = {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg'
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-8 py-3 sm:py-8 space-y-4 sm:space-y-8 animate-in fade-in duration-200 print:p-0 print:m-0 print:max-w-none">
      
      {/* Sticky Reading Progress Bar Scroller */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-amber-950/20 print:hidden pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 transition-all duration-75 shadow-sm"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back Button & Navigation Bar (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={() => setActiveView('articles')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-950 hover:text-red-800 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'शोध पत्र सूची पर वापस जाएं' : 'Back to Articles Index'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-300 transition shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>{lang === 'hi' ? 'प्रिंट / PDF बनाएं' : 'Print / Save PDF'}</span>
          </button>

          <button
            onClick={handleCopyFullText}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl border border-slate-300 transition shadow-xs"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-700" />}
            <span>{copiedText ? (lang === 'hi' ? 'कॉपी हो गया' : 'Copied!') : (lang === 'hi' ? 'पूरा लेख कॉपी करें' : 'Copy Text')}</span>
          </button>
        </div>
      </div>

      {/* Main Journal Article Header Container */}
      <article className="bg-white border border-amber-900/15 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Top Header Banner for Journal Metadata */}
        <header className="border-b-2 border-red-950/20 pb-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-950 text-amber-300 font-bold px-3 py-1 rounded-md text-xs tracking-wide">
                {article.article_type || 'ORIGINAL RESEARCH ARTICLE (मूल शोध पत्र)'}
              </span>
              <span className="bg-amber-500/20 text-red-950 font-bold px-3 py-1 rounded-md text-xs border border-amber-500/40">
                Vol. {article.volume}, Issue {article.issue} ({article.year})
              </span>
              <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-md text-xs border border-slate-200">
                {article.category}
              </span>
              <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-xs border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Open Access (CC BY-NC 4.0)</span>
              </span>
            </div>

            <div className="text-slate-600 font-mono text-xs flex items-center space-x-1.5">
              <span className="font-bold text-slate-500">DOI:</span>
              <a 
                href={`https://doi.org/${doiText}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-900 font-bold hover:underline flex items-center space-x-1 bg-red-50 px-2 py-0.5 rounded border border-red-200"
              >
                <span>{doiText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Running Short Title if present */}
          {article.short_title && (
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Running Title: {article.short_title}
            </p>
          )}

          {/* Article Titles - H1 for primary searchability */}
          <div className="space-y-3 pt-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-950 leading-tight tracking-tight">
              {article.title_hindi}
            </h1>
            {article.title_english && (
              <h2 className="text-lg sm:text-2xl font-serif text-slate-800 italic leading-snug border-l-4 border-amber-500 pl-3.5">
                {article.title_english}
              </h2>
            )}
          </div>

          {/* Page numbers & Journal citation header line */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 pt-2 border-t border-slate-100">
            <span>Journal: <strong>Pawari Shodh Patrika</strong></span>
            <span>•</span>
            <span>Pages: <strong>{article.page_numbers || '01-15'}</strong></span>
            <span>•</span>
            <span>Language: <strong>{article.language}</strong></span>
          </div>

        </header>

        {/* Authors & Affiliations Block */}
        <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-900/10 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
            <h3 className="text-xs font-serif font-bold text-red-950 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'लेखक मंडल एवं सम्बद्ध संस्थान (Authors & Affiliations)' : 'Authors & Affiliations'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.authors.map((auth, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-amber-800 font-mono font-normal text-xs bg-amber-100 px-1.5 py-0.5 rounded">
                      [{idx + 1}]
                    </span>
                    <span>{auth.name}</span>
                  </div>
                  {auth.is_corresponding && (
                    <span className="bg-amber-500 text-red-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-600/30">
                      {lang === 'hi' ? 'मुख्य शोधकर्ता (Corresponding)' : 'Corresponding Author'}
                    </span>
                  )}
                </div>

                {auth.affiliation && (
                  <p className="text-xs text-slate-700 flex items-start space-x-1.5 leading-normal">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{auth.affiliation}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  {auth.email && (
                    <a href={`mailto:${auth.email}`} className="text-red-900 hover:underline font-mono flex items-center space-x-1 text-[11px]">
                      <Mail className="w-3 h-3 text-red-700 shrink-0" />
                      <span>{auth.email}</span>
                    </a>
                  )}

                  {auth.orcid && (
                    <a 
                      href={auth.orcid.startsWith('http') ? auth.orcid : `https://orcid.org/${auth.orcid}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-mono flex items-center space-x-1 text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <span className="font-bold text-[10px] text-emerald-800">iD</span>
                      <span>{auth.orcid}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Timeline History Dates Line */}
        {(article.date_received || article.date_revised || article.date_accepted || article.date_published) && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs font-mono text-slate-600 flex flex-wrap items-center justify-around gap-3">
            {article.date_received && (
              <div><strong className="text-slate-800">Received:</strong> {article.date_received}</div>
            )}
            {article.date_revised && (
              <div><strong className="text-slate-800">Revised:</strong> {article.date_revised}</div>
            )}
            {article.date_accepted && (
              <div><strong className="text-slate-800">Accepted:</strong> {article.date_accepted}</div>
            )}
            {article.date_published && (
              <div><strong className="text-red-950">Published Online:</strong> {article.date_published}</div>
            )}
          </div>
        )}

        {/* Action Toolbar Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden border-t border-slate-100">
          
          <div className="flex flex-wrap items-center gap-2">
            {article.pdf_url && (
              <>
                <button
                  onClick={() => openPdfViewer(article.pdf_url || '', lang === 'hi' ? article.title_hindi : article.title_english)}
                  className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'PDF दर्शक' : 'View PDF'}</span>
                </button>

                <a
                  href={article.pdf_url}
                  download={`${article.title_english || 'article'}.pdf`}
                  onClick={(e) => {
                    if (article.id) incrementArticleDownloads(article.id);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</span>
                </a>
              </>
            )}

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'hi' ? 'शेयर करें' : 'Share Paper'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
            <span>Views: <strong>{article.views_count || 0}</strong></span>
            <span>•</span>
            <span>Downloads: <strong>{article.downloads_count || 0}</strong></span>
          </div>

        </div>

      </article>

      {/* Tabs Bar & Reader Container */}
      <div className="bg-white border border-amber-900/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Reader Nav Tabs (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2 print:hidden">
          <div className="flex flex-wrap gap-1">
            {hasFullText && (
              <button
                onClick={() => setActiveTab('full_text')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-serif transition flex items-center space-x-1.5 ${
                  activeTab === 'full_text'
                    ? 'bg-red-950 text-amber-300 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पूर्ण आलेख (Full Text Article)' : 'Full Text Article'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('abstract')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-serif transition flex items-center space-x-1.5 ${
                activeTab === 'abstract'
                  ? 'bg-red-950 text-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{lang === 'hi' ? 'शोध सार (Abstract)' : 'Bilingual Abstracts'}</span>
            </button>

            {article.pdf_url && (
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-serif transition flex items-center space-x-1.5 ${
                  activeTab === 'pdf'
                    ? 'bg-red-950 text-amber-300 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{lang === 'hi' ? 'PDF दर्शक' : 'PDF Reader'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('citation')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-serif transition flex items-center space-x-1.5 ${
                activeTab === 'citation'
                  ? 'bg-red-950 text-amber-300 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Quote className="w-4 h-4" />
              <span>{lang === 'hi' ? 'उद्धरण (Cite Article)' : 'Cite Article'}</span>
            </button>
          </div>

          {/* Font Controls for Readable Reading */}
          {activeTab === 'full_text' && (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 px-2 font-bold">{lang === 'hi' ? 'अक्षर आकार:' : 'Font:'}</span>
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded text-xs font-bold ${fontSize === 'sm' ? 'bg-white shadow-2xs text-red-950' : 'text-slate-600'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded text-xs font-bold ${fontSize === 'base' ? 'bg-white shadow-2xs text-red-950' : 'text-slate-600'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded text-xs font-bold ${fontSize === 'lg' ? 'bg-white shadow-2xs text-red-950' : 'text-slate-600'}`}
              >
                A+
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: FULL TEXT ARTICLE PUBLICATION VIEW */}
        {(activeTab === 'full_text' || window.matchMedia('print').matches) && (
          <div className="space-y-8 animate-in fade-in duration-150">
            
            {/* Quick Table of Contents Jump Links Bar (Desktop) */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-900/10 text-xs font-serif space-y-2 print:hidden">
              <div className="flex items-center space-x-2 font-bold text-red-950 border-b border-amber-900/10 pb-1.5">
                <List className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'विषय सूची (Table of Contents)' : 'Article Quick Navigation Table of Contents'}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="#sec-abstract" className="text-red-900 hover:underline font-bold bg-white px-2.5 py-1 rounded border border-amber-200">Abstract</a>
                {article.full_text_introduction && <a href="#sec-intro" className="text-red-900 hover:underline bg-white px-2.5 py-1 rounded border border-amber-200">1. Introduction</a>}
                {article.full_text_literature_review && <a href="#sec-literature" className="text-red-900 hover:underline bg-white px-2.5 py-1 rounded border border-amber-200">2. Literature Review</a>}
                {article.full_text_methodology && <a href="#sec-method" className="text-red-900 hover:underline bg-white px-2.5 py-1 rounded border border-amber-200">3. Methodology</a>}
                {article.full_text_results_discussion && <a href="#sec-results" className="text-red-900 hover:underline bg-white px-2.5 py-1 rounded border border-amber-200">4. Results & Discussion</a>}
                {article.full_text_conclusion && <a href="#sec-conclusion" className="text-red-900 hover:underline bg-white px-2.5 py-1 rounded border border-amber-200">5. Conclusion</a>}
                {article.references && article.references.length > 0 && <a href="#sec-references" className="text-red-900 hover:underline font-bold bg-white px-2.5 py-1 rounded border border-amber-200">References</a>}
              </div>
            </div>

            {/* FULL-WIDTH ABSTRACT HIGHLIGHT BLOCK */}
            <section id="sec-abstract" className="bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 rounded-2xl border-2 border-amber-900/20 shadow-2xs space-y-4">
              <h2 className="text-lg font-serif font-extrabold text-red-950 border-b border-amber-900/20 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>{lang === 'hi' ? 'शोध सार (Bilingual Abstracts)' : 'Bilingual Abstracts'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-slate-900 border-b border-amber-200 pb-1 text-xs uppercase tracking-wider">
                    शोध सार (हिंदी)
                  </h3>
                  <p className="text-slate-800 leading-relaxed font-sans text-justify">
                    {article.abstract_hindi}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-amber-200 pt-4 md:pt-0 md:pl-6">
                  <h3 className="font-serif font-bold text-slate-900 border-b border-amber-200 pb-1 text-xs uppercase tracking-wider">
                    Abstract (English)
                  </h3>
                  <p className="text-slate-800 leading-relaxed font-sans text-justify">
                    {article.abstract_english}
                  </p>
                </div>
              </div>

              {/* Keywords list */}
              <div className="pt-3 border-t border-amber-900/10">
                <h4 className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {lang === 'hi' ? 'बीज शब्द (Keywords / Index Terms)' : 'Index Terms & Keywords'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((kw, idx) => (
                    <span key={idx} className="text-xs font-serif bg-white text-slate-900 border border-amber-900/20 px-3 py-1 rounded-md shadow-2xs">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* FULL ARTICLE BODY TEXT SECTIONS */}
            <div className={`space-y-8 font-sans ${fontSizeClasses[fontSize]}`}>
              
              {/* Section 1: Introduction */}
              {article.full_text_introduction && (
                <section id="sec-intro" className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                    {lang === 'hi' ? '१. प्रस्तावना (Introduction)' : '1. Introduction'}
                  </h2>
                  <div className="text-slate-800 leading-relaxed">
                    {renderFormattedParagraphs(article.full_text_introduction)}
                  </div>
                </section>
              )}

              {/* Section 2: Literature Review */}
              {article.full_text_literature_review && (
                <section id="sec-literature" className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                    {lang === 'hi' ? '२. साहित्य अवलोकन (Literature Review)' : '2. Literature Review'}
                  </h2>
                  <div className="text-slate-800 leading-relaxed">
                    {renderFormattedParagraphs(article.full_text_literature_review)}
                  </div>
                </section>
              )}

              {/* Section 3: Methodology */}
              {article.full_text_methodology && (
                <section id="sec-method" className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                    {lang === 'hi' ? '३. अनुसंधान कार्यप्रणाली (Methodology)' : '3. Methodology'}
                  </h2>
                  <div className="text-slate-800 leading-relaxed">
                    {renderFormattedParagraphs(article.full_text_methodology)}
                  </div>
                </section>
              )}

              {/* Section 4: Results and Discussion */}
              {article.full_text_results_discussion && (
                <section id="sec-results" className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                    {lang === 'hi' ? '४. परिणाम एवं विश्लेषण (Results and Discussion)' : '4. Results and Discussion'}
                  </h2>
                  <div className="text-slate-800 leading-relaxed">
                    {renderFormattedParagraphs(article.full_text_results_discussion)}
                  </div>
                </section>
              )}

              {/* Custom Sections / Blocks if added */}
              {article.custom_sections && article.custom_sections.map((block) => (
                <section key={block.id} className="space-y-3 pt-4 border-t border-slate-200">
                  
                  {block.type === 'heading_h2' && (
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                      {block.title}
                    </h2>
                  )}

                  {block.type === 'subheading_h3' && (
                    <h3 className="text-lg font-serif font-bold text-slate-800 pt-2">
                      {block.title}
                    </h3>
                  )}

                  {block.type === 'quote' && (
                    <blockquote className="my-4 p-5 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-xl italic font-serif text-slate-900 space-y-1">
                      {block.title && <p className="font-bold not-italic text-red-950 text-sm mb-1">{block.title}</p>}
                      <p>"{block.content}"</p>
                    </blockquote>
                  )}

                  {block.type === 'figure' && block.placement !== 'at_end' && (
                    <figure className="my-8 p-4 sm:p-6 bg-amber-50/20 rounded-2xl border border-amber-900/15 shadow-2xs space-y-3 text-center print:break-inside-avoid print:my-4">
                      {block.image_url ? (
                        <div className="relative group max-w-3xl mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <img 
                            src={block.image_url} 
                            alt={block.is_decorative ? '' : (block.alt_text || block.caption || block.title || 'Academic Figure Image')} 
                            className="max-h-[500px] w-auto mx-auto object-contain cursor-zoom-in transition duration-200 group-hover:opacity-95" 
                            onClick={() => { setSelectedFigure(block); setLightboxZoom(1); }}
                          />
                          <button
                            type="button"
                            onClick={() => { setSelectedFigure(block); setLightboxZoom(1); }}
                            className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition print:hidden shadow-md"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>{lang === 'hi' ? 'बड़ा देखें (Zoom)' : 'Click to Zoom'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-8 text-slate-400 border border-dashed rounded-xl bg-slate-50">
                          <p className="font-serif font-bold text-slate-600">Image File Pending</p>
                        </div>
                      )}
                      
                      <figcaption className="text-xs sm:text-sm font-serif font-bold text-slate-800 space-y-1">
                        <div className="text-red-950 font-extrabold text-sm sm:text-base">
                          {block.title || 'Figure'}: {block.caption || block.content}
                        </div>
                        {block.source_credit && (
                          <p className="text-[11px] font-mono font-normal text-slate-600 italic pt-1">
                            <span className="font-bold not-italic">{lang === 'hi' ? 'स्रोत / साभार:' : 'Source / Credit:'}</span> {block.source_credit}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  )}

                  {block.type === 'table' && block.table_data && (
                    <div className="my-6 space-y-2">
                      {block.title && <h3 className="font-serif font-bold text-slate-900 text-sm">{block.title}</h3>}
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-xs sm:text-sm text-left border-collapse">
                          <thead className="bg-red-950 text-amber-100 font-serif font-bold">
                            <tr>
                              {block.table_data.headers.map((h, i) => (
                                <th key={i} className="p-3 border-b border-amber-900/30">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {block.table_data.rows.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-3">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {block.caption && <p className="text-xs italic text-slate-500">{block.caption}</p>}
                    </div>
                  )}

                  {block.type !== 'quote' && block.type !== 'figure' && block.type !== 'table' && (
                    <div className="text-slate-800 leading-relaxed">
                      {renderFormattedParagraphs(block.content)}
                    </div>
                  )}
                </section>
              ))}

              {/* Section 5: Conclusion */}
              {article.full_text_conclusion && (
                <section id="sec-conclusion" className="space-y-3 pt-4 border-t border-slate-200">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 border-b-2 border-red-950 pb-2">
                    {lang === 'hi' ? '५. निष्कर्ष (Conclusion)' : '5. Conclusion'}
                  </h2>
                  <div className="text-slate-800 leading-relaxed">
                    {renderFormattedParagraphs(article.full_text_conclusion)}
                  </div>
                </section>
              )}

              {/* Acknowledgement, Conflict of Interest, Funding */}
              {(article.full_text_acknowledgement || article.full_text_conflict_of_interest || article.full_text_funding) && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm">
                  {article.full_text_acknowledgement && (
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                        {lang === 'hi' ? 'आभार (Acknowledgement)' : 'Acknowledgement'}
                      </h3>
                      <p className="text-slate-700">{article.full_text_acknowledgement}</p>
                    </div>
                  )}

                  {article.full_text_conflict_of_interest && (
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                        {lang === 'hi' ? 'हित-संघर्ष घोषणा (Conflict of Interest Statement)' : 'Conflict of Interest Statement'}
                      </h3>
                      <p className="text-slate-700">{article.full_text_conflict_of_interest}</p>
                    </div>
                  )}

                  {article.full_text_funding && (
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                        {lang === 'hi' ? 'वित्तीय विवरण (Funding Statement)' : 'Funding Statement'}
                      </h3>
                      <p className="text-slate-700">{article.full_text_funding}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: END FIGURES / APPENDIX FIGURES */}
              {article.custom_sections && article.custom_sections.some(b => b.type === 'figure' && b.placement === 'at_end') && (
                <section id="sec-end-figures" className="space-y-6 pt-6 border-t-2 border-red-950 print:break-before-page">
                  <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 p-5 rounded-2xl shadow-xs">
                    <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center space-x-2">
                      <List className="w-5 h-5 text-amber-400" />
                      <span>{lang === 'hi' ? 'परिशिष्ट आकृतियां, मानचित्र व चित्र-दीर्घा (Figures, Maps & Plates)' : 'Figures, Maps & Appendix Plates'}</span>
                    </h2>
                    <p className="text-[11px] text-amber-200/80 font-mono mt-0.5">
                      {lang === 'hi' ? 'शोध पत्र के अंत में संलग्न महत्वपूर्ण आकृतियां व दस्तावेज चित्र' : 'High-resolution figures & plates appended to this manuscript'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {article.custom_sections.filter(b => b.type === 'figure' && b.placement === 'at_end').map((figBlock, idx) => (
                      <figure key={figBlock.id} className="p-4 bg-amber-50/20 rounded-2xl border border-amber-900/15 shadow-2xs flex flex-col justify-between space-y-3 print:break-inside-avoid">
                        {figBlock.image_url ? (
                          <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <img
                              src={figBlock.image_url}
                              alt={figBlock.is_decorative ? '' : (figBlock.alt_text || figBlock.caption || figBlock.title || 'Appendix Figure')}
                              className="max-h-80 w-auto mx-auto object-contain cursor-zoom-in hover:opacity-95 transition"
                              onClick={() => { setSelectedFigure(figBlock); setLightboxZoom(1); }}
                            />
                            <button
                              type="button"
                              onClick={() => { setSelectedFigure(figBlock); setLightboxZoom(1); }}
                              className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer transition print:hidden shadow-md"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span>Zoom</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-400 border border-dashed rounded-xl bg-slate-50">Image Pending</div>
                        )}
                        <figcaption className="text-xs font-serif text-slate-800 space-y-1">
                          <div className="font-bold text-red-950 text-sm">
                            {figBlock.title || `Appendix Figure ${idx + 1}`}: {figBlock.caption || figBlock.content}
                          </div>
                          {figBlock.source_credit && (
                            <p className="text-[11px] font-mono text-slate-600 italic">
                              <span className="font-bold not-italic">{lang === 'hi' ? 'स्रोत:' : 'Source:'}</span> {figBlock.source_credit}
                            </p>
                          )}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION: REFERENCES */}
              {article.references && article.references.length > 0 && (
                <section id="sec-references" className="space-y-4 pt-6 border-t-2 border-red-950">
                  <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 flex items-center justify-between">
                    <span>{lang === 'hi' ? 'संदर्भ ग्रंथसूची (References)' : 'References'}</span>
                    <span className="text-xs font-mono text-slate-500 font-normal">[{article.references.length} Citations]</span>
                  </h2>

                  <ol className="space-y-3 list-decimal list-inside text-xs sm:text-sm text-slate-800 font-serif">
                    {article.references.map((ref, idx) => (
                      <li key={idx} className="p-3 bg-amber-50/30 rounded-xl border border-amber-900/10 leading-relaxed text-justify">
                        <span className="ml-1 font-sans">{ref}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: BILINGUAL ABSTRACTS ONLY */}
        {activeTab === 'abstract' && !window.matchMedia('print').matches && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Hindi Abstract */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-red-950 text-base border-b border-amber-900/10 pb-1">
                शोध सार (हिंदी)
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-sans bg-amber-50/30 p-4 rounded-xl border border-amber-900/10 text-justify">
                {article.abstract_hindi}
              </p>
            </div>

            {/* English Abstract */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-red-950 text-base border-b border-amber-900/10 pb-1">
                Abstract (English)
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-sans bg-amber-50/30 p-4 rounded-xl border border-amber-900/10 text-justify">
                {article.abstract_english}
              </p>
            </div>

            {/* Keywords */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-[11px] font-serif font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                {lang === 'hi' ? 'बीज शब्द (Keywords / Index Terms)' : 'Index Terms & Keywords'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw, i) => (
                  <span key={i} className="text-xs font-serif font-medium bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-md">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EMBEDDED PDF READER */}
        {activeTab === 'pdf' && article.pdf_url && !window.matchMedia('print').matches && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <PdfCanvasViewer 
              url={article.pdf_url || ''} 
              title={lang === 'hi' ? article.title_hindi : article.title_english} 
              onDownload={handleDownload}
              className="h-[680px]" 
            />
          </div>
        )}

        {/* TAB 4: CITATION GENERATOR */}
        {activeTab === 'citation' && !window.matchMedia('print').matches && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-slate-600">
              {lang === 'hi' ? 'अपने शोध या ग्रंथसूची में जोड़ने के लिए पसंदीदा फॉर्मेट कॉपी करें:' : 'Copy reference citation format for your manuscript bibliography:'}
            </p>

            {/* APA */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">APA 7th Edition</span>
                <button
                  onClick={() => handleCopyCitation('apa')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'apa' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.apa}
              </p>
            </div>

            {/* MLA */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">MLA 9th Edition</span>
                <button
                  onClick={() => handleCopyCitation('mla')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'mla' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'mla' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.mla}
              </p>
            </div>

            {/* Chicago */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-700">Chicago 17th Edition</span>
                <button
                  onClick={() => handleCopyCitation('chicago')}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded flex items-center space-x-1"
                >
                  {copiedCitation === 'chicago' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'chicago' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                {citations.chicago}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Share Modal */}
      <SharePaperModal
        article={article}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
      />

      {/* Lightbox Modal for Academic Figures */}
      {selectedFigure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full max-h-[94vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Lightbox Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800 text-slate-200">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-red-950 font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  Academic Figure
                </span>
                <span className="font-serif font-bold text-sm text-amber-300 truncate max-w-xs sm:max-w-md">
                  {selectedFigure.title || 'Academic Figure Viewer'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-400 font-bold">{Math.round(lightboxZoom * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(prev => Math.min(3, prev + 0.25))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {selectedFigure.image_url && (
                  <a
                    href={selectedFigure.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-lg transition flex items-center space-x-1"
                    title="Open full resolution in new window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Full Res</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedFigure(null)}
                  className="p-1.5 bg-slate-800 hover:bg-red-900 text-white rounded-lg transition ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/80 min-h-[320px]">
              {selectedFigure.image_url ? (
                <img
                  src={selectedFigure.image_url}
                  alt={selectedFigure.is_decorative ? '' : (selectedFigure.alt_text || selectedFigure.caption || selectedFigure.title || 'Academic Figure')}
                  style={{ transform: `scale(${lightboxZoom})`, transition: 'transform 0.15s ease-out' }}
                  className="max-h-[68vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <p className="text-slate-400 font-mono text-xs">Image File Unavailable</p>
              )}
            </div>

            {/* Lightbox Caption & Credit Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-slate-200 space-y-1.5">
              <p className="text-xs sm:text-sm font-serif font-bold text-white">
                <span className="text-amber-400 mr-1.5">{selectedFigure.title || 'Figure'}:</span>
                {selectedFigure.caption || selectedFigure.content}
              </p>
              {selectedFigure.source_credit && (
                <p className="text-xs font-mono text-slate-400 italic">
                  <span className="font-bold not-italic">Credit / Source:</span> {selectedFigure.source_credit}
                </p>
              )}
              {selectedFigure.alt_text && (
                <p className="text-[11px] font-mono text-emerald-400/90">
                  <span className="font-bold text-emerald-300">Accessibility Alt:</span> {selectedFigure.alt_text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
