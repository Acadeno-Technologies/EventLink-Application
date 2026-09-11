import React, { useState } from 'react';
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
  QrCode,
  SlidersHorizontal
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

  const [isCustomCap, setIsCustomCap] = useState(![100, 250, 500, 1000].includes(settings.max_registrations || 0));

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
      <div className="space-y-4 w-full">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101B33] tracking-tight font-sans">
              Create Event — Step 4: Settings & Limits
            </h1>
            <p className="text-xs sm:text-sm text-[#7184A3] font-medium mt-1">
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

        {/* Main Settings Grid with Distinct Modular Card Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-3 sm:mt-4">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: 3 DISTINCT CARDS (lg:col-span-6)                            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* BOX 1: Registration Operational Window */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <CalendarClock className="w-4 h-4 text-[#1463FF]" />
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  Registration Operational Window
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#101B33]">
                    Registration Opens Date
                  </label>
                  <input
                    type="date"
                    value={settings.registration_opens_at ? settings.registration_opens_at.split('T')[0] : '2026-09-11'}
                    onChange={(e) => handleUpdateSettings('registration_opens_at', e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                  <p className="text-[11px] text-[#7184A3]">Form activates at 00:00 on this date</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#101B33]">
                    Registration Closes Date
                  </label>
                  <input
                    type="date"
                    value={settings.registration_closes_at ? settings.registration_closes_at.split('T')[0] : '2026-09-18'}
                    onChange={(e) => handleUpdateSettings('registration_closes_at', e.target.value)}
                    className="w-full h-10 px-3.5 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                  <p className="text-[11px] text-[#7184A3]">Transitions to Closed state automatically</p>
                </div>
              </div>
            </div>

            {/* BOX 2: Capacity & Booking Limits */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Capacity & Booking Limits
                  </h3>
                </div>
                <span className="text-[10.5px] font-semibold text-[#1463FF] bg-[#F0F5FF] px-2.5 py-0.5 rounded-md border border-[#1463FF]/20">
                  Atomically Enforced
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#101B33]">
                    Maximum Registrations (Seat Cap)
                  </label>
                  <span className="text-xs font-bold text-[#1463FF] bg-[#F0F5FF] px-2.5 py-0.5 rounded-md border border-[#1463FF]/20">
                    {settings.max_registrations ? `${settings.max_registrations.toLocaleString()} Seats Allowed` : 'No Limit'}
                  </span>
                </div>
                
                {/* 5-Option Selector (4 Presets + Custom Button) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[100, 250, 500, 1000].map((cap) => {
                    const isSelected = settings.max_registrations === cap && !isCustomCap;
                    return (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => {
                          setIsCustomCap(false);
                          handleUpdateSettings('max_registrations', cap);
                        }}
                        className={`h-10 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#F0F5FF] border-[#1463FF] text-[#1463FF] shadow-2xs ring-2 ring-[#1463FF]/20'
                            : 'bg-white border-[#DCE5F0] text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span>{cap}</span>
                      </button>
                    );
                  })}

                  {/* Dedicated Custom Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomCap(true)}
                    className={`col-span-2 sm:col-span-1 h-10 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isCustomCap || ![100, 250, 500, 1000].includes(settings.max_registrations || 0)
                        ? 'bg-[#F0F5FF] border-[#1463FF] text-[#1463FF] shadow-2xs ring-2 ring-[#1463FF]/20'
                        : 'bg-white border-[#DCE5F0] text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Custom</span>
                  </button>
                </div>

                {/* Customized Field Box with Steppers */}
                {(isCustomCap || ![100, 250, 500, 1000].includes(settings.max_registrations || 0)) && (
                  <div className="bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl p-3.5 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-[11.5px] font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1463FF]" />
                        <span>Enter Customized Seat Capacity:</span>
                      </label>
                      <span className="text-[10.5px] font-medium text-slate-500">
                        1 to 100,000 participants
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          max="100000"
                          value={settings.max_registrations || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            handleUpdateSettings('max_registrations', isNaN(val) ? 0 : val);
                          }}
                          placeholder="Type custom seat count (e.g. 75, 150, 350, 2500)..."
                          className="w-full h-10 pl-3.5 pr-14 bg-white border border-[#1463FF] rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/20 shadow-xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#1463FF] uppercase pointer-events-none">
                          Seats
                        </span>
                      </div>

                      {/* Quick Stepper Adjustments */}
                      <button
                        type="button"
                        onClick={() => {
                          const current = settings.max_registrations || 0;
                          handleUpdateSettings('max_registrations', Math.max(1, current - 25));
                        }}
                        className="h-10 px-3.5 bg-white hover:bg-slate-100 border border-[#DCE5F0] rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors"
                        title="Decrease by 25"
                      >
                        -25
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = settings.max_registrations || 0;
                          handleUpdateSettings('max_registrations', current + 25);
                        }}
                        className="h-10 px-3.5 bg-white hover:bg-slate-100 border border-[#DCE5F0] rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors"
                        title="Increase by 25"
                      >
                        +25
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-[#7184A3] pt-0.5">
                  Prevents overbooking during high-volume participant traffic and QR registration scans.
                </p>
              </div>
            </div>

            {/* BOX 3: India DPDP Act 2023 Consent */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1463FF]" />
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    India DPDP Act 2023 Consent
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  Compliance Required
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] text-[#7184A3]">
                  Mandatory privacy notice displayed on participant registration form:
                </p>
                <input
                  type="text"
                  value={settings.consent_text || 'I agree to receive event notifications under India DPDP Act 2023 regulations.'}
                  onChange={(e) => handleUpdateSettings('consent_text', e.target.value)}
                  className="w-full h-9.5 px-3.5 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#DCE5F0] rounded-xl text-xs text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all"
                />
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 2 DISTINCT CARDS (lg:col-span-6)                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* BOX 4: After Registration Behavior */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1463FF]" />
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  After Registration Behavior
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Option 1: Digital Ticket */}
                <label className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                  settings.after_registration === 'ticket'
                    ? 'border-[#1463FF] bg-[#F0F5FF]/70 ring-2 ring-[#1463FF]/15 shadow-2xs'
                    : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
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
                <label className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                  settings.after_registration === 'redirect'
                    ? 'border-[#1463FF] bg-[#F0F5FF]/70 ring-2 ring-[#1463FF]/15 shadow-2xs'
                    : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
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
                    className="w-full h-9 px-3.5 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#DCE5F0] rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] font-mono transition-all"
                  />
                </div>
              )}
            </div>

            {/* BOX 5: Confirmation & Delivery Channels */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_1px_3px_rgba(7,26,51,0.02)] space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <MessageSquare className="w-4 h-4 text-[#1463FF]" />
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  Confirmation & Delivery Channels
                </h3>
              </div>

              <div className="space-y-2.5">
                
                {/* Email Channel */}
                <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  settings.send_email_confirmation
                    ? 'border-[#1463FF]/40 bg-[#F0F5FF]/50'
                    : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7.5 h-7.5 rounded-lg bg-blue-100 text-[#1463FF] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#101B33] truncate">Instant Email Confirmation</div>
                      <div className="text-[11px] text-[#7184A3] truncate">Automated ticket PDF pass attachment</div>
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
                <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  settings.send_whatsapp_confirmation
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7.5 h-7.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-4 h-4 fill-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#101B33] truncate">WhatsApp Pass Notification</div>
                      <div className="text-[11px] text-[#7184A3] truncate">Meta Cloud API direct ticket message</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.send_whatsapp_confirmation}
                    onChange={(e) => handleUpdateSettings('send_whatsapp_confirmation', e.target.checked)}
                    className="w-4 h-4 rounded text-[#1463FF] focus:ring-[#1463FF] cursor-pointer"
                  />
                </label>

                {/* Excel Export */}
                <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  settings.allow_excel_export
                    ? 'border-slate-300 bg-[#F8FAFC]/80'
                    : 'border-[#DCE5F0] bg-white hover:bg-slate-50/50'
                }`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7.5 h-7.5 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#101B33] truncate">Live Excel/CSV Export</div>
                      <div className="text-[11px] text-[#7184A3] truncate">Allow staff & organizers export access</div>
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

        {/* Separate Bottom Action Bar */}
        <div className="flex items-center justify-between pt-2">
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
