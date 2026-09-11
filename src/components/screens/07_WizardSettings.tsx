import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { 
  CalendarClock, 
  Users, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  FileSpreadsheet, 
  CheckCircle2,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const WizardSettingsScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
  } = useEventStore();

  const settings = wizardDraft.settings || {
    registration_opens_at: new Date().toISOString().split('T')[0],
    registration_closes_at: '',
    max_registrations: 500,
    require_payment: false,
    after_registration: 'ticket',
    send_email_confirmation: true,
    send_whatsapp_confirmation: true,
    send_sms_confirmation: false,
    allow_excel_export: true,
    require_consent: true,
    consent_text: 'I agree to ACADENO event communications under the India DPDP Act 2023.'
  };

  const handleUpdateSettings = (key: string, value: any) => {
    updateWizardDraft({
      settings: {
        ...settings,
        [key]: value,
      }
    });
  };

  return (
    <AdminLayout activeNav="events">
      <div className="flex flex-col justify-between w-full min-h-[calc(100vh-4.5rem)] lg:min-h-[calc(100vh-4rem)]">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-1 shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101B33] tracking-tight font-sans">
              Create Event — Step 4: Settings & Limits
            </h1>
            <p className="text-xs sm:text-sm text-[#7184A3] font-medium mt-0.5">
              Configure operational windows, attendee capacity limits, and notification delivery triggers.
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

        {/* Main 2-Column Settings Card — Flex-1 to stretch & fill the viewport height perfectly */}
        <div className="flex-1 bg-white rounded-2xl border border-[#DCE5F0] shadow-[0_2px_12px_rgba(7,26,51,0.03)] p-4 sm:p-5 lg:p-6 my-2 flex flex-col justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch flex-1">
            
            {/* ========================================================================= */}
            {/* LEFT COLUMN: REGISTRATION WINDOW, CAPACITY, AND DPDP CONSENT (lg:col-span-6)*/}
            {/* ========================================================================= */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              
              {/* Section 1: Registration Operational Window */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CalendarClock className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Registration Operational Window
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#101B33]">
                      Registration Opens Date
                    </label>
                    <input
                      type="date"
                      value={settings.registration_opens_at ? settings.registration_opens_at.split('T')[0] : '2026-09-10'}
                      onChange={(e) => handleUpdateSettings('registration_opens_at', e.target.value)}
                      className="w-full h-9.5 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                    />
                    <p className="text-[10.5px] text-[#7184A3]">Form activates at 00:00 on this date</p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#101B33]">
                      Registration Closes Date
                    </label>
                    <input
                      type="date"
                      value={settings.registration_closes_at ? settings.registration_closes_at.split('T')[0] : '2026-09-18'}
                      onChange={(e) => handleUpdateSettings('registration_closes_at', e.target.value)}
                      className="w-full h-9.5 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                    />
                    <p className="text-[10.5px] text-[#7184A3]">Transitions to Closed state automatically</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Capacity & Booking Limits */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Users className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Capacity & Booking Limits
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#101B33]">
                      Maximum Registrations (Seat Cap)
                    </label>
                    <span className="text-[11px] font-semibold text-[#1463FF]">
                      Atomically Enforced
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={settings.max_registrations || 500}
                      onChange={(e) => handleUpdateSettings('max_registrations', parseInt(e.target.value) || 0)}
                      className="w-36 h-9.5 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all"
                    />
                    <div className="flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar">
                      {[100, 250, 500, 1000].map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          onClick={() => handleUpdateSettings('max_registrations', cap)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            settings.max_registrations === cap
                              ? 'bg-[#F0F5FF] border-[#1463FF] text-[#1463FF] font-bold shadow-2xs'
                              : 'bg-white border-[#DCE5F0] text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10.5px] text-[#7184A3]">
                    Prevents overbooking during high-volume participant traffic and QR registration scans.
                  </p>
                </div>
              </div>

              {/* Section 3: India DPDP Act 2023 Consent */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DCE5F0] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#101B33]">
                  <ShieldCheck className="w-4 h-4 text-[#1463FF]" />
                  <span>India Digital Personal Data Protection (DPDP) Act 2023</span>
                </div>
                <p className="text-[10.5px] text-[#7184A3]">
                  Mandatory privacy notice displayed on participant registration form:
                </p>
                <input
                  type="text"
                  value={settings.consent_text || ''}
                  onChange={(e) => handleUpdateSettings('consent_text', e.target.value)}
                  className="w-full h-8.5 px-3 bg-white border border-[#DCE5F0] rounded-lg text-xs text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF]"
                />
              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: AFTER REGISTRATION & NOTIFICATION CHANNELS (lg:col-span-6)  */}
            {/* ========================================================================= */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              
              {/* Section 4: After Registration Behavior */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    After Registration Behavior
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: Digital Ticket */}
                  <label className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    settings.after_registration === 'ticket'
                      ? 'border-[#1463FF] bg-[#F0F5FF]/70 ring-2 ring-[#1463FF]/15 shadow-2xs'
                      : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1463FF] flex items-center justify-center shrink-0">
                        <QrCode className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="radio"
                        name="after_registration"
                        checked={settings.after_registration === 'ticket'}
                        onChange={() => handleUpdateSettings('after_registration', 'ticket')}
                        className="text-[#1463FF] focus:ring-[#1463FF]"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101B33] flex items-center gap-1.5">
                        <span>Show Digital Pass</span>
                        <span className="text-[9.5px] font-bold text-[#1463FF] bg-blue-100/80 px-1.5 py-0.2 rounded-md">
                          Recommended
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7184A3] mt-0.5 leading-snug">
                        Instant pass with entry QR & .ics calendar sync.
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Redirect to URL */}
                  <label className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    settings.after_registration === 'redirect'
                      ? 'border-[#1463FF] bg-[#F0F5FF]/70 ring-2 ring-[#1463FF]/15 shadow-2xs'
                      : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="radio"
                        name="after_registration"
                        checked={settings.after_registration === 'redirect'}
                        onChange={() => handleUpdateSettings('after_registration', 'redirect')}
                        className="text-[#1463FF] focus:ring-[#1463FF]"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101B33]">
                        Redirect to URL
                      </div>
                      <div className="text-[11px] text-[#7184A3] mt-0.5 leading-snug">
                        Redirect participant to custom thank you page upon submit.
                      </div>
                    </div>
                  </label>

                </div>

                {settings.after_registration === 'redirect' && (
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="https://acadeno.com/thank-you"
                      value={settings.redirect_url || ''}
                      onChange={(e) => handleUpdateSettings('redirect_url', e.target.value)}
                      className="w-full h-8.5 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Section 5: Confirmation & Delivery Channels */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MessageSquare className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Confirmation & Delivery Channels
                  </h3>
                </div>

                <div className="space-y-2">
                  
                  {/* Email Channel */}
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    settings.send_email_confirmation
                      ? 'border-[#1463FF]/40 bg-[#F0F5FF]/50'
                      : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1463FF] flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#101B33] truncate">Instant Email Confirmation</div>
                        <div className="text-[10px] text-[#7184A3] truncate">Automated ticket PDF pass attachment</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.send_email_confirmation}
                      onChange={(e) => handleUpdateSettings('send_email_confirmation', e.target.checked)}
                      className="w-4 h-4 rounded text-[#1463FF] focus:ring-[#1463FF] cursor-pointer"
                    />
                  </label>

                  {/* WhatsApp Channel */}
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    settings.send_whatsapp_confirmation
                      ? 'border-emerald-400/40 bg-emerald-50/40'
                      : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#101B33] truncate">WhatsApp Pass Notification</div>
                        <div className="text-[10px] text-[#7184A3] truncate">Meta Cloud API direct ticket message</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.send_whatsapp_confirmation}
                      onChange={(e) => handleUpdateSettings('send_whatsapp_confirmation', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </label>

                  {/* Excel Export */}
                  <label className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    settings.allow_excel_export
                      ? 'border-slate-400/40 bg-slate-50/70'
                      : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#101B33] truncate">Live Excel/CSV Export</div>
                        <div className="text-[10px] text-[#7184A3] truncate">Allow staff & organizers export access</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allow_excel_export}
                      onChange={(e) => handleUpdateSettings('allow_excel_export', e.target.checked)}
                      className="w-4 h-4 rounded text-[#1463FF] focus:ring-[#1463FF] cursor-pointer"
                    />
                  </label>

                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Separate Bottom Action Bar */}
        <div className="flex items-center justify-between pt-1 shrink-0">
          <button
            type="button"
            onClick={() => { setWizardStep(3); setScreen('06_create_theme'); }}
            className="h-11 px-5 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back: Theme Builder</span>
          </button>

          <button
            type="button"
            onClick={() => { setWizardStep(5); setScreen('08_create_preview'); }}
            className="h-11 px-7 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(20,99,255,0.25)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Next: Preview & Publish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};
