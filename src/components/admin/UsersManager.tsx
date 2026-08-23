import React, { useState, useEffect } from 'react';
import { useAuth, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { UserRole, UserProfile } from '../../types';
import { ShieldCheck, UserPlus, Shield, User, Mail, Lock, CheckCircle2, AlertTriangle, Trash2, Edit3, X, Save, KeyRound, Search, RefreshCw, Users } from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

export const UsersManager: React.FC = () => {
  const { allUsers, updateUserRole, updateUserStatus, updateUser, createUser, deleteUserAccount, refreshUsersList, isSuperAdmin, canManageUsers, userProfile, roles } = useAuth();
  const { setActiveAdminTab, logActivity } = useCms();

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editorial');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    refreshUsersList();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUsersList();
      setSuccessMsg('Users list refreshed successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term ||
      (u.display_name && u.display_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Edit User Modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('editorial');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'suspended' | 'disabled'>('active');
  const [editAssignedModules, setEditAssignedModules] = useState<string[]>(['articles', 'issues', 'books', 'blogs', 'other']);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete User confirmation state
  const [deletingUser, setDeletingUser] = useState<{ uid: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword || !newDisplayName) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      await createUser(newUserEmail, newUserPassword, newDisplayName, newRole);
      setSuccessMsg(`Successfully provisioned user account for ${newDisplayName} (${newUserEmail}) as ${newRole}.`);

      logActivity({
        category: 'users',
        action: 'create',
        title: `Provisioned New User Account (${newUserEmail})`,
        details: `Assigned Name: "${newDisplayName}", Initial Role: "${newRole}"`
      }).catch(console.warn);

      setNewUserEmail('');
      setNewUserPassword('');
      setNewDisplayName('');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Create user failed:', err);
      setErrorMsg(err?.message || 'Failed to create user account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (user: UserProfile) => {
    setEditingUser(user);
    setEditDisplayName(user.display_name || '');
    setEditEmail(user.email || '');
    setEditPassword(user.password || '');
    setEditRole(user.role || 'editorial');
    setEditStatus(user.status || 'active');
    setEditAssignedModules(
      user.assigned_modules && user.assigned_modules.length > 0
        ? user.assigned_modules
        : ['articles', 'issues', 'books', 'blogs', 'other']
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSavingEdit(true);
    setErrorMsg(null);

    const roleChanged = editingUser.role !== editRole;
    const statusChanged = editingUser.status !== editStatus;

    try {
      await updateUser(editingUser.uid, {
        display_name: editDisplayName.trim(),
        email: editEmail.trim().toLowerCase(),
        password: editPassword,
        role: editRole,
        status: editStatus,
        assigned_modules: editAssignedModules
      });

      let actionType: 'create' | 'update' | 'delete' | 'role_change' | 'status_change' = 'update';
      if (roleChanged) actionType = 'role_change';
      else if (statusChanged) actionType = 'status_change';

      logActivity({
        category: 'users',
        action: actionType,
        title: `Updated User Credentials & Access (${editEmail})`,
        details: `Name: "${editDisplayName}", Role: "${editRole}", Status: "${editStatus}", Modules: [${editAssignedModules.join(', ')}]`
      }).catch(console.warn);

      setSuccessMsg(`Updated user details for ${editDisplayName}.`);
      setEditingUser(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Save edit user error:', err);
      setErrorMsg(err?.message || 'Failed to update user account details.');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await deleteUserAccount(deletingUser.uid);

      logActivity({
        category: 'users',
        action: 'delete',
        title: `Deleted User Account (${deletingUser.email})`,
        details: `Removed account for ${deletingUser.name} (${deletingUser.uid})`
      }).catch(console.warn);

      setSuccessMsg(`Removed user account for ${deletingUser.name}.`);
      setDeletingUser(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to remove user account.');
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-serif font-bold text-slate-900">User Credentials & Role Access Control</h1>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold font-mono rounded-full border border-amber-200 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>{allUsers.length} Users</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Role-Based Access Control (RBAC): Provision accounts and assign system / custom roles</p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shrink-0 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Users'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-1">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Create User Form */}
      <div className="bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs space-y-4">
        <h2 className="text-sm font-serif font-bold text-slate-900 uppercase border-b pb-2 flex items-center space-x-2">
          <UserPlus className="w-4 h-4 text-red-900" />
          <span>Provision New CMS User</span>
        </h2>

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <input
            type="text"
            required
            placeholder="Display Name *"
            value={newDisplayName}
            onChange={e => setNewDisplayName(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="email"
            required
            placeholder="Email Address *"
            value={newUserEmail}
            onChange={e => setNewUserEmail(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars) *"
            value={newUserPassword}
            onChange={e => setNewUserPassword(e.target.value)}
            className="p-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />

          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value as UserRole)}
            className="p-2.5 bg-slate-50 border rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} {r.is_system ? '' : '(Custom)'}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="py-2.5 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-lg transition shadow-xs flex items-center justify-center space-x-1 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Adding...' : 'Add CMS User'}</span>
          </button>
        </form>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-900/10 shadow-2xs text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-amber-500 font-sans text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-slate-500 font-semibold text-xs whitespace-nowrap">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="p-2 bg-slate-50 border rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 text-xs"
          >
            <option value="all">All System Roles ({allUsers.length})</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-serif font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4 text-center">Quick Role Change</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <User className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No matching user accounts found</p>
                      <p className="text-xs text-slate-500">Try adjusting your search terms or role filters.</p>
                      {(searchTerm || roleFilter !== 'all') && (
                        <button
                          onClick={() => { setSearchTerm(''); setRoleFilter('all'); }}
                          className="mt-2 px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg hover:bg-amber-200 text-xs transition"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isSuperAdminEmail = user.email?.toLowerCase().trim() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase();

                  return (
                    <tr key={user.uid} className="hover:bg-amber-50/40 transition">
                      <td className="p-4 font-serif font-bold text-slate-900">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span>{user.display_name}</span>
                            {isSuperAdminEmail && (
                              <span className="text-[10px] font-sans font-normal text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                Owner / Admin
                              </span>
                            )}
                          </div>
                          
                          {/* Module badges */}
                          <div className="flex flex-wrap gap-1">
                            {(!user.assigned_modules || user.assigned_modules.includes('books')) && (
                              <span className="text-[9px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                                📖 Books
                              </span>
                            )}
                            {(!user.assigned_modules || user.assigned_modules.includes('blogs')) && (
                              <span className="text-[9px] bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                                ✍️ Blog
                              </span>
                            )}
                            {(!user.assigned_modules || user.assigned_modules.includes('other')) && (
                              <span className="text-[9px] bg-purple-50 text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                                📂 Other
                              </span>
                            )}
                            {(!user.assigned_modules || user.assigned_modules.includes('articles')) && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                                📰 Articles
                              </span>
                            )}
                            {(!user.assigned_modules || user.assigned_modules.includes('issues')) && (
                              <span className="text-[9px] bg-slate-100 text-slate-800 border border-slate-200 px-1.5 py-0.5 rounded-md font-sans font-semibold">
                                📚 Issues
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                    <td className="p-4 font-mono text-slate-600">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <select
                        value={user.status || 'active'}
                        disabled={isSuperAdminEmail}
                        onChange={async (e) => {
                          const val = e.target.value as 'active' | 'inactive' | 'suspended' | 'disabled';
                          try {
                            await updateUserStatus(user.uid, val);
                            setSuccessMsg(`Status updated to "${val.toUpperCase()}" for ${user.display_name || user.email}.`);
                            setTimeout(() => setSuccessMsg(null), 3500);
                          } catch (err: any) {
                            setErrorMsg('Failed to update status.');
                          }
                        }}
                        className={`p-1.5 rounded-lg border font-bold text-xs cursor-pointer focus:ring-2 focus:ring-amber-500 disabled:opacity-60 ${
                          user.status === 'inactive' || user.status === 'disabled'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : user.status === 'suspended'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        <option value="active">Active (सक्रिय)</option>
                        <option value="inactive">Inactive (निष्क्रिय)</option>
                        <option value="suspended">Suspended (निलंबित)</option>
                        <option value="disabled">Disabled (अक्षम/ब्लॉक)</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded-full uppercase ${
                        user.role === 'super_admin' ? 'bg-amber-500 text-red-950 font-extrabold' :
                        user.role === 'director' ? 'bg-red-900 text-amber-100' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <select
                        value={user.role}
                        disabled={isSuperAdminEmail}
                        onChange={e => updateUserRole(user.uid, e.target.value as UserRole)}
                        className="p-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-xs text-slate-800 disabled:opacity-60 cursor-pointer"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.name} {r.is_system ? '' : '(Custom)'}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(user)}
                          title="Edit User Credentials & Access"
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-lg transition flex items-center space-x-1 shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Edit</span>
                        </button>

                        {!isSuperAdminEmail && (
                          <button
                            type="button"
                            onClick={() => setDeletingUser({ uid: user.uid, name: user.display_name || user.email })}
                            title="Delete user account"
                            className="px-2.5 py-1 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold border border-slate-200 hover:border-red-200 rounded-lg transition flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-red-700">Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-slate-900">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base">Edit User Account Credentials</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Login Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored for CMS login verification</span>
                </label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={e => setEditPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.is_system ? '' : '(Custom)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'active' | 'inactive' | 'suspended' | 'disabled')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="active">Active (सक्रिय)</option>
                    <option value="inactive">Inactive (निष्क्रिय)</option>
                    <option value="suspended">Suspended (निलंबित)</option>
                    <option value="disabled">Disabled (अक्षम/ब्लॉक)</option>
                  </select>
                </div>
              </div>

              {/* Module Access Selection (Books, Blog, Other, etc.) */}
              <div className="pt-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Assigned Content Modules Access (मॉड्यूल एक्सेस अनुमतियां)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">Assign which sections this user account can publish and manage:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editAssignedModules.includes('books')}
                      onChange={e => {
                        if (e.target.checked) {
                          setEditAssignedModules(prev => [...prev.filter(m => m !== 'books'), 'books']);
                        } else {
                          setEditAssignedModules(prev => prev.filter(m => m !== 'books'));
                        }
                      }}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-bold text-slate-800">📖 Books (किताबें)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editAssignedModules.includes('blogs')}
                      onChange={e => {
                        if (e.target.checked) {
                          setEditAssignedModules(prev => [...prev.filter(m => m !== 'blogs'), 'blogs']);
                        } else {
                          setEditAssignedModules(prev => prev.filter(m => m !== 'blogs'));
                        }
                      }}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-bold text-slate-800">✍️ Blog (ब्लॉग)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editAssignedModules.includes('other')}
                      onChange={e => {
                        if (e.target.checked) {
                          setEditAssignedModules(prev => [...prev.filter(m => m !== 'other'), 'other']);
                        } else {
                          setEditAssignedModules(prev => prev.filter(m => m !== 'other'));
                        }
                      }}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-bold text-slate-800">📂 Other (अन्य सामग्री)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editAssignedModules.includes('articles')}
                      onChange={e => {
                        if (e.target.checked) {
                          setEditAssignedModules(prev => [...prev.filter(m => m !== 'articles'), 'articles']);
                        } else {
                          setEditAssignedModules(prev => prev.filter(m => m !== 'articles'));
                        }
                      }}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-bold text-slate-800">📰 Articles (लेख)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editAssignedModules.includes('issues')}
                      onChange={e => {
                        if (e.target.checked) {
                          setEditAssignedModules(prev => [...prev.filter(m => m !== 'issues'), 'issues']);
                        } else {
                          setEditAssignedModules(prev => prev.filter(m => m !== 'issues'));
                        }
                      }}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-bold text-slate-800">📚 Issues (अंक)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingEdit ? 'Saving Changes...' : 'Save User Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER MODAL */}
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title="Delete User Account"
        message={`Are you sure you want to delete user account "${deletingUser?.name}"? This action will permanently remove their credentials and revoke access.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Account"}
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
};
