import React, { useState, useRef } from 'react';
import { parseWordArticle, ParsedWordArticle } from '../../lib/wordParser';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Wand2, 
  AlertCircle, 
  FileType, 
  Eye, 
  Layers, 
  BookOpen, 
  List, 
  X,
  FileCheck,
  Copy
} from 'lucide-react';

interface WordPasteImporterProps {
  onApplyParsedArticle: (parsed: ParsedWordArticle) => void;
  lang?: 'hi' | 'en';
}

export const WordPasteImporter: React.FC<WordPasteImporterProps> = ({ 
  onApplyParsedArticle,
  lang = 'hi' 
}) => {
  const [pastedText, setPastedText] = useState('');
  const [pastedHtml, setPastedHtml] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedWordArticle | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');

  const [previewMode, setPreviewMode] = useState<'structure' | 'rich'>('structure');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse debounced effect when pastedText changes
  React.useEffect(() => {
    if (!pastedText.trim() || pastedText.length < 15) {
      if (!pastedText) setParsedResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const result = await parseWordArticle({ html: pastedHtml, text: pastedText });
        setParsedResult(result);
      } catch (err: any) {
        console.error('Auto parse error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [pastedText, pastedHtml]);

  // Clipboard Paste Handler
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    setErrorMessage(null);
    setIsProcessing(true);

    const clipboardData = e.clipboardData;
    let html = clipboardData.getData('text/html') || '';
    const text = clipboardData.getData('text/plain') || '';

    // Check for clipboard image files/items (e.g., images copied from Word)
    const items = Array.from(clipboardData.items || []);
    const imagePromises: Promise<string>[] = [];

    items.forEach((item: any) => {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const promise = new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target?.result as string || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
          imagePromises.push(promise);
        }
      }
    });

    try {
      const base64Images = await Promise.all(imagePromises);
      if (base64Images.length > 0) {
        // Append extracted image tags if not already present in HTML
        base64Images.forEach((imgSrc) => {
          if (imgSrc && !html.includes(imgSrc)) {
            html += `<p><img src="${imgSrc}" alt="Pasted Word Image" className="max-w-full h-auto my-3 rounded-lg shadow-xs" /></p>`;
          }
        });
      }

      setPastedHtml(html);
      if (text) setPastedText(text);

      const result = await parseWordArticle({ html, text });
      setParsedResult(result);
    } catch (err: any) {
      console.error('Error parsing pasted content:', err);
      setErrorMessage(lang === 'hi' 
        ? 'पेस्ट की गई सामग्री का विश्लेषण करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।' 
        : 'Failed to process pasted Word content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual Trigger for Text Parsing
  const handleProcessManualText = async () => {
    if (!pastedText.trim()) return;
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const result = await parseWordArticle({ html: pastedHtml, text: pastedText });
      setParsedResult(result);
    } catch (err: any) {
      console.error('Error parsing text:', err);
      setErrorMessage(lang === 'hi' ? 'विश्लेषण असफल हुआ।' : 'Processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // File Upload (.docx / .doc / .txt) Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(docx|doc|txt)$/i)) {
      setErrorMessage(lang === 'hi' 
        ? 'कृपया केवल Word फ़ाइल (.docx) या Text (.txt) अपलोड करें।' 
        : 'Please upload only Word (.docx) or Text (.txt) files.');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await parseWordArticle({ file });
      setParsedResult(result);
    } catch (err: any) {
      console.error('Error parsing uploaded docx:', err);
      setErrorMessage(lang === 'hi' 
        ? 'Word फ़ाइल पढ़ने में त्रुटि हुई। कृपया सामग्री को कॉपी करके पेस्ट करें।' 
        : 'Failed to read Word file. Please try copying and pasting the text directly.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleApply = () => {
    if (parsedResult) {
      onApplyParsedArticle(parsedResult);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
              {lang === 'hi' ? 'Word दस्तावेज़ स्मार्ट पेस्ट एवं संरचना परिवर्तक' : 'Smart Word Document Paste & Structure Parser'}
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                AI Cleaned
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {lang === 'hi' 
                ? 'MS Word (.docx) से कॉपी किया गया मैटर यहाँ पेस्ट करें। सिस्टम स्वतः शीर्षक, गोत्र/लेखक, सार, अनुभाग (1.1, 1.2) व संदर्भ व्यवस्थित कर देगा।' 
                : 'Paste text from MS Word. Clean junk formatting & auto-map into standard journal paper layout.'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'paste' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-amber-600" />
            {lang === 'hi' ? 'Direct Ctrl+V Paste' : 'Direct Ctrl+V Paste'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'upload' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'hi' ? '.DOCX File Upload' : '.DOCX File Upload'}
          </button>
        </div>
      </div>

      {/* Input Area: Paste vs File Upload */}
      {activeTab === 'paste' ? (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>{lang === 'hi' ? 'एमएस वर्ड से कॉपी किया गया मैटर यहाँ पेस्ट करें (Ctrl + V):' : 'Paste Copied MS Word Content Here (Ctrl + V):'}</span>
            {pastedText && (
              <span className="text-slate-500 font-normal lowercase">
                {pastedText.length} characters parsed
              </span>
            )}
          </label>
          <div className="relative">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              onPaste={handlePaste}
              placeholder={lang === 'hi' 
                ? 'Microsoft Word से पूरा शोध पत्र कॉपी करें और यहाँ Ctrl+V करें...\n\nउदा:\nशीर्षक: क्षत्रिय पवार गोत्र अध्ययन...\nलेखक: डॉ. राजेश पंवार\nAbstract (Hindi): प्रस्तुत शोध पत्र में...\n1. प्रस्तावना\n2. साहित्य समीक्षा\n3. कार्यप्रणाली\n4. परिणाम\n5. निष्कर्ष\nसंदर्भ:' 
                : 'Copy entire manuscript from MS Word and press Ctrl+V here...\n\nExample:\nTitle: Origin of Pawari Dialect\nAuthors: Dr. Rajesh Pawar\nAbstract: This research paper...\n1. Introduction\n2. Literature Review\n3. Methodology\nReferences:'}
              rows={7}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-inner"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-amber-900">
                  {lang === 'hi' ? 'Word फ़ॉर्मेटिंग साफ एवं संरचना रूपांतरित हो रही है...' : 'Cleaning Word formatting & mapping paper structure...'}
                </span>
              </div>
            )}
          </div>

          {pastedText && !parsedResult && (
            <button
              type="button"
              onClick={handleProcessManualText}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Wand2 className="w-4 h-4" />
              {lang === 'hi' ? 'पेस्ट मैटर का विश्लेषण करें' : 'Parse & Process Text'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {lang === 'hi' ? 'MS Word (.docx) फाइल चुनें:' : 'Upload MS Word (.docx) File:'}
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/50 transition-all rounded-xl p-8 text-center cursor-pointer space-y-3 group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center mx-auto transition-all">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {selectedFile ? selectedFile.name : (lang === 'hi' ? 'फाइल चुनने के लिए क्लिक करें या यहाँ ड्रॉप करें' : 'Click to select or drop .docx file here')}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Microsoft Word (.docx), Word XML, and plain text files
              </p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".docx,.doc,.txt" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Parsed Result Detection Summary & Review */}
      {parsedResult && (
        <div className="bg-white rounded-xl border border-emerald-200 p-4 sm:p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {lang === 'hi' ? 'Word दस्तावेज़ विश्लेषण पूर्ण (Detection Summary)' : 'Word Document Analysis Completed'}
            </h4>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
              {parsedResult.detectionSummary.length} Elements Auto-Detected
            </span>
          </div>

          {/* Checklist Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {parsedResult.detectionSummary.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* View Toggle Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600">
              {lang === 'hi' ? 'पूर्वावलोकन प्रकार (Preview Mode):' : 'Preview Mode:'}
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('structure')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewMode === 'structure' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5 text-amber-600" />
                {lang === 'hi' ? 'संरचना विश्लेषण' : 'Parsed Structure'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('rich')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewMode === 'rich' 
                    ? 'bg-white text-slate-900 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'hi' ? 'मूल फ़ॉन्ट व चित्र' : 'Fonts & Images View'}
              </button>
            </div>
          </div>

          {/* Detailed Preview Content according to previewMode */}
          {previewMode === 'rich' ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'मूल फ़ॉन्ट स्टाइल, रंग, तालिका एवं चित्र पूर्वावलोकन:' : 'Original Font Styles, Colors, Tables & Images:'}</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Word HTML Active
                </span>
              </div>
              <div 
                className="rich-word-content p-4 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 max-h-96 overflow-y-auto shadow-inner"
                dangerouslySetInnerHTML={{ __html: parsedResult.rawCleanHtml }}
              />
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-xs">
              {/* Title */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {lang === 'hi' ? 'पहचाना गया शीर्षक (Detected Title):' : 'Detected Title:'}
                </span>
                <p className="font-serif font-bold text-slate-900 text-sm">
                  {parsedResult.title_hindi || parsedResult.title_english || (lang === 'hi' ? 'शीर्षक उपलब्ध नहीं (मैन्युअल दर्ज करें)' : 'No title detected')}
                </p>
              </div>

              {/* Authors */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {lang === 'hi' ? 'लेखक एवं संस्थान (Authors & Affiliations):' : 'Authors & Affiliations:'}
                </span>
                <div className="space-y-1">
                  {parsedResult.authors.map((au, i) => (
                    <p key={i} className="text-slate-800 font-medium">
                      {i + 1}. <strong>{au.name}</strong> — {au.affiliation} {au.email ? `(${au.email})` : ''}
                    </p>
                  ))}
                </div>
              </div>

              {/* Abstract preview */}
              {(parsedResult.abstract_hindi || parsedResult.abstract_english) && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? 'सार (Abstract Preview):' : 'Abstract Preview:'}
                  </span>
                  <p className="text-slate-700 line-clamp-3 leading-relaxed">
                    {parsedResult.abstract_hindi || parsedResult.abstract_english}
                  </p>
                </div>
              )}

              {/* References preview */}
              {parsedResult.references.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {lang === 'hi' ? `पहचाने गए संदर्भ (${parsedResult.references.length} References):` : `Detected References (${parsedResult.references.length}):`}
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 max-h-24 overflow-y-auto">
                    {parsedResult.references.slice(0, 5).map((ref, idx) => (
                      <li key={idx} className="line-clamp-1">{ref}</li>
                    ))}
                    {parsedResult.references.length > 5 && (
                      <li className="text-slate-400 font-style-italic list-none pt-1">
                        + {parsedResult.references.length - 5} {lang === 'hi' ? 'अन्य संदर्भ...' : 'more references...'}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setParsedResult(null)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
            >
              {lang === 'hi' ? 'रद्द करें / पुनः प्रयास करें' : 'Reset / Try Again'}
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all animate-pulse hover:animate-none"
            >
              <FileCheck className="w-4 h-4" />
              {lang === 'hi' ? 'जर्नल टेम्पलेट में लागू करें (Apply to Article Template)' : 'Apply to Journal Template'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
