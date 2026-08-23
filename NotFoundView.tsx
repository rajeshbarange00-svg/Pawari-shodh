import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { navigateTo } from '../../lib/router';
import { BookOpen, Search, Home, FileText, Library, HelpCircle } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { lang, articles } = useCms();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredArticles = searchTerm.trim() 
    ? articles.filter(a => 
        a.title_hindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.title_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.keywords?.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 4)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-900 border border-red-100">
          <HelpCircle className="w-10 h-10 text-amber-700" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-mono font-bold rounded-full">
            HTTP 404 - NOT FOUND
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {lang === 'hi' ? 'पृष्ठ या शोध पत्र उपलब्ध नहीं है' : 'Page or Article Not Found'}
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto font-sans leading-relaxed">
            {lang === 'hi' 
              ? 'आप जिस पृष्ठ या शोध पत्र की तलाश कर रहे हैं, वह स्थानांतरित कर दिया गया है या मौजूद नहीं है। नीचे दिए गए खोज विकल्प या पृष्ठ कड़ियों का उपयोग करें।'
              : 'The paper or URL you requested could not be found. Please search our published archives or browse available sections below.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'hi' ? 'शोध पत्र का शीर्षक या विषय खोजें...' : 'Search articles by title or keyword...'}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {filteredArticles.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 text-left overflow-hidden">
              <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b">
                {lang === 'hi' ? 'खोज परिणाम' : 'Search Results'}
              </div>
              <div className="divide-y divide-slate-100">
                {filteredArticles.map(art => (
                  <a
                    key={art.id}
                    href={`/article/${art.slug || art.id}`}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        navigateTo('article_detail', art.slug || art.id);
                      }
                    }}
                    className="p-3 block hover:bg-amber-50/50 transition group"
                  >
                    <p className="text-xs font-serif font-bold text-slate-900 group-hover:text-amber-800 line-clamp-1">
                      {lang === 'hi' ? art.title_hindi : art.title_english}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      Vol. {art.volume} Issue {art.issue} ({art.year})
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Quick Links */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                navigateTo('home');
              }
            }}
            className="px-4 py-2.5 bg-red-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-red-900 transition flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home Page'}</span>
          </a>

          <a
            href="/current-issue"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                navigateTo('current_issue');
              }
            }}
            className="px-4 py-2.5 bg-amber-100 text-amber-950 font-bold text-xs rounded-xl hover:bg-amber-200 transition flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'hi' ? 'वर्तमान अंक' : 'Current Issue'}</span>
          </a>

          <a
            href="/archives"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                navigateTo('archive');
              }
            }}
            className="px-4 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition flex items-center space-x-2"
          >
            <Library className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पुराने अंक (Archive)' : 'Journal Archives'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
