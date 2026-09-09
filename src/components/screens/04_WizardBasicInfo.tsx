import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  ArrowRight, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  ChevronDown
} from 'lucide-react';

export const WizardBasicInfoScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
    saveWizardDraft 
  } = useEventStore();

  const [savedNotice, setSavedNotice] = useState(false);

  const bannerPresets = [
    { label: 'AI & Tech', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cultural & Festive', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Corporate & Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80' },
  ];

  const currentBanner = wizardDraft.banner_url || bannerPresets[1].url;

  const handleNameChange = (val: string) => {
    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    updateWizardDraft({ 
      name: val,
      slug: wizardDraft.slug && wizardDraft.slug !== '' ? wizardDraft.slug : slugVal
    });
  };

  const handleBlur = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const isFormValid = Boolean(
    wizardDraft.name?.trim() && 
    wizardDraft.start_date && 
    wizardDraft.venue?.trim()
  );

  const handleNext = () => {
    if (!isFormValid) return;
    setWizardStep(2);
    setScreen('05_create_form');
  };

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* ========================================================================= */}
        {/* TOP HEADER SECTION (Back Link, Title, Subtitle, Script Accent)           */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => setScreen('03_events_list')}
              className="text-xs font-bold text-[#14213D] hover:text-[#1769FF] flex items-center gap-1.5 cursor-pointer mb-2 transition-colors select-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Events</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-[#14213D] font-sans tracking-tight leading-tight">
              Create Event — Step 1: Basic Info
            </h1>
            <p className="text-xs sm:text-sm text-[#7183A3] font-medium mt-1">
              Enter key facts: name, dates, venue, and banner image.
            </p>
          </div>

          {/* Right: Handwritten Decorative Accent */}
          <div className="text-right select-none transform -rotate-6 hidden sm:block shrink-0">
            <div className="font-['Caveat'] text-2xl sm:text-3xl font-bold text-[#14213D]/70 leading-tight tracking-wide">
              <div>Events</div>
              <div className="pl-3">Made Simple</div>
            </div>
            <svg className="w-24 h-4 text-[#1769FF]/50 ml-auto mt-0.5" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 10 Q 50 18, 95 6" />
            </svg>
          </div>
        </div>

        {/* Autosave notice */}
        {savedNotice && (
          <div className="flex items-center justify-end -mt-2">
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fade-in bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Autosaved as draft</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP PROGRESS BAR (Steps 1 to 5)                                          */}
        {/* ========================================================================= */}
        <WizardStepHeader currentStepNumber={1} />

        {/* ========================================================================= */}
        {/* MAIN EVENT FORM CARD                                                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 space-y-6">
          
          {/* Row 1: Event Name & Public URL Slug */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Event Name (7 Cols) */}
            <div className="lg:col-span-7">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5">
                EVENT NAME <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={wizardDraft.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="e.g. AI Automation Workshop 2026"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>

            {/* Public URL Slug (5 Cols) */}
            <div className="lg:col-span-5">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5">
                PUBLIC URL SLUG
              </label>
              <div className="flex items-center rounded-xl border border-slate-200/90 bg-[#F8FAFD] overflow-hidden">
                <span className="px-3.5 py-2.5 sm:py-3 bg-slate-100/90 text-slate-500 text-xs font-semibold border-r border-slate-200/90 select-none shrink-0">
                  acadeno.com/e/
                </span>
                <input
                  type="text"
                  value={wizardDraft.slug || ''}
                  onChange={(e) => updateWizardDraft({ slug: e.target.value })}
                  onBlur={handleBlur}
                  placeholder="ai-automation-workshop"
                  className="w-full px-3 py-2.5 sm:py-3 bg-transparent text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          {/* Row 2: Short Description / Agenda */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#1769FF]" />
              <span>SHORT DESCRIPTION / AGENDA</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <textarea
                rows={3}
                maxLength={300}
                value={wizardDraft.short_description || ''}
                onChange={(e) => updateWizardDraft({ short_description: e.target.value })}
                onBlur={handleBlur}
                placeholder="Provide a compelling 1-2 sentence overview of what attendees will gain..."
                className="w-full pl-10 pr-14 py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[90px]"
              />
              <span className="text-[10px] text-slate-400 font-medium absolute right-3 bottom-3 select-none pointer-events-none">
                {(wizardDraft.short_description || '').length}/300
              </span>
            </div>
          </div>

          {/* Row 3: Event Date & Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Event Date (6 Cols) */}
            <div className="sm:col-span-6">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5">
                EVENT DATE <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={wizardDraft.start_date || '2026-09-09'}
                  onChange={(e) => updateWizardDraft({ start_date: e.target.value, end_date: e.target.value })}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
              </div>
            </div>

            {/* Time Range (6 Cols) */}
            <div className="sm:col-span-6">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1769FF]" />
                <span>TIME RANGE (START & END)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={wizardDraft.start_time || '10:00 AM'}
                    onChange={(e) => updateWizardDraft({ start_time: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={wizardDraft.end_time || '1:00 PM'}
                    onChange={(e) => updateWizardDraft({ end_time: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  >
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: Venue / Location */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1769FF]" />
              <span>VENUE / LOCATION</span> <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={wizardDraft.venue || ''}
                onChange={(e) => updateWizardDraft({ venue: e.target.value })}
                onBlur={handleBlur}
                placeholder="e.g. ACADENO Conference Hall, Kozhikode or Google Meet"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F8FAFD] border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 5: Event Banner Image */}
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#14213D] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#1769FF]" />
              <span>EVENT BANNER IMAGE</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* Upload Box (7 Cols) */}
              <label className="sm:col-span-7 bg-[#EEF5FF]/60 hover:bg-[#EEF5FF] border border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100/90 text-[#1769FF] flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#14213D] truncate">
                      Upload event banner
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      Recommended size: 1920 × 640 (JPG, PNG)
                    </div>
                  </div>
                </div>

                <div className="bg-white hover:bg-blue-50 text-[#1769FF] border border-blue-200/90 text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all shrink-0">
                  <span>Choose Image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      updateWizardDraft({ banner_url: url });
                    }
                  }}
                />
              </label>

              {/* Banner Live Preview (5 Cols) */}
              <div className="sm:col-span-5 relative h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
                <img
                  src={currentBanner}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateWizardDraft({ banner_url: '' })}
                  className="w-7 h-7 bg-white/95 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg flex items-center justify-center shadow-xs border border-slate-200 absolute top-2 right-2 transition-colors cursor-pointer"
                  title="Remove banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Presets Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 select-none">
              <span className="text-[11px] text-slate-400 font-bold shrink-0">
                Presets:
              </span>
              {bannerPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateWizardDraft({ banner_url: preset.url })}
                  className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all shrink-0 cursor-pointer ${
                    currentBanner === preset.url
                      ? 'bg-blue-50 border-blue-300 text-[#1769FF]'
                      : 'bg-[#F8FAFD] border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

          </div>

          {/* Validation Banner (Amber/Yellow) */}
          {!isFormValid && (
            <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[#B45309] text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706]" />
              <span>Please provide the <strong>Event Name</strong>, <strong>Date</strong>, and <strong>Venue</strong> to proceed.</span>
            </div>
          )}

          {/* Wizard Footer Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={saveWizardDraft}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Save Draft & Exit</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="px-6 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#0055FF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Form Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
