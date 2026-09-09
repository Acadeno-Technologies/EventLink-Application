import React, { useState, useEffect } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { generateQrDataUrl, downloadQrImage } from '../../utils/qrUtils';
import { 
  CheckCircle2, 
  Copy, 
  Download, 
  Share2, 
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
  const publicUrl = `${origin}/?event=${eventSlug}`;
  const canonicalUrl = `https://acadeno.com/e/${eventSlug}`;

  useEffect(() => {
    generateQrDataUrl(publicUrl, { width: 320 }).then(setQrUrl);
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
    <AdminLayout
      activeNav="events"
      pageTitle="Publish Confirmation"
      pageSubtitle="Your event is officially live and ready to accept participant registrations."
    >

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-10 text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live & Accepting Responses
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">Your event is live!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Distribute the link or scan the QR code to allow participants to fill out their dynamic registration ticket.
          </p>
        </div>

        {/* Public URL Box */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-left">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Live Registration Link</div>
            <div className="text-xs font-mono font-bold text-indigo-600 truncate">{publicUrl}</div>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-6 bg-slate-900 rounded-2xl inline-block shadow-xl text-white">
          <div className="text-[11px] font-mono text-slate-400 mb-3 tracking-wider uppercase">
            Official Entry QR Code
          </div>
          
          <div className="p-3 bg-white rounded-xl inline-block shadow-inner">
            {qrUrl ? (
              <img src={qrUrl} alt="Event QR Code" className="w-52 h-52 mx-auto" />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>

          <div className="text-xs text-slate-300 font-bold mt-3">
            {selectedEvent?.name || 'AI Automation Workshop'}
          </div>
          <div className="text-[11px] text-slate-400">
            {selectedEvent?.venue || 'Kozhikode'} • {selectedEvent?.start_date}
          </div>
        </div>

        {/* Action Share Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleDownloadQr}
            className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download QR (PNG)</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleEmailShare}
            className="py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Email Invitation</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setScreen('15_public_registration')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Registration Page</span>
          </button>

          <button
            onClick={() => setScreen('10_event_overview')}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            <span>Go to Event Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};
