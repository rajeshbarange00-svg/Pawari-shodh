import React, { useState, useEffect, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { BlogItem, SAMPLE_BLOGS } from '../../data/booksBlogsData';
import { getUrlForView } from '../../lib/router';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Check, 
  Heart, 
  Printer, 
  Type, 
  Eye, 
  Bookmark, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  PenTool,
  Globe,
  Facebook,
  Twitter,
  Link as LinkIcon
} from 'lucide-react';

interface BlogDetailPageProps {
  slugOrId?: string | null;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slugOrId }) => {
  const { blogs, selectedBlogId, setActiveView, lang, saveBlog } = useCms();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const urlParamSlug = typeof window !== 'undefined' ? (
    window.location.pathname.startsWith('/blog/') ? window.location.pathname.replace(/^\/blog\//, '').split('?')[0] : 
    new URLSearchParams(window.location.search).get('blog') || 
    (window.location.hash.startsWith('#/blog/') ? window.location.hash.replace(/^#\/blog\//, '').split('?')[0] : null)
  ) : null;

  const targetIdentifier = slugOrId || selectedBlogId || urlParamSlug;

  // Retrieve blog from context or sample fallback
  const allBlogs = (blogs && blogs.length > 0) ? blogs : SAMPLE_BLOGS;

  const currentBlog = useMemo(() => {
    if (!targetIdentifier) return null;
    return allBlogs.find(b => 
      b.id === targetIdentifier || 
      b.slug === targetIdentifier ||
      (b.slug && decodeURIComponent(b.slug) === decodeURIComponent(targetIdentifier))
    ) || null;
  }, [allBlogs, targetIdentifier]);

  // Sync likes count & increment view on load
  useEffect(() => {
    if (currentBlog) {
      setLikeCount(currentBlog.likes_count || 0);
      
      // Update view count in state
      const currentViews = currentBlog.views_count || 0;
      const updated = {
        ...currentBlog,
        views_count: currentViews + 1
      };
      saveBlog(updated).catch(() => {});
    }
  }, [currentBlog?.id]);

  const handleLike = () => {
    if (!currentBlog || hasLiked) return;
    setHasLiked(true);
    const newCount = likeCount + 1;
    setLikeCount(newCount);
    saveBlog({
      ...currentBlog,
      likes_count: newCount
    }).catch(() => {});
  };

  const handleCopyLink = () => {
    const fullUrl = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share && currentBlog) {
      navigator.share({
        title: currentBlog.title_hindi || currentBlog.title_english,
        text: currentBlog.excerpt_hindi || 'पवारी शोध पत्रिका ब्लॉग',
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Related blogs
  const relatedBlogs = useMemo(() => {
    if (!currentBlog) return [];
    return allBlogs
      .filter(b => b.id !== currentBlog.id && (b.status || 'published') === 'published')
      .filter(b => b.category === currentBlog.category || (b.tags && currentBlog.tags && b.tags.some(t => currentBlog.tags?.includes(t))))
      .slice(0, 3);
  }, [allBlogs, currentBlog]);

  if (!currentBlog) {
    return (
      <div className="min-h-[70vh] bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
            {lang === 'hi' ? 'आलेख उपलब्ध नहीं है' : 'Article Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mb-6 font-serif">
            {lang === 'hi' 
              ? 'यह आलेख हटा दिया गया है अथवा इसका यूआरएल बदल गया है।' 
              : 'The requested blog post could not be located or has been unpublished.'}
          </p>
          <button
            onClick={() => setActiveView('blog_list')}
            className="px-5 py-2.5 bg-red-950 text-amber-200 rounded-xl text-xs font-serif font-bold hover:bg-red-900 transition"
          >
            ← {lang === 'hi' ? 'सभी ब्लॉग आलेख देखें' : 'Back to Blog'}
          </button>
        </div>
      </div>
    );
  }

  const rawContent = currentBlog.content_hindi || currentBlog.content_english || currentBlog.excerpt_hindi || '';

  // Process text to render paragraphs with preserved original formatting
  const contentParagraphs = rawContent.split(/\n+/).map(p => p.trim()).filter(Boolean);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge': return 'text-xl sm:text-2xl leading-loose';
      default: return 'text-base sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      
      {/* Top Reading Navigation Bar */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-2">
          
          {/* Back Button */}
          <button
            onClick={() => setActiveView('blog_list')}
            className="inline-flex items-center space-x-1.5 text-xs font-serif font-bold text-stone-700 hover:text-red-950 transition p-1.5 -ml-1.5 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'ब्लॉग सूची पर वापस' : 'Back to Blog'}</span>
            <span className="sm:hidden">{lang === 'hi' ? 'वापस' : 'Back'}</span>
          </button>

          {/* Reading Controls (Font Resizer, Like, Share, Print) */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Font Size Selector */}
            <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-md transition text-xs font-serif ${fontSize === 'normal' ? 'bg-white shadow-2xs font-bold text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="सामान्य फॉन्ट (Normal)"
              >
                अ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-md transition text-sm font-serif ${fontSize === 'large' ? 'bg-white shadow-2xs font-bold text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="बड़ा फॉन्ट (Large)"
              >
                अ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-md transition text-base font-serif ${fontSize === 'xlarge' ? 'bg-white shadow-2xs font-bold text-stone-900' : 'text-stone-500 hover:text-stone-800'}`}
                title="अति बड़ा फॉन्ट (Extra Large)"
              >
                अ++
              </button>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                hasLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="पसंद करें (Like)"
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
              <span className="font-sans">{likeCount}</span>
            </button>

            {/* Share Menu */}
            <button
              onClick={handleNativeShare}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 transition flex items-center space-x-1 cursor-pointer"
              title="शेयर करें (Share)"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span className="hidden sm:inline">{copied ? 'कॉपी हो गया' : 'शेयर'}</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-600 hover:text-stone-900 transition"
              title="प्रिंट करें (Print)"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-serif mb-4 flex-wrap">
          <button 
            onClick={() => setActiveView('home')}
            className="hover:text-stone-800 transition"
          >
            {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <button 
            onClick={() => setActiveView('blog_list')}
            className="hover:text-stone-800 transition"
          >
            {lang === 'hi' ? 'ब्लॉग' : 'Blog'}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="text-stone-800 font-medium truncate max-w-xs sm:max-w-md">
            {currentBlog.title_hindi || currentBlog.title_english}
          </span>
        </nav>

        {/* Article Header Card */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm mb-8">
          
          {/* Category & Read Time Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-950 text-amber-300 text-xs font-serif font-bold rounded-lg shadow-2xs">
              {currentBlog.category || 'साहित्य एवं विमर्श'}
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-serif rounded-lg">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{currentBlog.read_time || '5 मिनट पठन'}</span>
            </span>
            {currentBlog.language && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/70 text-[11px] font-sans font-semibold rounded-md uppercase">
                {currentBlog.language}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-snug sm:leading-tight mb-6">
            {currentBlog.title_hindi || currentBlog.title_english}
          </h1>

          {/* Subtitle / Excerpt Lead */}
          {currentBlog.excerpt_hindi && (
            <p className="text-sm sm:text-base text-stone-600 font-serif italic border-l-3 border-amber-600 pl-4 mb-6 leading-relaxed bg-amber-50/50 py-2 rounded-r-lg">
              {currentBlog.excerpt_hindi}
            </p>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-100">
            
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-950 to-stone-900 text-amber-300 font-serif font-bold text-base flex items-center justify-center border border-amber-400/40 shadow-xs shrink-0 overflow-hidden">
                {currentBlog.author_avatar ? (
                  <SafeImage src={currentBlog.author_avatar} alt={currentBlog.author} className="w-full h-full object-cover" />
                ) : (
                  currentBlog.author ? currentBlog.author[0] : 'ल'
                )}
              </div>
              <div>
                <p className="text-sm font-serif font-bold text-stone-900">
                  {currentBlog.author || 'संपादक मंडल'}
                </p>
                <p className="text-xs text-stone-500 font-serif">
                  {currentBlog.author_role || 'रचनाकार / शोधार्थी'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-stone-500 font-serif">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{currentBlog.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-sans">{currentBlog.views_count || 1} {lang === 'hi' ? 'पाठक' : 'views'}</span>
              </div>
            </div>

          </div>

        </header>

        {/* Feature Cover Image (if present) */}
        {currentBlog.cover_image && (
          <div className="rounded-3xl overflow-hidden mb-8 border border-stone-200 shadow-md bg-stone-100 max-h-[460px]">
            <SafeImage
              src={currentBlog.cover_image}
              alt={currentBlog.title_hindi}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Full Blog Article Content Body - Formatting Preserved Exactly */}
        <main className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/90 shadow-sm">
          
          <div className={`prose max-w-none font-serif text-stone-800 space-y-6 ${getFontSizeClass()}`}>
            {contentParagraphs.map((paragraph, index) => {
              // Check if paragraph is a heading formatted as ## or ###
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-8 mb-3 pt-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-red-950 mt-10 mb-4 pb-2 border-b border-stone-200">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="border-l-4 border-amber-600 bg-amber-50/60 p-4 rounded-r-xl italic my-6 text-stone-800 font-serif">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="ml-6 list-disc text-stone-800">
                    {paragraph.replace(/^[\*\-]\s+/, '')}
                  </li>
                );
              }

              // Standard rich paragraph
              return (
                <p key={index} className="text-stone-800 leading-relaxed text-justify tracking-normal whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags & Keywords Section */}
          {currentBlog.tags && currentBlog.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-serif font-bold text-stone-500 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'संबंधित विषय:' : 'Tags:'}</span>
              </span>
              {currentBlog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-serif rounded-lg transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Share & Engagement Footer */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-serif font-bold text-stone-600">
                {lang === 'hi' ? 'आलेख कैसा लगा?' : 'Like this post?'}
              </span>
              <button
                onClick={handleLike}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
                  hasLiked 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
                <span>{hasLiked ? 'पसंद किया गया' : 'पसंद करें (Like)'} ({likeCount})</span>
              </button>
            </div>

            {/* Quick Share Links */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs transition flex items-center space-x-1"
                title="लिंक कॉपी करें"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
                <span className="text-xs">{copied ? 'कॉपी हुआ' : 'लिंक'}</span>
              </button>
              
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentBlog.title_hindi} - ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentBlog.title_hindi)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition"
                title="Twitter पर साझा करें"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </main>

        {/* Author Bio Box */}
        <div className="mt-8 bg-gradient-to-br from-stone-900 via-red-950 to-stone-900 text-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-red-950 font-serif font-bold text-2xl flex items-center justify-center shadow-md shrink-0 border-2 border-amber-300">
              {currentBlog.author ? currentBlog.author[0] : 'ल'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-serif font-bold text-white">
                  {currentBlog.author || 'शोधार्थी / रचनाकार'}
                </h4>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded-md uppercase">
                  {currentBlog.author_role || 'लेखक'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 font-serif mt-1 leading-relaxed">
                यह आलेख पवारी शोध पत्रिका के डिजिटल मंच पर विद्वानों एवं शोधार्थियों के अध्ययन व विचार-विमर्श हेतु प्रकाशित किया गया है।
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                {lang === 'hi' ? '📖 अन्य संबंधित आलेख' : 'Related Articles'}
              </h3>
              <button
                onClick={() => setActiveView('blog_list')}
                className="text-xs font-serif font-bold text-red-950 hover:underline"
              >
                {lang === 'hi' ? 'सभी आलेख देखें →' : 'View All →'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rel) => {
                const relSlug = rel.slug || rel.id;
                return (
                  <div
                    key={rel.id}
                    onClick={() => {
                      setActiveView('blog_detail', null, null, null, relSlug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-serif font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-stone-900 group-hover:text-red-950 transition mt-2 line-clamp-2">
                        {rel.title_hindi || rel.title_english}
                      </h4>
                      <p className="text-xs text-stone-500 font-serif mt-1.5 line-clamp-2">
                        {rel.excerpt_hindi || rel.content_hindi?.slice(0, 100)}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-serif">
                      <span>{rel.author}</span>
                      <span className="text-red-950 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Public Submission Callout */}
        <div className="mt-12 text-center p-8 bg-amber-50/70 border border-amber-200/80 rounded-3xl shadow-xs">
          <PenTool className="w-8 h-8 text-amber-700 mx-auto mb-2" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            {lang === 'hi' ? 'क्या आप भी अपना शोध या वैचारिक आलेख साझा करना चाहते हैं?' : 'Would you like to publish your research essay with us?'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-lg mx-auto font-serif">
            {lang === 'hi' 
              ? 'हम पवारी भाषा, संस्कृति, साहित्य एवं इतिहास पर मौलिक आलेखों का स्वागत करते हैं।'
              : 'We welcome original articles on Pawari heritage, folklore, and literature.'}
          </p>
          <button
            onClick={() => setActiveView('submit_blog')}
            className="mt-4 px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 rounded-xl text-xs font-serif font-bold transition shadow-sm cursor-pointer inline-flex items-center space-x-2"
          >
            <span>✍️ {lang === 'hi' ? 'आलेख सबमिट करें' : 'Submit an Article'}</span>
          </button>
        </div>

      </article>

    </div>
  );
};
