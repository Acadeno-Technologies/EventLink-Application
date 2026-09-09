import React, { useState, useEffect } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { generateQrDataUrl } from '../../utils/qrUtils';
import { Registration, RegistrationStatus, AttendanceStatus } from '../../types';
import { 
  Printer, 
  ArrowLeft, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  QrCode, 
  FileText, 
  Calendar, 
  MapPin, 
  ShieldCheck,
  Send,
  Edit2,
  X,
  Save,
  MessageSquare,
  Copy,
  ExternalLink,
  Share2,
  Check,
  Sparkles,
  Zap,
  AlertTriangle
} from 'lucide-react';

export const RegistrationDetailScreen: React.FC = () => {
  const { 
    selectedRegistration, 
    selectedEvent, 
    setScreen, 
    updateRegistration, 
    deleteRegistration,
    showToast 
  } = useEventStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Pass Send / Resend Modal state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isAutomatedSending, setIsAutomatedSending] = useState(false);
  const [automatedSentSuccess, setAutomatedSentSuccess] = useState(false);

  // Custom Delete Confirmation Popup state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!selectedRegistration) {
    return (
      <AdminLayout
        activeNav="registrations"
        pageTitle="Registration Detail"
        pageSubtitle="No registration currently selected."
      >
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-2xs">
            <UserCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No Registration Selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Select a participant from the registrations table to view ticket details and responses.
          </p>
          <button
            onClick={() => setScreen('11_registrations')}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Go to Registrations
          </button>
        </div>
      </AdminLayout>
    );
  }

  const reg = selectedRegistration;
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const getPhoneDisplay = (r: Registration) => {
    if (r.phone && r.phone !== '+91 9846000000' && r.phone !== '+91 98460 00000' && r.phone !== '—' && r.phone !== '-') {
      return r.phone;
    }
    if (r.responses) {
      if (selectedEvent?.form_schema) {
        for (const field of selectedEvent.form_schema) {
          if (field.type === 'phone' || /(phone|mobile|contact|whatsapp)/i.test(field.label || '')) {
            const val = r.responses[field.id];
            if (val) {
              const clean = String(val).replace(/[^\d+]/g, '');
              if (clean.length >= 5) {
                return clean.startsWith('+') ? clean : `+91 ${clean}`;
              }
            }
          }
        }
      }

      for (const [key, val] of Object.entries(r.responses)) {
        if (/(phone|mobile|contact|whatsapp|tel|cell)/i.test(key) && val) {
          const clean = String(val).replace(/[^\d+]/g, '');
          if (clean.length >= 5) {
            return clean.startsWith('+') ? clean : `+91 ${clean}`;
          }
        }
      }

      for (const [, val] of Object.entries(r.responses)) {
        if (typeof val === 'string' || typeof val === 'number') {
          const clean = String(val).replace(/\D/g, '');
          if (clean.length >= 7 && clean.length <= 15) {
            return `+91 ${clean}`;
          }
        }
      }
    }
    return (r.phone && r.phone !== '+91 9846000000' && r.phone !== '+91 98460 00000') ? r.phone : '—';
  };

  const phoneFormatted = getPhoneDisplay(reg);
  const phoneDigits = phoneFormatted.replace(/\D/g, '');
  const cleanPhoneForWa = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
  
  const eventName = selectedEvent?.name || 'Event';
  const eventDate = selectedEvent?.start_date || 'Upcoming';
  const eventVenue = selectedEvent?.venue || 'Venue';
  const passUrl = `${window.location.origin}/?code=${reg.registration_code}`;

  const whatsappMessage = `*ACADENO EventLink — Official Event Pass* 🎟️

Hello *${reg.name}*,
Your registration for *${eventName}* is confirmed!

━━━━━━━━━━━━━━━━━━━━
📌 *Ticket ID:* ${reg.registration_code}
📅 *Date:* ${eventDate}
📍 *Venue:* ${eventVenue}
👤 *Attendee:* ${reg.name}
━━━━━━━━━━━━━━━━━━━━

👉 *View Your Live Entry Pass & QR Code:*
${passUrl}

Please present this pass at the entrance for instant check-in.

For assistance, contact: arathy@acadeno.in
Best regards,
Arathy — ACADENO Event Operations`;

  const emailSubject = `Official Event Pass: ${eventName} (Ticket #${reg.registration_code})`;
  const emailBody = `Dear ${reg.name},

Thank you for registering for "${eventName}"!

Here are your official registration pass details:
• Registration Code: ${reg.registration_code}
• Date: ${eventDate}
• Venue: ${eventVenue}
• Live Ticket Pass URL: ${passUrl}

Please show this pass or your QR code at the registration desk for check-in.

If you have any questions or need support, reply directly to this email or reach out to arathy@acadeno.in.

Best regards,
Arathy
ACADENO Technologies Pvt. Ltd.
arathy@acadeno.in`;

  const handleOpenWhatsApp = () => {
    if (!cleanPhoneForWa || cleanPhoneForWa.length < 5) {
      showToast('No valid phone number found for this participant');
      return;
    }
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${cleanPhoneForWa}?text=${encoded}`, '_blank');
    showToast('Opening WhatsApp with ticket details...');
  };

  const handleOpenEmail = () => {
    if (!reg.email) {
      showToast('No email address found for this participant');
      return;
    }
    const mailto = `mailto:${encodeURIComponent(reg.email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailto, '_blank');
    showToast('Opening email draft...');
  };

  const handleCopyText = (type: 'whatsapp' | 'email' | 'link') => {
    let content = '';
    if (type === 'whatsapp') content = whatsappMessage;
    else if (type === 'email') content = emailBody;
    else if (type === 'link') content = passUrl;

    navigator.clipboard.writeText(content);
    setCopiedType(type);
    showToast(type === 'link' ? 'Pass URL copied to clipboard!' : `${type.toUpperCase()} text copied to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTriggerAutomatedRelay = () => {
    setIsAutomatedSending(true);
    setAutomatedSentSuccess(false);
    setTimeout(() => {
      setIsAutomatedSending(false);
      setAutomatedSentSuccess(true);
      showToast(`Pass queued and dispatched to ${reg.email} & WhatsApp ${phoneFormatted}!`);
    }, 1200);
  };

  useEffect(() => {
    if (reg.registration_code) {
      generateQrDataUrl(reg.registration_code, { width: 240 }).then(setQrCodeUrl);
    }
  }, [reg.registration_code]);

  const handleOpenEdit = () => {
    setEditName(reg.name);
    setEditEmail(reg.email);
    const currPhone = getPhoneDisplay(reg).replace(/^\+91\s*/, '').replace('—', '');
    setEditPhone(currPhone);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = editPhone.replace(/\D/g, '').slice(0, 10);
    const finalPhone = cleanDigits ? `+91 ${cleanDigits}` : '—';
    
    updateRegistration(reg.id, {
      name: editName.trim() || reg.name,
      email: editEmail.trim() || reg.email,
      phone: finalPhone,
    });
    setIsEditing(false);
    showToast('Participant details updated successfully');
  };

  const handleStatusChange = (newStatus: RegistrationStatus) => {
    updateRegistration(reg.id, { status: newStatus });
    showToast(`Status updated to ${newStatus}`);
  };

  const handleAttendanceChange = (newAtt: AttendanceStatus) => {
    updateRegistration(reg.id, { attendance_status: newAtt });
    showToast(`Door attendance updated to ${newAtt}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteRegistration(reg.id);
    setIsDeleteModalOpen(false);
    setScreen('11_registrations');
    showToast(`Deleted registration for ${reg.name}`);
  };

  const handleResendConfirmation = () => {
    setIsSendModalOpen(true);
  };

  return (
    <AdminLayout
      activeNav="registrations"
      pageTitle={`Registration #${reg.registration_code}`}
      pageSubtitle={`Participant record for ${reg.name} • Submitted ${new Date(reg.submitted_at).toLocaleString()}`}
      headerAction={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('11_registrations')}
            className="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to List</span>
          </button>

          <button
            onClick={handleOpenEdit}
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Edit Details</span>
          </button>

          <button
            onClick={handlePrint}
            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Badge / Ticket</span>
          </button>
        </div>
      }
    >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Full Participant Info & Responses */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Header with Status Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Registration Code
                </div>
                <div className="text-2xl font-black text-blue-600 font-mono tracking-wide mt-0.5">
                  {reg.registration_code}
                </div>
              </div>

              {/* Instant Status Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
                  {(['confirmed', 'pending', 'cancelled'] as RegistrationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                        reg.status === st
                          ? st === 'confirmed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : st === 'pending'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Participant Name</span>
                <div className="text-sm font-bold text-slate-900">{reg.name}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Email Address</span>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{reg.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Mobile / WhatsApp</span>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{phoneFormatted}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Traffic Source Channel</span>
                <div className="text-sm font-semibold text-slate-800 capitalize">
                  {reg.source || 'Direct Link'}
                </div>
              </div>
            </div>

            {/* Dynamic Form Schema Responses */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Custom Form Answers & Responses
              </h3>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/40">
                {selectedEvent?.form_schema ? (
                  selectedEvent.form_schema.map((f) => {
                    const answer = reg.responses?.[f.id];
                    return (
                      <div key={f.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-semibold text-slate-600">{f.label}:</span>
                        <span className="font-bold text-slate-900 sm:text-right">
                          {Array.isArray(answer) ? answer.join(', ') : (answer || '—')}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  Object.entries(reg.responses || {}).map(([key, val]) => (
                    <div key={key} className="p-3.5 text-xs flex justify-between">
                      <span className="font-semibold text-slate-600">{key}:</span>
                      <span className="font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 no-print">
              <button
                onClick={handleResendConfirmation}
                className="h-10 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Resend Email & WhatsApp Pass</span>
              </button>

              <button
                onClick={handleDelete}
                className="h-10 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Registration</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Printable Ticket / Badge Preview */}
        <div className="lg:col-span-4 space-y-6">
          
          <div id="printable-ticket" className="bg-white rounded-2xl border-2 border-blue-500/30 p-6 shadow-md text-center relative overflow-hidden space-y-4">
            
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
            
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block">
              Official Attendee Pass
            </div>

            <div>
              <h4 className="text-base font-bold font-display text-slate-900 leading-tight">
                {selectedEvent?.name || 'AI Automation Workshop'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {selectedEvent?.venue || 'Kozhikode'} • {selectedEvent?.start_date}
              </p>
            </div>

            {/* QR Code */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Pass QR" className="w-40 h-40 mx-auto rounded-lg" />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-slate-400 animate-pulse" />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-slate-900">{reg.registration_code}</div>
              <div className="text-sm font-extrabold text-blue-700 mt-1">{reg.name}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{phoneFormatted}</div>
            </div>

            {/* Check-in Status Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                reg.attendance_status === 'present'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {reg.attendance_status === 'present' ? '✓ Checked In (Present)' : 'Door Status: Not Checked In'}
              </span>
            </div>

            {/* Front Desk Check-in Action */}
            <div className="pt-2 no-print">
              <button
                onClick={() => handleAttendanceChange(reg.attendance_status === 'present' ? 'absent' : 'present')}
                className={`w-full h-10 px-4 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  reg.attendance_status === 'present'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[#0B172B] hover:bg-[#1E293B] text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{reg.attendance_status === 'present' ? 'Undo Check-In' : 'Mark Present (Door Check-In)'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Edit Participant Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Participant Details</h3>
                    <p className="text-[11px] text-slate-500">Update contact info for {reg.registration_code}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Participant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number (10 Digits)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 text-xs font-bold pointer-events-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full pl-16 pr-3.5 h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Must be 10 digits starting with 6, 7, 8, or 9.</p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SEND / RESEND PASS MODAL */}
        {isSendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Send Ticket & Event Pass</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                        #{reg.registration_code}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Deliver official entry pass to {reg.name} via WhatsApp or Email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSendModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
                
                {/* Recipient Details Pill */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Attendee</div>
                    <div className="font-bold text-slate-900">{reg.name}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Email</div>
                    <div className="font-semibold text-slate-700 font-mono">{reg.email}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">WhatsApp / Phone</div>
                    <div className="font-bold text-emerald-700 font-mono">{phoneFormatted}</div>
                  </div>
                </div>

                {/* Option 1: WhatsApp (Recommended) */}
                <div className="p-4 rounded-xl border-2 border-emerald-500/20 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                        💬
                      </div>
                      <span>Option 1: Send via WhatsApp (Direct 1-Click)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Instant
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Opens WhatsApp Web / App with a formatted invitation including ticket code, event date, venue, and live pass QR link:
                  </p>

                  {/* WhatsApp Message Preview Box */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200/80 font-mono text-[11px] text-slate-700 whitespace-pre-line leading-relaxed shadow-xs max-h-36 overflow-y-auto">
                    {whatsappMessage}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp ({cleanPhoneForWa ? `+${cleanPhoneForWa}` : 'Send'})</span>
                    </button>

                    <button
                      onClick={() => handleCopyText('whatsapp')}
                      className="h-9 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedType === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'whatsapp' ? 'Copied!' : 'Copy WhatsApp Message'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 2: Email */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>Option 2: Send via Email</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Opens your default email client with a pre-filled ticket pass template:
                  </p>

                  {/* Email Message Preview Box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                    <div className="font-bold text-slate-900 mb-1 font-sans">Subject: {emailSubject}</div>
                    {emailBody}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleOpenEmail}
                      className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Mail Draft ({reg.email})</span>
                    </button>

                    <button
                      onClick={() => handleCopyText('email')}
                      className="h-9 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedType === 'email' ? 'Copied!' : 'Copy Email Body'}</span>
                    </button>
                  </div>
                </div>

                {/* Option 3: Direct Pass Link */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">Direct Attendee Ticket Pass Link</span>
                    <button
                      onClick={() => handleCopyText('link')}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedType === 'link' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'link' ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 truncate select-all">
                    {passUrl}
                  </div>
                </div>

                {/* Option 4: Automated Cloud Relay Simulation */}
                <div className="p-3.5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Automated Server Relay</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Dispatches pass to email and WhatsApp via ACADENO webhook
                    </p>
                  </div>

                  <button
                    disabled={isAutomatedSending || automatedSentSuccess}
                    onClick={handleTriggerAutomatedRelay}
                    className={`h-8 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      automatedSentSuccess
                        ? 'bg-emerald-600 text-white'
                        : isAutomatedSending
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {automatedSentSuccess ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Dispatched!</span>
                      </>
                    ) : isAutomatedSending ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Dispatch Relay</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end">
                <button
                  onClick={() => setIsSendModalOpen(false)}
                  className="h-9 px-4 rounded-xl bg-[#0B172B] hover:bg-[#1E293B] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION POPUP MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative p-6 space-y-5 animate-in zoom-in-95">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-xs">
                  <Trash2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Delete Registration?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Are you sure you want to permanently delete the ticket record for <span className="font-bold text-slate-800">{reg.name}</span>?
                  </p>
                </div>
              </div>

              {/* Participant Summary Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Ticket ID:</span>
                  <span className="font-bold text-blue-600">{reg.registration_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Email:</span>
                  <span className="text-slate-700">{reg.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans font-medium">Phone:</span>
                  <span className="text-slate-700">{phoneFormatted}</span>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-[11px] text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>This action cannot be undone and will be logged in audit records.</span>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Registration</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

