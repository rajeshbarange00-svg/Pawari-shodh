import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Book, 
  PenTool, 
  UserCheck, 
  BookOpen, 
  HelpCircle, 
  Music, 
  Award, 
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

interface PublicContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'books' | 'blogs' | 'writers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'cultural_quizzes' | 'reviews';
}

export const PublicContributionModal: React.FC<PublicContributionModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'books'
}) => {
  const { submitPublicContribution, lang } = useCms();

  type CategoryType = 'books' | 'blogs' | 'writers' | 'shabdkosh' | 'paheli' | 'lokgeet' | 'cultural_quizzes' | 'reviews';

  const [activeTab, setActiveTab] = useState<CategoryType>(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // Contributor Info
  const [contributorName, setContributorName] = useState('');
  const [contributorContact, setContributorContact] = useState('');
  const [contributorLocation, setContributorLocation] = useState('');

  // 1. Books State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [bookYear, setBookYear] = useState('2025');
  const [bookCategory, setBookCategory] = useState('भाषा एवं साहित्य');
  const [bookSummary, setBookSummary] = useState('');
  const [bookCover, setBookCover] = useState('');
  const [bookPdf, setBookPdf] = useState('');

  // 2. Blogs State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCategory, setBlogCategory] = useState('संस्कृति व परंपरा');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');

  // 3. Writer State
  const [writerNameHindi, setWriterNameHindi] = useState('');
  const [writerNameEnglish, setWriterNameEnglish] = useState('');
  const [writerDesignation, setWriterDesignation] = useState('पवारी साहित्यकार / कवि');
  const [writerRegion, setWriterRegion] = useState('मध्य भारत (बैतूल / छिंदवाड़ा)');
  const [writerBio, setWriterBio] = useState('');
  const [writerSpecializations, setWriterSpecializations] = useState('');
  const [writerWorks, setWriterWorks] = useState('');
  const [writerAwards, setWriterAwards] = useState('');
  const [writerPhoto, setWriterPhoto] = useState('');
  const [writerEmail, setWriterEmail] = useState('');

  // 4. Shabdkosh State
  const [wordPawari, setWordPawari] = useState('');
  const [wordHindi, setWordHindi] = useState('');
  const [wordEnglish, setWordEnglish] = useState('');
  const [wordGrammar, setWordGrammar] = useState('संज्ञा (Noun)');
  const [wordCategory, setWordCategory] = useState('दैनिक जीवन (Daily Use)');
  const [wordExamplePawari, setWordExamplePawari] = useState('');
  const [wordExampleHindi, setWordExampleHindi] = useState('');

  // 5. Paheli State
  const [riddlePawari, setRiddlePawari] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleHindi, setRiddleHindi] = useState('');
  const [riddleExplanation, setRiddleExplanation] = useState('');

  // 6. Lokgeet State
  const [songTitle, setSongTitle] = useState('');
  const [songCategory, setSongCategory] = useState('विवाह गीत (Marriage Song)');
  const [songLyrics, setSongLyrics] = useState('');
  const [songMeaning, setSongMeaning] = useState('');
  const [songAudioUrl, setSongAudioUrl] = useState('');

  // 7. Quiz State
  const [quizQuestionPawari, setQuizQuestionPawari] = useState('');
  const [quizQuestionHindi, setQuizQuestionHindi] = useState('');
  const [quizOpt0, setQuizOpt0] = useState('');
  const [quizOpt1, setQuizOpt1] = useState('');
  const [quizOpt2, setQuizOpt2] = useState('');
  const [quizOpt3, setQuizOpt3] = useState('');
  const [quizCorrectIdx, setQuizCorrectIdx] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');

  // 8. Reviews State
  const [reviewBookTitle, setReviewBookTitle] = useState('');
  const [reviewBookAuthor, setReviewBookAuthor] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewContent, setReviewContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload: any = {
        contributor_name: contributorName || 'सार्वजनिक नागरिक / शोधार्थी',
        contributor_contact: contributorContact,
        contributor_location: contributorLocation,
        status: 'pending',
        submitted_at: new Date().toISOString()
      };

      if (activeTab === 'books') {
        payload = {
          ...payload,
          title_hindi: bookTitle,
          title_english: bookTitle,
          authors: bookAuthor || contributorName,
          publisher: bookPublisher || 'स्वायत्त प्रकाशन',
          publication_year: bookYear,
          category: bookCategory,
          description_hindi: bookSummary,
          cover_image: bookCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
          pdf_url: bookPdf
        };
      } else if (activeTab === 'blogs') {
        payload = {
          ...payload,
          title_hindi: blogTitle,
          title_english: blogTitle,
          author: blogAuthor || contributorName,
          category: blogCategory,
          excerpt_hindi: blogExcerpt || blogContent.slice(0, 120),
          content_hindi: blogContent,
          cover_image: blogImage || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
          published_date: new Date().toISOString().split('T')[0]
        };
      } else if (activeTab === 'writers') {
        payload = {
          ...payload,
          name_hindi: writerNameHindi,
          name_english: writerNameEnglish || writerNameHindi,
          designation_hindi: writerDesignation,
          designation_english: writerDesignation,
          location_hindi: writerRegion,
          bio_hindi: writerBio,
          biography_hindi: writerBio,
          specialization_hindi: writerSpecializations ? writerSpecializations.split(',').map(s => s.trim()) : ['पवारी साहित्य'],
          specialization: writerSpecializations ? writerSpecializations.split(',').map(s => s.trim()) : ['पवारी साहित्य'],
          published_books: writerWorks ? writerWorks.split('\n').filter(Boolean) : [],
          awards_hindi: writerAwards ? writerAwards.split(',').map(a => a.trim()) : [],
          photo_url: writerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          contact_email: writerEmail || contributorContact
        };
      } else if (activeTab === 'shabdkosh') {
        payload = {
          ...payload,
          word_pawari: wordPawari,
          word_hindi: wordHindi,
          meaning_hindi: wordHindi,
          meaning_english: wordEnglish,
          grammar_type: wordGrammar,
          category: wordCategory,
          example_pawari: wordExamplePawari,
          example_hindi: wordExampleHindi
        };
      } else if (activeTab === 'paheli') {
        payload = {
          ...payload,
          riddle_pawari: riddlePawari,
          riddle_hindi: riddleHindi || riddlePawari,
          answer_pawari: riddleAnswer,
          answer_hindi: riddleAnswer,
          explanation_hindi: riddleExplanation
        };
      } else if (activeTab === 'lokgeet') {
        payload = {
          ...payload,
          title_pawari: songTitle,
          title_hindi: songTitle,
          category: songCategory,
          lyrics_pawari: songLyrics,
          meaning_hindi: songMeaning,
          audio_url: songAudioUrl
        };
      } else if (activeTab === 'cultural_quizzes') {
        payload = {
          ...payload,
          question_pawari: quizQuestionPawari,
          question_hindi: quizQuestionHindi || quizQuestionPawari,
          options: [quizOpt0, quizOpt1, quizOpt2, quizOpt3].filter(Boolean),
          correct_option_index: Number(quizCorrectIdx),
          explanation: quizExplanation,
          section_type: 'general'
        };
      } else if (activeTab === 'reviews') {
        payload = {
          ...payload,
          title_hindi: `[समीक्षा] ${reviewBookTitle} - ${reviewTitle}`,
          author: reviewerName || contributorName,
          category: 'समीक्षा',
          excerpt_hindi: `पुस्तक: ${reviewBookTitle} (लेखक: ${reviewBookAuthor}) | रेटिंग: ${reviewRating}/5`,
          content_hindi: `### पुस्तक समीक्षा: ${reviewBookTitle}\n**मूल लेखक:** ${reviewBookAuthor}\n**समीक्षक:** ${reviewerName || contributorName}\n**मूल्यांकन:** ${reviewRating}/5 स्टार\n\n${reviewContent}`,
          cover_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
          published_date: new Date().toISOString().split('T')[0]
        };
      }

      await submitPublicContribution(activeTab, payload);

      const trackingId = 'PSP-CONTRIB-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedId(trackingId);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('योगदान सबमिट करने में कोई त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'books', label: '📚 पुस्तकें', icon: Book, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'blogs', label: '✍️ ब्लॉग / आलेख', icon: PenTool, color: 'bg-red-100 text-red-900 border-red-300' },
    { id: 'writers', label: '🖋️ साहित्यकार प्रोफाइल', icon: UserCheck, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'shabdkosh', label: '📖 शब्दकोश', icon: BookOpen, color: 'bg-orange-100 text-orange-900 border-orange-300' },
    { id: 'paheli', label: '🧩 पहेली', icon: HelpCircle, color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
    { id: 'lokgeet', label: '🎵 लोकगीत', icon: Music, color: 'bg-rose-100 text-rose-900 border-rose-300' },
    { id: 'cultural_quizzes', label: '🏆 क्विज़ प्रश्न', icon: Award, color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'reviews', label: '📑 पुस्तक समीक्षा', icon: FileText, color: 'bg-amber-100 text-amber-900 border-amber-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl border border-amber-500/30 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-amber-900/10 pb-4 pr-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>सार्वजनिक पवारी संस्कृति व शोध योगदान पोर्टल</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-red-950">
            {lang === 'hi' ? 'लोक-संस्कृति, साहित्य एवं शोध सामग्री योगदान' : 'Community Cultural & Literary Contribution'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
            {lang === 'hi' 
              ? 'अपनी रचना, पवारी शब्द, पहेली, लोकगीत, समीक्षा या लेखक प्रोफाइल साझा करें। यह जानकारी सत्यापन उपरांत शोध पत्रिका पोर्टल पर प्रकाशित की जाएगी।'
              : 'Share your Pawari literary works, dictionary entries, riddles, folk songs, book reviews or author profiles for public publishing.'}
          </p>
        </div>

        {/* SUCCESS STATE */}
        {isSubmitted ? (
          <div className="text-center py-8 space-y-5 bg-gradient-to-br from-amber-50 via-white to-red-50 p-8 rounded-3xl border border-amber-300 shadow-inner">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-red-950">
                योगदान सफलतापूर्वक प्राप्त हुआ!
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto font-sans leading-relaxed">
                आपका अमूल्य सांस्कृतिक/साहित्यिक योगदान पवारी शोध पत्रिका के मुख्य संपादकीय एवं समीक्षा मंडल के पास जमा हो चुका है।
              </p>
            </div>

            <div className="inline-block bg-white border border-amber-300 px-4 py-2.5 rounded-2xl shadow-xs">
              <span className="text-xs text-slate-500 font-mono block">योगदान ट्रैकिंग संदर्भ आईडी:</span>
              <span className="text-base font-mono font-extrabold text-red-900 tracking-wider">{submittedId}</span>
            </div>

            <p className="text-xs text-amber-900/80 font-medium bg-amber-100/60 p-3 rounded-xl max-w-md mx-auto border border-amber-300/60">
              संपादकीय मंडल द्वारा समीक्षा एवं प्रमाणीकरण के उपरांत आपकी प्रविष्टि पोर्टल पर लाइव कर दी जाएगी। धन्यवाद!
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-red-900 hover:bg-red-800 text-white font-serif font-bold rounded-xl shadow-md transition text-sm cursor-pointer"
            >
              ठीक है / पोर्टल पर वापस लौटें
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-serif font-bold text-slate-800 uppercase tracking-wider block">
                १. सबमिट की जाने वाली सामग्री की श्रेणी चुनें (Select Category):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveTab(cat.id as CategoryType)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-serif font-bold transition flex items-center space-x-1.5 justify-center cursor-pointer ${
                      activeTab === cat.id
                        ? 'bg-red-900 text-amber-100 border-red-950 shadow-md scale-[1.02]'
                        : 'bg-amber-50/50 hover:bg-amber-100/70 text-slate-800 border-amber-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contributor Personal Info */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-serif font-bold text-red-950 uppercase tracking-wider flex items-center space-x-1.5 border-b border-amber-200 pb-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>योगदानकर्ता की सामान्य जानकारी (Contributor Details)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">आपका शुभ नाम *</label>
                  <input
                    type="text"
                    required
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="उदा. डॉ. रामेश्वर पवार"
                    className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">फ़ोन / ई-मेल संपर्क</label>
                  <input
                    type="text"
                    value={contributorContact}
                    onChange={(e) => setContributorContact(e.target.value)}
                    placeholder="उदा. 98260XXXXX या email@example.com"
                    className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">स्थान / ज़िला / राज्य</label>
                  <input
                    type="text"
                    value={contributorLocation}
                    onChange={(e) => setContributorLocation(e.target.value)}
                    placeholder="उदा. बैतूल (म.प्र.)"
                    className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* CATEGORY SPECIFIC FORM FIELDS */}

            {/* 1. BOOKS */}
            {activeTab === 'books' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Book className="w-4 h-4 text-amber-700" />
                  <span>पुस्तक / शोध ग्रंथ विवरण सबमिशन</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पुस्तक का शीर्षक (Title) *</label>
                    <input
                      type="text"
                      required
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="उदा. पवारी लोक साहित्य एवं संस्कृति"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">लेखक / संपादक का नाम *</label>
                    <input
                      type="text"
                      required
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      placeholder="उदा. प्रो. के. एल. पवार"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">प्रकाशक / संस्थान</label>
                    <input
                      type="text"
                      value={bookPublisher}
                      onChange={(e) => setBookPublisher(e.target.value)}
                      placeholder="उदा. माँ ताप्ती प्रकाशन"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">प्रकाशन वर्ष</label>
                    <input
                      type="text"
                      value={bookYear}
                      onChange={(e) => setBookYear(e.target.value)}
                      placeholder="2025"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">पुस्तक की विषय श्रेणी</label>
                  <select
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden bg-white"
                  >
                    <option value="भाषा एवं साहित्य">भाषा एवं साहित्य</option>
                    <option value="लोकगीत व लोककला">लोकगीत व लोककला</option>
                    <option value="इतिहास व संस्कृति">इतिहास व संस्कृति</option>
                    <option value="शोध एवं भाषाविज्ञान">शोध एवं भाषाविज्ञान</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">पुस्तक का संक्षिप्त परिचय / सार *</label>
                  <textarea
                    required
                    rows={3}
                    value={bookSummary}
                    onChange={(e) => setBookSummary(e.target.value)}
                    placeholder="पुस्तक में पवारी बोली के विकास, इतिहास और गीतों की विस्तृत विवेचना है..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">कवर चित्र यूआरएल (Image Link)</label>
                    <input
                      type="url"
                      value={bookCover}
                      onChange={(e) => setBookCover(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पीडीएफ डाउनलोड लिंक / ड्राइव यूआरएल</label>
                    <input
                      type="url"
                      value={bookPdf}
                      onChange={(e) => setBookPdf(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. BLOGS / ARTICLES */}
            {activeTab === 'blogs' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <PenTool className="w-4 h-4 text-red-700" />
                  <span>साहित्यिक आलेख / ब्लॉग रचना सबमिशन</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">रचना का शीर्षक (Title) *</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="उदा. पवारी लोक जीवन में ताप्ती महात्म्य"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">लेखक का नाम *</label>
                    <input
                      type="text"
                      required
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      placeholder="उदा. संतोष कुमार पवार"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">आलेख की श्रेणी</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden bg-white"
                  >
                    <option value="संस्कृति व परंपरा">संस्कृति व परंपरा</option>
                    <option value="लोक साहित्य">लोक साहित्य</option>
                    <option value="अनुसंधान व शोध">अनुसंधान व शोध</option>
                    <option value="संस्मरण व विचार">संस्मरण व विचार</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">पूर्ण रचना / आलेख का पाठ (Full Text) *</label>
                  <textarea
                    required
                    rows={6}
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="यहाँ अपना पूरा आलेख अथवा निबंध लिखें या पेस्ट करें..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* 3. WRITERS PROFILE */}
            {activeTab === 'writers' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span>साहित्यकार / कवि स्वयं का प्रोफाइल पंजीकरण व अपडेट</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">साहित्यकार का नाम (हिंदी में) *</label>
                    <input
                      type="text"
                      required
                      value={writerNameHindi}
                      onChange={(e) => setWriterNameHindi(e.target.value)}
                      placeholder="उदा. डॉ. बालकृष्ण पवार"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Name in English</label>
                    <input
                      type="text"
                      value={writerNameEnglish}
                      onChange={(e) => setWriterNameEnglish(e.target.value)}
                      placeholder="Dr. Balkrishna Pawar"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पद / उपाधि / साहित्य पहचान</label>
                    <input
                      type="text"
                      value={writerDesignation}
                      onChange={(e) => setWriterDesignation(e.target.value)}
                      placeholder="उदा. पवारी कवि एवं लोक शोधार्थी"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">मूल क्षेत्र / ज़िला</label>
                    <input
                      type="text"
                      value={writerRegion}
                      onChange={(e) => setWriterRegion(e.target.value)}
                      placeholder="उदा. छिंदवाड़ा (म.प्र.)"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">जीवन परिचय एवं साहित्य यात्रा *</label>
                  <textarea
                    required
                    rows={4}
                    value={writerBio}
                    onChange={(e) => setWriterBio(e.target.value)}
                    placeholder="अपनी साहित्यिक यात्रा, जन्म स्थान, शिक्षा एवं पवारी भाषा में योगदान की जानकारी साझा करें..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">विशेषज्ञता (कॉमा से अलग करें)</label>
                    <input
                      type="text"
                      value={writerSpecializations}
                      onChange={(e) => setWriterSpecializations(e.target.value)}
                      placeholder="उदा. पवारी कविता, लोकगीत, शोध, शब्दकोश"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">प्राप्त सम्मान एवं पुरस्कार (कॉमा से अलग करें)</label>
                    <input
                      type="text"
                      value={writerAwards}
                      onChange={(e) => setWriterAwards(e.target.value)}
                      placeholder="उदा. पवारी रत्न सम्मान 2024, ताप्ती साहित्य पुरस्कार"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">प्रमुख प्रकाशित कृतियाँ (एक पंक्ति में एक पुस्तक)</label>
                  <textarea
                    rows={2}
                    value={writerWorks}
                    onChange={(e) => setWriterWorks(e.target.value)}
                    placeholder="१. पवारी शब्दकोश (2020)\n२. ताप्ती लोकगीत संग्रह (2022)"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">प्रोफाइल फोटो यूआरएल</label>
                    <input
                      type="url"
                      value={writerPhoto}
                      onChange={(e) => setWriterPhoto(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">ई-मेल / संपर्क माध्यम</label>
                    <input
                      type="email"
                      value={writerEmail}
                      onChange={(e) => setWriterEmail(e.target.value)}
                      placeholder="writer@example.com"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. SHABDKOSH */}
            {activeTab === 'shabdkosh' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <BookOpen className="w-4 h-4 text-orange-700" />
                  <span>पवारी शब्दकोश (Word Submission)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पवारी शब्द *</label>
                    <input
                      type="text"
                      required
                      value={wordPawari}
                      onChange={(e) => setWordPawari(e.target.value)}
                      placeholder="उदा. मया / डगरा"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">हिंदी अर्थ *</label>
                    <input
                      type="text"
                      required
                      value={wordHindi}
                      onChange={(e) => setWordHindi(e.target.value)}
                      placeholder="उदा. प्रेम / रास्ता"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">अंग्रेजी अर्थ (English Meaning)</label>
                    <input
                      type="text"
                      value={wordEnglish}
                      onChange={(e) => setWordEnglish(e.target.value)}
                      placeholder="Love / Path"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पवारी वाक्य प्रयोग</label>
                    <input
                      type="text"
                      value={wordExamplePawari}
                      onChange={(e) => setWordExamplePawari(e.target.value)}
                      placeholder="उदा. तोरा से घनी मया करतों।"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">हिंदी अनुवाद</label>
                    <input
                      type="text"
                      value={wordExampleHindi}
                      onChange={(e) => setWordExampleHindi(e.target.value)}
                      placeholder="उदा. तुमसे बहुत प्रेम करता हूँ।"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. PAHELI */}
            {activeTab === 'paheli' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <HelpCircle className="w-4 h-4 text-yellow-700" />
                  <span>पवारी पहेली (Riddle Submission)</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">पवारी पहेली के शब्द (Riddle Text in Pawari) *</label>
                  <textarea
                    required
                    rows={2}
                    value={riddlePawari}
                    onChange={(e) => setRiddlePawari(e.target.value)}
                    placeholder="उदा. हरी घास पर मोती चमके, सूरज आते गायब होवे..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">पहेली का उत्तर (Answer) *</label>
                    <input
                      type="text"
                      required
                      value={riddleAnswer}
                      onChange={(e) => setRiddleAnswer(e.target.value)}
                      placeholder="उदा. ओस (Dew)"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">सांस्कृतिक व्याख्या / अर्थ</label>
                    <input
                      type="text"
                      value={riddleExplanation}
                      onChange={(e) => setRiddleExplanation(e.target.value)}
                      placeholder="प्रातःकाल ओस की बूंदों के लिए प्रयुक्त प्राचीन पहेली"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. LOKGEET */}
            {activeTab === 'lokgeet' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Music className="w-4 h-4 text-rose-700" />
                  <span>पवारी लोकगीत सबमिशन</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">लोकगीत का शीर्षक *</label>
                    <input
                      type="text"
                      required
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="उदा. मुलताई ताप्ती मैया आरती गीत"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">लोकगीत की श्रेणी</label>
                    <select
                      value={songCategory}
                      onChange={(e) => setSongCategory(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden bg-white"
                    >
                      <option value="विवाह गीत (Marriage Song)">विवाह गीत (Marriage Song)</option>
                      <option value="फाग व होली (Holi / Phag)">फाग व होली (Holi / Phag)</option>
                      <option value="दिवारी व पर्व (Festival)">दिवारी व पर्व (Festival)</option>
                      <option value="भजन व ताप्ती वंदना">भजन व ताप्ती वंदना</option>
                      <option value="बिरहा व लोकगाथा">बिरहा व लोकगाथा</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">लोकगीत के बोल (Lyrics in Pawari) *</label>
                  <textarea
                    required
                    rows={4}
                    value={songLyrics}
                    onChange={(e) => setSongLyrics(e.target.value)}
                    placeholder="यहाँ पवारी लोकगीत की पंक्तियाँ लिखें..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">गीत का भावार्थ / सांस्कृतिक महत्व</label>
                  <textarea
                    rows={2}
                    value={songMeaning}
                    onChange={(e) => setSongMeaning(e.target.value)}
                    placeholder="यह गीत मुलताई ताप्ती मेले अथवा विवाह मंडप में महिलाओं द्वारा गाया जाता है..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* 7. CULTURAL QUIZ */}
            {activeTab === 'cultural_quizzes' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>पवारी क्विज़ प्रश्न सबमिशन</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">प्रश्न पाठ (Question) *</label>
                  <input
                    type="text"
                    required
                    value={quizQuestionPawari}
                    onChange={(e) => setQuizQuestionPawari(e.target.value)}
                    placeholder="उदा. पवारी लोक संस्कृति में माँ ताप्ती का पावन उद्गम स्थल कहाँ है?"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">विकल्प १ (Option 1) *</label>
                    <input
                      type="text"
                      required
                      value={quizOpt0}
                      onChange={(e) => setQuizOpt0(e.target.value)}
                      placeholder="उदा. मुलताई (बैतूल)"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">विकल्प २ (Option 2) *</label>
                    <input
                      type="text"
                      required
                      value={quizOpt1}
                      onChange={(e) => setQuizOpt1(e.target.value)}
                      placeholder="उदा. भोपाल"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">विकल्प ३ (Option 3) *</label>
                    <input
                      type="text"
                      required
                      value={quizOpt2}
                      onChange={(e) => setQuizOpt2(e.target.value)}
                      placeholder="उदा. जबलपुर"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">विकल्प ४ (Option 4) *</label>
                    <input
                      type="text"
                      required
                      value={quizOpt3}
                      onChange={(e) => setQuizOpt3(e.target.value)}
                      placeholder="उदा. नागपुर"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">सही उत्तर का विकल्प संख्या</label>
                    <select
                      value={quizCorrectIdx}
                      onChange={(e) => setQuizCorrectIdx(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden bg-white"
                    >
                      <option value={0}>विकल्प १ ({quizOpt0 || 'Option 1'})</option>
                      <option value={1}>विकल्प २ ({quizOpt1 || 'Option 2'})</option>
                      <option value={2}>विकल्प ३ ({quizOpt2 || 'Option 3'})</option>
                      <option value={3}>विकल्प ४ ({quizOpt3 || 'Option 4'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">व्याख्या / उत्तर का आधार</label>
                    <input
                      type="text"
                      value={quizExplanation}
                      onChange={(e) => setQuizExplanation(e.target.value)}
                      placeholder="ताप्ती नदी का उद्गम मुलताई नगर के पावन सरोवर से है।"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-sm font-serif font-bold text-red-950 flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>पुस्तक समीक्षा एवं समालोचना सबमिशन</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">समीक्षित पुस्तक / कृति का नाम *</label>
                    <input
                      type="text"
                      required
                      value={reviewBookTitle}
                      onChange={(e) => setReviewBookTitle(e.target.value)}
                      placeholder="उदा. पावारी व्याकरण एवं भाषा-शास्त्रीय अध्ययन"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">मूल लेखक का नाम *</label>
                    <input
                      type="text"
                      required
                      value={reviewBookAuthor}
                      onChange={(e) => setReviewBookAuthor(e.target.value)}
                      placeholder="उदा. डॉ. अशोक पवार"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">समीक्षा का शीर्षक (Review Headline) *</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="उदा. पवारी भाषा के प्रामाणिक दस्तावेजीकरण का उत्कृष्ट प्रयास"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">समीक्षा मूल्यांकन (Rating)</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden bg-white"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5 - अत्यंत उत्कृष्ट)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5 - उत्तम व ज्ञानवर्धक)</option>
                      <option value="3">⭐⭐⭐ (3/5 - संतोषजनक)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">विस्तृत समीक्षात्मक टिप्पणी एवं समालोचना *</label>
                  <textarea
                    required
                    rows={5}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="पुस्तक की भाषा शैली, शोध सामग्री, गुणवत्ता एवं पवारी समाज के लिए इसकी उपयोगिता पर अपनी विश्लेषणात्मक समीक्षा लिखें..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-900 outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                रद्द करें
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-amber-100 text-xs font-bold transition shadow-md flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'सबमिट हो रहा है...' : 'योगदान सबमिट करें'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
