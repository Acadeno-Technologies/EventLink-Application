import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
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
  ArrowRight
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
    colors: {
      primary: '#1e3a8a',
      background: '#f8fafc',
      text: '#0f172a',
      button: '#d97706',
      buttonText: '#ffffff'
    },
    typography: { fontFamily: 'Outfit' }
  };

  const fields = wizardDraft.form_schema || [];
  const hasBasicInfo = Boolean(wizardDraft.name && wizardDraft.start_date && wizardDraft.venue);
  const hasFields = fields.length > 0;
  const isReadyToPublish = hasBasicInfo && hasFields;

  const handlePublish = () => {
    if (!isReadyToPublish) return;
    setIsPublishing(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    setTimeout(() => {
      setIsPublishing(false);
      publishWizardEvent();
    }, 800);
  };

  return (
    <AdminLayout
      activeNav="events"
      pageTitle="Create Event — Step 5: Preview & Publish"
      pageSubtitle="Review participant appearance, verify checklist, and launch live."
    >

      <WizardStepHeader currentStepNumber={5} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Verification Checklist & Publish Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pre-flight Checklist */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Pre-Launch Readiness Checklist
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Basic Information Complete</div>
                  <div className="text-slate-500">{wizardDraft.name} • {wizardDraft.venue}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Registration Form Schema</div>
                  <div className="text-slate-500">{fields.length} dynamic questions configured</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Theme & Typography</div>
                  <div className="text-slate-500 capitalize">{wizardDraft.theme?.template || 'Custom'} Preset ({theme.typography.fontFamily})</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Delivery Channels Ready</div>
                  <div className="text-slate-500">
                    {wizardDraft.settings?.send_whatsapp_confirmation ? 'WhatsApp ' : ''}
                    {wizardDraft.settings?.send_email_confirmation ? '• Email Confirmations Active' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Ready for Distribution
            </div>
            <h4 className="text-lg font-bold font-display leading-snug">
              Publish Event & Generate Public Entry QR Code
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once published, the public link will go live immediately and participants can register using the dynamically generated ticket form.
            </p>

            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!isReadyToPublish || isPublishing}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>Publish Event Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={saveWizardDraft}
                className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-300" />
                <span>Save as Draft (Offline)</span>
              </button>
            </div>
          </div>

          {/* Back Navigation */}
          <button
            onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back: Settings</span>
          </button>

        </div>

        {/* Right Column: Live Mockup Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Viewport Mode Switcher */}
          <div className="w-full flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Participant Screen Preview
            </div>

            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all ${
                  deviceMode === 'mobile' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all ${
                  deviceMode === 'desktop' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div className={`w-full transition-all duration-300 ${
            deviceMode === 'mobile' 
              ? 'max-w-sm rounded-[36px] p-3.5 bg-slate-900 border-4 border-slate-800 shadow-2xl' 
              : 'rounded-2xl p-4 bg-slate-800 border border-slate-700 shadow-2xl'
          }`}>
            <div 
              className="rounded-[20px] overflow-hidden min-h-[550px] shadow-sm flex flex-col"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {/* Header Hero */}
              <div 
                className="p-6 text-white relative"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded inline-block mb-2">
                  {wizardDraft.theme?.template || 'Event'}
                </div>
                <h3 className="text-xl font-bold leading-tight mb-2">
                  {wizardDraft.name || 'AI Automation Workshop'}
                </h3>
                
                <div className="space-y-1 text-xs text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{wizardDraft.start_date || '20 Sep 2026'} • {wizardDraft.start_time || '10:00 AM'} - {wizardDraft.end_time || '1:00 PM'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{wizardDraft.venue || 'ACADENO Hall, Kozhikode'}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar: Capacity */}
              <div className="px-5 py-3 bg-white/70 border-b border-slate-200/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Seats Reserved:</span>
                <span className="font-bold text-emerald-600">0 of {wizardDraft.settings?.max_registrations || 150}</span>
              </div>

              {/* Form Schema Content */}
              <div className="p-5 space-y-4 flex-1">
                <div className="text-xs text-slate-600 leading-relaxed">
                  {wizardDraft.short_description || 'Hands-on workshop on practical AI automation.'}
                </div>

                <div className="space-y-3">
                  {fields.map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="block text-xs font-bold text-slate-800">
                        {f.label} {f.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder={f.placeholder || `Enter ${f.label}`}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    style={{
                      backgroundColor: theme.colors.button,
                      color: theme.colors.buttonText,
                    }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Reserve My Seat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[10px] text-center text-slate-400 mt-2">
                    Organized by ACADENO Software Solutions • India DPDP Compliant
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
