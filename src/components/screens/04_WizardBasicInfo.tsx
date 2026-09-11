import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { 
  ArrowLeft,
  Calendar, 
  CalendarDays,
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  ArrowRight, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  ChevronDown,
  Loader2,
  Link2,
  Sparkles,
  Check
} from 'lucide-react';

export const WizardBasicInfoScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
    saveWizardDraft,
    showToast
  } = useEventStore();

  const [savedNotice, setSavedNotice] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const bannerPresets = [
    { label: 'AI & Tech', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cultural & Festive', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Corporate & Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80' },
  ];

  const currentBanner = wizardDraft.banner_url || bannerPresets[1].url;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingBanner(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateWizardDraft({ banner_url: dataUrl });
      showToast('Cover image uploaded successfully!');
      setIsUploadingBanner(false);
    };
    reader.onerror = () => {
      showToast('Failed to read image file.');
      setIsUploadingBanner(false);
    };
    reader.readAsDataURL(file);
  };

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
      <div className="space-y-6 max-w-[1040px] mx-auto">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight font-sans">
              Create Event — Step 1: Basic Info
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Enter key details: event name, schedule, venue location, and banner image.
            </p>
          </div>

          {/* Right Decorative Calendar Illustration + Script Text */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 pr-2">
            
            {/* 3D Stylized Calendar Card */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-[0_8px_20px_rgba(20,99,255,0.25)] transform -rotate-6 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[14px] p-2 flex flex-col justify-between overflow-hidden relative">
                
                {/* Spiral Ring Binder Pins */}
                <div className="flex justify-around -mt-1">
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                </div>

                {/* Calendar Grid Dots */}
                <div className="grid grid-cols-4 gap-1.5 my-auto px-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 font-bold" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                </div>

                {/* Floating Plus Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1463FF] border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-md">
                  +
                </div>
              </div>
            </div>

            {/* Handwritten Script Text */}
            <div className="flex flex-col text-left select-none font-['Caveat',cursive] leading-tight">
              <span className="text-sm sm:text-base font-bold text-slate-700">Plan</span>
              <span className="text-sm sm:text-base font-bold text-[#1463FF]">Connect</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 italic">Make it Happen</span>
            </div>

          </div>
        </div>

        {/* Step Progress Bar (5 Steps) */}
        <WizardStepHeader currentStepNumber={1} />

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_2px_14px_rgba(7,26,51,0.04)] border border-[#DCE5F0] space-y-6">
          
          {/* Row 1: Event Name & Public URL Slug (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Event Name */}
            <div className="lg:col-span-7">
              <label className="text-xs font-bold text-[#071A33] mb-1.5 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Name</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={wizardDraft.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="e.g. AI Automation Workshop 2026"
                  className="w-full h-11 pl-10 pr-4 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                />
              </div>
            </div>

            {/* Public URL Slug */}
            <div className="lg:col-span-5">
              <label className="text-xs font-bold text-[#071A33] mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Public URL Slug</span>
              </label>
              <div className="flex items-center h-11 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] overflow-hidden focus-within:border-[#1463FF] focus-within:ring-4 focus-within:ring-[#1463FF]/10 focus-within:bg-white transition-all">
                <span className="px-3.5 h-full bg-[#F1F5F9] text-slate-500 text-xs font-semibold flex items-center border-r border-[#DCE5F0] select-none shrink-0 font-mono">
                  acadeno.com/e/
                </span>
                <input
                  type="text"
                  value={wizardDraft.slug || ''}
                  onChange={(e) => updateWizardDraft({ slug: e.target.value })}
                  onBlur={handleBlur}
                  placeholder="ai-automation-workshop"
                  className="w-full h-full px-3 bg-transparent text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none font-mono"
                />
              </div>
            </div>

          </div>

          {/* Row 2: Short Description / Agenda */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#071A33] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Short Description / Agenda</span>
              </label>
              <span className="text-[11px] text-slate-400 font-semibold font-mono">
                {(wizardDraft.short_description || '').length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={wizardDraft.short_description || ''}
              onChange={(e) => updateWizardDraft({ short_description: e.target.value })}
              onBlur={handleBlur}
              placeholder="Provide a compelling 1-2 sentence overview of what attendees will gain..."
              className="w-full p-3.5 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium resize-y min-h-[85px]"
            />
          </div>

          {/* Row 3: Event Date & Time Range (2-Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            
            {/* Event Date */}
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-[#071A33] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Date</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={wizardDraft.start_date || '2026-09-11'}
                  onChange={(e) => updateWizardDraft({ start_date: e.target.value, end_date: e.target.value })}
                  onBlur={handleBlur}
                  className="w-full h-11 pl-10 pr-4 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Time Range (Start & End) */}
            <div className="sm:col-span-6">
              <label className="text-xs font-bold text-[#071A33] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Time Range (Start & End)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={wizardDraft.start_time || '10:00 AM'}
                    onChange={(e) => updateWizardDraft({ start_time: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full h-11 pl-3.5 pr-8 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all appearance-none cursor-pointer"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={wizardDraft.end_time || '1:00 PM'}
                    onChange={(e) => updateWizardDraft({ end_time: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full h-11 pl-3.5 pr-8 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all appearance-none cursor-pointer"
                  >
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: Venue / Physical Address or Meet Link */}
          <div>
            <label className="text-xs font-bold text-[#071A33] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1463FF]" />
              <span>Venue / Physical Address or Meet Link</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={wizardDraft.venue || ''}
                onChange={(e) => updateWizardDraft({ venue: e.target.value })}
                onBlur={handleBlur}
                placeholder="e.g. ACADENO Conference Hall, Kozhikode or Google Meet Link"
                className="w-full h-11 pl-10 pr-4 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 5: Event Cover Image */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#071A33] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Cover Image</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-semibold text-[#1463FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'Switch to File Upload' : 'Paste Image URL Link'}</span>
              </button>
            </div>

            {showUrlInput ? (
              <div className="space-y-2 animate-fade-in">
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    value={wizardDraft.banner_url || ''}
                    onChange={(e) => updateWizardDraft({ banner_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or direct image URL"
                    className="w-full h-11 pl-10 pr-4 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Upload Box */}
                <label className="sm:col-span-7 bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] hover:border-[#1463FF] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1463FF] flex items-center justify-center shrink-0 border border-blue-100">
                      {isUploadingBanner ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#1463FF]" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#071A33] truncate">
                        {isUploadingBanner ? 'Uploading image...' : 'Upload cover image'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        Recommended size: 1920 × 640 (JPG, PNG, WebP)
                      </div>
                    </div>
                  </div>

                  <div className="bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE5F0] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-2xs">
                    {isUploadingBanner ? 'Uploading...' : 'Browse File'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingBanner}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {/* Banner Live Preview */}
                <div className="sm:col-span-5 relative h-24 sm:h-28 rounded-2xl overflow-hidden border border-[#DCE5F0] shadow-sm bg-slate-900 group">
                  <img
                    src={currentBanner}
                    alt="Banner preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateWizardDraft({ banner_url: '' })}
                    className="w-7 h-7 bg-white/95 hover:bg-white text-slate-600 hover:text-rose-600 rounded-full flex items-center justify-center shadow-md border border-slate-200 absolute top-2 right-2 transition-colors cursor-pointer"
                    title="Clear banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* Presets Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 select-none no-scrollbar">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                Sample Covers:
              </span>
              {bannerPresets.map((preset, idx) => {
                const isSelected = currentBanner === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateWizardDraft({ banner_url: preset.url })}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0F5FF] border-[#1463FF] text-[#1463FF] font-bold shadow-2xs'
                        : 'bg-white border-[#DCE5F0] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Validation Notice Banner */}
          <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[#B45309] text-xs font-medium flex items-center gap-2.5 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span>Please specify the <strong>Event Name</strong>, <strong>Date</strong>, and <strong>Venue</strong> to proceed to Form Builder.</span>
          </div>

          {/* Wizard Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={saveWizardDraft}
              className="h-11 px-5 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="h-11 px-6 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(20,99,255,0.3)] transition-all flex items-center gap-2 cursor-pointer"
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


