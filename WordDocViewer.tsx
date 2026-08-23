import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { FileText, Download, Loader2, BookOpen, ExternalLink } from 'lucide-react';
import { Article } from '../../types';
import { cleanWordHtml } from '../../lib/wordParser';

interface WordDocViewerProps {
  url?: string;
  article?: Article;
  lang?: 'hi' | 'en';
  onDownload?: () => void;
  className?: string;
}

export const WordDocViewer: React.FC<WordDocViewerProps> = ({
  url,
  article,
  lang = 'hi',
  onDownload,
  className = 'min-h-[500px]'
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadWordDoc() {
      setLoading(true);
      setErrorMsg(null);

      try {
        if (!url && !article) {
          throw new Error('No document source provided');
        }

        // If article has full text content, build mammoth-style structured HTML view
        if (article && (article.full_text_introduction || article.abstract_english)) {
          let built = `
            <div class="space-y-6 p-6 sm:p-10 bg-white rounded-2xl shadow-sm border border-slate-200">
              <div class="text-center border-b border-slate-200 pb-6 mb-6">
                <span class="px-3 py-1 bg-amber-100 text-amber-950 text-xs font-bold rounded-full">MS Word (.docx) Manuscript Source</span>
                <h1 class="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-3">${lang === 'hi' ? article.title_hindi : article.title_english}</h1>
                <p class="text-sm text-slate-600 mt-1">${article.authors.map(a => a.name).join(', ')} (${article.year})</p>
              </div>

              <div class="space-y-4">
                <h3 class="font-bold text-red-950 font-serif text-lg">Abstract</h3>
                <p class="text-slate-800 text-sm leading-relaxed text-justify bg-slate-50 p-4 rounded-xl border border-slate-200">${lang === 'hi' ? article.abstract_hindi : article.abstract_english}</p>
          `;

          if (article.full_text_introduction) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">1. Introduction (परिचय)</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_introduction}</div>`;
          if (article.full_text_literature_review) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">2. Literature Review (साहित्य समीक्षा)</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_literature_review}</div>`;
          if (article.full_text_methodology) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">3. Methodology (शोध प्रणाली)</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_methodology}</div>`;
          if (article.full_text_results_discussion) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">4. Results & Discussion (परिणाम व चर्चा)</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_results_discussion}</div>`;
          if (article.full_text_conclusion) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">5. Conclusion (निष्कर्ष)</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_conclusion}</div>`;
          if (article.full_text_acknowledgement) built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">6. Acknowledgement</h3><div class="text-slate-800 text-sm leading-relaxed text-justify">${article.full_text_acknowledgement}</div>`;
          
          if (article.references && article.references.length > 0) {
            built += `<h3 class="font-bold text-red-950 font-serif text-lg mt-6">References (संदर्भ ग्रंथ)</h3><ul class="list-decimal pl-5 space-y-2 text-xs font-mono text-slate-800">`;
            article.references.forEach(ref => {
              built += `<li>${ref}</li>`;
            });
            built += `</ul>`;
          }

          built += `</div></div>`;
          if (isMounted) {
            setHtmlContent(built);
            setLoading(false);
          }
          return;
        }

        if (url) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const cleaned = cleanWordHtml(result.value);

          if (isMounted) {
            setHtmlContent(`
              <div class="p-6 sm:p-10 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div class="flex items-center justify-between border-b pb-4 mb-4">
                  <span class="px-3 py-1 bg-amber-100 text-amber-950 text-xs font-bold rounded-full">MS Word Document Viewer</span>
                  <span class="text-xs font-mono text-slate-500">${url.split('/').pop() || 'document.docx'}</span>
                </div>
                <div class="rich-word-content text-slate-800 leading-relaxed font-sans text-justify space-y-4">
                  ${cleaned}
                </div>
              </div>
            `);
            setLoading(false);
          }
        } else {
          throw new Error('No valid Word source');
        }
      } catch (err: any) {
        console.warn('WordDocViewer load error:', err);
        if (isMounted) {
          setHtmlContent(`
            <div class="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm my-auto">
              <div class="w-16 h-16 bg-blue-50 text-blue-900 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
                📝
              </div>
              <h3 class="text-lg font-bold text-slate-900">Word Document Preview / Download</h3>
              <p class="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                यह शोध पत्र Microsoft Word (.docx / .doc) प्रारूप में उपलब्ध है। आप इसे सीधे ब्राउज़र में खोल सकते हैं या डाउनलोड कर सकते हैं।
              </p>
              <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                ${url ? `
                  <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 text-xs font-bold rounded-xl shadow transition">
                    <span>नई विंडो में खोलें (Open File)</span>
                  </a>
                  <a href="${url}" download="document.docx" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow transition">
                    <span>डच फ़ाइल डाउनलोड करें (Download File)</span>
                  </a>
                ` : `
                  <span class="text-xs text-slate-500 italic">No direct file URL provided for this manuscript.</span>
                `}
              </div>
            </div>
          `);
          setLoading(false);
        }
      }
    }

    loadWordDoc();

    return () => {
      isMounted = false;
    };
  }, [url, article, lang]);

  return (
    <div className={`w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto ${className}`}>
      {loading && (
        <div className="flex flex-col items-center justify-center h-[350px] space-y-3 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-xs font-mono font-bold text-slate-700">
            {lang === 'hi' ? 'Word डॉक्यूमेंट लोड हो रहा है...' : 'Loading Word Document Viewer...'}
          </p>
        </div>
      )}

      {!loading && (
        <div 
          className="animate-in fade-in duration-200"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
};
