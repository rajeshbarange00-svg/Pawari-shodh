import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf, downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { SharePaperModal } from '../common/SharePaperModal';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  ArrowRight, 
  Calendar, 
  User, 
  Quote, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Globe,
  Share2,
  ChevronRight,
  Building,
  GraduationCap,
  Mail,
  MapPin,
  Send,
  Copy,
  Check,
  Sparkles,
  Inbox,
  Phone,
  Bookmark,
  Book,
  Music,
  Award
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    lang, 
    settings, 
    articles, 
    issues, 
    editorialMembers, 
    setActiveView, 
    setSelectedArticleId,
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads
  } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [citationModalArticle, setCitationModalArticle] = useState<any | null>(null);
  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Identify current issue
  const currentIssue = issues.find(i => i.status === 'current') || issues[0];
  
  // Articles in the current issue
  const currentArticles = currentIssue 
    ? articles.filter(a => ((Number(a.volume) === Number(currentIssue.volume) && Number(a.issue) === Number(currentIssue.issue_number)) || (a.issue_id && a.issue_id === currentIssue.id)) && a.status !== 'draft' && a.status !== 'rejected')
    : articles.filter(a => a.status !== 'draft' && a.status !== 'rejected').slice(0, 5);

  // Past issues for archive preview
  const pastIssues = issues.filter(i => !currentIssue || i.id !== currentIssue.id);

  const handleArticleClick = (artId: string) => {
    setSelectedArticleId(artId);
    incrementArticleViews(artId);
    setActiveView('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfDownload = (e: React.MouseEvent, artId: string, pdfUrl: string, title?: string) => {
    e.stopPropagation();
    incrementArticleDownloads(artId);
    downloadPdf(pdfUrl, title || 'article.pdf');
  };

  const handlePdfView = (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    incrementArticleViews(art.id);
    handleArticleClick(art.slug || art.id);
  };

  const copyCitation = (art: any, format: 'apa' | 'mla' | 'bibtex' | 'ris') => {
    const authors = art.authors.map((a: any) => a.name).join(', ');
    const year = art.year || '2026';
    const title = art.title_english || art.title_hindi;
    const journal = 'Pawari Shodh Patrika';
    const vol = art.volume || '1';
    const issue = art.issue || '1';
    const pages = art.page_numbers || '1-10';
    const doi = art.doi || '10.5281/zenodo.123456';

    let text = '';
    if (format === 'apa') {
      text = `${authors} (${year}). ${title}. ${journal}, ${vol}(${issue}), ${pages}. https://doi.org/${doi}`;
    } else if (format === 'mla') {
      text = `${authors}. "${title}." ${journal}, vol. ${vol}, no. ${issue}, ${year}, pp. ${pages}.`;
    } else if (format === 'bibtex') {
      text = `@article{psp${art.id},\n  author = {${authors}},\n  title = {${title}},\n  journal = {${journal}},\n  volume = {${vol}},\n  number = {${issue}},\n  pages = {${pages}},\n  year = {${year}},\n  doi = {${doi}}\n}`;
    } else if (format === 'ris') {
      text = `TY  - JOUR\nAU  - ${authors}\nTI  - ${title}\nJO  - ${journal}\nVL  - ${vol}\nIS  - ${issue}\nSP  - ${pages}\nPY  - ${year}\nDO  - ${doi}\nER  -`;
    }

    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 space-y-10 pt-2 sm:pt-4">
        
        {/* ==========================================
            SECTION 1: HERO SECTION
            ========================================== */}
        <section className="relative text-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-amber-500/30 overflow-hidden bg-[var(--color-brand-primary,#420708)]">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            
            {/* Publisher Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-semibold tracking-wide">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </span>
            </div>

            {/* Main Single H1 Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-100 tracking-tight leading-tight">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base md:text-lg text-amber-200/90 font-serif max-w-3xl mx-auto leading-relaxed italic">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>

            {/* Metadata Bar (Frequency & ISSN) */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-amber-200 font-mono pt-1">
              <span className="bg-white/10 px-3 py-1 rounded-md border border-amber-400/20">
                {lang === 'hi' ? `आवृत्ति: ${settings.frequency_hindi}` : `Frequency: ${settings.frequency_english}`}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-md border border-amber-400/20">
                Peer-Reviewed Refereed Journal
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-md border border-amber-400/20">
                Online ISSN: {settings.issn_online || 'Applied / Pending'}
              </span>
            </div>

            {/* Search Bar */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveView('articles');
                    }
                  }}
                  placeholder={lang === 'hi' ? 'शोध पत्र शीर्षक, लेखक या विषय से खोजें...' : 'Search research article by title, author, or keyword...'}
                  className="w-full pl-10 pr-24 py-3 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl border-2 border-amber-400 shadow-md focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <button
                  onClick={() => setActiveView('articles')}
                  className="absolute right-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-xs flex items-center space-x-1"
                >
                  <span>{lang === 'hi' ? 'खोजें' : 'Search'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={getUrlForView('current_issue')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('current_issue');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'hi' ? 'वर्तमान अंक देखें' : 'View Current Issue'}</span>
              </a>

              <a
                href={getUrlForView('archive')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('archive');
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold text-xs rounded-xl border border-amber-400/40 transition flex items-center space-x-2 backdrop-blur-xs"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'शोध आर्काइव' : 'Journal Archives'}</span>
              </a>

              <a
                href={getUrlForView('submit_manuscript')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('submit_manuscript');
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-amber-100 font-bold text-xs rounded-xl border border-amber-400/40 transition flex items-center space-x-2 backdrop-blur-xs"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'पांडुलिपि जमा करें' : 'Submit Manuscript'}</span>
              </a>
            </div>

          </div>
        </section>


        {/* ==========================================
            SECTION 2: ABOUT THE JOURNAL
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'पत्रिका का परिचय' : 'About Pawari Shodh Patrika'}</span>
            </h2>
            <a
              href={getUrlForView('about')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('about');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'विस्तृत विवरण देखें' : 'Read Full Overview'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            {lang === 'hi' 
              ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika) माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, म.प्र.) द्वारा प्रकाशित एक द्विभाषी एवं पीर-रिव्यूड (Peer-Reviewed) अकादमिक शोध पत्रिका है। यह पत्रिका पवारी (भोयरी/पंवारी) भाषा, साहित्य, इतिहास एवं संस्कृति को केंद्रीय पीठ मानकर मध्यप्रदेश तथा समीपवर्ती अंचलों की बोलियों, लोकभाषाओं, जनजातीय भाषिक परंपराओं एवं क्षेत्रीय अध्ययन पर केंद्रित मौलिक शोध पत्रों, समीक्षा लेखों, प्रामाणिक दस्तावेजों व पुस्तक समीक्षाओं का प्रकाशन करती है। इसमें हिंदी, अंग्रेजी तथा पवारी (देवनागरी लिपि) में शोध सामग्री स्वीकार की जाती है।'
              : 'Pawari Shodh Patrika is a bilingual, double-blind peer-reviewed academic research journal published by Maa Tapti Research Institute, Multai (Betul, M.P.). Centered on Pawari language, literature, history, and culture, the journal welcomes research on regional dialects, folk traditions, tribal linguistics, and social heritage across Madhya Pradesh and neighboring regions in Hindi, English, and Pawari.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <strong className="block text-slate-900 font-serif text-sm font-bold">Scope & Subject Areas</strong>
              <span className="text-slate-600 mt-0.5 block">Pawari Linguistics, Folk Literature, Regional History & Cultural Sociology.</span>
            </div>
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <strong className="block text-slate-900 font-serif text-sm font-bold">Accepted Languages</strong>
              <span className="text-slate-600 mt-0.5 block">Hindi, English, and Pawari (Devanagari script).</span>
            </div>
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <strong className="block text-slate-900 font-serif text-sm font-bold">Target Audience</strong>
              <span className="text-slate-600 mt-0.5 block">Academic Researchers, Linguists, Historians, Students & Cultural Scholars.</span>
            </div>
          </div>
        </section>


        {/* ==========================================
            SECTION 3: CURRENT ISSUE
            ========================================== */}
        {currentIssue && (
          <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-red-900 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                  {lang === 'hi' ? 'नवीनतम शोध अंक' : 'Current Research Issue'}
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">
                  {lang === 'hi' ? currentIssue.title_hindi : currentIssue.title_english}
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">
                  Volume {currentIssue.volume}, Issue {currentIssue.issue_number} ({currentIssue.year})
                </p>
              </div>

              <a
                href={getUrlForView('current_issue')}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('current_issue');
                }}
                className="self-start sm:self-center px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs"
              >
                <span>{lang === 'hi' ? 'अंक की पूर्ण विषय-सूची देखें' : 'View Full Issue TOC'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Cover Card */}
              <div className="md:col-span-4 space-y-3 text-center">
                <div className="w-36 sm:w-full mx-auto relative aspect-3/4 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400/50 bg-red-950">
                  <SafeImage 
                    src={currentIssue.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'} 
                    alt="Issue Cover" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/95 via-red-950/40 to-transparent flex flex-col justify-end p-4 text-amber-100 text-left">
                    <span className="text-[10px] font-mono uppercase bg-amber-500 text-red-950 px-2 py-0.5 rounded font-bold inline-block mb-1">
                      Peer-Reviewed Issue
                    </span>
                    <div className="text-sm font-serif font-bold">
                      Volume {currentIssue.volume}, Issue {currentIssue.issue_number}
                    </div>
                    <div className="text-xs text-amber-200/90 font-medium">
                      Year: {currentIssue.year}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">
                  {lang === 'hi' ? currentIssue.description_hindi : currentIssue.description_english}
                </p>
              </div>

              {/* Articles List */}
              <div className="md:col-span-8 space-y-3">
                <h3 className="text-xs font-serif font-bold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'इस अंक में प्रकाशित शोध पत्र' : 'Published Articles in this Issue'}</span>
                  <span className="text-slate-500 text-[11px] font-mono">{currentArticles.length} Articles</span>
                </h3>

                <div className="space-y-3">
                  {currentArticles.map((art) => (
                    <div 
                      key={art.id}
                      className="bg-slate-50 hover:bg-amber-50/60 p-4 rounded-xl border border-slate-200 hover:border-amber-400/60 transition space-y-2 group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                        <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                          {art.category || 'Research Article'}
                        </span>
                        <span className="text-slate-500">
                          pp. {art.page_numbers || '1-12'}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-red-950 transition leading-snug">
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

                      <p className="text-xs text-slate-700 font-medium">
                        <strong>Authors:</strong> {art.authors.map(a => a.name).join(', ')}
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {lang === 'hi' ? art.abstract_hindi : art.abstract_english}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-200/60">
                        <a
                          href={getUrlForView('article_detail', art.slug || art.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            handleArticleClick(art.slug || art.id);
                          }}
                          className="font-bold text-red-900 hover:underline flex items-center space-x-1"
                        >
                          <span>{lang === 'hi' ? 'पूर्ण शोध पत्र पढ़ें' : 'Read Full Article'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareModalArticle(art);
                            }}
                            className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-[11px] font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                          >
                            <Share2 className="w-3 h-3 text-emerald-700" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCitationModalArticle(art);
                            }}
                            className="px-2 py-1 bg-white hover:bg-amber-100 text-slate-800 text-[11px] font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                          >
                            <Quote className="w-3 h-3 text-amber-700" />
                            <span>Cite</span>
                          </button>
                          <button
                            onClick={(e) => handlePdfView(e, art)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-semibold rounded border border-slate-200 transition flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3 text-slate-600" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-red-950 text-[11px] font-bold rounded transition flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </section>
        )}

        {/* ==========================================
            SECTION 3.5: PAWARI CULTURAL & FOLKLORE SHOWCASE
            ========================================== */}
        <section className="bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-amber-100 shadow-xl border border-amber-500/30 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सांस्कृतिक धरोहर एवं साहित्य अर्काइव' : 'Cultural Heritage & Folklore Archive'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-amber-100">
                {lang === 'hi' ? 'पवारी भोयरी लोकसाहित्य, शब्दकोश एवं शोध ग्रंथ' : 'Pawari Folklore, Dictionary & Literature Library'}
              </h2>
            </div>

            <a
              href={getUrlForView('books_blogs')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('books_blogs');
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 hover:from-amber-300 hover:to-amber-400 transition"
            >
              <span>{lang === 'hi' ? 'समग्र ग्रंथालय देखें ➔' : 'Explore Library ➔'}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {/* Card 1: Books & Monographs */}
            <div 
              onClick={() => setActiveView('books_blogs')}
              className="bg-black/30 hover:bg-black/50 border border-amber-500/20 hover:border-amber-400/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm hover:scale-[1.02]"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Book className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 transition">
                  {lang === 'hi' ? '📚 प्रकाशित शोध ग्रंथ' : 'Research Monographs'}
                </h3>
                <p className="text-xs text-amber-200/70 line-clamp-2">
                  पवारी भाषा, इतिहास, व्याकरण व त्रिभाषीय बृहत् कोष ग्रंथ।
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-400 group-hover:underline flex items-center space-x-1">
                <span>विवरण व PDF ➔</span>
              </span>
            </div>

            {/* Card 2: Lokgeet Archive */}
            <div 
              onClick={() => setActiveView('pawari_lokgeet')}
              className="bg-black/30 hover:bg-black/50 border border-amber-500/20 hover:border-amber-400/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm hover:scale-[1.02]"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 transition">
                  {lang === 'hi' ? '🎵 पवारी लोकगीत' : 'Pawari Folk Songs'}
                </h3>
                <p className="text-xs text-amber-200/70 line-clamp-2">
                  विवाह, भक्ति, कृषि व पारम्परिक लोकगाथाओं के सम्पूर्ण बोल व ऑडियो।
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-400 group-hover:underline flex items-center space-x-1">
                <span>गीत संग्रह सुनें ➔</span>
              </span>
            </div>

            {/* Card 3: Shabdkosh */}
            <div 
              onClick={() => setActiveView('pawari_shabdkosh')}
              className="bg-black/30 hover:bg-black/50 border border-amber-500/20 hover:border-amber-400/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm hover:scale-[1.02]"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 transition">
                  {lang === 'hi' ? '📖 पवारी शब्दकोश' : 'Pawari Shabdkosh'}
                </h3>
                <p className="text-xs text-amber-200/70 line-clamp-2">
                  2000+ प्रामाणिक शब्दों के हिंदी व अंग्रेजी अर्थ एवं वाक्य प्रयोग।
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-400 group-hover:underline flex items-center space-x-1">
                <span>शब्द खोजें ➔</span>
              </span>
            </div>

            {/* Card 4: Quiz & Certificate */}
            <div 
              onClick={() => setActiveView('pawari_quiz')}
              className="bg-black/30 hover:bg-black/50 border border-amber-500/20 hover:border-amber-400/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm hover:scale-[1.02]"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 transition">
                  {lang === 'hi' ? '🏆 संस्कृति क्विज़' : 'Culture Quiz & Cert'}
                </h3>
                <p className="text-xs text-amber-200/70 line-clamp-2">
                  अपनी पवारी संस्कृति का ज्ञान परखें व ई-प्रमाण-पत्र प्राप्त करें।
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-400 group-hover:underline flex items-center space-x-1">
                <span>क्विज़ खेलें ➔</span>
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 4: ARCHIVES PREVIEW
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-amber-800" />
              <span>{lang === 'hi' ? 'पूर्व शोध अंक संग्रह' : 'Journal Archives Preview'}</span>
            </h2>
            <a
              href={getUrlForView('archive')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('archive');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'समस्त प्रकाशित अंक देखें' : 'Browse Complete Journal Archives'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {pastIssues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastIssues.slice(0, 3).map((iss) => (
                <div 
                  key={iss.id}
                  className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200 transition space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>Volume {iss.volume}, Issue {iss.issue_number}</span>
                      <span className="font-bold text-amber-900">{iss.year}</span>
                    </div>
                    <h3 className="font-serif font-bold text-slate-900 text-base mt-1">
                      {lang === 'hi' ? iss.title_hindi : iss.title_english}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {lang === 'hi' ? iss.description_hindi : iss.description_english}
                    </p>
                  </div>

                  <a
                    href={getUrlForView('archive', null, `issue-${iss.volume}-${iss.issue_number}`)}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveView('archive');
                    }}
                    className="pt-2 text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
                  >
                    <span>{lang === 'hi' ? 'अंक देखें' : 'Explore Issue'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
              All published volumes and issues are accessible via the main Journal Archives repository.
            </div>
          )}

          <div className="pt-2 text-center">
            <a
              href={getUrlForView('archive')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('archive');
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-100 font-bold text-xs rounded-xl transition"
            >
              <span>{lang === 'hi' ? 'समस्त शोध अंक देखें' : 'Browse Complete Journal Archives'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>


        {/* ==========================================
            SECTION 5: JOURNAL CREDIBILITY SECTION
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <span>{lang === 'hi' ? 'संपादकीय नीतियां एवं अकादमिक मानक' : 'Editorial Policies & Academic Governance'}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Pawari Shodh Patrika maintains double-blind peer review and open access ethical standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            <a
              href={getUrlForView('about')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('about');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '1. पत्रिका के बारे में एवं लक्ष्य' : '1. Journal Aim & Scope'}
              </div>
              <p className="text-slate-600 mt-1">
                Read our core mission, research focus, multi-disciplinary scope, and language policies.
              </p>
            </a>

            <a
              href={getUrlForView('editorial_board')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('editorial_board');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '2. संपादकीय मंडल' : '2. Editorial Board Directory'}
              </div>
              <p className="text-slate-600 mt-1">
                View our patron, chief editor, associate editors, and advisory board members.
              </p>
            </a>

            <a
              href={getUrlForView('author_guidelines')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('author_guidelines');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '3. पीर-रिव्यू नीति' : '3. Double-Blind Peer Review Policy'}
              </div>
              <p className="text-slate-600 mt-1">
                Learn about our two-tier referee evaluation, referee selection, and review timeline.
              </p>
            </a>

            <a
              href={getUrlForView('author_guidelines')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('author_guidelines');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '4. प्रकाशन नीति एवं नैतिकता' : '4. Publication Ethics (COPE Standards)'}
              </div>
              <p className="text-slate-600 mt-1">
                Guidelines regarding originality, plagiarism limits, authorship, and conflict of interest.
              </p>
            </a>

            <a
              href={getUrlForView('author_guidelines')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('author_guidelines');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '5. लेखक दिशानिर्देश' : '5. Author Formatting Guidelines'}
              </div>
              <p className="text-slate-600 mt-1">
                Download style templates, reference formats, citation guidelines, and copyright forms.
              </p>
            </a>

            <a
              href={getUrlForView('contact')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('contact');
              }}
              className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200 transition group"
            >
              <div className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900">
                {lang === 'hi' ? '6. संपर्क एवं सचिवालय' : '6. Contact & Editorial Secretariat'}
              </div>
              <p className="text-slate-600 mt-1">
                Official postal address, institutional affiliation, and editorial email contact.
              </p>
            </a>

          </div>
        </section>


        {/* ==========================================
            SECTION 6: SCOPE / SUBJECT AREAS
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-amber-800" />
              <span>{lang === 'hi' ? 'शोध के विषय एवं दायरा' : 'Research Domains & Subject Scope'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पवारी शोध पत्रिका पवारी भाषा, साहित्य, इतिहास और संस्कृति के गहन अध्ययन के साथ-साथ मध्यप्रदेश एवं समीपवर्ती अंचलों की बोलियों, लोकभाषाओं, जनजातीय भाषिक परंपराओं तथा क्षेत्रीय समाज-संस्कृति को समाहित करने वाला एक गंभीर अकादमिक मंच है। पत्रिका क्षेत्रीय बोलियों, मौखिक साहित्य और लोकजीवन के वैज्ञानिक प्रलेखन एवं तुलनात्मक अध्ययन को प्रोत्साहित करती है।'
                : 'Pawari Shodh Patrika serves as an academic platform dedicated to the in-depth study of Pawari language, literature, history, and culture, alongside the regional dialects, folk languages, tribal linguistic traditions, and social heritage of Madhya Pradesh and neighboring areas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '1. पवारी एवं संबंधित भाषाई अध्ययन' : '1. Pawari Linguistics & Traditions'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'पवारी (भोयरी/पंवारी) भाषा की ध्वनि-संरचना, व्याकरण, शब्दकोश, लोकसाहित्य, लिखित साहित्य और भाषिक परंपराएँ।'
                  : 'Phonetics, grammar, lexicon, folk poetry, and literary traditions of the Pawari (Bhoyari/Panwari) language.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '2. क्षेत्रीय लोकभाषाएँ एवं बोलियाँ' : '2. Regional Dialects & Languages'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'राजस्थानी और संबंधित भाषिक-सांस्कृतिक अध्ययन, मालवी, निमाड़ी, बुन्देली, बघेली एवं अन्य उपभाषाएँ व स्थानिक रूप।'
                  : 'Rajsthani linguistic studies, Malvi, Nimadi, Bundeli, Bagheli, and regional speech forms of Madhya Pradesh.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '3. जनजातीय एवं अंचल की भाषिक परंपराएँ' : '3. Tribal & Indigenous Languages'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित व संकटग्रस्त भाषिक रूपों का अध्ययन।'
                  : 'Gondi, Korku, Nahali (Nihali), Bhili, Bhilali, Bareli, and endangered indigenous language forms.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '4. लोकसाहित्य एवं मौखिक परंपराएँ' : '4. Folk Literature & Oral Traditions'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'लोककथाएँ, लोकगीत, गाथाएँ, अनुष्ठानिक गायन, कहावतें, लोकोक्तियाँ, लोकनाट्य और वाचिक परंपराओं का संकलन।'
                  : 'Folk songs (Lokgeet), oral narratives, proverbs, ritual songs, folk theater, and oral history documentation.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '5. इतिहास, पुरालेख एवं विरासत' : '5. Regional History & Epigraphy'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'क्षेत्रीय इतिहास, पुरालेखी साक्ष्य, ताम्रपत्र, अभिलेखीकरण, ऐतिहासिक स्मृतियाँ और पुरातात्विक अध्ययन।'
                  : 'Regional history, epigraphic records, archival manuscripts, historical memory, and heritage preservation.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '6. समाज, समुदाय एवं समाजशास्त्र' : '6. Community & Social Anthropology'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'क्षेत्रीय सामाजिक संरचनाएँ, समुदाय, वंश, गोत्र अध्ययन, जातीय-सांस्कृतिक इतिहास और ग्रामीण समाजशास्त्र।'
                  : 'Social structures, clan and gotra lineage, community histories, ethno-sociology, and cultural anthropology.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '7. लोकज्ञान एवं कृषि-पारिस्थितिकी' : '7. Indigenous Knowledge & Ethno-Ecology'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'पारंपरिक ज्ञान प्रणालियाँ, कृषि-संस्कृति, उत्सव, रीति-रिवाज, पर्यावरण-ज्ञान (Ethno-Ecology) व लोककला।'
                  : 'Traditional agricultural practices, seasonal rituals, ethno-ecological wisdom, festivals, and folk crafts.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '8. तुलनात्मक अध्ययन एवं भाषा-प्रविधि' : '8. Comparative Linguistics & Archiving'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'तुलनात्मक भाषाविज्ञान, अनुवाद अध्ययन, शब्दकोश निर्माण, पाठ-संपादन और डिजिटल अभिलेखीकरण।'
                  : 'Comparative linguistics, translation studies, lexicography, textual editing, and digital archiving.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-amber-50/50 rounded-xl border border-slate-200 transition space-y-1">
              <strong className="text-slate-900 font-bold block text-sm font-serif">
                {lang === 'hi' ? '9. स्वीकृत शोध प्रारूप' : '9. Accepted Article Types'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'hi' 
                  ? 'मौलिक शोध पत्र, समीक्षा लेख, पुस्तक समीक्षाएँ, प्रामाणिक दस्तावेज अध्ययन एवं विशेषज्ञों के साक्षात्कार।'
                  : 'Original research articles, review essays, book reviews, critical document studies, and scholarly interviews.'}
              </p>
            </div>
          </div>
        </section>


        {/* ==========================================
            SECTION 7: SUBMISSION / CALL FOR PAPERS
            ========================================== */}
        {settings.call_for_papers?.is_active !== false && (
          <section className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-red-950 rounded-3xl p-6 sm:p-8 shadow-md border border-amber-400 space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center space-x-2 bg-red-950 text-amber-300 px-3 py-1 rounded-md text-xs font-mono font-bold">
                <Inbox className="w-4 h-4 text-amber-400" />
                <span>
                  {settings.call_for_papers?.title_badge_english || 'Call for Papers 2025'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-950">
                Target: {settings.call_for_papers?.target_volume_issue || 'Vol. 1 Issue 1'}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.heading_hindi || 'शोध पत्र सबमिशन हेतु आमंत्रण') 
                  : (settings.call_for_papers?.heading_english || 'Submit Research Manuscript for Upcoming Issue')}
              </h2>
              <p className="text-xs sm:text-sm text-red-950/90 font-medium leading-relaxed">
                {lang === 'hi' 
                  ? (settings.call_for_papers?.description_hindi || 'शोधकर्ताओं एवं विद्वानों से पवारी भाषा, साहित्य एवं लोकसंस्कृति पर मौलिक शोध पत्रों का आमंत्रण।') 
                  : (settings.call_for_papers?.description_english || 'Inviting original research papers, review articles, and field studies in Pawari language, culture, and Central Indian studies.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-red-950/20 text-xs">
              <div className="font-mono">
                <span>Submission Deadline: </span>
                <strong className="text-red-950 underline">{settings.call_for_papers?.deadline_date || '31st May'}</strong>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={getUrlForView('submit_manuscript')}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('submit_manuscript');
                  }}
                  className="px-5 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'ऑनलाइन सबमिशन' : 'Submit Manuscript Online'}</span>
                </a>

                <a
                  href={getUrlForView('author_guidelines')}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('author_guidelines');
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-red-950 font-bold rounded-xl transition border border-red-950/30"
                >
                  {lang === 'hi' ? 'दिशानिर्देश देखें' : 'Author Guidelines'}
                </a>
              </div>
            </div>
          </section>
        )}


        {/* ==========================================
            SECTION 8: CONTACT / PUBLISHER BLOCK
            ========================================== */}
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-6 h-6 text-red-900" />
              <span>{lang === 'hi' ? 'प्रकाशक एवं संस्थागत संपर्क' : 'Publisher & Editorial Secretariat'}</span>
            </h2>
            <a
              href={getUrlForView('contact')}
              onClick={(e) => {
                e.preventDefault();
                setActiveView('contact');
              }}
              className="text-xs font-bold text-red-900 hover:underline flex items-center space-x-1"
            >
              <span>{lang === 'hi' ? 'संपर्क पृष्ठ' : 'Visit Contact Page'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block">Publishing Institution</strong>
              <p className="text-slate-700 font-medium">
                {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
              </p>
              <p className="text-slate-500">Research & Publication Department</p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-red-900" />
                <span>Postal Address</span>
              </strong>
              <p className="text-slate-700 leading-relaxed">
                {lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-serif text-sm font-bold block flex items-center space-x-1">
                <Mail className="w-4 h-4 text-red-900" />
                <span>Editorial Contact</span>
              </strong>
              <p className="text-slate-700 font-mono">{settings.contact_email}</p>
              {settings.contact_phone && (
                <p className="text-slate-600 font-mono">{settings.contact_phone}</p>
              )}
            </div>
          </div>
        </section>


        {/* ==========================================
            SECTION 9: FOOTER SUMMARY
            ========================================== */}
        <footer className="pt-6 border-t border-amber-900/10 text-center text-xs text-slate-600 space-y-2">
          <p className="font-serif font-bold text-slate-800">
            {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english} — {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            {lang === 'hi' ? settings.footer_text_hindi : settings.footer_text_english}
          </p>
        </footer>

      </div>


      {/* Citation Modal */}
      {citationModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-amber-400/40">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Quote className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-slate-900 text-base">Cite Research Article</h3>
              </div>
              <button 
                onClick={() => setCitationModalArticle(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-mono">Article Title:</p>
              <p className="text-sm font-serif font-bold text-slate-900 mt-0.5">
                {lang === 'hi' ? citationModalArticle.title_hindi : citationModalArticle.title_english}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">APA (7th Edition)</span>
                  <button
                    onClick={() => copyCitation(citationModalArticle, 'apa')}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1"
                  >
                    {copiedFormat === 'apa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'apa' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors.map((a: any) => a.name).join(', ')} ({citationModalArticle.year || '2026'}). {citationModalArticle.title_english || citationModalArticle.title_hindi}. Pawari Shodh Patrika, {citationModalArticle.volume}({citationModalArticle.issue}), {citationModalArticle.page_numbers || '1-10'}.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">MLA (9th Edition)</span>
                  <button
                    onClick={() => copyCitation(citationModalArticle, 'mla')}
                    className="text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition flex items-center space-x-1"
                  >
                    {copiedFormat === 'mla' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormat === 'mla' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-slate-600 font-mono text-[11px] leading-relaxed">
                  {citationModalArticle.authors.map((a: any) => a.name).join(', ')}. "{citationModalArticle.title_english || citationModalArticle.title_hindi}." Pawari Shodh Patrika, vol. {citationModalArticle.volume}, no. {citationModalArticle.issue}, {citationModalArticle.year || '2026'}, pp. {citationModalArticle.page_numbers || '1-10'}.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyCitation(citationModalArticle, 'bibtex')}
                  className="flex-1 py-2 bg-slate-900 text-amber-100 font-bold text-xs rounded-xl hover:bg-slate-800 transition flex items-center justify-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy BibTeX</span>
                </button>
                <button
                  onClick={() => copyCitation(citationModalArticle, 'ris')}
                  className="flex-1 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border hover:bg-slate-200 transition flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download RIS</span>
                </button>
              </div>
            </div>

          </div>
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

