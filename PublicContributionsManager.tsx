import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariShabdkoshItem, PawariPaheliItem, PawariLokgeetItem } from '../../types';
import { BookItem, BlogItem } from '../../data/booksBlogsData';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  Edit3, 
  BookOpen, 
  HelpCircle, 
  Music,
  FileText,
  BookMarked,
  Filter,
  X,
  Save,
  Tag,
  FileCode
} from 'lucide-react';

export const PublicContributionsManager: React.FC = () => {
  const { 
    shabdkoshList, 
    paheliList, 
    lokgeetList, 
    blogs, 
    books, 
    submissions,
    updateContributionStatus, 
    saveShabdkosh,
    deleteShabdkosh, 
    savePaheli,
    deletePaheli, 
    saveLokgeet,
    deleteLokgeet,
    saveBlog,
    deleteBlog,
    saveBook,
    deleteBook,
    saveSubmission,
    deleteSubmission
  } = useCms();

  type TabType = 'shabdkosh' | 'paheli' | 'lokgeet' | 'blogs' | 'books' | 'submissions';

  const [activeTab, setActiveTab] = useState<TabType>('shabdkosh');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing Modal State
  const [editingItem, setEditingItem] = useState<{ type: TabType; item: any } | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Pending Counts
  const pendingCount = {
    shabdkosh: shabdkoshList.filter(i => i.status === 'pending').length,
    paheli: paheliList.filter(i => i.status === 'pending').length,
    lokgeet: lokgeetList.filter(i => i.status === 'pending').length,
    blogs: blogs.filter(b => b.status === 'pending').length,
    books: books.filter(b => b.status === 'pending').length,
    submissions: submissions.filter(s => s.status === 'pending').length
  };

  const totalPending = Object.values(pendingCount).reduce((a, b) => a + b, 0);

  // Collect all items for active tab
  const getItems = () => {
    if (activeTab === 'shabdkosh') return shabdkoshList;
    if (activeTab === 'paheli') return paheliList;
    if (activeTab === 'lokgeet') return lokgeetList;
    if (activeTab === 'blogs') return blogs;
    if (activeTab === 'books') return books;
    return submissions.map(s => ({
      ...s,
      title_pawari: s.title_hindi || s.title,
      contributor_name: s.author_name,
      status: s.status === 'accepted' ? 'approved' : s.status === 'rejected' ? 'rejected' : 'pending'
    }));
  };

  const rawItems = getItems();

  const filteredItems = rawItems.filter((item: any) => {
    const itemStatus = item.status || (item.id?.startsWith('contrib_') || item.id?.startsWith('pub_') ? 'pending' : 'approved');
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;

    const itemTitle = item.word_pawari || item.riddle_pawari || item.title_pawari || item.title_hindi || item.title || item.authors || '';
    const itemContributor = item.contributor_name || item.author || item.author_name || item.authors || '';
    const matchesSearch = 
      itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemContributor.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: 'approved' | 'pending' | 'rejected') => {
    await updateContributionStatus(activeTab, id, status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप इस प्रविष्टि को स्थायी रूप से हटाना चाहते हैं?')) {
      if (activeTab === 'shabdkosh') await deleteShabdkosh(id);
      else if (activeTab === 'paheli') await deletePaheli(id);
      else if (activeTab === 'lokgeet') await deleteLokgeet(id);
      else if (activeTab === 'blogs') await deleteBlog(id);
      else if (activeTab === 'books') await deleteBook(id);
      else if (activeTab === 'submissions') await deleteSubmission(id);
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem({ type: activeTab, item });
    setEditFormData({ ...item });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const type = editingItem.type;
    const updated = { ...editFormData };

    if (type === 'shabdkosh') {
      await saveShabdkosh(updated as PawariShabdkoshItem);
    } else if (type === 'paheli') {
      await savePaheli(updated as PawariPaheliItem);
    } else if (type === 'lokgeet') {
      await saveLokgeet(updated as PawariLokgeetItem);
    } else if (type === 'blogs') {
      await saveBlog(updated as BlogItem);
    } else if (type === 'books') {
      await saveBook(updated as BookItem);
    } else if (type === 'submissions') {
      await saveSubmission(updated);
    }

    setEditingItem(null);
    alert('प्रविष्टि सफलतापूर्वक अद्यतन (Save) कर दी गई है!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Users className="w-5 h-5" />
            <h3 className="text-xl font-bold font-serif text-amber-200">
              जन-सामान्‍य एवं पाठक योगदान प्रबंधन (CMS Submissions & Final Approval)
            </h3>
          </div>
          <p className="text-amber-200/80 text-sm">
            पाठकों द्वारा प्रेषित शब्द, पहेली, लोकगीत, ब्लॉग, पुस्तक एवं शोध प्रस्तावों की समीक्षा, सम्पादन (Edit) एवं अंतिम स्वीकृति (Final Approval) प्रदान करें।
          </p>
        </div>

        {/* Pending Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            कुल लंबित प्रविष्टियाँ: {totalPending}
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2.5 border-b border-amber-900/40 pb-3">
        <button
          onClick={() => setActiveTab('shabdkosh')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'shabdkosh'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>शब्दकोश ({shabdkoshList.length})</span>
          {pendingCount.shabdkosh > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.shabdkosh}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('paheli')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'paheli'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>पहेलियाँ ({paheliList.length})</span>
          {pendingCount.paheli > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.paheli}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lokgeet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'lokgeet'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>लोकगीत ({lokgeetList.length})</span>
          {pendingCount.lokgeet > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.lokgeet}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'blogs'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ब्लॉग ({blogs.length})</span>
          {pendingCount.blogs > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.blogs}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'books'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>पुस्तकें एवं समीक्षाएं ({books.length})</span>
          {pendingCount.books > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.books}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-amber-500 text-amber-950 shadow-lg scale-[1.02]'
              : 'bg-slate-900 text-amber-200 hover:bg-slate-800 border border-amber-900/30'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>शोध पांडुलिपि ({submissions.length})</span>
          {pendingCount.submissions > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-700">
              {pendingCount.submissions}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="योगदानकर्ता, लेखक या शीर्षक खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-amber-400/60 flex-shrink-0" />
          {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st 
                  ? 'bg-amber-500 text-amber-950 font-bold' 
                  : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? 'सभी प्रविष्टियाँ' : st === 'pending' ? 'लंबित (Pending Approval)' : st === 'approved' ? 'स्वीकृत (Approved)' : 'अस्वीकृत (Rejected)'}
            </button>
          ))}
        </div>
      </div>

      {/* Items Listing */}
      <div className="space-y-4">
        {filteredItems.map((item: any) => {
          const itemStatus = item.status || (item.id?.startsWith('contrib_') || item.id?.startsWith('pub_') ? 'pending' : 'approved');

          return (
            <div 
              key={item.id}
              className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                    {item.category || 'सामान्य'}
                  </span>

                  {itemStatus === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> स्वीकृत एवं लाइव (Approved)
                    </span>
                  )}
                  {itemStatus === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700 animate-pulse">
                      <Clock className="w-3 h-3" /> CMS समीक्षा हेतु लंबित (Pending Final Approval)
                    </span>
                  )}
                  {itemStatus === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-700">
                      <XCircle className="w-3 h-3" /> अस्वीकृत (Rejected)
                    </span>
                  )}
                </div>

                {/* Shabdkosh Item */}
                {activeTab === 'shabdkosh' && (
                  <div>
                    <h4 className="text-xl font-bold text-amber-200 font-serif">
                      {item.word_pawari} {item.pronunciation_hindi && <span className="text-xs text-amber-400/80 font-sans font-normal">[{item.pronunciation_hindi}]</span>}
                    </h4>
                    <p className="text-sm text-amber-100 font-medium mt-1">
                      <span className="text-amber-400 text-xs">हिंदी अर्थ:</span> {item.meaning_hindi}
                    </p>
                    {item.example_pawari && (
                      <p className="text-xs text-amber-300/80 italic mt-1 bg-amber-950/30 p-2 rounded-lg border border-amber-900/20">
                        वाक्य प्रयोग: "{item.example_pawari}"
                      </p>
                    )}
                  </div>
                )}

                {/* Paheli Item */}
                {activeTab === 'paheli' && (
                  <div>
                    <h4 className="text-base font-bold text-amber-200 font-serif leading-relaxed">
                      "{item.riddle_pawari}"
                    </h4>
                    <p className="text-sm text-emerald-300 font-bold mt-1">
                      उत्तर: {item.answer_hindi} {item.answer_pawari && `(${item.answer_pawari})`}
                    </p>
                    {item.hint_hindi && (
                      <p className="text-xs text-amber-400/70 mt-0.5">संकेत: {item.hint_hindi}</p>
                    )}
                  </div>
                )}

                {/* Lokgeet Item */}
                {activeTab === 'lokgeet' && (
                  <div>
                    <h4 className="text-lg font-bold text-amber-200 font-serif">
                      {item.title_pawari}
                    </h4>
                    <p className="text-xs text-amber-300/80 font-serif line-clamp-2 mt-1 whitespace-pre-line bg-amber-950/30 p-2 rounded-lg border border-amber-900/20">
                      {item.lyrics_pawari}
                    </p>
                  </div>
                )}

                {/* Blog Item */}
                {activeTab === 'blogs' && (
                  <div>
                    <h4 className="text-lg font-bold text-amber-200 font-serif">
                      {item.title_hindi}
                    </h4>
                    <p className="text-xs text-amber-300/80 line-clamp-2 mt-1 bg-amber-950/30 p-2 rounded-lg border border-amber-900/20">
                      {item.excerpt_hindi || item.content_hindi?.slice(0, 150)}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-amber-400/60 mt-1">
                      <span>लेखक: <strong className="text-amber-300">{item.author || item.contributor_name}</strong></span>
                      <span>पठन समय: {item.read_time || '5 मिनट'}</span>
                    </div>
                  </div>
                )}

                {/* Book Item */}
                {activeTab === 'books' && (
                  <div>
                    <h4 className="text-lg font-bold text-amber-200 font-serif">
                      {item.title_hindi}
                    </h4>
                    <p className="text-xs text-amber-300/80 line-clamp-2 mt-1 bg-amber-950/30 p-2 rounded-lg border border-amber-900/20">
                      {item.synopsis_hindi}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-amber-400/60 mt-1">
                      <span>लेखक/संपादक: <strong className="text-amber-300">{item.authors || item.contributor_name}</strong></span>
                      <span>प्रकाशक: {item.publisher || 'माँ ताप्ती शोध संस्थान'}</span>
                      <span>मूल्य: {item.price || 'निःशुल्क'}</span>
                    </div>
                  </div>
                )}

                {/* Research Submission Item */}
                {activeTab === 'submissions' && (
                  <div>
                    <h4 className="text-lg font-bold text-amber-200 font-serif">
                      {item.title_hindi || item.title}
                    </h4>
                    {item.abstract && (
                      <p className="text-xs text-amber-300/80 line-clamp-2 mt-1 bg-amber-950/30 p-2 rounded-lg border border-amber-900/20">
                        {item.abstract}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-amber-400/60 mt-1">
                      <span>शोधार्थी: <strong className="text-amber-300">{item.author_name}</strong></span>
                      <span>ईमेल: {item.email}</span>
                      {item.file_url && <span className="text-emerald-400 font-semibold">PDF संलग्न है</span>}
                    </div>
                  </div>
                )}

                <div className="text-xs text-amber-400/60 pt-1 flex items-center gap-4">
                  <span>योगदानकर्ता: <strong className="text-amber-300">{item.contributor_name || item.author || item.author_name || item.authors || 'पाठक'}</strong></span>
                  <span>दिनांक: {item.created_at || item.submitted_at ? new Date(item.created_at || item.submitted_at).toLocaleDateString('hi-IN') : 'हाल ही में'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-amber-900/30">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  title="संपादित करें (Edit)"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" /> सम्पादित करें
                </button>

                {itemStatus !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'approved')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-emerald-950 font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> स्वीकारें (Approve)
                  </button>
                )}

                {itemStatus !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(item.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-medium text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" /> अस्वीकारें
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                  title="हटाएं"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-16 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <Users className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई प्रविष्टि नहीं मिली।</p>
          </div>
        )}
      </div>

      {/* EDIT MODAL FOR ADMIN TO EDIT ANY SUBMISSION */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-600/50 rounded-3xl w-full max-w-3xl p-6 md:p-8 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold mb-6 pb-4 border-b border-amber-900/40">
              <Edit3 className="w-5 h-5" />
              <h3 className="text-xl font-bold font-serif text-amber-200">
                प्रविष्टि सम्पादन एवं संशोधन (CMS Edit Submission)
              </h3>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Common Status Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-950/30 p-4 rounded-2xl border border-amber-900/40">
                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">स्वीकृति स्थिति (Status)</label>
                  <select
                    value={editFormData.status || 'pending'}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs font-bold"
                  >
                    <option value="pending">लंबित (Pending Review)</option>
                    <option value="approved">स्वीकृत एवं प्रकाशित (Approved)</option>
                    <option value="rejected">अस्वीकृत (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">योगदानकर्ता / लेखक का नाम</label>
                  <input
                    type="text"
                    value={editFormData.contributor_name || editFormData.author || editFormData.authors || editFormData.author_name || ''}
                    onChange={(e) => setEditFormData({ 
                      ...editFormData, 
                      contributor_name: e.target.value,
                      author: e.target.value,
                      authors: e.target.value,
                      author_name: e.target.value
                    })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs"
                  />
                </div>
              </div>

              {/* Shabdkosh Fields */}
              {editingItem.type === 'shabdkosh' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-200 mb-1">पवारी शब्द *</label>
                      <input
                        type="text"
                        value={editFormData.word_pawari || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, word_pawari: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-200 mb-1">उच्चारण (हिंदी)</label>
                      <input
                        type="text"
                        value={editFormData.pronunciation_hindi || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, pronunciation_hindi: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">हिंदी अर्थ *</label>
                    <textarea
                      rows={2}
                      value={editFormData.meaning_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, meaning_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">पवारी वाक्य प्रयोग</label>
                    <textarea
                      rows={2}
                      value={editFormData.example_pawari || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, example_pawari: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Paheli Fields */}
              {editingItem.type === 'paheli' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">पवारी पहेली (बुझौवल) *</label>
                    <textarea
                      rows={3}
                      value={editFormData.riddle_pawari || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, riddle_pawari: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-200 mb-1">उत्तर (हिंदी) *</label>
                      <input
                        type="text"
                        value={editFormData.answer_hindi || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, answer_hindi: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-200 mb-1">संकेत (Hint)</label>
                      <input
                        type="text"
                        value={editFormData.hint_hindi || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, hint_hindi: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Lokgeet Fields */}
              {editingItem.type === 'lokgeet' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">लोकगीत शीर्षक (पवारी) *</label>
                    <input
                      type="text"
                      value={editFormData.title_pawari || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title_pawari: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">लोकगीत के बोल (Lyrics) *</label>
                    <textarea
                      rows={6}
                      value={editFormData.lyrics_pawari || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, lyrics_pawari: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm font-serif leading-relaxed"
                      required
                    />
                  </div>
                </>
              )}

              {/* Blog Fields */}
              {editingItem.type === 'blogs' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">ब्लॉग शीर्षक (हिंदी) *</label>
                    <input
                      type="text"
                      value={editFormData.title_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">विषय / सारांश (Excerpt)</label>
                    <textarea
                      rows={2}
                      value={editFormData.excerpt_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, excerpt_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">पूर्ण आलेख / सामग्री *</label>
                    <textarea
                      rows={6}
                      value={editFormData.content_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, content_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>
                </>
              )}

              {/* Book Fields */}
              {editingItem.type === 'books' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">पुस्तक शीर्षक (हिंदी) *</label>
                    <input
                      type="text"
                      value={editFormData.title_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">पुस्तक विवरण / सारांश *</label>
                    <textarea
                      rows={5}
                      value={editFormData.synopsis_hindi || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, synopsis_hindi: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>
                </>
              )}

              {/* Submissions Fields */}
              {editingItem.type === 'submissions' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">शोध आलेख शीर्षक *</label>
                    <input
                      type="text"
                      value={editFormData.title_hindi || editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title_hindi: e.target.value, title: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-200 mb-1">शोध सार (Abstract)</label>
                    <textarea
                      rows={5}
                      value={editFormData.abstract_hindi || editFormData.abstract || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, abstract_hindi: e.target.value, abstract: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm"
                    />
                  </div>
                </>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">श्रेणी (Category)</label>
                <input
                  type="text"
                  value={editFormData.category || 'सामान्य'}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/40">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-amber-200 font-semibold text-xs cursor-pointer"
                >
                  रद्द करें
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>संशोधन सहेजें (Save Changes)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
