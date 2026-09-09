import React, { useState, useEffect } from 'react';
import { useEventStore } from '../../store/eventStore';
import acadenoLogoPng from '../../assets/acadeno-logo.png';
import { generateQrDataUrl, downloadQrImage } from '../../utils/qrUtils';
import { generateIcsFile } from '../../utils/calendarUtils';
import { 
  Check, 
  Calendar, 
  MapPin, 
  Download, 
  CalendarPlus, 
  Share2, 
  QrCode,
  Printer,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const RegistrationSuccessScreen: React.FC = () => {
  const { selectedRegistration, selectedEvent, setScreen, showToast, currentUser } = useEventStore();
  const [qrUrl, setQrUrl] = useState<string>('');

  // Use active registration or elegant demo default matching the reference spec
  const reg = selectedRegistration || {
    id: 'reg-demo-01',
    event_id: selectedEvent?.id || 'evt-01',
    registration_code: 'PF-2026-00001',
    name: 'Arathy',
    email: 'arathy@acadeno.in',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString(),
    status: 'confirmed' as const,
    responses: {}
  };

  const evt = selectedEvent || {
    id: 'evt-01',
    name: 'Python FullStack',
    venue: 'Acadeno Technologies',
    start_date: '2026-09-30',
    end_date: '2026-09-30',
    start_time: '10:00 AM',
    end_time: '1:00 PM',
    short_description: 'Python FullStack Event Registration Pass.'
  };

  useEffect(() => {
    generateQrDataUrl(reg.registration_code, { width: 300 }).then(setQrUrl);
  }, [reg.registration_code]);

  const handleDownloadTicket = () => {
    if (qrUrl) {
      downloadQrImage(qrUrl, `Ticket-${reg.registration_code}.png`);
      showToast('Downloaded ticket image');
    }
  };

  const handleAddToCalendar = () => {
    generateIcsFile({
      title: evt.name,
      description: `${evt.short_description || ''}\n\nYour Registration Code: ${reg.registration_code}`,
      location: evt.venue || 'Acadeno Technologies',
      startDate: evt.start_date || '2026-09-30',
      endDate: evt.end_date || evt.start_date || '2026-09-30',
      startTime: evt.start_time || '10:00 AM',
      endTime: evt.end_time || '1:00 PM',
    });
    showToast('Downloaded .ics calendar file');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: evt.name,
        text: `I'm registered for ${evt.name}! Registration ID: ${reg.registration_code}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`I'm registered for ${evt.name}! Code: ${reg.registration_code}`);
      showToast('Ticket code copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F5F9FF] via-[#EDF4FE] to-[#E5EFFD] text-[#10244A] py-10 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden font-sans antialiased">
      
      {/* Admin / Organizer Escape Button (Floating Top-Left) */}
      <div className="fixed top-4 left-4 z-50 no-print">
        {currentUser ? (
          <button
            onClick={() => setScreen('02_dashboard')}
            className="bg-[#0B1B3A]/90 hover:bg-[#1769FF] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            title="Return to Admin Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </button>
        ) : (
          <button
            onClick={() => setScreen('01_login')}
            className="bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 text-xs font-bold py-2 px-3.5 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            title="Sign in as Organizer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Login</span>
          </button>
        )}
      </div>
      
      {/* ========================================================================= */}
      {/* BACKGROUND DECORATIVE ELEMENTS                                            */}
      {/* ========================================================================= */}
      
      {/* Top-Right Soft Blue Circle / Radial Gradient */}
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#7C9FF5]/30 via-[#B9D5FF]/20 to-transparent blur-3xl pointer-events-none" />
      
      {/* Top-Right Ambient Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-b from-[#1769FF]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Bottom-Left Curved Wave & Glow */}
      <div className="absolute -bottom-28 -left-28 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#93C5FD]/30 via-[#DBEAFE]/20 to-transparent blur-3xl pointer-events-none" />

      {/* Bottom-Left Dotted Grid Pattern (5x6 Dots Matrix) */}
      <div className="absolute bottom-16 left-12 pointer-events-none select-none hidden md:block">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1769FF]/35" />
          ))}
        </div>
      </div>

      {/* Top-Left Handwritten Phrase: "Events Made Simple" */}
      <div className="absolute top-12 left-12 pointer-events-none select-none text-left transform -rotate-[9deg] hidden lg:block">
        <div className="font-['Caveat'] text-[34px] font-bold text-[#7C9FF5] leading-[0.95] tracking-wide">
          <div>Events</div>
          <div className="pl-4">Made Simple</div>
        </div>
        <svg className="w-28 h-5 text-[#7C9FF5]/80 mt-1" viewBox="0 0 110 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 10 Q 55 19, 104 5" />
        </svg>
      </div>

      {/* Bottom-Right Handwritten Phrase: "Great Events Ahead" */}
      <div className="absolute bottom-14 right-14 pointer-events-none select-none text-left transform -rotate-[10deg] hidden lg:block">
        <div className="font-['Caveat'] text-[34px] font-bold text-[#7C9FF5] leading-[0.95] tracking-wide">
          <div>Great</div>
          <div className="pl-4">Events Ahead</div>
        </div>
        <svg className="w-32 h-5 text-[#7C9FF5]/80 mt-1" viewBox="0 0 120 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 10 Q 60 19, 114 5" />
        </svg>
      </div>

      {/* Bottom-Right Calendar Illustration Graphic */}
      <div className="absolute right-20 bottom-36 pointer-events-none select-none hidden xl:block">
        <div className="relative transform rotate-[8deg]">
          
          {/* Calendar Body */}
          <div className="w-24 h-24 bg-white/95 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100/90 flex flex-col p-2.5 relative">
            {/* Top binder rings */}
            <div className="flex justify-around absolute -top-2 left-3 right-3">
              <div className="w-2 h-3.5 bg-blue-300 rounded-full" />
              <div className="w-2 h-3.5 bg-blue-300 rounded-full" />
            </div>
            {/* Blue Top Bar */}
            <div className="w-full h-2 bg-[#93C5FD] rounded-full mt-1.5 mb-2" />
            {/* Grid of days */}
            <div className="grid grid-cols-3 gap-1.5 w-full flex-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-blue-50/80 rounded-xs border border-blue-100/60" />
              ))}
            </div>
          </div>

          {/* Floating Check Badge on bottom right corner of calendar */}
          <div className="w-9 h-9 bg-[#86B9FF] text-white rounded-full flex items-center justify-center absolute -bottom-3 -right-3 shadow-lg shadow-blue-400/30">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>

          {/* Radiant spark dashes around calendar */}
          <div className="absolute -top-3 -right-3 w-3 h-0.5 bg-[#93C5FD] rounded-full transform rotate-45" />
          <div className="absolute top-1 -right-5 w-3 h-0.5 bg-[#93C5FD] rounded-full" />
          <div className="absolute -top-4 right-3 w-3 h-0.5 bg-[#93C5FD] rounded-full transform -rotate-12" />
          <div className="absolute top-14 -left-4 w-3 h-0.5 bg-[#93C5FD] rounded-full transform rotate-30" />
          <div className="absolute -bottom-2 -left-2 w-2.5 h-0.5 bg-[#93C5FD] rounded-full transform -rotate-45" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CENTER CONFIRMATION CARD (Width ~520px, 28px Rounded)                */}
      {/* ========================================================================= */}
      <div 
        id="printable-ticket" 
        className="w-full max-w-[520px] bg-white rounded-[28px] shadow-[0_24px_70px_rgba(16,36,74,0.09)] border border-slate-100 p-7 sm:p-9 text-center relative z-10 backdrop-blur-md space-y-6"
      >
        
        {/* 1. Top Branding Header */}
        <div className="inline-flex items-center gap-3.5 select-none">
          <img 
            src={acadenoLogoPng} 
            alt="ACADENO Logo" 
            className="h-10 w-auto object-contain" 
            loading="eager"
          />
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-black tracking-wider text-[#10244A] uppercase font-sans leading-tight">
              EVENTLINK
            </span>
            <span className="text-[10px] text-[#6E80A3] font-medium leading-none mt-0.5">
              Event & Registration Platform
            </span>
          </div>
        </div>

        {/* 2. Success Icon & Heading */}
        <div className="space-y-2 pt-0.5">
          {/* Glowing Green Success Check Icon with Radiant Spark Dashes */}
          <div className="relative inline-flex items-center justify-center my-2">
            
            {/* SVG Radiating Tick Marks */}
            <svg className="absolute w-28 h-28 pointer-events-none text-[#18C98B]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {/* Top left spark */}
              <line x1="26" y1="26" x2="18" y2="18" opacity="0.6" />
              {/* Top right spark */}
              <line x1="74" y1="26" x2="82" y2="18" opacity="0.6" />
              {/* Left spark */}
              <line x1="18" y1="50" x2="8" y2="50" opacity="0.6" />
              {/* Right spark */}
              <line x1="82" y1="50" x2="92" y2="50" opacity="0.6" />
              {/* Bottom left spark */}
              <line x1="26" y1="74" x2="18" y2="82" opacity="0.6" />
              {/* Bottom right spark */}
              <line x1="74" y1="74" x2="82" y2="82" opacity="0.6" />
            </svg>

            {/* Main Green Check Circle */}
            <div className="w-14 h-14 rounded-full bg-[#18C98B] text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 relative z-10">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          </div>

          <h2 className="text-[26px] font-extrabold text-[#10244A] font-sans tracking-tight leading-snug">
            Registration Successful!
          </h2>
          <p className="text-xs sm:text-sm text-[#6E80A3] font-medium">
            You have successfully registered for the event.
          </p>
        </div>

        {/* 3. Secondary Light-Blue Tinted Registration Details Card */}
        <div className="bg-[#F7FAFF] rounded-2xl p-5 sm:p-6 border border-blue-100/90 shadow-2xs text-center space-y-4">
          
          {/* Registration ID & Participant Name */}
          <div>
            <div className="text-[10px] uppercase font-bold text-[#6E80A3] tracking-widest">
              REGISTRATION ID
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#1769FF] font-sans tracking-wide my-1">
              {reg.registration_code}
            </div>
            <div className="text-base font-extrabold text-[#10244A]">
              {reg.name}
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="border-b border-dashed border-blue-200/90" />

          {/* Large Centered Scannable QR Code */}
          <div className="pt-1">
            <div className="p-3.5 bg-white rounded-2xl inline-block shadow-sm border border-slate-100">
              {qrUrl ? (
                <img 
                  src={qrUrl} 
                  alt="Entry QR Pass" 
                  className="w-40 h-40 sm:w-44 sm:h-44 mx-auto object-contain rounded-lg" 
                />
              ) : (
                <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center text-slate-300">
                  <QrCode className="w-14 h-14 animate-pulse" />
                </div>
              )}
            </div>
            <p className="text-[11px] font-medium text-[#6E80A3] mt-2.5">
              Scan at the entrance desk for instant check-in
            </p>
          </div>

          {/* Compact Horizontal Event Info Row */}
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-[#10244A]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1769FF]" />
              <span>{evt.start_date || '2026-09-30'} • {evt.start_time || '10:00 AM'}</span>
            </div>
            <div className="w-px h-4 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1769FF]" />
              <span className="truncate">{evt.venue || 'Acadeno Technologies'}</span>
            </div>
          </div>

        </div>

        {/* 4. Action Buttons */}
        <div className="space-y-2.5 no-print pt-1">
          
          {/* Primary Action Button: Add to Calendar (.ICS) */}
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1769FF] via-[#0066FF] to-[#1769FF] hover:from-[#0055FF] hover:to-[#004AD6] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Add to Calendar (.ICS)</span>
          </button>

          {/* Secondary 3 Buttons Grid: Download, Print, Share */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadTicket}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#10244A] border border-blue-100/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#10244A] border border-blue-100/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-[#10244A] border border-blue-100/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Share</span>
            </button>
          </div>

        </div>

        {/* 5. Bottom Navigation Link */}
        <div className="pt-3 border-t border-slate-100 no-print">
          {currentUser ? (
            <button
              type="button"
              onClick={() => setScreen('02_dashboard')}
              className="text-xs font-bold text-[#1769FF] hover:text-[#0052CC] hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>Return to Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <a
              href="https://acadeno.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#1769FF] hover:text-[#0052CC] hover:underline transition-colors inline-flex items-center gap-1"
            >
              <span>Visit ACADENO Technologies Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>

    </div>
  );
};
