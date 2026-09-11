import React, { useState, useEffect } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { generateQrDataUrl, downloadQrImage } from '../../utils/qrUtils';
import { encodeEventToShareUrl } from '../../utils/eventShareUtils';
import { 
  Copy, 
  Download, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  QrCode, 
  ArrowRight,
  Sparkles,
  Check,
  Link2,
  Scan
} from 'lucide-react';

export const PublishConfirmationScreen: React.FC = () => {
  const { selectedEvent, setScreen, showToast } = useEventStore();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const eventSlug = selectedEvent?.slug || (selectedEvent?.name ? selectedEvent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'new-event');
  const publicUrl = encodeEventToShareUrl(selectedEvent, origin);

  useEffect(() => {
    generateQrDataUrl(publicUrl, { width: 480, margin: 1 }).then(setQrUrl);
  }, [publicUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showToast('Working registration link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (qrUrl) {
      downloadQrImage(qrUrl, `${eventSlug}-entry-qr.png`);
      showToast('QR code downloaded successfully');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Register now for "${selectedEvent?.name}":\n${publicUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Registration Link: ${selectedEvent?.name}`);
    const body = encodeURIComponent(`Hi,\n\nYou are invited to register for "${selectedEvent?.name}".\n\n👉 Event Registration Link:\n${publicUrl}\n\n📅 Date: ${selectedEvent?.start_date}\n📍 Venue: ${selectedEvent?.venue || 'Acadeno Technologies'}\n\nFor any questions or help, reach out at arathy@acadeno.in\n\nBest regards,\nArathy\nACADENO Technologies Pvt. Ltd.\narathy@acadeno.in`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <AdminLayout activeNav="events">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex items-center justify-between gap-4 pb-0.5">
          <div>
            <h1 className="text-xl sm:text-[23px] font-extrabold text-[#071A33] tracking-tight font-sans">
              Publish Confirmation
            </h1>
            <p className="text-xs sm:text-[12.5px] text-slate-500 font-medium mt-0.5">
              Your event is officially live and ready to accept participant registrations.
            </p>
          </div>

          {/* Right Decorative 3D Calendar Illustration + Script Text */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 pr-1 select-none">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-sm transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[13px] p-1 flex flex-col justify-between overflow-hidden relative">
                <div className="flex justify-around -mt-0.5">
                  <div className="w-1 h-1.5 bg-slate-300 rounded-full" />
                  <div className="w-1 h-1.5 bg-slate-300 rounded-full" />
                  <div className="w-1 h-1.5 bg-slate-300 rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-0.5 my-auto px-0.5">
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-amber-400 font-bold" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                  <div className="w-1 h-1 rounded-full bg-blue-300/80" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1463FF] border border-white text-white flex items-center justify-center font-bold text-[8px] shadow-xs">
                  +
                </div>
              </div>
            </div>

            <div className="flex flex-col text-left font-['Caveat',cursive] leading-tight select-none">
              <span className="text-xs font-bold text-slate-700">Plan</span>
              <span className="text-xs font-bold text-[#1463FF]">Connect</span>
              <span className="text-[10px] font-semibold text-slate-500 italic">Make it Happen</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Confirmation Card with Increased Height & Generous Spacing */}
        <div className="bg-white rounded-3xl border border-[#DCE5F0] shadow-sm p-7 sm:p-9 lg:p-10 min-h-[540px] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column (7 cols): Status Header + Link Box + Action Buttons + Bottom Nav */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* Centered Top Status Section */}
              <div className="text-center flex flex-col items-center">
                {/* Celebration Check Circle with subtle confetti accents */}
                <div className="relative mb-3">
                  {/* Decorative confetti mini lines */}
                  <span className="absolute -top-1 -left-4 w-2 h-3.5 bg-sky-300 rounded-full rotate-[-25deg]" />
                  <span className="absolute top-1 -right-4 w-2 h-3.5 bg-sky-400 rounded-full rotate-[30deg]" />
                  <span className="absolute -top-3 right-1 w-1.5 h-3 bg-emerald-400 rounded-full rotate-[15deg]" />
                  <span className="absolute top-5 -left-5 w-1.5 h-3 bg-sky-400 rounded-full rotate-[-45deg]" />
                  
                  <div className="w-16 h-16 rounded-full bg-[#EBFBF3] text-[#10B981] flex items-center justify-center shadow-xs border border-emerald-100">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                </div>

                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBFBF3] text-[#059669] text-xs font-bold border border-emerald-200/70 mb-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Live & Accepting Responses</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight font-display leading-tight">
                  Your event is live!
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto mt-1.5 leading-relaxed">
                  Distribute the link or scan the QR code to allow participants to fill out their dynamic registration ticket.
                </p>
              </div>

              {/* Public URL Box */}
              <div className="bg-[#F8FAFD] p-3 sm:p-4 rounded-2xl border border-[#DCE5F0] flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF3FF] text-[#1463FF] flex items-center justify-center shrink-0 border border-blue-100">
                    <Link2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      LIVE REGISTRATION LINK
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-bold text-[#1463FF] truncate mt-0.5">
                      {publicUrl}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE5F0] text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Action Share Buttons (Equal 3-column width) */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadQr}
                  className="h-11 sm:h-12 px-3 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border border-[#DCE5F0] text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span className="truncate">Download QR (PNG)</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="h-11 sm:h-12 px-3 rounded-xl bg-[#00A859] hover:bg-[#00924c] text-white text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span className="truncate">Share on WhatsApp</span>
                </button>

                <button
                  onClick={handleEmailShare}
                  className="h-11 sm:h-12 px-3 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span className="truncate">Email Invitation</span>
                </button>
              </div>

              {/* Bottom Navigation Buttons (Equal 2-column width) */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <button
                  onClick={() => setScreen('15_public_registration')}
                  className="h-12 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-[#CBD5E1] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#1463FF]" />
                  <span className="truncate">View Public Registration Page</span>
                </button>

                <button
                  onClick={() => setScreen('10_event_overview')}
                  className="h-12 px-4 rounded-xl bg-[#071A33] hover:bg-[#0F2D54] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <span className="truncate">Go to Event Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column (5 cols): Large Official Entry QR Code Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[360px] sm:max-w-[380px] p-6 sm:p-7 bg-[#0E1E38] rounded-3xl text-white border border-[#1B325B] shadow-xl text-center flex flex-col items-center">
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-4 font-bold">
                  OFFICIAL ENTRY QR CODE
                </div>
                
                {/* White QR Code Wrapper */}
                <div className="p-4 sm:p-4.5 bg-white rounded-2xl shadow-md inline-block mx-auto mb-4">
                  {qrUrl ? (
                    <img src={qrUrl} alt="Event QR Code" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center text-slate-400">
                      <QrCode className="w-14 h-14 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Event Name & Venue / Date */}
                <div className="text-base sm:text-lg font-bold text-white font-display truncate w-full px-1">
                  {selectedEvent?.name || 'Ai Workshop'}
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate w-full px-1">
                  {selectedEvent?.venue || 'Acadeno Office'} • {selectedEvent?.start_date || '2026-09-11'}
                </div>

                {/* Scan Pill */}
                <div className="w-full mt-4 py-2.5 px-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
                  <Scan className="w-3.5 h-3.5 text-slate-400" />
                  <span>Scan this QR code to register</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
