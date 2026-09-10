import React from 'react';
import { useEventStore } from '../../store/eventStore';
import acadenoLogoPng from '../../assets/acadeno-logo.png';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  X
} from 'lucide-react';

export const RegistrationClosedScreen: React.FC = () => {
  const { selectedEvent, setScreen, currentUser } = useEventStore();

  const evt = selectedEvent || {
    name: 'Python FullStack',
    venue: 'Acadeno Technologies',
    settings: { registration_closes_at: '2026-09-30' }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7FBFF] via-[#EDF4FE] to-[#E5EFFD] text-[#10244A] py-10 px-4 sm:px-6 flex flex-col justify-center items-center relative overflow-hidden font-sans antialiased">
      
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

      {/* Bottom-Right Handwritten Phrase: "Better Events Tomorrow" */}
      <div className="absolute bottom-14 right-14 pointer-events-none select-none text-left transform -rotate-[10deg] hidden lg:block">
        <div className="font-['Caveat'] text-[34px] font-bold text-[#7C9FF5] leading-[0.95] tracking-wide">
          <div>Better</div>
          <div className="pl-4">Events Tomorrow</div>
        </div>
        <svg className="w-36 h-5 text-[#7C9FF5]/80 mt-1" viewBox="0 0 130 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 10 Q 65 19, 124 5" />
        </svg>
      </div>

      {/* Bottom-Right Calendar Illustration Graphic with Error/Cross Badge */}
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

          {/* Floating Cross Badge on bottom right corner of calendar */}
          <div className="w-9 h-9 bg-[#86B9FF] text-white rounded-full flex items-center justify-center absolute -bottom-3 -right-3 shadow-lg shadow-blue-400/30">
            <X className="w-5 h-5 stroke-[3]" />
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
      {/* MAIN CENTER CONFIRMATION / STATUS CARD (~650px Wide, 28px Rounded)       */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[650px] bg-white rounded-[28px] shadow-[0_24px_70px_rgba(16,36,74,0.08)] border border-slate-100/90 p-8 sm:p-12 text-center relative z-10 backdrop-blur-md space-y-6">
        
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
            <span className="text-[10px] text-[#657A9F] font-medium leading-none mt-0.5">
              Event & Registration Platform
            </span>
          </div>
        </div>

        {/* 2. Status Icon with Radiating Spark Lines */}
        <div className="pt-2">
          <div className="relative inline-flex items-center justify-center my-1">
            
            {/* SVG Radiating Tick Marks (Pink/Red Accent) */}
            <svg className="absolute w-32 h-32 pointer-events-none text-[#F43F64]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {/* Top left spark */}
              <line x1="26" y1="26" x2="18" y2="18" opacity="0.65" />
              {/* Top right spark */}
              <line x1="74" y1="26" x2="82" y2="18" opacity="0.65" />
              {/* Left spark */}
              <line x1="18" y1="50" x2="8" y2="50" opacity="0.65" />
              {/* Right spark */}
              <line x1="82" y1="50" x2="92" y2="50" opacity="0.65" />
              {/* Bottom left spark */}
              <line x1="26" y1="74" x2="18" y2="82" opacity="0.65" />
              {/* Bottom right spark */}
              <line x1="74" y1="74" x2="82" y2="82" opacity="0.65" />
            </svg>

            {/* Circular Pale-Pink Icon Container */}
            <div className="w-20 h-20 rounded-full bg-[#FFE8EF] flex items-center justify-center relative z-10 shadow-sm shadow-rose-200/50">
              
              {/* Octagon Outline with Exclamation Mark */}
              <svg className="w-10 h-10 text-[#F43F64]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2.5" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
              </svg>

            </div>
          </div>
        </div>

        {/* 3. Status Label, Main Heading & Description */}
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#F43F64]">
            REGISTRATION STATUS
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-[#10244A] font-sans tracking-tight leading-tight">
            Registration is Closed
          </h1>
          
          <p className="text-xs sm:text-sm text-[#657A9F] font-medium leading-relaxed max-w-lg mx-auto pt-1">
            Registration for <strong className="text-[#10244A] font-extrabold">{evt.name || 'Python FullStack'}</strong> is no longer available as the registration window has ended or the event has reached full capacity.
          </p>
        </div>

        {/* 4. Thin Horizontal Divider */}
        <div className="border-t border-slate-100 pt-2" />

        {/* 5. Primary Action Button */}
        <div className="space-y-4 pt-1">
          <button
            type="button"
            onClick={() => alert(`Contact ACADENO Event Organizer:\n\nEmail: arathy@acadeno.in\nPhone: +91 484 2900000\nUnit: ACADENO Technologies Pvt. Ltd., CSEZ Unit, Kochi`)}
            className="w-full py-3.5 px-6 rounded-xl bg-[#EAF3FF]/80 hover:bg-[#DCEBFF] border border-[#1769FF]/30 hover:border-[#1769FF] text-[#1769FF] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Mail className="w-4 h-4 text-[#1769FF]" />
            <span>Contact Event Organizer</span>
            <ArrowRight className="w-4 h-4 text-[#1769FF] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 6. Secondary Navigation Action */}
          <div className="text-center">
            <a
              href="https://acadeno.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#657A9F] hover:text-[#1769FF] hover:underline transition-colors inline-flex items-center gap-1.5"
            >
              <span>Visit ACADENO Technologies Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
