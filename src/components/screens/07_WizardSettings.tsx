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
      pageSubtitle="Configure operational windows, attendee capacity limits, and notification triggers."
    >

      <WizardStepHeader currentStepNumber={4} />

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Registration Window */}
        <div>
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <CalendarClock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Registration Window</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Registration Opens Date</label>
              <input
                type="date"
                value={settings.registration_opens_at ? settings.registration_opens_at.split('T')[0] : '2026-09-10'}
                onChange={(e) => handleUpdateSettings('registration_opens_at', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Form is active starting at 00:00 on this date</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Registration Closes Date</label>
              <input
                type="date"
                value={settings.registration_closes_at ? settings.registration_closes_at.split('T')[0] : '2026-09-18'}
                onChange={(e) => handleUpdateSettings('registration_closes_at', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Page automatically swaps to Closed state (Screen 17)</p>
            </div>
          </div>
        </div>

        {/* Capacity & Ticket Limits */}
        <div className="pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Capacity & Booking Limits</h3>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Maximum Registrations (Seat Cap)</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={settings.max_registrations || 500}
              onChange={(e) => handleUpdateSettings('max_registrations', parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Enforced atomically to prevent overbooking during high burst QR scans.
            </p>
          </div>
        </div>

        {/* After Registration Flow */}
        <div className="pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">After Registration Behavior</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50/30 cursor-pointer">
              <input
                type="radio"
                name="after_registration"
                checked={settings.after_registration === 'ticket'}
                onChange={() => handleUpdateSettings('after_registration', 'ticket')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Show Digital Ticket with Entry QR Code (Recommended)</div>
                <div className="text-[11px] text-slate-500">
                  Generates an instant attendee pass with scannable QR code and .ics calendar sync.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="after_registration"
                checked={settings.after_registration === 'redirect'}
                onChange={() => handleUpdateSettings('after_registration', 'redirect')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-900">Redirect to External Thank You URL</div>
                {settings.after_registration === 'redirect' && (
                  <input
                    type="url"
                    placeholder="https://acadeno.com/thank-you"
                    value={settings.redirect_url || ''}
                    onChange={(e) => handleUpdateSettings('redirect_url', e.target.value)}
                    className="mt-2 w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800"
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Notification Triggers */}
        <div className="pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Confirmation & Delivery Channels</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800">
              <input
                type="checkbox"
                checked={settings.send_email_confirmation}
                onChange={(e) => handleUpdateSettings('send_email_confirmation', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">Send instant confirmation email with ticket PDF attachment</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800">
              <input
                type="checkbox"
                checked={settings.send_whatsapp_confirmation}
                onChange={(e) => handleUpdateSettings('send_whatsapp_confirmation', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Send WhatsApp template notification via Cloud API</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-800">
              <input
                type="checkbox"
                checked={settings.allow_excel_export}
                onChange={(e) => handleUpdateSettings('allow_excel_export', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                <span className="font-semibold">Allow staff to export live registrations to Excel/CSV</span>
              </div>
            </label>
          </div>
        </div>

        {/* Data Protection DPDP Act 2023 Consent */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>India Digital Personal Data Protection (DPDP) Act 2023</span>
          </div>
          <p className="text-[11px] text-slate-500">
            A mandatory consent banner will be shown on the public registration form prior to submission.
          </p>
          <input
            type="text"
            value={settings.consent_text || ''}
            onChange={(e) => handleUpdateSettings('consent_text', e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 font-mono"
          />
        </div>

        {/* Wizard Navigation */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => { setWizardStep(3); setScreen('06_create_theme'); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back: Theme Builder</span>
          </button>

          <button
            onClick={() => { setWizardStep(5); setScreen('08_create_preview'); }}
            className="px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#0055FF] text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Next: Preview & Publish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};
