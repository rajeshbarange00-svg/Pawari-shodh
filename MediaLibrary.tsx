import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { SafeImage } from '../common/SafeImage';
import { Copy, Check, Trash2, FileText, ExternalLink, HardDrive } from 'lucide-react';
import { FileUploadZone } from '../common/FileUploadZone';

export const MediaLibrary: React.FC = () => {
  const { mediaFiles, deleteFileFromStorage } = useCms();
  const { currentUser } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-700" />
            <h1 className="text-xl font-serif font-bold text-slate-900">Firebase Media & Document Storage</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Fast, secure document & image upload with user-based folder structure <span className="text-emerald-700 font-medium">(users/{currentUser?.uid || 'uid'}/...)</span>
          </p>
        </div>
      </div>

      {/* Reusable File Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <FileUploadZone
          label="Upload Research Manuscripts, Articles & Figures"
          description="Drag & drop or select files to store securely in Firebase Storage. Supports PDF, DOC, DOCX, JPG, PNG, and WEBP."
          acceptedCategory="all"
          maxFiles={15}
        />
      </div>

      {/* Stored Media Files Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
          <span>Stored Assets ({mediaFiles.length})</span>
          <span className="text-xs font-normal text-slate-500 font-mono">Firebase Storage & Firestore synced</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-300">
              No media files stored yet. Use the uploader above to upload documents or images.
            </div>
          ) : (
            mediaFiles.map(item => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2 flex flex-col justify-between hover:border-emerald-300 transition">
                
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative group">
                    {item.type === 'image' || item.name.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? (
                      <SafeImage src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-emerald-300 font-serif font-bold text-xs flex flex-col items-center">
                        <FileText className="w-8 h-8 mb-1" />
                        <span>Document</span>
                      </div>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View File
                    </a>
                  </div>

                  <p className="font-semibold text-slate-800 text-xs truncate" title={item.name}>{item.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">{(item.size / 1024).toFixed(1)} KB • {item.uploaded_at ? item.uploaded_at.split('T')[0] : 'Just now'}</p>
                </div>

                <div className="pt-2 border-t flex items-center justify-between space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium rounded text-[11px] flex items-center space-x-1 transition"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteFileFromStorage(item.storage_path)}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

