import React, { useState } from 'react';
import { BlogItem, AttachedItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { useCms } from '../../lib/CmsContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Tag, 
  Link2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  User,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface BlogDetailOnPageProps {
  blog: BlogItem;
  allBlogs: BlogItem[];
  onBack: () => void;
  onSelectBlog: (blog: BlogItem) => void;
  onOpenAttachedItem?: (item: { type: string; url?: string; targetId?: string }) => void;
  onLikeBlog?: (e: React.MouseEvent, id: string, currentLikes?: number) => void;
  likedCount?: number;
  lang: string;
}

export const BlogDetailOnPage: React.FC<BlogDetailOnPageProps> = ({
  blog,
  allBlogs,
  onBack,
  onSelectBlog,
  onOpenAttachedItem,
  onLikeBlog,
  likedCount,
  lang
}) => {
  const { setActiveView } = useCms();
  const [copiedLink, setCopiedLink] = useState(false);
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState<number>(likedCount ?? (blog.likes_count || 0));

  // Current blog index for next/prev navigation
  const currentIndex = allBlogs.findIndex(b => b.id === blog.id);
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex >= 0 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Related blogs (same category or others)
  const relatedBlogs = allBlogs
    .filter(b => b.id !== blog.id && (b.category === blog.category || b.category.includes(blog.category)))
    .slice(0, 3);

  const directPageUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${blog.id}` 
    : `/blog/${blog.id}`;

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directPageUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        prompt(lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें:' : 'Copy direct page link:', directPageUrl);
      });
    } else {
      prompt(lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें:' : 'Copy direct page link:', directPageUrl);
    }
  };

  const handleWhatsAppShare = () => {
    const title = lang === 'hi' ? blog.title_hindi : (blog.title_english || blog.title_hindi);
    const text = `📖 *${title}*\nलेखक: ${blog.author} (${blog.author_role || ''})\n\nपवारी शोध पत्रिका पर यह सम्पूर्ण आलेख पढ़ें:\n${directPageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLocalLike = (e: React.MouseEvent) => {
    if (!localLiked) {
      setLocalLiked(true);
      setLocalLikesCount(prev => prev + 1);
    }
    if (onLikeBlog) {
      onLikeBlog(e, blog.id, localLikesCount);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* ---------------- TOP NAVIGATION BAR ---------------- */}
      <nav aria-label="Breadcrumb" className="bg-white border border-amber-900/15 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-700" />
          <span>{lang === 'hi' ? '← वापस ब्लॉग व साहित्य सूची' : '← Back to Blogs List'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Previous Post */}
          {prevBlog && (
            <button
              type="button"
              onClick={() => onSelectBlog(prevBlog)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 transition cursor-pointer text-xs font-bold flex items-center space-x-1"
              title={lang === 'hi' ? `पिछला लेख: ${prevBlog.title_hindi}` : `Previous: ${prevBlog.title_english}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'पिछला' : 'Prev'}</span>
            </button>
          )}

          {/* Next Post */}
          {nextBlog && (
            <button
              type="button"
              onClick={() => onSelectBlog(nextBlog)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 transition cursor-pointer text-xs font-bold flex items-center space-x-1"
              title={lang === 'hi' ? `अगला लेख: ${nextBlog.title_hindi}` : `Next: ${nextBlog.title_english}`}
            >
              <span className="hidden sm:inline">{lang === 'hi' ? 'अगला' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* WhatsApp Share */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition cursor-pointer text-xs font-bold flex items-center space-x-1.5"
            title={lang === 'hi' ? 'डायरेक्ट पेज लिंक कॉपी करें' : 'Copy Page Link'}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'पेज लिंक' : 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* ---------------- ARTICLE HEADER & HERO ---------------- */}
      <header className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Category & Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
          <span className="bg-gradient-to-r from-red-950 to-red-900 text-amber-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
            {blog.category}
          </span>

          <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{blog.date}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{blog.read_time}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-red-950 leading-tight">
            {lang === 'hi' ? blog.title_hindi : blog.title_english}
          </h1>
          {blog.title_english && blog.title_hindi && (
            <p className="text-sm sm:text-base font-sans text-slate-600 font-medium">
              {lang === 'hi' ? blog.title_english : blog.title_hindi}
            </p>
          )}
        </div>

        {/* Author Details Card */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-amber-500 shrink-0 shadow-xs">
              <SafeImage 
                src={blog.author_avatar || ''} 
                alt={blog.author} 
                loading="eager"
                decoding="async"
                width={48}
                height={48}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{blog.author}</h3>
                {blog.contributor_name && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-mono px-2 py-0.5 rounded-full font-bold">
                    लेखक
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-sans">{blog.author_role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleLocalLike}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
                localLiked 
                  ? 'bg-rose-100 text-rose-700 border-rose-300' 
                  : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${localLiked ? 'fill-rose-600 text-rose-600' : 'text-rose-500'}`} />
              <span>{localLikesCount} {lang === 'hi' ? 'पसंद' : 'Likes'}</span>
            </button>
          </div>
        </div>

        {/* Hero Cover Image Banner */}
        {blog.cover_image && (
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden relative bg-slate-900 border border-amber-500/30 shadow-md">
            <SafeImage 
              src={blog.cover_image} 
              alt={blog.title_english} 
              loading="eager"
              decoding="async"
              width={800}
              height={384}
              className="w-full h-full object-cover" 
            />
          </div>
        )}

      </header>

      {/* ---------------- MAIN ARTICLE BODY (ON-PAGE) ---------------- */}
      <main className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Full Text Content with Markdown Headings & Typography */}
        <div className="text-slate-800 font-sans text-sm sm:text-base leading-relaxed space-y-5">
          {blog.content_hindi ? (
            blog.content_hindi.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-lg sm:text-2xl font-serif font-bold text-red-950 mt-6 mb-2 border-b border-amber-200 pb-1.5">
                    {trimmed.replace(/^###\s*/, '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('##')) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-red-950 mt-8 mb-3 border-b-2 border-amber-300 pb-2">
                    {trimmed.replace(/^##\s*/, '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('>')) {
                return (
                  <blockquote key={idx} className="border-l-4 border-amber-500 bg-amber-50/60 p-4 rounded-r-2xl italic text-slate-800 font-serif text-sm sm:text-base my-4">
                    {trimmed.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-slate-800">
                  {trimmed}
                </p>
              );
            })
          ) : (
            <p className="leading-relaxed text-slate-800">
              {blog.excerpt_hindi || blog.excerpt_english}
            </p>
          )}
        </div>

        {/* PDF Download Attachment Box */}
        {blog.pdf_url && (
          <div className="mt-8 p-5 bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl border border-amber-500/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-center sm:text-left">
                <h4 className="font-serif font-bold text-amber-100 text-sm sm:text-base">
                  {lang === 'hi' ? 'मूल आलेख / शोध पत्र की आधिकारिक PDF फ़ाइल' : 'Official PDF Document Available'}
                </h4>
                <p className="text-xs text-amber-200/80 font-mono">
                  {lang === 'hi' ? 'पूर्ण पाठ एवं संदर्भ सूची हेतु PDF डाउनलोड करें' : 'Download for full references and citations'}
                </p>
              </div>
            </div>

            <a
              href={blog.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-red-950" />
              <span>{lang === 'hi' ? '📄 PDF डाउनलोड करें' : 'Download PDF'}</span>
            </a>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-xs font-bold text-slate-700 mr-1">{lang === 'hi' ? 'कुंजी शब्द / टैग्स:' : 'Tags:'}</span>
            {blog.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-amber-50 text-amber-900 font-mono font-semibold px-3 py-1 rounded-full border border-amber-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Attached Books, Monographs & External Research Links */}
        {blog.attached_items && blog.attached_items.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-2 text-red-950 font-serif font-bold text-base">
              <Link2 className="w-4 h-4 text-amber-600" />
              <h4>{lang === 'hi' ? 'संलग्न पुस्तकें, शोध ग्रंथ एवं संदर्भ लिंक्स' : 'Attached Books & Reference Links'}</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blog.attached_items.map((att, idx) => (
                <div 
                  key={att.id || idx}
                  className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 hover:border-amber-400 transition flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-900 inline-block">
                      {att.type === 'book' ? '📚 पुस्तक' : att.type === 'blog' ? '✍️ आलेख' : '🔗 संदर्भ'}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{att.title}</h5>
                    {att.description && (
                      <p className="text-[11px] text-slate-600 line-clamp-2">{att.description}</p>
                    )}
                  </div>

                  {onOpenAttachedItem && (
                    <button
                      type="button"
                      onClick={() => onOpenAttachedItem(att)}
                      className="self-start px-2.5 py-1 bg-red-950 text-amber-200 font-bold text-[11px] rounded-lg transition flex items-center space-x-1 cursor-pointer hover:bg-red-900"
                    >
                      <span>{lang === 'hi' ? 'देखें ↗' : 'View ↗'}</span>
                      <ExternalLink className="w-3 h-3 text-amber-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ---------------- BOTTOM PREV / NEXT NAVIGATION ---------------- */}
      <footer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevBlog ? (
          <div 
            onClick={() => onSelectBlog(prevBlog)}
            className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 group"
          >
            <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1 group-hover:text-amber-700">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पिछला आलेख' : 'Previous Article'}</span>
            </div>
            <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-1">
              {lang === 'hi' ? prevBlog.title_hindi : prevBlog.title_english}
            </h4>
            <p className="text-xs text-slate-500 truncate">{prevBlog.author}</p>
          </div>
        ) : <div />}

        {nextBlog ? (
          <div 
            onClick={() => onSelectBlog(nextBlog)}
            className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 group text-left sm:text-right"
          >
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-start sm:justify-end space-x-1 group-hover:text-amber-700">
              <span>{lang === 'hi' ? 'अगला आलेख' : 'Next Article'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-1">
              {lang === 'hi' ? nextBlog.title_hindi : nextBlog.title_english}
            </h4>
            <p className="text-xs text-slate-500 truncate">{nextBlog.author}</p>
          </div>
        ) : <div />}
      </footer>

      {/* ---------------- RELATED BLOGS GRID ---------------- */}
      {relatedBlogs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-amber-900/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{lang === 'hi' ? 'इसी श्रेणी के अन्य वैचारिक आलेख' : 'More in this Category'}</span>
            </h3>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-red-900 hover:underline"
            >
              {lang === 'hi' ? 'सभी आलेख देखें →' : 'View All →'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedBlogs.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onSelectBlog(rel)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group p-4 space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-900">
                    <SafeImage 
                      src={rel.cover_image} 
                      alt={rel.title_english} 
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={112}
                      className="w-full h-full object-cover group-hover:scale-105 transition" 
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {rel.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-2">
                    {lang === 'hi' ? rel.title_hindi : rel.title_english}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
                  <span className="truncate">{rel.author}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
};
