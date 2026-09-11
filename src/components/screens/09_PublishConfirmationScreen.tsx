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
  Check
} from 'lucide-react';

export const PublishConfirmationScreen: React.FC = () => {
  const { selectedEvent, setScreen, showToast } = useEventStore();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const eventSlug = selectedEvent?.slug || (selectedEvent?.name ? selectedEvent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'new-event');
  const publicUrl = encodeEventToShareUrl(selectedEvent, origin);

  useEffect(() => {
    generateQrDataUrl(publicUrl, { width: 280 }).then(setQrUrl);
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
      <div className="space-y-3.5 w-full max-w-5xl mx-auto">
        
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

        {/* Main 2-Column Compact Confirmation Card (Zero Scrolling) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] shadow-sm p-4 sm:p-5 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-center">

            {/* Left Column (7 cols): Status + Title + Link + Share Buttons + Navigation */}
            <div className="md:col-span-7 space-y-3.5 text-left">
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Live & Accepting Responses</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                    Your event is live!
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                    Distribute the link or scan the QR code to allow participants to fill out their dynamic registration ticket.
                  </p>
                </div>
              </div>

              {/* Public URL Box */}
              <div className="bg-[#F8FAFC] p-2.5 sm:p-3 rounded-xl border border-[#DCE5F0] flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                    LIVE REGISTRATION LINK
                  </div>
                  <div className="text-xs font-mono font-bold text-[#1463FF] truncate mt-0.5">
                    {publicUrl}
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="h-8 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE5F0] text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Action Share Buttons Grid */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                <button
                  onClick={handleDownloadQr}
                  className="h-8.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download QR</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="h-8.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleEmailShare}
                  className="h-8.5 px-2.5 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Invite</span>
                </button>
              </div>

              {/* Bottom Navigation */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2.5">
                <button
                  onClick={() => setScreen('15_public_registration')}
                  className="flex-1 h-9 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-[#DCE5F0] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#1463FF]" />
                  <span>View Public Page</span>
                </button>

                <button
                  onClick={() => setScreen('10_event_overview')}
                  className="flex-1 h-9 px-3 rounded-xl bg-[#071A33] hover:bg-[#0F2D54] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer truncate"
                >
                  <span>Go to Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right Column (5 cols): Compact Official Entry QR Code */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[250px] p-3.5 bg-gradient-to-br from-[#0B172B] to-[#1E293B] rounded-2xl shadow-xl text-white border border-slate-800 text-center">
                <div className="text-[9.5px] font-mono text-slate-400 mb-1.5 tracking-wider uppercase">
                  Official Entry QR Code
                </div>
                
                <div className="p-2 bg-white rounded-xl inline-block shadow-inner mx-auto">
                  {qrUrl ? (
                    <img src={qrUrl} alt="Event QR Code" className="w-32 h-32 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center text-slate-400">
                      <QrCode className="w-8 h-8 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="text-xs text-white font-bold mt-1.5 font-display truncate px-1">
                  {selectedEvent?.name || 'AI Automation Workshop'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate px-1">
                  {selectedEvent?.venue || 'Kozhikode'} • {selectedEvent?.start_date}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
};


