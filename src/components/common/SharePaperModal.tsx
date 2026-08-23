import React, { useState } from 'react';
import { Article } from '../../types';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  BookOpen, 
  Award, 
  CheckCircle2,
  Send,
  MessageCircle
} from 'lucide-react';

interface SharePaperModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'hi' | 'en';
}

export const getArticleShareUrl = (articleSlugOrId: string): string => {
  const origin = window.location.origin;
  return `${origin}/articles/${encodeURIComponent(articleSlugOrId)}`;
};

export const SharePaperModal: React.FC<SharePaperModalProps> = ({
  article,
  isOpen,
  onClose,
  lang = 'hi'
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  if (!isOpen || !article) return null;

  const shareUrl = getArticleShareUrl(article.slug || article.id);
  const authorsText = article.authors.map(a => a.name).join(', ');
  const mainTitle = article.title_hindi || article.title_english;
  const secondaryTitle = article.title_hindi && article.title_english ? article.title_english : '';
  
  const shareHeading = `📄 Pawari Shodh Patrika - Research Paper`;
  const shareBody = `*${mainTitle}*${secondaryTitle ? `\n_${secondaryTitle}_` : ''}\n\n✍️ *Authors:* ${authorsText}\n📚 *Publication:* Pawari Shodh Patrika (Vol. ${article.volume}, Issue ${article.issue}, ${article.year})\n🏷️ *Category:* ${article.category}\n\n🔗 *Click directly to read full paper:*`;
  const fullShareText = `${shareHeading}\n\n${shareBody}\n${shareUrl}`;

  // Copy Direct Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setCopiedNotice(lang === 'hi' ? 'डायरेक्ट लिंक कॉपी हो गया!' : 'Direct paper link copied!');
    setTimeout(() => {
      setCopiedLink(false);
      setCopiedNotice(null);
    }, 2500);
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // LinkedIn Share
  const handleLinkedInShare = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopiedNotice(lang === 'hi' ? 'शोध विवरण कॉपी किया गया! LinkedIn पर पेस्ट करें।' : 'Paper details copied! Paste in LinkedIn post.');
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  // Facebook Share
  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(mainTitle + " - " + authorsText)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  // Instagram Share
  const handleInstagramShare = () => {
    navigator.clipboard.writeText(fullShareText);
    setCopiedNotice(lang === 'hi' ? 'शोध पत्र लिंक व विवरण कॉपी हो गया! Instagram Story, Bio या DM में शेयर करें।' : 'Paper link & summary copied! Paste in Instagram Story, Bio, or DM.');
    window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopiedNotice(null), 4000);
  };

  // Native Mobile Share Sheet
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mainTitle,
          text: `${mainTitle} - Pawari Shodh Patrika`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-amber-900/20 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <Share2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-amber-100">
                {lang === 'hi' ? 'शोध पत्र शेयर करें (Share Research Paper)' : 'Share Research Paper'}
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Pawari Shodh Patrika Direct Paper Link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-200/70 hover:text-amber-100 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Paper Preview Card */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <span className="bg-red-950 text-amber-300 px-2.5 py-0.5 rounded-full font-bold">
                Vol. {article.volume}, Issue {article.issue} ({article.year})
              </span>
              <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                {article.category}
              </span>
            </div>

            <h4 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug">
              {article.title_hindi}
            </h4>
            {article.title_english && (
              <p className="font-serif italic text-slate-700 text-xs">
                {article.title_english}
              </p>
            )}

            <div className="text-xs text-slate-600 font-medium pt-1 border-t border-amber-900/10">
              <span className="font-semibold text-red-950">Authors:</span> {authorsText}
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 font-serif">
              {lang === 'hi' ? 'शोध पत्र का डायरेक्ट लिंक (Direct Link):' : 'Direct Paper URL Link:'}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition shrink-0 flex items-center space-x-1.5 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-950 hover:bg-red-900 text-amber-100'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedLink ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Toast Notice */}
          {copiedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{copiedNotice}</span>
            </div>
          )}

          {/* Social Platforms Grid */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <p className="text-xs font-serif font-bold text-slate-700 uppercase tracking-wider">
              {lang === 'hi' ? 'सोशल मीडिया पर शेयर करें:' : 'Share via Social Platforms:'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-xs space-y-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition transform">
                  {/* WhatsApp Custom Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <span>WhatsApp</span>
              </button>

              {/* LinkedIn Button */}
              <button
                onClick={handleLinkedInShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs transition shadow-xs space-y-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition transform">
                  {/* LinkedIn Custom Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <span>LinkedIn</span>
              </button>

              {/* Facebook Button */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1877F2] hover:bg-[#0f5fc4] text-white font-bold text-xs transition shadow-xs space-y-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition transform">
                  {/* Facebook Custom Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </div>
                <span>Facebook</span>
              </button>

              {/* Instagram Button */}
              <button
                onClick={handleInstagramShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs transition shadow-xs space-y-1.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition transform">
                  {/* Instagram Custom Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span>Instagram</span>
              </button>

            </div>
          </div>

          {/* Native Mobile Share Sheet button */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'फोन के शेयर मेनू से भेजें (System Share)' : 'Open Mobile Share Menu'}</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-serif">
            Pawari Shodh Patrika • International Peer-Reviewed Academic Research Journal
          </p>
        </div>
      </div>
    </div>
  );
};
