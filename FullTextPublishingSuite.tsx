import React, { useState, useEffect, useRef } from 'react';
import { Article, Author, CustomSectionBlock, ArticleSection, ArticleMedia, ArticleRevision } from '../../types';
import { SectionRichEditor } from './SectionRichEditor';
import { WordPasteImporter } from '../common/WordPasteImporter';
import { AcademicPdfExporter } from '../common/AcademicPdfExporter';
import { FileUploadZone } from '../common/FileUploadZone';
import { useCms } from '../../lib/CmsContext';
import { ParsedWordArticle, cleanWordHtml } from '../../lib/wordParser';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Edit3, 
  Save, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  FileText, 
  Wand2, 
  Layers, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Send, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Printer, 
  Download, 
  Share2, 
  UserPlus, 
  Calendar, 
  Award, 
  ShieldCheck, 
  List,
  Loader2,
  ExternalLink,
  AlertTriangle,
  FileCheck,
  Upload
} from 'lucide-react';

interface FullTextPublishingSuiteProps {
  article: Article;
  onSave: (updatedArticle: Article) => void | Promise<void>;
  onDelete?: (articleId: string) => void | Promise<void>;
  onClose: () => void;
  lang?: 'hi' | 'en';
}

export const FullTextPublishingSuite: React.FC<FullTextPublishingSuiteProps> = ({
  article: initialArticle,
  onSave,
  onDelete,
  onClose,
  lang = 'hi'
}) => {
  const { openPdfViewer, issues = [], setActiveView } = useCms();
  const [article, setArticle] = useState<Article>({ ...initialArticle });
  const [activeStep, setActiveStep] = useState<'metadata' | 'authors' | 'abstract' | 'sections' | 'pdf' | 'history' | 'preview'>('sections');
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  
  // Section Builder State
  const [sectionsList, setSectionsList] = useState<ArticleSection[]>(() => {
    if (Array.isArray(initialArticle.sections)) {
      return [...initialArticle.sections];
    }
    // Fallback if initialArticle.sections is undefined:
    // Build sections dynamically from non-empty full_text_ fields if present
    const existingSections: ArticleSection[] = [];
    let order = 1;

    if (initialArticle.full_text_introduction?.trim()) {
      existingSections.push({
        id: 'sec_intro',
        section_type: 'introduction',
        section_title: 'Introduction (प्रस्तावना)',
        content_html: initialArticle.full_text_introduction,
        sort_order: order++
      });
    }
    if (initialArticle.full_text_literature_review?.trim()) {
      existingSections.push({
        id: 'sec_literature',
        section_type: 'literature_review',
        section_title: 'Literature Review (साहित्य अवलोकन)',
        content_html: initialArticle.full_text_literature_review,
        sort_order: order++
      });
    }
    if (initialArticle.full_text_methodology?.trim()) {
      existingSections.push({
        id: 'sec_methodology',
        section_type: 'methodology',
        section_title: 'Research Methodology (अनुसंधान कार्यप्रणाली)',
        content_html: initialArticle.full_text_methodology,
        sort_order: order++
      });
    }
    if (initialArticle.full_text_results_discussion?.trim()) {
      existingSections.push({
        id: 'sec_results',
        section_type: 'results',
        section_title: 'Results & Discussion (परिणाम एवं विश्लेषण)',
        content_html: initialArticle.full_text_results_discussion,
        sort_order: order++
      });
    }
    if (initialArticle.full_text_conclusion?.trim()) {
      existingSections.push({
        id: 'sec_conclusion',
        section_type: 'conclusion',
        section_title: 'Conclusion (निष्कर्ष)',
        content_html: initialArticle.full_text_conclusion,
        sort_order: order++
      });
    }
    if (initialArticle.full_text_acknowledgement?.trim()) {
      existingSections.push({
        id: 'sec_ack',
        section_type: 'acknowledgement',
        section_title: 'Acknowledgement (आभार)',
        content_html: initialArticle.full_text_acknowledgement,
        sort_order: order++
      });
    }

    if (existingSections.length > 0) {
      return existingSections;
    }

    // Default for brand new or unstructured articles: a single clean article body section
    return [
      {
        id: 'sec_body_' + Date.now(),
        section_type: 'custom',
        section_title: 'आलेख मुख्य पाठ (Article Content)',
        content_html: '<p>यहाँ आलेख का मुख्य पाठ दर्ज करें...</p>',
        sort_order: 1
      }
    ];
  });

  // Autosave status & timing
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showWordPasteModal, setShowWordPasteModal] = useState(false);
  const [localDraftAvailable, setLocalDraftAvailable] = useState(false);

  // Add Section Modal state
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionType, setNewSectionType] = useState('custom');
  const [newSectionOrder, setNewSectionOrder] = useState(10);

  // Revisions History
  const [revisions, setRevisions] = useState<ArticleRevision[]>(initialArticle.revisions_history || []);

  // Keep internal state in sync if initialArticle changes
  useEffect(() => {
    setArticle({ ...initialArticle });
    if (Array.isArray(initialArticle.sections)) {
      setSectionsList([...initialArticle.sections]);
    }
  }, [initialArticle.id, initialArticle.updated_at]);

  // Check Local Draft Backup on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('draft_article_' + article.id);
      if (savedDraft) {
        setLocalDraftAvailable(true);
      }
    } catch (e) {
      console.error('LocalStorage error', e);
    }
  }, [article.id]);

  const handleRestoreLocalDraft = () => {
    try {
      const savedDraft = localStorage.getItem('draft_article_' + article.id);
      if (savedDraft) {
        const parsedDraft: Article = JSON.parse(savedDraft);
        setArticle(parsedDraft);
        if (Array.isArray(parsedDraft.sections)) {
          setSectionsList(parsedDraft.sections);
        }
        setLocalDraftAvailable(false);
        notifyChange();
      }
    } catch (e) {
      console.error('Failed to parse local draft', e);
    }
  };

  const handleDiscardLocalDraft = () => {
    try {
      localStorage.removeItem('draft_article_' + article.id);
      setLocalDraftAvailable(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard Shortcuts (Ctrl+S / Cmd+S) and BeforeUnload Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        performAutosave();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes!';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, article, sectionsList]);

  // Autosave timer every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasUnsavedChanges) {
        performAutosave();
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [hasUnsavedChanges, article, sectionsList]);

  // Total word count across all sections
  const totalWordCount = React.useMemo(() => {
    return sectionsList.reduce((acc, sec) => {
      const text = (sec.content_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return acc + (text ? text.split(/\s+/).length : 0);
    }, 0);
  }, [sectionsList]);

  // Autosave handler
  const performAutosave = async () => {
    setSaveStatus('saving');
    setIsAutosaving(true);

    const introSec = sectionsList.find(s => s.section_type === 'introduction');
    const litSec = sectionsList.find(s => s.section_type === 'literature_review');
    const methSec = sectionsList.find(s => s.section_type === 'methodology');
    const resSec = sectionsList.find(s => s.section_type === 'results' || s.section_type === 'discussion');
    const concSec = sectionsList.find(s => s.section_type === 'conclusion');
    const ackSec = sectionsList.find(s => s.section_type === 'acknowledgement');

    const updated: Article = {
      ...article,
      sections: sectionsList,
      full_text_introduction: introSec ? introSec.content_html : '',
      full_text_literature_review: litSec ? litSec.content_html : '',
      full_text_methodology: methSec ? methSec.content_html : '',
      full_text_results_discussion: resSec ? resSec.content_html : '',
      full_text_conclusion: concSec ? concSec.content_html : '',
      full_text_acknowledgement: ackSec ? ackSec.content_html : '',
      updated_at: new Date().toISOString()
    };

    try {
      await onSave(updated);
      try {
        localStorage.setItem('draft_article_' + article.id, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Save snapshot to revision history
      const newRev: ArticleRevision = {
        id: 'rev_' + Date.now(),
        timestamp: new Date().toLocaleTimeString('hi-IN'),
        note: 'Autosaved Draft',
        article_data: updated
      };
      setRevisions(prev => [newRev, ...prev.slice(0, 9)]);
      setLastSavedTime(new Date().toLocaleTimeString('hi-IN'));
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setIsAutosaving(false), 600);
    } catch (err) {
      console.error('Autosave error', err);
      try {
        localStorage.setItem('draft_article_' + article.id, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      setSaveStatus('failed');
      setIsAutosaving(false);
    }
  };

  // Mark changes
  const notifyChange = () => {
    setHasUnsavedChanges(true);
  };

  // Section Builder Operations
  const handleUpdateSectionContent = (id: string, html: string) => {
    setSectionsList(prev => prev.map(s => s.id === id ? { ...s, content_html: html, word_count: html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length } : s));
    notifyChange();
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    setSectionsList(prev => prev.map(s => s.id === id ? { ...s, section_title: newTitle } : s));
    notifyChange();
  };

  const handleAddCustomSection = () => {
    setNewSectionTitle(`${sectionsList.length + 1}. नवीन अनुभाग (New Section)`);
    setNewSectionType('custom');
    setNewSectionOrder(sectionsList.length + 1);
    setShowAddSectionModal(true);
  };

  const handleDeleteSection = (id: string) => {
    setSectionsList(prev => prev.filter(s => s.id !== id));
    notifyChange();
  };

  const handleDuplicateSection = (sec: ArticleSection) => {
    const dup: ArticleSection = {
      ...sec,
      id: 'sec_dup_' + Date.now(),
      section_title: `${sec.section_title} (प्रतिलिपि)`,
      sort_order: sec.sort_order + 0.1
    };
    const idx = sectionsList.findIndex(s => s.id === sec.id);
    const updated = [...sectionsList];
    updated.splice(idx + 1, 0, dup);
    setSectionsList(updated);
    notifyChange();
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sectionsList.length - 1)) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...sectionsList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSectionsList(updated);
    notifyChange();
  };

  // Apply Parsed Word Document to Sections
  const handleApplyWordArticle = (parsed: ParsedWordArticle) => {
    const newSections: ArticleSection[] = [];
    let order = 1;

    if (parsed.full_text_introduction?.trim()) {
      newSections.push({
        id: 'sec_intro_' + Date.now(),
        section_type: 'introduction',
        section_title: 'Introduction (प्रस्तावना)',
        content_html: cleanWordHtml(parsed.full_text_introduction),
        sort_order: order++
      });
    }

    if (parsed.full_text_literature_review?.trim()) {
      newSections.push({
        id: 'sec_lit_' + Date.now(),
        section_type: 'literature_review',
        section_title: 'Literature Review (साहित्य अवलोकन)',
        content_html: cleanWordHtml(parsed.full_text_literature_review),
        sort_order: order++
      });
    }

    if (parsed.full_text_methodology?.trim()) {
      newSections.push({
        id: 'sec_meth_' + Date.now(),
        section_type: 'methodology',
        section_title: 'Research Methodology (अनुसंधान कार्यप्रणाली)',
        content_html: cleanWordHtml(parsed.full_text_methodology),
        sort_order: order++
      });
    }

    if (parsed.full_text_results_discussion?.trim()) {
      newSections.push({
        id: 'sec_res_' + Date.now(),
        section_type: 'results',
        section_title: 'Results & Discussion (परिणाम एवं विश्लेषण)',
        content_html: cleanWordHtml(parsed.full_text_results_discussion),
        sort_order: order++
      });
    }

    if (parsed.full_text_conclusion?.trim()) {
      newSections.push({
        id: 'sec_conc_' + Date.now(),
        section_type: 'conclusion',
        section_title: 'Conclusion (निष्कर्ष)',
        content_html: cleanWordHtml(parsed.full_text_conclusion),
        sort_order: order++
      });
    }

    if (parsed.full_text_acknowledgement?.trim()) {
      newSections.push({
        id: 'sec_ack_' + Date.now(),
        section_type: 'acknowledgement',
        section_title: 'Acknowledgement (आभार)',
        content_html: cleanWordHtml(parsed.full_text_acknowledgement),
        sort_order: order++
      });
    }

    if (parsed.references && parsed.references.length > 0) {
      newSections.push({
        id: 'sec_refs_' + Date.now(),
        section_type: 'references',
        section_title: 'References (संदर्भ ग्रंथ सूची)',
        content_html: parsed.references.map(r => `<p class="pl-5 -indent-5 mb-1.5 font-serif text-sm">${r}</p>`).join(''),
        sort_order: order++
      });
    }

    if (newSections.length === 0) {
      newSections.push({
        id: 'sec_body_' + Date.now(),
        section_type: 'custom',
        section_title: 'आलेख मुख्य पाठ (Article Content)',
        content_html: cleanWordHtml(parsed.full_text_introduction || '') || '<p>वर्ड दस्तावेज़ का मुख्य पाठ...</p>',
        sort_order: 1
      });
    }

    setArticle(prev => ({
      ...prev,
      title_hindi: parsed.title_hindi || prev.title_hindi,
      title_english: parsed.title_english || prev.title_english,
      authors: parsed.authors.length > 0 ? parsed.authors : prev.authors,
      abstract_hindi: parsed.abstract_hindi || prev.abstract_hindi,
      abstract_english: parsed.abstract_english || prev.abstract_english,
      keywords: parsed.keywords.length > 0 ? parsed.keywords : prev.keywords,
      references: parsed.references
    }));

    setSectionsList(newSections);
    setShowWordPasteModal(false);
    notifyChange();
  };

  // Apply Journal Formatting to All Sections
  const handleApplyJournalFormattingAll = () => {
    setSectionsList(prev => prev.map(s => ({
      ...s,
      content_html: `<div class="journal-standard-article font-serif text-base leading-relaxed text-justify text-slate-900 space-y-3 font-normal">${cleanWordHtml(s.content_html)}</div>`
    })));
    notifyChange();
  };

  // Submit / Save / Publish Actions
  const handleFinalSave = async (targetStatus?: 'draft' | 'submitted' | 'published', isExplicitPublishing: boolean = false) => {
    setSaveStatus('saving');
    setIsAutosaving(true);

    const introSec = sectionsList.find(s => s.section_type === 'introduction');
    const litSec = sectionsList.find(s => s.section_type === 'literature_review');
    const methSec = sectionsList.find(s => s.section_type === 'methodology');
    const resSec = sectionsList.find(s => s.section_type === 'results' || s.section_type === 'discussion');
    const concSec = sectionsList.find(s => s.section_type === 'conclusion');
    const ackSec = sectionsList.find(s => s.section_type === 'acknowledgement');

    const statusToSave = targetStatus !== undefined ? targetStatus : (article.status || 'draft');

    const updated: Article = {
      ...article,
      sections: sectionsList,
      status: statusToSave,
      content_mode: article.content_mode || 'full_text',
      full_text_introduction: introSec ? introSec.content_html : '',
      full_text_literature_review: litSec ? litSec.content_html : '',
      full_text_methodology: methSec ? methSec.content_html : '',
      full_text_results_discussion: resSec ? resSec.content_html : '',
      full_text_conclusion: concSec ? concSec.content_html : '',
      full_text_acknowledgement: ackSec ? ackSec.content_html : '',
      updated_at: new Date().toISOString()
    };

    setArticle(updated);
    try {
      await onSave(updated);
      try {
        localStorage.setItem('draft_article_' + updated.id, JSON.stringify(updated));
      } catch (e) {}

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString('hi-IN'));
      setSaveStatus('saved');
      setIsAutosaving(false);

      if (isExplicitPublishing) {
        setShowPublishSuccessModal(true);
      } else {
        if (statusToSave === 'draft') {
          showToast(lang === 'hi' ? 'शोध पत्र ड्राफ्ट के रूप में सहेजा गया!' : 'Saved as draft!');
        } else {
          showToast(lang === 'hi' ? 'नवीन डेटा व परिवर्तन सहेजे गए!' : 'Changes saved successfully!');
        }
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('failed');
      setIsAutosaving(false);
      alert(lang === 'hi' ? 'त्रुटि: सहेजने में समस्या आई।' : 'Error saving article.');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen p-3 sm:p-6 font-sans space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-300 border border-emerald-500/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-2 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-slate-950 shadow-md">
            <BookOpen className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <span>{lang === 'hi' ? 'शोध आलेख संपादक (Full-Text Article Publishing Suite)' : 'Full-Text Article Publishing Suite'}</span>
              <span className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                article.status === 'published' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-amber-950 text-amber-300 border-amber-700'
              }`}>
                {article.status}
              </span>
            </h2>
            <p className="text-xs text-amber-300/80 font-mono flex items-center gap-2 flex-wrap">
              <span>{article.title_hindi || article.title_english || 'शीर्षकहीन आलेख'}</span>
              <span className="bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded text-[11px] border border-amber-700">
                कुल शब्द (Total Words): {totalWordCount}
              </span>
              {article.page_numbers && (
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[11px] border border-emerald-800 font-bold">
                  Pages: {article.page_numbers}
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Saving... (सहेजा जा रहा है...)
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Saved (सहेजा गया {lastSavedTime})
                </span>
              )}
              {saveStatus === 'failed' && (
                <span className="flex items-center gap-1 text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-700">
                  <AlertTriangle className="w-3 h-3 text-red-400" /> Failed to save
                  <button type="button" onClick={performAutosave} className="underline text-red-200 hover:text-white font-bold ml-1">Retry</button>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Typeset Academic PDF */}
          <AcademicPdfExporter
            article={{ ...article, sections: sectionsList }}
            lang={lang}
            buttonLabel="Typeset PDF डाउनलोड"
          />

          {/* Word Import Button */}
          <button
            type="button"
            onClick={() => setShowWordPasteModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Wand2 className="w-4 h-4" />
            <span>Word पेस्ट / .DOCX</span>
          </button>

          {/* Apply Journal Formatting All */}
          <button
            type="button"
            onClick={handleApplyJournalFormattingAll}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Apply Journal Formatting to All Sections"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>जर्नल शैली लागू करें</span>
          </button>

          {/* Save Changes Only (Saves new data without re-triggering publish status modal) */}
          <button
            type="button"
            onClick={() => handleFinalSave(article.status || 'draft', false)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="केवल डेटा व परिवर्तन सहेजें (Save Changes Only)"
          >
            <Save className="w-4 h-4 text-amber-100" />
            <span>केवल सहेजें (Save)</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={() => handleFinalSave('draft', false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
            title="ड्राफ्ट के रूप में सहेजें (Save as Draft)"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>ड्राफ्ट सहेजें (Save Draft)</span>
          </button>

          {/* Publish / Update & Publish Button */}
          <button
            type="button"
            onClick={() => handleFinalSave('published', true)}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            title="प्रकाशित करें या स्थिति अपडेट करें"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{article.status === 'published' ? 'अपडेट व प्रकाशित करें' : 'प्रकाशित करें (Publish)'}</span>
          </button>

          {/* Delete Article Button */}
          {onDelete && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirmModal(true)}
              className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="शोध पत्र हटाएं (Delete Paper)"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">हटाएं (Delete)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Local Draft Backup Banner */}
      {localDraftAvailable && (
        <div className="bg-amber-100 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold font-serif">
            <FileCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>स्थानीय ड्राफ्ट बैकअप उपलब्ध है (Unsaved Local Draft Backup Found in Browser)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreLocalDraft}
              className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-2xs transition"
            >
              Restore Local Draft
            </button>
            <button
              type="button"
              onClick={handleDiscardLocalDraft}
              className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 rounded-xl font-bold transition"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-300 p-1.5 text-xs font-bold overflow-x-auto no-scrollbar touch-scroll shadow-2xs gap-1.5 py-2">
        <button
          onClick={() => setActiveStep('sections')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'sections' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Section Builder ({sectionsList.length} Sections)</span>
        </button>

        <button
          onClick={() => setActiveStep('metadata')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'metadata' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. मेटाडेटा व तिथियां (Metadata & Dates)</span>
        </button>

        <button
          onClick={() => setActiveStep('authors')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'authors' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>3. लेखक विवरण ({article.authors.length} Authors)</span>
        </button>

        <button
          onClick={() => setActiveStep('abstract')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'abstract' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. सार व कुंजी शब्द (Abstract & Keywords)</span>
        </button>

        <button
          onClick={() => setActiveStep('pdf')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'pdf' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>5. PDF अटैचमेंट (Article PDF)</span>
          {article.pdf_url ? (
            <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">✓ Attached</span>
          ) : (
            <span className="bg-slate-200 text-slate-600 font-mono text-[10px] px-1.5 py-0.5 rounded">Optional</span>
          )}
        </button>

        <button
          onClick={() => setActiveStep('history')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'history' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>6. संस्करण इतिहास ({revisions.length} Snapshots)</span>
        </button>

        <button
          onClick={() => setActiveStep('preview')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeStep === 'preview' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>7. शोध पत्र पूर्वावलोकन (Journal Live Preview)</span>
        </button>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeStep === 'sections' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar Section Drawer */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-300 p-4 space-y-4 shadow-xs sticky top-24">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2">
                <List className="w-4 h-4 text-amber-600" />
                <span>अनुभाग संरचना (Sections)</span>
              </h3>
              <button
                type="button"
                onClick={handleAddCustomSection}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ जोड़ें</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {sectionsList.length === 0 ? (
                <div className="text-center p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 space-y-2">
                  <p>कोई अनुभाग शेष नहीं है (No sections remaining)</p>
                  <button
                    type="button"
                    onClick={handleAddCustomSection}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-xs hover:bg-amber-700"
                  >
                    + नया अनुभाग जोड़ें
                  </button>
                </div>
              ) : (
                sectionsList.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-slate-50 hover:bg-amber-50/60 rounded-xl border border-slate-200 text-xs transition space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <input
                        type="text"
                        value={sec.section_title}
                        onChange={(e) => handleUpdateSectionTitle(sec.id, e.target.value)}
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-amber-500 outline-none w-full text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="font-mono">{sec.word_count || 0} words</span>

                      {/* Section Order Controls */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === sectionsList.length - 1}
                          className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(sec)}
                          className="p-1 hover:bg-slate-200 rounded text-amber-700"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Main Editor Canvas */}
          <div className="lg:col-span-3 space-y-6">
            {sectionsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4 shadow-xs">
                <FileText className="w-12 h-12 text-amber-600 mx-auto opacity-50" />
                <h4 className="font-serif font-bold text-base text-slate-800">
                  सभी अनुभाग हटा दिए गए हैं (All sections removed)
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  आप बिना किसी पूर्व-निर्धारित हेडिंग के नया अनुभाग या स्वतंत्र आलेख पाठ जोड़ सकते हैं।
                </p>
                <button
                  type="button"
                  onClick={handleAddCustomSection}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ नया अनुभाग या आलेख मुख्य पाठ जोड़ें</span>
                </button>
              </div>
            ) : (
              sectionsList.map((sec) => (
                <SectionRichEditor
                  key={sec.id}
                  sectionTitle={sec.section_title}
                  initialHtml={sec.content_html}
                  onChange={(html) => handleUpdateSectionContent(sec.id, html)}
                  lang={lang}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Metadata Tab */}
      {activeStep === 'metadata' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
          <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3 border-slate-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>शोध पत्र शीर्षक, जर्नल अंक, पृष्ठ संख्या व मेटाडेटा</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title Hindi */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">शोध आलेख शीर्षक (हिंदी):</label>
              <input
                type="text"
                value={article.title_hindi}
                onChange={(e) => {
                  setArticle({ ...article, title_hindi: e.target.value });
                  notifyChange();
                }}
                placeholder="उदा. क्षत्रिय पवार गोत्र व सामाजिक-सांस्कृतिक विकास"
                className="w-full p-3 border border-slate-300 rounded-xl font-serif text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Title English */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Article Title (English):</label>
              <input
                type="text"
                value={article.title_english}
                onChange={(e) => {
                  setArticle({ ...article, title_english: e.target.value });
                  notifyChange();
                }}
                placeholder="e.g. Socio-Cultural Evolution of Pawari Dialect"
                className="w-full p-3 border border-slate-300 rounded-xl font-serif text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Page Numbers Field (पृष्ठ संख्या) */}
            <div className="sm:col-span-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>पृष्ठ संख्या / Page Numbers (Range):</span>
                </label>
                {article.page_numbers && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">
                    Citation Format: pp. {article.page_numbers}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={article.page_numbers || ''}
                  onChange={(e) => {
                    setArticle({ ...article, page_numbers: e.target.value });
                    notifyChange();
                  }}
                  placeholder="उदा. 01–15 या 12–28"
                  className="w-full p-3 border border-amber-300 bg-white rounded-xl font-mono text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-amber-800">
                नोट: यह पृष्ठ संख्या प्रकाशित जर्नल अंक में इस लेख के आबंटित पृष्ठों (e.g. "01–15") को दर्शाती है और PDF / APA / MLA साइटेशन में प्रदर्शित होगी।
              </p>
            </div>

            {/* Journal Issue Selection */}
            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-900 text-xs">जर्नल अंक व खण्ड आवंटन (Journal Issue Allocation):</label>
              
              {issues.length > 0 && (
                <div>
                  <select
                    value={`${article.volume}_${article.issue}`}
                    onChange={(e) => {
                      const selected = issues.find(i => `${i.volume}_${i.issue_number}` === e.target.value);
                      if (selected) {
                        setArticle({
                          ...article,
                          volume: selected.volume,
                          issue: selected.issue_number,
                          year: selected.year
                        });
                        notifyChange();
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold text-xs"
                  >
                    <option value="">-- प्रकाशित अंकों में से चुनें (Select Published Issue) --</option>
                    {issues.map(iss => (
                      <option key={iss.id} value={`${iss.volume}_${iss.issue_number}`}>
                        Vol. {iss.volume}, Issue {iss.issue_number} ({iss.title_hindi || iss.title_english || iss.year})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Volume (खण्ड):</label>
                  <input
                    type="number"
                    value={article.volume || 1}
                    onChange={(e) => {
                      setArticle({ ...article, volume: Number(e.target.value) });
                      notifyChange();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Issue (अंक):</label>
                  <input
                    type="number"
                    value={article.issue || 1}
                    onChange={(e) => {
                      setArticle({ ...article, issue: Number(e.target.value) });
                      notifyChange();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Year (वर्ष):</label>
                  <input
                    type="number"
                    value={article.year || new Date().getFullYear()}
                    onChange={(e) => {
                      setArticle({ ...article, year: Number(e.target.value) });
                      notifyChange();
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Article Type */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">आलेख प्रकार (Article Type):</label>
              <select
                value={article.article_type}
                onChange={(e: any) => {
                  setArticle({ ...article, article_type: e.target.value });
                  notifyChange();
                }}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 font-semibold"
              >
                <option value="Research Article">Research Article (मूल शोध आलेख)</option>
                <option value="Review Article">Review Article (समीक्षा आलेख)</option>
                <option value="Case Report">Case Report (केस रिपोर्ट)</option>
                <option value="Research Note">Research Note (शोध टिप्पणी)</option>
                <option value="Editorial">Editorial (संपादकीय)</option>
                <option value="Book Review">Book Review (पुस्तक समीक्षा)</option>
              </select>
            </div>

            {/* Discipline / Category */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">विषय / श्रेणी (Category):</label>
              <input
                type="text"
                value={article.category || ''}
                onChange={(e) => {
                  setArticle({ ...article, category: e.target.value });
                  notifyChange();
                }}
                placeholder="उदा. पवारी भाषाविज्ञान व संस्कृति"
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 font-semibold"
              />
            </div>

            {/* DOI Number */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">DOI Number:</label>
              <input
                type="text"
                value={article.doi || ''}
                onChange={(e) => {
                  setArticle({ ...article, doi: e.target.value });
                  notifyChange();
                }}
                placeholder="10.5281/zenodo.psp.2026.XXXX"
                className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs text-slate-800"
              />
            </div>

            {/* Primary Language */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">भाषा (Language):</label>
              <select
                value={article.language || 'Hindi'}
                onChange={(e) => {
                  setArticle({ ...article, language: e.target.value });
                  notifyChange();
                }}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 font-semibold"
              >
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="English">English</option>
                <option value="Pawari">पवारी (Pawari)</option>
                <option value="Bilingual">द्विभाषी (Bilingual)</option>
              </select>
            </div>

            {/* Received Date */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">प्राप्ति तिथि (Received Date):</label>
              <input
                type="date"
                value={article.date_received || ''}
                onChange={(e) => {
                  setArticle({ ...article, date_received: e.target.value });
                  notifyChange();
                }}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800"
              />
            </div>

            {/* Accepted Date */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">स्वीकृति तिथि (Accepted Date):</label>
              <input
                type="date"
                value={article.date_accepted || ''}
                onChange={(e) => {
                  setArticle({ ...article, date_accepted: e.target.value });
                  notifyChange();
                }}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">प्रकाशन तिथि (Published Date):</label>
              <input
                type="date"
                value={article.date_published || ''}
                onChange={(e) => {
                  setArticle({ ...article, date_published: e.target.value });
                  notifyChange();
                }}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Authors Tab */}
      {activeStep === 'authors' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              <span>लेखक एवं संस्थान विवरण (Authors & Affiliations)</span>
            </h3>
            <button
              type="button"
              onClick={() => setArticle({ ...article, authors: [...article.authors, { name: '', affiliation: '', email: '', orcid: '' }] })}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>+ सह-लेखक जोड़ें</span>
            </button>
          </div>

          <div className="space-y-4">
            {article.authors.map((au, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                  <span>लेखक {idx + 1} {au.is_corresponding ? '(प्रमुख पत्राचार लेखक)' : ''}</span>
                  {article.authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setArticle({ ...article, authors: article.authors.filter((_, i) => i !== idx) })}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">पूरा नाम (Author Name):</label>
                    <input
                      type="text"
                      value={au.name}
                      onChange={(e) => {
                        const updated = [...article.authors];
                        updated[idx].name = e.target.value;
                        setArticle({ ...article, authors: updated });
                      }}
                      placeholder="उदा. डॉ. राजेश पंवार"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ईमेल (Email):</label>
                    <input
                      type="email"
                      value={au.email || ''}
                      onChange={(e) => {
                        const updated = [...article.authors];
                        updated[idx].email = e.target.value;
                        setArticle({ ...article, authors: updated });
                      }}
                      placeholder="author@university.edu"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">संस्थान एवं पता (Affiliation):</label>
                    <input
                      type="text"
                      value={au.affiliation || ''}
                      onChange={(e) => {
                        const updated = [...article.authors];
                        updated[idx].affiliation = e.target.value;
                        setArticle({ ...article, authors: updated });
                      }}
                      placeholder="उदा. पवारी भाषा अध्ययन केंद्र, विश्वविद्यालय, भोपाल (म.प्र.)"
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abstract Tab */}
      {activeStep === 'abstract' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
          <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3 border-slate-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>सार एवं कुंजी शब्द (Abstracts & Keywords)</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">सार / Abstract (हिंदी):</label>
              <textarea
                rows={5}
                value={article.abstract_hindi}
                onChange={(e) => setArticle({ ...article, abstract_hindi: e.target.value })}
                placeholder="शोध पत्र का मुख्य सार दर्ज करें..."
                className="w-full p-3 border border-slate-300 rounded-xl font-serif text-slate-900 leading-relaxed outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Abstract (English):</label>
              <textarea
                rows={5}
                value={article.abstract_english}
                onChange={(e) => setArticle({ ...article, abstract_english: e.target.value })}
                placeholder="Enter English abstract..."
                className="w-full p-3 border border-slate-300 rounded-xl font-serif text-slate-900 leading-relaxed outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">कुंजी शब्द (Keywords - comma separated):</label>
              <input
                type="text"
                value={(article.keywords || []).join(', ')}
                onChange={(e) => setArticle({ ...article, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
                placeholder="पवारी भाषा, क्षत्रिय पवार, लोक साहित्य, समाजशास्त्र"
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF Attachment & Firebase Storage Tab */}
      {activeStep === 'pdf' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between border-b pb-3 border-slate-200 gap-2">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-600" />
              <span>शोध आलेख PDF अटैचमेंट व क्लाउड स्टोरेज (Firebase Storage)</span>
            </h3>
            {article.pdf_url ? (
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Firebase Storage में सहेजा गया</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-medium text-xs rounded-full">
                PDF फ़ाइल संलग्न नहीं है
              </span>
            )}
          </div>

          {/* Content Publishing Mode Selection */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block font-bold text-xs text-slate-800">प्रकाशन मोड (Content Mode):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                (article.content_mode || 'full_text') === 'full_text' 
                  ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="content_mode"
                  value="full_text"
                  checked={(article.content_mode || 'full_text') === 'full_text'}
                  onChange={() => {
                    setArticle({ ...article, content_mode: 'full_text' });
                    notifyChange();
                  }}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <span className="block font-bold text-slate-900">Full Text + PDF Download (अनुशंसित)</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    पाठक वेबसाइट पर पूरा HTML पाठ पढ़ सकते हैं एवं संलग्न PDF भी डाउनलोड/देख सकते हैं।
                  </span>
                </div>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                article.content_mode === 'pdf_only' 
                  ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
                <input
                  type="radio"
                  name="content_mode"
                  value="pdf_only"
                  checked={article.content_mode === 'pdf_only'}
                  onChange={() => {
                    setArticle({ ...article, content_mode: 'pdf_only' });
                    notifyChange();
                  }}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <span className="block font-bold text-slate-900">PDF Only Mode (केवल PDF View)</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    वेबसाइट आलेख पृष्ठ पर मुख्य रूप से केवल embedded PDF viewer प्रदर्शित होगा।
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* FileUploadZone Component */}
          <div className="space-y-2">
            <label className="block font-bold text-xs text-slate-800">
              Firebase Storage में PDF फ़ाइल अपलोड करें:
            </label>
            <FileUploadZone
              acceptedCategory="documents"
              maxFiles={1}
              customFolder="articles/pdfs"
              label="शोध पत्र PDF अपलोड करें (Upload Article PDF)"
              description="PDF फ़ाइल को यहाँ ड्रैग-ड्रॉप करें या कंप्यूटर से चुनें। फ़ाइल स्वचालित रूप से Firebase Storage में सुरक्षित रूप से सहेजी जाएगी (Max 15MB)।"
              onUploadComplete={(file) => {
                setArticle(prev => ({
                  ...prev,
                  pdf_url: file.url,
                  pdf_storage_path: file.path
                }));
                notifyChange();
              }}
            />
          </div>

          {/* Direct URL Input */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block font-bold text-xs text-slate-800">
              या प्रत्यक्ष PDF URL दर्ज करें (Or Direct PDF Link):
            </label>
            <input
              type="text"
              value={article.pdf_url || ''}
              onChange={(e) => {
                setArticle({ ...article, pdf_url: e.target.value });
                notifyChange();
              }}
              placeholder="https://firebasestorage.googleapis.com/.../article.pdf"
              className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Current Attached PDF Status Card */}
          {article.pdf_url && (
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">संलग्न PDF विवरण (Attached PDF File)</h4>
                    <p className="text-xs text-emerald-800 font-mono truncate max-w-md">
                      {article.pdf_storage_path || article.pdf_url}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openPdfViewer(article.pdf_url || '', article.title_hindi || article.title_english || 'Article')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>PDF देखें (Live Viewer)</span>
                  </button>
                  <a
                    href={article.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>डाउनलोड</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('क्या आप सचमुच संलग्न PDF फ़ाइल हटाना चाहते हैं?')) {
                        setArticle({ ...article, pdf_url: '', pdf_storage_path: '' });
                        notifyChange();
                      }
                    }}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revisions History Tab */}
      {activeStep === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
          <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3 border-slate-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>संस्करण इतिहास एवं स्वतः सहेजे गए ड्राफ्ट (Autosave Revision History)</span>
          </h3>

          {revisions.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">अभी तक कोई पुराना संस्करण उपलब्ध नहीं है।</p>
          ) : (
            <div className="space-y-3 text-xs">
              {revisions.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{rev.note}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{rev.timestamp}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (rev.article_data) {
                        setArticle(prev => ({ ...prev, ...rev.article_data }));
                        if (rev.article_data.sections) setSectionsList(rev.article_data.sections);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>पुनर्स्थापित करें (Restore)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Journal Live Preview Modal / Tab */}
      {activeStep === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 space-y-8 shadow-xl max-w-5xl mx-auto font-serif text-slate-900">
          {/* Header */}
          <div className="border-b-2 border-amber-900 pb-6 text-center space-y-2">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-widest font-sans">
              PAWARI SHODH PATRIKA • ISSN: 2583-8422 • VOL. {article.volume || 1}, ISSUE {article.issue || 1} ({article.year || 2026}) • PAGES: {article.page_numbers || '01–15'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {article.title_hindi || article.title_english}
            </h1>
            {article.title_english && article.title_hindi && (
              <h2 className="text-lg font-medium text-slate-700 italic">
                {article.title_english}
              </h2>
            )}

            <div className="pt-2 font-sans text-xs font-bold text-slate-800 space-y-0.5">
              <p>{article.authors.map(a => a.name).join(', ')}</p>
              <p className="text-slate-500 font-normal">{article.authors.map(a => a.affiliation).join(' | ')}</p>
            </div>
          </div>

          {/* Abstract Box */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-3 text-xs leading-relaxed">
            <h4 className="font-bold text-amber-900 uppercase tracking-wider font-sans">Abstract / सार:</h4>
            <p className="text-justify font-serif text-sm">{article.abstract_hindi || article.abstract_english}</p>
            <div className="pt-2 font-sans font-semibold text-amber-950 flex flex-wrap gap-1">
              <span>Keywords:</span>
              {(article.keywords || []).map((k, i) => (
                <span key={i} className="bg-white px-2 py-0.5 rounded border border-amber-200">{k}</span>
              ))}
            </div>
          </div>

          {/* All Sections Preview */}
          <div className="space-y-8">
            {sectionsList.map((sec) => (
              <div key={sec.id} className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-200 pb-1">
                  {sec.section_title}
                </h3>
                <div
                  className="journal-preview-rendered font-serif text-base leading-relaxed text-justify text-slate-900 space-y-3"
                  dangerouslySetInnerHTML={{ __html: sec.content_html }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <span>नया अनुभाग जोड़ें (Add New Section)</span>
              </h3>
              <button onClick={() => setShowAddSectionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">अनुभाग शीर्षक (Section Title):</label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="उदा. 8. Case Study / केस स्टडी"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">अनुभाग प्रकार (Section Type):</label>
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                >
                  <option value="custom">Custom Section (कस्टम)</option>
                  <option value="abstract">Abstract (सार)</option>
                  <option value="keywords">Keywords (कुंजी शब्द)</option>
                  <option value="introduction">Introduction (प्रस्तावना)</option>
                  <option value="literature_review">Literature Review (साहित्य अवलोकन)</option>
                  <option value="methodology">Methodology (अनुसंधान कार्यप्रणाली)</option>
                  <option value="results">Results (परिणाम)</option>
                  <option value="discussion">Discussion (विश्लेषण व विवेचना)</option>
                  <option value="conclusion">Conclusion (निष्कर्ष)</option>
                  <option value="acknowledgement">Acknowledgement (आभार)</option>
                  <option value="references">References (संदर्भ)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">क्रम स्थान (Sort Order):</label>
                <input
                  type="number"
                  value={newSectionOrder}
                  onChange={(e) => setNewSectionOrder(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-500 outline-none text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-3 border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newSectionTitle.trim()) return;
                  const newSec: ArticleSection = {
                    id: 'sec_custom_' + Date.now(),
                    section_type: newSectionType as any,
                    section_title: newSectionTitle.trim(),
                    content_html: '<p>यहाँ नवीन अनुभाग का पाठ दर्ज करें...</p>',
                    sort_order: newSectionOrder
                  };
                  setSectionsList([...sectionsList, newSec]);
                  setShowAddSectionModal(false);
                  setNewSectionTitle('');
                  notifyChange();
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-2xs"
              >
                + अनुभाग जोड़ें (Add Section)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Paste Full Document Modal */}
      {showWordPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-300 max-w-3xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-600" />
                <span>MS Word पूरा दस्तावेज़ ऑटो-फ़िल करें (.docx / Paste)</span>
              </h3>
              <button onClick={() => setShowWordPasteModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <WordPasteImporter
              lang={lang}
              onApplyParsedArticle={handleApplyWordArticle}
            />
          </div>
        </div>
      )}

      {/* Publish Success Modal */}
      {showPublishSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-slate-900">
                {lang === 'hi' ? 'शोध पत्र सफलतापूर्वक प्रकाशित हो गया!' : 'Paper Published Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 font-sans line-clamp-2">
                {article.title_hindi || article.title_english || 'शोध आलेख'}
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono uppercase">
                STATUS: PUBLISHED (प्रकाशित)
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  onClose();
                  setActiveView('article_detail', article.slug || article.id);
                }}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>वेबसाइट पर लेख देखें (View Article in App)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  const targetSlugOrId = article.slug || article.id;
                  window.open(`/article/${encodeURIComponent(targetSlugOrId)}`, '_blank');
                }}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>नए विंडो में खोलें (Open in New Window)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPublishSuccessModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
              >
                संपादक में बने रहें (Continue Editing)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  onClose();
                }}
                className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition"
              >
                एडमिन पोर्टल पर वापस जाएं (Back to Admin)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 max-w-md w-full p-6 space-y-4 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {lang === 'hi' ? 'क्या आप इस शोध पत्र को हटाना चाहते हैं?' : 'Delete Research Paper?'}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {article.title_hindi || article.title_english || 'शोध पत्र'}
              </p>
              <p className="text-[11px] text-red-600 font-bold mt-1">
                यह कार्रवाई पूर्ववत नहीं की जा सकती (This action cannot be undone).
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  if (!onDelete) return;
                  setIsDeleting(true);
                  try {
                    await onDelete(article.id);
                    localStorage.removeItem('draft_article_' + article.id);
                  } catch (e) {
                    console.error('Delete error', e);
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteConfirmModal(false);
                  }
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>हाँ, हटाएं (Yes, Delete Paper)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
