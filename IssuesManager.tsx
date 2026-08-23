import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { Issue } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { SafeImage } from '../common/SafeImage';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Star, 
  CheckCircle2, 
  X, 
  Image as ImageIcon, 
  Eye, 
  CloudUpload, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const IssuesManager: React.FC = () => {
  const { issues, saveIssue, deleteIssue, uploadFileToStorage } = useCms();
  const { isDirector, isSuperAdmin } = useAuth();
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Cover artwork upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverSuccessMsg, setCoverSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Preset sample cover images for quick selection
  const SAMPLE_COVERS = [
    { title: 'Satpura Heritage', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
    { title: 'Academic Manuscripts', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80' },
    { title: 'Pawari Literature', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80' },
    { title: 'Cultural Archive', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80' }
  ];

  const activeCurrentIssue = issues.find(i => i.status === 'current') || issues[0];

  const handleSetCurrentIssue = async (issueId: string) => {
    const target = issues.find(i => i.id === issueId);
    if (!target) return;
    await saveIssue({ ...target, status: 'current' });
  };

  const handleCreateNew = () => {
    const newIssue: Issue = {
      id: 'issue_v' + (issues.length + 1) + 'i1_' + Date.now(),
      title_hindi: `वर्ष ${issues.length + 1}, अंक 1 (${new Date().getFullYear()})`,
      title_english: `Volume ${issues.length + 1}, Issue 1 (${new Date().getFullYear()})`,
      volume: issues.length + 1,
      issue_number: 1,
      year: new Date().getFullYear(),
      month: 'Jan - Jun ' + new Date().getFullYear(),
      cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      status: 'published',
      editorial_note_hindi: 'विशेष अंक: पवारी भाषा एवं सतपुड़ा संस्कृति पर केंद्रित।',
      editorial_note_english: 'Special Issue focusing on Pawari dialect and Satpura folklore.',
      publication_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0]
    };
    setEditingIssue(newIssue);
    setCoverError(null);
    setCoverSuccessMsg(null);
    setUploadProgress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (iss: Issue) => {
    setEditingIssue({ ...iss });
    setCoverError(null);
    setCoverSuccessMsg(null);
    setUploadProgress(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;
    await saveIssue(editingIssue);
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  // Upload artwork file to Firebase Storage
  const processCoverFileUpload = async (rawFile: File) => {
    if (!rawFile || !editingIssue) return;

    if (!rawFile.type.startsWith('image/') && !/\.(png|jpe?g|gif|webp|svg)$/i.test(rawFile.name)) {
      setCoverError('Invalid file type: Please select an image file (JPG, PNG, WEBP, SVG, GIF).');
      return;
    }

    const file = new File([rawFile], rawFile.name || 'cover_artwork.jpg', {
      type: rawFile.type || 'image/jpeg',
      lastModified: rawFile.lastModified || Date.now()
    });

    // 1. Instant local FileReader Data URL preview so user gets immediate visual feedback!
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setEditingIssue(prev => prev ? { ...prev, cover_image_url: dataUrl } : null);
      }
    };
    reader.readAsDataURL(file);

    setUploadingCover(true);
    setUploadProgress(15);
    setCoverError(null);
    setCoverSuccessMsg(null);

    try {
      const res = await uploadFileToStorage(
        file, 
        'issue_covers',
        (prog) => setUploadProgress(prog)
      );

      if (res && res.url) {
        setUploadProgress(100);
        setEditingIssue(prev => prev ? { ...prev, cover_image_url: res.url } : null);
        setCoverSuccessMsg('Cover artwork uploaded successfully & preview generated!');
      } else {
        setCoverSuccessMsg('Image preview generated locally!');
      }
    } catch (err: any) {
      console.error('Cover upload failed:', err);
      setCoverSuccessMsg('Image loaded locally for preview. Save issue to apply.');
    } finally {
      setUploadingCover(false);
      setTimeout(() => setUploadProgress(null), 1500);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      processCoverFileUpload(rawFile);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processCoverFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Journal Volumes & Issues Manager</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Manage issue releases, assign current issue status, and upload cover artwork to Firebase Storage.</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Issue</span>
        </button>
      </div>

      {/* Current Issue Selection Banner (वर्तमान अंक का चयन) */}
      <div className="bg-gradient-to-r from-amber-500/15 via-red-950/10 to-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-red-950 rounded-xl shadow-xs shrink-0">
            <Star className="w-6 h-6 fill-red-950 text-red-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-slate-900 text-sm">वेबसाइट का मुख्य "वर्तमान अंक" (Active Current Issue)</h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full font-mono uppercase">
                लाइव सक्रिय
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              वर्तमान में मुख्य वेबसाइट पर प्रदर्शित अंक:{' '}
              <strong className="text-red-950 font-serif font-bold underline">
                {activeCurrentIssue ? `${activeCurrentIssue.title_hindi || activeCurrentIssue.title_english} (Vol ${activeCurrentIssue.volume}, Issue ${activeCurrentIssue.issue_number})` : 'कोई अंक सेट नहीं है'}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <label className="text-xs font-bold text-slate-800 whitespace-nowrap">
            वर्तमान अंक चुनें:
          </label>
          <select
            value={activeCurrentIssue?.id || ''}
            onChange={(e) => handleSetCurrentIssue(e.target.value)}
            className="px-3.5 py-2 bg-white border-2 border-amber-500/60 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
          >
            {issues.map(iss => (
              <option key={iss.id} value={iss.id}>
                {iss.status === 'current' ? '★ [वर्तमान अंक] ' : ''}Vol {iss.volume} Issue {iss.issue_number} ({iss.year}) - {iss.title_hindi || iss.title_english}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map(iss => (
          <div key={iss.id} className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition relative ${
            iss.status === 'current' ? 'border-2 border-amber-500 bg-amber-500/5' : 'border-amber-900/10'
          }`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full uppercase ${
                  iss.status === 'current' ? 'bg-amber-500 text-red-950 font-extrabold shadow-xs' : 'bg-slate-200 text-slate-700'
                }`}>
                  {iss.status === 'current' ? '★ वर्तमान अंक (Current Issue)' : `Vol ${iss.volume} Iss ${iss.issue_number}`}
                </span>
                <span className="text-xs text-slate-400 font-mono">{iss.year}</span>
              </div>

              {/* Cover Artwork Card Preview */}
              <div className="aspect-3/2 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900 group">
                <SafeImage src={iss.cover_image_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(iss)}
                    className="p-2 bg-white text-slate-900 rounded-full font-bold text-xs shadow-lg hover:bg-amber-100 transition flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Cover</span>
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-bold text-slate-900 text-base leading-snug">{iss.title_english}</h3>
              {iss.title_hindi && <p className="font-serif text-slate-700 text-xs font-bold">{iss.title_hindi}</p>}
              <p className="text-xs text-slate-600 line-clamp-2">{iss.editorial_note_english || iss.editorial_note_hindi}</p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Quick Set Current Issue Button */}
              {iss.status === 'current' ? (
                <div className="w-full py-1.5 px-3 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-950 font-extrabold text-xs flex items-center justify-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                  <span>★ सक्रिय वर्तमान अंक (Active Current Issue)</span>
                </div>
              ) : (
                <button
                  onClick={() => handleSetCurrentIssue(iss.id)}
                  className="w-full py-1.5 px-3 bg-slate-50 hover:bg-amber-100 text-slate-700 hover:text-amber-950 font-bold text-xs rounded-xl transition border border-slate-200 hover:border-amber-400 flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Star className="w-3.5 h-3.5 text-amber-600" />
                  <span>वर्तमान अंक बनाएं (Set as Current Issue)</span>
                </button>
              )}

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500">{iss.publication_date}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(iss)}
                    className="px-3 py-1 bg-amber-500/20 text-amber-900 font-bold rounded-lg hover:bg-amber-500 transition"
                  >
                    Edit Issue
                  </button>
                  {(isDirector || isSuperAdmin) && (
                    <button
                      onClick={() => setDeleteId(iss.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete Issue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Issue Modal */}
      {isModalOpen && editingIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-300 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  {editingIssue.id.includes('Date.now()') ? 'Create New Journal Issue' : 'Edit Journal Issue'}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Volume {editingIssue.volume}, Issue {editingIssue.issue_number} ({editingIssue.year})
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume Number</label>
                  <input 
                    type="number" 
                    value={editingIssue.volume} 
                    onChange={e => setEditingIssue({ ...editingIssue, volume: Number(e.target.value) })} 
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Number</label>
                  <input 
                    type="number" 
                    value={editingIssue.issue_number} 
                    onChange={e => setEditingIssue({ ...editingIssue, issue_number: Number(e.target.value) })} 
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (Hindi - हिंदी शीर्षक)</label>
                <input 
                  type="text" 
                  value={editingIssue.title_hindi} 
                  onChange={e => setEditingIssue({ ...editingIssue, title_hindi: e.target.value })} 
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-serif text-xs focus:ring-1 focus:ring-amber-500" 
                  placeholder="e.g. वर्ष 2, अंक 1 (2026)"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
                <input 
                  type="text" 
                  value={editingIssue.title_english} 
                  onChange={e => setEditingIssue({ ...editingIssue, title_english: e.target.value })} 
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-serif text-xs focus:ring-1 focus:ring-amber-500" 
                  placeholder="e.g. Volume 2, Issue 1 (2026)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={editingIssue.status} 
                    onChange={e => setEditingIssue({ ...editingIssue, status: e.target.value as any })} 
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-xs"
                  >
                    <option value="current">★ Current Issue (Highlight on Homepage)</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Date</label>
                  <input 
                    type="date" 
                    value={editingIssue.publication_date} 
                    onChange={e => setEditingIssue({ ...editingIssue, publication_date: e.target.value })} 
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs" 
                  />
                </div>
              </div>

              {/* Editorial Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Editorial Note / Special Theme Note</label>
                <textarea
                  rows={2}
                  value={editingIssue.editorial_note_english || ''}
                  onChange={e => setEditingIssue({ ...editingIssue, editorial_note_english: e.target.value })}
                  placeholder="Enter special theme overview or editorial note for this release..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* COVER ARTWORK EDIT & FIREBASE STORAGE UPLOAD SECTION */}
              <div className="p-4 bg-slate-50 border border-amber-900/15 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-amber-700" />
                    <span>Issue Cover Artwork (कवर आर्टवर्क इमेज)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                    Firebase Storage Upload
                  </span>
                </div>

                {coverSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{coverSuccessMsg}</span>
                  </div>
                )}

                {coverError && (
                  <div className="p-2.5 bg-red-50 border border-red-300 rounded-xl text-red-900 font-bold text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{coverError}</span>
                  </div>
                )}

                {/* Main Artwork Preview & Drag-Drop Zone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                  
                  {/* Preview Thumbnail Box */}
                  <div className="sm:col-span-1 space-y-2">
                    <div className="aspect-3/4 rounded-xl overflow-hidden border-2 border-amber-500/40 bg-slate-900 relative shadow-md group">
                      {editingIssue.cover_image_url ? (
                        <>
                          <SafeImage 
                            src={editingIssue.cover_image_url} 
                            alt="Cover Artwork Preview" 
                            className="w-full h-full object-cover" 
                          />
                          <a
                            href={editingIssue.cover_image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-amber-300 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                            title="Open Cover Image in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-400 text-center space-y-1">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                          <span className="text-[10px] font-mono">No cover artwork</span>
                        </div>
                      )}
                    </div>
                    
                    {editingIssue.cover_image_url && (
                      <button
                        type="button"
                        onClick={() => setEditingIssue({ ...editingIssue, cover_image_url: '' })}
                        className="w-full py-1 text-[11px] font-bold text-red-700 hover:underline text-center"
                      >
                        Remove Cover Image
                      </button>
                    )}
                  </div>

                  {/* Upload Controls & Drag-Drop Box */}
                  <div className="sm:col-span-2 space-y-3">
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`p-4 border-2 border-dashed rounded-2xl text-center transition flex flex-col items-center justify-center space-y-2 ${
                        isDragging 
                          ? 'border-amber-500 bg-amber-50/80 scale-[1.01]' 
                          : 'border-slate-300 bg-white hover:border-amber-400 hover:bg-slate-50'
                      }`}
                    >
                      <CloudUpload className={`w-8 h-8 ${uploadingCover ? 'animate-bounce text-amber-600' : 'text-slate-400'}`} />
                      
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-xs">
                          {uploadingCover ? 'Uploading to Firebase Storage...' : 'Drag & drop cover image file here'}
                        </p>
                        <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP, SVG</p>
                      </div>

                      {uploadProgress !== null && (
                        <div className="w-full max-w-xs space-y-1 pt-1">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-600 h-full transition-all duration-300 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono text-amber-900 font-bold">{uploadProgress}% uploaded</p>
                        </div>
                      )}

                      <label className="mt-1 inline-flex items-center space-x-1.5 px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl cursor-pointer transition shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingCover ? 'Processing Upload...' : 'Choose Image File'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileInputChange} 
                          disabled={uploadingCover}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* Image URL Manual Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Or Paste Image Web URL:
                      </label>
                      <input
                        type="text"
                        value={editingIssue.cover_image_url || ''}
                        onChange={e => setEditingIssue({ ...editingIssue, cover_image_url: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:ring-1 focus:ring-amber-500"
                        placeholder="https://example.com/cover-image.jpg"
                      />
                    </div>

                    {/* Preset Covers Selector */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">
                        Quick Preset Sample Cover Covers:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {SAMPLE_COVERS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingIssue({ ...editingIssue, cover_image_url: preset.url })}
                            className="aspect-3/2 rounded-lg overflow-hidden border border-slate-300 hover:border-amber-500 hover:scale-105 transition relative group"
                            title={preset.title}
                          >
                            <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] truncate p-0.5 text-center opacity-0 group-hover:opacity-100 transition">
                              {preset.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Save Journal Issue Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Issue"
        message="Are you sure you want to delete this issue record?"
        isDestructive={true}
        onConfirm={() => { if (deleteId) { deleteIssue(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};

