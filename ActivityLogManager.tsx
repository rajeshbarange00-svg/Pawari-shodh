import React, { useState, useMemo } from 'react';
import { useCms } from '../../lib/CmsContext';
import { useAuth } from '../../lib/AuthContext';
import { ActivityLogItem } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  Download, 
  Book, 
  FileText, 
  Users, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

export const ActivityLogManager: React.FC = () => {
  const { activityLogs, clearActivityLogs, logActivity, lang } = useCms();
  const { userProfile, isSuperAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  // Filter logs based on search, category, action, and timeframe
  const filteredLogs = useMemo(() => {
    let result = [...activityLogs];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(log => 
        log.title.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q)) ||
        log.performedBy.toLowerCase().includes(q) ||
        (log.performedByEmail && log.performedByEmail.toLowerCase().includes(q)) ||
        log.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(log => log.category === selectedCategory);
    }

    // Action filter
    if (selectedAction !== 'all') {
      result = result.filter(log => log.action === selectedAction);
    }

    // Timeframe filter
    if (selectedTimeframe !== 'all') {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (selectedTimeframe === 'today') {
        const startOfToday = new Date().setHours(0, 0, 0, 0);
        result = result.filter(log => new Date(log.timestamp).getTime() >= startOfToday);
      } else if (selectedTimeframe === '7days') {
        result = result.filter(log => now - new Date(log.timestamp).getTime() <= 7 * oneDay);
      } else if (selectedTimeframe === '30days') {
        result = result.filter(log => now - new Date(log.timestamp).getTime() <= 30 * oneDay);
      }
    }

    return result;
  }, [activityLogs, searchQuery, selectedCategory, selectedAction, selectedTimeframe]);

  // Statistics counters
  const totalCount = activityLogs.length;
  const booksCount = activityLogs.filter(l => l.category === 'books').length;
  const blogsCount = activityLogs.filter(l => l.category === 'blogs').length;
  const usersCount = activityLogs.filter(l => l.category === 'users').length;

  // Format date nicely
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('hi-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  // Badge styles by action
  const getActionBadge = (action: ActivityLogItem['action']) => {
    switch (action) {
      case 'create':
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">➕ CREATE</span>;
      case 'update':
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-blue-100 text-blue-800 border border-blue-300 uppercase">✏️ UPDATE</span>;
      case 'delete':
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-red-100 text-red-800 border border-red-300 uppercase">🗑️ DELETE</span>;
      case 'status_change':
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-purple-100 text-purple-800 border border-purple-300 uppercase">🔄 STATUS CHANGE</span>;
      case 'role_change':
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase">🔑 ROLE ACCESS</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-slate-100 text-slate-800 border border-slate-300 uppercase">{action}</span>;
    }
  };

  // Category Icon & Badge
  const getCategoryBadge = (category: ActivityLogItem['category']) => {
    switch (category) {
      case 'books':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-50 text-amber-900 border border-amber-200"><span>📖</span> <span>Books</span></span>;
      case 'blogs':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-sky-50 text-sky-900 border border-sky-200"><span>✍️</span> <span>Blog</span></span>;
      case 'users':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-purple-50 text-purple-900 border border-purple-200"><span>👥</span> <span>Users</span></span>;
      case 'articles':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200"><span>📰</span> <span>Articles</span></span>;
      case 'issues':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-200"><span>📚</span> <span>Issues</span></span>;
      case 'settings':
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-950 border border-amber-300"><span>⚙️</span> <span>Settings</span></span>;
      default:
        return <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-50 text-slate-700 border border-slate-200"><span>📂</span> <span>General</span></span>;
    }
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    if (activityLogs.length === 0) return;
    const headers = ['Log ID', 'Timestamp', 'Category', 'Action', 'Event Summary', 'Details', 'Performed By', 'Email'];
    const rows = filteredLogs.map(log => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.action}"`,
      `"${(log.title || '').replace(/"/g, '""')}"`,
      `"${(log.details || '').replace(/"/g, '""')}"`,
      `"${(log.performedBy || '').replace(/"/g, '""')}"`,
      `"${(log.performedByEmail || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pawari_cms_activity_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Handle Clear
  const handleConfirmClear = async () => {
    await clearActivityLogs();
    setIsClearModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 rounded-2xl p-6 shadow-md border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-400/30">
                <History className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-amber-50">
                Activity Log & Audit Trail (गतिविधि लॉग)
              </h1>
            </div>
            <p className="text-xs text-amber-200/90 pl-11">
              Tracks all recent changes, modifications, status updates, and deletions for Books, Blogs, and User Account Credentials.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-serif font-bold rounded-xl border border-amber-400/30 transition flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={activityLogs.length === 0}
              className="px-3.5 py-2 bg-amber-500 text-red-950 hover:bg-amber-400 font-serif font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Audit</span>
            </button>

            {isSuperAdmin && activityLogs.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="px-3 py-2 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-serif font-bold rounded-xl border border-red-500/30 transition flex items-center space-x-1"
                title="Clear activity log history"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-300" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Total Audit Logs</span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900">{totalCount}</div>
          <p className="text-[10px] text-slate-400">Total recorded CMS events</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs">
            <span className="font-semibold">Books Updates</span>
            <Book className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-950">{booksCount}</div>
          <p className="text-[10px] text-slate-400">Literature & book entries</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-sky-800 text-xs">
            <span className="font-semibold">Blog Updates</span>
            <FileText className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-sky-950">{blogsCount}</div>
          <p className="text-[10px] text-slate-400">Community blog posts</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-800 text-xs">
            <span className="font-semibold">User Modifications</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-purple-950">{usersCount}</div>
          <p className="text-[10px] text-slate-400">Account status & credentials</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, user email, title, or details..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Modules (सभी मॉड्यूल)</option>
            <option value="books">📖 Books (किताबें)</option>
            <option value="blogs">✍️ Blogs (ब्लॉग)</option>
            <option value="users">👥 Users & Credentials (यूजर्स)</option>
            <option value="articles">📰 Articles (लेख)</option>
            <option value="issues">📚 Issues (अंक)</option>
            <option value="settings">⚙️ Settings (सेटिंग्स)</option>
          </select>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Actions (सभी एक्शन)</option>
            <option value="create">➕ Create (नया जोड़ना)</option>
            <option value="update">✏️ Update (संशोधन)</option>
            <option value="delete">🗑️ Delete (हटाना)</option>
            <option value="status_change">🔄 Status Change (स्टेटस बदलें)</option>
            <option value="role_change">🔑 Role Access Change (रोल एक्सेस)</option>
          </select>

          {/* Timeframe Filter */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Time (पूरा समय)</option>
            <option value="today">Today (आज)</option>
            <option value="7days">Last 7 Days (7 दिन)</option>
            <option value="30days">Last 30 Days (30 दिन)</option>
          </select>

        </div>
      </div>

      {/* Activity Log List & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif font-bold text-slate-900 text-sm">
              Audit Logs Record ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Realtime Firestore & Audit Log Synced
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-slate-800 text-base">No Activity Logs Found</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No matching cms audit logs match your search filters or no actions have been performed in this timeframe.
            </p>
            {(searchQuery || selectedCategory !== 'all' || selectedAction !== 'all' || selectedTimeframe !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedAction('all');
                  setSelectedTimeframe('all');
                }}
                className="mt-2 text-xs font-serif font-bold text-amber-900 underline hover:text-amber-700"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Module</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Event Title & Summary</th>
                  <th className="p-3.5">Performed By</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-amber-50/40 transition cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="p-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {formatDate(log.timestamp)}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {getCategoryBadge(log.category)}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    <td className="p-3.5 font-medium text-slate-900 max-w-xs">
                      <div className="font-bold text-slate-900 font-serif line-clamp-1">{log.title}</div>
                      {log.details && (
                        <div className="text-[11px] text-slate-500 line-clamp-1">{log.details}</div>
                      )}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-serif font-bold text-[10px] flex items-center justify-center border border-amber-300">
                          {(log.performedBy || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[11px]">{log.performedBy}</div>
                          {log.performedByEmail && (
                            <div className="text-[10px] text-slate-400 font-mono">{log.performedByEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="px-2.5 py-1 text-[11px] font-serif font-bold text-amber-900 hover:bg-amber-100 rounded-lg transition"
                      >
                        View Full Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4">
            
            <div className="bg-red-950 text-amber-100 p-4 flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-amber-50">
                  Audit Log Detail ({selectedLog.id})
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-amber-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Module Category</span>
                  {getCategoryBadge(selectedLog.category)}
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Action Type</span>
                  {getActionBadge(selectedLog.action)}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Event Summary</span>
                <p className="font-serif font-bold text-sm text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedLog.title}
                </p>
              </div>

              {selectedLog.details && (
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Audit Log Description</span>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-slate-800 leading-relaxed font-sans text-xs">
                    {selectedLog.details}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Performed By User</span>
                  <div className="font-bold text-slate-900">{selectedLog.performedBy}</div>
                  <div className="text-[10px] font-mono text-slate-500">{selectedLog.performedByEmail || 'N/A'}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Timestamp</span>
                  <div className="font-mono text-slate-800">{formatDate(selectedLog.timestamp)}</div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-serif font-bold text-slate-800 rounded-xl transition text-xs"
                >
                  Close Window
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Audit Activity Logs?"
        message="Are you sure you want to wipe all recorded audit logs? This action cannot be undone."
        confirmText="Yes, Clear All Logs"
        cancelText="Cancel"
      />

    </div>
  );
};
