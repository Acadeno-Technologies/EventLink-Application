import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
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
  Lock
} from 'lucide-react';

export const WizardSettingsScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
    saveWizardDraft 
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
    <AdminLayout
      activeNav="events"
      pageTitle="Create Event — Step 4: Settings"
      pageSubtitle="Configure operational windows, attendee capacity limits, and notification delivery triggers."
    >
      <WizardStepHeader currentStepNumber={4} />

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 max-w-4xl mx-auto space-y-7">
        
        {/* Registration Window */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Registration Operational Window</h3>
              <p className="text-[11px] text-slate-400">Define the active window when attendees can submit their registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Registration Opens Date</label>
              <input
                type="date"
                value={settings.registration_opens_at ? settings.registration_opens_at.split('T')[0] : '2026-09-10'}
                onChange={(e) => handleUpdateSettings('registration_opens_at', e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
              <p className="text-[11px] text-slate-400">Form is active starting at 00:00 on this date</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Registration Closes Date</label>
              <input
                type="date"
                value={settings.registration_closes_at ? settings.registration_closes_at.split('T')[0] : '2026-09-18'}
                onChange={(e) => handleUpdateSettings('registration_closes_at', e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
              <p className="text-[11px] text-slate-400">Page automatically transitions to Closed state (Screen 17)</p>
            </div>
          </div>
        </div>

        {/* Capacity & Ticket Limits */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Capacity & Booking Limits</h3>
              <p className="text-[11px] text-slate-400">Set seat allocation limits to prevent venue overcrowding</p>
            </div>
          </div>

          <div className="max-w-sm space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Maximum Registrations (Seat Cap)</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={settings.max_registrations || 500}
              onChange={(e) => handleUpdateSettings('max_registrations', parseInt(e.target.value) || 0)}
              className="w-full h-10 px-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Enforced atomically to prevent overbooking during high-volume QR scan traffic.
            </p>
          </div>
        </div>

        {/* After Registration Flow */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">After Registration Behavior</h3>
              <p className="text-[11px] text-slate-400">Choose what the attendee sees immediately after submitting the form</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
              settings.after_registration === 'ticket'
                ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/10'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="after_registration"
                checked={settings.after_registration === 'ticket'}
                onChange={() => handleUpdateSettings('after_registration', 'ticket')}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Show Digital Ticket with Entry QR Code</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Generates an instant participant pass with scannable QR code and .ics calendar sync file.
                </div>
              </div>
            </label>

            <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
              settings.after_registration === 'redirect'
                ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/10'
                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="after_registration"
                checked={settings.after_registration === 'redirect'}
                onChange={() => handleUpdateSettings('after_registration', 'redirect')}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Redirect to External Thank You URL</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Redirect participant browser to a custom URL or thank you webpage upon submission.
                </div>
                {settings.after_registration === 'redirect' && (
                  <input
                    type="url"
                    placeholder="https://acadeno.com/thank-you"
                    value={settings.redirect_url || ''}
                    onChange={(e) => handleUpdateSettings('redirect_url', e.target.value)}
                    className="mt-3 w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Notification Triggers */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Confirmation & Delivery Channels</h3>
              <p className="text-[11px] text-slate-400">Automated messaging sent when attendee registration is recorded</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={settings.send_email_confirmation}
                onChange={(e) => handleUpdateSettings('send_email_confirmation', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800">Send instant confirmation email with ticket PDF pass attachment</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={settings.send_whatsapp_confirmation}
                onChange={(e) => handleUpdateSettings('send_whatsapp_confirmation', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800">Send WhatsApp template notification with direct pass link via Cloud API</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50 cursor-pointer text-xs text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={settings.allow_excel_export}
                onChange={(e) => handleUpdateSettings('allow_excel_export', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800">Allow staff and organizers to export live registrations to Excel/CSV</span>
              </div>
            </label>
          </div>
        </div>

        {/* Data Protection DPDP Act 2023 Consent */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>India Digital Personal Data Protection (DPDP) Act 2023</span>
          </div>
          <p className="text-[11px] text-slate-500">
            A mandatory consent banner will be displayed on the public registration form prior to submission.
          </p>
          <input
            type="text"
            value={settings.consent_text || ''}
            onChange={(e) => handleUpdateSettings('consent_text', e.target.value)}
            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Wizard Navigation */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            onClick={() => { setWizardStep(3); setScreen('06_create_theme'); }}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back: Theme Builder</span>
          </button>

          <button
            onClick={() => { setWizardStep(5); setScreen('08_create_preview'); }}
            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Next: Preview & Publish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

