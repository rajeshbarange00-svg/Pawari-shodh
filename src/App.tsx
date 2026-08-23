import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CmsProvider, useCms } from './lib/CmsContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { AdminQuickBar } from './components/common/AdminQuickBar';

import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { CurrentIssueView } from './components/public/CurrentIssueView';
import { ArchiveView } from './components/public/ArchiveView';
import { ArticlesView } from './components/public/ArticlesView';
import { BooksBlogsView } from './components/public/BooksBlogsView';
import { ArticleDetailView } from './components/public/ArticleDetailView';
import { EditorialBoardView } from './components/public/EditorialBoardView';
import { AuthorGuidelinesView } from './components/public/AuthorGuidelinesView';
import { ManuscriptSubmissionView } from './components/public/ManuscriptSubmissionView';
import { ContactView } from './components/public/ContactView';
import { PawariCulturalSection } from './components/public/PawariCulturalSection';
import { PawariLokgeetView } from './components/public/PawariLokgeetView';
import { NotFoundView } from './components/common/NotFoundView';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';

const AdminLogin = React.lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
import { updateMetaTags } from './lib/seo';

const MainContent: React.FC = () => {
  const { 
    lang, 
    activeView, 
    selectedArticleId, 
    articles, 
    issues,
    isNotFound, 
    activePdfUrl, 
    activePdfTitle, 
    closePdfViewer, 
    settings,
    loadingData
  } = useCms();
  const { currentUser, userProfile, loading } = useAuth();

  // Find currently selected article if viewing article_detail
  const currentArticle = React.useMemo(() => {
    if (activeView !== 'article_detail' || !selectedArticleId) return null;
    return articles.find(a => a.id === selectedArticleId || a.slug === selectedArticleId) || null;
  }, [activeView, selectedArticleId, articles]);

  // Check if requested issue exists if viewing an issue path
  const isInvalidIssue = React.useMemo(() => {
    if (activeView !== 'archive') return false;
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const issueId = searchParams.get('issue') || (pathname.startsWith('/issue/') ? pathname.replace('/issue/', '').trim() : null);
    if (!issueId) return false;
    const exists = issues.some(i => 
      i.id === issueId || 
      String(i.issue_number) === issueId || 
      `vol-${i.volume}-iss-${i.issue_number}` === issueId ||
      `${i.volume}-${i.issue_number}` === issueId
    );
    return !exists && !loadingData;
  }, [activeView, issues, loadingData]);

  const isInvalidArticle = React.useMemo(() => {
    if (activeView !== 'article_detail' || !selectedArticleId) return false;
    return !currentArticle && !loadingData;
  }, [activeView, selectedArticleId, currentArticle, loadingData]);

  const pageIs404 = isNotFound || isInvalidArticle || isInvalidIssue;

  // Apply theme settings dynamically & update meta tags
  React.useEffect(() => {
    updateMetaTags(activeView, settings, currentArticle, lang, pageIs404);

    const preset = settings.theme_preset || 'maroon_gold';
    document.documentElement.className = `theme-${preset}`;
    if (preset === 'custom') {
      if (settings.primary_color) document.documentElement.style.setProperty('--color-brand-primary', settings.primary_color);
      if (settings.secondary_color) document.documentElement.style.setProperty('--color-brand-secondary', settings.secondary_color);
      if (settings.accent_color) document.documentElement.style.setProperty('--color-brand-accent', settings.accent_color);
    } else {
      document.documentElement.style.removeProperty('--color-brand-primary');
      document.documentElement.style.removeProperty('--color-brand-secondary');
      document.documentElement.style.removeProperty('--color-brand-accent');
    }
  }, [lang, activeView, selectedArticleId, currentArticle, settings, articles, pageIs404]);

  // If activeView is admin, render Admin portal
  if (activeView === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-900 text-amber-100 flex items-center justify-center font-serif text-sm">
          Loading Admin Security Credentials...
        </div>
      );
    }
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-slate-900 text-amber-100 flex items-center justify-center font-serif text-sm">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span>Loading Administrative Portal...</span>
        </div>
      }>
        {!currentUser && !userProfile ? <AdminLogin /> : <AdminLayout />}
      </React.Suspense>
    );
  }

  // Public views
  const renderPublicView = () => {
    if (pageIs404) {
      return <NotFoundView />;
    }

    switch (activeView) {
      case 'home': return <HomeView />;
      case 'about': return <AboutView />;
      case 'current_issue': return <CurrentIssueView />;
      case 'archive': return <ArchiveView />;
      case 'articles': return <ArticlesView />;
      case 'books_blogs': return <BooksBlogsView />;
      case 'pawari_shabdkosh': return <PawariCulturalSection initialTab="shabdkosh" />;
      case 'pawari_paheli': return <PawariCulturalSection initialTab="paheli" />;
      case 'pawari_lokgeet': return <PawariLokgeetView />;
      case 'pawari_quiz': return <PawariCulturalSection initialTab="quiz" />;
      case 'article_detail': 
        if (!currentArticle) return <NotFoundView />;
        return <ArticleDetailView />;
      case 'editorial_board': return <EditorialBoardView />;
      case 'author_guidelines': return <AuthorGuidelinesView />;
      case 'submit_manuscript': return <ManuscriptSubmissionView />;
      case 'contact': return <ContactView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-red-950">
      <AdminQuickBar />
      <Header />
      <main className="flex-1 pb-16">
        {renderPublicView()}
      </main>
      <Footer />

      {/* Global Floating Back-to-Top Scroller */}
      <ScrollToTopButton />

      {/* Global Embedded PDF Modal */}
      {activePdfUrl && (
        <PdfViewerModal
          url={activePdfUrl}
          title={activePdfTitle || 'PDF Document'}
          onClose={closePdfViewer}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CmsProvider>
        <MainContent />
      </CmsProvider>
    </AuthProvider>
  );
}
