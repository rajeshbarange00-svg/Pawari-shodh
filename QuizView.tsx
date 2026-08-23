import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Award, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  User, 
  RotateCcw, 
  Download, 
  Share2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Medal, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  ExternalLink,
  HelpCircle,
  Music,
  Library,
  FileText,
  Layers,
  Printer,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useCms } from '../../lib/CmsContext';
import { QuizQuestion, QuizCertificate, QuizCategoryType, PawariShabdkoshItem, PawariPaheliItem } from '../../types';
import { SahityaHeader } from './SahityaHeader';
import { SahityaFooter } from './SahityaFooter';
import { SAMPLE_SHABDKOSH, SAMPLE_PAHELI } from '../../data/pawariCulturalData';
import { 
  MASTER_QUESTION_BANK, 
  QUIZ_CATEGORIES, 
  generateBalancedQuizQuestions,
  getQuizPerformanceGrade,
  DEFAULT_QUIZ_CONFIG,
  QuizConfig,
  buildMasterQuizQuestionPool
} from '../../data/quizQuestionBank';
import { CertificateCard } from './CertificateCard';
import { ShareCertificateModal } from './ShareCertificateModal';
import { downloadCertificateImage, downloadCertificatePdf } from '../../utils/certificateExporter';

export interface QuizViewProps {
  onNavigateSection?: (section: 'hub' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'books' | 'reviews' | 'quiz') => void;
  onOpenContributeModal?: () => void;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  shabdkosh: BookOpen,
  paheli: HelpCircle,
  lokgeet: Music,
  books: Library,
  reviews: FileText,
  general: Sparkles
};

export const QuizView: React.FC<QuizViewProps> = ({
  onNavigateSection,
  onOpenContributeModal
}) => {
  const { 
    lang, 
    quizQuestions: cmsQuestions, 
    shabdkoshList,
    paheliList,
    quizLeaderboard, 
    saveQuizCertificate, 
    editorialMembers 
  } = useCms();

  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [userName, setUserName] = useState('');
  const [examMode, setExamMode] = useState<'standard' | 'shabdkosh' | 'paheli' | 'quick' | 'master'>('standard');
  const [examStarted, setExamStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCert, setGeneratedCert] = useState<QuizCertificate | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isDownloading, setIsDownloading] = useState<'image' | 'pdf' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);

  // Find Chief Editor and Patron from Central Editorial Board
  const chiefEditor = useMemo(() => {
    return (editorialMembers || []).find(m => 
      m.role === 'chief_editor' || 
      (m.designation_hindi && m.designation_hindi.includes('मुख्य संपादक'))
    );
  }, [editorialMembers]);

  const patronDirector = useMemo(() => {
    return (editorialMembers || []).find(m => 
      m.role === 'patron' || 
      (m.designation_hindi && (m.designation_hindi.includes('संरक्षक') || m.designation_hindi.includes('निदेशक')))
    );
  }, [editorialMembers]);

  const chiefEditorName = chiefEditor ? (lang === 'hi' ? chiefEditor.name_hindi : chiefEditor.name_english) : 'प्रो. (डॉ.) रमाकांत शर्मा';
  const patronName = patronDirector ? (lang === 'hi' ? patronDirector.name_hindi : patronDirector.name_english) : 'डॉ. कैलाश पवार';

  // Deduplicate and combine shabdkosh list (including real-time additions)
  const effectiveShabdkoshList = useMemo(() => {
    const combined = [...(shabdkoshList || []), ...SAMPLE_SHABDKOSH];
    const seen = new Set<string>();
    return combined.filter(item => {
      if (!item || !item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [shabdkoshList]);

  // Deduplicate and combine paheli list (including real-time additions)
  const effectivePaheliList = useMemo(() => {
    const combined = [...(paheliList || []), ...SAMPLE_PAHELI];
    const seen = new Set<string>();
    return combined.filter(item => {
      if (!item || !item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [paheliList]);

  // Master question pool dynamically merging all shabdkosh, paheli, books, songs, and custom questions
  const allQuestionsPool = useMemo(() => {
    return buildMasterQuizQuestionPool({
      shabdkoshList: effectiveShabdkoshList,
      paheliList: effectivePaheliList,
      cmsQuestions
    });
  }, [effectiveShabdkoshList, effectivePaheliList, cmsQuestions]);

  // Dynamic pool counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allQuestionsPool.forEach(q => {
      const cat = q.section_type || 'general';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allQuestionsPool]);

  // Initialize randomized question session
  const initExamSession = (mode: 'standard' | 'shabdkosh' | 'paheli' | 'quick' | 'master' = examMode) => {
    let config: QuizConfig = DEFAULT_QUIZ_CONFIG;
    if (mode === 'shabdkosh') {
      config = {
        totalQuestions: 10,
        distribution: { shabdkosh: 10, paheli: 0, lokgeet: 0, books: 0, reviews: 0, general: 0 }
      };
    } else if (mode === 'paheli') {
      config = {
        totalQuestions: 10,
        distribution: { shabdkosh: 0, paheli: 10, lokgeet: 0, books: 0, reviews: 0, general: 0 }
      };
    } else if (mode === 'quick') {
      config = {
        totalQuestions: 5,
        distribution: { shabdkosh: 2, paheli: 1, lokgeet: 1, books: 0, reviews: 0, general: 1 }
      };
    } else if (mode === 'master') {
      config = {
        totalQuestions: 20,
        distribution: { shabdkosh: 6, paheli: 4, lokgeet: 4, books: 2, reviews: 2, general: 2 }
      };
    }

    const randomized = generateBalancedQuizQuestions(config, allQuestionsPool);
    setSessionQuestions(randomized);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setGeneratedCert(null);
    setShowAnswerKey(false);
  };

  useEffect(() => {
    if (sessionQuestions.length === 0) {
      initExamSession(examMode);
    }
  }, [allQuestionsPool]);

  const currentQ = sessionQuestions[currentQIndex];
  const totalQuestions = sessionQuestions.length;

  // Calculate score and category performance
  const evaluation = useMemo(() => {
    let correctCount = 0;
    const categoryBreakdown: Record<string, { score: number; total: number }> = {};

    sessionQuestions.forEach((q, idx) => {
      const cat = q.section_type || 'general';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { score: 0, total: 0 };
      }
      categoryBreakdown[cat].total += 1;

      if (selectedAnswers[idx] === q.correct_option_index) {
        correctCount += 1;
        categoryBreakdown[cat].score += 1;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const grade = getQuizPerformanceGrade(percentage);

    return {
      score: correctCount,
      percentage,
      categoryBreakdown,
      grade
    };
  }, [sessionQuestions, selectedAnswers, totalQuestions]);

  const handleStartExam = () => {
    if (!userName.trim()) {
      alert(lang === 'hi' ? 'कृपया परीक्षा प्रारंभ करने से पूर्व अपना पूरा नाम दर्ज करें।' : 'Please enter your full name before starting.');
      return;
    }
    initExamSession(examMode);
    setExamStarted(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!userName.trim()) {
      alert(lang === 'hi' ? 'कृपया प्रमाण-पत्र हेतु अपना पूरा नाम दर्ज करें।' : 'Please enter your full name for certificate.');
      return;
    }

    setIsSubmitted(true);

    // Generate verified certificate record
    const random6 = Math.floor(100000 + Math.random() * 900000);
    const certNo = `PST-${new Date().getFullYear()}-QZ-${random6}`;
    
    const newCert: QuizCertificate = {
      id: `cert_${Date.now()}`,
      certificate_no: certNo,
      user_name: userName.trim(),
      quiz_score: evaluation.score,
      total_questions: totalQuestions,
      percentage: evaluation.percentage,
      issued_date: new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      exam_title: 'पवारी भोयरी संस्कृति ज्ञान ई-परीक्षा',
      grade: evaluation.grade.gradeHindi,
      category_breakdown: evaluation.categoryBreakdown,
      patron_name: patronName,
      chief_editor_name: chiefEditorName
    };

    setGeneratedCert(newCert);

    if (saveQuizCertificate) {
      saveQuizCertificate(newCert);
    }
  };

  const handleResetQuiz = () => {
    initExamSession(examMode);
    setExamStarted(true);
  };

  const handleDirectDownloadImage = async () => {
    if (!generatedCert) return;
    try {
      setIsDownloading('image');
      await downloadCertificateImage({
        elementId: 'pawari-official-certificate-canvas',
        userName: generatedCert.user_name,
        certificateNo: generatedCert.certificate_no,
        scale: 2.5
      });
    } catch (err) {
      alert(lang === 'hi' ? 'छवि डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Failed to download image.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDirectDownloadPdf = async () => {
    if (!generatedCert) return;
    try {
      setIsDownloading('pdf');
      await downloadCertificatePdf({
        elementId: 'pawari-official-certificate-canvas',
        userName: generatedCert.user_name,
        certificateNo: generatedCert.certificate_no,
        scale: 3
      });
    } catch (err) {
      alert(lang === 'hi' ? 'पीडीएफ डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Failed to download PDF.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleCopyQuizLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Shared Literature Header */}
      <SahityaHeader
        titleHindi="पवारी भोयरी संस्कृति ज्ञान परीक्षा व प्रमाण-पत्र"
        titleEnglish="Pawari Cultural Knowledge Examination & Verified Certificate"
        subtitleHindi="पवारी शब्दावली, पारम्परिक पहेलियाँ, लोकगीत, ग्रन्थ साहित्य एवं शोध समीक्षा की ऑनलाइन परीक्षा दें और संस्थान से डिजिटल ई-प्रमाण-पत्र प्राप्त करें।"
        subtitleEnglish="Take the comprehensive cultural assessment across vocabulary, riddles, folk songs, and literature. Earn verified digital certificates of achievement."
        icon={Award}
        badgeHindi="प्रमाणित ई-परीक्षा 2026"
        badgeEnglish="Verified Examination 2026"
        itemCount={allQuestionsPool.length}
        currentSection="quiz"
        onSectionChange={onNavigateSection}
        onContributeClick={onOpenContributeModal}
      />

      {/* Navigation Sub-Tabs & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-red-950 text-amber-300 font-bold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'ई-परीक्षा व प्रमाण-पत्र (Take Exam)' : 'Examination & Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-red-950 text-amber-300 font-bold shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'प्रमाणित लीडरबोर्ड (Leaderboard)' : 'Certified Scholars'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 font-mono font-bold">
              {(quizLeaderboard || []).length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyQuizLink}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (lang === 'hi' ? 'क्विज़ लिंक कॉपी हुआ!' : 'Link Copied!') : (lang === 'hi' ? 'क्विज़ लिंक साझा करें' : 'Share Exam Link')}</span>
          </button>
        </div>
      </div>

      {/* ================= EXAMINATION TAB ================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          
          {/* STEP 1: EXAM ONBOARDING CARD (Before Start) */}
          {!examStarted && !isSubmitted && (
            <div className="space-y-6">
              
              {/* Category Distribution Showcase */}
              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>परीक्षा पाठ्यक्रम एवं सक्रिय प्रश्न बैंक ({allQuestionsPool.length} कुल प्रश्न)</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                      पवारी भोयरी संस्कृति ज्ञान परीक्षा 2026
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      सम्पूर्ण पवारी शब्दकोश (वर्तमान व भविष्य में जोड़े जाने वाले सभी नए शब्द) एवं पारम्परिक पहेलियों का 100% संकलन सम्मिलित है:
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-3.5 py-2 rounded-2xl bg-amber-100/70 border border-amber-300/80 text-center">
                      <div className="text-sm font-bold font-mono text-red-950">{effectiveShabdkoshList.length}</div>
                      <div className="text-[10px] font-sans text-amber-900 font-medium">शब्दकोश पद</div>
                    </div>
                    <div className="px-3.5 py-2 rounded-2xl bg-orange-100/70 border border-orange-300/80 text-center">
                      <div className="text-sm font-bold font-mono text-orange-950">{effectivePaheliList.length}</div>
                      <div className="text-[10px] font-sans text-orange-900 font-medium">पारम्परिक पहेलियाँ</div>
                    </div>
                  </div>
                </div>

                {/* 6 Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {Object.values(QUIZ_CATEGORIES).map((cat) => {
                    const Icon = CATEGORY_ICON_MAP[cat.id] || BookOpen;
                    const liveCount = categoryCounts[cat.id] || cat.default_count;
                    return (
                      <div 
                        key={cat.id}
                        className={`p-4 rounded-2xl bg-gradient-to-br ${cat.bg_gradient} border border-stone-200/80 space-y-2 relative overflow-hidden`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl bg-white shadow-2xs ${cat.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 border border-stone-200 text-stone-700">
                            {liveCount} {lang === 'hi' ? 'उपलब्ध प्रश्न' : 'Q in Pool'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {cat.title_hindi}
                          </h4>
                          <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5 line-clamp-2">
                            {cat.description_hindi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Participant Registration & Exam Mode Selection */}
              <div className="bg-gradient-to-br from-red-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>प्रतिभागी विवरण एवं परीक्षा प्रारूप (Candidate Details & Modes)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    ई-प्रमाण-पत्र हेतु प्रतिभागी पंजीकरण
                  </h3>
                  <p className="text-xs text-stone-300">
                    सफलतापूर्वक परीक्षा उत्तीर्ण करने पर यह नाम आपके आधिकारिक डिजिटल ई-प्रमाण-पत्र पर मुद्रित किया जाएगा।
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-amber-200 uppercase">
                      {lang === 'hi' ? 'प्रतिभागी का पूरा नाम (Full Name for Certificate):' : 'Participant Full Name:'}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={lang === 'hi' ? 'उदा. डॉ. कैलाश पवार / अनिता मालवीय / राजेश पाटीदार' : 'Enter your full name'}
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition backdrop-blur-xs"
                    />
                  </div>

                  {/* Exam Mode Toggle */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-amber-200 uppercase">
                      {lang === 'hi' ? 'परीक्षा प्रारूप का चयन करें:' : 'Select Examination Mode:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setExamMode('standard')}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          examMode === 'standard'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-amber-300">★ मानक परीक्षा (Standard)</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">10 प्रश्न</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          आधिकारिक प्रमाण-पत्र हेतु 6 श्रेणियों से अनुशंसित संतुलित प्रारूप।
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExamMode('shabdkosh')}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          examMode === 'shabdkosh'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-amber-300">📖 शब्दकोश विशेष (Vocab)</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">10 प्रश्न</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          सम्पूर्ण पवारी शब्दावली, मुहावरे व पर्यायवाची पर केंद्रित परीक्षा।
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExamMode('paheli')}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          examMode === 'paheli'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-amber-300">🧩 पहेली विशेष (Paheli)</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">10 प्रश्न</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          पारम्परिक पहेलियों व लोक बुझौवल के 400+ संग्रह से यादृच्छिक प्रश्न।
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExamMode('quick')}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          examMode === 'quick'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-amber-300">⚡ त्वरित अभ्यास (Quick)</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-stone-200 font-bold">5 प्रश्न</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          कम समय में त्वरित सांस्कृतिक ज्ञान स्व-मूल्यांकन।
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExamMode('master')}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          examMode === 'master'
                            ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-serif text-amber-300">🏆 महा-परीक्षा (Master)</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">20 प्रश्न</span>
                        </div>
                        <p className="text-[11px] text-stone-300">
                          गहन शोधार्थी व भाषाविद् हेतु सम्पूर्ण बहु-विषयक मूल्यांकन।
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Start Exam Button */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>प्रत्येक प्रयास में प्रश्न और विकल्प स्वतः यादृच्छिक (Randomized) होते हैं।</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartExam}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Sparkles className="w-4 h-4 text-red-950 group-hover:rotate-12 transition-transform" />
                      <span>{lang === 'hi' ? 'परीक्षा प्रारंभ करें (Start Exam)' : 'Start Examination'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: ACTIVE QUESTION TEST INTERFACE */}
          {examStarted && !isSubmitted && currentQ && (
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Progress & Category Banner */}
              <div className="space-y-3 border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>{QUIZ_CATEGORIES[currentQ.section_type]?.title_hindi || 'पवारी संस्कृति'}</span>
                    </span>

                    <span className="text-xs text-stone-500 font-sans">
                      प्रतिभागी: <strong className="text-stone-900">{userName}</strong>
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-stone-700">
                    {lang === 'hi' ? 'प्रश्न क्रमांक:' : 'Question:'} <span className="text-red-950 font-black text-sm">{currentQIndex + 1}</span> / {totalQuestions}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-red-900 via-amber-600 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>

                {/* Question Jump Palette (1..10) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {sessionQuestions.map((q, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = idx === currentQIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                          isCurrent
                            ? 'bg-red-950 text-amber-300 ring-2 ring-red-900 shadow-xs'
                            : isAnswered
                            ? 'bg-amber-100 border border-amber-300 text-amber-950 font-bold'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Statement Box */}
              <div className="space-y-4 py-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                    ★ पवारी प्रश्न विवरण:
                  </span>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                    {currentQ.question_pawari}
                  </h3>
                  {currentQ.question_hindi && currentQ.question_hindi !== currentQ.question_pawari && (
                    <p className="text-xs sm:text-sm text-stone-600 font-sans italic pt-1">
                      (हिंदी रूपांतर: {currentQ.question_hindi})
                    </p>
                  )}
                </div>

                {/* 4 Interactive Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {currentQ.options.map((optionText, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 sm:p-4.5 rounded-2xl text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between gap-3 border ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-red-950 font-bold shadow-sm ring-2 ring-amber-400/50'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition ${
                            isSelected ? 'bg-red-950 text-amber-200 shadow-xs' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{optionText}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'पिछला प्रश्न' : 'Previous'}</span>
                </button>

                <div className="flex items-center gap-3">
                  {currentQIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{lang === 'hi' ? 'अगला प्रश्न' : 'Next'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-850 text-amber-200 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>{lang === 'hi' ? 'परीक्षा सबमिट करें एवं प्रमाण-पत्र देखें' : 'Submit & View Certificate'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: RESULTS, SCORECARD, AND INTERACTIVE CERTIFICATE */}
          {isSubmitted && generatedCert && (
            <div className="space-y-8">
              
              {/* Scorecard Overview Card */}
              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
                
                {/* Honor Medal Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${evaluation.grade.badgeBg} ${evaluation.grade.badgeColor}`}>
                  <Award className="w-4 h-4 shrink-0" />
                  <span>{evaluation.grade.gradeHindi}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
                    {lang === 'hi' ? `अभिनंदन, ${generatedCert.user_name}!` : `Congratulations, ${generatedCert.user_name}!`}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
                    {lang === 'hi'
                      ? 'आपने पवारी भाषा, शब्दावली, पारम्परिक पहेलियाँ, लोकगीत व शोध समीक्षा परीक्षा सफलतापूर्वक संपन्न कर डिजिटल ई-प्रमाण-पत्र अर्जित किया है।'
                      : 'You have successfully completed the comprehensive Pawari cultural knowledge assessment.'}
                  </p>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
                    <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                      {evaluation.score} / {totalQuestions}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase mt-0.5">
                      {lang === 'hi' ? 'कुल प्राप्तांक' : 'Total Score'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <div className="text-xl sm:text-2xl font-serif font-bold text-amber-900">
                      {evaluation.percentage}%
                    </div>
                    <div className="text-[10px] font-mono text-amber-800 uppercase mt-0.5">
                      {lang === 'hi' ? 'सफलता दर' : 'Percentage'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-xl sm:text-2xl font-serif font-bold text-emerald-800">
                      {evaluation.grade.passed ? (lang === 'hi' ? 'उत्तीर्ण ✓' : 'Passed ✓') : (lang === 'hi' ? 'प्रयास सराहनीय' : 'Completed')}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 uppercase mt-0.5">
                      {lang === 'hi' ? 'मूल्यांकन स्तर' : 'Result Status'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-center">
                    <div className="text-xs sm:text-sm font-mono font-bold text-red-950 truncate" title={generatedCert.certificate_no}>
                      {generatedCert.certificate_no.replace('PST-', '')}
                    </div>
                    <div className="text-[10px] font-mono text-red-800 uppercase mt-0.5">
                      {lang === 'hi' ? 'प्रमाण-पत्र क्र.' : 'Certificate ID'}
                    </div>
                  </div>
                </div>

                {/* Category-Wise Breakdown Pill Grid */}
                <div className="space-y-2 max-w-3xl mx-auto pt-2">
                  <div className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                    {lang === 'hi' ? 'श्रेणी-वार प्राप्तांक विश्लेषण (Category Performance):' : 'Category Performance:'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {Object.entries(evaluation.categoryBreakdown).map(([catKey, stats]: [string, { score: number; total: number }]) => {
                      const meta = QUIZ_CATEGORIES[catKey] || { title_hindi: catKey, color: 'text-stone-700' };
                      return (
                        <div key={catKey} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center space-y-0.5">
                          <div className="text-[11px] font-bold text-stone-800 truncate" title={meta.title_hindi}>
                            {meta.title_hindi}
                          </div>
                          <div className="text-xs font-mono font-bold text-red-950">
                            {stats.score}/{stats.total}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Major Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-stone-100">
                  
                  {/* PNG Image Download Button */}
                  <button
                    type="button"
                    onClick={handleDirectDownloadImage}
                    disabled={isDownloading !== null}
                    className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md group"
                  >
                    {isDownloading === 'image' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />}
                    <span>{isDownloading === 'image' ? (lang === 'hi' ? 'इमेज जनरेट हो रही है...' : 'Generating Image...') : (lang === 'hi' ? 'सर्टिफिकेट इमेज (PNG) डाउनलोड' : 'Download PNG Image')}</span>
                  </button>

                  {/* A4 PDF Download Button */}
                  <button
                    type="button"
                    onClick={handleDirectDownloadPdf}
                    disabled={isDownloading !== null}
                    className="px-5 py-3 rounded-2xl bg-red-950 hover:bg-red-900 text-amber-200 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md group"
                  >
                    {isDownloading === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />}
                    <span>{isDownloading === 'pdf' ? (lang === 'hi' ? 'PDF तैयार हो रहा है...' : 'Preparing PDF...') : (lang === 'hi' ? 'सर्टिफिकेट PDF (A4) डाउनलोड' : 'Download A4 PDF')}</span>
                  </button>

                  {/* Share Certificate Button */}
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4 text-emerald-200" />
                    <span>{lang === 'hi' ? 'प्रमाण-पत्र शेयर करें' : 'Share Certificate'}</span>
                  </button>

                  {/* Direct Print Button */}
                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-4 h-4 text-stone-600" />
                    <span>{lang === 'hi' ? 'डायरेक्ट प्रिंट' : 'Print'}</span>
                  </button>

                  {/* Retake Button */}
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4 text-stone-600" />
                    <span>{lang === 'hi' ? 'पुनः परीक्षा दें (नया सेट)' : 'Retake New Set'}</span>
                  </button>
                </div>
              </div>

              {/* PRESTIGIOUS VISUAL CERTIFICATE PREVIEW */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      आधिकारिक डिजिटल ई-प्रमाण-पत्र पूर्वावलोकन (A4 Certificate Canvas)
                    </h3>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    297mm × 210mm High-Resolution Canvas
                  </span>
                </div>

                {/* Render CertificateCard */}
                <CertificateCard
                  certificate={generatedCert}
                  id="pawari-official-certificate-canvas"
                  patronName={patronName}
                  chiefEditorName={chiefEditorName}
                />
              </div>

              {/* ACCORDION: DETAILED ANSWER KEY & CULTURAL EXPLANATIONS */}
              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(!showAnswerKey)}
                  className="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-800 transition">
                        {lang === 'hi' ? 'उत्तर कुंजी एवं सांस्कृतिक संदर्भ समीक्षा (Answer Key & Explanations)' : 'Answer Key & Explanations'}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {lang === 'hi' ? 'सभी प्रश्नों के सही उत्तर और विस्तृत पवारी लोक व्याख्याएं देखें' : 'Review cultural notes and correct explanations'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-900 transition">
                    {showAnswerKey ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {showAnswerKey && (
                  <div className="space-y-4 pt-4 border-t border-stone-100 animate-in fade-in duration-200">
                    {sessionQuestions.map((q, idx) => {
                      const userChoice = selectedAnswers[idx];
                      const isCorrect = userChoice === q.correct_option_index;
                      const catMeta = QUIZ_CATEGORIES[q.section_type] || { title_hindi: q.section_type };

                      return (
                        <div 
                          key={q.id || idx}
                          className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                            isCorrect 
                              ? 'bg-emerald-50/40 border-emerald-200/80' 
                              : 'bg-red-50/30 border-red-200/80'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                              <span>#{idx + 1}</span>
                              <span>•</span>
                              <span>{catMeta.title_hindi}</span>
                            </span>

                            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-950'
                            }`}>
                              {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <XCircle className="w-3.5 h-3.5 text-red-700" />}
                              <span>{isCorrect ? (lang === 'hi' ? 'सही उत्तर (+1)' : 'Correct (+1)') : (lang === 'hi' ? 'अशुद्ध (0)' : 'Incorrect (0)')}</span>
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-serif font-bold text-stone-900">
                            {q.question_pawari}
                          </h4>

                          {/* Options comparison */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, oIdx) => {
                              const isOptCorrect = oIdx === q.correct_option_index;
                              const isOptUser = oIdx === userChoice;
                              return (
                                <div 
                                  key={oIdx}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                                    isOptCorrect 
                                      ? 'bg-emerald-100/80 border-emerald-300 font-bold text-emerald-950' 
                                      : isOptUser 
                                      ? 'bg-red-100/80 border-red-300 text-red-950' 
                                      : 'bg-white/80 border-stone-200 text-stone-600'
                                  }`}
                                >
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  {isOptCorrect && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                                  {!isOptCorrect && isOptUser && <XCircle className="w-4 h-4 text-red-700 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation and Cultural Notes */}
                          <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 space-y-1">
                            <div className="font-bold text-amber-900 flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" />
                              <span>{lang === 'hi' ? 'सांस्कृतिक व्याख्या एवं संदर्भ:' : 'Cultural Explanation:'}</span>
                            </div>
                            <p>{q.explanation}</p>
                            {q.cultural_notes && (
                              <p className="text-[11px] text-stone-500 font-mono pt-0.5">
                                संदर्भ: {q.cultural_notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= LEADERBOARD TAB ================= */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-700" />
                <span>सम्मानित प्रतिभागी सूची (Certified Scholars Archive)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {lang === 'hi' ? 'पवारी संस्कृति ज्ञान परीक्षा - टॉप स्कोरर लीडरबोर्ड' : 'Top Scorers Leaderboard'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi' ? 'संस्कृति ज्ञान ई-परीक्षा में विशिष्ट योग्यता प्राप्त करने वाले विद्वान एवं शोधार्थी' : 'Participants with verified cultural certification'}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={leaderboardSearch}
                onChange={(e) => setLeaderboardSearch(e.target.value)}
                placeholder={lang === 'hi' ? 'प्रतिभागी का नाम या प्रमाणपत्र खोजें...' : 'Search name or certificate ID...'}
                className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="space-y-2.5">
            {(quizLeaderboard || [])
              .filter(item => 
                !leaderboardSearch || 
                item.user_name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
                (item.certificate_no && item.certificate_no.toLowerCase().includes(leaderboardSearch.toLowerCase()))
              )
              .map((item, idx) => {
                const gradeInfo = getQuizPerformanceGrade(item.percentage);
                return (
                  <div
                    key={item.id || idx}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:bg-amber-50/40 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs ${
                        idx === 0 ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300' :
                        idx === 1 ? 'bg-stone-300 text-stone-900' :
                        idx === 2 ? 'bg-amber-700 text-amber-100' : 'bg-stone-200 text-stone-600'
                      }`}>
                        #{idx + 1}
                      </span>

                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <span>{item.user_name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${gradeInfo.badgeBg} ${gradeInfo.badgeColor}`}>
                            {gradeInfo.statusHindi}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                          प्रमाण-पत्र क्र.: {item.certificate_no} • जारी दिनांक: {item.issued_date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-red-950 shadow-2xs">
                        {item.quiz_score}/{item.total_questions} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Share Certificate Modal */}
      <ShareCertificateModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        certificate={generatedCert}
        canvasElementId="pawari-official-certificate-canvas"
        lang={lang}
      />

      {/* Shared Literature Footer */}
      <SahityaFooter onContributeClick={onOpenContributeModal} />
    </div>
  );
};
