import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { ThemeTemplate, EventTheme } from '../../types';
import { themePresets } from '../../data/seedData';
import { 
  uploadImageToCloudinary, 
  getCloudinaryConfig, 
  setStoredCloudinaryConfig 
} from '../../utils/cloudinaryUtils';
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
  Ticket,
  Image as ImageIcon,
  Upload,
  Loader2,
  Link2,
  Trash2,
  Settings,
  Cloud,
  X,
  Smartphone
} from 'lucide-react';

export const WizardThemeBuilderScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
    showToast 
  } = useEventStore();

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
  const currentTheme = wizardDraft.theme || themePresets.workshop;

  const handleSaveCloudinaryConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudNameInput.trim() || !uploadPresetInput.trim()) {
      showToast('Please enter both Cloud Name and Upload Preset');
      return;
    }
    setStoredCloudinaryConfig(cloudNameInput.trim(), uploadPresetInput.trim());
    setIsCloudinaryModalOpen(false);
    showToast('Cloudinary credentials saved! Direct image uploads are active.');
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
      updateWizardDraft({ 
        banner_url: cloudUrl,
        theme: {
          ...currentTheme,
          banner_url: cloudUrl
        }
      });
      showToast('Banner uploaded & stored in Cloudinary CDN!');
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        updateWizardDraft({ 
          banner_url: base64Url,
          theme: {
            ...currentTheme,
            banner_url: base64Url
          }
        });
      };
      reader.readAsDataURL(file);
      showToast('Image saved locally to draft.');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const presets: { id: ThemeTemplate; label: string; desc: string; previewColor: string }[] = [
    { id: 'workshop', label: 'Workshop (Blue & Amber)', desc: 'Professional, high-contrast, technical events', previewColor: '#1769FF' },
    { id: 'corporate', label: 'Corporate (Slate Dark)', desc: 'Executive seminars, boardroom talks, enterprise', previewColor: '#0F172A' },
    { id: 'festival', label: 'Festival (Fuchsia & Gold)', desc: 'Cultural celebrations, Onam, college fests', previewColor: '#C026D3' },
    { id: 'minimal', label: 'Minimal (Monochrome)', desc: 'Clean, modern, aesthetic gallery & design meets', previewColor: '#18181B' },
    { id: 'conference', label: 'Conference (Indigo & Cyan)', desc: 'Tech summits, multi-track symposiums', previewColor: '#4F46E5' },
    { id: 'education', label: 'Education (Emerald Green)', desc: 'Academic courses, training workshops', previewColor: '#059669' },
    { id: 'custom', label: 'Custom Palette (Night Mode)', desc: 'Tailored dark mode with neon accents', previewColor: '#6366F1' },
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
      pageSubtitle="Customize brand colors, typography, header banner, and preview live attendee view."
    >
      <WizardStepHeader currentStepNumber={3} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Theme Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preset Templates */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  Template Presets
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Select a pre-configured harmonious color palette</p>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {presets.length} Presets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {presets.map((p) => {
                const isSelected = currentTheme.template === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-5 h-5 rounded-full border border-white shadow-xs" 
                        style={{ backgroundColor: p.previewColor }} 
                      />
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 capitalize">{p.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Customizer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Custom Colors & Swatches</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Fine-tune brand colors for headers, action buttons, and surfaces</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Primary Header Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={currentTheme.colors.primary}
                    onChange={(e) => handleUpdateColors('primary', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.primary}
                    onChange={(e) => handleUpdateColors('primary', e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Action Button Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={currentTheme.colors.button}
                    onChange={(e) => handleUpdateColors('button', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.button}
                    onChange={(e) => handleUpdateColors('button', e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Page Background Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={currentTheme.colors.background}
                    onChange={(e) => handleUpdateColors('background', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.background}
                    onChange={(e) => handleUpdateColors('background', e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Text & Heading Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={currentTheme.colors.text}
                    onChange={(e) => handleUpdateColors('text', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={currentTheme.colors.text}
                    onChange={(e) => handleUpdateColors('text', e.target.value)}
                    className="flex-1 h-9 px-3 text-xs bg-white border border-slate-200 rounded-lg font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Event Banner & Brand Image Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Event Header Banner Image
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Upload to Cloudinary or paste a direct image URL</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'File Upload' : 'Paste Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCloudinaryModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Configure Cloudinary storage credentials"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showUrlInput ? (
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={wizardDraft.banner_url || ''}
                    onChange={(e) => {
                      updateWizardDraft({ 
                        banner_url: e.target.value,
                        theme: {
                          ...currentTheme,
                          banner_url: e.target.value
                        }
                      });
                    }}
                    placeholder="https://res.cloudinary.com/<cloud>/image/upload/... or direct image link"
                    className="w-full pl-10 pr-4 h-10 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct CDN image URLs will update the live phone preview on the right instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  
                  {/* Upload Drop Area */}
                  <label className="sm:col-span-7 bg-blue-50/30 hover:bg-blue-50/60 border border-dashed border-blue-200 hover:border-blue-400 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        {isUploadingBanner ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {isUploadingBanner ? 'Uploading to Cloudinary...' : 'Upload Banner'}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          JPG, PNG, WebP (Cloudinary CDN)
                        </div>
                      </div>
                    </div>

                    <div className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all shrink-0">
                      <span>Choose File</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingBanner}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {/* Banner Live Thumbnail */}
                  <div className="sm:col-span-5 relative h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 group">
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
                      onClick={() => {
                        updateWizardDraft({ 
                          banner_url: '',
                          theme: {
                            ...currentTheme,
                            banner_url: ''
                          }
                        });
                      }}
                      className="w-6 h-6 bg-white/95 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-md flex items-center justify-center shadow-xs border border-slate-200 absolute top-1.5 right-1.5 transition-colors cursor-pointer"
                      title="Remove banner"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                </div>

                {/* Preset Banner Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 select-none">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
                    Presets:
                  </span>
                  {bannerPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateWizardDraft({ 
                          banner_url: preset.url,
                          theme: {
                            ...currentTheme,
                            banner_url: preset.url
                          }
                        });
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all shrink-0 cursor-pointer ${
                        currentBanner === preset.url
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Typography */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                Typography & Font Family
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Select the typeface applied across public registration screens</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {['Plus Jakarta Sans', 'Inter', 'Outfit', 'Playfair Display'].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleUpdateFont(font)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    currentTheme.typography.fontFamily === font
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs'
                      : 'border-slate-200/80 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                  }`}
                  style={{ fontFamily: font }}
                >
                  <div className="text-xs">{font}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Aa Bb 123</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wizard Navigation */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => { setWizardStep(2); setScreen('05_create_form'); }}
              className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back: Form Builder</span>
            </button>

            <button
              onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next: Operational Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column: Live Interactive Mobile Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-blue-600" />
              Live Participant View Preview
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● Instant Sync
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
              {/* Optional Event Banner */}
              {wizardDraft.banner_url && (
                <div className="w-full h-28 relative overflow-hidden bg-slate-950">
                  <img 
                    src={wizardDraft.banner_url} 
                    alt="Event banner" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

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
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    <span>{wizardDraft.start_date || '20 Sep 2026'} • {wizardDraft.start_time || '10:00 AM'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
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
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white/90 text-xs text-slate-800 placeholder-slate-400"
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
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
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

      {/* Cloudinary Storage Settings Modal */}
      {isCloudinaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCloudinaryConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cloudinary Cloud Name
                </label>
                <input
                  type="text"
                  required
                  value={cloudNameInput}
                  onChange={(e) => setCloudNameInput(e.target.value)}
                  placeholder="e.g. acadeno or dx7yzw123"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Found on your Cloudinary Dashboard.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unsigned Upload Preset Name
                </label>
                <input
                  type="text"
                  required
                  value={uploadPresetInput}
                  onChange={(e) => setUploadPresetInput(e.target.value)}
                  placeholder="e.g. eventlink_preset or ml_default"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Created in Cloudinary Settings ⚙️ &rarr; Upload &rarr; Add Upload Preset (Unsigned).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCloudinaryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
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

