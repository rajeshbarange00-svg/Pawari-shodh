import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { downloadPdf } from '../../lib/pdfUtils';
import { SafeImage } from '../common/SafeImage';
import { SharePaperModal } from '../common/SharePaperModal';
import { ArticlesView } from './ArticlesView';
import { 
  BookOpen, 
  Calendar, 
  Layers, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  List
} from 'lucide-react';

export const ArchiveView: React.FC = () => {
  const { 
    lang, 
    issues, 
    articles, 
    setSelectedArticleId, 
    setActiveView, 
    openPdfViewer,
    incrementArticleViews,
    incrementArticleDownloads 
  } = useCms();

  const [activeTab, setActiveTab] = useState<'issues' | 'all_papers'>('issues');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareModalArticle, setShareModalArticle] = useState<any | null>(null);

  // Group issues by Volume
  const volumesMap = useMemo(() => {
    const map = new Map<number, typeof issues>();
    issues.forEach(iss => {
      const vol = iss.volume || 1;
      if (!map.has(vol)) {
        map.set(vol, []);
      }
      map.get(vol)!.push(iss);
    });
    return map;
  }, [issues]);

  const sortedVolumeNumbers = useMemo(() => {
    return Array.from(volumesMap.keys()).sort((a, b) => Number(b) - Number(a));
  }, [volumesMap]);

  const filteredIssues = useMemo(() => {
    return issues.filter(iss => {
      if (selectedVolume !== 'all' && String(iss.volume) !== selectedVolume) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (iss.title_english || '').toLowerCase().includes(q) || (iss.title_hindi || '').toLowerCase().includes(q);
        const matchNote = (iss.editorial_note_english || '').toLowerCase().includes(q) || (iss.editorial_note_hindi || '').toLowerCase().includes(q);
        return matchTitle || matchNote || String(iss.year).includes(q);
      }
      return true;
    });
  }, [issues, selectedVolume, searchQuery]);

  const handleArticleClick = (artId: string) => {
    setSelectedArticleId(artId);
    incrementArticleViews(artId);
    setActiveView('article_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePdfView = (e: React.MouseEvent, art: any) => {
    e.stopPropagation();
    incrementArticleViews(art.id);
    handleArticleClick(art.slug || art.id);
  };

  const handlePdfDownload = (e: React.MouseEvent, artId: string, pdfUrl: string, title?: string) => {
    e.stopPropagation();
    incrementArticleDownloads(artId);
    downloadPdf(pdfUrl, title || 'article.pdf');
  };

  if (activeTab === 'all_papers') {
    return (
      <div className="space-y-4">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('issues')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-amber-800" />
              <span>{lang === 'hi' ? '← अकों का संग्रह (Browse Issues)' : '← Browse by Issues'}</span>
            </button>
          </div>
        </div>
        <ArticlesView />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Archive Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-lg border border-amber-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-400/40 text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पुस्तकालय एवं शोध संग्रह' : 'Scholarly Journal Archive & Back Issues'}</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-amber-200">
            <span>ISSN (Online): Applied For</span>
            <span>•</span>
            <span>Refereed Repository</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'पवारी शोध पत्रिका — आर्काइव संग्रह' : 'Pawari Shodh Patrika Archives'}
        </h1>

        <p className="text-xs sm:text-sm text-amber-200/90 font-serif max-w-3xl leading-relaxed">
          {lang === 'hi' 
            ? 'पवारी शोध पत्रिका के सभी प्रकाशित अंकों, वॉल्यूम और शोध पत्रों का पूर्ण डिजिटलाइज्ड संग्रह। सभी शोध पत्र ओपन-एक्सेस और सर्च योग्य हैं।'
            : 'Complete digital repository of all published volumes, issues, and peer-reviewed research manuscripts of Pawari Shodh Patrika. Fully indexed and open access.'}
        </p>

        {/* View Switcher Tabs */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'issues' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-amber-100 border border-amber-400/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'hi' ? 'अंक वार देखें (Volumes & Issues)' : 'Browse Volumes & Issues'}</span>
          </button>

          <button
            onClick={() => setActiveTab('all_papers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'all_papers' 
                ? 'bg-amber-500 text-red-950 shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-amber-100 border border-amber-400/30'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{lang === 'hi' ? 'सभी शोध पत्र (Search All Manuscripts)' : 'Search All Manuscripts'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-900/15 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-800" />
          <span className="text-xs font-bold text-slate-800 font-serif">Volume Filter:</span>
          <select
            value={selectedVolume}
            onChange={(e) => setSelectedVolume(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Volumes ({sortedVolumeNumbers.length})</option>
            {sortedVolumeNumbers.map(volNum => (
              <option key={volNum} value={String(volNum)}>Volume {volNum}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'अंक या शीर्षक से खोजें...' : 'Filter issues by keyword...'}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Volume & Issues List */}
      <div className="space-y-10">
        {filteredIssues.map((issue) => {
          const issuePapers = articles.filter(
            a => ((Number(a.volume) === Number(issue.volume) && Number(a.issue) === Number(issue.issue_number)) || (a.issue_id && a.issue_id === issue.id)) && a.status !== 'draft' && a.status !== 'rejected'
          );

          return (
            <div 
              key={issue.id}
              className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden"
            >
              {/* Issue Header Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6">
                <div className="flex items-center space-x-5">
                  <div className="w-20 sm:w-24 aspect-3/4 rounded-xl overflow-hidden border border-amber-400 shadow-md flex-shrink-0 bg-red-950">
                    <SafeImage 
                      src={issue.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                      alt={issue.title_english}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-md border border-amber-300">
                        Volume {issue.volume}, Issue {issue.issue_number}
                      </span>
                      {issue.status === 'current' && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
                          Current Issue
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono">
                        Publication Year: {issue.year}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
                      {lang === 'hi' ? issue.title_hindi : issue.title_english}
                    </h2>

                    <p className="text-xs text-slate-600 font-mono">
                      Published: {issue.publication_date || '2026'} • Total Articles: {issuePapers.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start md:self-center">
                  <button
                    onClick={() => {
                      setSelectedVolume(String(issue.volume));
                      setActiveView('current_issue');
                    }}
                    className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-2xs flex items-center space-x-1.5"
                  >
                    <span>{lang === 'hi' ? 'विषय-सूची देखें' : 'View Table of Contents'}</span>
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Articles inside this Issue */}
              <div>
                <h3 className="text-xs font-serif font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>{lang === 'hi' ? 'प्रकाशित शोध पत्र सूची' : 'Published Articles in this Issue'}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{issuePapers.length} Papers</span>
                </h3>

                {issuePapers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">No published articles listed for this issue.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {issuePapers.map((art, idx) => (
                      <div 
                        key={art.id}
                        onClick={() => handleArticleClick(art.slug || art.id)}
                        className="p-4 bg-slate-50 hover:bg-amber-50/60 rounded-2xl border border-slate-200/80 hover:border-amber-400/50 transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                            <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <span className="bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                              {art.category}
                            </span>
                            <span>pp. {art.page_numbers || '1-12'}</span>
                            <span>•</span>
                            <span className="text-slate-600">DOI: {art.doi || '10.5281/zenodo'}</span>
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
                            {art.authors.map(a => a.name).join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareModalArticle(art);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-300/80 transition flex items-center space-x-1"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={(e) => handlePdfView(e, art)}
                            className="px-2.5 py-1.5 bg-white hover:bg-red-900 hover:text-white text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View PDF</span>
                          </button>
                          <button
                            onClick={(e) => handlePdfDownload(e, art.id, art.pdf_url || '')}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-red-950 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SharePaperModal
        article={shareModalArticle}
        isOpen={!!shareModalArticle}
        onClose={() => setShareModalArticle(null)}
        lang={lang}
      />
    </div>
  );
};

