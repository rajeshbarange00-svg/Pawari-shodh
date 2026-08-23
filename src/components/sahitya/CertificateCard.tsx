import React from 'react';
import { Award, Sparkles, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { QuizCertificate } from '../../types';
import { getQuizPerformanceGrade } from '../../data/quizQuestionBank';

export interface CertificateCardProps {
  certificate: QuizCertificate;
  id?: string;
  patronName?: string;
  patronRole?: string;
  chiefEditorName?: string;
  chiefEditorRole?: string;
  className?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  id = 'pawari-official-certificate-canvas',
  patronName = 'डॉ. कैलाश पवार',
  patronRole = 'शोध निदेशक एवं मुख्य संरक्षक',
  chiefEditorName = 'प्रो. (डॉ.) रमाकांत शर्मा',
  chiefEditorRole = 'मुख्य संपादक, पवारी शोध पत्रिका',
  className = ''
}) => {
  const gradeInfo = getQuizPerformanceGrade(certificate.percentage);
  const verificationUrl = certificate.verification_url || `${typeof window !== 'undefined' ? window.location.origin : 'https://pawari-shodh-patrika.org'}/quiz?cert=${certificate.certificate_no}`;

  return (
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      {/* 
        Fixed coordinate base (1120px x 792px A4 Landscape Aspect Ratio ~1.414).
        We scale this smoothly on smaller mobile screens while keeping exact pixel dimensions for html2canvas export!
      */}
      <div className="w-full max-w-[1120px] overflow-x-auto p-1 sm:p-2 bg-stone-900/5 rounded-3xl">
        <div
          id={id}
          className="printable-certificate relative bg-gradient-to-br from-[#FFFDF8] via-[#FDF9EE] to-[#F7EED8] text-stone-900 border-[10px] sm:border-[14px] border-double border-[#881337] shadow-2xl p-6 sm:p-10 md:p-14 select-none font-serif text-center mx-auto"
          style={{
            minWidth: '780px',
            maxWidth: '1120px',
            aspectRatio: '1.414 / 1',
            boxSizing: 'border-box'
          }}
        >
          {/* Subtle Background Watermark Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none font-black text-7xl sm:text-9xl text-stone-950 uppercase tracking-widest leading-none rotate-[-12deg]">
            माँ ताप्ती पवारी शोध संस्थान
          </div>

          {/* Inner Golden Border Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-amber-600/50 rounded-xl sm:rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-amber-500/30 rounded-lg sm:rounded-xl pointer-events-none" />

          {/* Corner Ornamental Filigree */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-amber-700/80 flex items-start justify-start p-1 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
          </div>
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-amber-700/80 flex items-start justify-end p-1 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-amber-700/80 flex items-end justify-start p-1 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-amber-700/80 flex items-end justify-end p-1 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
          </div>

          {/* TOP INSTITUTION BANNER */}
          <div className="relative z-10 space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-amber-100/90 border border-amber-400/80 text-amber-950 font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-800 shrink-0" />
              <span>🚩 माँ ताप्ती पवारी शोध संस्थान, मुलताई (बैतूल) • म.प्र. 🚩</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-[#881337] tracking-tight leading-tight drop-shadow-2xs">
              पवारी भोयरी संस्कृति ज्ञान ई-प्रमाण-पत्र
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm text-stone-700 font-sans tracking-wide uppercase font-semibold">
              पवारी शोध पत्रिका (अंतर्राष्ट्रीय डिजिटल शोध व साहित्य अभिलेखागार) • National Cultural Heritage Assessment
            </p>
          </div>

          {/* CANDIDATE AWARD CITATION */}
          <div className="relative z-10 my-3 sm:my-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-8 sm:w-16 bg-amber-600/40" />
              <p className="text-[10px] sm:text-xs text-amber-950/80 font-sans uppercase tracking-widest font-bold">
                यह प्रमाण-पत्र ससम्मान प्रदान किया जाता है (This is Proudly Presented To):
              </p>
              <span className="h-px w-8 sm:w-16 bg-amber-600/40" />
            </div>

            <div className="py-0.5 sm:py-1">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-stone-900 tracking-tight underline decoration-amber-500/80 underline-offset-8">
                {certificate.user_name}
              </h2>
            </div>
          </div>

          {/* FORMAL CITATION BODY */}
          <div className="relative z-10 max-w-3xl mx-auto my-3 sm:my-5 bg-white/75 backdrop-blur-xs p-3 sm:p-5 rounded-2xl border border-amber-300/80 shadow-xs">
            <p className="text-xs sm:text-sm md:text-base text-stone-800 leading-relaxed font-serif">
              जिन्होंने माँ ताप्ती पवारी शोध संस्थान द्वारा आयोजित <strong className="text-red-950 font-bold">"पवारी भोयरी संस्कृति ज्ञान परीक्षा"</strong> (शब्दकोश, पारम्परिक पहेलियाँ, लोकगीत, ग्रन्थ साहित्य एवं शोध समीक्षा) में निष्ठापूर्वक भाग लेकर
              <strong className="text-red-950 font-bold mx-1.5 px-2 py-0.5 rounded-md bg-amber-100/80 border border-amber-300">
                {certificate.percentage}% अंक ({certificate.quiz_score}/{certificate.total_questions})
              </strong>
              प्राप्त किए हैं तथा 
              <span className="inline-block mx-1 font-sans font-bold text-amber-900">
                ★ {gradeInfo.gradeHindi} ★
              </span>
              के साथ विशिष्ट योग्यता अर्जित की है।
            </p>
          </div>

          {/* FOOTER SECTION: SIGNATURES, SEAL & VERIFICATION QR */}
          <div className="relative z-10 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-amber-900/20 font-sans">
            <div className="grid grid-cols-3 items-end justify-between gap-3 sm:gap-6">
              
              {/* CHIEF EDITOR SIGNATURE */}
              <div className="text-left space-y-1">
                <div className="inline-block border-b-2 border-stone-800/80 pb-0.5 font-serif text-xs sm:text-base font-extrabold text-stone-900">
                  {chiefEditorName}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-stone-800">
                  {chiefEditorRole}
                </div>
                <div className="text-[9px] sm:text-[10px] text-stone-600">
                  पवारी शोध पत्रिका (संपादक मंडल)
                </div>
              </div>

              {/* CENTER: OFFICIAL GOLD EMBLEM & CERTIFICATE ID */}
              <div className="flex flex-col items-center justify-center space-y-1 sm:space-y-1.5">
                {/* Official Stamp / Seal */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-100 text-amber-950 p-1 shadow-md border-2 border-amber-600 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-900/80 p-0.5 flex flex-col items-center justify-center text-center bg-amber-200/90 shadow-inner">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
                    <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tight leading-none text-amber-950 mt-0.5">
                      माँ ताप्ती पवारी
                    </span>
                    <span className="text-[5px] sm:text-[6px] font-bold text-amber-900 uppercase">
                      शोध संस्थान 2026
                    </span>
                    <span className="text-[5px] sm:text-[6px] font-black text-amber-950 border-t border-amber-800/40 pt-0.5 mt-0.5 w-full">
                      ★ अधिकृत ई-मुद्रा ★
                    </span>
                  </div>
                </div>

                {/* Certificate Number & Date Badge */}
                <div className="bg-amber-100/90 border border-amber-300/90 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-center shadow-2xs">
                  <div className="text-stone-900 font-mono font-bold text-[9px] sm:text-[11px]">
                    प्रमाण-पत्र क्र.: {certificate.certificate_no}
                  </div>
                  <div className="text-stone-700 text-[8px] sm:text-[9px] font-mono">
                    जारी दिनांक: {certificate.issued_date}
                  </div>
                </div>
              </div>

              {/* PATRON / RESEARCH DIRECTOR SIGNATURE */}
              <div className="text-right space-y-1">
                <div className="inline-block border-b-2 border-stone-800/80 pb-0.5 font-serif text-xs sm:text-base font-extrabold text-stone-900">
                  {patronName}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-stone-800">
                  {patronRole}
                </div>
                <div className="text-[9px] sm:text-[10px] text-stone-600">
                  माँ ताप्ती पवारी शोध संस्थान, मुलताई
                </div>
              </div>

            </div>

            {/* Bottom Security & Digital Verification Tag */}
            <div className="mt-3 pt-2 border-t border-amber-900/10 flex flex-wrap items-center justify-between text-[8px] sm:text-[10px] text-stone-500 font-mono">
              <div className="flex items-center gap-1 text-emerald-800 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>डिजिटल रूप से प्रमाणित एवं आर्काइव्ड (Cryptographically Verified)</span>
              </div>
              <div>
                ऑनलाइन सत्यापन: {verificationUrl.replace(/^https?:\/\//, '')}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
