import React from 'react';
import { useCms, PublicPageView } from '../../lib/CmsContext';
import { getUrlForView } from '../../lib/router';
import { BookOpen, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, settings, setActiveView, setSelectedArticleId } = useCms();

  const handleNav = (page: PublicPageView) => {
    setSelectedArticleId(null);
    setActiveView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="text-amber-100/80 border-t-4 pt-12 pb-8 transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--color-brand-primary)',
        borderTopColor: 'var(--color-brand-accent)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 pb-8 border-b border-amber-500/20">
          
          {/* Col 1: Branding & ISSN */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-red-950 flex items-center justify-center font-bold font-serif shadow-md">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-amber-200">
                {lang === 'hi' ? settings.journal_title_hindi : settings.journal_title_english}
              </h3>
            </div>

            <p className="text-xs text-amber-100/70 leading-relaxed">
              {lang === 'hi' ? settings.subtitle_hindi : settings.subtitle_english}
            </p>


          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-serif font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-1.5 inline-block">
              {lang === 'hi' ? 'महत्वपूर्ण लिंक' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href={getUrlForView('home')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('home'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('about')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('about'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'पत्रिका परिचय' : 'About Journal'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('current_issue')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('current_issue'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'वर्तमान अंक' : 'Current Issue'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('archive')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('archive'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'पुराने अंक (संग्रह)' : 'Archived Issues'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('articles')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('articles'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'शोध पत्र सूची' : 'Articles Index'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('books_blogs')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('books_blogs'); } }} className="hover:text-amber-300 transition block text-amber-200 font-semibold">
                  {lang === 'hi' ? '📚 पवारी साहित्य एवं शोध ग्रंथ' : 'Pawari Literature & Books'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('pawari_lokgeet')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_lokgeet'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? '🎵 पवारी लोकगीत अर्काइव' : 'Folk Songs Archive'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('pawari_shabdkosh')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('pawari_shabdkosh'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? '📖 पवारी शब्दकोश (2000+ शब्द)' : 'Pawari Shabdkosh'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('author_guidelines')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('author_guidelines'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'लेखक निर्देश' : 'Author Guidelines'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Editorial & Policies */}
          <div>
            <h4 className="text-sm font-serif font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-1.5 inline-block">
              {lang === 'hi' ? 'नीति एवं प्रशासन' : 'Ethics & Governance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href={getUrlForView('editorial_board')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('editorial_board'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'संपादकीय मंडल' : 'Editorial Board'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('about')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('about'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'पीर समीक्षा नीति' : 'Peer Review Policy'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('about')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('about'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'खुला पहुंच नीति (Open Access)' : 'Open Access Policy'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('author_guidelines')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('author_guidelines'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'प्लेगेरिज्म नीति' : 'Plagiarism Policy'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('contact')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('contact'); } }} className="hover:text-amber-300 transition block">
                  {lang === 'hi' ? 'संपर्क एवं पूछताछ' : 'Contact Editorial Office'}
                </a>
              </li>
              <li>
                <a href={getUrlForView('admin')} onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); handleNav('admin'); } }} className="text-amber-400 font-medium hover:underline flex items-center space-x-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'एडमिन पोर्टल लॉगिन' : 'Admin CMS Portal'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial Office Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-semibold text-amber-300 uppercase tracking-wider mb-4 border-b border-amber-500/30 pb-1.5 inline-block">
              {lang === 'hi' ? 'संपादकीय कार्यालय' : 'Editorial Office'}
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{lang === 'hi' ? settings.contact_address_hindi : settings.contact_address_english}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:underline text-amber-200">
                  {settings.contact_email}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{settings.contact_phone}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/70 gap-3 pt-4 border-t border-amber-500/10">
          <div className="space-y-1 text-center sm:text-left">
            <p>
              {lang === 'hi' ? settings.footer_text_hindi : settings.footer_text_english}
            </p>
            <p className="text-[11px] text-amber-300/60 font-mono">
              {lang === 'hi'
                ? 'सभी प्रकाशित लेख क्रिएटिव कॉमन्स एट्रीब्यूशन-नॉनकमर्शियल 4.0 इंटरनेशनल लाइसेंस (CC BY-NC 4.0) के तहत उपलब्ध हैं।'
                : 'All published research articles are distributed under Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-300/80 shrink-0">
            <span>ISSN: {settings.issn_online || 'Applied For'}</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{lang === 'hi' ? 'मुक्त पहुंच (Open Access)' : 'Open Access Journal'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
