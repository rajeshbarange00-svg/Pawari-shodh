import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { fileBlobManager } from '../../lib/fileBlobManager';
import { BookItem, BlogItem, SAMPLE_BOOKS, SAMPLE_BLOGS } from '../../data/booksBlogsData';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Upload, 
  Book, 
  MessageSquare, 
  Calendar, 
  User, 
  Tag, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  DollarSign,
  Hash,
  Clock,
  ExternalLink
} from 'lucide-react';

export const BooksBlogsManager: React.FC = () => {
  const { books, blogs, saveBook, deleteBook, saveBlog, deleteBlog, uploadFileToStorage, lang } = useCms();

  const [activeTab, setActiveTab] = useState<'books' | 'blogs'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for edit or delete
  const [editingBook, setEditingBook] = useState<Partial<BookItem> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'book' | 'blog' } | null>(null);

  // Image & PDF Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const displayBooks = (books && books.length > 0) ? books : SAMPLE_BOOKS;
  const displayBlogs = (blogs && blogs.length > 0) ? blogs : SAMPLE_BLOGS;

  // Search filters
  const filteredBooks = displayBooks.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchQ = b.title_hindi.toLowerCase().includes(q) || 
                   b.title_english.toLowerCase().includes(q) || 
                   b.authors.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    return matchQ && matchCat;
  });

  const filteredBlogs = displayBlogs.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchQ = b.title_hindi.toLowerCase().includes(q) || 
                   b.title_english.toLowerCase().includes(q) || 
                   b.author.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
    return matchQ && matchCat;
  });

  // --- Handlers for Books ---
  const handleOpenNewBook = () => {
    setEditingBook({
      id: 'book_' + Date.now(),
      title_hindi: '',
      title_english: '',
      authors: '',
      publisher: 'पावारी शोध संस्थान प्रकाशन',
      publication_year: new Date().getFullYear().toString(),
      pages: 200,
      isbn: '978-93-' + Math.floor(100000 + Math.random() * 900000) + '-0',
      category: 'शोध ग्रन्थ',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      synopsis_hindi: '',
      synopsis_english: '',
      price: '₹ 350',
      table_of_contents_hindi: []
    });
    setIsBookModalOpen(true);
  };

  const handleEditBook = (book: BookItem) => {
    setEditingBook({ ...book });
    setIsBookModalOpen(true);
  };

  const handleSaveBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook || !editingBook.title_hindi || !editingBook.authors) {
      alert('कृपया पुस्तक का नाम और लेखक का नाम भरें।');
      return;
    }

    const bookToSave: BookItem = {
      id: editingBook.id || ('book_' + Date.now()),
      title_hindi: editingBook.title_hindi || '',
      title_english: editingBook.title_english || editingBook.title_hindi || '',
      authors: editingBook.authors || '',
      publisher: editingBook.publisher || 'पावारी शोध संस्थान',
      publication_year: editingBook.publication_year || new Date().getFullYear().toString(),
      pages: Number(editingBook.pages) || 200,
      isbn: editingBook.isbn || 'N/A',
      category: editingBook.category || 'शोध ग्रन्थ',
      cover_image: editingBook.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      synopsis_hindi: editingBook.synopsis_hindi || '',
      synopsis_english: editingBook.synopsis_english || '',
      price: editingBook.price || '₹ 300',
      table_of_contents_hindi: editingBook.table_of_contents_hindi || [],
      sample_pdf_url: editingBook.sample_pdf_url || ''
    };

    setSaveStatus('सहेजा जा रहा है...');
    try {
      await saveBook(bookToSave);
      setSaveStatus('सफलतापूर्वक सहेजा गया!');
      setTimeout(() => {
        setIsBookModalOpen(false);
        setEditingBook(null);
        setSaveStatus(null);
      }, 600);
    } catch (err) {
      alert('सहेजने में त्रुटि: ' + err);
      setSaveStatus(null);
    }
  };

  // --- Handlers for Blogs ---
  const handleOpenNewBlog = () => {
    setEditingBlog({
      id: 'blog_' + Date.now(),
      title_hindi: '',
      title_english: '',
      author: 'डॉ. रमेश कुमार पवार',
      author_role: 'वरिष्ठ शोधकर्ता',
      author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      date: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      read_time: '5 मिनट',
      category: 'लोक साहित्य संकलन',
      cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
      excerpt_hindi: '',
      excerpt_english: '',
      content_hindi: '',
      content_english: '',
      likes_count: 0,
      tags: ['पावारी', 'लोक साहित्य', 'शोध']
    });
    setIsBlogModalOpen(true);
  };

  const handleEditBlog = (blog: BlogItem) => {
    setEditingBlog({ ...blog });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title_hindi || !editingBlog.author) {
      alert('कृपया ब्लॉग का शीर्षक एवं लेखक का नाम भरें।');
      return;
    }

    const blogToSave: BlogItem = {
      id: editingBlog.id || ('blog_' + Date.now()),
      title_hindi: editingBlog.title_hindi || '',
      title_english: editingBlog.title_english || editingBlog.title_hindi || '',
      author: editingBlog.author || '',
      author_role: editingBlog.author_role || 'लेखक',
      author_avatar: editingBlog.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      date: editingBlog.date || new Date().toISOString().split('T')[0],
      read_time: editingBlog.read_time || '5 मिनट',
      category: editingBlog.category || 'लोक साहित्य',
      cover_image: editingBlog.cover_image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
      pdf_url: editingBlog.pdf_url || '',
      excerpt_hindi: editingBlog.excerpt_hindi || '',
      excerpt_english: editingBlog.excerpt_english || '',
      content_hindi: editingBlog.content_hindi || '',
      content_english: editingBlog.content_english || '',
      likes_count: editingBlog.likes_count || 0,
      tags: editingBlog.tags || ['पावारी']
    };

    setSaveStatus('सहेजा जा रहा है...');
    try {
      await saveBlog(blogToSave);
      setSaveStatus('सफलतापूर्वक सहेजा गया!');
      setTimeout(() => {
        setIsBlogModalOpen(false);
        setEditingBlog(null);
        setSaveStatus(null);
      }, 600);
    } catch (err) {
      alert('सहेजने में त्रुटि: ' + err);
      setSaveStatus(null);
    }
  };

  // --- Deletion Handler ---
  const ConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'book') {
        await deleteBook(itemToDelete.id);
      } else {
        await deleteBlog(itemToDelete.id);
      }
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (e) {
      alert('हटाने में विफलता: ' + e);
    }
  };

  // Cover Image & PDF File Upload Helper targeting Firebase Storage
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    target: 'book' | 'book_pdf' | 'blog' | 'blog_pdf' | 'avatar'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress('Firebase Storage में अपलोड हो रहा है...');
    try {
      const folder = target.includes('pdf') ? 'pdfs/books_blogs' : 'images/books_blogs';
      const res = await uploadFileToStorage(file, folder);
      
      if (target === 'book' && editingBook) {
        setEditingBook(prev => prev ? ({ ...prev, cover_image: res.url }) : null);
      } else if (target === 'book_pdf' && editingBook) {
        setEditingBook(prev => prev ? ({ ...prev, sample_pdf_url: res.url }) : null);
      } else if (target === 'blog' && editingBlog) {
        setEditingBlog(prev => prev ? ({ ...prev, cover_image: res.url }) : null);
      } else if (target === 'blog_pdf' && editingBlog) {
        setEditingBlog(prev => prev ? ({ ...prev, pdf_url: res.url }) : null);
      } else if (target === 'avatar' && editingBlog) {
        setEditingBlog(prev => prev ? ({ ...prev, author_avatar: res.url }) : null);
      }
      setUploadProgress('अपलोड सफल! (Firebase Storage)');
      setTimeout(() => setUploadProgress(null), 3000);
    } catch (err) {
      console.warn('Storage upload error, using fallback:', err);
      const fileId = 'file_' + Date.now();
      const fallbackUrl = fileBlobManager.registerBlob(fileId, file);
      
      if (target === 'book' && editingBook) setEditingBook(prev => prev ? ({ ...prev, cover_image: fallbackUrl }) : null);
      else if (target === 'book_pdf' && editingBook) setEditingBook(prev => prev ? ({ ...prev, sample_pdf_url: fallbackUrl }) : null);
      else if (target === 'blog' && editingBlog) setEditingBlog(prev => prev ? ({ ...prev, cover_image: fallbackUrl }) : null);
      else if (target === 'blog_pdf' && editingBlog) setEditingBlog(prev => prev ? ({ ...prev, pdf_url: fallbackUrl }) : null);
      else if (target === 'avatar' && editingBlog) setEditingBlog(prev => prev ? ({ ...prev, author_avatar: fallbackUrl }) : null);

      setUploadProgress('फ़ाइल सहेजी गई!');
      setTimeout(() => setUploadProgress(null), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-900 text-amber-100 rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BOOKS & BLOGS CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            पुस्तकें एवं ब्लॉग प्रबंधन (CMS)
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl">
            पावारी शोध संस्थान द्वारा प्रकाशित पुस्तकों, शोध-ग्रंथों, विद्वत निबंधों एवं ब्लॉग समीक्षाओं का पूर्ण प्रबंधन (जोड़ें, संपादित करें एवं हटाएं)।
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'books' ? (
            <button
              onClick={handleOpenNewBook}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>नयी पुस्तक जोड़ें</span>
            </button>
          ) : (
            <button
              onClick={handleOpenNewBlog}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>नया ब्लॉग जोड़ें</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">कुल पुस्तकें (Books)</p>
            <p className="text-2xl font-serif font-bold text-red-950">{displayBooks.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-900 flex items-center justify-center">
            <Book className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">कुल ब्लॉग (Blogs)</p>
            <p className="text-2xl font-serif font-bold text-amber-900">{displayBlogs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">शोध ग्रंथ श्रेणी</p>
            <p className="text-2xl font-serif font-bold text-slate-800">
              {displayBooks.filter(b => b.category === 'शोध ग्रन्थ').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">समीक्षाएँ (Reviews)</p>
            <p className="text-2xl font-serif font-bold text-purple-900">
              {displayBlogs.filter(b => b.category === 'पुस्तक समीक्षा').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search controls */}
      <div className="bg-white rounded-2xl p-4 border border-amber-900/10 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
          
          {/* Main Tab Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('books'); setSelectedCategory('all'); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'books'
                  ? 'bg-red-950 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Book className="w-4 h-4" />
              <span>पुस्तकें एवं शोध ग्रंथ ({displayBooks.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('blogs'); setSelectedCategory('all'); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'blogs'
                  ? 'bg-red-950 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>ब्लॉग एवं समीक्षाएं ({displayBlogs.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="शीर्षक या लेखक खोजें..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Content List */}
        {activeTab === 'books' ? (
          <div className="space-y-3">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">कोई पुस्तक नहीं मिली।</p>
                <button
                  onClick={handleOpenNewBook}
                  className="mt-3 text-xs text-amber-700 font-bold hover:underline"
                >
                  + नयी पुस्तक जोड़ें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div className="flex space-x-4">
                      <div className="w-20 h-28 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 shadow-xs">
                        <SafeImage
                          src={book.cover_image}
                          alt={book.title_hindi}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {book.category}
                        </span>
                        <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                          {book.title_hindi}
                        </h3>
                        <p className="text-xs text-slate-600 font-sans truncate">
                          {book.authors}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {book.publisher} • {book.publication_year}
                        </p>
                        <p className="text-xs font-bold text-red-900 font-mono mt-1">
                          {book.price} | {book.pages} पृ.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 mt-3">
                      <span className="text-[10px] text-slate-400 font-mono">ISBN: {book.isbn}</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditBook(book)}
                          className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                          title="संपादित करें (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete({ id: book.id, title: book.title_hindi, type: 'book' });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">कोई ब्लॉग नहीं मिला।</p>
                <button
                  onClick={handleOpenNewBlog}
                  className="mt-3 text-xs text-amber-700 font-bold hover:underline"
                >
                  + नया ब्लॉग जोड़ें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                        <SafeImage
                          src={blog.cover_image}
                          alt={blog.title_hindi}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {blog.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{blog.date}</span>
                        </div>
                        <h3 className="font-serif font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                          {blog.title_hindi}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-slate-600">
                          <User className="w-3.5 h-3.5 text-amber-700" />
                          <span className="truncate">{blog.author}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {blog.excerpt_hindi}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 mt-3">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{blog.read_time}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                          title="संपादित करें (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete({ id: blog.id, title: blog.title_hindi, type: 'blog' });
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT BOOK MODAL --- */}
      {isBookModalOpen && editingBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-900/20 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-red-950 text-amber-100 p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-b border-amber-500/30">
              <div className="flex items-center space-x-2">
                <Book className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-serif font-bold">
                  {editingBook.id ? 'पुस्तक जानकारी संपादित करें' : 'नयी पुस्तक जोड़ें'}
                </h2>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBookSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Hindi Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पुस्तक का शीर्षक (हिंदी / पावारी में) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBook.title_hindi || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, title_hindi: e.target.value })}
                    placeholder="उदा. पावारी लोकसाहित्य एवं संस्कृति"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* English Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title in English
                  </label>
                  <input
                    type="text"
                    value={editingBook.title_english || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, title_english: e.target.value })}
                    placeholder="e.g. Pawari Folklore and Culture"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लेखक / संपादक *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBook.authors || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, authors: e.target.value })}
                    placeholder="उदा. डॉ. रामेश्वर पवार एवं प्रो. कमला शर्मा"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingBook.category || 'शोध ग्रन्थ'}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="शोध ग्रन्थ">शोध ग्रन्थ (Research Monograph)</option>
                    <option value="भाषा-विज्ञान">भाषा-विज्ञान (Linguistics)</option>
                    <option value="लोक साहित्य">लोक साहित्य (Folklore)</option>
                    <option value="इतिहास एवं संस्कृति">इतिहास एवं संस्कृति (History & Culture)</option>
                    <option value="शब्दावली एवं कोश">शब्दावली एवं कोश (Dictionary & Lexicon)</option>
                  </select>
                </div>

                {/* Publisher */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    प्रकाशक (Publisher)
                  </label>
                  <input
                    type="text"
                    value={editingBook.publisher || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Publication Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    प्रकाशन वर्ष (Year)
                  </label>
                  <input
                    type="text"
                    value={editingBook.publication_year || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, publication_year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Pages & Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पृष्ठ संख्या (Pages)
                  </label>
                  <input
                    type="number"
                    value={editingBook.pages || 200}
                    onChange={(e) => setEditingBook({ ...editingBook, pages: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    मूल्य (Price)
                  </label>
                  <input
                    type="text"
                    value={editingBook.price || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
                    placeholder="उदा. ₹ 450"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* ISBN */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ISBN (यदि उपलब्ध हो)
                  </label>
                  <input
                    type="text"
                    value={editingBook.isbn || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                    placeholder="978-93-XXXXX-X"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image URL / Upload */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  कवर चित्र (Cover Image URL या फ़ाइल अपलोड करें - Firebase Storage)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={editingBook.cover_image || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, cover_image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl cursor-pointer transition flex items-center space-x-1 shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'चित्र अपलोड'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'book')}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingBook.cover_image && (
                  <div className="w-20 h-28 rounded-lg overflow-hidden border border-slate-300 shadow-xs mt-2">
                    <SafeImage src={editingBook.cover_image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Book PDF File Upload (Firebase Storage) */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  पुस्तक PDF फ़ाइल (Sample or Full Book PDF - Firebase Storage)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={editingBook.sample_pdf_url || ''}
                    onChange={(e) => setEditingBook({ ...editingBook, sample_pdf_url: e.target.value })}
                    placeholder="PDF फ़ाइल का लिंक या डायरेक्ट अपलोड करें..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl cursor-pointer transition flex items-center space-x-1 shrink-0 shadow-xs">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'PDF फ़ाइल अपलोड'}</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => handleFileUpload(e, 'book_pdf')}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingBook.sample_pdf_url && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-950 font-mono">
                    <span className="truncate max-w-md font-bold">📄 PDF संचय: {editingBook.sample_pdf_url}</span>
                    <a
                      href={editingBook.sample_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-900 underline font-bold text-[11px] shrink-0"
                    >
                      जांचें →
                    </a>
                  </div>
                )}
              </div>

              {uploadProgress && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-900 flex items-center space-x-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              {/* Synopsis Hindi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पुस्तक का सारांश / परिचय (हिंदी)
                </label>
                <textarea
                  rows={3}
                  value={editingBook.synopsis_hindi || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, synopsis_hindi: e.target.value })}
                  placeholder="पुस्तक का विस्तृत परिचय तथा मुख्य शोध बिंदु..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Synopsis English */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Synopsis / Abstract (English)
                </label>
                <textarea
                  rows={2}
                  value={editingBook.synopsis_english || ''}
                  onChange={(e) => setEditingBook({ ...editingBook, synopsis_english: e.target.value })}
                  placeholder="Brief synopsis in English..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Table of Contents */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  विषय-सूची / अध्याय (प्रति पंक्ति एक अध्याय लिखें)
                </label>
                <textarea
                  rows={3}
                  value={editingBook.table_of_contents_hindi ? editingBook.table_of_contents_hindi.join('\n') : ''}
                  onChange={(e) => setEditingBook({
                    ...editingBook,
                    table_of_contents_hindi: e.target.value.split('\n').filter(line => line.trim() !== '')
                  })}
                  placeholder="अध्याय 1: भूमिका&#10;अध्याय 2: पावारी बोली का उद्भव&#10;अध्याय 3: लोक-साहित्य संकलन"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={!!saveStatus}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveStatus || 'पुस्तक सुरक्षित करें'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- CREATE / EDIT BLOG MODAL --- */}
      {isBlogModalOpen && editingBlog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-900/20 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-red-950 text-amber-100 p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-b border-amber-500/30">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-serif font-bold">
                  {editingBlog.id ? 'ब्लॉग / समीक्षा संपादित करें' : 'नया ब्लॉग लेख जोड़ें'}
                </h2>
              </div>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBlogSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Hindi Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ब्लॉग का शीर्षक (हिंदी / पावारी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title_hindi || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title_hindi: e.target.value })}
                    placeholder="उदा. पावारी लोकगीतों में प्रकृति चित्रम"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* English Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title in English
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title_english || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title_english: e.target.value })}
                    placeholder="e.g. Nature imagery in Pawari folksongs"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लेखक का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.author || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                    placeholder="उदा. डॉ. रमेश कुमार पवार"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Author Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लेखक का पद / परिचय
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author_role || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, author_role: e.target.value })}
                    placeholder="उदा. वरिष्ठ शोधकर्ता, पावारी पीठ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingBlog.category || 'लोक साहित्य संकलन'}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="लोक साहित्य संकलन">लोक साहित्य संकलन</option>
                    <option value="भाषाशास्त्र निबंध">भाषाशास्त्र निबंध</option>
                    <option value="संस्कृति विमर्श">संस्कृति विमर्श</option>
                    <option value="पुस्तक समीक्षा">पुस्तक समीक्षा (Book Review)</option>
                  </select>
                </div>

                {/* Date & Read time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    प्रकाशन तिथि एवं पढ़ने का समय
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editingBlog.date || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                      placeholder="15 मई 2026"
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                    <input
                      type="text"
                      value={editingBlog.read_time || '5 मिनट'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, read_time: e.target.value })}
                      placeholder="5 मिनट"
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Cover Image & PDF Upload */}
              <div className="space-y-3 border-t border-slate-200 pt-3">
                {/* Banner Image */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    मुख्य बैनर चित्र (Banner Image URL / File Upload - Firebase Storage)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editingBlog.cover_image || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, cover_image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                    <label className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'चित्र अपलोड'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'blog')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Blog PDF Document */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    संलग्नित PDF लेख फ़ाइल (Blog Document PDF - Firebase Storage)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editingBlog.pdf_url || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, pdf_url: e.target.value })}
                      placeholder="PDF फ़ाइल लिंक या अपलोड करें..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                    <label className="px-3 py-2 bg-red-950 hover:bg-red-900 text-amber-200 text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1 shrink-0 shadow-xs">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'PDF अपलोड'}</span>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(e) => handleFileUpload(e, 'blog_pdf')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingBlog.pdf_url && (
                    <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-center justify-between text-amber-950 font-mono">
                      <span className="truncate max-w-md font-bold">📄 PDF संचय: {editingBlog.pdf_url}</span>
                      <a
                        href={editingBlog.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-900 underline font-bold text-[11px] shrink-0"
                      >
                        जांचें →
                      </a>
                    </div>
                  )}
                </div>

                {uploadProgress && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-900 flex items-center space-x-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{uploadProgress}</span>
                  </div>
                )}
              </div>

              {/* Excerpt Hindi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  संक्षिप्त परिचय (Excerpt / Intro)
                </label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt_hindi || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt_hindi: e.target.value })}
                  placeholder="लेख का मुख्य सारांश जो सूची में दिखेगा..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Full Content Hindi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  पूरा लेख / विषयवस्तु (Full Content in Hindi)
                </label>
                <textarea
                  rows={6}
                  value={editingBlog.content_hindi || ''}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content_hindi: e.target.value })}
                  placeholder="ब्लॉग का पूरा पाठ यहाँ दर्ज करें..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-serif leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  टैग (Tags - कॉमा से अलग करें)
                </label>
                <input
                  type="text"
                  value={editingBlog.tags ? editingBlog.tags.join(', ') : ''}
                  onChange={(e) => setEditingBlog({
                    ...editingBlog,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="पावारी, लोकगीत, संस्कृति, समीक्षा"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={!!saveStatus}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-red-950 text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveStatus || 'ब्लॉग सुरक्षित करें'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  हटाने की पुष्टि करें
                </h3>
                <p className="text-xs text-slate-500">
                  क्या आप वाकई इसे हटाना चाहते हैं?
                </p>
              </div>
            </div>

            <p className="bg-red-50 text-red-950 p-3 rounded-xl border border-red-200 text-xs font-bold font-serif">
              "{itemToDelete.title}"
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={ConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>हटाएं</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
