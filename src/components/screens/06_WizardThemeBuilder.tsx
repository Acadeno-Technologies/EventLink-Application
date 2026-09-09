import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { ThemeTemplate, EventTheme } from '../../types';
import { themePresets } from '../../data/seedData';
import { 
  Palette, 
  Type, 
  Layout, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Eye,
  Calendar,
  MapPin,
  Ticket
} from 'lucide-react';

export const WizardThemeBuilderScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen 
  } = useEventStore();

  const currentTheme = wizardDraft.theme || themePresets.workshop;

  const presets: { id: ThemeTemplate; label: string; desc: string; previewColor: string }[] = [
    { id: 'workshop', label: 'Workshop (Blue & Amber)', desc: 'Professional, high-contrast, technical events', previewColor: '#1e3a8a' },
    { id: 'corporate', label: 'Corporate (Slate Dark)', desc: 'Executive seminars, boardroom talks, enterprise', previewColor: '#0f172a' },
    { id: 'festival', label: 'Festival (Fuchsia & Gold)', desc: 'Cultural celebrations, Onam, college fests', previewColor: '#c026d3' },
    { id: 'minimal', label: 'Minimal (Monochrome)', desc: 'Clean, modern, aesthetic gallery & design meets', previewColor: '#18181b' },
    { id: 'conference', label: 'Conference (Indigo & Cyan)', desc: 'Tech summits, multi-track symposiums', previewColor: '#4338ca' },
    { id: 'education', label: 'Education (Emerald Green)', desc: 'Academic courses, training workshops', previewColor: '#047857' },
    { id: 'custom', label: 'Custom Palette (Night Mode)', desc: 'Tailored dark mode with neon accents', previewColor: '#6366f1' },
  ];

  const handleSelectPreset = (templateId: ThemeTemplate) => {
    const preset = themePresets[templateId];
    updateWizardDraft({
      theme: {
        ...preset,
        logo_url: currentTheme.logo_url || '',
        banner_url: wizardDraft.banner_url || '',
      }
    });
  };

  const handleUpdateColors = (key: keyof EventTheme['colors'], val: string) => {
    updateWizardDraft({
      theme: {
        ...currentTheme,
        colors: {
          ...currentTheme.colors,
          [key]: val,
        }
      }
    });
  };

  const handleUpdateFont = (fontFamily: string) => {
    updateWizardDraft({
      theme: {
        ...currentTheme,
        typography: {
          ...currentTheme.typography,
          fontFamily,
        }
      }
    });
  };

  return (
    <AdminLayout
      activeNav="events"
      pageTitle="Create Event — Step 3: Theme Builder"
      pageSubtitle="Customize colors, typography, layout, and preview the live participant screen."
    >

      <WizardStepHeader currentStepNumber={3} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Theme Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Preset Templates */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-600" />
                Template Presets
              </h3>
              <span className="text-[11px] text-slate-400">Click to apply preset</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {presets.map((p) => {
                const isSelected = currentTheme.template === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white shadow-xs" 
                        style={{ backgroundColor: p.previewColor }} 
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                    <div className="font-bold text-xs text-slate-900 capitalize">{p.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.label.split('(')[1]?.replace(')', '') || ''}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Customizer */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Custom Colors</h3>
              <p className="text-[11px] text-slate-400">Fine-tune brand colors for buttons, highlights, and backgrounds</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.colors.primary}
                    onChange={(e) => handleUpdateColors('primary', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.primary}
                    onChange={(e) => handleUpdateColors('primary', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono uppercase text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.colors.button}
                    onChange={(e) => handleUpdateColors('button', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.button}
                    onChange={(e) => handleUpdateColors('button', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono uppercase text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Page Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.colors.background}
                    onChange={(e) => handleUpdateColors('background', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.background}
                    onChange={(e) => handleUpdateColors('background', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono uppercase text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.colors.text}
                    onChange={(e) => handleUpdateColors('text', e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.text}
                    onChange={(e) => handleUpdateColors('text', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded font-mono uppercase text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-indigo-600" />
                Typography & Font Family
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Outfit', 'Plus Jakarta Sans', 'Inter', 'Playfair Display'].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleUpdateFont(font)}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    currentTheme.typography.fontFamily === font
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                  style={{ fontFamily: font }}
                >
                  <div className="text-xs">{font}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Aa Bb 123</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wizard Navigation */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => { setWizardStep(2); setScreen('05_create_form'); }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back: Form Builder</span>
            </button>

            <button
              onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
              className="px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#0055FF] text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next: Operational Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Mobile Preview (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-indigo-600" />
              Live Participant View Preview
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Instant Sync
            </span>
          </div>

          {/* Phone Device Frame */}
          <div className="w-full max-w-sm rounded-[36px] p-3.5 bg-slate-900 border-4 border-slate-800 shadow-2xl relative">
            {/* Notch */}
            <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-900 rounded-full" />
            </div>

            {/* Inner Mobile Screen */}
            <div 
              className="rounded-[24px] overflow-hidden min-h-[500px] flex flex-col shadow-inner transition-colors duration-300"
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                fontFamily: currentTheme.typography.fontFamily,
              }}
            >
              {/* Event Header Banner */}
              <div 
                className="p-5 text-white relative"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/20 rounded inline-block mb-2">
                  {currentTheme.template}
                </div>
                <h4 className="text-base font-bold leading-tight mb-1">
                  {wizardDraft.name || 'AI Automation Workshop'}
                </h4>
                <div className="text-xs text-white/80 space-y-0.5">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{wizardDraft.start_date || '20 Sep 2026'} • {wizardDraft.start_time || '10:00 AM'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3" />
                    <span>{wizardDraft.venue || 'ACADENO Hall, Kozhikode'}</span>
                  </div>
                </div>
              </div>

              {/* Form Body Preview */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                
                <div className="space-y-2.5">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {wizardDraft.short_description || 'Hands-on session on practical AI automation.'}
                  </div>

                  {wizardDraft.form_schema?.slice(0, 3).map((f) => (
                    <div key={f.id} className="space-y-1">
                      <label className="block text-[11px] font-bold">
                        {f.label} {f.required && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        type="text"
                        disabled
                        placeholder={f.placeholder || `Enter ${f.label}`}
                        className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white/90 text-xs text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  ))}
                </div>

                {/* Styled Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    style={{
                      backgroundColor: currentTheme.colors.button,
                      color: currentTheme.colors.buttonText,
                    }}
                    className="w-full py-2.5 px-4 rounded-lg font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[9px] text-center text-slate-400 mt-2">
                    Secured by ACADENO EventLink • DPDP Compliant
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
