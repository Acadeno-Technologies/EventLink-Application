import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  ArrowRight, 
  FileText, 
  Upload, 
  AlertCircle, 
  Trash2, 
  ChevronDown, 
  Loader2, 
  Link2
} from 'lucide-react';

import { toTitleCase, toSentenceCase, format12to24, format24to12 } from '../../utils/textUtils';
import { optimizeImageUpload } from '../../utils/imageCompressor';
import { themePresets } from '../../data/seedData';

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingBanner(true);
    try {
      const optimizedUrl = await optimizeImageUpload(file, { maxWidth: 1280, maxHeight: 720, quality: 0.84 });
      updateWizardDraft({ 
        banner_url: optimizedUrl,
        theme: {
          ...(wizardDraft.theme || themePresets.workshop),
          banner_url: optimizedUrl
        }
      });
      showToast('Cover image optimized and uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      showToast('Failed to process image file.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const [isSlugCustomized, setIsSlugCustomized] = useState(false);

  const handleNameChange = (val: string) => {
    const formattedName = toTitleCase(val);
    const slugVal = formattedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    updateWizardDraft({ 
      name: formattedName,
      slug: (isSlugCustomized && wizardDraft.slug && wizardDraft.slug.length > 1) ? wizardDraft.slug : slugVal
    });
  };

  const handleVenueChange = (val: string) => {
    if (val.trim().startsWith('http://') || val.trim().startsWith('https://')) {
      updateWizardDraft({ venue: val });
    } else {
      updateWizardDraft({ venue: toTitleCase(val) });
    }
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
      <div className="space-y-4 w-full">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex items-center justify-between gap-4 pb-0.5">
          <div>
            <h1 className="text-xl sm:text-[25px] font-extrabold text-[#071A33] tracking-tight font-sans">
              Create Event — Step 1: Basic Info
            </h1>
            <p className="text-xs sm:text-[12.5px] text-slate-500 font-medium mt-0.5">
              Enter key details: event name, schedule, venue location, and banner image.
            </p>
          </div>

          {/* Right Decorative 3D Calendar Illustration + Script Text */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 pr-1 select-none">
            {/* 3D Stylized Calendar Card */}
            <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-[0_4px_14px_rgba(20,99,255,0.2)] transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[14px] p-1.5 flex flex-col justify-between overflow-hidden relative">
                
                {/* Spiral Ring Binder Pins */}
                <div className="flex justify-around -mt-0.5">
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
                </div>

                {/* Calendar Grid Dots */}
                <div className="grid grid-cols-4 gap-1 my-auto px-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-amber-400 font-bold" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                </div>

                {/* Floating Plus Badge */}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1463FF] border-1.5 border-white text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                  +
                </div>
              </div>
            </div>

            {/* Handwritten Script Text */}
            <div className="flex flex-col text-left font-['Caveat',cursive] leading-tight select-none">
              <span className="text-xs sm:text-[13px] font-bold text-slate-700">Plan</span>
              <span className="text-xs sm:text-[13px] font-bold text-[#1463FF]">Connect</span>
              <span className="text-[11px] font-semibold text-slate-500 italic">Make it Happen</span>
            </div>
          </div>
        </div>

        {/* Main Compact Form Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(7,26,51,0.03)] border border-[#DCE5F0] space-y-4">
          
          {/* Row 1: Event Name (68%) & Public URL Slug (32%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            
            {/* Event Name */}
            <div className="lg:col-span-8">
              <label className="text-[11.5px] font-bold text-[#071A33] mb-1 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Name</span>
                <span className="text-[#E5484D] font-bold">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={wizardDraft.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="e.g. AI Automation Workshop 2026"
                  className="w-full h-10 pl-9 pr-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[13px] text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all font-medium"
                />
              </div>
            </div>

            {/* Public URL Slug */}
            <div className="lg:col-span-4">
              <label className="text-[11.5px] font-bold text-[#071A33] mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Public URL Slug</span>
              </label>
              <div className="flex items-center h-10 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] overflow-hidden focus-within:border-[#1463FF] focus-within:ring-2 focus-within:ring-[#1463FF]/15 focus-within:bg-white transition-all">
                <span className="px-2.5 h-full bg-[#F1F5F9] text-slate-500 text-[11px] font-semibold flex items-center border-r border-[#DCE5F0] select-none shrink-0 font-mono">
                  acadeno.com/e/
                </span>
                <input
                  type="text"
                  value={wizardDraft.slug || ''}
                  onChange={(e) => {
                    setIsSlugCustomized(true);
                    updateWizardDraft({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });
                  }}
                  onBlur={handleBlur}
                  placeholder="python-django-webinar"
                  className="w-full h-full px-2.5 bg-transparent text-xs sm:text-[12.5px] text-slate-900 font-medium placeholder-[#91A4C0] focus:outline-none font-mono"
                />
              </div>
            </div>

          </div>

          {/* Row 2: Short Description / Agenda (Compact Textarea) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11.5px] font-bold text-[#071A33] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Short Description / Agenda</span>
              </label>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">
                {(wizardDraft.short_description || '').length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={wizardDraft.short_description || ''}
              onChange={(e) => updateWizardDraft({ short_description: toSentenceCase(e.target.value) })}
              onBlur={handleBlur}
              placeholder="Provide a compelling 1-2 sentence overview of what attendees will gain..."
              className="w-full h-[78px] min-h-[78px] max-h-[100px] p-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[12.5px] text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all font-medium resize-y"
            />
          </div>

          {/* Row 3: Event Date (50%) & Time Range (25% Start, 25% End) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            
            {/* Event Date (50%) */}
            <div className="sm:col-span-6">
              <label className="text-[11.5px] font-bold text-[#071A33] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Date</span>
                <span className="text-[#E5484D] font-bold">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={wizardDraft.start_date || '2026-09-11'}
                  onChange={(e) => updateWizardDraft({ start_date: e.target.value, end_date: e.target.value })}
                  onBlur={handleBlur}
                  className="w-full h-10 pl-9 pr-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Time Range (Start & End - 25% each) */}
            <div className="sm:col-span-6">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11.5px] font-bold text-[#071A33] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1463FF]" />
                  <span>Time Range (Start & End)</span>
                </label>
                <span className="text-[11px] font-bold text-[#1463FF] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-blue-100 font-mono">
                  {wizardDraft.start_time || '10:00 AM'} – {wizardDraft.end_time || '01:00 PM'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Start Time Picker */}
                <div className="relative">
                  <input
                    type="time"
                    aria-label="Event Start Time"
                    value={format12to24(wizardDraft.start_time || '10:00 AM')}
                    onChange={(e) => {
                      if (e.target.value) {
                        updateWizardDraft({ start_time: format24to12(e.target.value) });
                      }
                    }}
                    onBlur={handleBlur}
                    className="w-full h-10 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[13px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all cursor-pointer"
                    title="Choose start time"
                  />
                </div>

                {/* End Time Picker */}
                <div className="relative">
                  <input
                    type="time"
                    aria-label="Event End Time"
                    value={format12to24(wizardDraft.end_time || '01:00 PM')}
                    onChange={(e) => {
                      if (e.target.value) {
                        updateWizardDraft({ end_time: format24to12(e.target.value) });
                      }
                    }}
                    onBlur={handleBlur}
                    className="w-full h-10 px-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[13px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all cursor-pointer"
                    title="Choose end time"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Row 4: Venue / Physical Address or Meet Link (Full Width) */}
          <div>
            <label className="text-[11.5px] font-bold text-[#071A33] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1463FF]" />
              <span>Venue / Physical Address or Meet Link</span>
              <span className="text-[#E5484D] font-bold">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={wizardDraft.venue || ''}
                onChange={(e) => handleVenueChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="e.g. ACADENO Conference Hall, Kozhikode or Google Meet Link"
                className="w-full h-10 pl-9 pr-3 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-[13px] text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 5: Event Cover Image (68% Upload area + 32% Preview) */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="text-[11.5px] font-bold text-[#071A33] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#1463FF]" />
                <span>Event Cover Image</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] font-semibold text-[#1463FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{showUrlInput ? 'Switch to File Upload' : 'Paste Image URL Link'}</span>
              </button>
            </div>

            {showUrlInput ? (
              <div className="space-y-2 animate-fade-in">
                <div className="relative">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    value={wizardDraft.banner_url || ''}
                    onChange={(e) => updateWizardDraft({ banner_url: e.target.value })}
                    placeholder="https://images.unsplash.com/... or direct image URL"
                    className="w-full h-10 pl-8.5 pr-3 bg-white border border-[#DCE5F0] rounded-xl text-xs text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-2 focus:ring-[#1463FF]/15 focus:border-[#1463FF] font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* Upload Box (68%) */}
                <label className="sm:col-span-8 bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] hover:border-[#1463FF] rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all h-[80px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1463FF] flex items-center justify-center shrink-0 border border-blue-100">
                      {isUploadingBanner ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#1463FF]" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#071A33] truncate">
                        {isUploadingBanner ? 'Uploading image...' : 'Upload cover image'}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                        Recommended size: 1920 × 640 (JPG, PNG, WebP)
                      </div>
                    </div>
                  </div>

                  <div className="bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE5F0] text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 shadow-2xs">
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

                {/* Banner Live Preview (32%) */}
                <div className="sm:col-span-4 relative h-[80px] rounded-2xl overflow-hidden border border-[#DCE5F0] shadow-2xs bg-slate-900 group">
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
                    className="w-6 h-6 bg-white/95 hover:bg-white text-slate-600 hover:text-rose-600 rounded-full flex items-center justify-center shadow-xs border border-slate-200 absolute top-1.5 right-1.5 transition-colors cursor-pointer"
                    title="Clear banner"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

              </div>
            )}

            {/* Compact Sample Covers Presets Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 select-none no-scrollbar">
              <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                Sample Covers:
              </span>
              {bannerPresets.map((preset, idx) => {
                const isSelected = currentBanner === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateWizardDraft({ banner_url: preset.url })}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
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

          {/* Compact Validation Notice Banner */}
          <div className="p-2.5 px-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[#B45309] text-[11.5px] font-medium flex items-center gap-2 animate-fade-in">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-3 h-3 text-amber-600" />
            </div>
            <span>Please specify the <strong>Event Name</strong>, <strong>Date</strong>, and <strong>Venue</strong> to proceed to Form Builder.</span>
          </div>

          {/* Compact Wizard Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={saveWizardDraft}
              className="h-10 px-4 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="h-10 px-5 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-[0_3px_12px_rgba(20,99,255,0.25)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Form Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </AdminLayout>
  );
};
