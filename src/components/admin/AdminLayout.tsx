import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { firebaseConfig } from '../../lib/firebase';
import { AdminDashboard } from './AdminDashboard';
import { ArticlesManager } from './ArticlesManager';
import { IssuesManager } from './IssuesManager';
import { PagesManager } from './PagesManager';
import { SectionManager } from './SectionManager';
import { EditorialBoardManager } from './EditorialBoardManager';
import { AnnouncementsManager } from './AnnouncementsManager';
import { MediaLibrary } from './MediaLibrary';
import { SettingsManager } from './SettingsManager';
import { UsersManager } from './UsersManager';
import { RolesManager } from './RolesManager';
import { SubmissionsManager } from './SubmissionsManager';
import { BooksBlogsManager } from './BooksBlogsManager';
import { ActivityLogManager } from './ActivityLogManager';
import { ShabdkoshManager } from './ShabdkoshManager';
import { PaheliManager } from './PaheliManager';
import { LokgeetManager } from './LokgeetManager';
import { QuizManager } from './QuizManager';
import { PublicContributionsManager } from './PublicContributionsManager';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Book,
  FileCode, 
  Layers, 
  Users, 
  Bell, 
  Image as ImageIcon, 
  Settings, 
  ShieldCheck, 
  Key,
  History,
  LogOut, 
  Globe, 
  Sparkles,
  Menu,
  X,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  Inbox,
  CheckCircle2,
  XCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
  HelpCircle,
  Music,
  Award,
  UserPlus
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    setActiveView,
    shabdkoshList,
    paheliList,
    lokgeetList,
    submissions
  } = useCms();
  const { 
    userProfile, 
    logout, 
    isSuperAdmin, 
    isDirector,
    isEditorial,
    canManageUsers,
    canManageSettings,
    canManageArticles,
    canManageIssues,
    canManagePages,
    canManageSubmissions,
    roles 
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);

  // Auto-redirect to dashboard only if user profile is completely missing
  React.useEffect(() => {
    if (!userProfile) {
      setActiveAdminTab('dashboard');
    }
  }, [userProfile, setActiveAdminTab]);

  // Pending counts for quick action badges
  const pendingContributionsCount = 
    shabdkoshList.filter(i => i.status === 'pending').length +
    paheliList.filter(i => i.status === 'pending').length +
    lokgeetList.filter(i => i.status === 'pending').length;

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending').length;

  // Grouped Navigation Categories
  const navCategories = [
    {
      title: 'मुख्य डैशबोर्ड / Core Overview',
      items: [
        { id: 'dashboard', label: 'डैशबोर्ड (Overview)', icon: LayoutDashboard }
      ]
    },
    {
      title: 'शोध पत्रिका एवं प्रकाशन / Publications',
      items: [
        { id: 'articles', label: 'शोध पत्र एवं लेख (Articles)', icon: FileText },
        { id: 'issues', label: 'अंक एवं वॉल्यूम (Volumes & Issues)', icon: BookOpen },
        { id: 'books_blogs', label: 'पुस्तकें एवं ब्लॉग (Books & Blogs)', icon: Book }
      ]
    },
    {
      title: 'पवारी साहित्य एवं संस्कृति / Pawari Culture',
      items: [
        { id: 'shabdkosh', label: '1. पवारी शब्दकोश (Shabdkosh)', icon: BookOpen },
        { id: 'paheli', label: '2. पवारी पहेली (Paheli)', icon: HelpCircle },
        { id: 'lokgeet', label: '3. पवारी लोकगीत (Lokgeet)', icon: Music },
        { id: 'cultural_quizzes', label: '4. पवारी क्विज़ (Quiz & Certificate)', icon: Award },
        { 
          id: 'public_contributions', 
          label: '5. पाठक योगदान (Reader Contributions)', 
          icon: UserPlus,
          badge: pendingContributionsCount > 0 ? `${pendingContributionsCount} new` : null,
          badgeColor: 'bg-amber-500 text-red-950 font-bold'
        }
      ]
    },
    {
      title: 'संपादक मंडल एवं समीक्षा / Editorial',
      items: [
        { 
          id: 'submissions', 
          label: 'प्राप्त शोध पांडुलिपियां (Submissions)', 
          icon: Inbox,
          badge: pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount} review` : null,
          badgeColor: 'bg-red-600 text-white font-bold'
        },
        { id: 'editorial_board', label: 'संपादक मंडल सूची (Editorial Board)', icon: Users }
      ]
    },
    {
      title: 'पोर्टल एवं मीडिया / Portal CMS',
      items: [
        { id: 'announcements', label: 'सूचनाएं (Announcements)', icon: Bell },
        { id: 'pages', label: 'CMS पेजेस (Dynamic Pages)', icon: FileCode },
        { id: 'section_manager', label: 'होमपेज लेआउट क्रम (Section Order)', icon: Layers },
        { id: 'media', label: 'मीडिया गैलरी (Media Library)', icon: ImageIcon }
      ]
    },
    {
      title: 'प्रशासन एवं सुरक्षा / Administration',
      items: [
        { id: 'settings', label: 'पत्रिका सेटिंग्स (Settings)', icon: Settings },
        { id: 'users', label: 'उपयोगकर्ता खाते (Users)', icon: ShieldCheck },
        { id: 'roles', label: 'रोल एवं अधिकार (Roles & Access)', icon: Key },
        { id: 'activity_log', label: 'गतिविधि ऑडिट लॉग (Activity Log)', icon: History }
      ]
    }
  ];

  const currentRoleObj = roles.find(r => r.id === userProfile?.role);

  const capabilities = [
    { label: 'Articles & Content', allowed: canManageArticles, desc: 'Create, edit & publish papers' },
    { label: 'Volumes & Issues', allowed: canManageIssues, desc: 'Manage journal archives' },
    { label: 'Review Submissions', allowed: canManageSubmissions, desc: 'Accept/reject submissions' },
    { label: 'CMS Pages & Layout', allowed: canManagePages, desc: 'Edit dynamic portal pages' },
    { label: 'Journal Settings', allowed: canManageSettings, desc: 'Configure journal metadata' },
    { label: 'Users & Roles Control', allowed: canManageUsers, desc: 'Manage account permissions' }
  ];

  const renderActiveTab = () => {
    switch (activeAdminTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'articles': return <ArticlesManager />;
      case 'issues': return <IssuesManager />;
      case 'books_blogs': return <BooksBlogsManager />;
      case 'shabdkosh': return <ShabdkoshManager />;
      case 'paheli': return <PaheliManager />;
      case 'lokgeet': return <LokgeetManager />;
      case 'cultural_quizzes': return <QuizManager />;
      case 'public_contributions': return <PublicContributionsManager />;
      case 'submissions': return <SubmissionsManager />;
      case 'pages': return <PagesManager />;
      case 'section_manager': return <SectionManager />;
      case 'editorial_board': return <EditorialBoardManager />;
      case 'announcements': return <AnnouncementsManager />;
      case 'media': return <MediaLibrary />;
      case 'settings': return <SettingsManager />;
      case 'users': return <UsersManager />;
      case 'roles': return <RolesManager />;
      case 'activity_log': return <ActivityLogManager />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Bar */}
      <header className="bg-red-950 text-amber-100 border-b border-amber-500/30 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-amber-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-red-950 font-serif font-bold text-lg flex items-center justify-center border border-amber-400">
                प
              </div>
              <div>
                <span className="font-serif font-bold text-amber-100 text-base leading-tight block">
                  Pawari Shodh Patrika
                </span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  CMS Admin Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            
            {/* View Public Site Button */}
            <button
              onClick={() => setActiveView('home')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 rounded-lg transition"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Journal Website</span>
            </button>

            {/* Profile Info */}
            <div className="hidden md:flex items-center space-x-2 border-l border-amber-800/80 pl-3">
              <span className="font-semibold text-amber-100">{userProfile?.display_name || 'Admin'}</span>
              <span className="text-[10px] font-mono font-extrabold bg-amber-500 text-red-950 px-2 py-0.5 rounded-full uppercase">
                {userProfile?.role}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="p-2 bg-red-900/80 hover:bg-red-800 text-amber-200 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white border border-amber-900/10 rounded-2xl p-3 shadow-2xs space-y-3 sticky top-22">
            
            <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 scrollbar-thin">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>CMS Navigation</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm font-semibold">Organized</span>
              </div>

              {navCategories.map((category, catIdx) => (
                <div key={catIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/80 bg-amber-50/60 py-1 rounded-md border-l-2 border-amber-600">
                    {category.title}
                  </div>

                  <div className="space-y-0.5 pt-0.5">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeAdminTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveAdminTab(item.id as any);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif font-semibold transition ${
                            isActive
                              ? 'bg-red-950 text-amber-100 shadow-xs font-bold'
                              : 'text-slate-700 hover:bg-amber-50/80 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 pr-1">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-amber-100 text-amber-900'}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* PERMISSION SUMMARY PANEL */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPermissionsPanel(!showPermissionsPanel)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 text-slate-800 transition"
              >
                <div className="flex items-center space-x-2 text-xs font-bold font-serif">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Permission Summary</span>
                </div>
                {showPermissionsPanel ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {showPermissionsPanel && (
                <div className="mt-2.5 p-3 bg-amber-50/40 border border-amber-200/70 rounded-xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Logged Role</span>
                      <span className="text-xs font-serif font-bold text-red-950 capitalize">
                        {currentRoleObj?.name || userProfile?.role || 'Guest'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-extrabold bg-red-950 text-amber-100 px-2 py-0.5 rounded-full uppercase">
                      {isSuperAdmin ? 'Full Access' : (userProfile?.role || 'Active')}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-amber-200/50">
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mb-1">Authorized Capabilities</span>
                    {capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] leading-snug">
                        {cap.allowed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={`font-semibold ${cap.allowed ? 'text-slate-800' : 'text-slate-400 line-through decoration-slate-300'}`}>
                            {cap.label}
                          </p>
                          <p className="text-[9px] text-slate-400 truncate">{cap.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveTab()}
        </main>

      </div>

    </div>
  );
};

