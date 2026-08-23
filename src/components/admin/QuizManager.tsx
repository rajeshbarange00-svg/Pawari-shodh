import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { QuizQuestion } from '../../types';
import { 
  Award, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  Share2,
  Download
} from 'lucide-react';

export const QuizManager: React.FC = () => {
  const { quizQuestions, saveQuizQuestion, deleteQuizQuestion } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuizQuestion | null>(null);

  const [formData, setFormData] = useState<Partial<QuizQuestion>>({
    question_pawari: '',
    question_hindi: '',
    options: ['', '', '', ''],
    correct_option_index: 0,
    explanation: '',
    section_type: 'shabdkosh'
  });

  const filteredQuestions = quizQuestions.filter(q => {
    const matchesSearch = 
      q.question_pawari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question_hindi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || q.section_type === selectedSection;
    return matchesSearch && matchesSection;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      question_pawari: '',
      question_hindi: '',
      options: ['', '', '', ''],
      correct_option_index: 0,
      explanation: '',
      section_type: 'shabdkosh'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: QuizQuestion) => {
    setEditingItem(q);
    setFormData({
      ...q,
      options: [...q.options]
    });
    setIsModalOpen(true);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updatedOptions = [...(formData.options || ['', '', '', ''])];
    updatedOptions[index] = val;
    setFormData(prev => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_hindi || !formData.options || formData.options.some(o => !o.trim())) {
      alert('कृपया प्रश्न एवं चारों विकल्प दर्ज करें।');
      return;
    }

    const questionToSave: QuizQuestion = {
      id: editingItem ? editingItem.id : 'quiz_' + Date.now(),
      question_pawari: formData.question_pawari || formData.question_hindi || '',
      question_hindi: formData.question_hindi || '',
      options: formData.options as string[],
      correct_option_index: Number(formData.correct_option_index) || 0,
      explanation: formData.explanation || '',
      section_type: formData.section_type as any || 'shabdkosh'
    };

    await saveQuizQuestion(questionToSave);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('क्या आप इस प्रश्न को हटाना चाहते हैं?')) {
      await deleteQuizQuestion(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-950/40 border border-amber-800/40 rounded-2xl p-6 text-amber-100 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <Award className="w-5 h-5" />
            <span>पवारी संस्कृति प्रश्नोत्तरी एवं प्रमाण-पत्र प्रबंध (Quiz & Certificate CMS)</span>
          </div>
          <p className="text-amber-200/80 text-sm">
            शब्दकोश, पहेली एवं लोकगीत पर आधारित क्विज प्रश्नों और आकर्षक प्रमाण-पत्र डाउनलोड प्रणाली का प्रबंधन करें (कुल {quizQuestions.length} प्रश्न)
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>नया क्विज प्रश्न जोड़ें</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-amber-900/30">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
          <input
            type="text"
            placeholder="प्रश्न खोजें..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'shabdkosh', 'paheli', 'lokgeet'].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedSection === sec 
                  ? 'bg-amber-500 text-amber-950 font-bold' 
                  : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
              }`}
            >
              {sec === 'all' ? 'सभी वर्ग' : sec === 'shabdkosh' ? 'शब्दकोश' : sec === 'paheli' ? 'पहेली' : 'लोकगीत'}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Feature Info Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-700/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-400 flex-shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-amber-200">
              डिजिटल ई-प्रमाण-पत्र (Attractive Certificate with Photo & Social Sharing)
            </h4>
            <p className="text-xs text-amber-200/70 mt-0.5">
              क्विज़ पूरा करने पर पाठकों को फोटो सहित डाउनलोड योग्य सुंदर पावारी संस्कृति प्रमाण-पत्र एवं वॉट्सऐप/सोशल मीडिया शेयर सुविधा स्वतः प्राप्त होगी।
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-700/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> फोटो अटैच PDF/PNG
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-700/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" /> सोशल मीडिया शेयर
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div 
            key={q.id}
            className="bg-slate-900/80 border border-amber-900/30 hover:border-amber-600/40 rounded-2xl p-5 shadow-lg transition-all"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-950 border border-amber-700 text-amber-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-amber-100 leading-snug font-serif">
                    {q.question_pawari}
                  </h3>
                  {q.question_hindi && q.question_hindi !== q.question_pawari && (
                    <p className="text-xs text-amber-400/70 mt-0.5">
                      {q.question_hindi}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700/50 uppercase">
                  {q.section_type}
                </span>

                <button
                  onClick={() => handleOpenEditModal(q)}
                  className="p-1.5 rounded-lg bg-amber-900/30 hover:bg-amber-800/50 text-amber-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/50 text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 pl-10">
              {q.options.map((opt, oIdx) => {
                const isCorrect = oIdx === q.correct_option_index;
                return (
                  <div
                    key={oIdx}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-between ${
                      isCorrect 
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 font-semibold' 
                        : 'bg-slate-950/60 border-amber-900/30 text-slate-300'
                    }`}
                  >
                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>

            {q.explanation && (
              <p className="text-xs text-amber-300/80 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/20 ml-10">
                <span className="font-semibold text-amber-400">स्पष्टीकरण:</span> {q.explanation}
              </p>
            )}
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="py-12 text-center bg-slate-900/40 border border-amber-900/20 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-amber-600/30 mx-auto mb-3" />
            <p className="text-amber-200/70 font-medium">कोई प्रश्न नहीं मिला।</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-amber-800/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-amber-100 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2 font-serif border-b border-amber-800/30 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingItem ? 'क्विज प्रश्न संपादित करें' : 'नया क्विज प्रश्न जोड़ें'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  संबंधित वर्ग (Section Type)
                </label>
                <select
                  value={formData.section_type || 'shabdkosh'}
                  onChange={(e) => setFormData(prev => ({ ...prev, section_type: e.target.value as any }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="shabdkosh">शब्दकोश (Shabdkosh)</option>
                  <option value="paheli">पहेली (Paheli)</option>
                  <option value="lokgeet">लोकगीत (Lokgeet)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  प्रश्न (पवारी बोली में) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: पवारी बोली मा 'डोरा' शब्द का सही अर्थ का होत है?"
                  value={formData.question_pawari || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, question_pawari: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  प्रश्न (हिंदी अनुवाद) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="जैसे: पवारी भाषा में 'डोरा' शब्द का सही अर्थ क्या है?"
                  value={formData.question_hindi || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, question_hindi: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              {/* Options & Correct Answer Radio */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-amber-300">
                  विकल्प दर्ज करें (मार्क करें जो सही उत्तर है) *
                </label>
                {(formData.options || ['', '', '', '']).map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={Number(formData.correct_option_index) === idx}
                      onChange={() => setFormData(prev => ({ ...prev, correct_option_index: idx }))}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-amber-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                    <input
                      type="text"
                      required
                      placeholder={`विकल्प ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  उत्तर का स्पष्टीकरण / विवरण
                </label>
                <textarea
                  rows={2}
                  placeholder="उत्तर से संबंधित अतिरिक्त जानकारी..."
                  value={formData.explanation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-amber-900/50 rounded-xl text-amber-100 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-amber-800/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 text-sm font-medium transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-sm font-bold shadow-lg transition-colors"
                >
                  {editingItem ? 'सहेजें (Save Changes)' : 'प्रश्न जोड़ें (Add Question)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
