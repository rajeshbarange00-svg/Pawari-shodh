import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { BlogItem } from '../../data/booksBlogsData';
import { getUrlForView } from '../../lib/router';
import { 
  PenTool, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  BookOpen, 
  Image as ImageIcon, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Tag, 
  Sparkles, 
  Upload,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const BlogSubmissionView: React.FC = () => {
  const { submitPublicBlog, uploadFileToStorage, setActiveView, lang } = useCms();

  // Form State
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('साहित्य एवं विचार');
  const [language, setLanguage] = useState<'hindi' | 'pawari' | 'english'>('hindi');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('पवारी संस्कृति, साहित्य');
  const [consent, setConsent] = useState(false);

  // Status & UI State
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ refId: string } | null>(null);

  const categoriesList = [
    'साहित्य एवं विचार',
    'इतिहास व पुरातत्व',
    'भाषा व व्याकरण',
    'लोक संस्कृति व परंपरा',
    'लोकगीत व लोकगाथा विमर्श',
    'समकालीन विमर्श',
    'संस्मरण व व्यक्तित्व',
    'पुस्तक समीक्षा'
  ];

  // Handle Cover Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('चित्र का आकार 5MB से कम होना चाहिए।');
      return;
    }

    setUploadingImage(true);
    try {
      const res = await uploadFileToStorage(file, 'blog_covers');
      if (res?.url) {
        setCoverImageUrl(res.url);
      }
    } catch (err: any) {
      console.warn('Image upload fallback:', err);
      // Fallback: Read as data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!title.trim()) {
      setErrorMsg('कृपया आलेख का शीर्षक (Title) दर्ज करें।');
      return;
    }
    if (!authorName.trim()) {
      setErrorMsg('कृपया लेखक का नाम (Author Name) दर्ज करें।');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMsg('कृपया संपर्क हेतु अपना मोबाइल नंबर या ईमेल अवश्य दर्ज करें।');
      return;
    }
    if (!content.trim() || content.trim().length < 80) {
      setErrorMsg('कृपया संपूर्ण आलेख सामग्री (कम से कम 80 शब्द/अक्षर) दर्ज करें।');
      return;
    }
    if (!consent) {
      setErrorMsg('कृपया मौलिकता एवं संपादकीय समीक्षा संबंधी सहमति बॉक्स को चेक करें।');
      return;
    }

    setSubmitting(true);

    try {
      const parsedTags = tagsInput
        .split(/[,،]+/)
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const blogData: Partial<BlogItem> = {
        title_hindi: title.trim(),
        title_english: title.trim(),
        author: authorName.trim(),
        author_role: authorRole.trim() || 'रचनाकार / शोधार्थी',
        contributor_name: authorName.trim(),
        contributor_phone: phone.trim(),
        contributor_email: email.trim(),
        category,
        language,
        excerpt_hindi: excerpt.trim() || (content.slice(0, 180) + '...'),
        excerpt_english: '',
        content_hindi: content.trim(),
        content_english: content.trim(),
        cover_image: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
        tags: parsedTags.length > 0 ? parsedTags : ['पवारी', category],
        consent_given: true,
        status: 'pending' // STRICT: Non-published, pending editorial review
      };

      const result = await submitPublicBlog(blogData);

      if (result.success) {
        setSubmissionSuccess({ refId: result.refId });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(result.error || 'सबमिशन असफल रहा। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg('आलेख भेजने में त्रुटि आई। कृपया अपना इंटरनेट कनेक्शन जांचें।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setAuthorName('');
    setAuthorRole('');
    setPhone('');
    setEmail('');
    setExcerpt('');
    setContent('');
    setCoverImageUrl('');
    setConsent(false);
    setSubmissionSuccess(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-red-950 via-stone-900 to-red-950 text-amber-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-amber-300/80 mb-4 font-serif">
            <button 
              onClick={() => setActiveView('home')}
              className="hover:text-amber-200 transition"
            >
              {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
            <button 
              onClick={() => setActiveView('blog_list')}
              className="hover:text-amber-200 transition"
            >
              {lang === 'hi' ? 'ब्लॉग' : 'Blog'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-amber-500/60" />
            <span className="text-amber-100 font-medium">
              {lang === 'hi' ? 'आलेख प्रस्तुति' : 'Submit Blog'}
            </span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-serif font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 mb-3">
                <PenTool className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सार्वजनिक आलेख आमंत्रण' : 'Public Article Submission'}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                {lang === 'hi' ? 'पवारी शोध ब्लॉग हेतु आलेख प्रस्तुत करें' : 'Submit an Article for Pawari Blog'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 font-serif max-w-2xl mt-2 leading-relaxed">
                {lang === 'hi'
                  ? 'पवारी भाषा, साहित्य, इतिहास, लोक परंपरा एवं समाज पर अपनी मौलिक रचना अथवा शोध आलेख भेजें। संपादकीय समीक्षा एवं अनुमोदन के उपरांत आपका आलेख पत्रिका के आधिकारिक ब्लॉग पर प्रकाशित होगा।'
                  : 'Submit your scholarly essay or cultural narrative. All submissions undergo editorial review before publishing on the public blog.'}
              </p>
            </div>

            <button
              onClick={() => setActiveView('blog_list')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              ← {lang === 'hi' ? 'ब्लॉग सूची देखें' : 'View Blogs'}
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

        {/* Success Confirmation Card */}
        {submissionSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-serif font-bold rounded-full">
              {lang === 'hi' ? 'समीक्षा हेतु सफलतापूर्वक दर्ज' : 'Submission Received'}
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-3 mb-2">
              {lang === 'hi' ? 'आपका आलेख सफलतापूर्वक प्राप्त हो गया है!' : 'Thank you for your submission!'}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 font-serif max-w-lg mx-auto leading-relaxed mb-6">
              {lang === 'hi'
                ? 'आपकी रचना संपादकीय मंडल की समीक्षा सूची में सुरक्षित रूप से दर्ज कर ली गई है। गुणवत्ता एवं प्रमाणिकता की जांच के बाद इसे सार्वजनिक ब्लॉग पर प्रकाशित कर दिया जाएगा।'
                : 'Your post has been submitted for editorial review. Once reviewed and approved by the editorial team, it will appear on the public blog.'}
            </p>

            {/* Reference Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 max-w-md mx-auto mb-8">
              <span className="text-[11px] text-stone-500 font-mono block uppercase">
                {lang === 'hi' ? 'सबमिशन संदर्भ संख्या (Reference ID)' : 'Submission Reference ID'}
              </span>
              <code className="text-lg font-mono font-bold text-red-950 select-all block mt-1">
                {submissionSuccess.refId}
              </code>
              <span className="text-[11px] text-stone-500 font-serif mt-2 block">
                {lang === 'hi' ? 'स्थिति: ' : 'Status: '}
                <strong className="text-amber-700">समीक्षाधीन (Under Review)</strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-serif font-bold transition"
              >
                + {lang === 'hi' ? 'एक और आलेख भेजें' : 'Submit Another Post'}
              </button>
              <button
                onClick={() => setActiveView('blog_list')}
                className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-200 rounded-xl text-xs font-serif font-bold transition shadow-sm"
              >
                {lang === 'hi' ? 'प्रकाशित ब्लॉग देखें →' : 'Explore Published Blogs →'}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-lg space-y-8"
          >
            
            {/* Guidance Notice */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 font-serif leading-relaxed">
                <p className="font-bold text-amber-900 mb-1">
                  {lang === 'hi' ? 'महत्वपूर्ण दिशानिर्देश (Submission Guidelines):' : 'Important Note for Authors:'}
                </p>
                <ul className="list-disc ml-4 space-y-1 text-amber-900/90">
                  <li>सभी प्रस्तुतियां <strong>संपादक समीक्षा</strong> के बाद ही स्वीकृत व प्रकाशित की जाती हैं (स्वतः प्रकाशन नहीं होता)।</li>
                  <li>कृपया पवारी भाषा, संस्कृति, साहित्य, समाज व लोक विमर्श से संबंधित सामग्री ही प्रेषित करें।</li>
                  <li>मौलिकता एवं शोधपरक दृष्टिकोण को प्राथमिकता दी जाती है।</li>
                </ul>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-serif flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Article Basic Details */}
            <div className="space-y-4">
              <h3 className="text-base font-serif font-bold text-stone-900 pb-2 border-b border-stone-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-950" />
                <span>1. {lang === 'hi' ? 'आलेख विवरण (Article Information)' : 'Article Information'}</span>
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                  {lang === 'hi' ? 'आलेख का शीर्षक (Title) *' : 'Article Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'hi' ? 'उदा. पवारी लोकगीतों में प्रकृति एवं मानवीय संवेदना' : 'Enter a descriptive title...'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>

              {/* Category & Language Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'विषय श्रेणी (Category) *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition cursor-pointer"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'भाषा (Language) *' : 'Language *'}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition cursor-pointer"
                  >
                    <option value="hindi">हिंदी (Hindi)</option>
                    <option value="pawari">पवारी (Pawari)</option>
                    <option value="english">English</option>
                  </select>
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                  {lang === 'hi' ? 'संक्षिप्त सारांश (Short Excerpt / Summary)' : 'Short Excerpt / Summary'}
                  <span className="text-stone-500 font-normal text-[11px] ml-1">({lang === 'hi' ? '2-3 पंक्तियों में' : '2-3 sentences'})</span>
                </label>
                <textarea
                  rows={2}
                  placeholder={lang === 'hi' ? 'आलेख का सार संक्षेप यहाँ लिखें...' : 'Brief summary of the article...'}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                  {lang === 'hi' ? 'सम्पूर्ण आलेख सामग्री (Full Article Content) *' : 'Full Content *'}
                  <span className="text-stone-500 font-normal text-[11px] ml-1">({lang === 'hi' ? 'अनुच्छेद एवं प्रारूप सुरक्षित रखे जाएंगे' : 'Original formatting & paragraphs preserved'})</span>
                </label>
                <textarea
                  rows={12}
                  required
                  placeholder={lang === 'hi' ? 'अपना संपूर्ण आलेख यहाँ लिखें या कॉपी-पेस्ट करें।\n\nअनुच्छेदों के बीच खाली पंक्ति छोड़ें।\nउप-शीर्षकों के लिए ## या ### का प्रयोग कर सकते हैं।' : 'Write or paste your full blog post here...'}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm font-serif leading-relaxed focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                />
                <div className="flex justify-between items-center text-[11px] text-stone-500 font-mono mt-1 px-1">
                  <span>{content.trim() ? content.trim().split(/\s+/).length : 0} {lang === 'hi' ? 'शब्द' : 'words'}</span>
                  <span>{Math.max(1, Math.ceil((content.trim().split(/\s+/).length || 0) / 180))} {lang === 'hi' ? 'मिनट पठन अनुमान' : 'min read estimate'}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                  {lang === 'hi' ? 'टैग्स / कीवर्ड्स (Tags)' : 'Tags / Keywords'}
                  <span className="text-stone-500 font-normal text-[11px] ml-1">({lang === 'hi' ? 'अल्पविराम से अलग करें' : 'comma separated'})</span>
                </label>
                <input
                  type="text"
                  placeholder="पवारी संस्कृति, लोकगीत, इतिहास, शोध"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                />
              </div>

              {/* Optional Cover Image */}
              <div>
                <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                  {lang === 'hi' ? 'आलेख का मुख्य चित्र (Cover Image - Optional)' : 'Cover Image (Optional)'}
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-8">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (Image URL)"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-serif font-medium border border-stone-300 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'अपलोड हो रहा है...' : 'डिवाइस से चुनें'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {coverImageUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-2xs">
                    <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl('')}
                      className="absolute top-1 right-1 bg-red-950/80 text-white rounded-full p-0.5 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Section 2: Author & Contact Details */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-900 pb-2 border-b border-stone-200 flex items-center gap-2">
                <User className="w-4 h-4 text-red-950" />
                <span>2. {lang === 'hi' ? 'लेखक एवं संपर्क विवरण (Author Details)' : 'Author Details'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Author Name */}
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'लेखक का नाम (Author Name) *' : 'Author Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'hi' ? 'उदा. डॉ. रमेश कुमार पटले' : 'Full Name'}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                  />
                </div>

                {/* Author Role */}
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'पद / परिचय (Designation / Affiliation)' : 'Designation / Role'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'उदा. सहायक प्राध्यापक / स्वतंत्र शोधार्थी' : 'e.g. Research Scholar, Author'}
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'मोबाइल नंबर (Mobile / WhatsApp)' : 'Mobile Phone'}
                  </label>
                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-serif font-bold text-stone-800 mb-1.5">
                    {lang === 'hi' ? 'ईमेल पता (Email Address)' : 'Email'}
                  </label>
                  <input
                    type="email"
                    placeholder="author@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:border-amber-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Declaration & Consent */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-base font-serif font-bold text-stone-900 pb-2 border-b border-stone-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-950" />
                <span>3. {lang === 'hi' ? 'मौलिकता एवं समीक्षा सहमति (Consent Declaration)' : 'Consent'}</span>
              </h3>

              <label className="flex items-start space-x-3 p-4 bg-stone-50 border border-stone-300 rounded-2xl cursor-pointer hover:bg-stone-100 transition">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 text-red-950 border-stone-300 rounded-sm focus:ring-amber-500"
                />
                <span className="text-xs text-stone-700 font-serif leading-relaxed">
                  {lang === 'hi'
                    ? 'मैं प्रमाणित करता/करती हूँ कि यह मेरी मौलिक रचना है एवं इसमें किसी अन्य कृति का अनधिकृत अंश सम्मिलित नहीं है। मैं पवारी शोध पत्रिका के संपादकीय नियमों, समीक्षा प्रक्रिया एवं डिजिटल प्रकाशन की शर्तों से पूर्णतः सहमत हूँ।'
                    : 'I declare that this is my original writing, and I agree to the editorial peer-review and publication terms of Pawari Shodh Patrika.'}
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
              <span className="text-xs text-stone-500 font-serif">
                * {lang === 'hi' ? 'चिह्नित फ़ील्ड अनिवार्य हैं।' : 'marked fields are required.'}
              </span>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('blog_list')}
                  className="flex-1 sm:flex-none px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-serif font-bold transition"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-7 py-3 bg-gradient-to-r from-red-950 to-stone-900 hover:from-red-900 hover:to-stone-800 text-amber-200 rounded-xl text-xs sm:text-sm font-serif font-bold transition shadow-md hover:shadow-lg border border-amber-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? (lang === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...') : (lang === 'hi' ? 'समीक्षा हेतु प्रेषित करें' : 'Submit for Review')}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </main>

    </div>
  );
};
