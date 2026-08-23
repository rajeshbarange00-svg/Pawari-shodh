import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariWriterItem } from '../../types';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Award, 
  BookOpen, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Star,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const WritersManager: React.FC = () => {
  const { writers, books, blogs, saveWriter, deleteWriter, lang } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [editingWriter, setEditingWriter] = useState<PawariWriterItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PawariWriterItem>>({
    name_hindi: '',
    name_english: '',
    photo_url: '',
    designation_hindi: '',
    designation_english: '',
    location_hindi: '',
    location_english: '',
    bio_hindi: '',
    bio_english: '',
    specialization_hindi: '',
    awards_hindi: [],
    published_books: [],
    published_blogs: [],
    contact_email: '',
    contact_phone: '',
    website_url: '',
    social_links: { facebook: '', youtube: '', wikipedia: '' },
    is_featured: true,
    status: 'approved'
  });

  const [awardsInput, setAwardsInput] = useState('');
  const [customBookInput, setCustomBookInput] = useState('');
  const [customBlogInput, setCustomBlogInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredWriters = writers.filter(w => {
    const matchesSearch = 
      (w.name_hindi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.name_english || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.location_hindi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.designation_hindi || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setFormData({
      id: 'writer-' + Date.now(),
      name_hindi: '',
      name_english: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      designation_hindi: '',
      designation_english: '',
      location_hindi: '',
      location_english: '',
      bio_hindi: '',
      bio_english: '',
      specialization_hindi: '',
      awards_hindi: [],
      published_books: [],
      published_blogs: [],
      contact_email: '',
      contact_phone: '',
      website_url: '',
      social_links: { facebook: '', youtube: '', wikipedia: '' },
      is_featured: true,
      status: 'approved',
      created_at: new Date().toISOString()
    });
    setAwardsInput('');
    setCustomBookInput('');
    setCustomBlogInput('');
    setEditingWriter(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEditModal = (writer: PawariWriterItem) => {
    setEditingWriter(writer);
    setFormData({ ...writer });
    setAwardsInput((writer.awards_hindi || []).join(', '));
    setCustomBookInput('');
    setCustomBlogInput('');
    setIsNewModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_hindi || !formData.bio_hindi) {
      alert('कृपया लेखक का नाम और जीवनी (हिंदी/पवारी में) अवश्य भरें।');
      return;
    }

    const awardsArray = awardsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedWriter: PawariWriterItem = {
      id: formData.id || 'writer-' + Date.now(),
      name_hindi: formData.name_hindi || '',
      name_english: formData.name_english || '',
      photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      designation_hindi: formData.designation_hindi || '',
      designation_english: formData.designation_english || '',
      location_hindi: formData.location_hindi || '',
      location_english: formData.location_english || '',
      bio_hindi: formData.bio_hindi || '',
      bio_english: formData.bio_english || '',
      specialization_hindi: formData.specialization_hindi || '',
      awards_hindi: awardsArray,
      published_books: formData.published_books || [],
      published_blogs: formData.published_blogs || [],
      contact_email: formData.contact_email || '',
      contact_phone: formData.contact_phone || '',
      website_url: formData.website_url || '',
      social_links: formData.social_links || {},
      is_featured: formData.is_featured ?? true,
      status: formData.status || 'approved',
      created_at: formData.created_at || new Date().toISOString()
    };

    try {
      await saveWriter(updatedWriter);
      setIsNewModalOpen(false);
      showToast(editingWriter ? 'लेखक प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'नया लेखक प्रोफ़ाइल सफलतापूर्वक जोड़ा गया!');
    } catch (err) {
      console.error(err);
      alert('सेव करने में त्रुटि आई।');
    }
  };

  const handleDelete = async (writer: PawariWriterItem) => {
    if (window.confirm(`क्या आप लेखक "${writer.name_hindi}" का प्रोफ़ाइल हटाना चाहते हैं?`)) {
      try {
        await deleteWriter(writer.id);
        showToast('लेखक प्रोफ़ाइल हटा दी गई।');
      } catch (err) {
        console.error(err);
        alert('हटाने में त्रुटि हुई।');
      }
    }
  };

  const handleToggleStatus = async (writer: PawariWriterItem, newStatus: 'approved' | 'pending' | 'rejected') => {
    const updated = { ...writer, status: newStatus };
    await saveWriter(updated);
    showToast(`स्थिति बदला गया: ${newStatus}`);
  };

  const handleAddBookToWriter = (bookTitle: string) => {
    if (!bookTitle) return;
    if (!(formData.published_books || []).includes(bookTitle)) {
      setFormData(prev => ({
        ...prev,
        published_books: [...(prev.published_books || []), bookTitle]
      }));
    }
  };

  const handleRemoveBookFromWriter = (bookTitle: string) => {
    setFormData(prev => ({
      ...prev,
      published_books: (prev.published_books || []).filter(b => b !== bookTitle)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-900 text-amber-100 px-5 py-3 rounded-xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-2xl p-6 text-amber-100 border border-amber-800/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <UserCheck className="w-4 h-4" />
            <span>डिजिटलकरण संग्रह • Writers & Authors CMS</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-100">
            पवारी लेखक एवं साहित्यकार प्रबंधन
          </h2>
          <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">
            सतपुड़ा एवं मध्य भारत के पवारी भाषाविदों, कवियों, शोधकर्ताओं एवं लेखकों की जीवनी, कृतियाँ और परिचय प्रबंधित करें।
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>नया लेखक / साहित्यकार जोड़ें</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="लेखक नाम, स्थान या परिचय खोजें..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-stone-600 shrink-0">स्थिति:</span>
          <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs w-full sm:w-auto">
            {(['all', 'approved', 'pending', 'rejected'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md transition font-medium capitalize flex-1 sm:flex-none text-center ${
                  statusFilter === st 
                    ? 'bg-white text-stone-900 shadow-sm font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st === 'all' ? 'सभी' : st === 'approved' ? 'स्वीकृत' : st === 'pending' ? 'लंबित' : 'अस्वीकृत'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Writers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredWriters.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200 p-8">
            <UserCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-600 font-medium text-sm">कोई लेखक रिकॉर्ड नहीं मिला।</p>
            <p className="text-stone-400 text-xs mt-1">आप ऊपरी दाएँ बटन से नया लेखक जोड़ सकते हैं।</p>
          </div>
        ) : (
          filteredWriters.map(writer => (
            <div 
              key={writer.id} 
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-4 mb-3">
                  <img
                    src={writer.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt={writer.name_hindi}
                    className="w-16 h-16 rounded-xl object-cover border border-amber-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold font-serif text-stone-900 truncate">
                        {writer.name_hindi}
                      </h3>
                      {writer.is_featured && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>विशेष</span>
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        writer.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        writer.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {writer.status === 'approved' ? 'स्वीकृत' : writer.status === 'pending' ? 'लंबित' : 'अस्वीकृत'}
                      </span>
                    </div>

                    {writer.designation_hindi && (
                      <p className="text-xs font-medium text-amber-800 mb-0.5">
                        {writer.designation_hindi}
                      </p>
                    )}

                    {writer.location_hindi && (
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{writer.location_hindi}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  {writer.bio_hindi}
                </p>

                {/* Awards Badges */}
                {writer.awards_hindi && writer.awards_hindi.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" /> सम्मान एवं पुरस्कार:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {writer.awards_hindi.map((aw, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200/60 text-[10px] px-2 py-0.5 rounded">
                          🏆 {aw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Published Books Badges */}
                {writer.published_books && writer.published_books.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-stone-500 block mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-red-700" /> प्रकाशित पुस्तकें:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {writer.published_books.map((bk, idx) => (
                        <span key={idx} className="bg-red-50 text-red-900 border border-red-200/60 text-[10px] px-2 py-0.5 rounded">
                          📖 {bk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar Footer */}
              <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(writer)}
                    className="text-xs font-semibold text-stone-700 hover:text-amber-800 bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>संपादित करें</span>
                  </button>

                  <button
                    onClick={() => handleDelete(writer)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Toggle Quick Buttons */}
                <div className="flex items-center gap-1">
                  {writer.status !== 'approved' && (
                    <button
                      onClick={() => handleToggleStatus(writer, 'approved')}
                      className="text-[11px] font-medium bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 transition"
                    >
                      स्वीकार करें
                    </button>
                  )}
                  {writer.status !== 'rejected' && (
                    <button
                      onClick={() => handleToggleStatus(writer, 'rejected')}
                      className="text-[11px] font-medium bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded hover:bg-red-200 transition"
                    >
                      अस्वीकार
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add / Edit Writer */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-stone-900 text-amber-100 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold font-serif">
                  {editingWriter ? 'लेखक/साहित्यकार प्रोफ़ाइल अपडेट करें' : 'नया लेखक/साहित्यकार जोड़ें'}
                </h3>
              </div>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hindi Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    लेखक का नाम (हिंदी/पवारी) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_hindi || ''}
                    onChange={e => setFormData({ ...formData, name_hindi: e.target.value })}
                    placeholder="उदा. डॉ. कैलाश पवार"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Name in English
                  </label>
                  <input
                    type="text"
                    value={formData.name_english || ''}
                    onChange={e => setFormData({ ...formData, name_english: e.target.value })}
                    placeholder="e.g. Dr. Kailash Pawar"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Designation / Title */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    पद एवं परिचय (Designation / Title)
                  </label>
                  <input
                    type="text"
                    value={formData.designation_hindi || ''}
                    onChange={e => setFormData({ ...formData, designation_hindi: e.target.value })}
                    placeholder="उदा. वरिष्ठ पवारी भाषाविद् एवं शोधकर्ता"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Native Region / Location */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    स्थान / अंचल (Location / Region)
                  </label>
                  <input
                    type="text"
                    value={formData.location_hindi || ''}
                    onChange={e => setFormData({ ...formData, location_hindi: e.target.value })}
                    placeholder="उदा. मुलताई (जिला बैतूल, म.प्र.)"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Photo URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    लेखक की फोटो (Image URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.photo_url || ''}
                      onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Unsplash या वेब फ़ोटो URL दर्ज करें।</p>
                </div>

                {/* Specialization */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    विशेषज्ञता क्षेत्र (Field of Specialization)
                  </label>
                  <input
                    type="text"
                    value={formData.specialization_hindi || ''}
                    onChange={e => setFormData({ ...formData, specialization_hindi: e.target.value })}
                    placeholder="उदा. पवारी भाषाविज्ञान, ध्वनिविज्ञान एवं लोकसाहित्य"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Biography Hindi */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    जीवनी एवं विस्तृत परिचय (Biography) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.bio_hindi || ''}
                    onChange={e => setFormData({ ...formData, bio_hindi: e.target.value })}
                    placeholder="लेखक का साहित्यिक जीवन, योगदान और शोध का विस्तृत विवरण लिखें..."
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Awards Input */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    सम्मान एवं पुरस्कार (Awards & Honors - कामा (,) से अलग करें)
                  </label>
                  <input
                    type="text"
                    value={awardsInput}
                    onChange={e => setAwardsInput(e.target.value)}
                    placeholder="उदा. माँ ताप्ती साहित्य रत्न (2024), मध्य प्रदेश लोकसंस्कृति पुरस्कार"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Published Books Selector & Manager */}
                <div className="md:col-span-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-red-700" />
                    <span>उनकी प्रकाशित पुस्तकें (Published Books)</span>
                  </label>

                  {/* Existing Published Books Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(formData.published_books || []).length === 0 ? (
                      <span className="text-[11px] text-stone-400 italic">कोई पुस्तक जोड़ी नहीं गई।</span>
                    ) : (
                      (formData.published_books || []).map((bTitle, idx) => (
                        <span key={idx} className="bg-red-100 text-red-900 border border-red-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                          <span>📖 {bTitle}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBookFromWriter(bTitle)}
                            className="text-red-600 hover:text-red-900 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add from existing library OR custom title */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      onChange={e => {
                        if (e.target.value) {
                          handleAddBookToWriter(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg flex-1"
                    >
                      <option value="">-- पुस्तकालय ग्रंथ सूची से चुनें --</option>
                      {books.map(b => (
                        <option key={b.id} value={b.title_hindi}>
                          {b.title_hindi} ({b.category})
                        </option>
                      ))}
                    </select>

                    <div className="flex gap-1 flex-1">
                      <input
                        type="text"
                        value={customBookInput}
                        onChange={e => setCustomBookInput(e.target.value)}
                        placeholder="या नई पुस्तक शीर्षक लिखें..."
                        className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customBookInput.trim()) {
                            handleAddBookToWriter(customBookInput.trim());
                            setCustomBookInput('');
                          }
                        }}
                        className="bg-red-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-900 transition shrink-0 font-medium"
                      >
                        जोड़ें
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Email & Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ईमेल आईडी (Contact Email)
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="author@pawarishodh.org"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    संपर्क फोन (Phone Number)
                  </label>
                  <input
                    type="text"
                    value={formData.contact_phone || ''}
                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+91 94250 12345"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                </div>

                {/* Status & Featured */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    प्रकाशन स्थिति (Status)
                  </label>
                  <select
                    value={formData.status || 'approved'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  >
                    <option value="approved">स्वीकृत (Approved / Live)</option>
                    <option value="pending">लंबित (Pending Review)</option>
                    <option value="rejected">अस्वीकृत (Rejected)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                    <input
                      type="checkbox"
                      checked={formData.is_featured ?? true}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                    />
                    <span>मुख्य पृष्ठ पर विशेष रूप से दिखाएं (Featured Author)</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-stone-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingWriter ? 'अपडेट सेव करें' : 'नया लेखक प्रकाशित करें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
