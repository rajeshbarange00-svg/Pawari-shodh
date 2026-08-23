import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { BlogItem, SAMPLE_BLOGS } from '../../data/booksBlogsData';
import { ensureUniqueSlug } from '../../lib/slugUtils';
import { SafeImage } from '../common/SafeImage';
import { getUrlForView } from '../../lib/router';
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
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Globe, 
  Tag, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar,
  Layers,
  SearchCode
} from 'lucide-react';

export const BlogsManager: React.FC = () => {
  const { 
    blogs, 
    saveBlog, 
    deleteBlog, 
    approveBlog, 
    rejectBlog, 
    publishBlog, 
    unpublishBlog, 
    uploadFileToStorage, 
    setActiveView,
    lang 
  } = useCms();

  // Active sub-tab
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'published' | 'draft' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlogItem | null>(null);
  const [rejectComments, setRejectComments] = useState('');

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const displayBlogs = (blogs && blogs.length > 0) ? blogs : SAMPLE_BLOGS;

  // Counts
  const pendingCount = displayBlogs.filter(b => b.status === 'pending').length;
  const publishedCount = displayBlogs.filter(b => (b.status || 'published') === 'published').length;
  const draftCount = displayBlogs.filter(b => b.status === 'draft').length;
  const rejectedCount = displayBlogs.filter(b => b.status === 'rejected').length;

  // Filtered List
  const filteredBlogs = useMemo(() => {
    return displayBlogs.filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const matchQ = !q || 
        (b.title_hindi && b.title_hindi.toLowerCase().includes(q)) ||
        (b.title_english && b.title_english.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.contributor_name && b.contributor_name.toLowerCase().includes(q)) ||
        (b.submission_ref && b.submission_ref.toLowerCase().includes(q)) ||
        (b.slug && b.slug.toLowerCase().includes(q));

      const matchCat = categoryFilter === 'all' || b.category === categoryFilter;

      let matchTab = true;
      if (filterTab === 'pending') matchTab = b.status === 'pending';
      else if (filterTab === 'published') matchTab = (b.status || 'published') === 'published';
      else if (filterTab === 'draft') matchTab = b.status === 'draft';
      else if (filterTab === 'rejected') matchTab = b.status === 'rejected';

      return matchQ && matchCat && matchTab;
    });
  }, [displayBlogs, searchQuery, categoryFilter, filterTab]);

  // Handle Open New Blog
  const handleOpenNewBlog = () => {
    const now = new Date();
    const newId = 'blog_' + Date.now();
    setCurrentBlog({
      id: newId,
      title_hindi: '',
      title_english: '',
      author: 'संपादक मंडल',
      author_role: 'संपादक',
      author_avatar: '',
      date: now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      read_time: '4 मिनट',
      category: 'साहित्य एवं विचार',
      language: 'hindi',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
      excerpt_hindi: '',
      excerpt_english: '',
      content_hindi: '',
      content_english: '',
      tags: ['पवारी', 'साहित्य'],
      slug: '',
      status: 'published',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_image: '',
      likes_count: 0,
      views_count: 0
    });
    setUploadError(null);
    setSaveStatus(null);
    setIsEditModalOpen(true);
  };

  // Handle Edit Blog
  const handleEditBlog = (blog: BlogItem) => {
    setCurrentBlog({ ...blog });
    setUploadError(null);
    setSaveStatus(null);
    setIsEditModalOpen(true);
  };

  // Auto-generate Slug
  const handleGenerateSlug = () => {
    if (!currentBlog) return;
    const base = currentBlog.title_english || currentBlog.title_hindi || 'blog-post';
    const clean = ensureUniqueSlug(base, currentBlog.id || 'new', displayBlogs);
    setCurrentBlog(prev => prev ? ({ ...prev, slug: clean }) : null);
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadError(null);
    try {
      const res = await uploadFileToStorage(file, 'blog_covers');
      if (res?.url) {
        setCurrentBlog(prev => prev ? ({ ...prev, cover_image: res.url, og_image: prev.og_image || res.url }) : null);
      }
    } catch (err: any) {
      console.warn('Image upload error/fallback:', err);
      const errMsg = err?.message || 'चित्र अपलोड में त्रुटि आई। कृपया फ़ाइल का आकार (अधिकतम 5MB) और प्रारूप जांचें।';
      setUploadError(errMsg);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentBlog(prev => prev ? ({ ...prev, cover_image: reader.result as string }) : null);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Blog
  const handleSaveBlog = async (targetStatus?: BlogItem['status']) => {
    if (!currentBlog || !currentBlog.id) return;
    if (!currentBlog.title_hindi && !currentBlog.title_english) {
      alert('कृपया आलेख का शीर्षक (Title) अवश्य दर्ज करें।');
      return;
    }

    const finalStatus = targetStatus || currentBlog.status || 'published';
    const contentText = currentBlog.content_hindi || currentBlog.content_english || '';
    const wordCount = contentText.trim() ? contentText.trim().split(/\s+/).length : 0;
    const calculatedReadTime = currentBlog.read_time || `${Math.max(1, Math.ceil(wordCount / 180))} मिनट`;

    const baseTitle = currentBlog.title_english || currentBlog.title_hindi || 'blog';
    const cleanSlug = currentBlog.slug ? ensureUniqueSlug(currentBlog.slug, currentBlog.id, displayBlogs, currentBlog.slug) : ensureUniqueSlug(baseTitle, currentBlog.id, displayBlogs);

    const blogToSave: BlogItem = {
      id: currentBlog.id,
      title_hindi: currentBlog.title_hindi || '',
      title_english: currentBlog.title_english || currentBlog.title_hindi || '',
      author: currentBlog.author || currentBlog.contributor_name || 'अज्ञात लेखक',
      author_role: currentBlog.author_role || 'रचनाकार / शोधार्थी',
      author_avatar: currentBlog.author_avatar || '',
      date: currentBlog.date || new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      read_time: calculatedReadTime,
      category: currentBlog.category || 'साहित्य एवं विचार',
      language: currentBlog.language || 'hindi',
      cover_image: currentBlog.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
      excerpt_hindi: currentBlog.excerpt_hindi || (contentText ? contentText.slice(0, 180) + '...' : ''),
      excerpt_english: currentBlog.excerpt_english || '',
      content_hindi: currentBlog.content_hindi || contentText,
      content_english: currentBlog.content_english || contentText,
      tags: currentBlog.tags || ['पवारी', currentBlog.category || 'साहित्य'],
      slug: cleanSlug,
      status: finalStatus,
      contributor_name: currentBlog.contributor_name || '',
      contributor_email: currentBlog.contributor_email || '',
      contributor_phone: currentBlog.contributor_phone || '',
      consent_given: currentBlog.consent_given ?? true,
      submission_ref: currentBlog.submission_ref || '',
      meta_title: currentBlog.meta_title || currentBlog.title_hindi || '',
      meta_description: currentBlog.meta_description || currentBlog.excerpt_hindi || '',
      meta_keywords: currentBlog.meta_keywords || (currentBlog.tags ? currentBlog.tags.join(', ') : ''),
      og_image: currentBlog.og_image || currentBlog.cover_image || '',
      editorial_comments: currentBlog.editorial_comments || '',
      published_at: finalStatus === 'published' ? (currentBlog.published_at || new Date().toISOString()) : (currentBlog.published_at || ''),
      updated_at: new Date().toISOString(),
      likes_count: currentBlog.likes_count || 0,
      views_count: currentBlog.views_count || 0
    };

    await saveBlog(blogToSave);
    setSaveStatus('सफलतापूर्वक सहेजा गया!');
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveStatus(null);
    }, 1000);
  };

  // Quick Action Handlers
  const handleQuickPublish = async (blog: BlogItem) => {
    await publishBlog(blog.id);
  };

  const handleQuickUnpublish = async (blog: BlogItem) => {
    await unpublishBlog(blog.id);
  };

  const handleQuickApprove = async (blog: BlogItem) => {
    await approveBlog(blog.id);
  };

  const handleOpenRejectModal = (blog: BlogItem) => {
    setCurrentBlog(blog);
    setRejectComments(blog.editorial_comments || '');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!currentBlog?.id) return;
    await rejectBlog(currentBlog.id, rejectComments);
    setIsRejectModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteBlog(itemToDelete.id);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-950 text-amber-300 flex items-center justify-center font-serif font-bold text-lg border border-amber-400/40">
              ब्लॉ
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                ब्लॉग एवं जन-आलेख प्रबंधन (Blog CMS)
              </h2>
              <p className="text-xs text-stone-500 font-serif">
                सार्वजनिक सबमिशन समीक्षा, संपादन, एसईओ मेटाडाटा एवं प्रकाशन नियंत्रण
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveView('blog_list')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-serif font-medium flex items-center space-x-1.5 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>लाइव ब्लॉग देखें</span>
          </button>

          <button
            onClick={handleOpenNewBlog}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-200 rounded-xl text-xs font-serif font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया ब्लॉग बनाएं</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        
        {/* Sub Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-stone-100">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition whitespace-nowrap ${
              filterTab === 'all' 
                ? 'bg-red-950 text-amber-200 shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            सभी आलेख ({displayBlogs.length})
          </button>

          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterTab === 'pending' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>प्रतीक्षारत सबमिशन</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-950 text-amber-200 rounded-full text-[10px] font-bold font-mono">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterTab('published')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterTab === 'published' 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>प्रकाशित ({publishedCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('draft')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition whitespace-nowrap ${
              filterTab === 'draft' 
                ? 'bg-stone-800 text-white shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ड्राफ्ट ({draftCount})
          </button>

          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-serif font-semibold transition whitespace-nowrap ${
              filterTab === 'rejected' 
                ? 'bg-rose-800 text-white shadow-xs' 
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            अस्वीकृत ({rejectedCount})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="शीर्षक, लेखक, संदर्भ ID, या स्लग खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition cursor-pointer"
            >
              <option value="all">सभी श्रेणियाँ (All Categories)</option>
              <option value="साहित्य एवं विचार">साहित्य एवं विचार</option>
              <option value="इतिहास व पुरातत्व">इतिहास व पुरातत्व</option>
              <option value="भाषा व व्याकरण">भाषा व व्याकरण</option>
              <option value="लोक संस्कृति व परंपरा">लोक संस्कृति व परंपरा</option>
              <option value="लोकगीत व लोकगाथा विमर्श">लोकगीत व लोकगाथा विमर्श</option>
              <option value="समकालीन विमर्श">समकालीन विमर्श</option>
              <option value="पुस्तक समीक्षा">पुस्तक समीक्षा</option>
            </select>
          </div>
        </div>

      </div>

      {/* Blogs Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-600 font-serif font-bold text-sm">कोई ब्लॉग आलेख नहीं मिला</p>
            <p className="text-xs text-stone-400 font-serif mt-1">खोज शब्द अथवा फ़िल्टर बदलकर देखें।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-serif font-bold">
                  <th className="py-3.5 px-4">आलेख एवं विवरण</th>
                  <th className="py-3.5 px-4">लेखक / प्रस्तुतकर्ता</th>
                  <th className="py-3.5 px-4">श्रेणी व भाषा</th>
                  <th className="py-3.5 px-4">स्थिति (Status)</th>
                  <th className="py-3.5 px-4 text-right">कार्यवाही (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBlogs.map((blog) => {
                  const status = blog.status || 'published';
                  const slugOrId = blog.slug || blog.id;

                  return (
                    <tr key={blog.id} className="hover:bg-stone-50/80 transition">
                      
                      {/* Title & Preview */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <SafeImage 
                              src={blog.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=200'} 
                              alt={blog.title_hindi} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                              {blog.title_hindi || blog.title_english}
                            </h4>
                            <div className="flex items-center space-x-2 text-[10px] text-stone-400 font-mono mt-1">
                              <span>slug: /{blog.slug || blog.id}</span>
                              {blog.submission_ref && (
                                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-sm">
                                  Ref: {blog.submission_ref}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Author Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-serif font-bold text-stone-800">
                          {blog.author || blog.contributor_name || 'अज्ञात'}
                        </div>
                        <div className="text-[11px] text-stone-500 font-serif">
                          {blog.author_role || 'रचनाकार'}
                        </div>
                        {(blog.contributor_phone || blog.contributor_email) && (
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            {blog.contributor_phone || blog.contributor_email}
                          </div>
                        )}
                      </td>

                      {/* Category & Language */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-serif text-[11px]">
                          {blog.category || 'साहित्य'}
                        </span>
                        <div className="text-[10px] text-stone-400 font-mono uppercase mt-1">
                          {blog.language || 'hindi'} • {blog.read_time || '4 min'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {status === 'published' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-serif text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>प्रकाशित (Published)</span>
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-serif text-[11px] font-bold animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>समीक्षाधीन (Pending Review)</span>
                          </span>
                        )}
                        {status === 'approved' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full font-serif text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>स्वीकृत (Approved)</span>
                          </span>
                        )}
                        {status === 'draft' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-100 text-stone-600 border border-stone-200 rounded-full font-serif text-[11px]">
                            <span>ड्राफ्ट (Draft)</span>
                          </span>
                        )}
                        {status === 'rejected' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-serif text-[11px]">
                            <XCircle className="w-3 h-3" />
                            <span>अस्वीकृत (Rejected)</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          
                          {/* Publish / Unpublish Quick Button */}
                          {status === 'published' ? (
                            <button
                              onClick={() => handleQuickUnpublish(blog)}
                              className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition"
                              title="अप्रकाशित करें (Unpublish / Draft)"
                            >
                              ड्राफ्ट बनाएं
                            </button>
                          ) : (
                            <button
                              onClick={() => handleQuickPublish(blog)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                              title="प्रकाशित करें (Publish Now)"
                            >
                              <span>प्रकाशित करें</span>
                            </button>
                          )}

                          {/* If pending, show quick reject */}
                          {status === 'pending' && (
                            <button
                              onClick={() => handleOpenRejectModal(blog)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs transition"
                              title="अस्वीकृत करें (Reject)"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit / Review Button */}
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-red-950 border border-amber-200 rounded-lg text-xs transition"
                            title="संपादित / समीक्षा करें (Edit / Review)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* View on public site */}
                          <button
                            onClick={() => {
                              setActiveView('blog_detail', null, null, null, slugOrId);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition"
                            title="पब्लिक पेज पर देखें"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setItemToDelete(blog);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-700 rounded-lg text-xs transition"
                            title="हटाएं (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Complete Blog Editor Modal */}
      {isEditModalOpen && currentBlog && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-8 max-h-[92vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-950 to-stone-900 text-amber-50 flex items-center justify-between border-b border-amber-500/30">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  CMS Blog Editor & Review Panel
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                  {currentBlog.id?.startsWith('blog_sub_') ? 'सार्वजनिक सबमिशन समीक्षा व संपादन' : 'ब्लॉग आलेख संपादन'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Submission Information if submitted from public form */}
              {currentBlog.submission_ref && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-amber-900">
                      📄 सार्वजनिक सबमिशन विवरण (Public Submission Info)
                    </span>
                    <span className="font-mono text-xs font-bold text-red-950 bg-white px-2 py-0.5 rounded border border-amber-200">
                      Ref: {currentBlog.submission_ref}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-700">
                    <div><strong>प्रस्तुतकर्ता:</strong> {currentBlog.contributor_name || currentBlog.author}</div>
                    <div><strong>मोबाइल:</strong> {currentBlog.contributor_phone || 'N/A'}</div>
                    <div><strong>ईमेल:</strong> {currentBlog.contributor_email || 'N/A'}</div>
                  </div>
                </div>
              )}

              {/* Basic Fields */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-stone-900 border-b pb-1">
                  1. शीर्षक एवं सामग्री (Title & Content)
                </h4>

                {/* Title Hindi */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">आलेख का शीर्षक (Hindi Title) *</label>
                  <input
                    type="text"
                    required
                    value={currentBlog.title_hindi || ''}
                    onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, title_hindi: e.target.value }) : null)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-amber-600"
                    placeholder="उदा. पवारी लोकगीत एवं उनकी सांस्कृतिक महत्ता"
                  />
                </div>

                {/* Slug Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-800">कस्टम स्लग (Custom URL Slug) *</label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-red-950 hover:underline font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>शीर्षक से स्लग बनाएं (Auto-Generate)</span>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl text-stone-500 font-mono text-xs">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={currentBlog.slug || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, slug: e.target.value }) : null)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-r-xl font-mono text-xs focus:bg-white focus:outline-hidden focus:border-amber-600"
                      placeholder="pawari-lokgeet-sanskriti"
                    />
                  </div>
                </div>

                {/* Category, Language & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">श्रेणी (Category)</label>
                    <select
                      value={currentBlog.category || 'साहित्य एवं विचार'}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs cursor-pointer"
                    >
                      <option value="साहित्य एवं विचार">साहित्य एवं विचार</option>
                      <option value="इतिहास व पुरातत्व">इतिहास व पुरातत्व</option>
                      <option value="भाषा व व्याकरण">भाषा व व्याकरण</option>
                      <option value="लोक संस्कृति व परंपरा">लोक संस्कृति व परंपरा</option>
                      <option value="लोकगीत व लोकगाथा विमर्श">लोकगीत व लोकगाथा विमर्श</option>
                      <option value="समकालीन विमर्श">समकालीन विमर्श</option>
                      <option value="संस्मरण व व्यक्तित्व">संस्मरण व व्यक्तित्व</option>
                      <option value="पुस्तक समीक्षा">पुस्तक समीक्षा</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">भाषा (Language)</label>
                    <select
                      value={currentBlog.language || 'hindi'}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, language: e.target.value as any }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs cursor-pointer"
                    >
                      <option value="hindi">हिंदी (Hindi)</option>
                      <option value="pawari">पवारी (Pawari)</option>
                      <option value="english">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">पठन समय (Read Time)</label>
                    <input
                      type="text"
                      value={currentBlog.read_time || '4 मिनट'}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, read_time: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">संक्षिप्त सारांश (Excerpt)</label>
                  <textarea
                    rows={2}
                    value={currentBlog.excerpt_hindi || ''}
                    onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, excerpt_hindi: e.target.value }) : null)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    placeholder="आलेख का संक्षिप्त सारांश..."
                  />
                </div>

                {/* Full Blog Content */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    सम्पूर्ण आलेख सामग्री (Full Article Content) *
                    <span className="font-normal text-stone-500 ml-1">(मूल प्रारूप सुरक्षित रखा जाएगा)</span>
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={currentBlog.content_hindi || ''}
                    onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, content_hindi: e.target.value }) : null)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-serif leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-600"
                    placeholder="सम्पूर्ण आलेख सामग्री यहाँ दर्ज करें..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">टैग्स (Tags - अल्पविराम से अलग करें)</label>
                  <input
                    type="text"
                    value={currentBlog.tags ? currentBlog.tags.join(', ') : ''}
                    onChange={(e) => {
                      const tagsArr = e.target.value.split(/[,،]+/).map(t => t.trim()).filter(Boolean);
                      setCurrentBlog(prev => prev ? ({ ...prev, tags: tagsArr }) : null);
                    }}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    placeholder="पवारी संस्कृति, लोकगीत, इतिहास"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    कवर चित्र (Cover Image)
                    <span className="font-normal text-stone-500 ml-1">(वैकल्पिक - बिना चित्र के भी आलेख तुरंत सुरक्षित किया जा सकता है)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={currentBlog.cover_image || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, cover_image: e.target.value }) : null)}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                      placeholder="https://images.unsplash.com/... या नीचे से अपलोड करें"
                    />
                    <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-serif font-bold cursor-pointer shrink-0 flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'अपलोडिंग...' : 'फ़ाइल चुनें'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                  </div>

                  {uploadError && (
                    <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-700">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setUploadError(null)}
                        className="text-rose-500 hover:text-rose-800 font-bold px-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {currentBlog.cover_image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-stone-100 rounded-xl border border-stone-200">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        <img 
                          src={currentBlog.cover_image} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="text-[11px] text-stone-600 truncate flex-1 font-mono">
                        {currentBlog.cover_image.startsWith('data:') ? 'स्थानीय पूर्वावलोकन छवि (Base64)' : currentBlog.cover_image}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentBlog(prev => prev ? ({ ...prev, cover_image: '' }) : null)}
                        className="text-stone-400 hover:text-rose-600 p-1 text-xs font-bold"
                        title="चित्र हटाएं"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Author Information */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <h4 className="font-serif font-bold text-sm text-stone-900 border-b pb-1">
                  2. लेखक विवरण (Author Information)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">लेखक का नाम (Author Name)</label>
                    <input
                      type="text"
                      value={currentBlog.author || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, author: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">लेखक पद / उपाधि (Role)</label>
                    <input
                      type="text"
                      value={currentBlog.author_role || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, author_role: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">प्रकाशन तिथि (Date)</label>
                    <input
                      type="text"
                      value={currentBlog.date || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, date: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Metadata Management */}
              <div className="space-y-4 pt-4 border-t border-stone-200 bg-stone-50/70 p-4 rounded-2xl border">
                <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <SearchCode className="w-4 h-4 text-amber-700" />
                  <span>3. सर्च इंजन एवं सोशल मीडिया मेटाडाटा (SEO Metadata)</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Meta Title (सर्च इंजन शीर्षक)</label>
                    <input
                      type="text"
                      value={currentBlog.meta_title || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, meta_title: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                      placeholder="पवारी शोध पत्रिका ब्लॉग | आलेख शीर्षक"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Meta Description (सर्च इंजन विवरण - 150-160 वर्ण)</label>
                    <textarea
                      rows={2}
                      value={currentBlog.meta_description || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, meta_description: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                      placeholder="सर्च इंजन स्निपेट हेतु विवरण..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Meta Keywords (कीवर्ड्स)</label>
                    <input
                      type="text"
                      value={currentBlog.meta_keywords || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, meta_keywords: e.target.value }) : null)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs"
                      placeholder="Pawari blog, research, culture, MP"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Editorial Comments */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <h4 className="font-serif font-bold text-sm text-stone-900 border-b pb-1">
                  4. प्रकाशन स्थिति एवं संपादकीय समीक्षा (Status & Editorial Notes)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">प्रकाशन स्थिति (Status)</label>
                    <select
                      value={currentBlog.status || 'published'}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <option value="published">प्रकाशित करें (Published - Live on public blog)</option>
                      <option value="pending">समीक्षाधीन (Pending Review)</option>
                      <option value="approved">स्वीकृत (Approved - Ready to publish)</option>
                      <option value="draft">ड्राफ्ट (Draft)</option>
                      <option value="rejected">अस्वीकृत (Rejected)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">संपादकीय टिप्पणी (Editorial Comments for Review)</label>
                    <input
                      type="text"
                      value={currentBlog.editorial_comments || ''}
                      onChange={(e) => setCurrentBlog(prev => prev ? ({ ...prev, editorial_comments: e.target.value }) : null)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                      placeholder="समीक्षा व संशोधन संबंधी टिप्पणी..."
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                {saveStatus && (
                  <span className="text-emerald-700 font-serif font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveStatus}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-serif font-bold transition"
                >
                  रद्द करें
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBlog('draft')}
                  className="px-4 py-2 bg-stone-700 hover:bg-stone-800 text-white rounded-xl text-xs font-serif font-bold transition"
                >
                  ड्राफ्ट सहेजें
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBlog('published')}
                  className="px-6 py-2 bg-red-950 hover:bg-red-900 text-amber-200 rounded-xl text-xs font-serif font-bold transition shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>सहेजें एवं प्रकाशित करें</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && currentBlog && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-rose-700 font-serif font-bold text-base">
              <XCircle className="w-5 h-5" />
              <span>आलेख अस्वीकृत करें</span>
            </div>

            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              क्या आप <strong>"{currentBlog.title_hindi || currentBlog.title_english}"</strong> को अस्वीकृत करना चाहते हैं?
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                अस्वीकृति का कारण / संपादकीय टिप्पणी:
              </label>
              <textarea
                rows={3}
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-hidden focus:border-rose-500"
                placeholder="उदा. आलेख में मौलिकता का अभाव है अथवा विषय पत्रिका के क्षेत्र से बाहर है।"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-serif font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-serif font-bold transition shadow-xs"
              >
                अस्वीकृत करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-red-700 font-serif font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>ब्लॉग आलेख हटाएं</span>
            </div>

            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              क्या आप निश्चित रूप से <strong>"{itemToDelete.title_hindi || itemToDelete.title_english}"</strong> को हटाना चाहते हैं? यह क्रिया स्थायी है।
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-serif font-bold"
              >
                रद्द करें
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-serif font-bold transition shadow-xs"
              >
                स्थायी रूप से हटाएं
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
