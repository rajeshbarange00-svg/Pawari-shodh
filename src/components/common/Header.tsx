import React, { useState } from 'react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { getUrlForView } from '../../lib/router';
import { SafeImage } from './SafeImage';
import { 
  BookOpen, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronRight,
  Sparkles,
  FileText,
  Search,
  Award
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, activeView, setActiveView, settings, setSelectedArticleId } = useCms();
  const { currentUser, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navs = settings.navigation_labels;

  const navItems: { key: PublicPageView; label: string }[] = [
    { key: 'home', label: lang === 'hi' ? navs.home_hindi : navs.home_english },
    { key: 'about', label: lang === 'hi' ? navs.about_hindi : navs.about_english },
    { key: 'current_issue', label: lang === 'hi' ? navs.current_issue_hindi : navs.current_issue_english },
    { key: 'archive', label: lang === 'hi' ? navs.archive_hindi : navs.archive_english },
    { key: 'books_blogs', label: lang === 'hi' ? '📚 पुस्तकें व ब्लॉग' : 'Books & Blogs' },
    { key: 'pawari_lokgeet', label: lang === 'hi' ? '🎵 पवारी लोकगीत' : 'Pawari Lokgeet' },
    { key: 'editorial_board', label: lang === 'hi' ? navs.editorial_board_hindi : navs.editorial_board_english },
    { key: 'author_guidelines', label: lang === 'hi' ? navs.author_guidelines_hindi : navs.author_guidelines_english },
    { key: 'contact', label: lang === 'hi' ? navs.contact_hindi : navs.contact_english },
  ];

  const handleNavClick = (key: PublicPageView) => {
    if (key !== 'article_detail') {
      setSelectedArticleId(null);
    }
    setActiveView(key);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-amber-900/15 shadow-sm sticky top-0 z-40">
      
      {/* Top Academic Quick Bar */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-amber-100/90 text-[11px] font-mono py-1 px-3 sm:px-6 border-b border-amber-500/20 hidden sm:flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-amber-300 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'पीर-रिव्यूड शोध पत्रिका' : 'Peer-Reviewed Refereed Journal'}</span>
          </span>
          <span className="text-amber-500/50">•</span>
          <span className="text-amber-200/80">
            {lang === 'hi' ? settings.publisher_hindi : settings.publisher_english}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-amber-300/90">
            ISSN: {settings.issn_online || 'Applied / Online'}
          </span>
          <span className="text-amber-500/50">•</span>
          <button
            onClick={() => handleNavClick('submit_manuscript')}
            className="text-amber-300 hover:text-amber-100 font-bold underline cursor-pointer"
          >
            {lang === 'hi' ? 'पांडुलिपि जमा करें ➔' : 'Submit Manuscript ➔'}
          </button>
        </div>
      </div>

      {/* Main Journal Branding Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo + Full Journal Title */}
        <a 
          href={getUrlForView('home')}
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey) {
              e.preventDefault();
              handleNavClick('home');
            }
          }}
          className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group select-none min-w-0 flex-1"
        >
          {/* Emblem / Seal Logo */}
          <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-red-900 via-red-950 to-amber-900 border-2 border-amber-500/60 p-0.5 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition duration-200 overflow-hidden">
            {settings.logo_url ? (
              <SafeImage src={settings.logo_url} alt="Seal" className="w-full h-full object-contain rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full border border-amber-300/40 flex flex-col items-center justify-center bg-red-950 text-amber-300 p-0.5">
                <BookOpen className="w-5 h-5 stroke-[1.75]" />
              </div>
            )}
          </div>

          {/* Titles - Full Title Display without truncation */}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-2xl md:text-3xl font-serif font-black text-red-950 tracking-tight leading-tight whitespace-normal group-hover:text-red-900 transition-colors">
              {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 font-serif font-medium leading-tight mt-0.5">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>
          </div>
        </a>

        {/* Right Controls: Language Switcher + CMS + Mobile Menu Toggle Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-300">
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full transition ${
                lang === 'hi'
                  ? 'bg-red-950 text-amber-300 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-full transition ${
                lang === 'en'
                  ? 'bg-red-950 text-amber-300 font-bold shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin CMS Button */}
          {currentUser ? (
            <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 text-[10px]">
              <button
                onClick={() => handleNavClick('admin')}
                className="bg-red-950 text-amber-300 font-bold px-1.5 py-0.5 rounded hover:bg-red-900 transition"
              >
                CMS
              </button>
              <button 
                onClick={() => logout()}
                title="Logout"
                className="hover:text-red-700 p-0.5"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] transition shadow-2xs"
            >
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'CMS' : 'CMS Portal'}</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-800 hover:text-red-950 rounded bg-slate-100 border border-slate-200 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Navigation Bar */}
      <div 
        className="text-amber-100 border-t border-amber-900/10 transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-brand-primary)' }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          
          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center justify-between overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeView === item.key;
              const href = getUrlForView(item.key);
              return (
                <a
                  key={item.key}
                  href={href}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      handleNavClick(item.key);
                    }
                  }}
                  className={`px-3.5 py-1.5 text-xs tracking-wide rounded-xl transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-red-950 bg-amber-400 font-bold shadow-md scale-[1.03]'
                      : 'text-amber-100/90 hover:text-amber-200 hover:bg-white/10 font-medium'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-red-950 border-t border-amber-500/20 px-3 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const isActive = activeView === item.key;
              const href = getUrlForView(item.key);
              return (
                <a
                  key={item.key}
                  href={href}
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey) {
                      e.preventDefault();
                      handleNavClick(item.key);
                    }
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-amber-400 text-red-950 font-bold shadow-md'
                      : 'text-amber-100 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-950' : 'text-amber-400/70'}`} />
                </a>
              );
            })}
          </div>
        )}
      </div>

    </header>
  );
};
