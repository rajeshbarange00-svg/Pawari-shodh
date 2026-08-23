import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PawariLokgeetItem } from '../../types';
import { 
  Music, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Upload, 
  User, 
  Sparkles,
  Play,
  FileText
} from 'lucide-react';

export const LokgeetManager: React.FC = () => {
  const { lokgeetList, saveLokgeet, deleteLokgeet, uploadFileToStorage } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PawariLokgeetItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<PawariLokgeetItem>>({
    title_pawari: '',
    title_hindi: '',
    category: 'भजन / भक्ति गीत',
    lyrics_pawari: '',
    lyrics_hindi_meaning: '',
    singer_or_collector: '',
    youtube_url: '',
    image_url: '',
    contributor_name: 'माँ ताप्ती शोध संस्थान',
    status: 'approved'
  });

  const categories = ['भजन / भक्ति गीत', 'विवाह गीत', 'खेती-किसानी गीत', 'भुजरिया / त्यौहार गीत', 'बधावा एवं जन्मोत्सव गीत', 'अन्य'];

  const filteredItems = lokgeetList.filter(item => 
    item.title_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.title_hindi && item.title_hindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.lyrics_pawari.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title_pawari: '',
      title_hindi: '',
      category: 'भजन / भक्ति गीत',
      lyrics_pawari: '',
      lyrics_hindi_meaning: '',
      singer_or_collector: '',
      youtube_url: '',
      image_url: '',
      contributor_name: 'माँ ताप्ती शोध संस्थान',
      status: 'approved'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PawariLokgeetItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadFileToStorage(file, 'lokgeet');
      setFormData(prev => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('चित्र अपलोड करने में त्रुटि हुई');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_pawari || !formData.lyrics_pawari) {
      alert('कृपया लोकगीत का शीर्षक एवं बोल (Lyrics) दोनों दर्ज करें।');
      return;
    }

    const itemToSave: PawariLokgeetItem = {
      id: editingItem ? editingItem.id : 'lokgeet_' + Date.now(),
      title_pawari: formData.title_pawari || '',
      title_hindi: formData.title_hindi || '',
      category: formData.category || 'भजन / भक्ति गीत',
      lyrics_pawari: formData.lyrics_pawari || '',
      lyrics_hindi_meaning: formData.lyrics_hindi_meaning || '',
      singer_or_collector: formData.singer_or_collector || '',
      youtube_url: formData.youtube_url || '',
      image_url: formData.image_url || '',
      contributor_name: formData.contributor_name || 'एडमिन',
      status: formData.status || 'approved',
      created_at: editingItem ? editingItem.created_at : new Date().toISOString()
    };

    await saveLokgeet(itemToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`क्या आप लोकगीत "${title}" को हटाना चाहते हैं?`)) {
      await deleteLokgeet(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Music className="w-5 h-5" />
            <span>पवारी लोकगीत प्रबंधक (Pawari Lokgeet CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            पवारी पारंपरिक लोकगीतों, विवाह गीतों, भक्ति व रोपाई गीतों का संग्रह एवं संपादन (कुल {lokgeetList.length} लोकगीत)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>नया लोकगीत जोड़ें</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="लोकगीत का शीर्षक या बोल खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>
      </div>

      {/* Lokgeet List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="p-5">
              {item.image_url && (
                <div className="h-40 rounded-xl overflow-hidden mb-4 relative bg-slate-950 border border-amber-900/30">
                  <img 
                    src={item.image_url} 
                    alt={item.title_pawari} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-700/50">
                    {item.category}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-amber-200 font-serif">
                    {item.title_pawari}
                  </h3>
                  {item.title_hindi && (
                    <p className="text-xs text-amber-400/70 font-medium">
                      ({item.title_hindi})
                    </p>
                  )}
                </div>

                {item.status === 'approved' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> स्वीकृत
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40 flex-shrink-0">
                    <Clock className="w-3 h-3" /> विचाराधीन
                  </span>
                )}
              </div>

              {item.singer_or_collector && (
                <p className="text-xs text-amber-300/80 mb-3 flex items-center gap-1.5 italic">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.singer_or_collector}</span>
                </p>
              )}

              {/* Lyrics Box */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-900/30 mb-3 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> लोकगीत बोल (पवारी):
                </p>
                <pre className="text-sm font-serif text-amber-100/90 whitespace-pre-wrap leading-relaxed font-normal">
                  {item.lyrics_pawari}
                </pre>
              </div>

              {item.lyrics_hindi_meaning && (
                <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-800/20 text-xs text-amber-200/80">
                  <span className="font-semibold text-amber-400 block mb-0.5">भावार्थ (हिंदी):</span>
                  {item.lyrics_hindi_meaning}
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-slate-950/50 border-t border-amber-900/20 flex items-center justify-between text-xs text-amber-400/60">
              <span>योगदान: {item.contributor_name || 'एडमिन'}</span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/50 text-amber-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title_pawari)}
                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <Music className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई लोकगीत नहीं मिला।</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingItem ? 'लोकगीत संपादित करें (Edit Lokgeet)' : 'नया पवारी लोकगीत जोड़ें (Add Lokgeet)'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    लोकगीत शीर्षक (पवारी) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="जैसे: माँ ताप्ती स्तुति एवं बधावा"
                    value={formData.title_pawari || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_pawari: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    शीर्षक (हिंदी अनुवाद)
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: माँ ताप्ती की वंदना"
                    value={formData.title_hindi || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_hindi: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={formData.category || 'भजन / भक्ति गीत'}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    गायक / संग्रहकर्ता का नाम
                  </label>
                  <input
                    type="text"
                    placeholder="जैसे: संग्रहकर्ता: डॉ. कैलाश पवार"
                    value={formData.singer_or_collector || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, singer_or_collector: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  लोकगीत के बोल (Pawari Lyrics) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="पवारी लोकगीत के पूरे बोल पंक्तियों में लिखें..."
                  value={formData.lyrics_pawari || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics_pawari: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  गीत का हिंदी भावार्थ (Meaning in Hindi)
                </label>
                <textarea
                  rows={2}
                  placeholder="गीत की पंक्तियों का हिंदी अर्थ..."
                  value={formData.lyrics_hindi_meaning || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lyrics_hindi_meaning: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  चित्र (Image URL or Upload)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                  />
                  <label className="px-4 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-200 rounded-xl cursor-pointer text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'अपलोड...' : 'फाइल चुनें'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-sm font-medium transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-sm font-bold shadow-lg transition-colors"
                >
                  {editingItem ? 'सहेजें (Save Changes)' : 'लोकगीत जोड़ें (Add Lokgeet)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
