import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem, PawariPaheliItem, PawariLokgeetItem, QuizQuestion, QuizCertificate } from '../../types';
import { 
  BookOpen, 
  HelpCircle, 
  Music, 
  Award, 
  PlusCircle, 
  Search, 
  Eye, 
  EyeOff, 
  Lightbulb, 
  CheckCircle2, 
  X, 
  Upload, 
  Download, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  Camera, 
  User, 
  Send,
  Volume2,
  FileCheck2,
  Check,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

import { 
  SAMPLE_SHABDKOSH, 
  SAMPLE_PAHELI, 
  SAMPLE_LOKGEET, 
  SAMPLE_QUIZ_QUESTIONS 
} from '../../data/pawariCulturalData';

import { parseRouteFromUrl, getUrlForLokgeet, getUrlForShabdkosh, getUrlForPaheli } from '../../lib/router';

interface PawariCulturalSectionProps {
  initialTab?: 'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz';
}

export const PawariCulturalSection: React.FC<PawariCulturalSectionProps> = ({ initialTab = 'shabdkosh' }) => {
  const { shabdkoshList, paheliList, lokgeetList, quizQuestions, submitPublicContribution, uploadFileToStorage } = useCms();
  const [activeTab, setActiveTab] = useState<'shabdkosh' | 'paheli' | 'lokgeet' | 'quiz'>(initialTab);

  React.useEffect(() => {
    const route = parseRouteFromUrl();
    if (route.lokgeetId) {
      setActiveTab('lokgeet');
    } else if (route.shabdkoshId) {
      setActiveTab('shabdkosh');
    } else if (route.paheliId) {
      setActiveTab('paheli');
      setRevealedPaheli(prev => ({ ...prev, [route.paheliId!]: true }));
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Fallback to sample cultural data if Firestore collection is fresh or empty
  const rawShabdkosh = (shabdkoshList && shabdkoshList.length > 0) ? shabdkoshList : SAMPLE_SHABDKOSH;
  const rawPaheli = (paheliList && paheliList.length > 0) ? paheliList : SAMPLE_PAHELI;
  const rawLokgeet = (lokgeetList && lokgeetList.length > 0) ? lokgeetList : SAMPLE_LOKGEET;
  const rawQuizQuestions = (quizQuestions && quizQuestions.length > 0) ? quizQuestions : SAMPLE_QUIZ_QUESTIONS;

  // Filter approved items only for public display
  const approvedShabdkosh = rawShabdkosh.filter(s => s.status !== 'draft' && s.status !== 'rejected');
  const approvedPaheli = rawPaheli.filter(p => p.status !== 'draft' && p.status !== 'rejected');
  const approvedLokgeet = rawLokgeet.filter(l => l.status !== 'draft' && l.status !== 'rejected');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [shabdkoshCategory, setShabdkoshCategory] = useState('all');
  const [paheliCategory, setPaheliCategory] = useState('all');
  const [revealedPaheli, setRevealedPaheli] = useState<Record<string, boolean>>({});
  const [copiedPaheliId, setCopiedPaheliId] = useState<string | null>(null);

  const handleSharePaheli = async (item: PawariPaheliItem) => {
    const isAnswerRevealed = !!revealedPaheli[item.id];
    let shareText = `🧩 *पवारी पहेली (पवारी बुझौवल)* 🧩\n\n"${item.riddle_pawari}"`;
    if (item.hint_hindi) {
      shareText += `\n\n💡 *संकेत:* ${item.hint_hindi}`;
    }
    if (isAnswerRevealed) {
      shareText += `\n\n✅ *उत्तर:* ${item.answer_hindi}`;
      if (item.answer_pawari) shareText += ` (${item.answer_pawari})`;
    } else {
      shareText += `\n\n🤔 *उत्तर बुझिए पवारी शोध पत्रिका पोर्टल पर!*`;
    }
    shareText += `\n\n📖 *पवारी भाषा एवं संस्कृति शोध पत्रिका*: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'पवारी पहेली',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedPaheliId(item.id);
      setTimeout(() => setCopiedPaheliId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsAppSharePaheli = (item: PawariPaheliItem) => {
    const isAnswerRevealed = !!revealedPaheli[item.id];
    let shareText = `🧩 *पवारी पहेली (पवारी बुझौवल)* 🧩\n\n"${item.riddle_pawari}"`;
    if (item.hint_hindi) {
      shareText += `\n\n💡 *संकेत:* ${item.hint_hindi}`;
    }
    if (isAnswerRevealed) {
      shareText += `\n\n✅ *उत्तर:* ${item.answer_hindi}`;
      if (item.answer_pawari) shareText += ` (${item.answer_pawari})`;
    } else {
      shareText += `\n\n🤔 *उत्तर बुझिए पवारी शोध पत्रिका पोर्टल पर!*`;
    }
    shareText += `\n\n📖 *पवारी भाषा एवं संस्कृति शोध पत्रिका*: ${window.location.origin}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  // Public Contribution Modal state
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [contribType, setContribType] = useState<'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' | 'review'>('shabdkosh');
  const [contribFormData, setContribFormData] = useState<any>({
    contributor_name: '',
    word_pawari: '',
    meaning_hindi: '',
    pronunciation_hindi: '',
    example_pawari: '',
    riddle_pawari: '',
    answer_hindi: '',
    hint_hindi: '',
    title_pawari: '',
    title_hindi: '',
    title_english: '',
    lyrics_pawari: '',
    content_hindi: '',
    synopsis_hindi: '',
    reviewedBookDetails: '',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    image_url: ''
  });
  const [contribSuccess, setContribSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Quiz Engine state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [certificateData, setCertificateData] = useState<QuizCertificate | null>(null);

  // Shabdkosh Filtering
  const filteredShabdkosh = approvedShabdkosh.filter(item => {
    const matchesSearch = item.word_pawari.toLowerCase().includes(searchTerm.toLowerCase()) || item.meaning_hindi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = shabdkoshCategory === 'all' || item.category === shabdkoshCategory;
    return matchesSearch && matchesCategory;
  });

  // Paheli Filtering
  const filteredPaheli = approvedPaheli.filter(item => {
    const matchesSearch = item.riddle_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.explanation_hindi && item.explanation_hindi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = paheliCategory === 'all' || item.category === paheliCategory;
    return matchesSearch && matchesCategory;
  });

  // Lokgeet Filtering
  const filteredLokgeet = approvedLokgeet.filter(item => 
    item.title_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lyrics_pawari.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePaheliAnswer = (id: string) => {
    setRevealedPaheli(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContribSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetType: 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' = 'shabdkosh';
    let payload: any = { ...contribFormData };

    if (contribType === 'shabdkosh') {
      targetType = 'shabdkosh';
    } else if (contribType === 'paheli') {
      targetType = 'paheli';
    } else if (contribType === 'lokgeet') {
      targetType = 'lokgeet';
    } else if (contribType === 'blogs') {
      targetType = 'blogs';
      payload = {
        title_hindi: contribFormData.title_hindi || contribFormData.title_pawari,
        title_english: contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari,
        author: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        published_date: new Date().toLocaleDateString('hi-IN'),
        category: contribFormData.category || 'लोकसंस्कृति',
        read_time: '5 मिनट',
        excerpt_hindi: contribFormData.content_hindi ? contribFormData.content_hindi.slice(0, 150) + '...' : '',
        excerpt_english: '',
        content_hindi: contribFormData.content_hindi || '',
        content_english: '',
        tags: ['पवारी', 'पाठक_योगदान', 'संस्कृति'],
        likes_count: 0,
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'
      };
    } else if (contribType === 'review') {
      targetType = 'blogs';
      payload = {
        title_hindi: `पुस्तक समीक्षा: ${contribFormData.title_hindi || contribFormData.title_pawari}`,
        title_english: `Book Review: ${contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari}`,
        author: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        published_date: new Date().toLocaleDateString('hi-IN'),
        category: 'पुस्तक समीक्षा',
        read_time: '7 मिनट',
        excerpt_hindi: `समीक्षित पुस्तक विवरण: ${contribFormData.reviewedBookDetails || ''}`,
        excerpt_english: '',
        content_hindi: contribFormData.content_hindi || '',
        content_english: '',
        tags: ['पुस्तक_समीक्षा', 'साहित्य', 'पवारी_शोध'],
        likes_count: 0,
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
      };
    } else if (contribType === 'books') {
      targetType = 'books';
      payload = {
        title_hindi: contribFormData.title_hindi || contribFormData.title_pawari,
        title_english: contribFormData.title_english || contribFormData.title_hindi || contribFormData.title_pawari,
        authors: contribFormData.contributor_name || 'पाठक',
        contributor_name: contribFormData.contributor_name || 'पाठक',
        publisher: 'माँ ताप्ती शोध संस्थान (प्रस्तावित)',
        publish_year: new Date().getFullYear().toString(),
        isbn: 'PUB-' + Math.floor(100000 + Math.random() * 900000),
        pages: 120,
        category: contribFormData.category || 'भाषाविज्ञान एवं लोकसाहित्य',
        cover_image_url: contribFormData.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        synopsis_hindi: contribFormData.synopsis_hindi || contribFormData.content_hindi || '',
        synopsis_english: '',
        price: 'Open Access / निःशुल्क'
      };
    }

    await submitPublicContribution(targetType, payload);
    setContribSuccess(true);
    setTimeout(() => {
      setContribSuccess(false);
      setIsContribModalOpen(false);
      setContribFormData({
        contributor_name: '',
        word_pawari: '',
        meaning_hindi: '',
        pronunciation_hindi: '',
        example_pawari: '',
        riddle_pawari: '',
        answer_hindi: '',
        hint_hindi: '',
        title_pawari: '',
        title_hindi: '',
        title_english: '',
        lyrics_pawari: '',
        content_hindi: '',
        synopsis_hindi: '',
        reviewedBookDetails: '',
        category: 'भाषाविज्ञान एवं लोकसाहित्य',
        image_url: ''
      });
    }, 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'contrib' | 'quiz') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'public_uploads');
      if (target === 'contrib') {
        setContribFormData((prev: any) => ({ ...prev, image_url: res.url }));
      } else {
        setUserPhoto(res.url);
      }
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  // Dynamic Quiz Questions Generator combining Shabdkosh, Paheli, Books, Blogs & Research Papers
  const { articles, books: cmsBooks } = useCms();
  const [activeQuizQuestions, setActiveQuizQuestions] = React.useState<QuizQuestion[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const generateDynamicQuestionsPool = React.useCallback((): QuizQuestion[] => {
    const pool: QuizQuestion[] = [];

    // A. Master Quiz Questions List
    if (rawQuizQuestions && rawQuizQuestions.length > 0) {
      pool.push(...rawQuizQuestions);
    }

    // B. Generate Dynamic Questions from Approved Shabdkosh
    approvedShabdkosh.forEach((s, idx) => {
      if (s.word_pawari && s.meaning_hindi) {
        const otherMeanings = approvedShabdkosh
          .filter(other => other.id !== s.id && other.meaning_hindi !== s.meaning_hindi)
          .map(other => other.meaning_hindi)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        if (otherMeanings.length >= 3) {
          const options = [s.meaning_hindi, ...otherMeanings].sort(() => 0.5 - Math.random());
          const correct_option_index = options.indexOf(s.meaning_hindi);

          pool.push({
            id: `dyn_shabdkosh_${s.id}_${idx}`,
            question_pawari: `पवारी शब्द "${s.word_pawari}" का सही हिंदी अर्थ क्या है?`,
            question_hindi: `पवारी शब्द "${s.word_pawari}" का अर्थ चुनें`,
            options,
            correct_option_index,
            explanation: `पवारी में "${s.word_pawari}" का अर्थ "${s.meaning_hindi}" होता है।`,
            section_type: 'shabdkosh'
          });
        }
      }
    });

    // C. Generate Dynamic Questions from Approved Paheli
    approvedPaheli.forEach((p, idx) => {
      if (p.riddle_pawari && p.answer_hindi) {
        const otherAnswers = approvedPaheli
          .filter(other => other.id !== p.id && other.answer_hindi !== p.answer_hindi)
          .map(other => other.answer_hindi)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        if (otherAnswers.length >= 3) {
          const options = [p.answer_hindi, ...otherAnswers].sort(() => 0.5 - Math.random());
          const correct_option_index = options.indexOf(p.answer_hindi);

          pool.push({
            id: `dyn_paheli_${p.id}_${idx}`,
            question_pawari: `पवारी बुझौवल (पहेली): "${p.riddle_pawari}" का सही उत्तर क्या है?`,
            question_hindi: `पहेली का सही उत्तर चुनें`,
            options,
            correct_option_index,
            explanation: `पहेली "${p.riddle_pawari}" का सही उत्तर "${p.answer_hindi}" है।`,
            section_type: 'paheli'
          });
        }
      }
    });

    // D. Generate Dynamic Questions from Research Papers & Literature
    if (articles && articles.length > 0) {
      articles.slice(0, 6).forEach((art, idx) => {
        if (art.title_hindi && art.category) {
          const options = [art.category, 'लोकगीत संग्रह', 'पवारी नाटक', 'व्याकरण कोश'].sort(() => 0.5 - Math.random());
          const correct_option_index = options.indexOf(art.category);

          pool.push({
            id: `dyn_art_${art.id}_${idx}`,
            question_pawari: `शोध पत्र "${art.title_hindi.slice(0, 45)}..." किस विषय श्रेणी का है?`,
            question_hindi: `शोध पत्र की विषय श्रेणी चुनें`,
            options,
            correct_option_index,
            explanation: `यह शोध पत्र "${art.category}" श्रेणी का है।`,
            section_type: 'lokgeet' // Just as fallback to satisfy type
          });
        }
      });
    }

    // Shuffle master pool and return 10 unique, random questions every time
    return [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [quizQuestions, approvedShabdkosh, approvedPaheli, articles]);

  React.useEffect(() => {
    setActiveQuizQuestions(generateDynamicQuestionsPool());
  }, [generateDynamicQuestionsPool]);

  const handleFinishQuiz = () => {
    if (!userName.trim()) {
      alert('कृपया प्रमाण-पत्र हेतु अपना शुभ नाम दर्ज करें।');
      return;
    }

    let score = 0;
    activeQuizQuestions.forEach((q, idx) => {
      const correctIdx = typeof q.correct_option === 'number' 
        ? q.correct_option 
        : (typeof (q as any).correct_option_index === 'number' ? (q as any).correct_option_index : 0);
      
      if (userAnswers[idx] === correctIdx) {
        score += 1;
      }
    });

    const totalQ = activeQuizQuestions.length || 10;
    const percentage = Math.round((score / totalQ) * 100);
    const certNo = 'PCH-' + Math.floor(100000 + Math.random() * 900000);

    const cert: QuizCertificate = {
      id: certNo,
      user_name: userName.trim(),
      user_photo_url: userPhoto,
      quiz_score: score,
      total_questions: totalQ,
      percentage,
      issued_date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificate_no: certNo
    };

    setCertificateData(cert);
    setIsQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setActiveQuizQuestions(generateDynamicQuestionsPool());
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setCertificateData(null);
  };

  const handleSelectOption = (optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }));
  };

  const handlePrevQuiz = () => {
    setCurrentQIndex(p => Math.max(0, p - 1));
  };

  const handleNextQuiz = () => {
    setCurrentQIndex(p => Math.min(activeQuizQuestions.length - 1, p + 1));
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadCertificatePdf = async () => {
    if (!certificateData) return;
    setIsGeneratingPdf(true);
    try {
      setTimeout(() => {
        window.print();
        setIsGeneratingPdf(false);
      }, 500);
    } catch (e) {
      console.error(e);
      alert('प्रमाण-पत्र डाउनलोड करने में त्रुटि हुई');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!certificateData) return;
    const shareText = `🚩 मैंने "माँ ताप्ती पवारी शोध संस्थान" पवारी भोयरी संस्कृति क्विज़ में ${certificateData.percentage}% प्राप्तांक के साथ ई-प्रमाण-पत्र अर्जित किया है!\n\nनाम: ${certificateData.user_name}\nप्रमाण-पत्र क्रमांक: ${certificateData.certificate_no}\n\nआप भी अपनी पवारी भाषा एवं संस्कृति का ज्ञान परखें: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareSocial = (platform: 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'copy') => {
    if (!certificateData) return;
    const siteUrl = window.location.origin;
    const title = `मैंने पवारी संस्कृति क्विज़ में ${certificateData.percentage}% अंक प्राप्त किए!`;
    const shareText = `🚩 मैंने "माँ ताप्ती पवारी शोध संस्थान" पवारी भोयरी संस्कृति क्विज़ 2026 में ${certificateData.percentage}% अंक प्राप्त कर ई-प्रमाण-पत्र प्राप्त किया है! (प्रमाण-पत्र क्रमांक: ${certificateData.certificate_no})`;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n\nपोर्टल लिंक: ${siteUrl}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-amber-950 to-red-900 border border-amber-500/30 p-8 text-amber-100 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>पवारी भोयरी लोक संस्कृति एवं साहित्य डिजिटल कोश</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-amber-200 font-serif leading-tight mb-3">
            पवारी भोयरी शब्दकोश, पहेली, लोकगीत एवं क्विज़
          </h1>
          <p className="text-amber-100/80 text-base leading-relaxed mb-6">
            बैतूल, छिंदवाड़ा एवं ताप्ती अंचल की समृद्ध पवारी बोली के शब्दों, पारंपरिक बुझौवलों (पहेलियों), विवाह व भक्ति लोकगीतों का अनुशीलन करें। अपनी संस्कृति ज्ञान की परीक्षा दें एवं आकर्षक ई-प्रमाण-पत्र प्राप्त करें।
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setContribType('shabdkosh');
                setIsContribModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-lg shadow-amber-900/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>पाठक योगदान: नया शब्द / पहेली / लोकगीत जोड़ें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 bg-slate-900/80 p-2 rounded-2xl border border-amber-900/40 shadow-lg">
        <button
          onClick={() => setActiveTab('shabdkosh')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'shabdkosh'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. पवारी शब्दकोश ({approvedShabdkosh.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paheli')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'paheli'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>2. पवारी पहेली ({approvedPaheli.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lokgeet')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'lokgeet'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>3. पवारी लोकगीत ({approvedLokgeet.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-amber-950 shadow-md scale-[1.02]'
              : 'text-amber-200 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. क्विज़ एवं प्रमाण-पत्र</span>
        </button>
      </div>

      {/* SEARCH BAR FOR LISTINGS */}
      {activeTab !== 'quiz' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-amber-900/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
            <input
              type="text"
              placeholder={
                activeTab === 'shabdkosh' ? 'शब्द या अर्थ खोजें...' :
                activeTab === 'paheli' ? 'पहेली या उत्तर खोजें...' : 'लोकगीत शीर्षक या बोल खोजें...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-amber-900/40 rounded-xl text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          {activeTab === 'shabdkosh' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'दैनिक शब्द', 'रिश्ते-नाते', 'खान-पान', 'कृषि एवं लोक जीवन', 'संस्कृति एवं परम्परा'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setShabdkoshCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    shabdkoshCategory === cat 
                      ? 'bg-amber-500 text-amber-950 font-bold' 
                      : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'सभी शब्द' : cat}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'paheli' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'चिहनन की काहयनी (पहलोड़ी)', 'घरेलू सामान', 'खान-पान', 'कृषि/खेती', 'प्रकृति', 'पशु-पक्षी एवं जीव', 'शरीर के अंग', 'संस्कृति एवं परम्परा'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setPaheliCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    paheliCategory === cat 
                      ? 'bg-amber-500 text-amber-950 font-bold' 
                      : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'सभी पहेलियाँ' : cat}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => {
              setContribType(activeTab as any);
              setIsContribModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>अपना {activeTab === 'shabdkosh' ? 'शब्द' : activeTab === 'paheli' ? 'पहेली' : 'लोकगीत'} जमा करें</span>
          </button>
        </div>
      )}

      {/* 1. SHABDKOSH VIEW */}
      {activeTab === 'shabdkosh' && (
        <div className="space-y-6">
          {/* Archive.org Shabdkosh Resource Banner */}
          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-amber-200 text-sm sm:text-base">
                  इंटरनेट आर्काइव (Internet Archive) पर 'पवारी शब्दकोश' (2000+ शब्द संकलन)
                </h4>
                <p className="text-xs text-amber-100/70 mt-0.5">
                  मूल संकलन: वल्लभ डोंगरे (सतपुड़ा संस्कृति संस्थान, भोपाल) एवं माँ ताप्ती शोध संस्थान, मुलताई
                </p>
              </div>
            </div>
            <a
              href="https://archive.org/details/pawari-shabdkosh-pawari-boli"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Archive.org पर देखें / PDF डाउनलोड करें</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShabdkosh.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
            >
              {item.image_url ? (
                <div className="h-48 overflow-hidden relative bg-slate-950">
                  <img 
                    src={item.image_url} 
                    alt={item.word_pawari} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              ) : (
                <div className="h-28 bg-gradient-to-br from-amber-950/60 to-slate-900 flex items-center justify-center relative border-b border-amber-900/20">
                  <BookOpen className="w-10 h-10 text-amber-600/40" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-2xl font-black text-amber-200 font-serif tracking-wide">
                      {item.word_pawari}
                    </h3>
                  </div>

                  {item.pronunciation_hindi && (
                    <p className="text-xs text-amber-400/80 mb-3 italic">
                      उच्चारण: [{item.pronunciation_hindi}]
                    </p>
                  )}

                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-900/30 mb-3 space-y-1">
                    <p className="text-sm font-semibold text-amber-100">
                      <span className="text-amber-500 font-normal text-xs mr-1">हिंदी अर्थ:</span>
                      {item.meaning_hindi}
                    </p>
                    {item.meaning_english && (
                      <p className="text-xs text-slate-400">
                        <span className="text-slate-500 mr-1">English:</span> {item.meaning_english}
                      </p>
                    )}
                  </div>

                  {item.example_pawari && (
                    <div className="text-xs text-amber-200/80 space-y-1 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/20">
                      <p className="italic">
                        <span className="font-semibold text-amber-400 not-italic">वाक्य प्रयोग:</span> "{item.example_pawari}"
                      </p>
                      {item.example_hindi && (
                        <p className="text-amber-400/60 not-italic">
                          ({item.example_hindi})
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                  <span>प्रस्तुति: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                  <span className="text-amber-500/80">पवारी संस्कृति कोश</span>
                </div>
              </div>
            </div>
          ))}

          {filteredShabdkosh.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
              <BookOpen className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
              <p className="text-amber-200/70 font-medium">कोई शब्द नहीं मिला।</p>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 2. PAHELI VIEW */}
      {activeTab === 'paheli' && (
        <div className="space-y-6">
          {/* Archive.org Resource Banner */}
          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-amber-200 text-sm sm:text-base">
                  इंटरनेट आर्काइव (Internet Archive) पर 'पवारी पहेलियाँ' (374+ पहेलियाँ संकलन)
                </h4>
                <p className="text-xs text-amber-100/70 mt-0.5">
                  मूल संकलन: वल्लभ डोंगरे (सतपुड़ा संस्कृति संस्थान, भोपाल) एवं माँ ताप्ती शोध संस्थान, मुलताई
                </p>
              </div>
            </div>
            <a
              href="https://archive.org/details/pawari-paheliyan"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Archive.org पर देखें / PDF डाउनलोड करें</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPaheli.map((item) => {
            const isRevealed = revealedPaheli[item.id];
            return (
              <div 
                key={item.id}
                className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-amber-900/20 pb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                      {item.category}
                    </span>
                    <span className="text-xs text-amber-400/60 italic">पवारी बुझौवल</span>
                  </div>

                  <div className="flex gap-4 items-start">
                    {item.image_url && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-amber-900/40 bg-slate-950">
                        <img 
                          src={item.image_url} 
                          alt="पहेली चित्र" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-amber-100 font-serif leading-relaxed mb-3">
                        "{item.riddle_pawari}"
                      </h3>

                      {item.hint_hindi && (
                        <p className="text-xs text-amber-300/80 flex items-center gap-1.5 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/30">
                          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>संकेत: {item.hint_hindi}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Interactive Answer Reveal & Share Controls */}
                  <div className="mt-5 pt-3 border-t border-amber-900/30 space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => togglePaheliAnswer(item.id)}
                        className="flex-1 flex items-center justify-between px-3.5 py-2.5 bg-slate-950 hover:bg-slate-950/80 rounded-xl border border-amber-900/40 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                      >
                        <span>उत्तर बुझो / उत्तर देखें (Reveal)</span>
                        {isRevealed ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
                      </button>

                      <button
                        onClick={() => handleWhatsAppSharePaheli(item)}
                        title="व्हाट्सएप पर शेयर करें"
                        className="px-3 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleSharePaheli(item)}
                        title="पहेली शेयर / कॉपी करें"
                        className="px-3 py-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {copiedPaheliId === item.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">कॉपी हुआ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-amber-400" />
                            <span>शेयर</span>
                          </>
                        )}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 bg-gradient-to-r from-amber-950/60 to-slate-950 rounded-xl border border-amber-700/40 space-y-1 animate-fadeIn">
                        <p className="text-base font-bold text-amber-200">
                          उत्तर: {item.answer_hindi}
                        </p>
                        {item.answer_pawari && (
                          <p className="text-xs text-amber-300">
                            (पवारी: {item.answer_pawari})
                          </p>
                        )}
                        {item.explanation_hindi && (
                          <p className="text-xs text-slate-300 mt-2 border-t border-amber-800/30 pt-2">
                            {item.explanation_hindi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                  <span>संग्रहकर्ता: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
                  <button
                    onClick={() => handleSharePaheli(item)}
                    className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>शेयर करें</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPaheli.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
              <p className="text-amber-200/70 font-medium">कोई पहेली नहीं मिली।</p>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 3. LOKGEET VIEW */}
      {activeTab === 'lokgeet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLokgeet.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {item.image_url && (
                  <div className="h-44 rounded-xl overflow-hidden mb-4 relative bg-slate-950 border border-amber-900/30">
                    <img 
                      src={item.image_url} 
                      alt={item.title_pawari} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                      {item.category}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-amber-200 font-serif mb-1">
                  {item.title_pawari}
                </h3>
                {item.title_hindi && (
                  <p className="text-xs text-amber-400/80 font-medium mb-3">
                    ({item.title_hindi})
                  </p>
                )}

                {item.singer_or_collector && (
                  <p className="text-xs text-amber-300/80 mb-3 italic flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.singer_or_collector}</span>
                  </p>
                )}

                {/* Lyrics Container */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-900/30 mb-3 max-h-64 overflow-y-auto">
                  <pre className="text-sm font-serif text-amber-100 whitespace-pre-wrap leading-relaxed font-normal">
                    {item.lyrics_pawari}
                  </pre>
                </div>

                {item.lyrics_hindi_meaning && (
                  <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/20 text-xs text-amber-200/80">
                    <span className="font-semibold text-amber-400 block mb-0.5">भावार्थ:</span>
                    {item.lyrics_hindi_meaning}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-amber-900/20 text-[11px] text-amber-400/50 mt-4 flex justify-between items-center">
                <span>योगदान: {item.contributor_name || 'माँ ताप्ती शोध संस्थान'}</span>
              </div>
            </div>
          ))}

          {filteredLokgeet.length === 0 && (
            <div className="col-span-full py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
              <Music className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
              <p className="text-amber-200/70 font-medium">कोई लोकगीत नहीं मिला।</p>
            </div>
          )}
        </div>
      )}

      {/* 4. QUIZ & CERTIFICATE ENGINE */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!isQuizSubmitted ? (
            <div className="bg-slate-900/90 border border-amber-800/40 rounded-3xl p-6 md:p-8 shadow-2xl relative text-amber-100">
              {/* User Details Setup Before or During Quiz */}
              <div className="mb-6 p-4 bg-amber-950/40 border border-amber-800/30 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  प्रमाण-पत्र हेतु प्रतिभागी का नाम एवं फोटो (Participant Info for Certificate)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      आपका पूरा नाम (Full Name) *
                    </label>
                    <input
                      type="text"
                      placeholder="जैसे: रूपेश पवार / अनिता मालवीय"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      प्रमाण-पत्र फोटो (Optional Photo)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="https://... या फाइल अपलोड करें"
                        value={userPhoto}
                        onChange={(e) => setUserPhoto(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <label className="px-3 py-2 bg-amber-950 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'quiz')} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Header & Progress */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-900/30">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    प्रश्न {currentQIndex + 1} / {activeQuizQuestions.length}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-amber-100 font-serif mt-1">
                    {activeQuizQuestions[currentQIndex]?.question_pawari}
                  </h3>
                  {activeQuizQuestions[currentQIndex]?.question_hindi && (
                    <p className="text-xs text-amber-400/70 mt-0.5">
                      ({activeQuizQuestions[currentQIndex]?.question_hindi})
                    </p>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-600/50 flex items-center justify-center font-bold text-amber-300 text-sm flex-shrink-0">
                  {currentQIndex + 1}/{activeQuizQuestions.length}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {activeQuizQuestions[currentQIndex]?.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-100 font-semibold shadow-lg' 
                          : 'bg-slate-950/60 border-amber-900/40 text-amber-200/90 hover:bg-slate-950 hover:border-amber-700/50'
                      }`}
                    >
                      <span className="text-sm flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-amber-500 text-amber-950' : 'bg-slate-900 text-amber-400'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {opt}
                      </span>
                      {isSelected && <Check className="w-5 h-5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-900/30">
                <button
                  onClick={handlePrevQuiz}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-amber-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  पिछला प्रश्न
                </button>

                {currentQIndex < activeQuizQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-lg cursor-pointer"
                  >
                    अगला प्रश्न
                  </button>
                ) : (
                  <button
                    onClick={handleFinishQuiz}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-emerald-950 font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>क्विज़ सबमिट करें एवं प्रमाण-पत्र देखें</span>
                  </button>
                )}
              </div>
            </div>
          ) : certificateData && certificateData.percentage >= 60 ? (
            /* CERTIFICATE DISPLAY & DOWNLOAD CARD FOR PASSING SCORE (>= 60%) */
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-amber-500/40 p-6 rounded-3xl text-center space-y-4 shadow-2xl">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-amber-200 font-serif">
                  बधाई हो! {certificateData?.user_name}
                </h3>
                <p className="text-sm text-amber-100/80">
                  आपने {certificateData?.total_questions} में से {certificateData?.quiz_score} प्रश्नों का सही उत्तर देकर 
                  <strong className="text-amber-400 mx-1 font-bold">{certificateData?.percentage}%</strong> सफलता प्राप्त की है!
                </p>

                <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                  <button
                    onClick={handleDownloadCertificatePdf}
                    disabled={isGeneratingPdf}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs shadow-xl flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'PDF तैयार हो रहा है...' : 'ई-प्रमाण-पत्र PDF डाउनलोड करें'}</span>
                  </button>

                  <button
                    onClick={handlePrintCertificate}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>प्रिंट करें (Print)</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShareSocial('facebook')}
                    className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>Facebook</span>
                  </button>

                  <button
                    onClick={() => handleShareSocial('twitter')}
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>Twitter/X</span>
                  </button>

                  <button
                    onClick={() => handleShareSocial('telegram')}
                    className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={() => handleShareSocial('copy')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}</span>
                  </button>

                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs border border-amber-500/20 flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>पुनः क्विज़ दें</span>
                  </button>
                </div>
              </div>

              {/* HIGH-RES VISUAL CERTIFICATE TEMPLATE WITH CHIEF EDITOR & PATRON SIGNATURES */}
              <div className="print:m-0 print:p-0 print:shadow-none">
                <div 
                  id="pawari-certificate-node"
                  className="bg-gradient-to-br from-amber-950 via-red-950 to-amber-950 border-8 border-amber-600/80 p-8 md:p-12 rounded-3xl text-amber-100 relative shadow-2xl font-serif text-center overflow-hidden"
                >
                  {/* Decorative Border Corners */}
                  <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-400" />
                  <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-400" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-400" />
                  <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-400" />

                  {/* Institution Header */}
                  <div className="mb-6 space-y-1">
                    <p className="text-xs uppercase tracking-widest text-amber-400 font-sans font-bold">
                      🚩 माँ ताप्ती शोध संस्थान, मुलताई (बैतूल) 🚩
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black text-amber-200 tracking-wide drop-shadow-md">
                      पवारी भोयरी संस्कृति ई-प्रमाण-पत्र
                    </h2>
                    <p className="text-xs text-amber-300/80 font-sans">
                      (Pawari Cultural Heritage Quiz Certificate of Merit — Refereed Journal)
                    </p>
                  </div>

                  {/* Photo & Name Section */}
                  <div className="my-6 space-y-4">
                    {certificateData?.user_photo_url ? (
                      <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-900">
                        <img 
                          src={certificateData.user_photo_url} 
                          alt={certificateData.user_name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto bg-amber-900/60 border-2 border-amber-500/50 flex items-center justify-center text-amber-300">
                        <Award className="w-10 h-10" />
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-amber-300/80 font-sans uppercase tracking-wider">यह प्रमाण-पत्र सहर्ष प्रदान किया जाता है:</p>
                      <h3 className="text-2xl md:text-3xl font-black text-amber-300 underline decoration-amber-500/50 underline-offset-8 mt-1">
                        {certificateData?.user_name}
                      </h3>
                    </div>
                  </div>

                  {/* Citation text */}
                  <p className="text-sm md:text-base text-amber-100/90 max-w-xl mx-auto leading-relaxed my-4 font-normal">
                    जिन्होंने पवारी भोयरी लोकसंस्कृति, लोकगीत, पहेली, शब्दकोश एवं शोध ग्रंथों पर आधारित ज्ञान परीक्षण में 
                    <strong className="text-amber-300 font-bold mx-1">{certificateData?.percentage}% प्राप्तांक</strong> के साथ उत्कृष्ट प्रदर्शन कर पवारी भाषा के संरक्षण एवं संवर्धन में सराहनीय योगदान दिया है।
                  </p>

                  {/* Seal and Signatures (Chief Editor & Patron) */}
                  <div className="mt-8 pt-6 border-t border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 font-sans text-xs">
                    {/* Left: Chief Editor Signature */}
                    <div className="text-left space-y-1">
                      <p className="font-serif text-sm font-bold text-amber-200">प्रा. रूपेश पवार</p>
                      <p className="text-amber-400 font-semibold">मुख्य संपादक (Chief Editor)</p>
                      <p className="text-amber-300/70 text-[10px]">संपादकीय मण्डल, पवारी शोध पत्रिका</p>
                      <p className="text-amber-400/50 text-[10px]">क्रमांक: {certificateData?.certificate_no}</p>
                    </div>

                    {/* Center: Gold Emblem Seal */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-600 p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-full bg-amber-950 flex flex-col items-center justify-center text-amber-300 p-1 text-center border border-amber-400/50">
                          <Award className="w-6 h-6 text-amber-400" />
                          <span className="text-[8px] font-bold tracking-tighter uppercase mt-0.5 leading-none text-amber-200">
                            प्रमाणित सील 2026
                          </span>
                          <span className="text-[7px] text-amber-400/80 leading-none mt-0.5">बैतूल (म.प्र.)</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-300/70 mt-1">जारी तिथि: {certificateData?.issued_date}</span>
                    </div>

                    {/* Right: Patron / Director Signature */}
                    <div className="text-right space-y-1">
                      <p className="font-serif text-sm font-bold text-amber-200">डॉ. कैलाश पवार</p>
                      <p className="text-amber-400 font-semibold">संरक्षक / निदेशक (Patron)</p>
                      <p className="text-amber-300/70 text-[10px]">माँ ताप्ती पवारी शोध संस्थान</p>
                      <p className="text-amber-400/50 text-[10px]">ISSN: Refereed Journal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* RETAKE QUIZ CARD FOR SCORES BELOW 60% */
            <div className="bg-slate-900/90 border border-amber-700/50 p-8 rounded-3xl text-center space-y-5 shadow-2xl">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-12 h-12 text-amber-400" />
              </div>

              <h3 className="text-2xl font-black text-amber-100 font-serif">
                प्रयास पूर्ण: {certificateData?.user_name}
              </h3>

              <p className="text-base text-amber-200/90">
                आपने {certificateData?.total_questions} में से <strong className="text-amber-400 font-bold">{certificateData?.quiz_score}</strong> प्रश्नों के सही उत्तर दिए हैं (प्राप्तांक: <strong className="text-amber-400 font-bold">{certificateData?.percentage}%</strong>)।
              </p>

              <div className="p-4 bg-amber-950/70 border border-amber-700/60 rounded-2xl max-w-md mx-auto text-xs text-amber-200 leading-relaxed text-left space-y-1">
                <p className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  प्रमाण-पत्र पात्रता दिशानिर्देश:
                </p>
                <p>• पवारी ई-प्रमाण-पत्र प्राप्त करने हेतु न्यूनतम <strong>60% अंक (10 में से कम से कम 6 सही उत्तर)</strong> आवश्यक हैं।</p>
                <p>• कृपया पवारी शब्दकोश एवं पहेलियों का पुनः अध्ययन कर दोबारा प्रयास करें।</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetQuiz}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-xl inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>पुनः क्विज़ का प्रयास करें (Retake Quiz)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PUBLIC CONTRIBUTION MODAL FORM */}
      {isContribModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setIsContribModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-amber-300 mb-2 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              जन-सामान्य पाठक योगदान (Public Contribution)
            </h3>
            <p className="text-xs text-amber-200/90 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>नोट: आपके द्वारा भेजा गया शब्द, पहेली या लोकगीत एडमिन/CMS संपादक मंडल की स्वीकृति (Approval) मिलने के बाद ही पोर्टल पर सार्वजनिक होगा।</span>
            </p>

            {contribSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-amber-200">योगदान सफलतापूर्वक दर्ज किया गया!</h4>
                <p className="text-xs text-amber-400/80">धन्यवाद! समीक्षा के उपरांत आपकी प्रविष्टि प्रकाशित की जाएगी।</p>
              </div>
            ) : (
              <form onSubmit={handleContribSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    आपका शुभ नाम (Contributor Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: रामेश्वर शर्मा, बैतूल"
                    value={contribFormData.contributor_name || ''}
                    onChange={(e) => setContribFormData((prev: any) => ({ ...prev, contributor_name: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    योगदान का वर्ग (Select Type) *
                  </label>
                  <select
                    value={contribType}
                    onChange={(e) => setContribType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm font-medium"
                  >
                    <option value="shabdkosh" className="bg-slate-900 text-amber-100">📖 पवारी शब्दकोश (Word & Meaning)</option>
                    <option value="paheli" className="bg-slate-900 text-amber-100">🧩 पवारी पहेली (Riddle & Answer)</option>
                    <option value="lokgeet" className="bg-slate-900 text-amber-100">🎵 पवारी लोकगीत (Folk Song)</option>
                    <option value="blogs" className="bg-slate-900 text-amber-100">✍️ ब्लॉग / लेख (Blog Article)</option>
                    <option value="books" className="bg-slate-900 text-amber-100">📚 पुस्तक / शोध ग्रंथ (Book Proposal)</option>
                    <option value="review" className="bg-slate-900 text-amber-100">📑 पुस्तक समीक्षा (Book Review)</option>
                  </select>
                </div>

                {/* Dynamic Fields for Shabdkosh */}
                {contribType === 'shabdkosh' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी शब्द *</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: डोरा, भाकर"
                          value={contribFormData.word_pawari || ''}
                          onChange={(e) => setContribFormData((prev: any) => ({ ...prev, word_pawari: e.target.value }))}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-300 mb-1">हिंदी अर्थ *</label>
                        <input
                          type="text"
                          required
                          placeholder="जैसे: आंख / नेत्र"
                          value={contribFormData.meaning_hindi || ''}
                          onChange={(e) => setContribFormData((prev: any) => ({ ...prev, meaning_hindi: e.target.value }))}
                          className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी वाक्य प्रयोग</label>
                      <textarea
                        rows={2}
                        placeholder="वाक्य प्रयोग लिखें..."
                        value={contribFormData.example_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, example_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Paheli */}
                {contribType === 'paheli' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पवारी पहेली (Riddle) *</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="पहेली की पंक्तियाँ लिखें..."
                        value={contribFormData.riddle_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, riddle_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">उत्तर (हिंदी में) *</label>
                      <input
                        type="text"
                        required
                        placeholder="उत्तर लिखें..."
                        value={contribFormData.answer_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, answer_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Lokgeet */}
                {contribType === 'lokgeet' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">लोकगीत का नाम *</label>
                      <input
                        type="text"
                        required
                        placeholder="शीर्षक दर्ज करें..."
                        value={contribFormData.title_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">लोकगीत बोल (Lyrics) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="गीत की पंक्तियाँ दर्ज करें..."
                        value={contribFormData.lyrics_pawari || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, lyrics_pawari: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm font-serif"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Blogs */}
                {contribType === 'blogs' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">ब्लॉग का शीर्षक (Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी लोकसाहित्य में ताप्ती संस्कृति का प्रभाव"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">ब्लॉग सामग्री (Full Article) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="यहाँ अपना आलेख विस्तार से लिखें..."
                        value={contribFormData.content_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, content_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Books */}
                {contribType === 'books' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पुस्तक का शीर्षक (Book Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी व्याकरण एवं शब्द कोश"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">पुस्तक सारांश / परिचय (Synopsis) *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="पुस्तक का परिचय, विषय-वस्तु एवं उद्देश्य लिखें..."
                        value={contribFormData.synopsis_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, synopsis_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Dynamic Fields for Book Review */}
                {contribType === 'review' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षा का शीर्षक (Review Title) *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: पवारी लोककथाएं पुस्तक की समालोचना"
                        value={contribFormData.title_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, title_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षित पुस्तक एवं लेखक का नाम *</label>
                      <input
                        type="text"
                        required
                        placeholder="जैसे: 'पवारी कहावतें' (लेखक: डॉ. रामेश्वर पवार)"
                        value={contribFormData.reviewedBookDetails || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, reviewedBookDetails: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-300 mb-1">समीक्षा आलेख (Review Article) *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="विस्तृत समीक्षा लिखें..."
                        value={contribFormData.content_hindi || ''}
                        onChange={(e) => setContribFormData((prev: any) => ({ ...prev, content_hindi: e.target.value }))}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    संबंधित फोटो (Optional Image URL or Upload)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={contribFormData.image_url || ''}
                      onChange={(e) => setContribFormData((prev: any) => ({ ...prev, image_url: e.target.value }))}
                      className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs"
                    />
                    <label className="px-3 py-2 bg-amber-950 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'contrib')} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsContribModalOpen(false)}
                    className="px-5 py-2 rounded-xl bg-slate-800 text-amber-200 text-sm font-medium"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-sm shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>सबमिट करें</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
