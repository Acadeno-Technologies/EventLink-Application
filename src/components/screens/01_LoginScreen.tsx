import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import acadenoLogoPng from '../../assets/acadeno-logo.png';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  CalendarDays,
  QrCode,
  Users,
  KeyRound,
  AlertCircle,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { User } from '../../types';

export const LoginScreen: React.FC = () => {
  const { login, users, showToast } = useEventStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [use2FA, setUse2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const activeAuthorizedUsers: User[] = users.length > 0 ? users : [
    {
      id: 'd79ebd86-73b7-4f55-9108-cdda19919cf0',
      org_id: 'f56b03a9-9097-4638-8c4a-6f68227b2789',
      name: 'Super Admin',
      email: 'admin@acadeno.in',
      password: 'Acadeno2026!',
      role: 'super_admin',
      status: 'active',
      department: 'Executive Administration',
      created_at: new Date().toISOString()
    }
  ];

  const activeCredentialUser = activeAuthorizedUsers[selectedUserIndex] || activeAuthorizedUsers[0];

  const validateEmailFormat = (emailStr: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = email.trim();
    if (!validateEmailFormat(cleanEmail)) {
      setLoginError('Please enter a valid email address (e.g. admin@acadeno.in).');
      return;
    }

    if (!password) {
      setLoginError('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(cleanEmail, password);
      if (!result.success) {
        setLoginError(result.error || 'Invalid credentials. Access is restricted to authorized administrators and assigned staff.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Authentication error. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user: User) => {
    setEmail(user.email);
    setPassword(user.password || 'Acadeno2026!');
    setLoginError(null);
    showToast(`Filled credentials for ${user.name}`);
  };

  const handleCopyCredentials = (user: User) => {
    const text = `ACADENO EventLink Login\nEmail: ${user.email}\nPassword: ${user.password || 'Acadeno2026!'}\nRole: ${user.role.toUpperCase()}`;
    navigator.clipboard.writeText(text);
    setCopiedUserId(user.id);
    showToast(`Copied credentials for ${user.name}`);
    setTimeout(() => setCopiedUserId(null), 2500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08152F] overflow-x-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT PANEL: Deep Slate Branded Hero Section (50% Split)                   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-[520px] lg:min-h-screen bg-gradient-to-br from-[#06112C] via-[#0B1B3A] to-[#040D22] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        
        {/* Soft geometric ambient gradients */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        {/* Top: Company Logo Card */}
        <div className="relative z-10">
          <div className="bg-white rounded-2xl px-4 py-2.5 shadow-md inline-flex items-center gap-3.5 border border-white/20 select-none">
            <img 
              src={acadenoLogoPng} 
              alt="ACADENO Logo" 
              className="h-8 sm:h-9 w-auto object-contain" 
              loading="eager"
            />
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-extrabold text-[#0B152B] tracking-wider uppercase leading-tight font-sans">
                EVENTLINK
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                Enterprise SaaS Platform
              </span>
            </div>
          </div>
        </div>

        {/* Center Marketing Statement & Features */}
        <div className="my-auto py-8 sm:py-10 relative z-10 space-y-6 max-w-xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Event & Registration Platform</span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans leading-tight tracking-tight text-white">
            Build, brand, and scale<br />
            <span className="text-blue-400">your events.</span>
          </h1>

          {/* Supporting text */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
            Create custom registration forms, design on-brand themes, issue scannable QR ticket passes, and monitor real-time attendee conversions.
          </p>

          {/* 3 Vertically Stacked Feature Items */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-snug">5-Step Wizard</div>
                <div className="text-xs text-slate-400">Interactive form builder & theme customizer</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-snug">Live QR Pass Generation</div>
                <div className="text-xs text-slate-400">Instant check-ins, Apple/Google calendar export</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-snug">Multi-Role Staff Access</div>
                <div className="text-xs text-slate-400">Super Admin, Event Manager & Desk Staff controls</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Security Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400 pt-6 border-t border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>ACADENO Secure Sign-In • India DPDP Act 2023 Compliant</span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: Bright Authentication Section (50% Split)                   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-[520px] lg:min-h-screen bg-[#F8FAFC] p-6 sm:p-10 lg:p-14 flex flex-col items-center justify-center relative">
        
        {/* Authentication Card Wrapper */}
        <div className="w-full max-w-[460px] flex flex-col z-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sign In to <span className="text-blue-600 font-extrabold">EventLink</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Enter your credentials to access the management portal
            </p>
          </div>

          {/* White Card */}
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
            
            {loginError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">Access Denied</div>
                  <div className="text-[11px] leading-relaxed opacity-95">{loginError}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field: EMAIL ADDRESS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@acadeno.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Field: PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => alert('Password reset verification link dispatched to your registered email.')} 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Input (Revealed if 2FA active) */}
              {use2FA && (
                <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-1.5 animate-slide-down">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    Two-Factor Authentication Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-base font-mono py-2 bg-white border border-blue-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Remember this device & 2FA Toggle */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="font-medium text-xs">Remember this device</span>
                </label>

                <button
                  type="button"
                  onClick={() => setUse2FA(!use2FA)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer transition-colors"
                >
                  {use2FA ? 'Standard sign in' : 'Sign in with 2FA'}
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to EventLink</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Credential Helper Bar (Matches Design Spec) */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                <span>Authorized Credentials</span>
                <span className="text-[9px] text-blue-600 font-semibold">Click account to autofill</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div 
                    onClick={() => handleQuickFill(activeCredentialUser)}
                    className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                    title="Click to fill into form"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {activeCredentialUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {activeCredentialUser.name}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          {activeCredentialUser.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        <span className="text-slate-600">{activeCredentialUser.email}</span> • <span>{activeCredentialUser.department || 'Executive Administration'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(activeCredentialUser)}
                      className="h-7 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                      title="Copy Credentials"
                    >
                      {copiedUserId === activeCredentialUser.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedUserId === activeCredentialUser.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    {activeAuthorizedUsers.length > 1 && (
                      <select
                        value={selectedUserIndex}
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          setSelectedUserIndex(idx);
                          handleQuickFill(activeAuthorizedUsers[idx]);
                        }}
                        className="h-7 px-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        {activeAuthorizedUsers.map((u, idx) => (
                          <option key={u.id} value={idx}>
                            {u.role.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60 font-mono">
                  <span className="text-slate-400 font-sans text-[10px] font-bold uppercase tracking-wider">PASSWORD:</span>
                  <span className="text-blue-600 font-bold tracking-wide">
                    {activeCredentialUser.password || 'Acadeno2026!'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


