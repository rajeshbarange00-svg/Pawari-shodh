import React, { useState } from 'react';
import { BookItem, AttachedItem } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { useCms } from '../../lib/CmsContext';
import { 
  ArrowLeft, 
  Book, 
  BookOpen, 
  Calendar, 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Link2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Layers,
  Sparkles
} from 'lucide-react';

interface BookDetailOnPageProps {
  book: BookItem;
  allBooks: BookItem[];
  onBack: () => void;
  onSelectBook: (book: BookItem) => void;
  onOpenAttachedItem?: (item: { type: string; url?: string; targetId?: string }) => void;
  lang: string;
}

export const BookDetailOnPage: React.FC<BookDetailOnPageProps> = ({
  book,
  allBooks,
  onBack,
  onSelectBook,
  onOpenAttachedItem,
  lang
}) => {
  const { setActiveView } = useCms();
  const [copiedLink, setCopiedLink] = useState(false);

  const currentIndex = allBooks.findIndex(b => b.id === book.id);
  const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : null;
  const nextBook = currentIndex >= 0 && currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : null;

  const relatedBooks = allBooks
    .filter(b => b.id !== book.id && (b.category === book.category || b.category.includes(book.category)))
    .slice(0, 3);

  const directPageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/book/${book.id}`
    : `/book/${book.id}`;

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
    const title = lang === 'hi' ? book.title_hindi : (book.title_english || book.title_hindi);
    const text = `📚 *${title}*\nलेखक/सम्पादक: ${book.authors}\nप्रकाशक: ${book.publisher} (${book.publication_year})\n\nपवारी शोध पत्रिका पुस्तकालय पर यह पुस्तक देखें:\n${directPageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
          <span>{lang === 'hi' ? '← वापस पुस्तक सूची पर जाएं' : '← Back to Books List'}</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Previous Book */}
          {prevBook && (
            <button
              type="button"
              onClick={() => onSelectBook(prevBook)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 transition cursor-pointer text-xs font-bold flex items-center space-x-1"
              title={lang === 'hi' ? `पिछली पुस्तक: ${prevBook.title_hindi}` : `Previous: ${prevBook.title_english}`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'पिछली पुस्तक' : 'Prev'}</span>
            </button>
          )}

          {/* Next Book */}
          {nextBook && (
            <button
              type="button"
              onClick={() => onSelectBook(nextBook)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 transition cursor-pointer text-xs font-bold flex items-center space-x-1"
              title={lang === 'hi' ? `अगली पुस्तक: ${nextBook.title_hindi}` : `Next: ${nextBook.title_english}`}
            >
              <span className="hidden sm:inline">{lang === 'hi' ? 'अगली पुस्तक' : 'Next'}</span>
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

      {/* ---------------- BOOK HERO PRESENTATION ---------------- */}
      <header className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left: Book Cover Image & Actions */}
          <div className="w-full md:w-56 shrink-0 space-y-4">
            <div className="w-44 sm:w-52 md:w-full aspect-3/4 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-900">
              <SafeImage 
                src={book.cover_image} 
                alt={book.title_english} 
                loading="eager"
                decoding="async"
                width={224}
                height={300}
                className="w-full h-full object-cover" 
              />
            </div>

            {book.sample_pdf_url && (
              <a
                href={book.sample_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-850 text-amber-200 font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? '📄 PDF देखें / डाउनलोड' : 'View / Download PDF'}</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                alert(lang === 'hi' ? 'यह पुस्तक शोध एवं शिक्षण हेतु उपलब्ध है। प्रति प्राप्त करने या अधिक जानकारी के लिए माँ ताप्ती शोध संस्थान से संपर्क करें।' : 'This book is available for research. Contact us for copy requests.');
              }}
              className="w-full px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'प्रति अनुरोध / संपर्क' : 'Request Copy'}</span>
            </button>
          </div>

          {/* Right: Book Details & Synopsis */}
          <div className="space-y-4 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-100 text-amber-950 font-bold text-xs px-3 py-1 rounded-full border border-amber-300 font-mono">
                {book.category}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-mono font-semibold">
                वर्ष: {book.publication_year}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-red-950 leading-tight">
              {lang === 'hi' ? book.title_hindi : book.title_english}
            </h1>
            {book.title_english && book.title_hindi && (
              <p className="text-sm font-sans text-slate-600 font-medium">
                {lang === 'hi' ? book.title_english : book.title_hindi}
              </p>
            )}

            <p className="text-sm sm:text-base font-bold text-red-900">
              {lang === 'hi' ? 'लेखक / संपादक:' : 'Authors / Editors:'} <span className="text-slate-900">{book.authors}</span>
            </p>

            {/* Quick Metadata Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs font-mono text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">प्रकाशक / Publisher</span>
                <span className="font-bold text-slate-900 text-xs">{book.publisher}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">ISBN</span>
                <span className="font-bold text-slate-900 text-xs">{book.isbn || '978-93-XXXXX-XX'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">पृष्ठ संख्या / Pages</span>
                <span className="font-bold text-slate-900 text-xs">{book.pages}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">एक्सेस / मूल्य</span>
                <span className="font-bold text-red-900 text-xs">{book.price || 'Open Access / निःशुल्क'}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2 pt-2">
              <h3 className="font-serif font-bold text-red-950 text-base flex items-center space-x-2 border-b border-amber-200 pb-1.5">
                <Book className="w-4 h-4 text-amber-700" />
                <span>{lang === 'hi' ? 'पुस्तक परिचय एवं शोध सारांश' : 'Synopsis & Book Overview'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {lang === 'hi' ? book.synopsis_hindi : (book.synopsis_english || book.synopsis_hindi)}
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* ---------------- TABLE OF CONTENTS (ON-PAGE) ---------------- */}
      {book.table_of_contents_hindi && book.table_of_contents_hindi.length > 0 && (
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-red-950 text-lg sm:text-xl flex items-center space-x-2 border-b border-amber-200 pb-2">
            <Layers className="w-5 h-5 text-amber-700" />
            <span>{lang === 'hi' ? 'विषय अनुक्रमणिका (Table of Contents)' : 'Table of Contents'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {book.table_of_contents_hindi.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start space-x-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- ATTACHED ITEMS & MONOGRAPHS ---------------- */}
      {book.attached_items && book.attached_items.length > 0 && (
        <section className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <h3 className="font-serif font-bold text-red-950 text-lg sm:text-xl flex items-center space-x-2">
              <Link2 className="w-5 h-5 text-amber-700" />
              <span>{lang === 'hi' ? 'संलग्न शोध पत्र, समीक्षाएं एवं संदर्भ' : 'Attached Research & Reviews'}</span>
            </h3>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
              {book.attached_items.length} Attached
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {book.attached_items.map((att, idx) => (
              <div 
                key={att.id || idx}
                className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 hover:border-amber-400 transition flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-900 inline-block">
                    {att.type === 'book' ? '📚 पुस्तक' : att.type === 'blog' ? '✍️ समीक्षा / आलेख' : '🔗 संदर्भ'}
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
        </section>
      )}

      {/* ---------------- BOTTOM PREV / NEXT NAVIGATION ---------------- */}
      <footer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevBook ? (
          <div 
            onClick={() => onSelectBook(prevBook)}
            className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 group"
          >
            <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1 group-hover:text-amber-700">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पिछली पुस्तक' : 'Previous Book'}</span>
            </div>
            <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-1">
              {lang === 'hi' ? prevBook.title_hindi : prevBook.title_english}
            </h4>
            <p className="text-xs text-slate-500 truncate">{prevBook.authors}</p>
          </div>
        ) : <div />}

        {nextBook ? (
          <div 
            onClick={() => onSelectBook(nextBook)}
            className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition cursor-pointer space-y-1 group text-left sm:text-right"
          >
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-start sm:justify-end space-x-1 group-hover:text-amber-700">
              <span>{lang === 'hi' ? 'अगली पुस्तक' : 'Next Book'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-1">
              {lang === 'hi' ? nextBook.title_hindi : nextBook.title_english}
            </h4>
            <p className="text-xs text-slate-500 truncate">{nextBook.authors}</p>
          </div>
        ) : <div />}
      </footer>

      {/* ---------------- RELATED BOOKS GRID ---------------- */}
      {relatedBooks.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-amber-900/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{lang === 'hi' ? 'इसी श्रेणी के अन्य शोध ग्रंथ' : 'More in this Category'}</span>
            </h3>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-red-900 hover:underline"
            >
              {lang === 'hi' ? 'सभी पुस्तकें देखें →' : 'View All →'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedBooks.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onSelectBook(rel)}
                className="bg-white border border-amber-900/15 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group p-4 space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-24 aspect-3/4 mx-auto rounded-xl overflow-hidden bg-slate-900 shadow-md">
                    <SafeImage 
                      src={rel.cover_image} 
                      alt={rel.title_english} 
                      loading="lazy"
                      decoding="async"
                      width={96}
                      height={128}
                      className="w-full h-full object-cover group-hover:scale-105 transition" 
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded block text-center">
                    {rel.category}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-red-950 line-clamp-2 text-center">
                    {lang === 'hi' ? rel.title_hindi : rel.title_english}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-100 pt-2">
                  <span className="truncate">{rel.authors}</span>
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
