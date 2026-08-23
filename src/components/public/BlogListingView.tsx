import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { BlogItem, SAMPLE_BLOGS } from '../../data/booksBlogsData';
import { getUrlForView } from '../../lib/router';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  PenTool, 
  Filter, 
  Eye, 
  Share2, 
  Check, 
  ChevronRight,
  Globe,
  Layers,
  BookMarked
} from 'lucide-react';

export const BlogListingView: React.FC = () => {
  const { blogs, setActiveView, lang } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine blogs from context with sample fallback if empty, only showing published blogs
  const allBlogs = (blogs && blogs.length > 0) ? blogs : SAMPLE_BLOGS;
  
  // Public blog listing displays published or approved posts
  const publishedBlogs = useMemo(() => {
    return allBlogs.filter(b => b.status === 'published' || b.status === 'approved' || (!b.status && !b.id.startsWith('pub_')));
  }, [allBlogs]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedBlogs.forEach(b => {
      if (b.category) cats.add(b.category);
    });
    return Array.from(cats);
  }, [publishedBlogs]);

  // Filtered list
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const matchQ = !q || 
        (b.title_hindi && b.title_hindi.toLowerCase().includes(q)) ||
        (b.title_english && b.title_english.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.excerpt_hindi && b.excerpt_hindi.toLowerCase().includes(q)) ||
        (b.content_hindi && b.content_hindi.toLowerCase().includes(q)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));

      const matchCat = selectedCategory === 'all' || b.category === selectedCategory;
      const matchLang = selectedLanguage === 'all' || (b.language || 'hindi') === selectedLanguage;

      return matchQ && matchCat && matchLang;
    });
  }, [publishedBlogs, searchQuery, selectedCategory, selectedLanguage]);

  // Featured post (latest or highest priority)
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularBlogs = filteredBlogs.length > 0 ? filteredBlogs.slice(1) : [];

  const handleOpenBlog = (blog: BlogItem) => {
    const slugOrId = blog.slug || blog.id;
    setActiveView('blog_detail', null, null, null, slugOrId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (e: React.MouseEvent, blog: BlogItem) => {
    e.stopPropagation();
    const slugOrId = blog.slug || blog.id;
    const url = `${window.location.origin}/blog/${slugOrId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(blog.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16">
      
      {/* Hero Header Section */}
      <section className="relative bg-gradient-to-b from-red-950 via-stone-900 to-red-950 text-amber-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 overflow-hidden">
        {/* Subtle background ornamentation */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-amber-300/80 mb-4 font-serif">
            <button 
              onClick={() => setActiveView('home')}
              className="hover:text-amber-200 transition underline underline-offset-2"
            >
              {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
            <span className="text-amber-100 font-medium">
              {lang === 'hi' ? 'ब्लॉग एवं विचार मंच' : 'Blogs & Research Articles'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider mb-3">
                <BookMarked className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सार्वजनिक विचार एवं शोध आलेख' : 'Scholarly Thought & Culture'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {lang === 'hi' ? 'पवारी शोध एवं विचार ब्लॉग' : 'Pawari Research & Culture Blog'}
              </h1>
              <p className="text-sm sm:text-base text-stone-300 max-w-2xl mt-3 font-serif leading-relaxed">
                {lang === 'hi' 
                  ? 'पवारी भाषा, इतिहास, लोक परंपरा, समाज एवं साहित्य पर शोधार्थियों व लेखकों के समकालीन आलेख, आख्यान एवं विचार।' 
                  : 'Contemporary essays, folklore studies, and literary narratives on Pawari culture, linguistic heritage, and oral traditions.'}
              </p>
            </div>

            {/* Submission CTA Button */}
            <div className="shrink-0 flex flex-wrap items-center gap-3">
              <a
                href={getUrlForView('submit_blog')}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey) {
                    e.preventDefault();
                    setActiveView('submit_blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-serif font-bold text-xs sm:text-sm transition shadow-lg hover:shadow-amber-500/25 border border-amber-400 cursor-pointer"
              >
                <PenTool className="w-4 h-4" />
                <span>{lang === 'hi' ? '✍️ अपना आलेख भेजें' : 'Submit Your Article'}</span>
              </a>
            </div>
          </div>

          {/* Quick Search & Filters Bar */}
          <div className="mt-8 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Search Input */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-stone-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'शीर्षक, लेखक, विषय या कीवर्ड खोजें...' : 'Search by title, author, topic, keyword...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition cursor-pointer"
                >
                  <option value="all">{lang === 'hi' ? 'सभी श्रेणियाँ (All Categories)' : 'All Categories'}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-900/80 border border-stone-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition cursor-pointer"
                >
                  <option value="all">{lang === 'hi' ? 'सभी भाषाएं (All Languages)' : 'All Languages'}</option>
                  <option value="hindi">हिंदी (Hindi)</option>
                  <option value="pawari">पवारी (Pawari)</option>
                  <option value="english">English</option>
                </select>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Results Counter & Active Filters Display */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-stone-200 text-xs sm:text-sm text-stone-600 font-serif">
          <div>
            <span>{lang === 'hi' ? 'कुल प्रकाशित आलेख:' : 'Published Articles:'}</span>{' '}
            <strong className="text-stone-900 font-sans">{filteredBlogs.length}</strong>
            {selectedCategory !== 'all' && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-sans text-xs">
                {selectedCategory}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-500 text-xs">{lang === 'hi' ? 'समीक्षित एवं स्वीकृत' : 'Peer-Reviewed & Approved'}</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 shadow-xs max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-1">
              {lang === 'hi' ? 'कोई आलेख नहीं मिला' : 'No articles found'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mb-4 font-serif">
              {lang === 'hi' ? 'कृपया अपनी खोज या फ़िल्टर बदलकर पुनः प्रयास करें।' : 'Try modifying your search query or filters.'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedLanguage('all'); }}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition cursor-pointer"
            >
              {lang === 'hi' ? 'फ़िल्टर हटाएं (Reset Filters)' : 'Reset Filters'}
            </button>
          </div>
        )}

        {/* Featured Post Card (if available and no deep search query active) */}
        {featuredBlog && !searchQuery && selectedCategory === 'all' && (
          <div className="mb-10">
            <div className="text-xs font-serif font-bold uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'प्रमुख आलेख / Featured Story' : 'Featured Story'}</span>
            </div>

            <div 
              onClick={() => handleOpenBlog(featuredBlog)}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Cover Image */}
              <div className="lg:col-span-5 relative bg-stone-100 min-h-[220px] lg:min-h-[320px] overflow-hidden">
                <SafeImage
                  src={featuredBlog.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800'}
                  alt={featuredBlog.title_hindi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-red-950/90 backdrop-blur-xs text-amber-300 text-[11px] font-serif font-bold rounded-lg shadow-md border border-amber-400/30">
                    {featuredBlog.category || 'साहित्य'}
                  </span>
                </div>
              </div>

              {/* Text Meta Content */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-4 text-xs text-stone-500 mb-3 font-serif">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{featuredBlog.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{featuredBlog.read_time || '5 मिनट'}</span>
                    </span>
                    {featuredBlog.language && (
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md font-sans uppercase text-[10px] font-semibold">
                        {featuredBlog.language}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 group-hover:text-red-950 transition leading-snug">
                    {featuredBlog.title_hindi || featuredBlog.title_english}
                  </h2>

                  <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed mt-3 line-clamp-3">
                    {featuredBlog.excerpt_hindi || (featuredBlog.content_hindi ? featuredBlog.content_hindi.slice(0, 180) + '...' : '')}
                  </p>

                  {/* Tags */}
                  {featuredBlog.tags && featuredBlog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {featuredBlog.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[11px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-5 mt-6 border-t border-stone-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-900 text-amber-200 font-serif font-bold flex items-center justify-center text-xs shrink-0">
                      {featuredBlog.author ? featuredBlog.author[0] : 'ल'}
                    </div>
                    <div>
                      <p className="text-xs font-serif font-bold text-stone-900 leading-tight">
                        {featuredBlog.author || 'संपादक मंडल'}
                      </p>
                      <p className="text-[10px] text-stone-500 font-serif">
                        {featuredBlog.author_role || 'रचनाकार / शोधार्थी'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleShare(e, featuredBlog)}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                      title={copiedId === featuredBlog.id ? 'लिंक कॉपी हो गया!' : 'शेयर करें'}
                    >
                      {copiedId === featuredBlog.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                    <span className="inline-flex items-center space-x-1 text-xs font-serif font-bold text-red-950 group-hover:text-red-800">
                      <span>{lang === 'hi' ? 'पूरा आलेख पढ़ें' : 'Read Article'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery || selectedCategory !== 'all' ? filteredBlogs : regularBlogs).map((blog) => {
            const slugOrId = blog.slug || blog.id;
            const href = getUrlForView('blog_detail', null, null, null, slugOrId);

            return (
              <article
                key={blog.id}
                onClick={() => handleOpenBlog(blog)}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group hover:-translate-y-0.5"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                    <SafeImage
                      src={blog.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
                      alt={blog.title_hindi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[10px] font-serif font-bold rounded-md shadow-xs">
                        {blog.category || 'साहित्य'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Metadata Header */}
                    <div className="flex items-center space-x-3 text-[11px] text-stone-500 mb-2.5 font-serif">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{blog.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{blog.read_time || '4 मिनट'}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-red-950 transition leading-snug line-clamp-2">
                      {blog.title_hindi || blog.title_english}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-stone-600 font-serif leading-relaxed mt-2 line-clamp-3">
                      {blog.excerpt_hindi || (blog.content_hindi ? blog.content_hindi.slice(0, 140) + '...' : '')}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {blog.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 mt-2">
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-red-950 font-serif font-bold flex items-center justify-center text-[10px] shrink-0 border border-amber-300">
                        {blog.author ? blog.author[0] : 'ल'}
                      </div>
                      <span className="font-serif font-medium text-stone-800 text-[11px] truncate">
                        {blog.author || 'अज्ञात'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={(e) => handleShare(e, blog)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition"
                        title={copiedId === blog.id ? 'लिंक कॉपी हो गया!' : 'शेयर करें'}
                      >
                        {copiedId === blog.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={href}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            handleOpenBlog(blog);
                          }
                        }}
                        className="font-serif font-bold text-red-950 hover:text-red-800 text-[11px] flex items-center space-x-1"
                      >
                        <span>पढ़ें</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

        {/* Public Submission Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950 via-stone-900 to-red-950 text-white border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest block mb-1">
              {lang === 'hi' ? 'पाठक एवं रचनाकार संवाद' : 'Contributor Invitation'}
            </span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              {lang === 'hi' ? 'क्या आप पवारी भाषा एवं संस्कृति पर लिखना चाहते हैं?' : 'Would you like to write on Pawari language & heritage?'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-serif">
              {lang === 'hi' 
                ? 'अपने शोध लेख, संस्मरण, लोकगाथा या वैचारिक आलेख हमें भेजें। संपादक मंडल द्वारा समीक्षा के बाद इसे पत्रिका के ब्लॉग पर प्रकाशित किया जाएगा।'
                : 'Submit your cultural essays or field research. Following editorial review, approved pieces are featured on the public blog.'}
            </p>
          </div>

          <a
            href={getUrlForView('submit_blog')}
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setActiveView('submit_blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="shrink-0 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-serif font-bold text-xs sm:text-sm transition shadow-md flex items-center space-x-2"
          >
            <PenTool className="w-4 h-4" />
            <span>{lang === 'hi' ? 'ब्लॉग आलेख प्रस्तुत करें' : 'Submit a Blog Post'}</span>
          </a>
        </div>

      </main>

    </div>
  );
};
