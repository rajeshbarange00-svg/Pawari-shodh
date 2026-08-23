import React, { useState, useEffect, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariWriterItem, Article } from '../../types';
import { BookItem, BlogItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  BookOpen, 
  FileText, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  User, 
  ChevronRight, 
  Bookmark, 
  Download, 
  Printer, 
  Search,
  PenTool,
  Calendar,
  Layers,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle2,
  Book,
  GraduationCap,
  Library,
  Feather,
  Instagram,
  Facebook
} from 'lucide-react';
import { PublicContributionModal } from './PublicContributionModal';

interface WriterProfileViewProps {
  writerIdOrSlug?: string | null;
}

export const WriterProfileView: React.FC<WriterProfileViewProps> = ({ writerIdOrSlug }) => {
  const { 
    writers, 
    books, 
    articles, 
    blogs, 
    lang, 
    setActiveView, 
    selectedWriterId,
    openPdfViewer 
  } = useCms();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'bio' | 'books' | 'articles' | 'blogs' | 'awards'>('bio');
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);

  // Identify the writer by ID or Slug or selectedWriterId
  const targetIdentifier = writerIdOrSlug || selectedWriterId;

  const currentWriter: PawariWriterItem | undefined = useMemo(() => {
    if (!targetIdentifier) return writers[0];
    const cleanTarget = targetIdentifier.trim().toLowerCase();
    return (
      writers.find(w => w.id?.toLowerCase() === cleanTarget) ||
      writers.find(w => w.slug?.toLowerCase() === cleanTarget) ||
      writers.find(w => w.name_english?.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanTarget)) ||
      writers.find(w => w.name_hindi && w.name_hindi.includes(cleanTarget)) ||
      writers[0]
    );
  }, [writers, targetIdentifier]);

  // Derived works associated with this author
  const authorBooks: BookItem[] = useMemo(() => {
    if (!currentWriter) return [];
    const writerHindi = currentWriter.name_hindi?.toLowerCase() || '';
    const writerEng = currentWriter.name_english?.toLowerCase() || '';
    const pubList = currentWriter.published_books || [];

    return books.filter(b => {
      const bAuthors = (b.authors || '').toLowerCase();
      const bTitle = (b.title_hindi || '').toLowerCase();
      const matchesAuthor = writerHindi && bAuthors.includes(writerHindi);
      const matchesEng = writerEng && bAuthors.includes(writerEng);
      const matchesTitle = pubList.some(pb => pb && bTitle.includes(pb.toLowerCase()));
      return matchesAuthor || matchesEng || matchesTitle;
    });
  }, [books, currentWriter]);

  const authorArticles: Article[] = useMemo(() => {
    if (!currentWriter) return [];
    const writerHindi = currentWriter.name_hindi?.toLowerCase() || '';
    const writerEng = currentWriter.name_english?.toLowerCase() || '';

    return articles.filter(a => {
      const aAuthors = (a.authors || []).map(auth => typeof auth === 'string' ? auth : auth.name).join(' ').toLowerCase();
      return (writerHindi && aAuthors.includes(writerHindi)) || (writerEng && aAuthors.includes(writerEng));
    });
  }, [articles, currentWriter]);

  const authorBlogs: BlogItem[] = useMemo(() => {
    if (!currentWriter) return [];
    const writerHindi = currentWriter.name_hindi?.toLowerCase() || '';
    const writerEng = currentWriter.name_english?.toLowerCase() || '';
    const blogList = currentWriter.published_blogs || [];

    return blogs.filter(b => {
      const bAuthor = (b.author || '').toLowerCase();
      const bTitle = (b.title_hindi || '').toLowerCase();
      return (writerHindi && bAuthor.includes(writerHindi)) || 
             (writerEng && bAuthor.includes(writerEng)) ||
             blogList.some(pBlog => pBlog && bTitle.includes(pBlog.toLowerCase()));
    });
  }, [blogs, currentWriter]);

  // Other contemporary scholars
  const otherWriters = useMemo(() => {
    if (!currentWriter) return writers.slice(0, 4);
    return writers.filter(w => w.id !== currentWriter.id).slice(0, 4);
  }, [writers, currentWriter]);

  // Canonical shareable URL
  const writerCanonicalUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const baseOrigin = window.location.origin;
    const identifier = currentWriter?.slug || currentWriter?.id || 'profile';
    return `${baseOrigin}/writer/${identifier}`;
  }, [currentWriter]);

  // Dynamic document title update
  useEffect(() => {
    if (currentWriter) {
      const titleName = lang === 'hi' ? currentWriter.name_hindi : currentWriter.name_english;
      document.title = `${titleName} | पवारी साहित्यकार प्रोफाइल | पवारी शोध पत्रिका`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentWriter, lang]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(writerCanonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && currentWriter) {
      try {
        await navigator.share({
          title: `${currentWriter.name_hindi} - पवारी साहित्यकार प्रोफाइल`,
          text: `पवारी शोध पत्रिका पर पवारी भाषा एवं लोकसंस्कृति के मूर्धन्य विद्वान ${currentWriter.name_hindi} की जीवन यात्रा, प्रकाशित पुस्तकें व शोध आलेख देखें:`,
          url: writerCanonicalUrl
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Social sharing handlers
  const shareText = currentWriter 
    ? `पवारी शोध पत्रिका: पवारी भाषा एवं साहित्य के विद्वान ${currentWriter.name_hindi} (${currentWriter.designation_hindi || currentWriter.designation || 'साहित्यकार'}) का संपूर्ण जीवन परिचय, कृतियाँ एवं शोध कार्य देखें:`
    : 'पवारी साहित्यकार प्रोफाइल - पवारी शोध पत्रिका';

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${writerCanonicalUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(writerCanonicalUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(writerCanonicalUrl)}&hashtags=PawariLiterature,PawariShodhPatrika,PawariLanguage`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(writerCanonicalUrl)}`;

  const handleInstagramShare = () => {
    handleCopyLink();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  if (!currentWriter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-900 shadow-inner">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-red-950">
          {lang === 'hi' ? 'साहित्यकार प्रोफाइल उपलब्ध नहीं है' : 'Writer Profile Not Found'}
        </h2>
        <p className="text-slate-600 max-w-md mx-auto text-sm">
          {lang === 'hi'
            ? 'क्षमा करें, आपके द्वारा खोजा गया साहित्यकार पृष्ठ उपलब्ध नहीं है या हटा दिया गया है।'
            : 'The requested writer profile does not exist or may have been moved.'}
        </p>
        <button
          onClick={() => setActiveView('pawari_writers')}
          className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-amber-100 font-bold rounded-xl shadow-md transition inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'सभी साहित्यकार सूची देखें' : 'View All Writers'}</span>
        </button>
      </div>
    );
  }

  const bioText = currentWriter.bio_hindi || currentWriter.biography_hindi || currentWriter.bio_english || 'साहित्यकार परिचय शीघ्र उपलब्ध होगा।';
  const designationText = currentWriter.designation_hindi || currentWriter.designation || currentWriter.designation_english || 'पवारी साहित्यकार';
  const locationText = currentWriter.location_hindi || currentWriter.region || currentWriter.location_english || 'मध्य भारत (सतपुड़ा अंचल)';
  const awardsList = currentWriter.awards_hindi || currentWriter.awards_honors || [];
  
  // Specialization normalization
  let specializationArray: string[] = [];
  if (Array.isArray(currentWriter.specialization)) {
    specializationArray = currentWriter.specialization;
  } else if (Array.isArray(currentWriter.specialization_hindi)) {
    specializationArray = currentWriter.specialization_hindi;
  } else if (typeof currentWriter.specialization_hindi === 'string') {
    specializationArray = currentWriter.specialization_hindi.split(/[,،、]/).map(s => s.trim()).filter(Boolean);
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-white to-amber-50/30 pb-20 pt-4">
      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-950 text-amber-200 px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold font-serif">
            {lang === 'hi' ? 'साहित्यकार प्रोफाइल का लिंक कॉपी हो गया!' : 'Profile Link Copied to Clipboard!'}
          </span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-amber-900/10 pb-4">
          <div className="flex items-center space-x-2 text-xs font-serif text-slate-600">
            <button 
              onClick={() => setActiveView('home')} 
              className="hover:text-red-900 transition flex items-center space-x-1 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button 
              onClick={() => setActiveView('pawari_writers')} 
              className="hover:text-red-900 transition cursor-pointer font-medium"
            >
              <span>{lang === 'hi' ? 'पवारी साहित्यकार' : 'Pawari Writers'}</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-red-950 font-bold truncate max-w-[200px] sm:max-w-xs">
              {currentWriter.name_hindi}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveView('pawari_writers')}
              className="px-3.5 py-1.5 rounded-xl border border-amber-900/20 bg-white hover:bg-amber-50 text-red-950 font-serif font-bold text-xs shadow-2xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-900" />
              <span>{lang === 'hi' ? 'सभी साहित्यकार' : 'All Writers'}</span>
            </button>

            <button
              onClick={() => setIsContribModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-amber-100 font-serif font-bold text-xs shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'hi' ? '🖋️ प्रविष्टि जोड़ें / अपडेट करें' : 'Update Profile'}</span>
            </button>
          </div>
        </div>

        {/* Hero Card / Author Header */}
        <div className="relative bg-white rounded-3xl border border-amber-900/15 shadow-xl overflow-hidden p-6 sm:p-8 md:p-10">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-bl from-amber-200/40 via-red-100/20 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            
            {/* Author Portrait Column */}
            <div className="flex flex-col items-center sm:items-start shrink-0 space-y-4 w-full md:w-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-amber-400 via-red-600 to-amber-500 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-amber-50">
                  <SafeImage
                    src={currentWriter.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                    alt={currentWriter.name_hindi}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    width={250}
                    height={250}
                  />
                </div>

                {currentWriter.is_featured && (
                  <div className="absolute -top-2.5 -right-2.5 bg-linear-to-r from-amber-500 to-amber-600 text-red-950 text-[11px] font-bold font-serif px-3 py-1 rounded-full shadow-md border border-white flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-amber-950" />
                    <span>{lang === 'hi' ? 'विशिष्ट रचनाकार' : 'Featured Scholar'}</span>
                  </div>
                )}
              </div>

              {/* Verified Author Badge */}
              <div className="w-full text-center sm:text-left flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'hi' ? 'प्रमाणित पवारी शोध रचनाकार' : 'Verified Pawari Scholar'}</span>
              </div>
            </div>

            {/* Author Details Column */}
            <div className="flex-1 space-y-4 w-full">
              
              {/* Location Badge & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1 text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-amber-200 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{locationText}</span>
                </span>

                {authorBooks.length > 0 && (
                  <span className="inline-flex items-center space-x-1 text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-200">
                    <Library className="w-3.5 h-3.5 text-red-900" />
                    <span>{authorBooks.length} {lang === 'hi' ? 'प्रकाशित पुस्तकें' : 'Books in Library'}</span>
                  </span>
                )}

                {authorArticles.length > 0 && (
                  <span className="inline-flex items-center space-x-1 text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-red-900" />
                    <span>{authorArticles.length} {lang === 'hi' ? 'शोध आलेख' : 'Research Papers'}</span>
                  </span>
                )}
              </div>

              {/* Full Names */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-red-950 tracking-tight leading-tight">
                  {currentWriter.name_hindi}
                </h1>
                {currentWriter.name_english && (
                  <p className="text-base sm:text-lg font-serif text-amber-900 font-semibold mt-0.5">
                    {currentWriter.name_english}
                  </p>
                )}
              </div>

              {/* Designation */}
              <p className="text-sm sm:text-base font-sans font-medium text-slate-700 leading-snug">
                {designationText}
              </p>

              {/* Specialization Tags */}
              {specializationArray.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {specializationArray.map((spec, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-xs font-mono font-semibold px-2.5 py-1 bg-amber-50/80 text-amber-950 border border-amber-200/80 rounded-lg shadow-2xs"
                    >
                      #{spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact & External Social Links Bar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
                {currentWriter.contact_email && (
                  <a
                    href={`mailto:${currentWriter.contact_email}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-900 border border-slate-200 text-xs font-sans font-medium transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-700" />
                    <span>{currentWriter.contact_email}</span>
                  </a>
                )}

                {currentWriter.contact_phone && (
                  <a
                    href={`tel:${currentWriter.contact_phone}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-900 border border-slate-200 text-xs font-sans font-medium transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-700" />
                    <span>{currentWriter.contact_phone}</span>
                  </a>
                )}

                {currentWriter.website_url && (
                  <a
                    href={currentWriter.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-900 border border-slate-200 text-xs font-sans font-medium transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-700" />
                    <span>{lang === 'hi' ? 'वेबसाइट' : 'Website'}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                )}

                {currentWriter.social_links?.facebook && (
                  <a
                    href={currentWriter.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Facebook ↗</span>
                  </a>
                )}

                {currentWriter.social_links?.youtube && (
                  <a
                    href={currentWriter.social_links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>YouTube ↗</span>
                  </a>
                )}

                {currentWriter.social_links?.wikipedia && (
                  <a
                    href={currentWriter.social_links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>Wikipedia ↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Share Suite (Prominent Box inside Hero) */}
          <div className="mt-8 pt-6 border-t border-amber-900/10 bg-amber-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 md:-mx-10 md:-mb-10 p-6 sm:p-8 rounded-b-3xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-red-950 font-serif font-bold text-sm sm:text-base">
                  <Share2 className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'hi' ? 'साहित्यकार प्रोफाइल सोशल मीडिया पर शेयर करें:' : 'Share Writer Profile on Social Media:'}</span>
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  {lang === 'hi' 
                    ? 'पवारी भाषा और साहित्य के गौरवशाली रचनाकार की जानकारी अधिक से अधिक लोगों तक पहुंचाएं।'
                    : 'Help propagate the rich literary works of this scholar with unique link and social platforms.'}
                </p>
              </div>

              {/* Share Buttons Row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Share on Instagram (Copies link)"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </button>

                {/* X (Twitter) */}
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Share on X"
                >
                  <span>𝕏 (Twitter)</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Share on LinkedIn"
                >
                  <span>LinkedIn</span>
                </a>

                {/* Copy Direct URL */}
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold font-sans shadow-2xs hover:shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                  title="Copy Profile Link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  <span>{copied ? (lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
                </button>

                {/* Native Device Share */}
                <button
                  onClick={handleNativeShare}
                  className="px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold font-sans shadow-xs hover:shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  title="Device Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
                </button>

                {/* Print Profile */}
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs transition cursor-pointer hidden sm:flex items-center"
                  title="Print Profile Page"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-amber-900/15 overflow-x-auto no-scrollbar space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('bio')}
            className={`pb-3 px-4 font-serif font-bold text-sm sm:text-base border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bio'
                ? 'border-red-900 text-red-950 font-black'
                : 'border-transparent text-slate-600 hover:text-red-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{lang === 'hi' ? 'जीवन परिचय एवं शोध यात्रा' : 'Biography & Research'}</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`pb-3 px-4 font-serif font-bold text-sm sm:text-base border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'books'
                ? 'border-red-900 text-red-950 font-black'
                : 'border-transparent text-slate-600 hover:text-red-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'hi' ? 'रचित एवं प्रकाशित ग्रंथ' : 'Authored Books'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
              {authorBooks.length || currentWriter.published_books?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-4 font-serif font-bold text-sm sm:text-base border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'articles'
                ? 'border-red-900 text-red-950 font-black'
                : 'border-transparent text-slate-600 hover:text-red-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'hi' ? 'शोध आलेख व पत्र' : 'Research Papers'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
              {authorArticles.length}
            </span>
          </button>

          {awardsList.length > 0 && (
            <button
              onClick={() => setActiveTab('awards')}
              className={`pb-3 px-4 font-serif font-bold text-sm sm:text-base border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'awards'
                  ? 'border-red-900 text-red-950 font-black'
                  : 'border-transparent text-slate-600 hover:text-red-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'सम्मान एवं पुरस्कार' : 'Honors & Awards'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold">
                {awardsList.length}
              </span>
            </button>
          )}
        </div>

        {/* Tab 1: Biography & Research Journey */}
        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Bio Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center space-x-2 border-b border-amber-900/10 pb-3">
                  <Feather className="w-5 h-5 text-red-900" />
                  <h2 className="text-xl font-serif font-bold text-red-950">
                    {lang === 'hi' ? 'विस्तृत जीवन परिचय एवं साहित्य साधना' : 'Comprehensive Literary Biography'}
                  </h2>
                </div>

                <div className="prose prose-amber max-w-none text-slate-800 font-serif text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {bioText}
                </div>

                {currentWriter.bio_english && (
                  <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
                    <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                      English Summary
                    </h3>
                    <p className="text-sm font-sans text-slate-700 leading-relaxed">
                      {currentWriter.bio_english}
                    </p>
                  </div>
                )}
              </div>

              {/* Published Books Catalog Listed in Profile */}
              {currentWriter.published_books && currentWriter.published_books.length > 0 && (
                <div className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-red-900" />
                      <h3 className="text-lg font-serif font-bold text-red-950">
                        {lang === 'hi' ? 'प्रमुख प्रकाशित रचनाएं एवं पुस्तकें' : 'Major Authored Publications'}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentWriter.published_books.map((bookTitle, bIdx) => (
                      <div 
                        key={bIdx}
                        className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 hover:bg-amber-50 hover:border-amber-400 transition flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="w-7 h-7 rounded-full bg-red-950 text-amber-200 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {bIdx + 1}
                          </span>
                          <div>
                            <h4 className="font-serif font-bold text-red-950 text-base">
                              {bookTitle}
                            </h4>
                            <p className="text-xs text-slate-600 font-sans mt-0.5">
                              {lang === 'hi' ? 'पवारी भाषा एवं शोध ग्रंथालय में सूचीबद्ध कृति' : 'Cataloged publication in Pawari Research Library'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab('books');
                          }}
                          className="text-xs font-bold text-amber-900 hover:text-red-900 flex items-center space-x-1 shrink-0 cursor-pointer"
                        >
                          <span>{lang === 'hi' ? 'विवरण' : 'Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side Column: Quick Stats & Honors (1 Col) */}
            <div className="space-y-6">
              
              {/* Scholar Information Card */}
              <div className="bg-white rounded-3xl border border-amber-900/15 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-serif font-bold text-red-950 border-b border-amber-900/10 pb-2">
                  {lang === 'hi' ? 'साहित्यिक विवरण संक्षेप' : 'Scholar Profile Overview'}
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">
                      {lang === 'hi' ? 'मूल नाम (हिंदी):' : 'Full Name (Hindi):'}
                    </span>
                    <span className="font-serif font-bold text-red-950 text-sm">
                      {currentWriter.name_hindi}
                    </span>
                  </div>

                  {currentWriter.name_english && (
                    <div>
                      <span className="text-slate-500 font-medium block">
                        {lang === 'hi' ? 'नाम (अंग्रेजी):' : 'Name (English):'}
                      </span>
                      <span className="font-sans font-bold text-slate-800 text-sm">
                        {currentWriter.name_english}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-500 font-medium block">
                      {lang === 'hi' ? 'क्षेत्र / अंचल:' : 'Region / District:'}
                    </span>
                    <span className="font-sans font-semibold text-slate-800">
                      {locationText}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">
                      {lang === 'hi' ? 'साहित्यिक पद / विशेषज्ञता:' : 'Designation / Specialization:'}
                    </span>
                    <span className="font-sans font-semibold text-slate-800">
                      {designationText}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">
                      {lang === 'hi' ? 'पंजीकृत प्रोफाइल URL:' : 'Unique Profile Slug:'}
                    </span>
                    <code className="font-mono text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 block truncate mt-0.5">
                      /writer/{currentWriter.slug || currentWriter.id}
                    </code>
                  </div>
                </div>
              </div>

              {/* Awards Card */}
              {awardsList.length > 0 && (
                <div className="bg-linear-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl border border-amber-500/30 p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b border-amber-900/10 pb-2">
                    <Award className="w-5 h-5 text-amber-700" />
                    <h3 className="text-base font-serif font-bold text-red-950">
                      {lang === 'hi' ? 'सम्मान एवं शोध पुरस्कार' : 'Honors & Citations'}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {awardsList.map((award, aIdx) => (
                      <div 
                        key={aIdx} 
                        className="p-3 rounded-2xl bg-white border border-amber-300/60 shadow-2xs flex items-start space-x-2.5"
                      >
                        <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-serif font-bold text-red-950 leading-snug">
                          {award}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contemporary Scholars Recommendation */}
              {otherWriters.length > 0 && (
                <div className="bg-white rounded-3xl border border-amber-900/15 p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-serif font-bold text-red-950 border-b border-amber-900/10 pb-2 flex items-center justify-between">
                    <span>{lang === 'hi' ? 'समकालीन साहित्यकार' : 'Other Scholars'}</span>
                    <button
                      onClick={() => setActiveView('pawari_writers')}
                      className="text-xs text-amber-900 hover:text-red-900 font-bold font-sans cursor-pointer"
                    >
                      {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
                    </button>
                  </h3>

                  <div className="space-y-3">
                    {otherWriters.map(ow => (
                      <div
                        key={ow.id}
                        onClick={() => setActiveView('writer_profile', null, null, null, null, ow.slug || ow.id)}
                        className="p-2.5 rounded-2xl hover:bg-amber-50/80 border border-transparent hover:border-amber-200 transition cursor-pointer flex items-center space-x-3 group"
                      >
                        <SafeImage
                          src={ow.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={ow.name_hindi}
                          className="w-11 h-11 rounded-xl object-cover border border-amber-300/60 group-hover:scale-105 transition shrink-0"
                          width={44}
                          height={44}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-serif font-bold text-red-950 group-hover:text-amber-800 transition truncate">
                            {ow.name_hindi}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-sans truncate">
                            {ow.location_hindi || ow.region || 'सतपुड़ा अंचल'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-800 transition shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Authored Books Library */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-red-900" />
                <h2 className="text-xl font-serif font-bold text-red-950">
                  {lang === 'hi' ? `${currentWriter.name_hindi} द्वारा रचित व प्रकाशित ग्रंथ` : `Books Authored by ${currentWriter.name_english || currentWriter.name_hindi}`}
                </h2>
              </div>
            </div>

            {authorBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authorBooks.map(book => (
                  <div
                    key={book.id}
                    className="bg-white rounded-3xl border border-amber-900/15 hover:border-amber-500 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between group space-y-4"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-24 sm:w-28 h-32 sm:h-36 shrink-0 rounded-2xl overflow-hidden shadow-md border border-amber-900/20 bg-amber-100 group-hover:scale-105 transition">
                        <SafeImage
                          src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300'}
                          alt={book.title_hindi}
                          className="w-full h-full object-cover"
                          width={112}
                          height={144}
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {book.category || 'शोध ग्रंथ'}
                        </span>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-red-950 group-hover:text-amber-800 transition line-clamp-2">
                          {book.title_hindi}
                        </h3>
                        <p className="text-xs text-slate-600 font-sans line-clamp-2">
                          {book.synopsis_hindi || book.synopsis_english}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-[11px] font-mono text-slate-500">
                        {book.publication_year && `वर्ष: ${book.publication_year}`}
                        {book.isbn && ` • ISBN: ${book.isbn}`}
                      </div>

                      <button
                        onClick={() => setActiveView('books_blogs', null, null, book.id, null)}
                        className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-amber-200 font-bold font-serif shadow-2xs flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{lang === 'hi' ? 'ग्रंथ विवरण देखें' : 'View Book'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentWriter.published_books && currentWriter.published_books.length > 0 ? (
              <div className="bg-white rounded-3xl border border-amber-900/15 p-6 sm:p-8 space-y-4">
                <p className="text-sm text-slate-600 font-serif">
                  {lang === 'hi' 
                    ? 'लेखक की प्रकाशित पुस्तकों की सूची:' 
                    : 'List of authored and published works:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentWriter.published_books.map((bTitle, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center space-x-3">
                      <Book className="w-5 h-5 text-red-900 shrink-0" />
                      <span className="font-serif font-bold text-red-950 text-sm">{bTitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-amber-900/15 p-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-serif">
                  {lang === 'hi' ? 'इस साहित्यकार की पुस्तकें डिजिटल सूची में जोड़ी जा रही हैं।' : 'Books by this author will be cataloged soon.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Authored Research Papers in Journal */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-red-900" />
                <h2 className="text-xl font-serif font-bold text-red-950">
                  {lang === 'hi' ? `${currentWriter.name_hindi} के शोध पत्र (पवारी शोध पत्रिका)` : `Research Papers by ${currentWriter.name_english || currentWriter.name_hindi}`}
                </h2>
              </div>
            </div>

            {authorArticles.length > 0 ? (
              <div className="space-y-4">
                {authorArticles.map(article => (
                  <div
                    key={article.id}
                    className="bg-white rounded-3xl border border-amber-900/15 hover:border-amber-500 p-6 shadow-2xs hover:shadow-md transition space-y-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-amber-200 font-bold">
                        {article.category || 'शोध आलेख'}
                      </span>
                      {article.doi && (
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          DOI: {article.doi}
                        </span>
                      )}
                      {(article.date_published || article.year) && (
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date_published || `${article.month || ''} ${article.year}`}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-serif font-bold text-red-950 leading-snug">
                      {article.title_hindi || article.title_english}
                    </h3>

                    {article.abstract_hindi && (
                      <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed line-clamp-3 bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
                        {article.abstract_hindi}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-600 font-sans">
                        <span className="font-bold">{lang === 'hi' ? 'लेखक:' : 'Authors:'}</span>{' '}
                        {(article.authors || []).map(a => typeof a === 'string' ? a : a.name).join(', ')}
                      </div>

                      <div className="flex items-center space-x-2">
                        {article.pdf_url && (
                          <button
                            onClick={() => openPdfViewer(article.pdf_url!, article.title_hindi || article.title_english)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold font-serif transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-red-900" />
                            <span>PDF</span>
                          </button>
                        )}

                        <button
                          onClick={() => setActiveView('article_detail', article.slug || article.id)}
                          className="px-4 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-amber-100 text-xs font-bold font-serif transition flex items-center space-x-1 cursor-pointer"
                        >
                          <span>{lang === 'hi' ? 'आलेख पढ़ें' : 'Read Article'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-amber-900/15 p-12 text-center space-y-4">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-slate-700 font-serif font-medium">
                  {lang === 'hi' 
                    ? 'वर्तमान में इस विद्वान के शोध आलेख पत्रिका के आगामी अंकों में प्रकाशन हेतु संकलित किए जा रहे हैं।' 
                    : 'Research papers by this scholar are being processed for upcoming issues.'}
                </p>
                <button
                  onClick={() => setActiveView('articles')}
                  className="px-4 py-2 bg-red-950 text-amber-200 text-xs font-bold rounded-xl shadow-2xs hover:bg-red-900 transition"
                >
                  {lang === 'hi' ? 'समस्त शोध आलेख संग्रह देखें' : 'Explore All Journal Papers'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Honors and Awards */}
        {activeTab === 'awards' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-amber-900/10 pb-3">
              <Award className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-serif font-bold text-red-950">
                {lang === 'hi' ? `${currentWriter.name_hindi} को प्राप्त सम्मान, पुरस्कार एवं उपाधियाँ` : `Honors & Awards Received by ${currentWriter.name_english || currentWriter.name_hindi}`}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {awardsList.map((award, aIdx) => (
                <div
                  key={aIdx}
                  className="bg-white rounded-3xl border border-amber-400/60 p-6 shadow-xs hover:shadow-md transition flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <Award className="w-6 h-6 text-amber-800" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      सम्मान #{aIdx + 1}
                    </span>
                    <h3 className="text-base font-serif font-bold text-red-950">
                      {award}
                    </h3>
                    <p className="text-xs text-slate-600 font-sans">
                      {lang === 'hi' ? 'पवारी भाषा एवं लोकसंस्कृति शोध सेवा हेतु प्रदत्त' : 'Awarded for extraordinary contribution to Pawari language & culture'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Public Contribution / Edit Profile Modal */}
      {isContribModalOpen && (
        <PublicContributionModal
          isOpen={isContribModalOpen}
          onClose={() => setIsContribModalOpen(false)}
          defaultTab="writers"
        />
      )}
    </div>
  );
};
