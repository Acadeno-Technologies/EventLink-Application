import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { 
  uploadImageToCloudinary, 
  getCloudinaryConfig, 
  setStoredCloudinaryConfig 
} from '../../utils/cloudinaryUtils';
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
  ChevronDown,
  Loader2,
  Link2,
  Settings,
  Cloud,
  Check,
  X
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
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const [cloudNameInput, setCloudNameInput] = useState(getCloudinaryConfig().cloudName || '');
  const [uploadPresetInput, setUploadPresetInput] = useState(getCloudinaryConfig().uploadPreset || '');

  const bannerPresets = [
    { label: 'AI & Tech', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cultural & Festive', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Corporate & Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80' },
  ];

  const currentBanner = wizardDraft.banner_url || bannerPresets[1].url;

  const handleSaveCloudinaryConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudNameInput.trim() || !uploadPresetInput.trim()) {
      showToast('Please enter both Cloud Name and Upload Preset');
      return;
    }
    setStoredCloudinaryConfig(cloudNameInput.trim(), uploadPresetInput.trim());
    setIsCloudinaryModalOpen(false);
    showToast('Cloudinary credentials saved! You can now upload images directly.');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      setIsCloudinaryModalOpen(true);
      showToast('Please configure your Cloudinary Cloud Name & Upload Preset first.');
      return;
    }

    setIsUploadingBanner(true);
    try {
      const cloudUrl = await uploadImageToCloudinary(file);
      updateWizardDraft({ banner_url: cloudUrl });
      showToast('Image uploaded & stored in Cloudinary!');
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        updateWizardDraft({ banner_url: base64Url });
      };
      reader.readAsDataURL(file);
      showToast('Image saved to draft.');
    } finally {
      setIsUploadingBanner(false);
    }
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
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <button
              type="button"
              onClick={() => setScreen('03_events_list')}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer mb-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Events Directory</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create Event — Step 1: Basic Info
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Enter key details: event name, schedule, venue location, and banner image.
            </p>
          </div>

          {/* Autosave notice */}
          {savedNotice && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-medium animate-fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Draft saved automatically</span>
            </div>
          )}
        </div>

        {/* Step Progress Bar */}
        <WizardStepHeader currentStepNumber={1} />

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
          
          {/* Row 1: Event Name & Public URL Slug */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Event Name */}
            <div className="lg:col-span-7">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Event Name <span className="text-rose-500">*</span>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Public URL Slug */}
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Public URL Slug
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white transition-all">
                <span className="px-3 py-2.5 bg-slate-100 text-slate-500 text-xs font-semibold border-r border-slate-200 select-none shrink-0">
                  acadeno.com/e/
                </span>
                <input
                  type="text"
                  value={wizardDraft.slug || ''}
                  onChange={(e) => updateWizardDraft({ slug: e.target.value })}
                  onBlur={handleBlur}
                  placeholder="ai-automation-workshop"
                  className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Row 2: Short Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Short Description / Agenda</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
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
              className="w-full p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Row 3: Event Date & Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
            
            {/* Event Date */}
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={wizardDraft.start_date || '2026-09-09'}
                  onChange={(e) => updateWizardDraft({ start_date: e.target.value, end_date: e.target.value })}
                  onBlur={handleBlur}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="sm:col-span-6">
              <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Time Range (Start & End)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={wizardDraft.start_time || '10:00 AM'}
                    onChange={(e) => updateWizardDraft({ start_time: e.target.value })}
                    onBlur={handleBlur}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
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
            <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Venue / Physical Address or Meet Link</span> <span className="text-rose-500">*</span>
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Row 5: Banner Image Upload */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Event Cover Banner (Cloudinary / CDN)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
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
                    placeholder="https://res.cloudinary.com/<your_cloud>/image/upload/... or direct image URL"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Upload Box */}
                <label className="sm:col-span-7 bg-slate-50/70 hover:bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      {isUploadingBanner ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {isUploadingBanner ? 'Uploading to Cloudinary...' : 'Upload cover banner'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        Recommended size: 1920 × 640 (JPG, PNG, WebP)
                      </div>
                    </div>
                  </div>

                  <div className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shrink-0">
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
                <div className="sm:col-span-5 relative h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
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
                    className="w-7 h-7 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg flex items-center justify-center shadow-xs border border-slate-200 absolute top-2 right-2 transition-colors cursor-pointer"
                    title="Clear banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

            {/* Presets Chips & Cloudinary Settings */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 select-none no-scrollbar">
              <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                Sample Covers:
              </span>
              {bannerPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateWizardDraft({ banner_url: preset.url })}
                  className={`text-xs font-semibold px-3 py-1 rounded-xl border transition-all shrink-0 cursor-pointer ${
                    currentBanner === preset.url
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              <div className="ml-auto">
                <button
                  type="button"
                  onClick={() => setIsCloudinaryModalOpen(true)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-colors shrink-0"
                  title="Configure Cloudinary storage credentials"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cloudinary Config</span>
                </button>
              </div>
            </div>

          </div>

          {/* Validation Notice */}
          {!isFormValid && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Please specify the <strong>Event Name</strong>, <strong>Date</strong>, and <strong>Venue</strong> to proceed to Form Builder.</span>
            </div>
          )}

          {/* Wizard Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={saveWizardDraft}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Form Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Cloudinary Storage Settings Modal */}
      {isCloudinaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl p-6 space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cloudinary Direct Upload</h3>
                  <p className="text-[11px] text-slate-500">Store event banner files permanently in your Cloudinary CDN</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCloudinaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCloudinaryConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cloudinary Cloud Name
                </label>
                <input
                  type="text"
                  required
                  value={cloudNameInput}
                  onChange={(e) => setCloudNameInput(e.target.value)}
                  placeholder="e.g. acadeno or dx7yzw123"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Found on your Cloudinary Dashboard.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unsigned Upload Preset Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadPresetInput}
                  onChange={(e) => setUploadPresetInput(e.target.value)}
                  placeholder="e.g. eventlink_preset or ml_default"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Created in Cloudinary Settings ⚙️ &rarr; Upload &rarr; Add Upload Preset (Unsigned).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCloudinaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Credentials</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

