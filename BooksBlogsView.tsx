import React, { useState, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { fileBlobManager } from '../../lib/fileBlobManager';
import { SafeImage } from '../common/SafeImage';
import { SAMPLE_BOOKS, SAMPLE_BLOGS, BookItem, BlogItem } from '../../data/booksBlogsData';
import { downloadPdf } from '../../lib/pdfUtils';
import { PawariCulturalSection } from './PawariCulturalSection';
import { 
  BookOpen, 
  Search, 
  Book, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Share2, 
  Download, 
  Eye, 
  Heart, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowRight,
  Bookmark,
  HelpCircle,
  Music,
  Award,
  Upload,
  Plus,
  Send,
  Check,
  FileUp,
  Image as ImageIcon,
  AlertCircle,
  PenTool,
  Copy,
  RotateCcw,
  ChevronLeft
} from 'lucide-react';

import { parseRouteFromUrl, getUrlForBook, getUrlForBlog } from '../../lib/router';

interface BooksBlogsViewProps {
  initialTab?: 'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers';
}

export const BooksBlogsView: React.FC<BooksBlogsViewProps> = ({ initialTab = 'all' }) => {
  const { lang, articles, books: cmsBooks, blogs: cmsBlogs, saveBook, saveBlog, submitPublicContribution, uploadFileToStorage, logActivity, setActiveView } = useCms();

  const rawBooks = (cmsBooks && cmsBooks.length > 0) ? cmsBooks : SAMPLE_BOOKS;
  const rawBlogs = (cmsBlogs && cmsBlogs.length > 0) ? cmsBlogs : SAMPLE_BLOGS;

  const booksList = rawBooks.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));
  const blogsList = rawBlogs.filter(b => b.status === 'approved' || (!b.status && !b.id.startsWith('pub_') && !b.id.startsWith('contrib_')));

  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers'>(() => {
    const route = parseRouteFromUrl();
    if (route.blogId) return 'blogs';
    if (route.bookId) return 'books';
    if (route.tab && ['all', 'books', 'blogs', 'reviews', 'folklore', 'research_papers'].includes(route.tab)) {
      return route.tab as any;
    }
    return initialTab as any;
  });

  // Reader state initialized directly from URL synchronously
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(() => {
    const route = parseRouteFromUrl();
    if (route.bookId) {
      const bId = route.bookId.toLowerCase();
      return booksList.find(item => item.id.toLowerCase() === bId || item.isbn?.toLowerCase() === bId) || null;
    }
    return null;
  });
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(() => {
    const route = parseRouteFromUrl();
    if (route.blogId) {
      const blId = route.blogId.toLowerCase();
      return blogsList.find(item => item.id.toLowerCase() === blId) || null;
    }
    return null;
  });

  React.useEffect(() => {
    const route = parseRouteFromUrl();
    const searchParams = new URLSearchParams(window.location.search);
    const urlTab = searchParams.get('tab') as any;

    if (route.bookId) {
      const bId = route.bookId.toLowerCase();
      const b = booksList.find(item => item.id.toLowerCase() === bId || item.isbn?.toLowerCase() === bId);
      if (b) {
        setSelectedBook(b);
        setSelectedBlog(null);
        setActiveTab('books');
      }
    } else if (route.blogId) {
      const blId = route.blogId.toLowerCase();
      const bl = blogsList.find(item => item.id.toLowerCase() === blId);
      if (bl) {
        setSelectedBlog(bl);
        setSelectedBook(null);
        setActiveTab('blogs');
      }
    } else if (urlTab && ['all', 'books', 'blogs', 'reviews', 'folklore', 'research_papers'].includes(urlTab)) {
      setActiveTab(urlTab);
    } else if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab, cmsBooks, cmsBlogs]);

  const handleSelectBook = (book: BookItem) => {
    setSelectedBook(book);
    setSelectedBlog(null);
    window.history.pushState({ bookId: book.id }, '', getUrlForBook(book.id));
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
    const newUrl = activeTab === 'all' ? '/books-literature' : `/books-literature?tab=${activeTab}`;
    if (window.location.pathname.startsWith('/book/') || window.location.search.includes('book=')) {
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleSelectBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setSelectedBook(null);
    window.history.pushState({ blogId: blog.id }, '', getUrlForBlog(blog.id));
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
    const newUrl = activeTab === 'all' ? '/books-literature' : `/books-literature?tab=${activeTab}`;
    if (window.location.pathname.startsWith('/blog/') || window.location.search.includes('blog=')) {
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleTabChange = (tabKey: 'all' | 'books' | 'blogs' | 'reviews' | 'folklore' | 'research_papers') => {
    setActiveTab(tabKey);
    setSelectedBook(null);
    setSelectedBlog(null);
    const newUrl = tabKey === 'all' ? '/books-literature' : `/books-literature?tab=${tabKey}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState({ tab: tabKey }, '', newUrl);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [likedBlogs, setLikedBlogs] = useState<Record<string, number>>({});
  const [readerFontSize, setReaderFontSize] = useState<number>(18);
  const [copiedArticleLink, setCopiedArticleLink] = useState<boolean>(false);

  // Publication Submission Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTab, setPublishTab] = useState<'book' | 'review' | 'blog'>('book');

  const [subForm, setSubForm] = useState({
    authorName: '',
    authorRole: '',
    email: '',
    phone: '',
    titleHindi: '',
    titleEnglish: '',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    reviewedBookDetails: '',
    publisher: 'पावारी शोध संस्थान प्रकाशन',
    isbn: '',
    pages: '150',
    content: '',
    tags: 'पवारी, लोकसाहित्य, शोध',
    coverImageUrl: '',
    pdfUrl: ''
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const [submitRefNo, setSubmitRefNo] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPublishModal = (tab: 'book' | 'review' | 'blog' = 'book') => {
    setPublishTab(tab);
    setSubmitRefNo(null);
    setIsPublishModalOpen(true);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.authorName.trim() || !subForm.titleHindi.trim() || !subForm.content.trim()) {
      alert(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें (लेखक का नाम, शीर्षक एवं विवरण)' : 'Please fill all required fields (Author name, title & details)');
      return;
    }

    setIsSubmittingPublish(true);

    try {
      let coverUrl = subForm.coverImageUrl.trim();
      let pdfUrl = subForm.pdfUrl.trim();

      if (coverFile) {
        try {
          const res = await uploadFileToStorage(coverFile, 'covers');
          coverUrl = res.url;
        } catch (e) {
          coverUrl = await readFileAsDataUrl(coverFile);
        }
      }

      if (pdfFile) {
        try {
          const res = await uploadFileToStorage(pdfFile, 'documents');
          pdfUrl = res.url;
        } catch (e) {
          pdfUrl = await readFileAsDataUrl(pdfFile);
        }
      }

      const generatedId = 'pub_' + Date.now();
      const generatedRefNo = 'PSP-PUB-' + Math.floor(100000 + Math.random() * 900000);

      if (publishTab === 'book') {
        const newBook: BookItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: subForm.titleHindi,
          title_english: subForm.titleEnglish || subForm.titleHindi,
          authors: subForm.authorName,
          publisher: subForm.publisher || 'पावारी शोध संस्थान प्रकाशन',
          publication_year: new Date().getFullYear().toString(),
          isbn: subForm.isbn || ('ISBN-987-81-' + Math.floor(1000000 + Math.random() * 9000000)),
          pages: parseInt(subForm.pages) || 150,
          category: subForm.category,
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
          synopsis_hindi: subForm.content,
          synopsis_english: subForm.content,
          table_of_contents_hindi: ['विषय प्रवेश एवं प्रस्तावना', 'पवारी भाषा का समाजशास्त्रीय अध्ययन', 'निष्कर्ष एवं सन्दर्भ ग्रन्थ सूची'],
          sample_pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('books', newBook);
      } else if (publishTab === 'review') {
        const newReview: BlogItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: `पुस्तक समीक्षा: ${subForm.titleHindi}`,
          title_english: `Book Review: ${subForm.titleEnglish || subForm.titleHindi}`,
          author: subForm.authorName,
          author_role: subForm.authorRole || 'समीक्षक एवं शोधार्थी',
          date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          read_time: '7 मिनट',
          category: 'पुस्तक समीक्षा',
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
          excerpt_hindi: `समीक्षित पुस्तक: ${subForm.reviewedBookDetails || subForm.titleHindi}`,
          excerpt_english: `Reviewed Book: ${subForm.reviewedBookDetails || subForm.titleHindi}`,
          content_hindi: subForm.content,
          content_english: subForm.content,
          tags: subForm.tags ? subForm.tags.split(',').map(t => t.trim()) : ['पुस्तक_समीक्षा', 'साहित्य'],
          likes_count: 0,
          pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('blogs', newReview);
      } else {
        const newBlog: BlogItem & { status?: 'pending' | 'approved' | 'rejected'; contributor_name?: string } = {
          id: generatedId,
          title_hindi: subForm.titleHindi,
          title_english: subForm.titleEnglish || subForm.titleHindi,
          author: subForm.authorName,
          author_role: subForm.authorRole || 'लेखक एवं शोधकर्ता',
          date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          read_time: '5 मिनट',
          category: subForm.category || 'लोकसंस्कृति',
          cover_image: coverUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
          excerpt_hindi: subForm.content.slice(0, 160) + '...',
          excerpt_english: subForm.content.slice(0, 160),
          content_hindi: subForm.content,
          content_english: subForm.content,
          tags: subForm.tags ? subForm.tags.split(',').map(t => t.trim()) : ['पवारी', 'ब्लॉग', 'लोकसंस्कृति'],
          likes_count: 0,
          pdf_url: pdfUrl || undefined,
          status: 'pending',
          contributor_name: subForm.authorName
        };
        await submitPublicContribution('blogs', newBlog);
      }

      setSubmitRefNo(generatedRefNo);
      setIsSubmittingPublish(false);
    } catch (err) {
      console.error(err);
      setIsSubmittingPublish(false);
      alert(lang === 'hi' ? 'जमा करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Error submitting form. Please try again.');
    }
  };

  const handleResetPublishForm = () => {
    setSubForm({
      authorName: '',
      authorRole: '',
      email: '',
      phone: '',
      titleHindi: '',
      titleEnglish: '',
      category: 'भाषाविज्ञान एवं लोकसाहित्य',
      reviewedBookDetails: '',
      publisher: 'पावारी शोध संस्थान प्रकाशन',
      isbn: '',
      pages: '150',
      content: '',
      tags: 'पवारी, लोकसाहित्य, शोध',
      coverImageUrl: '',
      pdfUrl: ''
    });
    setCoverFile(null);
    setPdfFile(null);
    setSubmitRefNo(null);
    setIsPublishModalOpen(false);
  };

  // Published research papers from CMS
  const publishedArticles = articles.filter(a => a.status === 'published');

  // Filtered books
  const filteredBooks = booksList.filter(book => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = book.title_hindi.toLowerCase().includes(q) || 
                          book.title_english.toLowerCase().includes(q) || 
                          book.authors.toLowerCase().includes(q) ||
                          book.isbn.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered blogs
  const filteredBlogs = blogsList.filter(blog => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = blog.title_hindi.toLowerCase().includes(q) || 
                          blog.title_english.toLowerCase().includes(q) || 
                          blog.author.toLowerCase().includes(q) ||
                          (blog.tags && blog.tags.some(t => t.toLowerCase().includes(q)));
    
    let matchesCategory = true;
    if (activeTab === 'reviews') {
      matchesCategory = blog.category === 'पुस्तक समीक्षा';
    } else if (selectedCategory !== 'all') {
      matchesCategory = blog.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const handleLikeBlog = (e: React.MouseEvent, blogId: string, initialLikes: number = 0) => {
    e.stopPropagation();
    setLikedBlogs(prev => ({
      ...prev,
      [blogId]: (prev[blogId] || initialLikes) + 1
    }));
  };

  const handleShareArticle = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'copy', title: string) => {
    const siteUrl = window.location.href;
    const shareText = `📖 पवारी साहित्य आलेख: "${title}"\n\nपढ़ें पवारी शोध पत्रिका पोर्टल पर: ${siteUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}`);
      setCopiedArticleLink(true);
      setTimeout(() => setCopiedArticleLink(false), 2500);
    }
  };

  /* =========================================================================
     MAIN PAWARI LITERATURE CATALOG & HUB VIEW WITH INLINE READER SHOWCASE
     ========================================================================= */
  const featuredBook = booksList.find(b => b.is_featured) || booksList[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* ---------------- BREADCRUMB / NAV CUE (Always on top) ---------------- */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <button onClick={() => setActiveView('home')} className="hover:text-red-900 transition font-medium cursor-pointer">
          {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={() => { handleCloseBook(); handleCloseBlog(); }} className="hover:text-red-900 transition font-medium cursor-pointer">
          {lang === 'hi' ? 'पुस्तकें एवं साहित्य' : 'Books & Literature'}
        </button>
        {selectedBook && (
          <>
            <span>/</span>
            <span className="text-red-950 font-bold truncate max-w-[260px]">{selectedBook.title_hindi}</span>
          </>
        )}
        {selectedBlog && (
          <>
            <span>/</span>
            <span className="text-red-950 font-bold truncate max-w-[260px]">{selectedBlog.title_hindi}</span>
          </>
        )}
      </div>

      {/* ---------------- DEDICATED ON-PAGE BLOG / ESSAY READER VIEW ---------------- */}
      {selectedBlog ? (
        <article className="space-y-8 animate-in fade-in duration-200">
          {/* Top Sticky/Floating Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
            <button
              onClick={handleCloseBlog}
              className="inline-flex items-center space-x-2 text-xs font-bold text-red-950 hover:text-red-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? '← सभी ब्लॉग एवं आलेखों पर वापस जाएं' : '← Back to All Articles'}</span>
            </button>

            <div className="flex items-center space-x-2">
              {/* Font Size Selector */}
              <div className="flex items-center space-x-1 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                <span className="text-[11px] text-slate-500 mr-1">अक्षर:</span>
                <button onClick={() => setReaderFontSize(prev => Math.max(15, prev - 2))} className="w-6 h-6 rounded bg-white hover:bg-slate-200 font-bold cursor-pointer">A-</button>
                <span className="font-mono text-[11px] px-1">{readerFontSize}px</span>
                <button onClick={() => setReaderFontSize(prev => Math.min(26, prev + 2))} className="w-6 h-6 rounded bg-white hover:bg-slate-200 font-bold cursor-pointer">A+</button>
              </div>

              <button
                onClick={() => handleShareArticle('whatsapp', selectedBlog.title_hindi)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'hi' ? 'व्हाट्सएप' : 'Share'}</span>
              </button>
              <button
                onClick={() => handleShareArticle('copy', selectedBlog.title_hindi)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedArticleLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedArticleLink ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-3.5 py-1 rounded-full uppercase font-mono">
                ✍️ {selectedBlog.category}
              </span>
              <span className="text-xs text-slate-500 font-mono flex items-center space-x-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedBlog.read_time || '4 मिनट पठन समय'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 leading-tight">
              {lang === 'hi' ? selectedBlog.title_hindi : selectedBlog.title_english}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-3 border-y border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-950 text-amber-200 font-serif font-bold text-sm flex items-center justify-center border border-amber-400/40 shadow-xs">
                  {selectedBlog.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedBlog.author}</div>
                  <div className="text-xs text-slate-500 font-mono">प्रकाशन: {selectedBlog.date}</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                पवारी शोध संस्थान वैचारिक मंच
              </div>
            </div>

            {/* Cover Image (Open Presentation) */}
            {selectedBlog.cover_image && (
              <div className="my-6 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 max-h-[460px] w-full">
                <SafeImage src={selectedBlog.cover_image} alt={selectedBlog.title_english} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Article Full Open Body Text (Rich Editorial Typography) */}
          <div 
            style={{ fontSize: `${readerFontSize}px`, lineHeight: 1.85 }}
            className="max-w-3xl mx-auto font-serif text-slate-800 space-y-6 pt-2"
          >
            {selectedBlog.content_hindi.split('\n\n').filter(Boolean).map((block, i) => {
              const trimmed = block.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-xl sm:text-2xl font-serif font-bold text-red-950 mt-8 mb-3 pb-1 border-b border-amber-300/40">
                    {trimmed.replace(/^###\s+/, '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl sm:text-3xl font-serif font-bold text-red-950 mt-10 mb-4 pb-2 border-b-2 border-amber-400/50">
                    {trimmed.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('1. ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const lines = trimmed.split('\n');
                return (
                  <div key={i} className="space-y-2 my-4 pl-2">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.replace(/^(\d+\.\s+|\-\s+|\*\s+)/, '');
                      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={lIdx} className="flex items-start space-x-2 text-slate-800 leading-relaxed font-serif">
                          <span className="text-amber-700 font-bold font-mono mt-0.5">•</span>
                          <div>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={pIdx} className="text-red-950 font-bold">{p.slice(2, -2)}</strong>;
                              }
                              return <span key={pIdx}>{p}</span>;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              const parts = trimmed.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={i} className="leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:text-red-950 first-letter:mr-0.5">
                  {parts.map((p, pIdx) => {
                    if (p.startsWith('**') && p.endsWith('**')) {
                      return <strong key={pIdx} className="text-red-950 font-bold">{p.slice(2, -2)}</strong>;
                    }
                    return <span key={pIdx}>{p}</span>;
                  })}
                </p>
              );
            })}
          </div>

          {/* PDF Download if available */}
          {selectedBlog.pdf_url && (
            <div className="max-w-3xl mx-auto p-5 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-center justify-between flex-wrap gap-4 shadow-2xs">
              <div>
                <h4 className="text-sm font-bold text-red-950">मूल आलेख PDF फ़ाइल उपलब्ध है</h4>
                <p className="text-xs text-amber-900/80 mt-0.5">शोध सन्दर्भ एवं ऑफलाइन पठन हेतु पूर्ण पीडीएफ डाउनलोड करें</p>
              </div>
              <a href={selectedBlog.pdf_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md transition cursor-pointer">
                <Download className="w-4 h-4 text-amber-300" />
                <span>PDF डाउनलोड करें</span>
              </a>
            </div>
          )}

          {/* Author Box */}
          <div className="max-w-3xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-red-950 text-amber-200 font-serif font-bold text-lg flex items-center justify-center shrink-0 border-2 border-amber-300 shadow-md">
              {selectedBlog.author.charAt(0)}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900">{selectedBlog.author}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-serif">
                पवारी भाषा, संस्कृति, लोकगाथाओं एवं ऐतिहासिक धरोहर पर शोध एवं स्वतंत्र लेखन।
              </p>
            </div>
          </div>

          {/* Prev / Next Navigation Bar */}
          <div className="max-w-3xl mx-auto pt-6 border-t border-slate-200 flex justify-between items-center gap-4">
            {(() => {
              const idx = blogsList.findIndex(b => b.id === selectedBlog.id);
              const prev = idx > 0 ? blogsList[idx - 1] : null;
              const next = idx < blogsList.length - 1 ? blogsList[idx + 1] : null;

              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => handleSelectBlog(prev)}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-2 transition max-w-[48%] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="truncate">{lang === 'hi' ? 'पिछला आलेख: ' : 'Prev: '}{prev.title_hindi}</span>
                    </button>
                  ) : <div />}

                  {next ? (
                    <button
                      onClick={() => handleSelectBlog(next)}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-2 transition max-w-[48%] ml-auto cursor-pointer"
                    >
                      <span className="truncate">{lang === 'hi' ? 'अगला आलेख: ' : 'Next: '}{next.title_hindi}</span>
                      <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                    </button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
        </article>
      ) : selectedBook ? (
        /* ---------------- DEDICATED ON-PAGE BOOK READER VIEW ---------------- */
        <article className="space-y-8 animate-in fade-in duration-200">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
            <button
              onClick={handleCloseBook}
              className="inline-flex items-center space-x-2 text-xs font-bold text-red-950 hover:text-red-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 text-amber-700" />
              <span>{lang === 'hi' ? '← ग्रंथालय सूची पर वापस जाएं' : '← Back to Library Catalog'}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShareArticle('whatsapp', selectedBook.title_hindi)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'hi' ? 'व्हाट्सएप' : 'Share'}</span>
              </button>
              <button
                onClick={() => handleShareArticle('copy', selectedBook.title_hindi)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedArticleLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedArticleLink ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied!') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-48 sm:w-60 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl bg-slate-100 mx-auto md:mx-0">
                <SafeImage src={selectedBook.cover_image} alt={selectedBook.title_english} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-3.5 py-1 rounded-full uppercase font-mono">
                    📚 {selectedBook.category}
                  </span>
                  <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3.5 py-1 rounded-full font-mono">
                    प्रकाशन वर्ष: <strong>{selectedBook.publication_year}</strong>
                  </span>
                  {selectedBook.pages && (
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3.5 py-1 rounded-full font-mono">
                      कुल पृष्ठ: <strong>{selectedBook.pages}</strong>
                    </span>
                  )}
                  <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs px-3.5 py-1 rounded-full font-bold">
                    {selectedBook.price || 'Open Access / निःशुल्क'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-black text-red-950 leading-tight">
                  {lang === 'hi' ? selectedBook.title_hindi : selectedBook.title_english}
                </h1>

                <div className="space-y-1.5 text-sm text-slate-800">
                  <p className="font-bold flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-amber-700" />
                    <span>लेखक / सम्पादक: <strong>{selectedBook.authors}</strong></span>
                  </p>
                  {selectedBook.publisher && (
                    <p className="text-xs text-slate-600 font-medium">
                      प्रकाशक: {selectedBook.publisher}
                    </p>
                  )}
                  {selectedBook.isbn && (
                    <p className="text-xs text-slate-500 font-mono">
                      मानक पुस्तक क्रमांक (ISBN): {selectedBook.isbn}
                    </p>
                  )}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {selectedBook.sample_pdf_url && (
                    <a
                      href={selectedBook.sample_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 text-amber-200 font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-300" />
                      <span>📄 पूर्ण ग्रंथ PDF देखें / डाउनलोड करें</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleShareArticle('whatsapp', selectedBook.title_hindi)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp शेयर</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-serif font-bold text-red-950 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>ग्रंथ परिचय एवं शोध सारांश (Synopsis)</span>
              </h3>
              <div className="text-base text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                {(selectedBook.synopsis_hindi || selectedBook.synopsis_english)}
              </div>
            </div>

            {/* Table of contents */}
            {selectedBook.table_of_contents_hindi && selectedBook.table_of_contents_hindi.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  विषय सूची (Table of Contents)
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-800 font-serif">
                  {selectedBook.table_of_contents_hindi.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prev / Next Book Navigation */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center gap-4">
              {(() => {
                const idx = booksList.findIndex(b => b.id === selectedBook.id);
                const prev = idx > 0 ? booksList[idx - 1] : null;
                const next = idx < booksList.length - 1 ? booksList[idx + 1] : null;

                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => handleSelectBook(prev)}
                        className="px-4 py-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-2 transition max-w-[48%] cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="truncate">{lang === 'hi' ? 'पिछला ग्रंथ: ' : 'Prev: '}{prev.title_hindi}</span>
                      </button>
                    ) : <div />}

                    {next ? (
                      <button
                        onClick={() => handleSelectBook(next)}
                        className="px-4 py-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-semibold text-slate-800 flex items-center space-x-2 transition max-w-[48%] ml-auto cursor-pointer"
                      >
                        <span className="truncate">{lang === 'hi' ? 'अगला ग्रंथ: ' : 'Next: '}{next.title_hindi}</span>
                        <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>
        </article>
      ) : (
        /* ---------------- CATALOG & HUB LISTING VIEW ---------------- */
        <div className="space-y-8">
          
          {/* ---------------- HERO BANNER (Only on Catalog Listing) ---------------- */}
          <div className="bg-gradient-to-br from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/30 space-y-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'पवारी साहित्य एवं शोध ग्रंथालय' : 'Pawari Literature & Research Library'}</span>
                </div>

                <button
                  onClick={() => handleOpenPublishModal('book')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-bold text-xs sm:text-sm shadow-xl flex items-center space-x-2 transition-all cursor-pointer transform hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4 text-red-950" />
                  <span>{lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या आलेख जोड़ें' : 'Submit Book, Review or Article'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight">
                {lang === 'hi' ? 'पवारी साहित्य, ग्रंथालय एवं शोध विमर्श' : 'Pawari Literature, Monographs & Scholarly Essays'}
              </h1>

              <p className="text-xs sm:text-sm text-amber-200/85 max-w-3xl leading-relaxed">
                {lang === 'hi'
                  ? 'बैतूल, छिंदवाड़ा, सिवनी, वर्धा एवं ताप्ती अंचल की समृद्ध पवारी भाषा, ऐतिहासिक शोध ग्रंथ, शब्दकोश, लोकसाहित्य पुस्तकें, समीक्षाएं एवं विद्वत वैचारिक आलेख।'
                  : 'A comprehensive archive of authentic research monographs, dictionaries, folklore literature, book reviews, and academic essays from the Tapti & Satpura belt.'}
              </p>
            </div>

            {/* Action Bar / Main Navigation Tabs inside View */}
            <div className="relative z-10 pt-3 flex items-center gap-2 border-t border-amber-500/20 overflow-x-auto custom-scrollbar pb-2">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                    : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? '🌟 समग्र साहित्य (All)' : 'All Literature'}</span>
              </button>

              <button
                onClick={() => handleTabChange('books')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'books' 
                    ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                    : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
                }`}
              >
                <Book className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? `📚 शोध ग्रंथ एवं पुस्तकें (${booksList.length})` : `Books (${booksList.length})`}</span>
              </button>

              <button
                onClick={() => handleTabChange('blogs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'blogs' 
                    ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                    : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? `✍️ वैचारिक ब्लॉग एवं आलेख (${blogsList.length})` : `Blogs & Essays (${blogsList.length})`}</span>
              </button>

              <button
                onClick={() => handleTabChange('reviews')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'reviews' 
                    ? 'bg-amber-500 text-red-950 shadow-md scale-105' 
                    : 'bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? '📑 पुस्तक समीक्षाएं' : 'Book Reviews'}</span>
              </button>

              <button
                onClick={() => setActiveView('pawari_lokgeet')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? '🎵 पवारी लोकगीत अर्काइव ➔' : 'Lokgeet Archive ➔'}</span>
              </button>

              <button
                onClick={() => setActiveView('pawari_shabdkosh')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? '📖 शब्दकोश व पहेली ➔' : 'Dictionary & Riddles ➔'}</span>
              </button>
            </div>
          </div>
          
          {/* ---------------- SEARCH & FILTER BAR ---------------- */}
          <div className="bg-white border border-amber-900/10 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'hi' 
                      ? 'पुस्तक शीर्षक, लेखक, ब्लॉग विषय या कीवर्ड द्वारा खोजें...' 
                      : 'Search by book title, author, blog topic, or keywords...'
                  }
                  className="w-full pl-10 pr-10 py-2 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="w-full sm:w-56">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">{lang === 'hi' ? 'सभी श्रेणियां (All Categories)' : 'All Categories'}</option>
                  <option value="भाषाविज्ञान एवं लोकसाहित्य">भाषाविज्ञान एवं लोकसाहित्य</option>
                  <option value="संस्कृति एवं मानविकी">संस्कृति एवं मानविकी</option>
                  <option value="कोष ग्रंथ (Lexicography)">कोष ग्रंथ (Lexicography)</option>
                  <option value="मौखिक साहित्य">मौखिक साहित्य</option>
                  <option value="भाषाविज्ञान">भाषाविज्ञान (Blog)</option>
                  <option value="लोकसंस्कृति">लोकसंस्कृति (Blog)</option>
                  <option value="डिजिटल मानविकी">डिजिटल मानविकी (Blog)</option>
                  <option value="पुस्तक समीक्षा">पुस्तक समीक्षा</option>
                </select>
              </div>
            </div>
          </div>

      {/* ---------------- FEATURED HIGHLIGHT MONOGRAPH (When viewing All or Books) ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && featuredBook && !selectedBook && !searchQuery && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-amber-100 shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="w-32 sm:w-40 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-950">
            <SafeImage src={featuredBook.cover_image} alt={featuredBook.title_english} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-3 flex-1 min-w-0 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500 text-amber-950 font-mono text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>सम्पादक की विशेष अनुशंसा / Featured Research Monograph</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-black text-amber-100 leading-tight">
              {lang === 'hi' ? featuredBook.title_hindi : featuredBook.title_english}
            </h3>

            <p className="text-xs text-amber-300 font-bold">
              लेखक: {featuredBook.authors} | {featuredBook.publisher} ({featuredBook.publication_year})
            </p>

            <p className="text-xs text-amber-200/80 line-clamp-2 leading-relaxed font-serif">
              {lang === 'hi' ? featuredBook.synopsis_hindi : featuredBook.synopsis_english}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => handleSelectBook(featuredBook)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 hover:from-amber-300 hover:to-amber-400 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>ग्रंथ विवरण एवं विषय-सूची देखें</span>
              </button>

              {featuredBook.sample_pdf_url && (
                <a
                  href={featuredBook.sample_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-200 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF पढ़ें</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CULTURAL QUICK TILES (When viewing All) ---------------- */}
      {activeTab === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveView('pawari_lokgeet')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी लोकगीत अर्काइव
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                विवाह, भक्ति व पारंपरिक लोकगाथाएं ➔
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('pawari_shabdkosh')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी शब्दकोश (2000+ शब्द)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                अर्थ, उच्चारण व वाक्य प्रयोग ➔
              </p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('pawari_paheli')}
            className="bg-gradient-to-br from-amber-900/30 to-red-950/40 border border-amber-900/30 hover:border-amber-500 rounded-2xl p-5 cursor-pointer transition group flex items-center space-x-4 shadow-2xs hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-red-900 transition">
                पवारी बुझौवल एवं पहेलियाँ
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                374+ पहेलियाँ एवं संस्कृति क्विज़ ➔
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- BOOKS & MONOGRAPHS LISTING (Open Editorial Layout) ---------------- */}
      {(activeTab === 'all' || activeTab === 'books') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-amber-900/15 pb-3">
            <div className="flex items-center space-x-2.5">
              <Book className="w-5 h-5 text-red-900" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                {lang === 'hi' ? 'प्रकाशित शोध ग्रंथ एवं पुस्तकें' : 'Published Books & Monographs'}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {filteredBooks.length} {lang === 'hi' ? 'ग्रंथ उपलब्ध' : 'Books Available'}
            </span>
          </div>

          <div className="space-y-6">
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                className="bg-white border border-amber-900/15 hover:border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition flex flex-col md:flex-row gap-6 sm:gap-8 items-start group"
              >
                {/* Book Cover */}
                <div 
                  onClick={() => handleSelectBook(book)}
                  className="w-36 sm:w-44 aspect-3/4 shrink-0 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-slate-900 cursor-pointer group-hover:scale-105 transition transform duration-200 mx-auto md:mx-0"
                >
                  <SafeImage 
                    src={book.cover_image} 
                    alt={book.title_english} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-950 font-bold text-xs px-3 py-0.5 rounded-full border border-amber-300 font-mono">
                      📚 {book.category}
                    </span>
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-0.5 rounded-full font-mono">
                      प्रकाशन वर्ष: <strong>{book.publication_year}</strong>
                    </span>
                    {book.pages && (
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-0.5 rounded-full font-mono">
                        पृष्ठ: <strong>{book.pages}</strong>
                      </span>
                    )}
                    <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs px-3 py-0.5 rounded-full font-bold">
                      {book.price || 'Open Access / निःशुल्क'}
                    </span>
                  </div>

                  <h3 
                    onClick={() => handleSelectBook(book)}
                    className="text-xl sm:text-2xl font-serif font-black text-slate-900 group-hover:text-red-950 transition leading-snug cursor-pointer"
                  >
                    {lang === 'hi' ? book.title_hindi : book.title_english}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>लेखक / सम्पादक: <strong>{book.authors}</strong></span>
                    </p>
                    {book.publisher && (
                      <p className="text-slate-500 font-medium">
                        प्रकाशक: {book.publisher}
                      </p>
                    )}
                    {book.isbn && (
                      <p className="text-slate-500 font-mono text-[11px]">
                        ISBN: {book.isbn}
                      </p>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif pt-1">
                    {lang === 'hi' ? book.synopsis_hindi : book.synopsis_english}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleSelectBook(book)}
                      className="px-4 py-2 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 text-amber-200 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'hi' ? 'ग्रंथ विवरण एवं सारांश देखें →' : 'View Book Details →'}</span>
                    </button>

                    {book.sample_pdf_url && (
                      <a
                        href={book.sample_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>PDF पढ़ें</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleShareArticle('whatsapp', book.title_hindi)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer ml-auto"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>शेयर</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BLOGS & ESSAYS LISTING (Open Editorial Layout) ---------------- */}
      {(activeTab === 'all' || activeTab === 'blogs' || activeTab === 'reviews') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-amber-900/15 pb-3">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-5 h-5 text-red-900" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950">
                {activeTab === 'reviews' 
                  ? (lang === 'hi' ? 'पुस्तक समीक्षाएं (Book Reviews)' : 'Book Reviews')
                  : (lang === 'hi' ? 'साहित्यिक आलेख एवं वैचारिक विमर्श' : 'Scholarly Blogs & Essays')}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {filteredBlogs.length} {lang === 'hi' ? 'आलेख उपलब्ध' : 'Articles Available'}
            </span>
          </div>

          <div className="space-y-6">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white border border-amber-900/15 hover:border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition flex flex-col md:flex-row gap-6 sm:gap-8 items-start group"
              >
                {/* Blog Image */}
                {blog.cover_image && (
                  <div 
                    onClick={() => handleSelectBlog(blog)}
                    className="w-full md:w-56 h-48 md:h-40 shrink-0 rounded-2xl overflow-hidden border border-amber-300 shadow-md bg-slate-900 cursor-pointer group-hover:scale-105 transition transform duration-200"
                  >
                    <SafeImage 
                      src={blog.cover_image} 
                      alt={blog.title_english} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                {/* Blog Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-950 font-bold text-xs px-3 py-0.5 rounded-full border border-amber-300 font-mono">
                      ✍️ {blog.category}
                    </span>
                    <span className="text-xs text-slate-600 font-medium flex items-center space-x-1 bg-slate-50 px-3 py-0.5 rounded-full border border-slate-200">
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>लेखक: <strong>{blog.author}</strong></span>
                    </span>
                    <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {blog.date}
                    </span>
                    {blog.read_time && (
                      <span className="text-xs text-slate-500 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{blog.read_time}</span>
                      </span>
                    )}
                  </div>

                  <h3 
                    onClick={() => handleSelectBlog(blog)}
                    className="text-xl sm:text-2xl font-serif font-black text-slate-900 group-hover:text-red-950 transition leading-snug cursor-pointer"
                  >
                    {lang === 'hi' ? blog.title_hindi : blog.title_english}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {lang === 'hi' ? blog.excerpt_hindi : blog.excerpt_english}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleSelectBlog(blog)}
                      className="px-4 py-2 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 text-amber-200 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'hi' ? 'संपूर्ण आलेख पढ़ें →' : 'Read Full Article →'}</span>
                    </button>

                    {blog.pdf_url && (
                      <a
                        href={blog.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-700" />
                        <span>PDF डाउनलोड</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleShareArticle('whatsapp', blog.title_hindi)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer ml-auto"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>शेयर</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
        </div>
      )}

      {/* ---------------- PUBLICATION SUBMISSION MODAL ---------------- */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={handleResetPublishForm}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-mono">
                <FileUp className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'hi' ? 'मां ताप्ती पवारी शोध संस्थान प्रकाशन' : 'Research & Publication Portal'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                {lang === 'hi' ? 'अपनी पुस्तक, समीक्षा या ब्लॉग प्रकाशित कराएं' : 'Submit Book, Book Review or Blog Article'}
              </h2>
            </div>

            {submitRefNo ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-950">प्रकाशन प्रस्ताव सफलतापूर्वक दर्ज हुआ!</h3>
                  <p className="text-xs text-emerald-800 font-mono">समीक्षा सन्दर्भ संख्या: <strong>{submitRefNo}</strong></p>
                </div>
                <button onClick={handleResetPublishForm} className="px-6 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
                  समीक्षा पूर्ण (बंद करें)
                </button>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">लेखक का नाम (Author Name) *</label>
                    <input type="text" required value={subForm.authorName} onChange={(e) => setSubForm(prev => ({ ...prev, authorName: e.target.value }))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">शीर्षक (Title) *</label>
                    <input type="text" required value={subForm.titleHindi} onChange={(e) => setSubForm(prev => ({ ...prev, titleHindi: e.target.value }))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विस्तृत सामग्री / आलेख (Full Text / Content) *</label>
                  <textarea rows={5} required value={subForm.content} onChange={(e) => setSubForm(prev => ({ ...prev, content: e.target.value }))} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-serif leading-relaxed" />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={handleResetPublishForm} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">रद्द करें</button>
                  <button type="submit" disabled={isSubmittingPublish} className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-300 font-bold text-xs rounded-xl shadow-md">
                    {isSubmittingPublish ? 'जमा हो रहा है...' : 'सबमिट करें'}
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
