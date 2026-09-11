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
  Sparkles,
  Users,
  Key,
  ChevronRight,
  ShieldAlert,
  Trash2
} from 'lucide-react';

export const StaffManagementScreen: React.FC = () => {
  const { 
    users, 
    currentUser, 
    currentRole, 
    auditLogs, 
    inviteUser, 
    updateUserRole, 
    deleteUser,
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
      pageTitle="Staff & Access Management"
      pageSubtitle="Super Admin console for role-based access control (RBAC), invitations, and immutable audit trails."
      headerAction={
        isSuperAdmin ? (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Staff Member</span>
          </button>
        ) : undefined
      }
    >
      {!isSuperAdmin && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Restricted Operator View:</span> You are currently viewing as <strong className="capitalize">{currentRole.replace('_', ' ')}</strong>. 
            Only <strong>Super Admins</strong> have permission to modify roles or invite new staff members. 
            Use the top navigation role switcher to simulate Super Admin actions.
          </div>
        </div>
      )}

      {/* Tabs: Users vs Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-xs mb-6 flex items-center gap-2 max-w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Staff ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'audit_logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>System Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">ACADENO Team Members</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage permission levels for office staff, organizers, and event operators</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold self-start sm:self-auto">
              {users.length} Authorized Users
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => {
              const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

              return (
                <div key={u.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{u.name}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          u.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {u.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-400" /> {u.department || 'Operations'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-auto flex-wrap">
                    <div className="text-right hidden sm:block bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Password:</div>
                      <div className="font-mono text-xs text-blue-600 font-bold">
                        {u.password || 'Acadeno2026!'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCredentials(u)}
                      className="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                      title="Copy Login Credentials"
                    >
                      {copiedUserId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUserId === u.id ? 'Copied' : 'Copy Credentials'}</span>
                    </button>

                    {isSuperAdmin ? (
                      <div className="flex items-center gap-1.5">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                          className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 capitalize focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="event_manager">Event Manager</option>
                          <option value="staff">Staff</option>
                        </select>

                        {u.email !== 'admin@acadeno.in' && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove staff access for ${u.name}?`)) {
                                deleteUser(u.id);
                              }
                            }}
                            className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                            title="Remove Staff Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="h-9 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 capitalize flex items-center">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Security & Operational Audit Trail</h3>
              <p className="text-xs text-slate-500 mt-0.5">Immutable record of sensitive actions (event publishing, deletions, role modifications)</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              Real-time Logs
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/60 uppercase tracking-wider">
                        {log.action}
                      </span>
                      <span className="text-slate-900 font-bold">{log.user_name}</span>
                    </div>
                    <div className="text-slate-500 text-xs font-mono">
                      Target: <span className="font-semibold text-slate-700">{log.entity_type}</span> <span className="text-slate-400">#{log.entity_id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 self-end sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(log.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-slide-down space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Invite New Staff Member</h3>
                <p className="text-xs text-slate-500">Provide user details to configure their role-based access</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(false)} 
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Meera Nair"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address (Login Username)</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="meera@acadeno.in"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              {/* Password Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Login Password
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto-generate Secure</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showInvitePassword ? 'text' : 'password'}
                    required
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full h-10 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs sm:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInvitePassword(!showInvitePassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showInvitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role Permission</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs sm:text-sm"
                  >
                    <option value="super_admin">Super Admin (Full Access)</option>
                    <option value="event_manager">Event Manager (Create & Manage)</option>
                    <option value="staff">Staff (Check-in & View)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
                  <input
                    type="text"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    placeholder="e.g. Registration Desk"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Login How-To Callout */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>How Staff Log In:</span>
                </div>
                <p className="text-xs text-blue-800/90 leading-relaxed">
                  The staff member can go to the login screen, enter their <strong>Email Address</strong> and this <strong>Password</strong> to immediately log into their portal with their assigned permissions.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs text-xs sm:text-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Add Staff</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

