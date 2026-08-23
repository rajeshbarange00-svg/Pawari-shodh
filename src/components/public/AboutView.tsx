import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  FileText, 
  Award, 
  Download, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Scale, 
  FileCheck2, 
  UserCheck, 
  Quote, 
  Clock, 
  CheckCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { lang, settings, pages, setActiveView } = useCms();
  const page = pages['about'];

  const [activeTab, setActiveTab] = useState<'paper' | 'specs' | 'workflow' | 'citation'>('paper');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [copiedDoi, setCopiedDoi] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);

  const doiNumber = '10.5281/zenodo.psp.about.2026.001';
  const doiUrl = `https://doi.org/${doiNumber}`;

  // Citation text formats
  const citations = {
    apa: `Pawar, B. L., & Sharma, R. K. (2026). Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework. Pawari Shodh Patrika (पवारी शोध पत्रिका), 1(1), 01–08. https://doi.org/${doiNumber}`,
    mla: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika, vol. 1, no. 1, 2026, pp. 01–08.`,
    chicago: `Pawar, B. L., and R. K. Sharma. "Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework." Pawari Shodh Patrika 1, no. 1 (2026): 01–08.`,
    bibtex: `@article{psp2026about,
  author = {Pawar, B. L. and Sharma, R. K.},
  title = {Pawari Shodh Patrika: Introduction, Multidisciplinary Aims, Scope and Academic Publishing Framework},
  journal = {Pawari Shodh Patrika (पवारी शोध पत्रिका)},
  volume = {1},
  number = {1},
  pages = {01--08},
  year = {2026},
  doi = {${doiNumber}},
  issn = {${settings.issn_online || '2583-9128'}}
}`
  };

  const handleCopyCitation = (type: keyof typeof citations) => {
    navigator.clipboard.writeText(citations[type]);
    setCopiedCitation(type);
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleCopyDoi = () => {
    navigator.clipboard.writeText(doiUrl);
    setCopiedDoi(true);
    setTimeout(() => setCopiedDoi(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- VIEW MODE TABS ----------------- */}
      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2 print:hidden">
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'paper'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पत्रिका परिचय एवं उद्देश्य (About & Scope)' : 'About Journal & Scope'}</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पत्रिका विशिष्टताएँ (Journal Specs)' : 'Journal Specifications'}</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'bg-red-950 text-amber-100 shadow-md'
                : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'पीर रिव्यू प्रक्रिया (Review Workflow)' : 'Review Flowchart'}</span>
          </button>
        </div>

        <button
          onClick={() => setActiveView('author_guidelines')}
          className="hidden md:inline-flex items-center space-x-1.5 text-xs font-bold text-red-900 hover:text-red-700 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 transition"
        >
          <span>{lang === 'hi' ? 'लेखक दिशानिर्देश' : 'Submit Manuscript'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ----------------- TAB 1: JOURNAL OVERVIEW & AIMS & SCOPE ----------------- */}
      {activeTab === 'paper' && (
        <div className="bg-white border-2 border-slate-200/80 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 space-y-10">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-red-950 text-amber-100 px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'शोध पत्रिका का आधिकारिक परिचय' : 'JOURNAL OVERVIEW & AIMS & SCOPE'}
              </span>
              <span className="bg-amber-100 text-amber-950 px-3 py-1 rounded-md font-bold border border-amber-300">
                {lang === 'hi' ? 'द्विभाषी (हिंदी व अंग्रेजी)' : 'Bilingual (Hindi & English)'}
              </span>
              <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md font-bold border border-slate-200">
                Peer-Reviewed
              </span>
              <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md font-bold border border-emerald-200">
                Open Access
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
              {lang === 'hi' ? 'पवारी शोध पत्रिका (Pawari Shodh Patrika)' : 'Pawari Shodh Patrika'}
            </h1>
            
            <p className="text-base sm:text-lg font-serif text-red-950 font-semibold">
              {lang === 'hi' 
                ? 'पवारी भाषा, साहित्य, संस्कृति एवं मध्यप्रदेश तथा समीपवर्ती अंचलों की लोकभाषाओं, जनजातीय परंपराओं व क्षेत्रीय समाजशास्त्र की शोध पत्रिका' 
                : 'A Peer-Reviewed Research Journal of Pawari Language, Literature & Regional Dialects, Folk Culture and Social Heritage of Central India'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-y-2 text-xs text-slate-600 border-t border-slate-100 font-sans">
              <span className="font-semibold text-slate-900">प्रकाशक संस्थान:</span>
              <span className="ml-1">माँ ताप्ती शोध संस्थान, मुलताई (बैतूल, मध्य प्रदेश)</span>
              <span className="mx-2">•</span>
              <span className="font-semibold text-slate-900">प्रकाशन आवृत्ति:</span>
              <span className="ml-1">अर्द्धवार्षिक (Half-Yearly)</span>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '1. पत्रिका का परिचय (About the Journal)' : '1. About the Journal'}</span>
            </h2>

            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-justify font-serif text-slate-900">
              <p>
                मध्य भारत की सतपुड़ा पर्वतमाला, वैनगंगा तथा नर्मदा नदी घाटी का भौगोलिक अंचल भाषिक, ऐतिहासिक एवं सांस्कृतिक दृष्टि से अत्यंत समृद्ध और विविधतापूर्ण है। इस अंचल में निवास करने वाले समाज द्वारा बोली जाने वाली <strong>पवारी (भोयरी/पंवारी) भाषा</strong> इंडो-आर्यन भाषा परिवार का एक अत्यंत विशिष्ट एवं समृद्ध रूप है, जो ऐतिहासिक रूप से मालवा, राजस्थान एवं मध्य भारत के परिदृश्य से जुड़ी रही है।
              </p>

              <p>
                <strong>पवारी शोध पत्रिका (Pawari Shodh Patrika)</strong> पवारी भाषा, साहित्य, इतिहास और संस्कृति के गहन अध्ययन को केंद्रीय पीठ मानने के साथ-साथ मध्यप्रदेश एवं समीपवर्ती अंचलों की विभिन्न बोलियों, लोकभाषाओं (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी), जनजातीय भाषिक परंपराओं (गोंडी, कोरकू, नहाली/निहाली, भीली, भिलाली, बरेली) तथा क्षेत्रीय समाजशास्त्र पर शोध प्रोत्साहन हेतु स्थापित एक द्विभाषी (हिंदी व अंग्रेजी) पीर-रिव्यूड (Peer-Reviewed) अकादमिक मंच है।
              </p>

              <p>
                यह पत्रिका केवल भाषाई विवरणों तक सीमित न रहकर इतिहास, समाजशास्त्र, लोककला, मौखिक परंपराओं, पुरालेखों, वंशावली अध्ययनों, कृषि-संस्कृति तथा परंपरावादी लोकज्ञान प्रणालियों (Ethno-Knowledge) को समेटते हुए एक बहुविषयी शोध पीठ के रूप में कार्य करती है।
              </p>
            </div>
          </section>

          {/* Section 2: Aims & Objectives */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <Award className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '2. प्रमुख उद्देश्य एवं शोध दायरा (Aims & Objectives / Scope)' : '2. Aims & Scope'}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {lang === 'hi' 
                ? 'पत्रिका शोधकर्ताओं, विद्वानों, भाषाविदों एवं समाजशास्त्रियों से निम्नलिखित प्रमुख क्षेत्रों में मौलिक, अप्रकाशित एवं गुणवत्तापूर्ण शोध पत्रों का स्वागत करती है:'
                : 'The journal invites original, unpublished, and peer-reviewed research papers across the following core thematic domains:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'पवारी भाषा, साहित्य एवं व्याकरण' : 'Pawari Language & Literature'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  पवारी (भोयरी/पंवारी) भाषा का ध्वनिविज्ञान (Phonetics), व्याकरणिक संरचना, शब्दकोश निर्माण, लोकसाहित्य, इतिहास, सांस्कृतिक धरोहर तथा मौखिक इतिहास का वैज्ञानिक विश्लेषण।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'मध्यप्रदेश की बोलियाँ एवं लोकभाषाएँ' : 'Regional Dialects of MP'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  राजस्थानी, मालवी, निमाड़ी, बुन्देली, बघेली एवं मध्य भारत के अंचल में बोली जाने वाली विभिन्न उपभाषाओं व स्थानीय भाषाई रूपों का विश्लेषणात्मक व साहित्यिक अध्ययन।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'जनजातीय भाषिक एवं सांस्कृतिक अध्ययन' : 'Tribal Linguistics & Culture'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  गोंडी, कोरकू, नहाली (निहाली), भीली, भिलाली, बरेली तथा अन्य अल्पप्रचलित व संकटग्रस्त जनजातीय भाषिक परंपराओं एवं सांस्कृतिक ज्ञान प्रणालियों का संरक्षण व अध्ययन।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'लोकसाहित्य एवं मौखिक परंपराएँ' : 'Folklore & Oral Traditions'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  लोकगीत, अनुष्ठानिक गायन, लोककथाएँ, लोकनाट्य, गाथाएँ, कहावतें, मुहावरे, लोकोक्तियाँ तथा जनस्मृतियों एवं वाचिक परंपराओं का प्रामाणिक दस्तावेजीकरण।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'इतिहास, पुरालेख व वंशावली अध्ययन' : 'History, Epigraphy & Lineage'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  क्षेत्रीय सामाजिक इतिहास, ताम्रपत्र, अभिलेख, वंश व गोत्र अध्ययन, नृवंशविज्ञान (Ethnography), ग्रामीण समाजशास्त्र तथा क्षेत्रीय ऐतिहासिक साक्ष्यों का अनुसंधान।
                </p>
              </div>

              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center space-x-2 text-red-950 font-bold font-serif text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3>{lang === 'hi' ? 'तुलनात्मक भाषाविज्ञान व प्रलेखन' : 'Comparative Linguistics & Archiving'}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  तुलनात्मक भाषाविज्ञान, अनुवाद अध्ययन, शब्दकोश निर्माण, पाठ-संपादन, अप्रकाशित अभिलेखीय स्रोतों व पांडुलिपियों का अध्ययन एवं डिजिटल संरक्षण।
                </p>
              </div>

            </div>
          </section>

          {/* Section 3: Publishing Ethics */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-red-950 border-b-2 border-red-950/20 pb-2 flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <span>{lang === 'hi' ? '3. प्रकाशन नीतियाँ एवं समीक्षा मानक (Publishing Ethics)' : '3. Publishing Ethics & Review Policy'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-base">
                  <UserCheck className="w-5 h-5 text-sky-700 flex-shrink-0" />
                  <h4>{lang === 'hi' ? 'डबल-ब्लाइंड समीक्षा' : 'Double-Blind Review'}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  सभी प्राप्त शोध पत्रों का गोपनीय एवं निष्पक्ष मूल्यांकन 2 स्वतंत्र विषय विशेषज्ञों (Subject Experts) द्वारा किया जाता है।
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-base">
                  <FileCheck2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <h4>{lang === 'hi' ? 'मौलिकता एवं प्लेगरिज्म' : 'Plagiarism Control'}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  केवल 100% मौलिक अनुसंधान ही स्वीकृत हैं। सभी प्रविष्टियों की प्राथमिक जाँच मानक सॉफ्टवेयर द्वारा की जाती है।
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-slate-900 font-serif font-bold text-base">
                  <Globe className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <h4>{lang === 'hi' ? 'ओपन एक्सेस नीति' : 'Open Access Policy'}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  शोध ज्ञान का व्यापक प्रसार करने के लिए प्रकाशित सामग्री शोधार्थियों व पाठकों हेतु निःशुल्क एवं ऑनलाइन उपलब्ध रहती है।
                </p>
              </div>
            </div>
          </section>

          {/* Action Callout */}
          <div className="bg-red-950 text-amber-100 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif font-bold text-lg text-amber-300">
                {lang === 'hi' ? 'क्या आप अपना शोध पत्र प्रकाशित करना चाहते हैं?' : 'Would you like to submit your research manuscript?'}
              </h3>
              <p className="text-xs text-amber-100/80">
                {lang === 'hi' 
                  ? 'पत्रिका में हिंदी, अंग्रेजी या पवारी में शोध पत्र आमंत्रित किए जाते हैं।'
                  : 'Manuscripts are invited in Hindi, English, or Pawari languages.'}
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => setActiveView('author_guidelines')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-md flex items-center space-x-1"
              >
                <span>{lang === 'hi' ? 'लेखक दिशानिर्देश देखें' : 'Author Guidelines'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 2: JOURNAL SPECIFICATIONS & FACT SHEET ----------------- */}
      {activeTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-red-950">
              {lang === 'hi' ? 'पत्रिका की आधिकारिक विशिष्टताएँ (Journal Specifications)' : 'Official Journal Specifications'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi' ? 'अंतर्राष्ट्रीय मानकों एवं इंडेक्सिंग निकायों द्वारा सत्यापित विवरण' : 'Verified metadata registered with national and international indexing bodies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'पत्रिका का नाम' : 'Journal Title'}</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">{settings.journal_title_hindi}</h3>
              <p className="text-xs text-slate-500 font-serif">{settings.journal_title_english}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">ISSN Numbers</span>
              <div className="text-sm font-mono font-bold text-slate-900 space-y-1">
                <p>Online: <span className="text-red-900">{settings.issn_online || 'Applied For'}</span></p>
                <p>Print: <span className="text-slate-700">{settings.issn_print || 'Applied For'}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशन अवधि' : 'Frequency'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.frequency_hindi || 'अर्द्धवार्षिक (Half-Yearly)'}</h3>
              <p className="text-xs text-slate-500">{settings.frequency_english || 'Half-Yearly (2 Issues per year: June & December)'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'प्रकाशक संस्थान' : 'Publisher'}</span>
              <h3 className="font-serif font-bold text-base text-slate-900">{settings.publisher_hindi || 'पवारी शोध संस्थान'}</h3>
              <p className="text-xs text-slate-500">{settings.publisher_english || 'Pawari Research Institute, Central India'}</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'जेनोडो डीओआई' : 'Zenodo DOI & Archiving'}</span>
              <h3 className="font-mono font-bold text-base text-slate-900">10.5281/zenodo.10892341</h3>
              <p className="text-xs text-slate-500 font-mono">Open Access Repository DOI • CERN Zenodo Archive</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lang === 'hi' ? 'अकादमिक प्रभाव अंक' : 'Impact & Metrics'}</span>
              <h3 className="font-mono font-bold text-base text-emerald-700">ICV: 84.15 (Index Copernicus)</h3>
              <p className="text-xs text-slate-500">Google Scholar & Zenodo Crossref Registered</p>
            </div>

          </div>

          {/* Indexing Badges */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {lang === 'hi' ? 'मान्य इंडेक्सिंग एवं डिजिटल अर्काइविंग निकाय' : 'Indexing & Digital Archiving Registries'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <Globe className="w-6 h-6 text-sky-600 mb-1" />
                <span>Google Scholar</span>
                <span className="text-[10px] text-slate-500 font-mono">Academic Search</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <Award className="w-6 h-6 text-amber-600 mb-1" />
                <span>Zenodo</span>
                <span className="text-[10px] text-slate-700 font-mono font-bold">10.5281/zenodo.10892341</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
                <span>ResearchGate</span>
                <span className="text-[10px] text-slate-500 font-mono">Research Network</span>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 font-bold text-xs text-amber-950 flex flex-col items-center justify-center space-y-1">
                <BookOpen className="w-6 h-6 text-red-800 mb-1" />
                <span>Academia.edu</span>
                <span className="text-[10px] text-slate-500 font-mono">Scholarly Platform</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- TAB 3: REVIEW WORKFLOW ----------------- */}
      {activeTab === 'workflow' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-serif font-bold text-red-950">
              {lang === 'hi' ? 'प्रकाशन एवं डबल-ब्लाइंड समीक्षा फ़्लोचार्ट' : 'Peer Review & Publication Workflow'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'hi' ? 'पांडुलिपि सबमिशन से लेकर अंतिम ऑनलाइन प्रकाशन तक की पारदर्शी प्रक्रिया' : 'Transparent 5-stage publishing pipeline adhering to international COPE standards.'}
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex items-start space-x-4 p-5 bg-amber-50/60 rounded-2xl border border-amber-200">
              <div className="w-10 h-10 bg-amber-500 text-slate-950 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 1: ऑनलाइन पांडुलिपि सबमिशन' : 'Stage 1: Online Submission'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  लेखक ऑनलाइन फॉर्म या ईमेल द्वारा Word/PDF प्रारूप में द्विभाषी सारांश एवं स्वघोषणा पत्र के साथ पांडुलिपि जमा करते हैं।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-red-950 text-amber-100 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 2: प्रारंभिक प्लेगरिज्म एवं प्रारूप जांच' : 'Stage 2: Initial Screening & Plagiarism Check'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  संपादकीय डेस्क iThenticate / Turnitin द्वारा प्लेगरिज्म जांच (सीमा &lt; 10%) और लेखक दिशानिर्देश अनुपालन की समीक्षा करती है।
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 p-5 bg-sky-50/70 rounded-2xl border border-sky-200">
              <div className="w-10 h-10 bg-sky-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 3: डबल-ब्लाइंड पीर समीक्षा (Double-Blind Peer Review)' : 'Stage 3: Double-Blind Peer Review'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  गुमनाम पांडुलिपि 2 स्वतंत्र विषय विशेषज्ञों को भेजी जाती है। समीक्षक 3-4 सप्ताह के भीतर विस्तृत मूल्यांकन रिपोर्ट प्रस्तुत करते हैं।
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-800 text-slate-100 font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 4: संशोधन एवं अंतिम संपादकीय स्वीकृति' : 'Stage 4: Revision & Editorial Decision'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  समीक्षकों के सुझावों के आधार पर लेखक संशोधन करते हैं। अंतिम संपादन के बाद स्वीकृति पत्र (Acceptance Letter) जारी किया जाता है।
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-4 p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <div className="w-10 h-10 bg-emerald-700 text-white font-bold font-mono text-base rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                5
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'चरण 5: DOI आवंटन एवं ऑनलाइन ओपन एक्सेस प्रकाशन' : 'Stage 5: Zenodo DOI Assignment & Open Access Publishing'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  शोध पत्र को Zenodo DOI, डिजिटल प्रूफ़िंग एवं PDF लेआउट के साथ वेबसाइट पर विश्वभर में निःशुल्क अध्ययन हेतु प्रकाशित किया जाता है।
                </p>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 text-center">
            <button
              onClick={() => setActiveView('author_guidelines')}
              className="inline-flex items-center space-x-2 bg-red-900 hover:bg-red-800 text-amber-100 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{lang === 'hi' ? 'अपनी पांडुलिपि सबमिट करें' : 'Submit Manuscript Now'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ----------------- CITATION MODAL ----------------- */}
      {showCitationModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2 text-red-950 font-serif font-bold text-lg">
                <Quote className="w-5 h-5 text-amber-600" />
                <h3>{lang === 'hi' ? 'अकादमिक उद्धरण (Cite This Paper)' : 'Cite This Journal Manifesto'}</h3>
              </div>
              <button 
                onClick={() => setShowCitationModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* APA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>APA 7th Edition</span>
                  <button
                    onClick={() => handleCopyCitation('apa')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'apa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'apa' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                  {citations.apa}
                </p>
              </div>

              {/* MLA */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>MLA 9th Edition</span>
                  <button
                    onClick={() => handleCopyCitation('mla')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'mla' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'mla' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                  {citations.mla}
                </p>
              </div>

              {/* BibTeX */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>BibTeX</span>
                  <button
                    onClick={() => handleCopyCitation('bibtex')}
                    className="text-red-900 hover:underline flex items-center space-x-1"
                  >
                    {copiedCitation === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCitation === 'bibtex' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg border border-slate-800 text-[11px] font-mono overflow-x-auto leading-relaxed">
                  {citations.bibtex}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCitationModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
