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
      primary: '#1769FF',
      background: '#F8FAFC',
      text: '#0F172A',
      button: '#2563EB',
      buttonText: '#FFFFFF'
    },
    typography: { fontFamily: 'Plus Jakarta Sans' }
  };

  const fields = wizardDraft.form_schema || [];
  const hasBasicInfo = Boolean(wizardDraft.name && wizardDraft.start_date && wizardDraft.venue);
  const hasFields = fields.length > 0;
  const isReadyToPublish = hasBasicInfo && hasFields;

  const handlePublish = async () => {
    if (!isReadyToPublish) return;
    setIsPublishing(true);

    // Trigger confetti
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

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-6 max-w-[1240px] mx-auto">
        
        {/* Header with Back Link */}
        <div className="pb-1">
          <button
            type="button"
            onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
            className="text-xs font-semibold text-[#1463FF] hover:underline flex items-center gap-1.5 cursor-pointer mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 4: Settings & Limits</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight font-sans">
            Create Event — Step 5: Preview & Publish
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Review participant appearance, verify operational checklist, and launch live.
          </p>
        </div>

        <WizardStepHeader currentStepNumber={5} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Verification Checklist & Publish Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
          
          {/* Pre-flight Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Pre-Launch Readiness Checklist
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated validation of required configuration</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Basic Information Complete</div>
                  <div className="text-slate-500 mt-0.5">{wizardDraft.name} • {wizardDraft.venue}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Registration Form Schema</div>
                  <div className="text-slate-500 mt-0.5">{fields.length} dynamic questions configured</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Theme & Typography</div>
                  <div className="text-slate-500 mt-0.5 capitalize">{wizardDraft.theme?.template || 'Custom'} Preset ({theme.typography.fontFamily})</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-800">Delivery Channels Active</div>
                  <div className="text-slate-500 mt-0.5">
                    {wizardDraft.settings?.send_whatsapp_confirmation ? 'WhatsApp ' : ''}
                    {wizardDraft.settings?.send_email_confirmation ? '• Email Confirmations Active' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Action Card */}
          <div className="bg-gradient-to-br from-[#0B172B] to-[#1E293B] rounded-2xl p-6 text-white shadow-xl space-y-4 border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Ready for Live Distribution
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
                className="w-full h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                className="w-full h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Save className="w-3.5 h-3.5 text-slate-300" />
                <span>Save as Draft (Offline)</span>
              </button>
            </div>
          </div>

          {/* Back Navigation */}
          <button
            onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back: Settings</span>
          </button>

        </div>

        {/* Right Column: Live Mockup Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          {/* Viewport Mode Switcher */}
          <div className="w-full flex items-center justify-between mb-4 px-1">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Participant Screen Preview
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              {/* Optional Event Banner Image */}
              {(wizardDraft.banner_url || wizardDraft.theme?.banner_url) && (
                <div className="w-full h-32 sm:h-36 relative overflow-hidden bg-slate-950 border-b border-white/10">
                  <img 
                    src={wizardDraft.banner_url || wizardDraft.theme?.banner_url} 
                    alt={wizardDraft.name || 'Event Cover'} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              )}

              {/* Header Hero */}
              <div 
                className="p-6 text-white relative"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded inline-block mb-2">
                  {wizardDraft.theme?.template || 'Event'}
                </div>
                <h3 className="text-xl font-bold leading-tight mb-2 font-display">
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
              <div className="px-5 py-3 bg-white/80 border-b border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Seats Reserved:</span>
                <span className="font-bold text-emerald-600">0 of {wizardDraft.settings?.max_registrations || 150}</span>
              </div>

              {/* Form Schema Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-600 leading-relaxed mb-4">
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
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    style={{
                      backgroundColor: theme.colors.button,
                      color: theme.colors.buttonText,
                    }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
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

    </div>
  </AdminLayout>
);
};

