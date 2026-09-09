import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { UserRole, User } from '../../types';
import { 
  UserCog, 
  Plus, 
  ShieldCheck, 
  Mail, 
  Building2, 
  History, 
  Clock, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Shield,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export const StaffManagementScreen: React.FC = () => {
  const { 
    users, 
    currentUser, 
    currentRole, 
    auditLogs, 
    inviteUser, 
    updateUserRole, 
    showToast 
  } = useEventStore();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('Acadeno2026!');
  const [showInvitePassword, setShowInvitePassword] = useState(false);
  const [inviteRole, setInviteRole] = useState<UserRole>('staff');
  const [inviteDept, setInviteDept] = useState('Registration Desk');
  const [activeTab, setActiveTab] = useState<'users' | 'audit_logs'>('users');
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  const isSuperAdmin = currentRole === 'super_admin';

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'Ac@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInvitePassword(pwd);
    showToast(`Generated secure password: ${pwd}`);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Please enter both staff name and email address.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      showToast('Please enter a valid email address format (e.g. staff@acadeno.in).');
      return;
    }

    inviteUser(inviteName.trim(), inviteEmail.trim(), inviteRole, inviteDept.trim(), invitePassword);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInvitePassword('Acadeno2026!');
  };

  const handleCopyCredentials = (user: User) => {
    const text = `ACADENO Staff Portal Login\nEmail: ${user.email}\nPassword: ${user.password || 'Acadeno2026!'}\nRole: ${user.role.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setCopiedUserId(user.id);
    showToast(`Copied login credentials for ${user.name}`);
    setTimeout(() => setCopiedUserId(null), 2500);
  };

  return (
    <AdminLayout
      activeNav="staff"
      pageTitle="Staff & User Management"
      pageSubtitle="Super Admin console for role-based access control (RBAC), invitations, and audit trails."
      headerAction={
        isSuperAdmin ? (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Staff Member</span>
          </button>
        ) : undefined
      }
    >

      {!isSuperAdmin && (
        <div className="p-4 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Restricted View:</span> You are currently viewing as <strong>{currentRole.replace('_', ' ')}</strong>. 
            Only <strong>Super Admins</strong> have permission to modify roles or invite users. 
            Use the top navigation bar to switch your role to Super Admin.
          </div>
        </div>
      )}

      {/* Tabs: Users vs Audit Logs */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-2 shadow-sm mb-6 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Active Staff ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'audit_logs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>System Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">ACADENO Team Members</h3>
              <p className="text-xs text-slate-500">Manage permission levels for office staff and event operators</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => {
              const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

              return (
                <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{u.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          u.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{u.email}</span>
                        <span>•</span>
                        <span>{u.department || 'Operations'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden lg:block">
                      <div className="text-[11px] text-slate-400">Login Password:</div>
                      <div className="font-mono text-xs text-indigo-600 font-bold">
                        {u.password || 'Acadeno2026!'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCredentials(u)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs"
                      title="Copy Login Credentials"
                    >
                      {copiedUserId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline text-[11px] font-semibold">{copiedUserId === u.id ? 'Copied' : 'Copy Login'}</span>
                    </button>

                    {isSuperAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 capitalize focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="event_manager">Event Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 capitalize">
                        {u.role.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Audit Logs View */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Security & Operational Audit Log</h3>
            <p className="text-xs text-slate-500">Immutable record of sensitive actions (event publishing, deletions, role updates)</p>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-900 font-bold font-sans">{log.user_name}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] font-sans">
                    Target: {log.entity_type} #{log.entity_id}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-sans whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-slide-down space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-display">Invite New Staff Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Meera Nair"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address (Login Username)</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="meera@acadeno.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Password Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider">
                    Login Password
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showInvitePassword ? 'text' : 'password'}
                    required
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInvitePassword(!showInvitePassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showInvitePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role Permission</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 capitalize font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="super_admin">Super Admin (Full Access)</option>
                    <option value="event_manager">Event Manager (Create & Manage)</option>
                    <option value="staff">Staff (Check-in & View)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    placeholder="e.g. Registration Desk"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Login How-To Callout */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px]">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  <span>How Staff Log In:</span>
                </div>
                <p className="text-[11px] text-indigo-700/90 leading-relaxed">
                  The staff member can go to the login screen, enter their <strong>Email Address</strong> and this <strong>Password</strong> to immediately log into their portal with their assigned permissions.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shadow-sm"
                >
                  Save & Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
