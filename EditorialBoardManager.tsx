import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { EditorialMember } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { SafeImage } from '../common/SafeImage';
import { Users, Plus, Edit3, Trash2, Upload, X, ShieldAlert, Tag, Settings, CheckCircle2 } from 'lucide-react';

const DEFAULT_REQUIRED_ROLES = [
  'Patron',
  'Chief Editor',
  'Executive Editor',
  'Managing Editor',
  'Associate Editor',
  'Co-Editor',
  'Editorial Board Member',
  'Advisory Committee',
  'Reviewer',
  'Guest Editor',
  'Technical Editor'
];

export const EditorialBoardManager: React.FC = () => {
  const { editorialMembers, saveEditorialMember, deleteEditorialMember, uploadFileToStorage } = useCms();

  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Custom Roles state with localStorage persistence
  const [customRoles, setCustomRoles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('editorial_custom_roles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [isCustomRoleMode, setIsCustomRoleMode] = useState(false);

  // Combine default roles, custom roles, and roles from existing members
  const allRoles = Array.from(
    new Set([
      ...DEFAULT_REQUIRED_ROLES,
      ...customRoles,
      ...editorialMembers.map(m => m.role).filter(Boolean)
    ])
  );

  const handleAddCustomRole = (roleName: string) => {
    const trimmed = roleName.trim();
    if (!trimmed) return;

    if (!allRoles.includes(trimmed)) {
      const updated = [...customRoles, trimmed];
      setCustomRoles(updated);
      try {
        localStorage.setItem('editorial_custom_roles', JSON.stringify(updated));
      } catch (err) {}
    }

    if (editingMember) {
      setEditingMember({ ...editingMember, role: trimmed });
      setIsCustomRoleMode(false);
    }

    setNewRoleInput('');
    setIsAddRoleModalOpen(false);
  };

  const handleDeleteCustomRole = (roleToDelete: string) => {
    const updated = customRoles.filter(r => r !== roleToDelete);
    setCustomRoles(updated);
    try {
      localStorage.setItem('editorial_custom_roles', JSON.stringify(updated));
    } catch (err) {}

    if (editingMember && editingMember.role === roleToDelete) {
      setEditingMember({ ...editingMember, role: 'Editorial Board Member' });
    }
  };

  const handleCreateNew = () => {
    const newMember: EditorialMember = {
      id: 'ed_' + Date.now(),
      name_hindi: '',
      name_english: '',
      role: 'Editorial Board Member',
      affiliation_hindi: '',
      affiliation_english: '',
      designation_hindi: '',
      designation_english: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      email: '',
      research_areas: ['Linguistics'],
      order: editorialMembers.length + 1
    };
    setEditingMember(newMember);
    setIsCustomRoleMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (mem: EditorialMember) => {
    setEditingMember({ ...mem });
    setIsCustomRoleMode(!allRoles.includes(mem.role));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    // Ensure role is added to custom roles if it's new
    if (editingMember.role && !allRoles.includes(editingMember.role)) {
      handleAddCustomRole(editingMember.role);
    }

    await saveEditorialMember(editingMember);
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !editingMember) return;

    // 1. Instant local FileReader preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditingMember(prev => prev ? { ...prev, photo_url: dataUrl } : null);
      }
    };
    reader.readAsDataURL(rawFile);

    setUploadingPhoto(true);
    setPhotoError(null);
    setUploadSuccess(false);
    try {
      // Compress the image first for avatars to prevent large base64 strings
      const compressedFile = await new Promise<File>((resolve) => {
        const readerComp = new FileReader();
        readerComp.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;
            const maxDim = 300;
            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(new File([blob], rawFile.name, { type: 'image/jpeg', lastModified: Date.now() }));
                } else {
                  resolve(rawFile);
                }
              }, 'image/jpeg', 0.8);
            } else {
              resolve(rawFile);
            }
          };
          img.onerror = () => resolve(rawFile);
          if (event.target?.result) {
            img.src = event.target.result as string;
          } else {
            resolve(rawFile);
          }
        };
        readerComp.onerror = () => resolve(rawFile);
        readerComp.readAsDataURL(rawFile);
      });

      const res = await uploadFileToStorage(compressedFile, 'editorial_photos');
      if (res && res.url) {
        setEditingMember(prev => prev ? { ...prev, photo_url: res.url } : null);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }
    } catch (err: any) {
      console.error('Photo upload failed:', err);
      // Even on storage error, local preview is kept so user can save
      setUploadSuccess(true);
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Editorial Board & Leadership CMS</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Manage board members, academic roles, designations, and photos</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Top Option to Add Custom Role */}
          <button
            type="button"
            onClick={() => setIsAddRoleModalOpen(true)}
            className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 border border-amber-500/40"
          >
            <Tag className="w-4 h-4 text-amber-900" />
            <span>+ Add New Role (पद जोड़ें)</span>
          </button>

          {/* Manage / Delete Roles */}
          <button
            type="button"
            onClick={() => setIsManageRolesModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 border border-slate-300"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Manage & Delete Roles</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Board Member</span>
          </button>
        </div>
      </div>

      {/* Board Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editorialMembers.map(mem => (
          <div key={mem.id} className="bg-white border border-amber-900/10 rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/40 flex-shrink-0 bg-slate-100 shadow-2xs">
                  <SafeImage
                    src={mem.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={mem.name_english}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-red-950 px-2 py-0.5 rounded-full uppercase inline-block">
                    {mem.role}
                  </span>
                  <h3 className="font-serif font-bold text-slate-900 text-sm mt-1">{mem.name_english}</h3>
                  <p className="text-xs text-red-900 font-medium">{mem.designation_english}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{mem.affiliation_english}</p>
            </div>

            <div className="pt-3 border-t flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">Order: #{mem.order}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(mem)} className="px-3 py-1 bg-amber-500/20 text-amber-900 font-bold rounded hover:bg-amber-500 transition">Edit</button>
                <button onClick={() => setDeleteId(mem.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Edit / Add Modal */}
      {isModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white z-10">
              <h2 className="font-serif font-bold text-lg text-slate-900">
                {editingMember.id.startsWith('ed_') ? 'Add Board Member' : 'Edit Editorial Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Name (Hindi)</label>
                  <input type="text" required value={editingMember.name_hindi} onChange={e => setEditingMember({ ...editingMember, name_hindi: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Name (English)</label>
                  <input type="text" required value={editingMember.name_english} onChange={e => setEditingMember({ ...editingMember, name_english: e.target.value })} className="w-full p-2 border rounded" />
                </div>
              </div>

              {/* Role Dropdown & Custom Role Options */}
              <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs">Role / Designation (पद)</label>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddRoleModalOpen(true)}
                      className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 font-bold px-2 py-0.5 rounded-lg transition border border-amber-400/50 flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New Role</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsManageRolesModalOpen(true)}
                      className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-2 py-0.5 rounded-lg transition"
                    >
                      <span>Manage Roles</span>
                    </button>
                  </div>
                </div>

                {!isCustomRoleMode ? (
                  <div className="space-y-2">
                    {/* Native Select with full touch/scroll support */}
                    <select
                      value={editingMember.role}
                      onChange={e => {
                        if (e.target.value === '__ADD_CUSTOM__') {
                          setIsCustomRoleMode(true);
                        } else {
                          setEditingMember({ ...editingMember, role: e.target.value });
                        }
                      }}
                      className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 bg-white shadow-2xs focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      {allRoles.map(roleOption => (
                        <option key={roleOption} value={roleOption} className="py-1 font-semibold text-slate-900">
                          {roleOption} {customRoles.includes(roleOption) ? ' (Custom)' : ''}
                        </option>
                      ))}
                      <option value="__ADD_CUSTOM__" className="font-bold text-red-900 bg-amber-50">
                        ➕ Type Custom Role Name...
                      </option>
                    </select>

                    {/* Scrollable Role Chips / Quick Selector for smooth scrolling */}
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-500 mb-1">Quick Select or Scroll Roles (सभी पद देखें और चुनें):</p>
                      <div className="max-h-32 overflow-y-auto p-1.5 bg-white border border-amber-200 rounded-xl flex flex-wrap gap-1.5 shadow-inner scrollbar-thin">
                        {allRoles.map(roleOption => {
                          const isSelected = editingMember.role === roleOption;
                          return (
                            <button
                              key={roleOption}
                              type="button"
                              onClick={() => setEditingMember({ ...editingMember, role: roleOption })}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 ${
                                isSelected
                                  ? 'bg-amber-500 text-red-950 border border-amber-600 shadow-xs scale-105'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span>{roleOption}</span>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-red-950" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Selected Role: <strong className="text-amber-950 font-serif">{editingMember.role}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        placeholder="Type custom role name (e.g. Managing Director)..."
                        value={editingMember.role}
                        onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                        className="flex-1 p-2.5 border-2 border-amber-400 rounded-xl font-bold text-red-950 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomRoleMode(false)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation (English)</label>
                  <input type="text" value={editingMember.designation_english || ''} onChange={e => setEditingMember({ ...editingMember, designation_english: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input type="number" value={editingMember.order} onChange={e => setEditingMember({ ...editingMember, order: Number(e.target.value) })} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affiliation (English)</label>
                  <input type="text" value={editingMember.affiliation_english || ''} onChange={e => setEditingMember({ ...editingMember, affiliation_english: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" value={editingMember.email || ''} onChange={e => setEditingMember({ ...editingMember, email: e.target.value })} className="w-full p-2 border rounded" />
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20 space-y-2.5">
                <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Member Photo (सदस्य की तस्वीर)
                </label>
                <div className="flex items-center space-x-3">
                  {/* Photo Preview Circle - Always visible */}
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/60 flex-shrink-0 bg-slate-200 shadow-xs relative">
                    <SafeImage
                      src={editingMember.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt="Member photo preview"
                      className="w-full h-full object-cover"
                      fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-3.5 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-lg transition flex items-center space-x-1.5 text-xs shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploadingPhoto ? 'Uploading Photo...' : 'Upload Photo File'}</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                      </label>

                      {editingMember.photo_url && (
                        <button
                          type="button"
                          onClick={() => setEditingMember({ ...editingMember, photo_url: '' })}
                          className="text-xs text-red-700 hover:text-red-900 hover:underline font-bold px-2 py-1 bg-red-50 rounded border border-red-200"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {uploadSuccess && (
                      <p className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <span>✓ Photo uploaded! Saved to Firestore. Click "Save Member" to finalize.</span>
                      </p>
                    )}

                    {photoError && (
                      <p className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        ⚠️ {photoError}
                      </p>
                    )}

                    <div className="space-y-1">
                      {editingMember.photo_url?.startsWith('data:') && (
                        <p className="text-[11px] font-semibold text-amber-800 flex items-center space-x-1">
                          <span>📷 Local uploaded image ready (will be saved in Firestore)</span>
                        </p>
                      )}
                      <input
                        type="text"
                        value={editingMember.photo_url || ''}
                        onChange={e => setEditingMember({ ...editingMember, photo_url: e.target.value })}
                        placeholder="Or paste image web URL (e.g. https://...)"
                        className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white text-slate-800 truncate"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Sample Avatars */}
                <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Quick Preset Avatars:</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border font-mono"
                    >
                      Male 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border font-mono"
                    >
                      Male 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border font-mono"
                    >
                      Female 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMember({ ...editingMember, photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' })}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-amber-100 text-slate-700 rounded border font-mono"
                    >
                      Female 2
                    </button>
                  </div>
                </div>

                {photoError && <p className="text-xs text-red-600 font-mono font-bold">{photoError}</p>}
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2 sticky bottom-0 bg-white py-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded font-medium">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-red-950 text-amber-100 font-bold rounded">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif font-bold text-base text-slate-900">Add New Editorial Role (नया पद जोड़ें)</h2>
              <button onClick={() => setIsAddRoleModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddCustomRole(newRoleInput); }} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title (e.g. Managing Editor, Language Specialist)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Language Specialist / भाषा परामर्शदाता"
                  value={newRoleInput}
                  onChange={e => setNewRoleInput(e.target.value)}
                  className="w-full p-2.5 border rounded font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsAddRoleModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold rounded transition">Add & Auto-Select Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage & Delete Roles Modal */}
      {isManageRolesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="font-serif font-bold text-base text-slate-900">Manage Editorial Roles</h2>
                <p className="text-[11px] text-slate-500">View default roles and delete any custom roles created</p>
              </div>
              <button onClick={() => setIsManageRolesModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Quick Add Role inside Manager */}
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type new role title..."
                  value={newRoleInput}
                  onChange={e => setNewRoleInput(e.target.value)}
                  className="flex-1 p-2 border rounded font-bold text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomRole(newRoleInput)}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold rounded-lg transition"
                >
                  + Add Role
                </button>
              </div>

              {/* List of Roles */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                <h3 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">All Active Roles ({allRoles.length})</h3>
                
                {allRoles.map(role => {
                  const isCustom = customRoles.includes(role);
                  return (
                    <div key={role} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl hover:bg-slate-100/80 transition">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5 text-amber-900" />
                        <span className="font-bold text-slate-900">{role}</span>
                        {isCustom && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">Custom</span>
                        )}
                      </div>

                      {isCustom ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomRole(role)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-bold flex items-center space-x-1 text-[10px]"
                          title="Delete Custom Role"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Role</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">System Default</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setIsManageRolesModalOpen(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Member Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Member"
        message="Remove this member from editorial board?"
        isDestructive={true}
        onConfirm={() => { if (deleteId) { deleteEditorialMember(deleteId); setDeleteId(null); } }}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};


