import React, { useState, useRef } from 'react';
import { useCms } from '../../lib/CmsContext';
import { downloadManuscriptTemplate, downloadCopyrightForm } from '../../lib/pdfUtils';
import { FileUploadZone } from '../common/FileUploadZone';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, Send, File as FileIcon, X, ShieldAlert, FileDown, FileCheck } from 'lucide-react';

export const ManuscriptSubmissionView: React.FC = () => {
  const { lang, setActiveView, addSubmission, settings, uploadFileToStorage } = useCms();
  
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    coAuthors: '',
    affiliation: '',
    title: '',
    paperType: 'Journal Article',
    category: 'भाषाविज्ञान एवं लोकसाहित्य',
    keywords: '',
    doi: '',
    licenseType: 'CC-BY Open Access',
    abstract: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        alert(lang === 'hi' ? 'कृपया केवल Word (.doc, .docx) या PDF फ़ाइल अपलोड करें।' : 'Please upload only Word (.doc, .docx) or PDF files.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isValidFile(selectedFile)) {
        setFile(selectedFile);
      } else {
        alert(lang === 'hi' ? 'कृपया केवल Word (.doc, .docx) या PDF फ़ाइल अपलोड करें।' : 'Please upload only Word (.doc, .docx) or PDF files.');
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const nameLower = (file.name || '').toLowerCase();
    const hasValidExt = nameLower.endsWith('.pdf') || nameLower.endsWith('.docx') || nameLower.endsWith('.doc');
    return validTypes.includes(file.type) || hasValidExt;
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !fileUrlInput) {
      alert(lang === 'hi' ? 'कृपया शोध पत्र की फ़ाइल अपलोड करें या ऑनलाइन लिंक दर्ज करें।' : 'Please upload the manuscript file or provide a direct paper URL.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let finalFileUrl = fileUrlInput || '';
      if (file) {
        const uploadRes = await uploadFileToStorage(file, 'submissions');
        finalFileUrl = uploadRes.url || uploadRes.fileId || uploadRes.path;
      }

      await addSubmission({
        author_name: formData.authorName,
        email: formData.email,
        co_authors: formData.coAuthors,
        affiliation: formData.affiliation,
        title: formData.title,
        paper_type: formData.paperType,
        category: formData.category,
        keywords: formData.keywords,
        doi: formData.doi,
        license_type: formData.licenseType,
        abstract: formData.abstract,
        file_name: file ? file.name : 'External Linked Paper',
        file_url: finalFileUrl || undefined
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert(lang === 'hi' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें।' : 'An error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      authorName: '',
      email: '',
      coAuthors: '',
      affiliation: '',
      title: '',
      paperType: 'Journal Article',
      category: 'भाषाविज्ञान एवं लोकसाहित्य',
      keywords: '',
      doi: '',
      licenseType: 'CC-BY Open Access',
      abstract: '',
    });
    setFile(null);
    setFileUrlInput('');
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white rounded-2xl p-10 border border-emerald-200 shadow-md text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {lang === 'hi' ? 'शोध पत्र सफलतापूर्वक जमा हुआ!' : 'Paper Submitted Successfully!'}
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            {lang === 'hi' 
              ? 'आपका शोध पत्र/पांडुलिपि अकादमिक रिकॉर्ड्स में दर्ज कर ली गई है। संपादकीय बोर्ड द्वारा समीक्षा के पश्चात् इसे प्रकाशित एवं इंडेक्स किया जाएगा।' 
              : 'Your research paper has been registered in our academic repository. It will be reviewed by the editorial board prior to indexing.'}
          </p>
          <div className="pt-6 border-t border-slate-100 flex items-center justify-center space-x-4">
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              {lang === 'hi' ? 'होम पेज पर जाएं' : 'Return to Home'}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md"
            >
              {lang === 'hi' ? 'एक और शोध पत्र जोड़ें' : 'Add Another Paper'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-10 shadow-md border border-amber-500/30">
        <div className="flex items-center space-x-3 mb-2">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase rounded-full tracking-wider">
            Academia.edu Style Paper Portal
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-amber-100">
          {lang === 'hi' ? 'शोध पत्र अपलोड एवं प्रकाशन हेतु सबमिशन' : 'Upload Research Paper & Manuscript'}
        </h1>
        <p className="text-sm text-amber-200/80 mt-2">
          {lang === 'hi' 
            ? 'Academia.edu की तर्ज पर अपना शोध पत्र, सम्मेलन आलेख, पुस्तक अध्याय या शोध-प्रबंध शीर्षक, सह-लेखकों, DOI एवं पीडीएफ सहित अपलोड करें।' 
            : 'Add your research paper, conference article, book chapter, or dissertation along with co-authors, DOI, and manuscript file.'}
        </p>
      </div>

      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Guidelines Reminder Banner */}
        <div className="bg-amber-50 border-b border-amber-200/50 p-4 sm:p-5 space-y-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 flex-1">
              <span className="font-bold">
                {lang === 'hi' ? 'महत्वपूर्ण निर्देश: ' : 'Important Note: '}
              </span>
              {lang === 'hi' 
                ? 'सबमिट करने से पहले सुनिश्चित करें कि आपकी फ़ाइल Word (.doc, .docx) या PDF प्रारूप में है और आपने पत्रिका के मानक टेम्पलेट का उपयोग किया है।' 
                : 'Before submitting, ensure your file is formatted in Word (.doc, .docx) or PDF as per the journal manuscript template.'}
              <button 
                onClick={() => setActiveView('author_guidelines')}
                className="ml-2 text-red-700 hover:underline font-bold"
              >
                {lang === 'hi' ? 'संपूर्ण नियम पढ़ें' : 'Read Full Guidelines'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1 pl-8">
            <button
              type="button"
              onClick={() => downloadManuscriptTemplate(settings.manuscript_template_url)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 rounded-lg text-xs font-bold text-amber-950 transition shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? 'पांडुलिपि टेम्पलेट (Word)' : 'Manuscript Template (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={() => downloadCopyrightForm(settings.copyright_form_url)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100/60 rounded-lg text-xs font-bold text-emerald-950 transition shadow-2xs"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'कॉपीराइट एवं स्वघोषणा पत्र' : 'Copyright Form (.doc/.pdf)'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          
          {/* Work Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              {lang === 'hi' ? '1. कार्य / शोध पत्र का प्रकार (Paper Work Type)' : '1. Paper Work Type'} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { id: 'Journal Article', labelHi: 'शोध आलेख', labelEn: 'Journal Article' },
                { id: 'Conference Paper', labelHi: 'सम्मेलन पत्र', labelEn: 'Conference Paper' },
                { id: 'Book Chapter', labelHi: 'पुस्तक अध्याय', labelEn: 'Book Chapter' },
                { id: 'Dissertation/Thesis', labelHi: 'शोध प्रबंध', labelEn: 'Thesis / Dissertation' },
                { id: 'Working Paper', labelHi: 'प्री-प्रिंट', labelEn: 'Working Paper / Preprint' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, paperType: item.id })}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex flex-col justify-between ${
                    formData.paperType === item.id
                      ? 'bg-amber-900 border-amber-800 text-amber-100 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400'
                  }`}
                >
                  <span className="text-sm font-serif">{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                  <span className="text-[10px] opacity-75 mt-1">{item.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Author Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">2</span>
              <span>{lang === 'hi' ? 'लेखक एवं सह-लेखक विवरण (Authors & Affiliation)' : 'Authors & Affiliation'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Author Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'मुख्य / पत्राचार लेखक (Primary Author Name)' : 'Primary Author Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorName}
                  onChange={e => setFormData({...formData, authorName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: डॉ. रामेश्वर पवार' : 'e.g. Dr. Rameshwar Pawar'}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'ईमेल (Email Address)' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder="author@university.edu"
                />
              </div>

              {/* Co-Authors */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'सह-लेखक (Co-Authors, optional)' : 'Co-Authors'}
                </label>
                <input
                  type="text"
                  value={formData.coAuthors}
                  onChange={e => setFormData({...formData, coAuthors: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: डॉ. ए. के. शर्मा, प्रो. विकास वर्मा' : 'e.g. Dr. A. K. Sharma, Prof. Vikas Verma'}
                />
              </div>

              {/* Institution / Affiliation */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'संस्थान / विश्वविद्यालय (University / Affiliation)' : 'Institution / Affiliation'}
                </label>
                <input
                  type="text"
                  value={formData.affiliation}
                  onChange={e => setFormData({...formData, affiliation: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition"
                  placeholder={lang === 'hi' ? 'जैसे: देवी अहिल्या विश्वविद्यालय, इंदौर' : 'e.g. Devi Ahilya University, Indore'}
                />
              </div>
            </div>
          </div>

          {/* Metadata & Title */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">3</span>
              <span>{lang === 'hi' ? 'शोध पत्र शीर्षक एवं मेटाडेटा (Title & Metadata)' : 'Title & Paper Metadata'}</span>
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'hi' ? 'शोध पत्र का पूरा शीर्षक (Full Title)' : 'Full Paper Title'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition font-serif font-bold text-slate-900"
                placeholder={lang === 'hi' ? 'अपने शोध पत्र का शीर्षक दर्ज करें...' : 'Enter the complete title of your research paper...'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'विषय श्रेणी (Category)' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                >
                  <option value="पवारी भाषा एवं साहित्य">1. पवारी (भोयरी/पंवारी) भाषा, साहित्य व व्याकरण</option>
                  <option value="मध्यप्रदेश की बोलियाँ व लोकभाषाएँ">2. मध्यप्रदेश की बोलियाँ (मालवी, निमाड़ी, बुन्देली, बघेली, राजस्थानी)</option>
                  <option value="जनजातीय भाषिक एवं सांस्कृतिक अध्ययन">3. जनजातीय भाषाएँ (गोंडी, कोरकू, नहाली, भीली, भिलाली, बरेली)</option>
                  <option value="लोकसाहित्य एवं मौखिक परंपराएँ">4. लोकसाहित्य, लोकगीत, लोककथा व वाचिक परंपराएँ</option>
                  <option value="इतिहास, पुरालेख व वंशावली">5. क्षेत्रीय इतिहास, पुरालेख, ताम्रपत्र व गोत्र/वंश अध्ययन</option>
                  <option value="समाजशास्त्र एवं लोक-पारिस्थितिकी">6. समाजशास्त्र, लोकज्ञान, कृषि-संस्कृति व पारिस्थिकी</option>
                  <option value="तुलनात्मक भाषाविज्ञान व डिजिटल प्रलेखन">7. तुलनात्मक भाषाविज्ञान, अनुवाद, शब्दकोश व डिजिटलीकरण</option>
                </select>
              </div>

              {/* DOI */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'DOI (यदि उपलब्ध हो)' : 'DOI (Digital Object Identifier)'}
                </label>
                <input
                  type="text"
                  value={formData.doi}
                  onChange={e => setFormData({...formData, doi: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-amber-900"
                  placeholder="e.g. 10.5281/zenodo.1234567"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'बीज शब्द (Keywords)' : 'Keywords / Tags'}
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. पवारी, भाषाविज्ञान, लोकगीत, बैतूल"
                />
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'hi' ? 'शोध सार (Abstract)' : 'Abstract / Summary'}
              </label>
              <textarea
                rows={4}
                value={formData.abstract}
                onChange={e => setFormData({...formData, abstract: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm outline-none transition resize-y"
                placeholder={lang === 'hi' ? 'अपने शोध का संक्षिप्त सार (Abstract) लिखें...' : 'Provide abstract summarizing your research methodology & conclusions...'}
              />
            </div>
          </div>

            {/* File Upload & PDF Link */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">4</span>
                <span>{lang === 'hi' ? 'पीडीएफ या वर्ड फ़ाइल अपलोड करें (Upload File or Add URL)' : 'Upload PDF/Doc File or Provide Web Link'}</span>
              </h3>

              <FileUploadZone
                label={lang === 'hi' ? 'शोध पत्र फ़ाइल अपलोड' : 'Manuscript File Upload'}
                description={lang === 'hi' ? 'PDF, DOC, DOCX फ़ाइल अपलोड करें। अधिकतम 15MB।' : 'Upload your research paper in PDF, DOC, or DOCX format (Max 15MB).'}
                acceptedCategory="documents"
                maxFiles={1}
                customFolder="submissions"
                onUploadComplete={(fileItem) => {
                  setFileUrlInput(fileItem.url);
                  setFile(new File([], fileItem.name));
                }}
                onRemoveFile={() => {
                  setFileUrlInput('');
                  setFile(null);
                }}
              />

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'या प्रत्यक्ष वेब / गूगल ड्राइव लिंक दर्ज करें' : 'Or Provide Direct Web / Google Drive Link'}
                </label>
                <input
                  type="url"
                  value={fileUrlInput}
                  onChange={e => setFileUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:ring-2 focus:ring-amber-500/50 outline-none"
                  placeholder="https://drive.google.com/file/d/... or direct PDF URL"
                />
              </div>
            </div>

          {/* Submit Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'hi' ? 'खुला अभिगम (Open Access) एवं सर्वाधिकार सुरक्षित नीति लागू।' : 'Open Access CC-BY License Policy applies.'}</span>
            </p>
            <button
              type="submit"
              disabled={isSubmitting || (!file && !fileUrlInput)}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-sm shadow-md transition ${
                isSubmitting || (!file && !fileUrlInput)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-950 hover:bg-red-900 text-amber-100 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />
                  <span>{lang === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting Paper...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'शोध पत्र सबमिट करें (Submit Paper)' : 'Submit Paper'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
