import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, auth, firebaseConfig } from '../../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Terminal, Upload, Info } from 'lucide-react';

export const StorageDiagnostics: React.FC = () => {
  const { currentUser, loading: authLoading, googleLogin } = useAuth();
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [selectedTrialFile, setSelectedTrialFile] = useState<File | null>(null);
  
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | null;
    uid: string | null;
    testPath: string | null;
    downloadUrl?: string | null;
    code?: string;
    message?: string;
    timestamp?: string;
    stage?: string;
  } | null>(null);

  const handleTrialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedTrialFile(file);
      setTestResult(null);
    }
  };

  const runStorageTest = async (fileToUpload?: File) => {
    setTesting(true);
    setProgress(0);
    setTestResult(null);

    const timestamp = new Date().toLocaleTimeString();
    const activeUser = currentUser || auth.currentUser;
    if (!activeUser) {
      setTestResult({
        status: 'error',
        uid: null,
        testPath: null,
        code: 'auth/unauthenticated',
        message: 'You must sign in with Google first to perform a Firestore storage test.',
        timestamp
      });
      setTesting(false);
      return;
    }
    const uid = activeUser.uid;
    
    const file = fileToUpload || selectedTrialFile;
    const isCustomFile = !!file;

    const fileId = 'test_' + Date.now();
    const testPath = `user_files/${fileId}`;

    try {
      console.log(`[Firestore Storage Diagnostics] Starting trial upload to user_files collection. UID: ${uid} | Path: ${testPath}`);
      setProgress(20);

      let dataUrl: string;
      let fileName = 'test-file.txt';
      let fileType = 'text/plain';
      let fileSize = 0;

      if (file) {
        if (file.size > 750 * 1024) {
          throw new Error(`File size (${(file.size / 1024).toFixed(1)} KB) exceeds Firestore's 750 KB per-document limit.`);
        }
        fileName = file.name;
        fileType = file.type || 'application/octet-stream';
        fileSize = file.size;

        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      } else {
        const textContent = `Firestore Document Storage Test generated at ${new Date().toISOString()}`;
        dataUrl = `data:text/plain;base64,${btoa(textContent)}`;
        fileSize = textContent.length;
      }

      setProgress(60);

      const base64Content = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const docData = {
        id: fileId,
        name: fileName,
        type: fileType,
        size: fileSize,
        user_id: uid,
        content: base64Content,
        base64: base64Content,
        url: dataUrl,
        uploaded_at: new Date().toISOString(),
        storage_path: testPath
      };

      await setDoc(doc(db, 'user_files', fileId), docData);
      setProgress(90);

      // Clean up synthetic file
      if (!isCustomFile) {
        await deleteDoc(doc(db, 'user_files', fileId)).catch(() => {});
      }

      setProgress(100);

      setTestResult({
        status: 'success',
        uid,
        testPath,
        downloadUrl: dataUrl,
        timestamp,
        message: isCustomFile
          ? `File "${fileName}" (${fileSize} bytes) successfully saved as base64 in Firestore 'user_files' collection!`
          : 'Firestore Document Storage Access Verified! Document successfully saved as base64 in user_files collection.'
      });
    } catch (err: any) {
      console.error('[Firestore Storage Diagnostics Failure]', err);
      const code = err?.code || 'firestore/error';
      const message = err?.message || String(err);

      setTestResult({
        status: 'error',
        uid,
        testPath,
        code,
        message,
        timestamp
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-100 text-amber-950 rounded-xl">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-sm">
              Firestore File Storage Diagnostic & Trial Upload Tool
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Target Collection: <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-900 font-bold">user_files</code>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {authLoading ? (
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-slate-600"></div>
              <span>Checking auth...</span>
            </div>
          ) : !currentUser ? (
            <button
              type="button"
              onClick={() => googleLogin()}
              className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-lg transition shadow-xs flex items-center space-x-1.5"
            >
              <span>Sign in with Google</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-950 font-mono text-[11px] font-bold rounded-lg border border-emerald-300 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Auth Ready ({currentUser.email?.split('@')[0]})</span>
            </span>
          )}
        </div>
      </div>

      {/* Storage & Auth Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <span className="text-slate-500">Project ID: </span>
          <span className="font-bold text-slate-900">{firebaseConfig.projectId || 'N/A'}</span>
        </div>
        <div>
          <span className="text-slate-500">Firebase Auth UID: </span>
          <span className="font-bold text-slate-900 break-all">{currentUser?.uid || 'null (Anon / Local)'}</span>
        </div>
        <div>
          <span className="text-slate-500">Storage Bucket: </span>
          <span className="font-bold text-slate-900 break-all">{firebaseConfig.storageBucket || 'N/A'}</span>
        </div>
      </div>

      {/* Trial Upload Control Area */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
        <div className="flex-1 flex items-center space-x-2 overflow-hidden">
          <label className="cursor-pointer px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>Select Trial File (PDF / DOC / Image)</span>
            <input
              type="file"
              onChange={handleTrialFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </label>
          <span className="text-xs font-mono text-slate-600 truncate">
            {selectedTrialFile ? `Selected: ${selectedTrialFile.name} (${(selectedTrialFile.size / 1024 / 1024).toFixed(2)} MB)` : 'No file selected (will use synthetic test)'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => runStorageTest()}
            disabled={testing}
            className="px-4 py-2 bg-amber-900 hover:bg-amber-950 disabled:bg-slate-400 text-amber-100 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-2 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? `Uploading (${progress}%)...` : 'Run Trial Storage Upload'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {testing && (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-600">
            <span>Saving base64 document to Firestore user_files collection...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border">
            <div className="bg-amber-800 h-2 rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Test Results Display */}
      {testResult && (
        <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
          testResult.status === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-current/10">
            <div className="flex items-center space-x-2 font-bold text-sm">
              {testResult.status === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trial Upload Successful</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Trial Upload Failed</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-500">{testResult.timestamp}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div><strong>Target Storage Path:</strong> <code className="bg-white/60 px-1 py-0.5 rounded break-all">{testResult.testPath || 'N/A'}</code></div>
            <div><strong>Firebase Auth UID:</strong> <code>{testResult.uid || 'null'}</code></div>
            {testResult.downloadUrl && (
              <div className="truncate"><strong>Generated Download URL:</strong> <a href={testResult.downloadUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline font-sans">{testResult.downloadUrl}</a></div>
            )}
            {testResult.code && (
              <div><strong>SDK Error Code:</strong> <code className="bg-red-100 text-red-900 font-bold px-1.5 py-0.5 rounded">{testResult.code}</code></div>
            )}
            <div><strong>Diagnostic Output:</strong> {testResult.message}</div>
          </div>

          {testResult.status === 'error' && (
            <div className="mt-2 pt-2 border-t border-red-200/80 text-[10px] text-red-900 space-y-1 font-sans">
              <p className="font-bold flex items-center space-x-1">
                <Info className="w-3 h-3 text-red-700" />
                <span>Troubleshooting Guide:</span>
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                {testResult.code === 'storage/unauthorized' && (
                  <li><strong>Security Rules Mismatch:</strong> Firebase Storage rules rejected write access. Ensure <code>storage.rules</code> includes rules allowing writes for <code>match /users/&#123;userId&#125;/&#123;allPaths=**&#125;</code> or authenticated users.</li>
                )}
                {testResult.code === 'storage/bucket-not-found' && (
                  <li><strong>Storage Bucket Misconfigured:</strong> Check if Firebase Storage is enabled in the Firebase Console and bucket name matches <code>firebase-applet-config.json</code>.</li>
                )}
                {testResult.code === 'auth/unauthenticated' && (
                  <li><strong>Authentication Required:</strong> Click 'Sign in with Google' above before attempting uploads.</li>
                )}
                {(!testResult.code || testResult.code === 'storage/unknown') && (
                  <li>Verify browser connection, CORS policy, or network restrictions blocking Firebase Storage requests.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

