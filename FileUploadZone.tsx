import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCheck,
  FileCode,
  Trash2
} from 'lucide-react';
import { useCms, UploadProgressDetails } from '../../lib/CmsContext';

export interface UploadedFileItem {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  category: 'image' | 'document';
  uploadedAt: string;
}

interface FileUploadZoneProps {
  onUploadComplete?: (file: UploadedFileItem) => void;
  onRemoveFile?: (fileId: string) => void;
  acceptedCategory?: 'all' | 'images' | 'documents';
  maxFiles?: number;
  customFolder?: string;
  initialFiles?: UploadedFileItem[];
  label?: string;
  description?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onUploadComplete,
  onRemoveFile,
  acceptedCategory = 'all',
  maxFiles = 10,
  customFolder,
  initialFiles = [],
  label = 'Upload Documents & Images',
  description = 'Drag & drop your files here or click to browse. Supports PDF, DOC, DOCX, JPG, PNG, WEBP.'
}) => {
  const { uploadFileToStorage } = useCms();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadDetails, setUploadDetails] = useState<UploadProgressDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAttemptedFile, setLastAttemptedFile] = useState<File | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadedFileItem[]>(initialFiles);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatSpeed = (bps: number): string => {
    if (!bps || bps <= 0) return '';
    if (bps < 1024 * 1024) return (bps / 1024).toFixed(0) + ' KB/s';
    return (bps / (1024 * 1024)).toFixed(1) + ' MB/s';
  };

  const ALLOWED_TYPES = {
    images: ['image/jpeg', 'image/png', 'image/webp'],
    documents: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_DOC_SIZE = 15 * 1024 * 1024;  // 15 MB

  const validateFile = (file: File): { valid: boolean; error?: string; category?: 'image' | 'document' } => {
    const nameLower = file.name.toLowerCase();
    
    const isJpg = nameLower.endsWith('.jpg') || nameLower.endsWith('.jpeg') || file.type === 'image/jpeg';
    const isPng = nameLower.endsWith('.png') || file.type === 'image/png';
    const isWebp = nameLower.endsWith('.webp') || file.type === 'image/webp';
    const isImage = isJpg || isPng || isWebp;

    const isPdf = file.type === 'application/pdf' || nameLower.endsWith('.pdf');
    const isDoc = file.type.includes('word') || nameLower.endsWith('.doc') || nameLower.endsWith('.docx');
    const isDocument = isPdf || isDoc;

    if (acceptedCategory === 'images' && !isImage) {
      return { valid: false, error: 'Only JPG, PNG, and WEBP image files are allowed.' };
    }

    if (acceptedCategory === 'documents' && !isDocument) {
      return { valid: false, error: 'Only PDF, DOC, and DOCX document files are allowed.' };
    }

    if (!isImage && !isDocument) {
      return { valid: false, error: `Unsupported format "${file.name}". Please upload PDF, DOC, DOCX, JPG, PNG, or WEBP.` };
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return { 
        valid: false, 
        error: `Image size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum 5 MB limit.` 
      };
    }

    if (isDocument && file.size > MAX_DOC_SIZE) {
      return { 
        valid: false, 
        error: `Document size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum 15 MB limit.` 
      };
    }

    return { valid: true, category: isImage ? 'image' : 'document' };
  };

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setLastAttemptedFile(file);

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid file selection.');
      return;
    }

    if (fileList.length >= maxFiles) {
      setErrorMessage(`Maximum upload limit reached (${maxFiles} files). Please remove a file before uploading another.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);
    setUploadDetails({
      loaded: 0,
      total: file.size,
      speedBps: 0,
      timeRemainingSec: 0,
      statusText: 'प्रारंभ हो रहा है...'
    });

    try {
      const result = await uploadFileToStorage(file, customFolder, (pct, details) => {
        setUploadProgress(pct);
        if (details) setUploadDetails(details);
      });

      const newItem: UploadedFileItem = {
        id: result.fileId,
        name: file.name,
        url: result.url,
        path: result.path,
        size: file.size,
        type: file.type || (validation.category === 'image' ? 'image/jpeg' : 'application/pdf'),
        category: validation.category || 'document',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setFileList(prev => [newItem, ...prev]);
      if (onUploadComplete) {
        onUploadComplete(newItem);
      }

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setLastAttemptedFile(null);
      }, 600);

    } catch (err: any) {
      console.error('File upload failed:', err);
      setIsUploading(false);
      setErrorMessage(err.message || 'Upload failed. Please check your internet connection or try again.');
    }
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRetry = () => {
    if (lastAttemptedFile) {
      handleProcessFile(lastAttemptedFile);
    }
  };

  const handleRemove = (fileId: string) => {
    setFileList(prev => prev.filter(f => f.id !== fileId));
    if (onRemoveFile) {
      onRemoveFile(fileId);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Label and Info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            {label}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          <span className="font-medium text-slate-700">Limits:</span>
          <span>Images ≤5MB</span>
          <span>•</span>
          <span>Docs ≤15MB</span>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 shadow-md scale-[1.005]'
            : isUploading
            ? 'border-emerald-300 bg-slate-50 cursor-wait'
            : errorMessage
            ? 'border-red-300 bg-red-50/30 hover:border-red-400'
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-500/60 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isUploading}
          accept={
            acceptedCategory === 'images'
              ? '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
              : acceptedCategory === 'documents'
              ? '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp'
          }
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4 px-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
              <span className="flex items-center gap-2 text-emerald-800 font-serif">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>{uploadDetails?.statusText || `अपलोड हो रहा है... ${uploadProgress}%`}</span>
              </span>
              <span className="font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-300">
                {uploadProgress}%
              </span>
            </div>
            
            {/* Realtime Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner relative">
              <div
                className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 h-full transition-all duration-200 rounded-full flex items-center justify-end pr-1 text-[9px] text-white font-mono font-bold"
                style={{ width: `${Math.max(uploadProgress, 5)}%` }}
              >
                {uploadProgress > 15 && `${uploadProgress}%`}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
              <span>
                {uploadDetails?.loaded ? `${formatSize(uploadDetails.loaded)} / ${formatSize(uploadDetails.total)}` : formatSize(lastAttemptedFile?.size || 0)}
              </span>
              <div className="flex items-center gap-2">
                {uploadDetails?.speedBps && uploadDetails.speedBps > 0 ? (
                  <span className="text-emerald-700 font-medium">⚡ {formatSpeed(uploadDetails.speedBps)}</span>
                ) : null}
                {uploadDetails?.timeRemainingSec && uploadDetails.timeRemainingSec > 0 ? (
                  <span className="text-slate-600">({uploadDetails.timeRemainingSec}s remaining)</span>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                <span className="text-emerald-700 underline underline-offset-2">Click to select file</span> or drag & drop here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: <strong className="text-slate-700">PDF, DOC, DOCX, JPG, PNG, WEBP</strong>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[11px] text-slate-600 font-mono">PDF</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[11px] text-slate-600 font-mono">DOCX</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[11px] text-slate-600 font-mono">JPG / PNG</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[11px] text-slate-600 font-mono">WEBP</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner with Retry */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-red-900">Upload Failed</span>
              <span>{errorMessage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {lastAttemptedFile && (
              <button
                type="button"
                onClick={handleRetry}
                className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition flex items-center gap-1 shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {fileList.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
            <span>Uploaded Files ({fileList.length})</span>
            <span className="text-emerald-700 font-normal">Stored in Firebase Storage</span>
          </div>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            {fileList.map((file) => (
              <div
                key={file.id}
                className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition"
              >
                {/* File Icon / Thumbnail */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border ${
                    file.category === 'image' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}>
                    {file.category === 'image' ? (
                      file.url ? (
                        <img 
                          src={file.url} 
                          alt={file.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5" />
                      )
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{file.category}</span>
                      <span>•</span>
                      <span>{file.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* File Action Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(file.url, file.id)}
                    title="Copy Download URL"
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview / Open file"
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-emerald-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemove(file.id)}
                    title="Remove file"
                    className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
