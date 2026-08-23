import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { FileText, CheckCircle2, AlertCircle, Send, ShieldAlert, FileDown, Layers, FileCheck } from 'lucide-react';

export const AuthorGuidelinesView: React.FC = () => {
  const { lang, pages, settings, setActiveView } = useCms();
  const page = pages['author_guidelines'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-10 shadow-md border border-amber-500/30">
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'शोधकर्ताओं एवं लेखकों के लिए दिशानिर्देश' : 'Guidelines for Authors & Contributors'}
        </h1>
        <p className="text-sm text-amber-200/80 mt-2">
          {lang === 'hi' 
            ? 'पांडुलिपि तैयार करने, संरचना, सन्दर्भ सूची (APA) तथा जमा करने संबंधी संपूर्ण नियम।'
            : 'Manuscript structure, formatting rules, APA citation style, and submission process.'}
        </p>
      </div>

      {/* Quick Downloads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition group text-left w-full cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <span>{lang === 'hi' ? 'पांडुलिपि टेम्पलेट (Word)' : 'Manuscript Template (Word)'}</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">.DOCX / .DOC</span>
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'मानक प्रारूप में शोध पत्र लिखने हेतु (डाउनलोड करें)' : 'Standard format for writing research paper (Click to download)'}
              </p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group text-left w-full cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white transition">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                <span>{lang === 'hi' ? 'कॉपीराइट एवं स्वघोषणा पत्र' : 'Copyright & Declaration Form'}</span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.5 rounded">.DOC / .PDF</span>
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'हस्ताक्षरित प्रति अनिवार्य है (डाउनलोड करें)' : 'Signed copy is mandatory (Click to download)'}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Rules Section Card */}
          <div className="bg-white border border-amber-900/10 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-amber-900/10 pb-4">
              <h2 className="text-2xl font-serif font-bold text-red-950 flex items-center space-x-2">
                <FileText className="w-6 h-6 text-amber-600" />
                <span>{lang === 'hi' ? 'शोध पत्र प्रस्तुतिकरण नियम' : 'Manuscript Submission Rules'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'hi' ? 'अंतर्राष्ट्रीय शोध मानकों के अनुसार पांडुलिपि तैयार करने के निर्देश' : 'Guidelines for manuscript preparation according to international standards'}
              </p>
            </div>

            {page && (page.content_hindi || page.content_english) ? (
              <div className="prose prose-amber max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4">
                {(lang === 'hi' ? page.content_hindi : page.content_english)
                  .replace(/[*_#'`]/g, '')
                  .split('\n')
                  .filter(line => line.trim().length > 0)
                  .map((line, idx) => {
                    const isHeading = line.startsWith('शोध पत्र') || line.startsWith('Manuscript Preparation');
                    if (isHeading) {
                      return (
                        <h3 key={idx} className="text-lg font-bold font-serif text-amber-950 pt-2 border-b border-amber-100 pb-1">
                          {line}
                        </h3>
                      );
                    }
                    return (
                      <div key={idx} className="flex items-start space-x-2.5 text-slate-700 leading-relaxed text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    );
                  })}
              </div>
            ) : null}

            {/* Structured Guidelines Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/40 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? 'भाषा एवं फ़ॉन्ट' : 'Language & Font'}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' 
                    ? 'हिंदी (मङ्गल / यूनिकोड / कृतिदेव 010), पवारी अथवा अंग्रेजी (Times New Roman, 12pt)।' 
                    : 'Hindi (Unicode / Mangal / Krutidev 010), Pawari, or English (Times New Roman, 12pt).'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/40 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? 'शब्द सीमा' : 'Word Limit'}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' 
                    ? 'शोध पत्र: 3000 से 5000 शब्द। सामान्य साहित्यिक लेख: 1000 से 1500 शब्द।' 
                    : 'Research Papers: 3000 to 5000 words. General Articles: 1000 to 1500 words.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/40 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? 'प्लेगेरिज्म नीति' : 'Plagiarism Policy'}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'hi' 
                    ? '10% से कम समरूपता (Similarity Index < 10%) होना अनिवार्य है।' 
                    : 'Similarity index must strictly be below 10%.'}
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/40 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>{lang === 'hi' ? 'प्रकाशन शुल्क (APC)' : 'Article Processing Charges'}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-bold text-emerald-800">
                  {lang === 'hi' 
                    ? 'निःशुल्क (₹ 0 / No APC) - कोई प्रकाशन या सबमिशन शुल्क नहीं है।' 
                    : 'Completely Free (₹ 0 APC) - No submission or publication fee.'}
                </p>
              </div>
            </div>

            {/* Academic Ethics & COPE Compliance Box */}
            <div className="p-5 bg-slate-900 text-amber-100 rounded-2xl border border-amber-500/30 space-y-3">
              <h3 className="font-serif font-bold text-base text-amber-300 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>{lang === 'hi' ? 'प्रकाशन नैतिकता एवं COPE मानक (Ethics & Malpractice)' : 'Publication Ethics (COPE Standards)'}</span>
              </h3>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                {lang === 'hi'
                  ? 'पवारी शोध पत्रिका COPE (Committee on Publication Ethics) के अंतरराष्ट्रीय नैतिक मानकों का पालन करती है। शोध में मौलिकता, डेटा की सत्यता, लेखकों की सहमति, हितों के टकराव (Conflict of Interest) की घोषणा और साहित्यिक चोरी की रोकथाम अनिवार्य है। किसी भी प्रकार की अनैतिकता पाए जाने पर शोध पत्र को तत्काल निरस्त (Retract) किया जाएगा।'
                  : 'Pawari Shodh Patrika adheres to the core practices of the Committee on Publication Ethics (COPE). Authors must ensure originality, accurate citation, proper authorship disclosure, and conflict of interest statements.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Pre-Submission Checklist */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/50 shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif font-bold text-lg text-amber-950">
                {lang === 'hi' ? 'सबमिशन चेकलिस्ट' : 'Pre-Submission Checklist'}
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'शोध पत्र 3000-5000 शब्दों के बीच है।' : 'Manuscript is between 3000-5000 words.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'हिंदी और अंग्रेजी दोनों भाषाओं में सारांश (Abstract) शामिल है।' : 'Abstract is included in both Hindi and English.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'सन्दर्भ APA (7th Edition) शैली में हैं।' : 'References follow APA (7th Edition) style.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'साहित्यिक चोरी (Plagiarism) 10% से कम है।' : 'Plagiarism is less than 10%.'}</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 flex-shrink-0" />
                <span>{lang === 'hi' ? 'स्वघोषणा पत्र संलग्न है।' : 'Self-declaration form is attached.'}</span>
              </li>
            </ul>
          </div>

          {/* Ethics & Review Policy */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-slate-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {lang === 'hi' ? 'डबल-ब्लाइंड पीयर रिव्यू' : 'Peer Review Process'}
              </h3>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                {lang === 'hi' 
                  ? 'पत्रिका डबल-ब्लाइंड पीयर रिव्यू प्रक्रिया का पालन करती है। सभी प्राप्त पांडुलिपियों की समीक्षा न्यूनतम 2 बाह्य विषय विशेषज्ञों द्वारा गोपनीय रूप से की जाती है।' 
                  : 'The journal follows a double-blind peer review process. All submitted manuscripts are reviewed confidentially by at least 2 external subject experts.'}
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold bg-white p-2 rounded-lg border border-slate-200">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>{lang === 'hi' ? 'समीक्षा अवधि: 4-6 सप्ताह' : 'Review Time: 4-6 weeks'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submission Action Box */}
      <div className="bg-amber-500/10 border-2 border-dashed border-amber-500/40 rounded-2xl p-6 sm:p-10 text-center space-y-4">
        <Send className="w-10 h-10 mx-auto text-red-900" />
        <h3 className="text-xl font-serif font-bold text-red-950">
          {lang === 'hi' ? 'अपनी पांडुलिपि (Manuscript) जमा करें' : 'Submit Your Manuscript'}
        </h3>
        <p className="text-sm text-slate-700 max-w-xl mx-auto">
          {lang === 'hi'
            ? `अपनी पूर्ण पांडुलिपि (Word/PDF प्रारूप) द्विभाषी शोध सार सहित हमारे आधिकारिक ईमेल पर भेजें: ${settings.contact_email}`
            : `Email your complete manuscript in Word or PDF format along with bilingual abstract to: ${settings.contact_email}`}
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveView('submit_manuscript')}
            className="inline-flex items-center space-x-2 bg-red-900 hover:bg-red-800 text-amber-100 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition"
          >
            <Send className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पांडुलिपि सबमिट करें' : 'Submit Manuscript Now'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

