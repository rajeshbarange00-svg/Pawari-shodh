import React, { useState, useRef } from 'react';
import { Download, FileText, Printer, X, Loader2, Sparkles, ShieldCheck, BookOpen, Globe, Award } from 'lucide-react';
import { Article } from '../../types';

interface AcademicPdfExporterProps {
  article: Article;
  buttonLabel?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  lang?: 'hi' | 'en';
}

export const AcademicPdfExporter: React.FC<AcademicPdfExporterProps> = ({
  article,
  buttonLabel,
  variant = 'primary',
  lang = 'hi'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressText, setProgressText] = useState('');
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Download PDF Handler
  const handleGeneratePdf = async () => {
    if (!printContainerRef.current) return;
    setIsGenerating(true);
    setProgressText(lang === 'hi' ? 'पीडीएफ लाइब्रेरी लोड हो रही है...' : 'Loading PDF Engine...');

    try {
      const element = printContainerRef.current;
      
      const [jspdfModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas-pro')
      ]);

      const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default?.jsPDF || (jspdfModule as any).default;
      const html2canvas = (html2canvasModule as any).default || html2canvasModule;

      if (!jsPDF || typeof jsPDF !== 'function') {
        throw new Error('jsPDF constructor not resolved');
      }

      setProgressText(lang === 'hi' ? 'अंतर्राष्ट्रीय प्रारूप में पृष्ठ तैयार हो रहे हैं...' : 'Typesetting Pages...');

      const fullHeight = element.scrollHeight || element.offsetHeight;
      const fullWidth = element.offsetWidth || 794;

      // Render high-resolution crisp canvas of full element
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution sharp text
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: fullWidth,
        height: fullHeight,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('printable-typeset-paper');
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.overflow = 'visible';
          }
          const styleEls = clonedDoc.querySelectorAll('style');
          styleEls.forEach((style) => {
            if (style.textContent && /oklch/i.test(style.textContent)) {
              style.textContent = style.textContent.replace(/oklch\([^)]+\)/gi, '#78350f');
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Page 1
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Subsequent Pages
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `${(article.title_english || article.title_hindi || 'Pawari_Shodh_Patrika_Paper')
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .slice(0, 35)}_Typeset.pdf`;

      pdf.save(fileName);
      setIsGenerating(false);
      setProgressText('');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert(lang === 'hi' ? 'पीडीएफ प्रिंटर सक्रिय किया जा रहा है। कृपया "Save as PDF" चुनें।' : 'Opening print window to Save as PDF...');
      window.print();
      setIsGenerating(false);
      setProgressText('');
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Extract author list string
  const authorsText = article.authors && article.authors.length > 0
    ? article.authors.map(a => a.name_hindi || a.name_english || a.name || '').filter(Boolean).join(', ')
    : 'शोधकर्ता / Research Author';

  // Sections
  const sections = article.sections && article.sections.length > 0
    ? article.sections
    : [
        { id: '1', section_type: 'abstract', section_title: 'Abstract (सार)', content_html: `<p>${article.abstract_hindi || article.abstract_english || ''}</p>` },
        { id: '2', section_type: 'keywords', section_title: 'Keywords (कुंजी शब्द)', content_html: `<p>${(article.keywords || []).join(', ')}</p>` },
        { id: '3', section_type: 'introduction', section_title: '1. Introduction (प्रस्तावना)', content_html: article.full_text_introduction || '<p>प्रस्तावना का विवरण...</p>' },
        { id: '4', section_type: 'literature_review', section_title: '2. Literature Review (साहित्य अवलोकन)', content_html: article.full_text_literature_review || '' },
        { id: '5', section_type: 'methodology', section_title: '3. Methodology (कार्यप्रणाली)', content_html: article.full_text_methodology || '' },
        { id: '6', section_type: 'results', section_title: '4. Results & Discussion (परिणाम व विवेचना)', content_html: article.full_text_results_discussion || '' },
        { id: '7', section_type: 'conclusion', section_title: '5. Conclusion (निष्कर्ष)', content_html: article.full_text_conclusion || '' },
        { id: '8', section_type: 'references', section_title: 'References (संदर्भ सूची)', content_html: article.references && article.references.length > 0 ? `<ol>${article.references.map(r => `<li>${r.title} ${r.authors} (${r.year}).</li>`).join('')}</ol>` : '' }
      ].filter(s => s.content_html);

  return (
    <>
      {/* Trigger Button */}
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-xl transition cursor-pointer"
          title={lang === 'hi' ? 'जर्नल टाइप्सेट PDF डाउनलोड करें' : 'Download Typeset Academic PDF'}
        >
          <FileText className="w-5 h-5" />
        </button>
      ) : variant === 'outline' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2 border border-amber-600 text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-700" />
          <span>{buttonLabel || (lang === 'hi' ? 'Typeset PDF डाउनलोड' : 'Download Typeset PDF')}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-800 to-red-900 hover:from-amber-900 hover:to-red-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{buttonLabel || (lang === 'hi' ? 'अंतर्राष्ट्रीय टाइप्सेट PDF डाउनलोड' : 'Download International Typeset PDF')}</span>
        </button>
      )}

      {/* PDF Typeset Preview & Download Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:overflow-visible">
          
          {/* Modal Toolbar (Hidden during print) */}
          <div className="w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-2xl p-3 px-5 mb-4 flex flex-wrap items-center justify-between gap-3 text-white shadow-2xl sticky top-2 z-20 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600/30 border border-amber-500/50 rounded-xl flex items-center justify-center text-amber-300 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-amber-300">
                  {lang === 'hi' ? 'पवारी शोध पत्रिका — अंतर्राष्ट्रीय टाइप्सेट लेआउट' : 'Pawari Shodh Patrika — International Typeset Layout'}
                </h3>
                <p className="text-[11px] text-slate-300 font-mono">
                  ISSN: 2583-8422 (Online & Print) | Peer-Reviewed Refereed Journal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-600 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-300" />
                <span>प्रिंट (Print Paper)</span>
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGeneratePdf}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-800 hover:from-amber-500 hover:to-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progressText}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>केवल शोध पत्र डाउनलोड करें (Download Paper PDF)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Typeset Article Canvas Container (International Journal Format A4) */}
          <div className="w-full max-w-4xl bg-slate-200 p-2 sm:p-6 rounded-3xl overflow-x-auto shadow-2xl flex justify-center print:p-0 print:bg-white print:shadow-none print:rounded-none">
            
            <div
              ref={printContainerRef}
              id="printable-typeset-paper"
              className="bg-white text-slate-900 shadow-xl p-8 sm:p-14 w-[794px] min-h-[1123px] font-serif text-sm leading-relaxed border border-slate-300 relative select-text print:w-full print:shadow-none print:border-none print:p-0"
              style={{ fontFamily: 'Noto Serif Devanagari, Georgia, serif' }}
            >
              {/* International Journal Header / Letterhead */}
              <div className="border-b-2 border-amber-950 pb-5 mb-6 text-center space-y-2">
                
                {/* Top ISSN & Indexing Ribbon */}
                <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-700 border-b border-amber-900/20 pb-2.5 mb-3">
                  <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                    <Globe className="w-3.5 h-3.5 text-amber-800" />
                    <span>PAWARI SHODH PATRIKA</span>
                  </div>
                  <span className="font-mono text-slate-800">ISSN (Online / Print): 2583-8422</span>
                  <div className="flex items-center gap-1 text-emerald-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Double-Blind Peer-Reviewed</span>
                  </div>
                </div>

                {/* Journal Official Crest Title */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center font-bold text-lg border-2 border-amber-700 shadow-xs">
                    प
                  </div>
                  <div>
                    <h1 className="font-serif font-black text-2xl sm:text-3xl text-amber-950 tracking-tight leading-none">
                      पवारी शोध पत्रिका (Pawari Shodh Patrika)
                    </h1>
                    <p className="text-[11px] font-sans font-semibold text-slate-700 tracking-wider uppercase pt-1">
                      An International Peer-Reviewed Refereed Multidisciplinary Research Journal
                    </p>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-200 mt-2">
                  <strong>Volume {article.volume || 1}</strong>, <strong>Issue {article.issue || 1}</strong> ({article.year || 2026}) | <strong>Pages:</strong> {article.page_numbers || '01–15'} | <strong>DOI:</strong> {article.doi || '10.5281/zenodo.psp.2026.01'}
                </p>
                <p className="text-[10px] font-sans text-slate-500">
                  Published by: <strong>Maa Tapti Shodh Sansthan, Multai (MP), India</strong> | Open Access Journal
                </p>
              </div>

              {/* Article Title & Metadata Section */}
              <div className="mb-6 space-y-3">
                
                {/* Article Type Pill */}
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-md text-[10px] font-sans font-bold uppercase tracking-widest">
                  {article.article_type || 'ORIGINAL RESEARCH PAPER / मूल शोध आलेख'}
                </div>

                {/* Main Titles */}
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-950 leading-snug tracking-tight">
                  {article.title_hindi || article.title_english || 'शोध आलेख शीर्षक'}
                </h2>

                {article.title_english && article.title_hindi && (
                  <h3 className="font-serif font-semibold text-base text-slate-700 italic leading-snug">
                    {article.title_english}
                  </h3>
                )}

                {/* Authors & Institutional Credentials */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5">
                  <p className="font-sans font-bold text-sm text-slate-900 flex flex-wrap items-center gap-2">
                    <span>{authorsText}</span>
                  </p>
                  
                  {article.authors && article.authors.length > 0 && (
                    <div className="font-sans text-xs text-slate-600 space-y-0.5">
                      {article.authors.map((auth, aIdx) => (
                        <p key={aIdx}>
                          {auth.affiliation && <span>{auth.affiliation}</span>}
                          {auth.email && <span className="ml-2 font-mono text-[11px] text-amber-900">({auth.email})</span>}
                          {auth.orcid && <span className="ml-2 font-mono text-[10px] text-emerald-800">| ORCID: {auth.orcid}</span>}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article Processing Dates Banner */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 px-3 text-[11px] font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <span><strong>Received:</strong> {article.date_received || article.submitted_date || '2026-01-10'}</span>
                  <span><strong>Accepted:</strong> {article.date_published || '2026-01-25'}</span>
                  <span><strong>Published Online:</strong> {article.date_published || '2026-02-01'}</span>
                </div>
              </div>

              {/* Abstract Box */}
              {(article.abstract_hindi || article.abstract_english) && (
                <div className="bg-slate-50 border-l-4 border-amber-900 p-4 rounded-r-xl mb-8 space-y-2 text-xs border-y border-r border-slate-200">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                    <span>Abstract / सार:</span>
                  </h4>
                  {article.abstract_hindi && (
                    <p className="font-serif text-slate-900 leading-relaxed text-justify">
                      {article.abstract_hindi}
                    </p>
                  )}
                  {article.abstract_english && (
                    <p className="font-serif text-slate-800 italic leading-relaxed text-justify pt-1 border-t border-slate-200">
                      {article.abstract_english}
                    </p>
                  )}
                  {article.keywords && article.keywords.length > 0 && (
                    <p className="font-sans text-[11px] font-bold text-amber-950 pt-2 border-t border-slate-200">
                      Keywords / कुंजी शब्द: <span className="font-normal font-serif text-slate-800">{article.keywords.join(', ')}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Main Full-Text Sections */}
              <div className="space-y-6 text-slate-900 leading-relaxed text-justify">
                {sections.map((sec, idx) => {
                  if (sec.section_type === 'abstract' || sec.section_type === 'keywords') return null;
                  return (
                    <div key={sec.id || idx} className="space-y-2">
                      <h3 className="font-serif font-bold text-base text-amber-950 border-b-2 border-amber-900/20 pb-1 uppercase tracking-wide">
                        {sec.section_title}
                      </h3>
                      <div
                        className="typeset-html-content text-sm space-y-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sec.content_html || '' }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Conflict of Interest & Ethics */}
              {article.full_text_conflict_of_interest && (
                <div className="mt-8 pt-4 border-t border-slate-300 text-xs text-slate-700">
                  <p className="font-bold font-sans text-slate-900 mb-0.5">Conflict of Interest (हित-संघर्ष):</p>
                  <p>{article.full_text_conflict_of_interest}</p>
                </div>
              )}

              {/* International Open Access Licensing Footer */}
              <div className="mt-12 border-t-2 border-amber-950 pt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
                <span>© {article.year || 2026} Pawari Shodh Patrika • Creative Commons CC-BY 4.0 International License</span>
                <span className="font-bold text-amber-950">https://pawarishodhpatrika.org</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strict Print CSS Rule: Hide ALL background web interface elements, print ONLY the article paper */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
            height: auto !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-typeset-paper, #printable-typeset-paper * {
            visibility: visible !important;
          }
          #printable-typeset-paper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </>
  );
};
