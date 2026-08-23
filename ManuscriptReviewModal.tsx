import React, { useState } from 'react';
import { useCms } from '../../lib/CmsContext';
import { Submission, ReviewerAssignment, Article } from '../../types';
import { 
  X, 
  UserPlus, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Eye, 
  Mail, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  BookOpen, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface ManuscriptReviewModalProps {
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
}

export const ManuscriptReviewModal: React.FC<ManuscriptReviewModalProps> = ({
  submission,
  isOpen,
  onClose,
}) => {
  const { 
    saveSubmission, 
    editorialMembers, 
    openPdfViewer, 
    saveArticle, 
    issues, 
    articles 
  } = useCms();

  const [sub, setSub] = useState<Submission>({ ...submission });
  const [selectedEditorialMemberId, setSelectedEditorialMemberId] = useState<string>('');
  const [customReviewerName, setCustomReviewerName] = useState<string>('');
  const [customReviewerEmail, setCustomReviewerEmail] = useState<string>('');
  
  const [targetVolume, setTargetVolume] = useState<number>(issues[0]?.volume || 1);
  const [targetIssue, setTargetIssue] = useState<number>(issues[0]?.issue_number || 1);
  const [targetYear, setTargetYear] = useState<number>(issues[0]?.year || 2025);

  const [activeTab, setActiveTab] = useState<'details' | 'reviewers' | 'decision'>('reviewers');
  const [saving, setSaving] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle adding a reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    let name = '';
    let email = '';
    let reviewerId = '';

    if (selectedEditorialMemberId) {
      const member = editorialMembers.find(m => m.id === selectedEditorialMemberId);
      if (member) {
        name = member.name_english || member.name_hindi;
        email = member.email || '';
        reviewerId = member.id;
      }
    } else if (customReviewerName.trim()) {
      name = customReviewerName.trim();
      email = customReviewerEmail.trim();
    }

    if (!name) return;

    const newAssignment: ReviewerAssignment = {
      id: 'rev_' + Date.now(),
      reviewer_id: reviewerId || undefined,
      reviewer_name: name,
      reviewer_email: email || undefined,
      assigned_at: new Date().toISOString(),
      status: 'pending',
      comments: '',
      score: 5,
      recommendation: 'accept'
    };

    const updatedReviewers = [...(sub.assigned_reviewers || []), newAssignment];
    const updatedSub: Submission = {
      ...sub,
      assigned_reviewers: updatedReviewers,
      status: sub.status === 'pending' ? 'under_review' : sub.status
    };

    setSub(updatedSub);
    setSelectedEditorialMemberId('');
    setCustomReviewerName('');
    setCustomReviewerEmail('');
  };

  // Remove reviewer
  const handleRemoveReviewer = (revId: string) => {
    const updated = (sub.assigned_reviewers || []).filter(r => r.id !== revId);
    setSub({ ...sub, assigned_reviewers: updated });
  };

  // Update a reviewer's comments or score
  const handleUpdateReviewerAssignment = (revId: string, updates: Partial<ReviewerAssignment>) => {
    const updated = (sub.assigned_reviewers || []).map(r => {
      if (r.id === revId) {
        return { ...r, ...updates, reviewed_at: new Date().toISOString() };
      }
      return r;
    });
    setSub({ ...sub, assigned_reviewers: updated });
  };

  // Save changes to Firestore
  const handleSaveModal = async () => {
    setSaving(true);
    try {
      await saveSubmission(sub);
      onClose();
    } catch (e) {
      console.error('Error saving submission review:', e);
    } finally {
      setSaving(false);
    }
  };

  // One-click Publish as Article
  const handlePublishAsArticle = async () => {
    setSaving(true);
    setPublishSuccessMessage(null);
    try {
      const articleId = 'art_sub_' + Date.now();
      
      const newArticle: Article = {
        id: articleId,
        title_hindi: sub.title_hindi || sub.title,
        title_english: sub.title,
        slug: 'paper-' + Date.now(),
        authors: [{
          name: sub.author_name,
          email: sub.email,
          affiliation: 'Pawari Language Scholar',
          is_corresponding: true
        }],
        abstract_hindi: sub.abstract_hindi || sub.abstract || '',
        abstract_english: sub.abstract || '',
        keywords: ['पवारी शोध', 'Peer-Reviewed', sub.category || 'Linguistics'],
        doi: `10.5281/zenodo.psp.2026.${Math.floor(1000 + Math.random() * 9000)}`,
        pdf_url: sub.file_url || '',
        volume: targetVolume,
        issue: targetIssue,
        year: targetYear,
        category: sub.category || 'Pawari Linguistics & Literature',
        language: 'Hindi',
        status: 'published',
        page_numbers: '01–12',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };

      await saveArticle(newArticle);

      const updatedSub: Submission = {
        ...sub,
        status: 'accepted',
        converted_article_id: articleId
      };

      await saveSubmission(updatedSub);
      setSub(updatedSub);
      setPublishSuccessMessage(`Paper successfully converted and published as Article ID: ${articleId}!`);
    } catch (err) {
      console.error('Failed to publish submission as article:', err);
    } finally {
      setSaving(false);
    }
  };

  const isAlreadyPublished = !!sub.converted_article_id || articles.some(a => a.id === sub.converted_article_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 p-5 sm:p-6 text-amber-100 flex items-start justify-between rounded-t-3xl border-b border-amber-500/30">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Manuscript Peer Review System
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                sub.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                sub.status === 'under_review' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' :
                sub.status === 'revision_requested' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                sub.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                'bg-slate-500/20 text-slate-300 border border-slate-400/30'
              }`}>
                {sub.status.replace('_', ' ')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 leading-snug">
              {sub.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-200/80 font-mono">
              <span>Author: <strong className="text-amber-100">{sub.author_name}</strong></span>
              <span>Email: <a href={`mailto:${sub.email}`} className="underline hover:text-amber-300">{sub.email}</a></span>
              <span>Date: {new Date(sub.submitted_at).toLocaleDateString()}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-amber-200 hover:text-white bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('reviewers')}
            className={`py-3.5 px-4 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'reviewers' 
                ? 'border-red-900 text-red-950 font-serif font-bold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-700" />
            <span>Assign Reviewers & Comments ({sub.assigned_reviewers?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('decision')}
            className={`py-3.5 px-4 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'decision' 
                ? 'border-red-900 text-red-950 font-serif font-bold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Editorial Decision & Publishing</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-3.5 px-4 border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'details' 
                ? 'border-red-900 text-red-950 font-serif font-bold' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Manuscript Content</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">

          {publishSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{publishSuccessMessage}</span>
              </div>
              <button onClick={() => setPublishSuccessMessage(null)} className="text-emerald-700 hover:underline text-[11px]">Dismiss</button>
            </div>
          )}

          {/* TAB 1: Reviewers & Comments */}
          {activeTab === 'reviewers' && (
            <div className="space-y-6">
              
              {/* Assign Reviewer Form */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-900/15 space-y-4">
                <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-amber-700" />
                  <span>Assign Peer Reviewer (समीक्षक आवंटित करें)</span>
                </h3>

                <form onSubmit={handleAddReviewer} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Select Editorial Board Member
                    </label>
                    <select
                      value={selectedEditorialMemberId}
                      onChange={e => {
                        setSelectedEditorialMemberId(e.target.value);
                        if (e.target.value) {
                          setCustomReviewerName('');
                          setCustomReviewerEmail('');
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="">-- Choose Editorial Scholar --</option>
                      {editorialMembers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name_english} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedEditorialMemberId && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Or External Reviewer Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Prof. R. K. Sharma"
                          value={customReviewerName}
                          onChange={e => setCustomReviewerName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Reviewer Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="reviewer@university.edu"
                          value={customReviewerEmail}
                          onChange={e => setCustomReviewerEmail(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={!selectedEditorialMemberId && !customReviewerName.trim()}
                      className="px-4 py-2 bg-red-950 hover:bg-red-900 disabled:opacity-50 text-amber-100 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Selected Reviewer</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Assigned Reviewers List */}
              <div className="space-y-4">
                <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center justify-between border-b pb-2">
                  <span>Assigned Reviewers & Evaluation Reports</span>
                  <span className="text-xs font-mono text-slate-500">
                    Total: {sub.assigned_reviewers?.length || 0} Reviewer(s)
                  </span>
                </h3>

                {(!sub.assigned_reviewers || sub.assigned_reviewers.length === 0) ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-2">
                    <GraduationCap className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-bold">No reviewers assigned yet</p>
                    <p className="text-[11px]">Select an editorial board scholar or enter an external expert above to initiate peer review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sub.assigned_reviewers.map((rev, idx) => (
                      <div key={rev.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <h4 className="font-serif font-bold text-slate-900 text-sm">{rev.reviewer_name}</h4>
                            </div>
                            {rev.reviewer_email && (
                              <p className="text-[11px] text-slate-500 font-mono pl-7">{rev.reviewer_email}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <select
                              value={rev.status}
                              onChange={e => handleUpdateReviewerAssignment(rev.id, { status: e.target.value as any })}
                              className="text-xs p-1.5 bg-slate-50 border rounded-lg font-bold"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="declined">Declined</option>
                            </select>

                            <button
                              onClick={() => handleRemoveReviewer(rev.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                              title="Remove Reviewer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Recommendation & Rating */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Reviewer Recommendation:
                            </label>
                            <select
                              value={rev.recommendation || 'accept'}
                              onChange={e => handleUpdateReviewerAssignment(rev.id, { recommendation: e.target.value as any })}
                              className="w-full p-2 bg-slate-50 border rounded-lg font-bold"
                            >
                              <option value="accept">Accept Manuscript (स्वीकार्य)</option>
                              <option value="minor_revision">Minor Revisions Needed (आंशिक संशोधन)</option>
                              <option value="major_revision">Major Revisions Needed (प्रमुख संशोधन)</option>
                              <option value="reject">Reject (अस्वीकृत)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Quality Score Rating (1 - 5 Stars):
                            </label>
                            <div className="flex items-center space-x-1.5 p-1.5 bg-slate-50 border rounded-lg">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleUpdateReviewerAssignment(rev.id, { score: star })}
                                  className="p-0.5"
                                >
                                  <Star className={`w-4 h-4 ${star <= (rev.score || 5) ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                                </button>
                              ))}
                              <span className="text-xs font-mono font-bold text-amber-900 ml-2">
                                {rev.score || 5} / 5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Reviewer Detailed Comments */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center space-x-1">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                            <span>Reviewer Feedback & Comments (समीक्षक टिप्पणियाँ):</span>
                          </label>
                          <textarea
                            rows={3}
                            value={rev.comments || ''}
                            onChange={e => handleUpdateReviewerAssignment(rev.id, { comments: e.target.value })}
                            placeholder="Enter detailed editorial feedback, methodology critique, plagiarism observations..."
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:bg-white outline-none"
                          />
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: Decision & Convert */}
          {activeTab === 'decision' && (
            <div className="space-y-6">
              
              {/* Chief Editor Master Decision */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Chief Editorial Decision & Status</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Manuscript Master Review Status:
                    </label>
                    <select
                      value={sub.status}
                      onChange={e => setSub({ ...sub, status: e.target.value as any })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    >
                      <option value="pending">Pending Review (लंबित)</option>
                      <option value="under_review">Under Review (समीक्षाधीन)</option>
                      <option value="accepted">Accepted for Publication (प्रकाशन हेतु स्वीकृत)</option>
                      <option value="revision_requested">Revisions Requested (संशोधन अपेक्षित)</option>
                      <option value="rejected">Rejected (अस्वीकृत)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Overall Quality Rating:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={sub.review_score || 5}
                      onChange={e => setSub({ ...sub, review_score: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Editorial Board Master Summary / Decision Note:
                  </label>
                  <textarea
                    rows={4}
                    value={sub.editorial_comments || ''}
                    onChange={e => setSub({ ...sub, editorial_comments: e.target.value })}
                    placeholder="Enter final remarks sent to author or internal board notes..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Publish to Journal Section */}
              <div className="bg-gradient-to-r from-amber-900/10 via-red-950/5 to-amber-900/10 p-6 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-red-950 text-base flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>Publish as Research Paper (शोध पत्र के रूप में प्रकाशित करें)</span>
                    </h4>
                    <p className="text-xs text-slate-600">
                      Convert this accepted manuscript into an official research paper in the journal database with volume, issue, and Zenodo DOI generation.
                    </p>
                  </div>

                  {isAlreadyPublished && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold font-mono text-xs rounded-full border border-emerald-300 flex items-center space-x-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Published Article #{sub.converted_article_id}</span>
                    </span>
                  )}
                </div>

                {/* Target Volume & Issue Selection */}
                <div className="bg-white/80 p-4 rounded-xl border border-amber-300 space-y-3">
                  <label className="block text-slate-900 font-serif font-bold text-xs">
                    Target Volume & Issue Selection (प्रकाशन हेतु अंक एवं वॉल्यूम का चयन):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-600 font-bold mb-1">Select Journal Issue (अंक ड्रॉपडाउन):</label>
                      <select
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900"
                        value={
                          issues.find(i => i.volume === targetVolume && i.issue_number === targetIssue)?.id || 'custom'
                        }
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          if (selectedId !== 'custom') {
                            const found = issues.find(i => i.id === selectedId);
                            if (found) {
                              setTargetVolume(found.volume);
                              setTargetIssue(found.issue_number);
                              setTargetYear(found.year);
                            }
                          }
                        }}
                      >
                        <option value="custom">-- Choose Issue from Dropdown --</option>
                        {issues.map(iss => (
                          <option key={iss.id} value={iss.id}>
                            Vol. {iss.volume}, Issue {iss.issue_number} ({iss.year} - {iss.month}) — {iss.title_hindi || iss.title_english}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-bold mb-1">Volume (खंड):</label>
                      <input
                        type="number"
                        value={targetVolume}
                        onChange={e => setTargetVolume(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-bold mb-1">Issue No. (अंक):</label>
                      <input
                        type="number"
                        value={targetIssue}
                        onChange={e => setTargetIssue(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handlePublishAsArticle}
                    disabled={saving}
                    className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>{isAlreadyPublished ? 'Re-Sync Article Record' : 'Convert & Publish to Journal Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Manuscript Content */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Manuscript Title</span>
                  <p className="font-serif font-bold text-slate-900 text-base">{sub.title}</p>
                  {sub.title_hindi && <p className="font-serif text-slate-700 text-sm mt-0.5">{sub.title_hindi}</p>}
                </div>

                {sub.abstract && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Abstract (English)</span>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 bg-white p-3 rounded-xl border">{sub.abstract}</p>
                  </div>
                )}

                {sub.abstract_hindi && (
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Abstract (Hindi)</span>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1 bg-white p-3 rounded-xl border">{sub.abstract_hindi}</p>
                  </div>
                )}

                {sub.file_url && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Attached Manuscript Document</span>
                    <button
                      onClick={() => openPdfViewer(sub.file_url || '', sub.title)}
                      className="px-4 py-2 bg-red-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-red-900 transition flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>View Submitted Document / PDF ({sub.file_name || 'Manuscript'})</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveModal}
            disabled={saving}
            className="px-6 py-2.5 bg-red-950 text-amber-100 font-bold text-xs rounded-xl hover:bg-red-900 transition shadow-sm flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saving ? 'Saving Changes...' : 'Save Peer Review & Comments'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
