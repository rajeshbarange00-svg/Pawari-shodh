import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useCms } from '../../lib/CmsContext';
import { CustomRole, RolePermissions } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  ShieldCheck, 
  Shield, 
  PlusCircle, 
  Trash2, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  FileText, 
  BookOpen, 
  Inbox, 
  FileCode, 
  Settings,
  Lock,
  Edit3,
  X,
  Save,
  Plus
} from 'lucide-react';

export const RolesManager: React.FC = () => {
  const { roles, addCustomRole, deleteCustomRole, allUsers } = useAuth();

  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  
  const [permissions, setPermissions] = useState<RolePermissions>({
    canManageArticles: true,
    canManageIssues: false,
    canManageSubmissions: true,
    canManagePages: false,
    canManageSettings: false,
    canManageUsers: false,
    canManageBooks: true,
    canManageBlogs: true,
    canManageOther: true,
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [confirmingRoleDelete, setConfirmingRoleDelete] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanId = roleId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!cleanId || !roleName.trim()) {
      setErrorMsg('Please enter a valid Role ID and Role Name.');
      return;
    }

    if (roles.some(r => r.id === cleanId)) {
      setErrorMsg(`A role with ID "${cleanId}" already exists. Please choose another ID.`);
      return;
    }

    const newRoleObj: CustomRole = {
      id: cleanId,
      name: roleName.trim(),
      description: roleDesc.trim() || 'Custom editorial role',
      is_system: false,
      permissions,
      created_at: new Date().toISOString()
    };

    setCreatingRole(true);
    try {
      await addCustomRole(newRoleObj);
      setSuccessMsg(`Role "${newRoleObj.name}" created successfully and saved to Firestore!`);
      setRoleId('');
      setRoleName('');
      setRoleDesc('');
      setShowAddModal(false);
      setPermissions({
        canManageArticles: true,
        canManageIssues: false,
        canManageSubmissions: true,
        canManagePages: false,
        canManageSettings: false,
        canManageUsers: false,
        canManageBooks: true,
        canManageBlogs: true,
        canManageOther: true,
      });
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg('Failed to create role: ' + (err.message || String(err)));
    } finally {
      setCreatingRole(false);
    }
  };

  const handleSaveEditedRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setSavingEdit(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await addCustomRole(editingRole);
      setSuccessMsg(`Role "${editingRole.name}" updated successfully in Firestore!`);
      setEditingRole(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg('Failed to update role: ' + (err.message || String(err)));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteRole = async (targetRoleId: string) => {
    setDeletingRoleId(targetRoleId);
    setErrorMsg(null);
    try {
      await deleteCustomRole(targetRoleId);
      setSuccessMsg(`Role "${targetRoleId}" deleted successfully.`);
      setConfirmingRoleDelete(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to delete role: ' + (err.message || String(err)));
    } finally {
      setDeletingRoleId(null);
    }
  };

  const getUserCountForRole = (rId: string) => {
    return allUsers.filter(u => u.role === rId).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-amber-900/10 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-red-900" />
            <h1 className="text-xl font-serif font-bold text-slate-900">Manage Roles & Access Permissions</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Create custom roles, edit access permissions, and delete unneeded roles across your journal.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5 text-xs cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>➕ Add New Role (नया रोल बनाएं)</span>
          </button>

          <span className="px-3 py-1.5 bg-amber-100 text-red-950 rounded-lg text-xs font-bold font-mono">
            {roles.length} Total Roles
          </span>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* All Roles List */}
      <div className="bg-white border border-amber-900/10 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider">
              Active System & Custom Roles List
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Synced live with Firestore `roles` collection
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-xs flex items-center space-x-1.5 text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Role (नया रोल जोड़ें)</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {roles.map(r => {
            const userCount = getUserCountForRole(r.id);
            const isProtected = r.id === 'super_admin';

            return (
              <div key={r.id} className="p-5 hover:bg-amber-50/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-serif font-bold text-slate-900 text-base">
                      {r.name}
                    </span>
                    
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                      key: {r.id}
                    </span>

                    {r.is_system ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border border-amber-300">
                        System Default
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase font-mono border border-emerald-300">
                        Custom Role
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-slate-500 flex items-center space-x-1 pl-2 border-l">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{userCount} Assigned {userCount === 1 ? 'User' : 'Users'}</span>
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {r.description || 'No description provided.'}
                  </p>

                  {/* Granted Permissions Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.permissions?.canManageArticles && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <FileText className="w-3 h-3 text-red-900" />
                        <span>Articles</span>
                      </span>
                    )}
                    {r.permissions?.canManageIssues && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <BookOpen className="w-3 h-3 text-amber-700" />
                        <span>Issues</span>
                      </span>
                    )}
                    {r.permissions?.canManageSubmissions && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <Inbox className="w-3 h-3 text-sky-700" />
                        <span>Submissions</span>
                      </span>
                    )}
                    {r.permissions?.canManagePages && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <FileCode className="w-3 h-3 text-indigo-700" />
                        <span>Pages</span>
                      </span>
                    )}
                    {r.permissions?.canManageSettings && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <Settings className="w-3 h-3 text-slate-700" />
                        <span>Settings</span>
                      </span>
                    )}
                    {r.permissions?.canManageUsers && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Users</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit & Delete Role Action Buttons */}
                <div className="flex items-center space-x-2 self-start md:self-center">
                  <button
                    onClick={() => setEditingRole({ ...r, permissions: { ...r.permissions } })}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-lg transition text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Edit (संपादित करें)</span>
                  </button>

                  {isProtected ? (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded border">
                      <Lock className="w-3 h-3" />
                      <span>Protected</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmingRoleDelete(r.id)}
                      disabled={deletingRoleId === r.id}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 rounded-lg transition text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>{deletingRoleId === r.id ? 'Deleting...' : 'Delete (हटाएं)'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ADD NEW ROLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-red-900" />
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Create New Role (नया रोल बनाएं)
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Role ID Key <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. reviewer, book_editor"
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Lowercase & underscores only</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Role Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Peer Reviewer"
                    value={roleName}
                    onChange={e => setRoleName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short description of role permissions..."
                  value={roleDesc}
                  onChange={e => setRoleDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold font-serif mb-2 text-xs">
                  Module Access & Functional Permissions:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  
                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageArticles}
                      onChange={e => setPermissions({ ...permissions, canManageArticles: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Articles (लेख)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageIssues}
                      onChange={e => setPermissions({ ...permissions, canManageIssues: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Issues (अंक)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageBooks ?? true}
                      onChange={e => setPermissions({ ...permissions, canManageBooks: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Books (किताबें)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageBlogs ?? true}
                      onChange={e => setPermissions({ ...permissions, canManageBlogs: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Blogs (ब्लॉग)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageOther ?? true}
                      onChange={e => setPermissions({ ...permissions, canManageOther: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Other (अन्य सामग्री)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSubmissions}
                      onChange={e => setPermissions({ ...permissions, canManageSubmissions: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Submissions (सबमिशन)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManagePages}
                      onChange={e => setPermissions({ ...permissions, canManagePages: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">CMS Pages (पेज)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageSettings}
                      onChange={e => setPermissions({ ...permissions, canManageSettings: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Settings (सेटिंग्स)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={permissions.canManageUsers}
                      onChange={e => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
                      className="rounded text-red-900 focus:ring-red-900"
                    />
                    <span className="font-semibold text-slate-800">Users & Roles (यूजर्स)</span>
                  </label>

                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel (रद्द करें)
                </button>

                <button
                  type="submit"
                  disabled={creatingRole}
                  className="px-5 py-2 bg-red-950 hover:bg-red-900 text-amber-100 font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{creatingRole ? 'Creating...' : 'Save Role (सहेजें)'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editingRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Edit Role: {editingRole.name} ({editingRole.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingRole(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Role Display Name</label>
                <input
                  type="text"
                  required
                  value={editingRole.name}
                  onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRole.description || ''}
                  onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold font-serif mb-2 text-xs">
                  Module Access & Functional Permissions:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  
                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageArticles ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageArticles: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Articles (लेख)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageIssues ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageIssues: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Issues (अंक)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageBooks ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageBooks: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Books (किताबें)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageBlogs ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageBlogs: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Blogs (ब्लॉग)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageOther ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageOther: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Other (अन्य सामग्री)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageSubmissions ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageSubmissions: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Submissions (सबमिशन)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManagePages ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManagePages: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">CMS Pages (पेज)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageSettings ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageSettings: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Settings (सेटिंग्स)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={editingRole.permissions?.canManageUsers ?? false}
                      onChange={e => setEditingRole({
                        ...editingRole,
                        permissions: { ...editingRole.permissions, canManageUsers: e.target.checked }
                      })}
                      className="rounded text-amber-700 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-800">Users & Roles (यूजर्स)</span>
                  </label>

                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel (रद्द करें)
                </button>

                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingEdit ? 'Saving...' : 'Update Role (रोल सहेजें)'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE ROLE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmingRoleDelete)}
        title="Delete Role"
        message={`Are you sure you want to delete role "${confirmingRoleDelete}"? Any users currently assigned to this role will automatically be reassigned to "editorial".`}
        confirmLabel={deletingRoleId ? "Deleting..." : "Delete Role (हटाएं)"}
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => confirmingRoleDelete && handleDeleteRole(confirmingRoleDelete)}
        onCancel={() => setConfirmingRoleDelete(null)}
      />
    </div>
  );
};
