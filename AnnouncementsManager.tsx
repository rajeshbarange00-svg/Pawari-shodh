import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { Announcement } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { Bell, Plus, Edit3, Trash2, CheckCircle2, X } from 'lucide-react';

export const AnnouncementsManager: React.FC = () => {
  const { announcements, saveAnnouncement, deleteAnnouncement } = useCms();

  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      title_hindi: '',
      title_english: '',
      content_hindi: '',
      content_english: '',
      date: new Date().toISOString().split('T')[0],
      is_important: true,
      is_active: true
    };
    setEditingAnn(newAnn);
    setIsModalOpen(true);
  };

  const handleEdit = (ann: Announcement) => {
    setEditingAnn({ ...ann });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;
    await saveAnnouncement(editingAnn);
    setIsModalOpen(false);
    setEditingAnn(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Journal Announcements & Call for Papers</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Post news bulletins, call for papers, and conference notices</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${ann.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {ann.is_active ? 'Active' : 'Hidden'}
                </span>
                {ann.is_important && (
                  <span className="bg-amber-500 text-red-950 font-bold px-2 py-0.5 rounded">Important</span>
                )}
                <span className="text-slate-400">{ann.date}</span>
              </div>

              <h3 className="font-serif font-bold text-slate-900 text-base">{ann.title_english}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{ann.content_english}</p>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button onClick={() => handleEdit(ann)} className="px-3 py-1.5 bg-amber-500/20 text-amber-900 font-bold rounded text-xs">Edit</button>
              <button onClick={() => setDeleteId(ann.id)} className="p-1.5 text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif font-bold text-lg text-slate-900">Post Announcement</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (Hindi)</label>
                <input type="text" required value={editingAnn.title_hindi} onChange={e => setEditingAnn({ ...editingAnn, title_hindi: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
                <input type="text" required value={editingAnn.title_english} onChange={e => setEditingAnn({ ...editingAnn, title_english: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content (Hindi)</label>
                <textarea rows={3} value={editingAnn.content_hindi} onChange={e => setEditingAnn({ ...editingAnn, content_hindi: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content (English)</label>
                <textarea rows={3} value={editingAnn.content_english} onChange={e => setEditingAnn({ ...editingAnn, content_english: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1.5 font-bold">
                  <input type="checkbox" checked={editingAnn.is_active} onChange={e => setEditingAnn({ ...editingAnn, is_active: e.target.checked })} />
                  <span>Is Active</span>
                </label>

                <label className="flex items-center space-x-1.5 font-bold">
                  <input type="checkbox" checked={editingAnn.is_important || false} onChange={e => setEditingAnn({ ...editingAnn, is_important: e.target.checked })} />
                  <span>Mark Important Banner</span>
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-950 text-amber-100 font-bold rounded">Save Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Announcement"
        message="Permanently remove this announcement?"
        isDestructive={true}
        onConfirm={() => { if (deleteId) { deleteAnnouncement(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};
