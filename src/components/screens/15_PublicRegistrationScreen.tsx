import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AcadenoLogo } from '../common/AcadenoLogo';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  LayoutDashboard,
  AlertCircle,
  Upload,
  Bot,
  CheckCircle2
} from 'lucide-react';

import { RegistrationClosedScreen } from './17_RegistrationClosedScreen';

export const PublicRegistrationScreen: React.FC = () => {
  const { 
    selectedEvent, 
    eventRegistrations, 
    submitRegistration, 
    setScreen, 
    setSelectedRegistrationId,
    currentUser
  } = useEventStore();

  const [formData, setFormData] = useState<Record<string, any>>({
    f_name: '',
    f_phone: '',
    f_email: '',
    f_track: selectedEvent?.form_schema?.[3]?.options?.[0] || '',
    f_exp: selectedEvent?.form_schema?.[4]?.options?.[0] || '',
    f_notes: '',
  });

  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 font-display">No Active Event Selected</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The event registration link is not currently active or no event has been published in this database yet.
          </p>
          <button
            onClick={() => setScreen('02_dashboard')}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If event is explicitly closed by organizer, render RegistrationClosedScreen
  if (selectedEvent.status === 'closed') {
    return <RegistrationClosedScreen />;
  }

  const evt = selectedEvent;
  const currentCount = eventRegistrations.length;
  const maxCap = evt.settings?.max_registrations || 100;
  const spotsRemaining = Math.max(0, maxCap - currentCount);
  const seatsFilledPct = maxCap > 0 ? Math.min(100, Math.round((currentCount / maxCap) * 100)) : 0;

  const theme = evt.theme || {
    colors: {
      primary: '#2563EB',
      background: '#F8FAFC',
      text: '#0F172A',
      button: '#FF7A00',
      buttonText: '#FFFFFF'
    },
    typography: { fontFamily: 'Plus Jakarta Sans' }
  };

  const isPhoneField = (f: any) => {
    return f.type === 'phone' || f.id === 'f_phone' || /phone|mobile|contact|whatsapp/i.test(f.label || '');
  };

  const isEmailField = (f: any) => {
    return f.type === 'email' || f.id === 'f_email' || /email|mail/i.test(f.label || '');
  };

  const GMAIL_TYPOS = ['gma.com', 'gm.cm', 'gm.com', 'gmai.com', 'gamil.com', 'gmaill.com', 'gmai.co', 'gmail.cm', 'gmal.com', 'gmaul.com', 'gmaio.com', 'gmai.in', 'gma.in', 'gmail.c', 'gmai.org'];
  const YAHOO_TYPOS = ['yaho.com', 'yaho.co', 'yahoo.cm', 'yhoo.com', 'yaho.in'];
  const OUTLOOK_TYPOS = ['outlok.com', 'outloo.com', 'outllok.com', 'hotmial.com', 'hotmai.com'];

  const VALID_TLDS = new Set([
    'com', 'in', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'me', 'tech', 'dev', 'app', 'info', 
    'biz', 'online', 'store', 'site', 'agency', 'global', 'co.in', 'ac.in', 'gov.in', 'net.in', 
    'org.in', 'res.in', 'ernet.in', 'us', 'uk', 'ca', 'au', 'de', 'fr', 'sg', 'ae', 'nz', 'eu'
  ]);

  const validateEmailWithDetails = (emailStr: string): { isValid: boolean; errorMsg?: string; suggestion?: string } => {
    const clean = emailStr.trim().toLowerCase();
    if (!clean) return { isValid: false, errorMsg: 'Email is required' };

    // Standard email syntax check
    const basicRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
    const match = clean.match(basicRegex);
    if (!match) {
      return { isValid: false, errorMsg: 'Invalid format (e.g. name@gmail.com)' };
    }

    const domainPart = match[1];
    const tldPart = match[2];
    const fullDomain = `${domainPart}.${tldPart}`;

    // Common Gmail typos detection
    if (GMAIL_TYPOS.includes(fullDomain) || ((domainPart === 'gm' || domainPart === 'gma') && (tldPart === 'cm' || tldPart === 'com'))) {
      return { isValid: false, errorMsg: 'Invalid domain', suggestion: 'Did you mean @gmail.com?' };
    }

    // Common Yahoo typos detection
    if (YAHOO_TYPOS.includes(fullDomain)) {
      return { isValid: false, errorMsg: 'Invalid domain', suggestion: 'Did you mean @yahoo.com?' };
    }

    // Common Outlook typos detection
    if (OUTLOOK_TYPOS.includes(fullDomain)) {
      return { isValid: false, errorMsg: 'Invalid domain', suggestion: 'Did you mean @outlook.com?' };
    }

    // Reject short or broken domain names
    if (domainPart.length < 2) {
      return { isValid: false, errorMsg: 'Domain name is too short' };
    }

    // Check valid recognized TLD
    if (!VALID_TLDS.has(tldPart) && !tldPart.includes('.')) {
      return { isValid: false, errorMsg: `Unrecognized domain extension (.${tldPart})` };
    }

    return { isValid: true, errorMsg: '✓ Valid Format' };
  };

  const validateIndianMobile = (phoneStr: string): { isValid: boolean; errorMsg: string } => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 0) {
      return { isValid: false, errorMsg: '0/10 digits' };
    }
    if (digits.length < 10) {
      return { isValid: false, errorMsg: `${digits.length}/10 digits` };
    }
    if (digits.length === 10) {
      // Indian mobile numbers must start with 6, 7, 8, or 9
      if (!/^[6-9]/.test(digits)) {
        return { isValid: false, errorMsg: 'Must start with 6, 7, 8, or 9' };
      }
      // Check for dummy repetitive sequence
      if (/^(\d)\1{9}$/.test(digits)) {
        return { isValid: false, errorMsg: 'Invalid repetitive number' };
      }
      return { isValid: true, errorMsg: '✓ Valid Mobile' };
    }
    return { isValid: false, errorMsg: 'Max 10 digits' };
  };

  const handleFieldChange = (fieldId: string, val: any, fieldType?: string) => {
    // If it's a phone/mobile field, enforce strictly numbers and max 10 digits
    if (fieldType === 'phone' || fieldId === 'f_phone') {
      const numericVal = String(val).replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [fieldId]: numericVal }));
      return;
    }

    // If it's email, trim spaces
    if (fieldType === 'email' || fieldId === 'f_email') {
      setFormData(prev => ({ ...prev, [fieldId]: String(val).trim() }));
      return;
    }

    setFormData(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleApplyEmailSuggestion = (fieldId: string, currentVal: string, suggestion: string) => {
    const localPart = currentVal.split('@')[0] || '';
    if (suggestion.includes('@gmail.com')) {
      handleFieldChange(fieldId, `${localPart}@gmail.com`, 'email');
    } else if (suggestion.includes('@yahoo.com')) {
      handleFieldChange(fieldId, `${localPart}@yahoo.com`, 'email');
    } else if (suggestion.includes('@outlook.com')) {
      handleFieldChange(fieldId, `${localPart}@outlook.com`, 'email');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (evt.form_schema) {
      for (const field of evt.form_schema) {
        const val = formData[field.id];
        
        // Check required fields
        if (field.required && (!val || String(val).trim() === '')) {
          setErrorMessage(`Please fill out the required field: "${field.label}"`);
          return;
        }

        // Email validation
        if (isEmailField(field) && val) {
          const emailCheck = validateEmailWithDetails(val);
          if (!emailCheck.isValid) {
            if (emailCheck.suggestion) {
              setErrorMessage(`Invalid email domain for "${field.label}". ${emailCheck.suggestion}`);
            } else {
              setErrorMessage(`Please enter a valid email address (e.g. name@gmail.com) for "${field.label}".`);
            }
            return;
          }
        }

        // Phone validation: Indian mobile starts with 6-9 and exactly 10 digits
        if (isPhoneField(field) && val) {
          const phoneCheck = validateIndianMobile(val);
          if (!phoneCheck.isValid) {
            setErrorMessage(`Invalid mobile number for "${field.label}". Indian numbers must be 10 digits and start with 6, 7, 8, or 9.`);
            return;
          }
        }
      }
    }

    // Fallback checks for direct fields if not covered in schema
    if (formData.f_email) {
      const emailCheck = validateEmailWithDetails(formData.f_email);
      if (!emailCheck.isValid) {
        setErrorMessage(emailCheck.suggestion ? `Invalid email. ${emailCheck.suggestion}` : 'Please enter a valid email address format (e.g. name@gmail.com).');
        return;
      }
    }

    if (formData.f_phone) {
      const phoneCheck = validateIndianMobile(formData.f_phone);
      if (!phoneCheck.isValid) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
        return;
      }
    }

    if (evt.settings?.require_consent && !consentAgreed) {
      setErrorMessage('Please accept the event data consent agreement.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      
      // 1. Dynamic Phone Extraction across all possible schema IDs and form keys
      let rawPhone = '';
      if (evt.form_schema) {
        const phoneField = evt.form_schema.find((f: any) => isPhoneField(f));
        if (phoneField && formData[phoneField.id]) {
          rawPhone = String(formData[phoneField.id]).replace(/[^\d+]/g, '');
        }
      }
      if (!rawPhone) {
        for (const [key, val] of Object.entries(formData)) {
          if (/(phone|mobile|contact|whatsapp|tel|cell)/i.test(key) && val) {
            rawPhone = String(val).replace(/[^\d+]/g, '');
            break;
          }
        }
      }
      if (!rawPhone && formData.f_phone) {
        rawPhone = String(formData.f_phone).replace(/[^\d+]/g, '');
      }
      // Catch-all: check if any entered field value contains 7-15 digits
      if (!rawPhone) {
        for (const [, val] of Object.entries(formData)) {
          if (typeof val === 'string' || typeof val === 'number') {
            const digits = String(val).replace(/\D/g, '');
            if (digits.length >= 7 && digits.length <= 15) {
              rawPhone = digits;
              break;
            }
          }
        }
      }

      // 2. Dynamic Email Extraction
      let rawEmail = '';
      if (evt.form_schema) {
        const emailField = evt.form_schema.find((f: any) => isEmailField(f));
        if (emailField && formData[emailField.id]) {
          rawEmail = String(formData[emailField.id]).trim();
        }
      }
      if (!rawEmail) {
        for (const [key, val] of Object.entries(formData)) {
          if ((/(email|mail)/i.test(key) || (typeof val === 'string' && val.includes('@'))) && val) {
            rawEmail = String(val).trim();
            break;
          }
        }
      }
      if (!rawEmail && formData.f_email) {
        rawEmail = String(formData.f_email).trim();
      }

      // 3. Dynamic Name Extraction
      let rawName = '';
      if (evt.form_schema) {
        const nameField = evt.form_schema.find((f: any) => f.id === 'f_name' || /(full[\s_]?name|first[\s_]?name|participant|student|attendee|name)/i.test(f.label || ''));
        if (nameField && formData[nameField.id]) {
          rawName = String(formData[nameField.id]).trim();
        }
      }
      if (!rawName) {
        for (const [key, val] of Object.entries(formData)) {
          if (/(name|attendee|student)/i.test(key) && val && typeof val === 'string' && val.trim().length > 0) {
            rawName = String(val).trim();
            break;
          }
        }
      }
      if (!rawName) {
        const firstTextField = evt.form_schema?.find((f: any) => f.type === 'text');
        if (firstTextField && formData[firstTextField.id]) {
          rawName = String(formData[firstTextField.id]).trim();
        }
      }

      const formattedPhone = rawPhone ? (rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone}`) : '—';
      const finalName = rawName || 'Participant';
      const finalEmail = rawEmail || 'attendee@example.com';

      const newReg = submitRegistration(evt.id, {
        name: finalName,
        email: finalEmail,
        phone: formattedPhone,
        responses: formData,
        source: 'direct',
      });
      setSelectedRegistrationId(newReg.id);
      setScreen('16_registration_success');
    }, 700);
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 flex flex-col justify-center items-center relative"
      style={{
        backgroundColor: theme.colors.background || '#F8FAFC',
        color: theme.colors.text || '#0F172A',
        fontFamily: theme.typography.fontFamily || 'Plus Jakarta Sans',
      }}
    >
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <AcadenoLogo size="lg" />
      </div>

      {/* Main Ticket-style Container */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 transition-all">
        
        {/* Optional Uploaded Event Banner (Cloudinary / Image URL) */}
        {evt.banner_url && (
          <div className="w-full h-44 sm:h-52 relative overflow-hidden bg-slate-900 border-b border-white/10">
            <img 
              src={evt.banner_url} 
              alt={evt.name} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
          </div>
        )}

        {/* Event Header Banner */}
        <div 
          className="p-6 sm:p-8 text-white relative overflow-hidden"
          style={{ backgroundColor: theme.colors.primary }}
        >
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Official Event Registration</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight mb-3 font-display">
            {evt.name}
          </h1>

          <div className="space-y-1.5 text-xs text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0 text-white/80" />
              <span className="font-medium">{evt.start_date} • {evt.start_time || '10:00 AM'} - {evt.end_time || '1:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-white/80" />
              <span className="font-medium">{evt.venue}</span>
            </div>
          </div>
        </div>

        {/* Spots Remaining Progress Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-700">{spotsRemaining} spots remaining</span>
            <span className="text-slate-400 ml-1">({currentCount} of {maxCap} reserved)</span>
          </div>
          <div className="w-28 bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#FF7A00] h-full rounded-full transition-all duration-500" 
              style={{ width: `${seatsFilledPct}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
            {evt.short_description || 'Hands-on session on practical AI automation for daily work.'}
          </p>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Dynamic fields */}
            {evt.form_schema?.map((f: any) => {
              const val = formData[f.id] || '';
              const isPhone = isPhoneField(f);
              const isEmail = isEmailField(f);
              const phoneCheck = isPhone ? validateIndianMobile(val) : { isValid: true, errorMsg: '' };
              const emailCheck = isEmail ? validateEmailWithDetails(val) : { isValid: true, errorMsg: '' };

              return (
                <div key={f.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>

                    {/* Live helper badge for Phone */}
                    {isPhone && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        val.length === 10 && phoneCheck.isValid
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : val.length === 10 && !phoneCheck.isValid
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : val.length > 0 
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                      }`}>
                        {val.length === 10 && phoneCheck.isValid 
                          ? '✓ Valid Mobile' 
                          : val.length === 10 && !phoneCheck.isValid 
                            ? '❌ Starts with 6, 7, 8 or 9' 
                            : `${val.length}/10 digits`}
                      </span>
                    )}

                    {/* Live helper badge for Email */}
                    {isEmail && val.length > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        emailCheck.isValid 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {emailCheck.isValid ? '✓ Valid Format' : emailCheck.suggestion || emailCheck.errorMsg || 'Invalid format'}
                      </span>
                    )}
                  </div>

                  {/* Field Types renderer */}
                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      placeholder={f.placeholder || 'Enter your response...'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                    />
                  ) : f.type === 'dropdown' ? (
                    <select
                      value={val}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all font-medium"
                    >
                      <option value="">{f.placeholder || 'Select an option...'}</option>
                      {f.options?.map((opt: string, i: number) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === 'radio' ? (
                    <div className="space-y-2 pt-1">
                      {f.options?.map((opt: string, i: number) => (
                        <label key={i} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name={f.id}
                            value={opt}
                            checked={val === opt}
                            onChange={() => handleFieldChange(f.id, opt)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : f.type === 'file' ? (
                    <label className="block p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl text-center bg-slate-50 hover:bg-blue-50/40 cursor-pointer transition-all">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFieldChange(f.id, file.name);
                          }
                        }}
                      />
                      {val ? (
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Uploaded: {val}</span>
                          <span className="text-[10px] text-slate-400 font-normal underline ml-1">Change file</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                          <span className="text-xs text-slate-700 font-semibold block">Click to upload document attachment</span>
                          <span className="text-[10px] text-slate-400">PDF, PNG, JPG or DOC (Max 10MB)</span>
                        </div>
                      )}
                    </label>
                  ) : isPhone ? (
                    /* Dedicated 10-Digit Mobile Phone Input */
                    <div className="space-y-1">
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-slate-500 text-xs font-bold border-r border-slate-200 pr-2">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          value={val}
                          onChange={(e) => handleFieldChange(f.id, e.target.value, 'phone')}
                          placeholder="9876543210 (starts with 6, 7, 8, 9)"
                          className={`w-full pl-20 pr-4 py-2.5 bg-slate-50 border ${
                            val.length === 10 && phoneCheck.isValid
                              ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10' 
                              : val.length === 10 && !phoneCheck.isValid
                                ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20 text-rose-800'
                                : val.length > 0 && val.length < 10 
                                  ? 'border-amber-300 focus:ring-amber-500'
                                  : 'border-slate-200 focus:ring-blue-600'
                          } rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:outline-none transition-all font-mono font-medium tracking-wide`}
                        />
                      </div>
                      {val.length === 10 && !phoneCheck.isValid && (
                        <p className="text-[11px] text-rose-600 font-medium pl-1">
                          ⚠️ Indian mobile numbers must start with <strong>6, 7, 8, or 9</strong>.
                        </p>
                      )}
                    </div>
                  ) : isEmail ? (
                    /* Dedicated Email Input */
                    <div className="space-y-1">
                      <input
                        type="email"
                        value={val}
                        onChange={(e) => handleFieldChange(f.id, e.target.value, 'email')}
                        placeholder={f.placeholder || 'e.g. participant@gmail.com'}
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                          val.length > 0 && emailCheck.isValid 
                            ? 'border-emerald-400 focus:ring-emerald-500 bg-emerald-50/10' 
                            : val.length > 0 && !emailCheck.isValid
                              ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20 text-rose-900'
                              : 'border-slate-200 focus:ring-blue-600'
                        } rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:outline-none transition-all font-medium`}
                      />

                      {/* Clickable suggestion auto-fix button if typo detected */}
                      {val.length > 0 && !emailCheck.isValid && emailCheck.suggestion && (
                        <button
                          type="button"
                          onClick={() => handleApplyEmailSuggestion(f.id, val, emailCheck.suggestion!)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 pl-1 cursor-pointer underline"
                        >
                          <span>Fix to:</span>
                          <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {val.split('@')[0]}@gmail.com
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : 'text'}
                      value={val}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all font-medium"
                    />
                  )}
                </div>
              );
            })}

            {/* DPDP Act 2023 Consent Checkbox */}
            {evt.settings?.require_consent && (
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="leading-snug">
                    {evt.settings.consent_text || 'I agree to receive event updates on WhatsApp and email under India DPDP Act 2023.'}
                  </span>
                </label>
              </div>
            )}

            {/* Anti-bot protection badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rate-limited & Cloudflare CAPTCHA Protected</span>
              </span>
              <span className="font-mono font-semibold">SECURE-SSL</span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: theme.colors.button || '#FF7A00',
                color: theme.colors.buttonText || '#FFFFFF',
              }}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-3">
              <span className="text-[11px] font-medium text-slate-400">
                Powered by <span className="font-semibold text-slate-600">ACADENO Technologies</span> • EventLink Platform
              </span>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
