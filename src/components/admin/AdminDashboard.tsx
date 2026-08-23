import React from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { 
  FileText, 
  BookOpen, 
  Book,
  Users, 
  Download, 
  Eye, 
  Bell, 
  PlusCircle, 
  Settings, 
  Sparkles, 
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { articles, issues, books, blogs, announcements, contactMessages, submissions, setActiveAdminTab } = useCms();
  const { userProfile, isSuperAdmin, isDirector } = useAuth();

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const reviewCount = articles.filter(a => a.status === 'under_review').length;
  
  const booksCount = books?.length || 0;
  const blogsCount = blogs?.length || 0;
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending').length;
  const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;

  const totalViews = articles.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const totalDownloads = articles.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 sm:p-8 shadow-md border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="uppercase">{userProfile?.role} Access Authorized</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">
            Welcome, {userProfile?.display_name || 'Admin'}
          </h1>
          <p className="text-xs text-amber-200/80 font-sans mt-1">
            Pawari Shodh Patrika Content Management System Overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('articles')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-red-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Article</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('books_blogs')}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 text-amber-200 font-bold text-xs rounded-xl border border-amber-500/40 transition shadow-xs flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Books & Blogs ({booksCount + blogsCount})</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Published Articles</span>
            <FileText className="w-5 h-5 text-red-900" />
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{publishedCount}</p>
          <p className="text-[11px] text-slate-500 font-mono">{draftCount} drafts, {reviewCount} in review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Journal Volumes</span>
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{issues.length}</p>
          <p className="text-[11px] text-slate-500 font-mono">Current Vol: {issues.find(i => i.status === 'current')?.volume || 1}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs space-y-2 cursor-pointer hover:border-amber-400 transition" onClick={() => setActiveAdminTab('submissions')}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Pending Submissions</span>
            <div className="relative">
              <FileText className="w-5 h-5 text-sky-600" />
              {pendingSubmissionsCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{pendingSubmissionsCount}</p>
          <p className="text-[11px] text-slate-500 font-mono">Requires review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-2xs space-y-2 cursor-pointer hover:border-amber-400 transition" onClick={() => setActiveAdminTab('dashboard')}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Unread Messages</span>
            <div className="relative">
              <Bell className="w-5 h-5 text-emerald-600" />
              {unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />}
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-slate-900">{unreadMessages}</p>
          <p className="text-[11px] text-slate-500 font-mono">Contact inquiries</p>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
        <h2 className="text-sm font-serif font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          Quick Management Modules
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => setActiveAdminTab('articles')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <FileText className="w-5 h-5 text-red-900" />
            <p className="font-serif font-bold text-slate-900">Articles</p>
            <p className="text-[10px] text-slate-500">Research papers</p>
          </button>

          <button
            onClick={() => setActiveAdminTab('issues')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <BookOpen className="w-5 h-5 text-amber-600" />
            <p className="font-serif font-bold text-slate-900">Volumes & Issues</p>
            <p className="text-[10px] text-slate-500">Journal editions</p>
          </button>

          <button
            onClick={() => setActiveAdminTab('books_blogs')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <Book className="w-5 h-5 text-amber-800" />
            <p className="font-serif font-bold text-slate-900">Books & Blogs</p>
            <p className="text-[10px] text-slate-500">Books, reviews & essays</p>
          </button>

          <button
            onClick={() => setActiveAdminTab('public_contributions')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <Users className="w-5 h-5 text-sky-600" />
            <p className="font-serif font-bold text-slate-900">Reader Contributions</p>
            <p className="text-[10px] text-slate-500">Approvals & submissions</p>
          </button>

          <button
            onClick={() => setActiveAdminTab('shabdkosh')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <p className="font-serif font-bold text-slate-900">Pawari Literature</p>
            <p className="text-[10px] text-slate-500">Shabdkosh, Paheli, Lokgeet</p>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400/50 rounded-xl text-left space-y-1 transition"
          >
            <Settings className="w-5 h-5 text-slate-700" />
            <p className="font-serif font-bold text-slate-900">Journal Settings</p>
            <p className="text-[10px] text-slate-500">Title, ISSN, Footer</p>
          </button>
        </div>
      </div>

      {/* Recent Submissions & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Manuscripts */}
        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif font-bold text-slate-900 text-sm">Recent Manuscripts</h3>
            <button onClick={() => setActiveAdminTab('submissions')} className="text-xs text-red-900 font-bold hover:underline">
              View All ({submissions.length})
            </button>
          </div>

          <div className="space-y-3">
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No submissions received yet.</p>
            ) : (
              submissions.slice(0, 4).map(sub => (
                <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-slate-900 line-clamp-1">{sub.title}</p>
                  <p className="text-slate-600 text-[11px]">{sub.author_name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Messages */}
        <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif font-bold text-slate-900 text-sm">Editorial Contact Inquiries</h3>
            <span className="text-xs text-slate-500 font-mono">{contactMessages.length} Messages</span>
          </div>

          <div className="space-y-3">
            {contactMessages.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No contact inquiries received yet.</p>
            ) : (
              contactMessages.slice(0, 4).map(msg => (
                <div key={msg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{msg.date}</span>
                  </div>
                  <p className="text-red-900 font-mono text-[11px]">{msg.email}</p>
                  <p className="text-slate-700 line-clamp-2">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
