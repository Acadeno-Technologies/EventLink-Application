import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { ThemeTemplate, EventTheme } from '../../types';
import { themePresets } from '../../data/seedData';
import { 
  Palette, 
  Type, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Eye, 
  Calendar, 
  MapPin, 
  Clock,
  Image as ImageIcon,
  Upload, 
  Loader2, 
  Link2, 
  Trash2, 
  Layers,
  Menu,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  Search,
  X
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
  const [fontSearch, setFontSearch] = useState('');

  const bannerPresets = [
    { label: 'AI & Tech', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Conference / Keynote', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cultural & Festive', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Corporate & Team', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80' },
  ];

  const currentBanner = wizardDraft.banner_url || bannerPresets[1].url;
  
  // Default theme fallback
  const currentTheme: EventTheme = wizardDraft.theme || {
    template: 'workshop',
    colors: {
      primary: '#2563EB',
      secondary: '#4F46E5',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      button: '#FF8A00',
      buttonText: '#FFFFFF',
      accent: '#06B6D4',
    },
    typography: {
      fontFamily: 'Poppins',
      headingSize: 'lg',
      bodySize: 'md',
    },
    layout: 'centered',
    buttonStyle: 'rounded',
  };

  const presets: { id: ThemeTemplate; label: string; desc: string; previewColor: string }[] = [
    { id: 'workshop', label: 'Workshop', desc: 'Clean and professional', previewColor: '#2563EB' },
    { id: 'corporate', label: 'Corporate', desc: 'Modern and minimal', previewColor: '#0F172A' },
    { id: 'festival', label: 'Festive', desc: 'Colorful and vibrant', previewColor: '#C026D3' },
    { id: 'minimal', label: 'Minimal', desc: 'Simple and elegant', previewColor: '#64748B' },
    { id: 'conference', label: 'Conference', desc: 'Bold and professional', previewColor: '#1E40AF' },
    { id: 'education', label: 'Education', desc: 'Fresh and friendly', previewColor: '#10B981' },
    { id: 'classic', label: 'Classic', desc: 'Timeless and sophisticated', previewColor: '#6366F1' },
  ];

  const allFontOptions = [
    { id: 'Poppins', label: 'Poppins', desc: 'Modern & Clean', category: 'Sans-Serif' },
    { id: 'Inter', label: 'Inter', desc: 'Professional', category: 'Sans-Serif' },
    { id: 'Outfit', label: 'Outfit', desc: 'Stylish & Modern', category: 'Sans-Serif' },
    { id: 'Playfair Display', label: 'Playfair Display', desc: 'Elegant & Classic', category: 'Serif' },
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', desc: 'Clean & Tech', category: 'Sans-Serif' },
    { id: 'Montserrat', label: 'Montserrat', desc: 'Bold & Geometric', category: 'Sans-Serif' },
    { id: 'Roboto', label: 'Roboto', desc: 'Neutral & Versatile', category: 'Sans-Serif' },
    { id: 'Cinzel', label: 'Cinzel', desc: 'Luxury & Regal', category: 'Serif' },
    { id: 'Lora', label: 'Lora', desc: 'Editorial & Literary', category: 'Serif' },
    { id: 'Space Grotesk', label: 'Space Grotesk', desc: 'Futuristic & Bold', category: 'Sans-Serif' },
    { id: 'DM Sans', label: 'DM Sans', desc: 'Minimalist & Crisp', category: 'Sans-Serif' },
    { id: 'Raleway', label: 'Raleway', desc: 'Artistic & Sleek', category: 'Sans-Serif' },
    { id: 'Caveat', label: 'Caveat', desc: 'Handwritten & Fun', category: 'Script' },
    { id: 'Oswald', label: 'Oswald', desc: 'Punchy & Condensed', category: 'Sans-Serif' },
    { id: 'Merriweather', label: 'Merriweather', desc: 'Classic & Warm', category: 'Serif' },
    { id: 'Fira Code', label: 'Fira Code', desc: 'Developer & Code', category: 'Monospace' },
  ];

  // Helper to dynamically load any Google Font on-demand
  const loadGoogleFont = (fontFamily: string) => {
    try {
      const fontId = `gfont-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    } catch {
      // ignore
    }
  };

  const handleSelectPreset = (templateId: ThemeTemplate) => {
    const preset = themePresets[templateId] || themePresets.workshop;
    updateWizardDraft({
      theme: {
        ...preset,
        colors: {
          ...preset.colors,
          button: preset.colors.button || '#FF8A00',
        },
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
    loadGoogleFont(fontFamily);
    updateWizardDraft({
      theme: {
        ...currentTheme,
        typography: {
          ...currentTheme.typography,
          fontFamily,
        }
      }
    });
    showToast(`Font updated to "${fontFamily}"`);
  };

  // Filtered font options based on search input
  const filteredFonts = fontSearch.trim() === ''
    ? (() => {
        const topDefaults = allFontOptions.slice(0, 4);
        const currentSelectedFont = currentTheme.typography.fontFamily;
        if (currentSelectedFont && !topDefaults.some(f => f.id.toLowerCase() === currentSelectedFont.toLowerCase())) {
          const matchingOption = allFontOptions.find(f => f.id.toLowerCase() === currentSelectedFont.toLowerCase()) || {
            id: currentSelectedFont,
            label: currentSelectedFont,
            desc: 'Custom Applied',
            category: 'Custom'
          };
          return [matchingOption, ...topDefaults.slice(0, 3)];
        }
        return topDefaults;
      })()
    : allFontOptions.filter(f => 
        f.label.toLowerCase().includes(fontSearch.toLowerCase()) || 
        f.desc.toLowerCase().includes(fontSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(fontSearch.toLowerCase())
      );

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
      const base64Url = reader.result as string;
      updateWizardDraft({ 
        banner_url: base64Url,
        theme: {
          ...currentTheme,
          banner_url: base64Url
        }
      });
      showToast('Banner image uploaded successfully!');
      setIsUploadingBanner(false);
    };
    reader.onerror = () => {
      showToast('Failed to read image file.');
      setIsUploadingBanner(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-4 w-full">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-0.5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101B33] tracking-tight font-sans">
              Create Event — Step 3: Theme & Branding
            </h1>
            <p className="text-xs sm:text-sm text-[#7184A3] font-medium mt-0.5">
              Customize your event’s visual style with colors, banner, and branding elements.
            </p>
          </div>

          {/* Right Decorative Calendar Illustration + Script Text */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 pr-2">
            
            {/* 3D Stylized Calendar Card */}
            <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-[0_6px_16px_rgba(20,99,255,0.2)] transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[11px] p-1.5 flex flex-col justify-between overflow-hidden relative">
                
                {/* Spiral Ring Binder Pins */}
                <div className="flex justify-around -mt-0.5">
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2 bg-slate-300 rounded-full" />
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
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1463FF] border-2 border-white text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
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

        {/* Main Grid: Left Column Cards + Right Column Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: 3 INDIVIDUAL CUSTOMIZATION CARDS (lg:col-span-7)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3 h-full">
            
            {/* CARD 1 — CUSTOM COLORS & BRANDING */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(7,26,51,0.03)] space-y-2.5">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  Custom Colors & Branding
                </h3>
                <p className="text-xs text-[#7184A3] mt-0.5">
                  Personalize primary header, button accent, page background, and text colors.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. Primary Header Color */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-[12px] font-bold text-[#101B33] truncate">
                    Primary Header
                  </label>
                  <div className="flex items-center justify-between h-9 px-2.5 bg-white border border-[#DCE5F0] rounded-xl focus-within:border-[#1463FF] focus-within:ring-2 focus-within:ring-[#1463FF]/10 transition-all cursor-pointer">
                    <div className="flex items-center min-w-0 mr-1 flex-1">
                      <input
                        type="color"
                        value={currentTheme.colors.primary}
                        onChange={(e) => handleUpdateColors('primary', e.target.value)}
                        className="w-4.5 h-4.5 rounded-md cursor-pointer border-0 p-0 mr-2 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.primary}
                        onChange={(e) => handleUpdateColors('primary', e.target.value)}
                        className="w-full text-xs font-mono uppercase font-bold text-slate-800 bg-transparent focus:outline-none"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Accent Button Color */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-[12px] font-bold text-[#101B33] truncate">
                    Accent Button
                  </label>
                  <div className="flex items-center justify-between h-9 px-2.5 bg-white border border-[#DCE5F0] rounded-xl focus-within:border-[#1463FF] focus-within:ring-2 focus-within:ring-[#1463FF]/10 transition-all cursor-pointer">
                    <div className="flex items-center min-w-0 mr-1 flex-1">
                      <input
                        type="color"
                        value={currentTheme.colors.button}
                        onChange={(e) => handleUpdateColors('button', e.target.value)}
                        className="w-4.5 h-4.5 rounded-md cursor-pointer border-0 p-0 mr-2 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.button}
                        onChange={(e) => handleUpdateColors('button', e.target.value)}
                        className="w-full text-xs font-mono uppercase font-bold text-slate-800 bg-transparent focus:outline-none"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Page Background Color */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-[12px] font-bold text-[#101B33] truncate">
                    Page Background
                  </label>
                  <div className="flex items-center justify-between h-9 px-2.5 bg-white border border-[#DCE5F0] rounded-xl focus-within:border-[#1463FF] focus-within:ring-2 focus-within:ring-[#1463FF]/10 transition-all cursor-pointer">
                    <div className="flex items-center min-w-0 mr-1 flex-1">
                      <input
                        type="color"
                        value={currentTheme.colors.background}
                        onChange={(e) => handleUpdateColors('background', e.target.value)}
                        className="w-4.5 h-4.5 rounded-md cursor-pointer border-0 p-0 mr-2 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.background}
                        onChange={(e) => handleUpdateColors('background', e.target.value)}
                        className="w-full text-xs font-mono uppercase font-bold text-slate-800 bg-transparent focus:outline-none"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Text & Heading Color */}
                <div className="space-y-1">
                  <label className="block text-xs sm:text-[12px] font-bold text-[#101B33] truncate">
                    Text & Heading
                  </label>
                  <div className="flex items-center justify-between h-9 px-2.5 bg-white border border-[#DCE5F0] rounded-xl focus-within:border-[#1463FF] focus-within:ring-2 focus-within:ring-[#1463FF]/10 transition-all cursor-pointer">
                    <div className="flex items-center min-w-0 mr-1 flex-1">
                      <input
                        type="color"
                        value={currentTheme.colors.text}
                        onChange={(e) => handleUpdateColors('text', e.target.value)}
                        className="w-4.5 h-4.5 rounded-md cursor-pointer border-0 p-0 mr-2 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.text}
                        onChange={(e) => handleUpdateColors('text', e.target.value)}
                        className="w-full text-xs font-mono uppercase font-bold text-slate-800 bg-transparent focus:outline-none"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            {/* CARD 2 — BANNER IMAGE & BRANDING LOGO */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(7,26,51,0.03)] space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Banner Image & Branding Logo
                  </h3>
                  <p className="text-xs text-[#7184A3] mt-0.5">
                    Upload your event banner or choose a sample cover.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs sm:text-[13px] font-semibold text-[#1463FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? 'File Upload' : 'Paste URL Link'}</span>
                </button>
              </div>

              {showUrlInput ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                      placeholder="https://images.unsplash.com/... or direct image link"
                      className="w-full h-9.5 pl-10 pr-4 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-2 focus:ring-[#1463FF]/10 focus:border-[#1463FF] font-medium"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  
                  {/* Upload Box */}
                  <label className="sm:col-span-8 bg-[#F8FAFC] hover:bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] hover:border-[#1463FF] rounded-xl px-3 py-2 flex items-center justify-between gap-3 cursor-pointer transition-all">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1463FF] flex items-center justify-center shrink-0 border border-blue-100">
                        {isUploadingBanner ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-[12.5px] font-bold text-[#101B33] truncate">
                          {isUploadingBanner ? 'Uploading...' : 'Upload banner image'}
                        </div>
                        <div className="text-[10.5px] text-[#7184A3] font-medium truncate">
                          Recommended: 1920 × 640 (JPG, PNG)
                        </div>
                      </div>
                    </div>

                    <div className="bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE5F0] text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shrink-0 shadow-2xs">
                      Browse
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingBanner}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {/* Banner Thumbnail */}
                  <div className="sm:col-span-4 relative h-[52px] rounded-xl overflow-hidden border border-[#DCE5F0] shadow-2xs bg-slate-900 group">
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
                      className="w-5 h-5 bg-white/95 hover:bg-white text-slate-600 hover:text-rose-600 rounded-full flex items-center justify-center shadow-md border border-slate-200 absolute top-1 right-1 transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>

                </div>
              )}

              {/* Sample Covers Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar pt-0.5">
                <span className="text-[11px] text-[#7184A3] font-bold uppercase tracking-wider shrink-0">
                  SAMPLE COVERS:
                </span>
                {bannerPresets.map((preset, idx) => {
                  const isSelected = currentBanner === preset.url;
                  return (
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
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
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

            {/* CARD 3 — TYPOGRAPHY & FONT FAMILY WITH SEARCH & APPLY */}
            <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(7,26,51,0.03)] flex-1 flex flex-col justify-between space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                    Typography & Font Family
                  </h3>
                  <p className="text-xs text-[#7184A3] mt-0.5">
                    Select or search a typography style that matches your event brand.
                  </p>
                </div>

                {/* Font Search Input */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    placeholder="Search fonts (e.g. Roboto, Serif...)"
                    className="w-full sm:w-56 h-8 pl-8 pr-7 bg-[#F8FAFC] hover:bg-white focus:bg-white border border-[#DCE5F0] rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-[#1463FF] focus:ring-2 focus:ring-[#1463FF]/10 transition-all font-medium"
                  />
                  {fontSearch && (
                    <button
                      type="button"
                      onClick={() => setFontSearch('')}
                      className="w-4 h-4 text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Font Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 content-start max-h-56 overflow-y-auto pr-0.5 no-scrollbar">
                {filteredFonts.map((font) => {
                  const isSelected = currentTheme.typography.fontFamily.toLowerCase() === font.id.toLowerCase();
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => handleUpdateFont(font.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'border-[#1463FF] bg-[#F0F5FF]/70 ring-2 ring-[#1463FF]/15 shadow-2xs'
                          : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div 
                          className="text-xs sm:text-[12.5px] font-bold text-[#101B33] truncate"
                          style={{ fontFamily: font.id }}
                        >
                          {font.label}
                        </div>
                        <div className="text-[10px] text-[#7184A3] font-medium mt-0.5 truncate">
                          {font.desc}
                        </div>
                      </div>

                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-[#1463FF] bg-[#1463FF]'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && (
                          <div className="w-1 h-1 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Font Option if search query doesn't match any preset */}
                {fontSearch.trim() !== '' && !filteredFonts.some(f => f.label.toLowerCase() === fontSearch.trim().toLowerCase()) && (
                  <button
                    type="button"
                    onClick={() => handleUpdateFont(fontSearch.trim())}
                    className="p-2.5 rounded-xl border-2 border-dashed border-[#1463FF]/40 bg-[#F0F5FF]/40 hover:bg-[#F0F5FF] text-left transition-all cursor-pointer flex items-center justify-between gap-2 col-span-2 sm:col-span-4"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1463FF] flex items-center gap-1.5 truncate">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Apply Google Font: "{fontSearch.trim()}"</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Load and apply this custom Google Font style directly to your event.
                      </div>
                    </div>
                    <div className="bg-[#1463FF] text-white text-[10.5px] font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs">
                      Apply Font
                    </div>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LIVE PARTICIPANT PREVIEW CARD (lg:col-span-5)               */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE5F0] p-4 sm:p-4.5 shadow-[0_2px_12px_rgba(7,26,51,0.03)] flex flex-col items-center justify-between">
            
            {/* Card Header Tag */}
            <div className="w-full flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#1463FF]" />
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#101B33]">
                  LIVE PREVIEW
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ● Realtime Sync
              </span>
            </div>

            {/* Realistic Smartphone Frame Mockup */}
            <div className="w-full max-w-[340px] sm:max-w-[350px] rounded-[36px] p-3 bg-[#0B1528] border-2 border-slate-800 shadow-2xl relative my-auto">
              
              {/* Phone Speaker & Camera Notch */}
              <div className="w-24 h-2.5 bg-slate-800 rounded-b-lg mx-auto mb-2 flex items-center justify-center gap-1">
                <div className="w-7 h-0.5 bg-slate-900 rounded-full" />
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
              </div>

              {/* Inner Smartphone Screen */}
              <div 
                className="rounded-[24px] overflow-hidden p-2.5 flex flex-col justify-start shadow-inner transition-colors duration-300 relative"
                style={{
                  backgroundColor: currentTheme.colors.background || '#F8FAFC',
                  color: currentTheme.colors.text || '#0F172A',
                  fontFamily: currentTheme.typography.fontFamily || 'Poppins',
                }}
              >
                
                {/* Floating Event Ticket / Registration Card */}
                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-black/5 flex flex-col transition-all">
                  
                  {/* Event Banner Image */}
                  <div className="w-full h-24 relative overflow-hidden bg-slate-950 shrink-0">
                    <img 
                      src={currentBanner} 
                      alt="Event banner" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                    
                    {/* Top Bar inside Phone */}
                    <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between text-white/90 text-xs">
                      <Menu className="w-3.5 h-3.5 cursor-pointer" />
                      <Trash2 className="w-3 h-3 cursor-pointer opacity-80" />
                    </div>
                  </div>

                  {/* Event Information Hero */}
                  <div 
                    className="px-3.5 py-2.5 text-white relative transition-colors duration-300"
                    style={{ backgroundColor: currentTheme.colors.primary || '#2563EB' }}
                  >
                    <h4 className="text-sm font-extrabold leading-tight mb-0.5 truncate">
                      {wizardDraft.name || 'ACADENO Event'}
                    </h4>
                    
                    <div className="space-y-0.5 text-white/90 text-[11px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{wizardDraft.start_date || '2026-09-11'} | {wizardDraft.start_time || '10:00 AM'} - {wizardDraft.end_time || '1:00 PM'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{wizardDraft.venue || 'ACADENO Conference Hall'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Registration Form Body */}
                  <div 
                    className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white"
                    style={{ color: currentTheme.colors.text || '#101B33' }}
                  >
                    <div className="space-y-1.5">
                      <div>
                        <h5 
                          className="text-xs sm:text-[13px] font-bold transition-colors leading-tight"
                          style={{ color: currentTheme.colors.text || '#101B33' }}
                        >
                          Register for this event
                        </h5>
                        <p 
                          className="text-[10px] mt-0.5 transition-colors"
                          style={{ color: currentTheme.colors.text || '#7184A3', opacity: 0.75 }}
                        >
                          Fill in details to secure your spot.
                        </p>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-2">
                        <div>
                          <label 
                            className="block text-[11px] font-bold mb-0.5 transition-colors"
                            style={{ color: currentTheme.colors.text || '#101B33' }}
                          >
                            Full Name <span className="text-[#E5484D]">*</span>
                          </label>
                          <input
                            type="text"
                            disabled
                            placeholder="Enter your full name"
                            style={{ color: currentTheme.colors.text || '#334155' }}
                            className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs placeholder-[#91A4C0]"
                          />
                        </div>

                        <div>
                          <label 
                            className="block text-[11px] font-bold mb-0.5 transition-colors"
                            style={{ color: currentTheme.colors.text || '#101B33' }}
                          >
                            Email Address <span className="text-[#E5484D]">*</span>
                          </label>
                          <input
                            type="email"
                            disabled
                            placeholder="you@example.com"
                            style={{ color: currentTheme.colors.text || '#334155' }}
                            className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs placeholder-[#91A4C0]"
                          />
                        </div>

                        <div>
                          <label 
                            className="block text-[11px] font-bold mb-0.5 transition-colors"
                            style={{ color: currentTheme.colors.text || '#101B33' }}
                          >
                            Mobile Number <span className="text-[#E5484D]">*</span>
                          </label>
                          <input
                            type="text"
                            disabled
                            placeholder="+91 98765 43210"
                            style={{ color: currentTheme.colors.text || '#334155' }}
                            className="w-full h-8 px-2.5 bg-white border border-[#DCE5F0] rounded-lg text-xs placeholder-[#91A4C0]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Register Button & Footer Link */}
                    <div className="pt-1.5 space-y-1.5">
                      <button
                        type="button"
                        style={{
                          backgroundColor: currentTheme.colors.button || '#FF8A00',
                          color: currentTheme.colors.buttonText || '#FFFFFF',
                        }}
                        className="w-full h-8.5 rounded-xl font-bold text-xs sm:text-[12.5px] shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div 
                        className="text-[10px] text-center font-medium transition-colors"
                        style={{ color: currentTheme.colors.text || '#7184A3', opacity: 0.8 }}
                      >
                        Already registered? <span className="font-bold underline cursor-pointer" style={{ color: currentTheme.colors.button || '#1463FF', opacity: 1 }}>Sign In</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Separate Bottom Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => { setWizardStep(2); setScreen('05_create_form'); }}
            className="h-11 px-5 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Back: Form Builder</span>
          </button>

          <button
            type="button"
            onClick={() => { setWizardStep(4); setScreen('07_create_settings'); }}
            className="h-11 px-7 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(20,99,255,0.25)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Next: Settings & Limits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};
