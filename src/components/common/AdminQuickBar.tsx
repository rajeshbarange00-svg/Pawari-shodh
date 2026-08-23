import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { ShieldCheck, Edit3, Settings, Layers, FileText, Users, Bell, BookOpen, ExternalLink } from 'lucide-react';

export const AdminQuickBar: React.FC = () => {
  const { activeView, setActiveView, setActiveAdminTab } = useCms();
  const { currentUser, userProfile } = useAuth();

  // Only render if admin user is logged in
  if (!currentUser && !userProfile) {
    return null;
  }

  const handleEditClick = (tab: any) => {
    setActiveAdminTab(tab);
    setActiveView('admin');
  };

  const getPageSpecificControls = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <button
              onClick={() => handleEditClick('settings')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Journal Title & Settings</span>
            </button>
            <button
              onClick={() => handleEditClick('announcements')}
              className="px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold rounded-lg hover:bg-amber-500/30 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Announcements</span>
            </button>
            <button
              onClick={() => handleEditClick('section_manager')}
              className="px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold rounded-lg hover:bg-amber-500/30 transition flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Reorder Home Sections</span>
            </button>
          </>
        );

      case 'about':
        return (
          <>
            <button
              onClick={() => handleEditClick('pages')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit About Page Text</span>
            </button>
          </>
        );

      case 'current_issue':
      case 'archive':
        return (
          <>
            <button
              onClick={() => handleEditClick('issues')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manage Volumes & Issues</span>
            </button>
            <button
              onClick={() => handleEditClick('articles')}
              className="px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold rounded-lg hover:bg-amber-500/30 transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Published Articles</span>
            </button>
          </>
        );

      case 'articles':
      case 'article_detail':
        return (
          <>
            <button
              onClick={() => handleEditClick('articles')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload / Edit Articles</span>
            </button>
          </>
        );

      case 'editorial_board':
        return (
          <>
            <button
              onClick={() => handleEditClick('editorial_board')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Editorial Board Members</span>
            </button>
          </>
        );

      case 'author_guidelines':
        return (
          <>
            <button
              onClick={() => handleEditClick('pages')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Author Guidelines Page</span>
            </button>
          </>
        );

      case 'contact':
        return (
          <>
            <button
              onClick={() => handleEditClick('settings')}
              className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Journal Contact Info</span>
            </button>
            <button
              onClick={() => handleEditClick('pages')}
              className="px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold rounded-lg hover:bg-amber-500/30 transition flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Contact Page Text</span>
            </button>
          </>
        );

      default:
        return (
          <button
            onClick={() => handleEditClick('pages')}
            className="px-3 py-1 bg-amber-400 text-red-950 font-bold rounded-lg hover:bg-amber-300 transition flex items-center space-x-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Page Content</span>
          </button>
        );
    }
  };

  return (
    <div className="bg-slate-900 text-amber-100 border-b border-amber-500/30 py-2 px-4 shadow-md sticky top-0 z-50 animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1 text-amber-400 font-bold font-mono uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN MODE</span>
          </span>
          <span className="text-slate-300 font-serif hidden sm:inline">
            You are viewing the site as Admin ({userProfile?.display_name || userProfile?.role})
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {getPageSpecificControls()}

          <button
            onClick={() => setActiveView('admin')}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-lg border border-slate-700 transition flex items-center space-x-1 font-mono font-medium"
          >
            <span>Full Admin Portal</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
