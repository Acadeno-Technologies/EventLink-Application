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
  AlertCircle
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useEventStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [use2FA, setUse2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const validateEmailFormat = (emailStr: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = email.trim();
    if (!validateEmailFormat(cleanEmail)) {
      setLoginError('Please enter a valid email address (e.g. admin@acadeno.com).');
      return;
    }

    if (!password) {
      setLoginError('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const success = login(cleanEmail, password);
      if (!success) {
        setLoginError('Incorrect password. Please verify your credentials.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08152F] overflow-x-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT PANEL: Deep Navy Branded Marketing Section (50% Split)              */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-[600px] lg:min-h-screen bg-gradient-to-br from-[#06112C] via-[#081A3E] to-[#040D22] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        
        {/* Soft geometric ambient gradients & blur orbs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[540px] h-[540px] rounded-full bg-gradient-to-tl from-blue-600/30 via-indigo-600/20 to-transparent blur-3xl pointer-events-none" />
        
        {/* Large smooth geometric curves overlay */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 select-none" 
          preserveAspectRatio="none" 
          viewBox="0 0 700 800" 
          fill="none"
        >
          <path 
            d="M-50 800 C 180 720, 380 580, 750 780 L 750 800 L -50 800 Z" 
            fill="url(#navyCurve1)" 
          />
          <path 
            d="M120 800 C 320 620, 480 480, 800 620 L 800 800 L 120 800 Z" 
            fill="url(#navyCurve2)" 
            opacity="0.6" 
          />
          <defs>
            <linearGradient id="navyCurve1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="navyCurve2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dotted Grid Pattern in Upper-Right */}
        <div className="absolute top-16 right-12 w-44 h-32 pointer-events-none opacity-25 select-none hidden sm:block">
          <svg width="100%" height="100%" fill="none">
            <pattern id="dotted-grid" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#93C5FD" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotted-grid)" />
          </svg>
        </div>

        {/* Top: Company / Product Logo Card */}
        <div className="relative z-10">
          <div className="bg-white rounded-2xl px-4 py-2.5 shadow-xl inline-flex items-center gap-3.5 border border-white/40 select-none">
            <img 
              src={acadenoLogoPng} 
              alt="ACADENO Logo" 
              className="h-9 sm:h-10 w-auto object-contain" 
              loading="eager"
            />
            <div className="w-[1px] h-7 bg-slate-200" />
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-extrabold text-[#0B152B] tracking-wider uppercase leading-tight font-sans">
                EVENTLINK
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-none">
                Event & Registration Platform
              </span>
            </div>
          </div>
        </div>

        {/* Center Marketing Statement & Features */}
        <div className="my-auto py-8 sm:py-10 relative z-10 space-y-6 max-w-xl">
          
          {/* Badge: Event & Registration Platform */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Event & Registration Platform</span>
          </div>

          {/* Large Bold Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans leading-[1.15] tracking-tight text-white">
            Seamlessly build,<br />
            brand, and scale<br />
            <span className="text-[#3882F6]">your events.</span>
          </h1>

          {/* Supporting paragraph */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg font-normal">
            Create dynamic registration forms, customize theme branding, issue scannable QR ticket passes, and analyze attendee momentum in real time.
          </p>

          {/* 3 Vertically Stacked Feature Items */}
          <div className="space-y-4 pt-2">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center shadow-md shadow-blue-950/40 shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-snug">5-Step Wizard</div>
                <div className="text-xs text-blue-200/80 font-normal">Drag & drop forms</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center shadow-md shadow-indigo-950/40 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-snug">Live QR Tickets</div>
                <div className="text-xs text-blue-200/80 font-normal">Instant check-ins</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-md shadow-emerald-950/40 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-snug">RBAC Staff</div>
                <div className="text-xs text-blue-200/80 font-normal">Central controls</div>
              </div>
            </div>

          </div>
        </div>

        {/* Handwritten-Style Decorative Phrase (Lower Right) */}
        <div className="absolute right-8 bottom-16 sm:bottom-20 pointer-events-none select-none text-right transform -rotate-6 z-10 hidden sm:block">
          <div className="font-['Caveat'] text-3xl sm:text-4xl font-bold text-blue-100/90 leading-tight tracking-wide drop-shadow-sm">
            <div>Events</div>
            <div className="pl-4">Made Simple</div>
          </div>
          <svg className="w-28 h-6 text-blue-300/80 ml-auto mt-0.5" viewBox="0 0 120 25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12 Q 60 22, 115 8" />
          </svg>
        </div>

        {/* Bottom Compliance & Security Note */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-300/90 pt-6 border-t border-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>ACADENO Secure Sign-In • India DPDP Act 2023 Compliant</span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: Bright Authentication Section (50% Split)                   */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 min-h-[600px] lg:min-h-screen bg-gradient-to-br from-[#F5F8FE] via-[#EDF3FB] to-[#E4EDF8] p-6 sm:p-10 lg:p-14 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Subtle geometric watermark shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <svg className="absolute -right-24 -bottom-24 w-[560px] h-[560px] text-blue-600/[0.04]" viewBox="0 0 400 400" fill="currentColor">
            <path d="M200 40 L360 340 H40 Z" />
          </svg>
          <div className="absolute top-12 right-12 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute bottom-12 left-12 w-80 h-80 rounded-full bg-indigo-200/25 blur-3xl" />
        </div>

        {/* Authentication Card Wrapper */}
        <div className="w-full max-w-[460px] flex flex-col items-center z-10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B152B] tracking-tight font-sans">
              Welcome <span className="text-[#0066FF] font-black">Back</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              Sign in to your ACADENO EventLink admin console
            </p>
          </div>

          {/* Large White Rounded Card */}
          <div className="w-full bg-white rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(11,21,43,0.07)] border border-slate-100/90 relative">
            
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake shadow-2xs">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-semibold">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field: EMAIL ADDRESS */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@acadeno.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                  />
                </div>
              </div>

              {/* Field: PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    PASSWORD
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
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
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
                <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-xl space-y-1.5 animate-slide-down">
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
                  className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C] hover:underline cursor-pointer transition-colors"
                >
                  {use2FA ? 'Standard sign in' : 'Sign in with 2FA'}
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#0052FF] hover:from-[#0047E0] hover:to-[#005AEB] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
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
          </div>

        </div>

      </div>

    </div>
  );
};
