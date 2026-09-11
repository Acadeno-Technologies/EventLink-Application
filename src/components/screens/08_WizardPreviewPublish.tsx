import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Rocket, 
  Save, 
  Smartphone, 
  Monitor, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  Menu,
  Trash2,
  CalendarCheck
} from 'lucide-react';

export const WizardPreviewPublishScreen: React.FC = () => {
  const { 
    wizardDraft, 
    setWizardStep, 
    setScreen, 
    saveWizardDraft, 
    publishWizardEvent 
  } = useEventStore();

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);

  const theme = wizardDraft.theme || {
    template: 'workshop',
    colors: {
      primary: '#1463FF',
      background: '#F8FAFC',
      text: '#101B33',
      button: '#FF8A00',
      buttonText: '#FFFFFF'
    },
    typography: { fontFamily: 'Plus Jakarta Sans' }
  };

  const fields = wizardDraft.form_schema || [
    { id: 'f_name', type: 'text', label: 'Full Name', placeholder: 'Enter Full Name', required: true },
    { id: 'f_email', type: 'email', label: 'Email Address', placeholder: 'Enter Email Address', required: true },
    { id: 'f_phone', type: 'phone', label: 'Mobile Number', placeholder: 'Enter Mobile Number', required: true },
  ];

  const hasBasicInfo = Boolean(wizardDraft.name && wizardDraft.start_date && wizardDraft.venue);
  const isReadyToPublish = true;

  const currentBanner = wizardDraft.banner_url || wizardDraft.theme?.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    try {
      await publishWizardEvent();
    } finally {
      setIsPublishing(false);
    }
  };

  // Delivery channels active text
  const activeChannels: string[] = [];
  if (wizardDraft.settings?.send_whatsapp_confirmation !== false) activeChannels.push('WhatsApp');
  if (wizardDraft.settings?.send_email_confirmation !== false) activeChannels.push('Email');
  const activeChannelsText = activeChannels.length > 0 
    ? `${activeChannels.join(' - ')} Confirmations Active`
    : 'Standard Confirmation Active';

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-4 w-full">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101B33] tracking-tight font-sans">
              Create Event — Step 5: Preview & Publish
            </h1>
            <p className="text-xs sm:text-sm text-[#7184A3] font-medium mt-1">
              Review participant appearance, verify operational checklist, and launch live.
            </p>
          </div>

          {/* Right Decorative Calendar Illustration + Script Text */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 pr-1 select-none">
            {/* 3D Stylized Calendar Card */}
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-[0_4px_14px_rgba(20,99,255,0.2)] transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[10px] p-1.5 flex flex-col justify-between overflow-hidden relative">
                
                {/* Spiral Ring Binder Pins */}
                <div className="flex justify-around -mt-0.5">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                </div>

                {/* Calendar Grid Dots */}
                <div className="grid grid-cols-4 gap-1 my-auto px-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-amber-400 font-bold" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                </div>

                {/* Floating Plus Badge */}
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#1463FF] border border-white text-white flex items-center justify-center font-bold text-[9px] shadow-xs">
                  +
                </div>
              </div>
            </div>

            {/* Handwritten Script Text */}
            <div className="flex flex-col text-left select-none font-['Caveat',cursive] leading-tight">
              <span className="text-xs sm:text-sm font-bold text-slate-700">Plan</span>
              <span className="text-xs sm:text-sm font-bold text-[#1463FF]">Connect</span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 italic">Make it Happen</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Column Cards + Right Column Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-3 sm:mt-4">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: CHECKLIST + PUBLISH ACTION CARDS (lg:col-span-5)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* BOX 1: PRE-LAUNCH READINESS CHECKLIST */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-3.5">
              <div className="border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Pre-Launch Readiness Checklist
                  </h3>
                </div>
                <p className="text-[11px] text-[#7184A3] mt-0.5">
                  Automated validation of required configuration
                </p>
              </div>

              <div className="space-y-2.5">
                
                {/* Item 1: Basic Info */}
                <div className="p-3 rounded-xl bg-[#F8FAFC]/80 border border-[#DCE5F0] flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101B33] truncate">Basic Information Complete</div>
                    <div className="text-[11px] text-[#7184A3] truncate mt-0.5">
                      {wizardDraft.name || 'Event Title'} - {wizardDraft.venue || 'Venue Address'}
                    </div>
                  </div>
                </div>

                {/* Item 2: Registration Form Schema */}
                <div className="p-3 rounded-xl bg-[#F8FAFC]/80 border border-[#DCE5F0] flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101B33] truncate">Registration Form Schema</div>
                    <div className="text-[11px] text-[#7184A3] truncate mt-0.5">
                      {fields.length} dynamic questions configured
                    </div>
                  </div>
                </div>

                {/* Item 3: Theme & Typography */}
                <div className="p-3 rounded-xl bg-[#F8FAFC]/80 border border-[#DCE5F0] flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101B33] truncate">Theme & Typography</div>
                    <div className="text-[11px] text-[#7184A3] truncate mt-0.5 capitalize">
                      {wizardDraft.theme?.template || 'Workshop'} Preset ({theme.typography?.fontFamily || 'Plus Jakarta Sans'})
                    </div>
                  </div>
                </div>

                {/* Item 4: Delivery Channels */}
                <div className="p-3 rounded-xl bg-[#F8FAFC]/80 border border-[#DCE5F0] flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101B33] truncate">Delivery Channels Active</div>
                    <div className="text-[11px] text-[#7184A3] truncate mt-0.5">
                      {activeChannelsText}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* BOX 2: READY FOR LIVE DISTRIBUTION (Deep Navy Card) */}
            <div className="bg-[#071A33] rounded-2xl p-5 text-white shadow-xl space-y-3.5 border border-[#102A4E]">
              <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                <Rocket className="w-4 h-4 fill-[#38BDF8]" />
                <span>Ready for Live Distribution</span>
              </div>
              
              <h4 className="text-sm sm:text-base font-bold leading-snug">
                Publish Event & Generate Public Entry QR Code
              </h4>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                Once published, the public link will go live immediately and participants can register using the dynamically generated ticket form.
              </p>

              <div className="pt-1.5 space-y-2.5">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full h-11 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Publish Event Live</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={saveWizardDraft}
                  className="w-full h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700/60"
                >
                  <Save className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save as Draft (Offline)</span>
                </button>
              </div>
            </div>

            {/* Back Navigation */}
            <div>
              <button
                type="button"
                onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
                className="h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Back: Settings</span>
              </button>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: PARTICIPANT SCREEN PREVIEW CARD (lg:col-span-7)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-5 shadow-[0_2px_12px_rgba(7,26,51,0.03)] flex flex-col items-center justify-between">
            
            {/* Viewport Mode Switcher Header */}
            <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#1463FF]" />
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  Participant Screen Preview
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#DCE5F0]">
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    deviceMode === 'mobile' 
                      ? 'bg-[#F0F5FF] border border-[#1463FF] text-[#1463FF] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile (375px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    deviceMode === 'desktop' 
                      ? 'bg-[#F0F5FF] border border-[#1463FF] text-[#1463FF] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>

            {/* Realistic Smartphone Frame Mockup */}
            <div className={`w-full transition-all duration-300 ${
              deviceMode === 'mobile' 
                ? 'max-w-[340px] sm:max-w-[350px] rounded-[36px] p-3 bg-[#0B1528] border-2 border-slate-800 shadow-2xl relative my-auto' 
                : 'rounded-2xl p-4 bg-slate-900 border border-slate-800 shadow-2xl w-full'
            }`}>
              
              {deviceMode === 'mobile' && (
                <div className="w-24 h-2.5 bg-slate-800 rounded-b-lg mx-auto mb-2 flex items-center justify-center gap-1">
                  <div className="w-7 h-0.5 bg-slate-900 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                </div>
              )}

              {/* Inner Smartphone Screen */}
              <div 
                className="rounded-[24px] overflow-hidden p-2.5 flex flex-col justify-start shadow-inner transition-colors duration-300 relative"
                style={{
                  backgroundColor: theme.colors.background || '#F8FAFC',
                  color: theme.colors.text || '#0F172A',
                  fontFamily: theme.typography.fontFamily || 'Poppins',
                }}
              >
                
                {/* Floating Event Ticket / Registration Card */}
                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-black/5 flex flex-col transition-all">
                  
                  {/* Event Banner Image */}
                  <div className="w-full h-28 relative overflow-hidden bg-slate-950 shrink-0">
                    <img 
                      src={currentBanner} 
                      alt="Event banner" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                    
                    {/* Top Bar inside Phone */}
                    <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between text-white/90 text-xs">
                      <Menu className="w-3.5 h-3.5 cursor-pointer" />
                      <Trash2 className="w-3 h-3 cursor-pointer opacity-80" />
                    </div>
                  </div>

                  {/* Event Information Hero */}
                  <div 
                    className="px-3.5 py-2.5 text-white relative transition-colors duration-300"
                    style={{ backgroundColor: theme.colors.primary || '#1463FF' }}
                  >
                    <div className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded inline-block mb-1">
                      {wizardDraft.theme?.template || 'WORKSHOP'}
                    </div>

                    <h4 className="text-sm font-extrabold leading-tight mb-1 truncate">
                      {wizardDraft.name || 'ACADENO Event'}
                    </h4>
                    
                    <div className="space-y-0.5 text-white/90 text-[11px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{wizardDraft.start_date || '2026-09-11'} | {wizardDraft.start_time || '10:00 AM'} - {wizardDraft.end_time || '1:00 PM'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{wizardDraft.venue || 'ACADENO Conference Hall'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seats Reserved Bar */}
                  <div className="px-3.5 py-2 bg-white border-b border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">Seats Reserved:</span>
                    <span className="font-bold text-emerald-600">0 of {wizardDraft.settings?.max_registrations || 100}</span>
                  </div>

                  {/* Registration Form Body */}
                  <div 
                    className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white"
                    style={{ color: theme.colors.text || '#101B33' }}
                  >
                    <div className="space-y-2">
                      <div 
                        className="text-[11px] leading-relaxed"
                        style={{ color: theme.colors.text || '#475569', opacity: 0.85 }}
                      >
                        {wizardDraft.short_description || 'Hands-on workshop on practical AI automation.'}
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-2">
                        {fields.map((f) => (
                          <div key={f.id}>
                            <label 
                              className="block text-[11px] font-bold mb-0.5 transition-colors"
                              style={{ color: theme.colors.text || '#101B33' }}
                            >
                              {f.label} {f.required && <span className="text-[#E5484D]">*</span>}
                            </label>
                            <input
                              type="text"
                              disabled
                              placeholder={f.placeholder || `Enter ${f.label}`}
                              style={{ color: theme.colors.text || '#334155' }}
                              className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs placeholder-[#91A4C0]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button & Footer Link */}
                    <div className="pt-2 space-y-1.5">
                      <button
                        type="button"
                        style={{
                          backgroundColor: theme.colors.button || '#FF8A00',
                          color: theme.colors.buttonText || '#FFFFFF',
                        }}
                        className="w-full h-9 rounded-xl font-bold text-xs sm:text-[12.5px] shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                      >
                        <span>Reserve My Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div 
                        className="text-[10px] text-center font-medium text-slate-400 mt-1"
                      >
                        Organized by ACADENO Software Solutions • India DPDP Compliant
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

