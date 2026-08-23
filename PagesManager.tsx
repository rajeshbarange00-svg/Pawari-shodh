import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { PageContent } from '../../types';
import { FileText, Save, CheckCircle2 } from 'lucide-react';

export const PagesManager: React.FC = () => {
  const { pages, savePage } = useCms();

  const [selectedPageKey, setSelectedPageKey] = useState<string>('about');
  const page = pages[selectedPageKey] || {
    id: selectedPageKey,
    title_hindi: '',
    title_english: '',
    content_hindi: '',
    content_english: '',
    updated_at: new Date().toISOString()
  };

  const [formPage, setFormPage] = useState<PageContent>(page);
  const [saved, setSaved] = useState(false);

  const handleSelectPage = (key: string) => {
    setSelectedPageKey(key);
    setFormPage(pages[key] || {
      id: key,
      title_hindi: '',
      title_english: '',
      content_hindi: '',
      content_english: '',
      updated_at: new Date().toISOString()
    });
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePage({ ...formPage, updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">CMS Static Pages Editor</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Edit static page content in Hindi and English without code modifications</p>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {[
            { key: 'about', label: 'About Journal' },
            { key: 'director_message', label: 'Director Message' },
            { key: 'author_guidelines', label: 'Author Guidelines' },
            { key: 'aims_scope', label: 'Aims & Scope' },
            { key: 'contact', label: 'Contact Page' },
            { key: 'ethics_policy', label: 'Ethics Policy' },
            { key: 'peer_review_policy', label: 'Peer Review Policy' },
            { key: 'plagiarism_policy', label: 'Plagiarism Policy' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleSelectPage(item.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition uppercase tracking-wider ${
                selectedPageKey === item.key
                  ? 'bg-red-950 text-amber-100 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Page content saved successfully to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-amber-900/10 shadow-2xs space-y-6 text-xs sm:text-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Page Title (Hindi)</label>
            <input
              type="text"
              required
              value={formPage.title_hindi}
              onChange={e => setFormPage({ ...formPage, title_hindi: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Page Title (English)</label>
            <input
              type="text"
              required
              value={formPage.title_english}
              onChange={e => setFormPage({ ...formPage, title_english: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Content Markdown / Text (Hindi)</label>
            <textarea
              rows={12}
              required
              value={formPage.content_hindi}
              onChange={e => setFormPage({ ...formPage, content_hindi: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-sans text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Content Markdown / Text (English)</label>
            <textarea
              rows={12}
              required
              value={formPage.content_english}
              onChange={e => setFormPage({ ...formPage, content_english: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-sans text-xs leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Page Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
