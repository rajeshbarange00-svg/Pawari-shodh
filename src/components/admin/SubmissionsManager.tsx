import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { FileText, CheckCircle2, XCircle, Search, Mail, ExternalLink, Download, FileType, Clock, Trash2, ShieldCheck, UserPlus } from 'lucide-react';
import { Submission } from '../../types';
import { ManuscriptReviewModal } from './ManuscriptReviewModal';

export const SubmissionsManager: React.FC = () => {
  const { submissions, updateSubmissionStatus, deleteSubmission } = useCms();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Submission['status'] | 'all'>('all');
  const [selectedReviewSubmission, setSelectedReviewSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'pending': return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-xs font-bold border border-amber-200">Pending</span>;
      case 'under_review': return <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded text-xs font-bold border border-sky-200">Under Review</span>;
      case 'accepted': return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-xs font-bold border border-emerald-200">Accepted</span>;
      case 'revision_requested': return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-xs font-bold border border-amber-200">Revisions</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded text-xs font-bold border border-red-200">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Manuscript Submissions</h2>
          <p className="text-sm text-slate-500">Manage author submissions and review statuses.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-lg">No submissions found</p>
            <p className="text-sm">No manuscripts match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="p-4">Submission Details</th>
                  <th className="p-4">Author Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-amber-50/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{sub.title}</div>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(sub.submitted_at).toLocaleDateString()}</span>
                        {sub.file_name && <span className="flex items-center"><FileType className="w-3 h-3 mr-1"/> {sub.file_name}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{sub.author_name}</div>
                      <a href={`mailto:${sub.email}`} className="text-xs text-amber-600 hover:underline flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1" />
                        {sub.email}
                      </a>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedReviewSubmission(sub)}
                          className="px-3 py-1 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-lg transition shadow-2xs flex items-center space-x-1"
                          title="Assign Reviewer & Comments"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Review & Assign</span>
                        </button>

                        <select
                          value={sub.status}
                          onChange={(e) => updateSubmissionStatus(sub.id, e.target.value as Submission['status'])}
                          className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 outline-none hover:border-amber-400 transition"
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Review</option>
                          <option value="accepted">Accept</option>
                          <option value="revision_requested">Revisions</option>
                          <option value="rejected">Reject</option>
                        </select>
                        <button
                          onClick={() => {
                            if(window.confirm('Delete this submission permanently?')) {
                              deleteSubmission(sub.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReviewSubmission && (
        <ManuscriptReviewModal
          submission={selectedReviewSubmission}
          isOpen={!!selectedReviewSubmission}
          onClose={() => setSelectedReviewSubmission(null)}
        />
      )}
    </div>
  );
};
