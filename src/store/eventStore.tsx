import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  ScreenId, 
  User, 
  UserRole, 
  Organization, 
  Event, 
  Registration, 
  AuditLog
} from '../types';
import { 
  initialOrganization, 
  initialUsers, 
  themePresets 
} from '../data/seedData';
import { decodeEventFromUrlParams, findMatchingEvent, matchesEvent } from '../utils/eventShareUtils';
import { 
  syncEventToCloud, 
  syncRegistrationToCloud, 
  fetchRemoteEvents, 
  fetchRemoteEventBySlug,
  fetchRemoteRegistrations,
  fetchRemoteUsers,
  syncUserToCloud,
  deleteUserFromCloud,
  loginRemote,
  deleteEventFromCloud,
  deleteRegistrationFromCloud,
  generateUUID,
  ensureValidUUID,
  isValidUUID
} from '../utils/supabaseClient';

export const extractRegistrationIdentifiers = (reg: Partial<Registration> | { name?: string; email?: string; phone?: string; responses?: Record<string, any> }) => {
  let email = String(reg.email || '').trim().toLowerCase();
  let phone = String(reg.phone || '').replace(/[^\d]/g, '');

  if (reg.responses) {
    if (!email) {
      for (const [k, v] of Object.entries(reg.responses)) {
        if ((/(email|mail)/i.test(k) || (typeof v === 'string' && v.includes('@'))) && v) {
          email = String(v).trim().toLowerCase();
          break;
        }
      }
    }
    if (!phone || phone === '9846000000' || phone === '9876543210') {
      for (const [k, v] of Object.entries(reg.responses)) {
        if (/(phone|mobile|contact|whatsapp|tel|cell)/i.test(k) && v) {
          const digits = String(v).replace(/[^\d]/g, '');
          if (digits.length >= 7) {
            phone = digits;
            break;
          }
        }
      }
    }
  }

  const phoneLast10 = phone.length >= 10 ? phone.slice(-10) : phone;
  return { email, phone, phoneLast10 };
};

export const deduplicateRegistrationsList = (list: Registration[]): Registration[] => {
  const seen = new Set<string>();
  const result: Registration[] = [];

  for (const reg of list) {
    const eventId = String(reg.event_id || '').toLowerCase();
    const { email } = extractRegistrationIdentifiers(reg);

    let isDuplicate = false;
    if (email && email !== 'attendee@example.com' && email !== 'attendee@acadeno.in') {
      const emailKey = `${eventId}::email::${email}`;
      if (seen.has(emailKey)) {
        isDuplicate = true;
      } else {
        seen.add(emailKey);
      }
    }

    if (!isDuplicate) {
      result.push(reg);
    }
  }

  return result;
};

interface EventContextType {
  currentScreen: ScreenId;
  setScreen: (screen: ScreenId) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  selectedRegistrationId: string | null;
  setSelectedRegistrationId: (id: string | null) => void;
  organization: Organization;
  events: Event[];
  registrations: Registration[];
  users: User[];
  auditLogs: AuditLog[];
  isEventLoading: boolean;
  
  // Active event helper
  selectedEvent: Event | undefined;
  selectedRegistration: Registration | undefined;
  eventRegistrations: Registration[];
  
  // Wizard state
  wizardDraft: Partial<Event>;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  updateWizardDraft: (updates: Partial<Event>) => void;
  startNewEventWizard: () => void;
  editExistingEventInWizard: (eventId: string, startStep?: number) => void;
  saveWizardDraft: () => Promise<Event>;
  publishWizardEvent: () => Promise<Event>;
  
  // Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  submitRegistration: (eventId: string, formData: { name: string; email: string; phone: string; responses: Record<string, any>; source?: string }) => Promise<Registration>;
  updateRegistration: (regId: string, updates: Partial<Registration>) => Promise<void>;
  deleteRegistration: (regId: string) => Promise<void>;
  cleanDuplicateRegistrations: () => Promise<number>;
  inviteUser: (name: string, email: string, role: UserRole, department?: string, password?: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  resetToDefaults: () => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('event') || params.get('e') || params.get('event_id')) {
        return '15_public_registration';
      }
      if (params.get('code') || params.get('ticket') || params.get('reg')) {
        return '16_registration_success';
      }
      const screenParam = params.get('screen') as ScreenId | null;
      if (screenParam) return screenParam;

      // If user has an active session, restore last screen or go to dashboard
      const savedUser = localStorage.getItem('acadeno_session_user');
      const savedScreen = localStorage.getItem('acadeno_current_screen') as ScreenId | null;
      if (savedUser) {
        if (savedScreen && savedScreen !== '01_login') {
          return savedScreen;
        }
        return '02_dashboard';
      }
    }
    return '01_login';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('acadeno_session_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.role) return parsed.role;
        }
      } catch {
        // ignore storage error
      }
    }
    return 'super_admin';
  });

  const [users, setUsers] = useState<User[]>(initialUsers);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('acadeno_session_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) return parsed;
        }
      } catch (err) {
        console.warn('Failed to restore user session:', err);
      }
    }
    return null;
  });

  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  
  // Initialize events from local storage cache first for instant zero-latency loading
  const [events, setEvents] = useState<Event[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('acadeno_events');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.warn('Failed to parse cached events:', err);
      }
    }
    return [];
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('acadeno_registrations');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return deduplicateRegistrationsList(parsed);
          }
        }
      } catch {
        // ignore storage error
      }
    }
    return [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [isEventLoading, setIsEventLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hasEventParam = params.get('event') || params.get('e') || params.get('event_id') || params.get('slug') || params.get('name');
      if (hasEventParam) {
        try {
          const cached = localStorage.getItem('acadeno_events');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && findMatchingEvent(parsed, hasEventParam)) {
              return false;
            }
          }
        } catch {}
        return true;
      }
    }
    return false;
  });

  // Sync session user to local storage for persistent login session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('acadeno_session_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('acadeno_session_user');
      }
    }
  }, [currentUser]);

  // Persist events to local storage whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined' && events.length > 0) {
      try {
        localStorage.setItem('acadeno_events', JSON.stringify(events));
      } catch (err) {
        console.warn('Failed to cache events in localStorage:', err);
      }
    }
  }, [events]);

  // Persist registrations to local storage whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined' && registrations.length > 0) {
      try {
        localStorage.setItem('acadeno_registrations', JSON.stringify(registrations));
      } catch {
        // ignore storage error
      }
    }
  }, [registrations]);

  // Wizard state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardDraft, setWizardDraft] = useState<Partial<Event>>(() => {
    return {
      name: '',
      slug: '',
      short_description: '',
      banner_url: '',
      venue: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      start_time: '10:00 AM',
      end_time: '1:00 PM',
      status: 'draft',
      form_schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1 },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2 },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3 },
      ],
      theme: themePresets.workshop,
      settings: {
        registration_opens_at: new Date().toISOString(),
        registration_closes_at: '',
        max_registrations: 100,
        require_payment: false,
        after_registration: 'ticket',
        send_email_confirmation: true,
        send_whatsapp_confirmation: true,
        send_sms_confirmation: false,
        allow_excel_export: true,
        require_consent: true,
        consent_text: 'I agree to receive event notifications under India DPDP Act 2023 regulations.'
      }
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Pure database sync polling with Neon / Supabase Postgres
  useEffect(() => {
    let isMounted = true;

    const syncWithCloud = async () => {
      try {
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const eventSlugParam = urlParams ? (urlParams.get('event') || urlParams.get('e') || urlParams.get('event_id') || urlParams.get('slug')) : null;
        const titleParam = urlParams ? (urlParams.get('name') || urlParams.get('title')) : null;

        // Fast high-priority single event lookup if direct event URL requested
        if (eventSlugParam || titleParam) {
          fetchRemoteEventBySlug(eventSlugParam || titleParam || '').then(res => {
            if (!isMounted) return;
            if (res.data) {
              const matchedEvt = res.data;
              setEvents(prev => {
                const idx = prev.findIndex(e => e.id === matchedEvt.id || matchesEvent(e, matchedEvt.slug));
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = matchedEvt;
                  return updated;
                }
                return [matchedEvt, ...prev];
              });
              setSelectedEventId(matchedEvt.id);
              setIsEventLoading(false);
            }
          }).catch(e => console.warn('Fast slug fetch notice:', e));
        }

        const [evtsRes, regsRes, usersRes] = await Promise.all([
          fetchRemoteEvents(),
          fetchRemoteRegistrations(),
          fetchRemoteUsers(),
        ]);

        if (!isMounted) return;

        if (evtsRes.error) {
          console.warn('[Cloud Sync Poll - Events]:', evtsRes.error);
        } else if (Array.isArray(evtsRes.data)) {
          const remoteEvents = evtsRes.data;
          const hasUrlEvent = urlParams && (eventSlugParam || titleParam || urlParams.get('d') || urlParams.get('data'));
          
          let merged = remoteEvents.map(remote => {
            const localMatch = events.find(l => l.id === remote.id || matchesEvent(l, remote.slug) || matchesEvent(l, remote.name));
            if (localMatch && localMatch.banner_url && !remote.banner_url) {
              return {
                ...remote,
                banner_url: localMatch.banner_url,
                theme: {
                  ...(remote.theme || {}),
                  banner_url: localMatch.banner_url
                }
              };
            }
            return remote;
          });

          // Also include any locally created events not yet in remote list
          for (const local of events) {
            if (!merged.some(m => m.id === local.id || matchesEvent(m, local.slug))) {
              merged.push(local);
            }
          }

          if (hasUrlEvent) {
            const query = eventSlugParam || titleParam;
            const matched = findMatchingEvent(merged, query);
            if (matched) {
              setSelectedEventId(matched.id);
              setIsEventLoading(false);
            } else {
              const decoded = decodeEventFromUrlParams(urlParams, organization.id, merged);
              if (decoded) {
                const existing = findMatchingEvent(merged, decoded.id) || findMatchingEvent(merged, decoded.slug);
                if (existing) {
                  setSelectedEventId(existing.id);
                } else {
                  merged = [decoded, ...merged];
                  setSelectedEventId(decoded.id);
                }
              }
              setIsEventLoading(false);
            }
          } else {
            setIsEventLoading(false);
          }

          setEvents(merged);
        }

        if (regsRes.error) {
          console.warn('[Cloud Sync Poll - Registrations]:', regsRes.error);
        } else if (Array.isArray(regsRes.data)) {
          const dedupedRemote = deduplicateRegistrationsList(regsRes.data);
          setRegistrations(dedupedRemote);
        }

        if (usersRes.error) {
          console.warn('[Cloud Sync Poll - Users]:', usersRes.error);
        } else if (Array.isArray(usersRes.data) && usersRes.data.length > 0) {
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.warn('Database polling warning:', err);
      }
    };

    syncWithCloud();
    const interval = setInterval(syncWithCloud, 4000); // 4s real-time auto-sync

    const handleFocus = () => syncWithCloud();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [organization.id]);

  // Read URL search params on mount or popstate (?event=slug or ?name=... or ?code=regCode)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUrlRoute = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const eventParam = params.get('event') || params.get('e') || params.get('event_id') || params.get('slug');
        const nameParam = params.get('name') || params.get('title');
        const codeParam = params.get('code') || params.get('ticket') || params.get('reg');
        const screenParam = params.get('screen') as ScreenId | null;

        if (codeParam) {
          let foundReg = registrations.find(r => 
            r.registration_code.toLowerCase() === codeParam.toLowerCase() || 
            r.id.toLowerCase() === codeParam.toLowerCase()
          );

          if (!foundReg) {
            const newReg: Registration = {
              id: `reg-${codeParam}`,
              event_id: selectedEventId || 'evt-demo',
              registration_code: codeParam.toUpperCase(),
              name: 'Participant Pass',
              email: 'attendee@acadeno.in',
              phone: '+91 98765 43210',
              submitted_at: new Date().toISOString(),
              status: 'confirmed',
              payment_status: 'not_required',
              attendance_status: 'not_marked',
              source: 'qr_scan',
              responses: {}
            };
            foundReg = newReg;
            setRegistrations(prev => {
              if (prev.some(r => r.registration_code.toLowerCase() === codeParam.toLowerCase())) {
                return prev;
              }
              return [newReg, ...prev];
            });
          }

          setSelectedRegistrationId(foundReg.id);
          setSelectedEventId(foundReg.event_id);
          setCurrentScreen('16_registration_success');
          return;
        }

        if (eventParam || nameParam || params.get('d') || params.get('data')) {
          const match = findMatchingEvent(events, eventParam || nameParam);
          if (match) {
            setSelectedEventId(match.id);
            setCurrentScreen(prev => {
              if (prev === '16_registration_success') return prev;
              return match.status === 'closed' ? '17_registration_closed' : '15_public_registration';
            });
            return;
          }

          const decodedEvt = decodeEventFromUrlParams(params, organization.id, events);
          if (decodedEvt) {
            setSelectedEventId(decodedEvt.id);
            setCurrentScreen(prev => {
              if (prev === '16_registration_success') return prev;
              return decodedEvt.status === 'closed' ? '17_registration_closed' : '15_public_registration';
            });
            return;
          }
        }

        if (screenParam) {
          setCurrentScreen(screenParam);
        }
      } catch (err) {
        console.error('URL params routing error:', err);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [organization.id, events]);

  // Selected event & registrations helper
  const selectedEvent = useMemo(() => {
    // 1. First priority: match URL query parameter against real events list
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const eventParam = params.get('event') || params.get('e') || params.get('event_id') || params.get('slug');
      const nameParam = params.get('name') || params.get('title');

      if (eventParam) {
        const match = findMatchingEvent(events, eventParam);
        if (match) return match;
      }
      if (nameParam) {
        const match = findMatchingEvent(events, nameParam);
        if (match) return match;
      }
    }

    // 2. Second priority: match by selectedEventId from state
    if (selectedEventId) {
      const match = findMatchingEvent(events, selectedEventId);
      if (match) return match;
    }

    // 3. Third priority: decode from URL query parameters (for offline or standalone shared links)
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('event') || params.get('name') || params.get('d') || params.get('data')) {
        const decoded = decodeEventFromUrlParams(params, organization.id, events);
        if (decoded) return decoded;
      }
    }

    // 4. Fallback to first available event in list
    return events.length > 0 ? events[0] : undefined;
  }, [events, selectedEventId, organization.id]);
  const selectedRegistration = registrations.find(r => r.id === selectedRegistrationId) || (registrations.length > 0 ? registrations[0] : undefined);
  const eventRegistrations = selectedEvent ? registrations.filter(r => r.event_id === selectedEvent.id) : registrations;

  const setScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (typeof window !== 'undefined' && screen !== '01_login') {
      localStorage.setItem('acadeno_current_screen', screen);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const matchedUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchedUser);
    showToast(`Switched role to: ${role.replace('_', ' ').toUpperCase()}`);
  };

  const login = async (
    email: string, 
    passwordInput?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (passwordInput || '').trim();

    // 1. Authenticate via Neon API
    try {
      const { data, error } = await loginRemote(cleanEmail, cleanPassword);
      if (data && data.ok && data.user) {
        const loggedInUser: User = data.user;
        setCurrentUser(loggedInUser);
        setCurrentRole(loggedInUser.role);
        setUsers(prev => {
          const exists = prev.some(u => u.id === loggedInUser.id || u.email.toLowerCase() === cleanEmail);
          if (!exists) return [...prev, loggedInUser];
          return prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, ...loggedInUser } : u);
        });
        setScreen('02_dashboard');
        showToast(`Welcome back, ${loggedInUser.name}!`);
        return { success: true };
      }

      if (error) {
        const errMsg = error.message || 'Invalid credentials. Access is restricted to authorized administrators and assigned staff.';
        showToast(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (apiErr) {
      console.warn('Neon remote login check fallback:', apiErr);
    }

    // 2. Strict client-side verification against authorized users only
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      const errMsg = 'Invalid email or password. Access is restricted to authorized administrators and assigned staff.';
      showToast(errMsg);
      return { success: false, error: errMsg };
    }

    if (user.status === 'disabled') {
      const errMsg = 'Your account has been deactivated. Please contact your Super Admin.';
      showToast(errMsg);
      return { success: false, error: errMsg };
    }

    const expectedPassword = user.password || 'Acadeno2026!';
    if (cleanPassword && cleanPassword !== expectedPassword) {
      const errMsg = 'Incorrect password. Please verify your credentials.';
      showToast(errMsg);
      return { success: false, error: errMsg };
    }

    setCurrentUser(user);
    setCurrentRole(user.role);
    setScreen('02_dashboard');
    showToast(`Welcome back, ${user.name}!`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('acadeno_session_user');
      localStorage.removeItem('acadeno_current_screen');
    }
    setScreen('01_login');
    showToast('Logged out successfully');
  };

  const startNewEventWizard = () => {
    setWizardStep(1);
    const newId = generateUUID();
    setWizardDraft({
      id: newId,
      org_id: organization.id,
      name: '',
      slug: '',
      short_description: '',
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      venue: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      start_time: '10:00 AM',
      end_time: '1:00 PM',
      status: 'draft',
      views_count: 0,
      created_by: currentUser?.id || 'd79ebd86-73b7-4f55-9108-cdda19919cf0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      form_schema: [
        { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, section: 'Personal Info' },
        { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, section: 'Personal Info' },
        { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, section: 'Personal Info' },
      ],
      theme: themePresets.workshop,
      settings: {
        registration_opens_at: new Date().toISOString(),
        registration_closes_at: '',
        max_registrations: 100,
        require_payment: false,
        after_registration: 'ticket',
        send_email_confirmation: true,
        send_whatsapp_confirmation: true,
        send_sms_confirmation: false,
        allow_excel_export: true,
        require_consent: true,
        consent_text: 'I agree to receive event notifications under India DPDP Act 2023 regulations.'
      }
    });
    setScreen('04_create_basic');
  };

  const editExistingEventInWizard = (eventId: string, startStep: number = 1) => {
    const existing = events.find(e => e.id === eventId);
    if (existing) {
      setWizardDraft({ ...existing });
      setWizardStep(startStep);
      setSelectedEventId(eventId);
      const stepScreens: Record<number, ScreenId> = {
        1: '04_create_basic',
        2: '05_create_form',
        3: '06_create_theme',
        4: '07_create_settings',
        5: '08_create_preview',
      };
      setScreen(stepScreens[startStep] || '04_create_basic');
    }
  };

  const updateWizardDraft = (updates: Partial<Event>) => {
    setWizardDraft(prev => {
      const banner = updates.banner_url !== undefined ? updates.banner_url : prev.banner_url;
      const theme = updates.theme 
        ? { ...updates.theme, ...(banner ? { banner_url: banner } : {}) } 
        : (prev.theme ? { ...prev.theme, ...(banner ? { banner_url: banner } : {}) } : undefined);

      return {
        ...prev,
        ...updates,
        ...(banner !== undefined ? { banner_url: banner } : {}),
        ...(theme ? { theme } : {}),
        updated_at: new Date().toISOString(),
      };
    });
  };

  const saveWizardDraft = async (): Promise<Event> => {
    const draftId = (wizardDraft.id && wizardDraft.id.length > 20 && !wizardDraft.id.startsWith('evt-')) 
      ? wizardDraft.id 
      : generateUUID();
    let cleanSlug = wizardDraft.slug?.trim().toLowerCase() || '';
    if (!cleanSlug || cleanSlug.length <= 1) {
      cleanSlug = wizardDraft.name 
        ? wizardDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        : `event-${Date.now()}`;
    }
    
    const finalized: Event = {
      id: draftId,
      org_id: organization.id,
      name: wizardDraft.name || 'Untitled Event (Draft)',
      slug: cleanSlug,
      short_description: wizardDraft.short_description || '',
      banner_url: wizardDraft.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      venue: wizardDraft.venue || '',
      start_date: wizardDraft.start_date || new Date().toISOString().split('T')[0],
      end_date: wizardDraft.end_date || new Date().toISOString().split('T')[0],
      start_time: wizardDraft.start_time || '10:00 AM',
      end_time: wizardDraft.end_time || '1:00 PM',
      status: 'draft',
      created_by: currentUser?.id || 'd79ebd86-73b7-4f55-9108-cdda19919cf0',
      created_at: wizardDraft.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: wizardDraft.views_count || 0,
      form_schema: wizardDraft.form_schema || [],
      theme: wizardDraft.theme || themePresets.workshop,
      settings: wizardDraft.settings || {
        max_registrations: 100,
        require_payment: false,
        after_registration: 'ticket',
        send_email_confirmation: true,
        send_whatsapp_confirmation: true,
        send_sms_confirmation: false,
        allow_excel_export: true,
        require_consent: true,
        consent_text: 'I agree to the terms.'
      }
    };

    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === finalized.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = finalized;
        return copy;
      }
      return [finalized, ...prev];
    });

    setSelectedEventId(finalized.id);
    setScreen('03_events_list');

    // Await cloud sync and check for failure
    const { error } = await syncEventToCloud(finalized);
    if (error) {
      console.error('[Neon Sync Error - Draft]:', error);
      showToast(`⚠️ Neon save failed: ${error.message || 'Database error'}. Saved to local cache.`);
    } else {
      showToast('Draft saved to Neon successfully');
    }

    return finalized;
  };

  const publishWizardEvent = async (): Promise<Event> => {
    const draftId = (wizardDraft.id && wizardDraft.id.length > 20 && !wizardDraft.id.startsWith('evt-')) 
      ? wizardDraft.id 
      : generateUUID();
    let cleanSlug = wizardDraft.slug?.trim().toLowerCase() || '';
    if (!cleanSlug || cleanSlug.length <= 1) {
      cleanSlug = wizardDraft.name 
        ? wizardDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        : `event-${Date.now()}`;
    }

    const publishedEvent: Event = {
      id: draftId,
      org_id: organization.id,
      name: wizardDraft.name || 'New Published Event',
      slug: cleanSlug,
      short_description: wizardDraft.short_description || '',
      banner_url: wizardDraft.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      venue: wizardDraft.venue || 'Virtual / Online',
      start_date: wizardDraft.start_date || new Date().toISOString().split('T')[0],
      end_date: wizardDraft.end_date || new Date().toISOString().split('T')[0],
      start_time: wizardDraft.start_time || '10:00 AM',
      end_time: wizardDraft.end_time || '1:00 PM',
      status: 'active',
      created_by: currentUser?.id || 'd79ebd86-73b7-4f55-9108-cdda19919cf0',
      created_at: wizardDraft.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: wizardDraft.views_count || 1,
      form_schema: wizardDraft.form_schema || [],
      theme: {
        ...(wizardDraft.theme || themePresets.workshop),
        banner_url: wizardDraft.banner_url || wizardDraft.theme?.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      },
      settings: wizardDraft.settings || {
        max_registrations: 100,
        require_payment: false,
        after_registration: 'ticket',
        send_email_confirmation: true,
        send_whatsapp_confirmation: true,
        send_sms_confirmation: false,
        allow_excel_export: true,
        require_consent: true,
        consent_text: 'I agree.'
      }
    };

    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === publishedEvent.id || e.slug.toLowerCase() === publishedEvent.slug.toLowerCase());
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = publishedEvent;
        return copy;
      }
      return [publishedEvent, ...prev];
    });

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      org_id: organization.id,
      user_id: currentUser?.id || 'd79ebd86-73b7-4f55-9108-cdda19919cf0',
      user_name: currentUser?.name || 'Super Admin',
      action: 'event.published',
      entity_type: 'event',
      entity_id: publishedEvent.id,
      metadata: { name: publishedEvent.name, slug: publishedEvent.slug },
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSelectedEventId(publishedEvent.id);
    setScreen('09_publish_confirm');
    
    // Await cloud sync and check for failure
    const { error } = await syncEventToCloud(publishedEvent);
    if (error) {
      console.error('[Neon Sync Error - Publish]:', error);
      showToast(`⚠️ Neon save failed: ${error.message || 'Database error'}. Saved to local cache.`);
    } else {
      showToast(`🎉 "${publishedEvent.name}" is published and saved to Neon.`);
    }
    
    return publishedEvent;
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<void> => {
    let updatedEvt: Event | undefined;
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        updatedEvt = { ...e, ...updates, updated_at: new Date().toISOString() };
        return updatedEvt;
      }
      return e;
    }));
    if (updatedEvt) {
      const { error } = await syncEventToCloud(updatedEvt);
      if (error) {
        console.error('[Neon Sync Error - Update]:', error);
        showToast(`⚠️ Neon update failed: ${error.message || 'Database error'}. Updated locally.`);
      } else {
        showToast('Event updated in Neon');
      }
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegistrations(prev => prev.filter(r => r.event_id !== eventId));
    const { error } = await deleteEventFromCloud(eventId);
    if (error) {
      console.error('[Neon Sync Error - Delete]:', error);
      showToast(`⚠️ Neon deletion failed: ${error.message || 'Database error'}`);
    } else {
      showToast('Event deleted from Neon');
    }
    return true;
  };

  const submitRegistration = async (
    eventId: string,
    formData: { name: string; email: string; phone: string; responses: Record<string, any>; source?: string }
  ): Promise<Registration> => {
    let targetEvt = events.find(e => e.id === eventId || e.slug === eventId);
    if (!targetEvt && selectedEvent) {
      targetEvt = selectedEvent;
    }

    const finalEventId = targetEvt?.id && isValidUUID(targetEvt.id)
      ? targetEvt.id
      : ensureValidUUID(eventId, targetEvt?.slug || targetEvt?.name);

    if (targetEvt && targetEvt.id !== finalEventId) {
      targetEvt = { ...targetEvt, id: finalEventId };
    }

    // --- Deduplication Check (Strictly Email per Event) ---
    const inputEmail = String(formData.email || '').trim().toLowerCase();

    const existingReg = inputEmail ? registrations.find(r => {
      const isSameEvent = r.event_id === finalEventId || r.event_id === eventId;
      if (!isSameEvent) return false;

      const rIdentifiers = extractRegistrationIdentifiers(r);
      return rIdentifiers.email && inputEmail === rIdentifiers.email;
    }) : null;

    if (existingReg) {
      const err: any = new Error(`The email "${formData.email}" is already registered for this event.`);
      err.code = 'ALREADY_REGISTERED';
      err.existingRegistration = existingReg;
      throw err;
    }

    const prefix = targetEvt?.name
      ? targetEvt.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3)
      : 'EPR';
    
    const eventRegs = registrations.filter(r => r.event_id === finalEventId || r.event_id === eventId);
    let maxSeq = 0;
    for (const r of eventRegs) {
      const match = String(r.registration_code || '').match(/-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSeq) maxSeq = num;
      }
    }
    const nextNum = Math.max(maxSeq + 1, eventRegs.length + 1);
    const seq = String(nextNum).padStart(5, '0');
    const year = new Date().getFullYear();
    const regCode = `${prefix}-${year}-${seq}`;

    const newReg: Registration = {
      id: generateUUID(),
      event_id: finalEventId,
      registration_code: regCode,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      responses: formData.responses,
      status: 'confirmed',
      payment_status: targetEvt?.settings?.require_payment ? 'paid' : 'not_required',
      attendance_status: 'not_marked',
      source: formData.source || 'direct',
      ip_address: '103.115.196.42',
      submitted_at: new Date().toISOString(),
    };

    // Await cloud sync for database consistency and duplicate prevention
    const cloudRes = await syncRegistrationToCloud(newReg, targetEvt);
    if (cloudRes.error) {
      const err: any = cloudRes.error;
      if (err.code === 'ALREADY_REGISTERED' || (err.message && err.message.toLowerCase().includes('already registered'))) {
        err.code = 'ALREADY_REGISTERED';
        throw err;
      }
      console.warn('[Cloud Sync Notice]:', cloudRes.error);
    }

    const finalReg = (cloudRes.data && cloudRes.data.id) ? { ...newReg, ...cloudRes.data } : newReg;

    setRegistrations(prev => [finalReg, ...prev.filter(r => r.id !== finalReg.id)]);
    setSelectedRegistrationId(finalReg.id);

    setEvents(prev => prev.map(e => {
      if (e.id === finalEventId || e.id === eventId) {
        return { ...e, views_count: (e.views_count || 0) + 1 };
      }
      return e;
    }));

    return finalReg;
  };

  const updateRegistration = async (regId: string, updates: Partial<Registration>): Promise<void> => {
    let updatedReg: Registration | undefined;
    setRegistrations(prev => prev.map(r => {
      if (r.id === regId) {
        updatedReg = { ...r, ...updates };
        return updatedReg;
      }
      return r;
    }));

    if (updatedReg) {
      const { error } = await syncRegistrationToCloud(updatedReg);
      if (error) {
        console.error('[Neon Registration Update Sync Error]:', error);
        showToast(`⚠️ Neon update failed: ${error.message || 'Database error'}`);
      } else {
        showToast('Registration updated in Neon');
      }
    }
  };

  const deleteRegistration = async (regId: string): Promise<void> => {
    setRegistrations(prev => prev.filter(r => r.id !== regId));
    const { error } = await deleteRegistrationFromCloud(regId);
    if (error) {
      console.error('[Neon Registration Delete Sync Error]:', error);
      showToast(`⚠️ Neon delete failed: ${error.message || 'Database error'}`);
    } else {
      showToast('Registration deleted from Neon');
    }
  };

  const cleanDuplicateRegistrations = async (): Promise<number> => {
    const deduped = deduplicateRegistrationsList(registrations);
    const removedCount = registrations.length - deduped.length;
    
    if (removedCount > 0) {
      const dedupedIds = new Set(deduped.map(r => r.id));
      const toDelete = registrations.filter(r => !dedupedIds.has(r.id));
      
      setRegistrations(deduped);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('acadeno_registrations', JSON.stringify(deduped));
        } catch {
          // ignore
        }
      }
      
      // Delete redundant duplicate records from cloud database in background
      for (const item of toDelete) {
        if (item.id) {
          deleteRegistrationFromCloud(item.id).catch(e => console.warn('Cloud duplicate delete notice:', e));
        }
      }
      showToast(`Cleaned ${removedCount} duplicate registration${removedCount > 1 ? 's' : ''}`);
    } else {
      showToast('All registrations are unique! No duplicates found.');
    }
    return removedCount;
  };

  const inviteUser = async (
    name: string, 
    email: string, 
    role: UserRole, 
    department?: string,
    password?: string
  ) => {
    const tempPassword = password || 'Acadeno2026!';
    const cleanEmail = email.trim().toLowerCase();
    const newUser: User = {
      id: generateUUID(),
      org_id: organization.id,
      name: name.trim(),
      email: cleanEmail,
      role,
      status: 'active',
      department: department || (role === 'super_admin' ? 'Executive Administration' : 'Operations'),
      password: tempPassword,
      created_at: new Date().toISOString()
    };
    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== cleanEmail);
      return [...filtered, newUser];
    });
    showToast(`Staff member "${name}" created with password: ${tempPassword}`);

    // Persist to Neon Postgres
    const { error } = await syncUserToCloud(newUser);
    if (error) {
      console.error('[Neon User Sync Error]:', error);
      showToast(`⚠️ Neon user save failed: ${error.message || 'Database error'}`);
    } else {
      showToast(`Staff member "${name}" saved to Neon database.`);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    let updatedUser: User | undefined;
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        updatedUser = { ...u, role };
        return updatedUser;
      }
      return u;
    }));
    if (updatedUser) {
      showToast(`User role updated to: ${role.replace('_', ' ').toUpperCase()}`);
      await syncUserToCloud(updatedUser);
    }
  };

  const deleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    const { error } = await deleteUserFromCloud(userId);
    if (error) {
      console.error('[Neon User Delete Error]:', error);
      showToast(`⚠️ Neon user deletion failed: ${error.message || 'Database error'}`);
    } else {
      showToast('Staff member removed from Neon database');
    }
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setOrganization(initialOrganization);
    setEvents([]);
    setRegistrations([]);
    setAuditLogs([]);
    setSelectedEventId('');
    setSelectedRegistrationId(null);
    setCurrentScreen('02_dashboard');
    showToast('Clean fresh database state initialized');
  };

  return (
    <EventContext.Provider
      value={{
        currentScreen,
        setScreen,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole: handleRoleChange,
        selectedEventId,
        setSelectedEventId,
        selectedRegistrationId,
        setSelectedRegistrationId,
        organization,
        events,
        registrations,
        users,
        auditLogs,
        isEventLoading,
        selectedEvent,
        selectedRegistration,
        eventRegistrations,
        wizardDraft,
        wizardStep,
        setWizardStep,
        updateWizardDraft,
        startNewEventWizard,
        editExistingEventInWizard,
        saveWizardDraft,
        publishWizardEvent,
        login,
        logout,
        updateEvent,
        deleteEvent,
        submitRegistration,
        updateRegistration,
        deleteRegistration,
        cleanDuplicateRegistrations,
        inviteUser,
        updateUserRole,
        deleteUser,
        resetToDefaults,
        toastMessage,
        showToast
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventStore = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventStore must be used within an EventProvider');
  }
  return context;
};
