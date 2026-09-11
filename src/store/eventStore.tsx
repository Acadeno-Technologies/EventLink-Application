import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { decodeEventFromUrlParams } from '../utils/eventShareUtils';
import { 
  syncEventToCloud, 
  syncRegistrationToCloud, 
  fetchRemoteEvents, 
  fetchRemoteRegistrations,
  deleteEventFromCloud,
  deleteRegistrationFromCloud,
  generateUUID
} from '../utils/supabaseClient';

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
  login: (email: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  submitRegistration: (eventId: string, formData: { name: string; email: string; phone: string; responses: Record<string, any>; source?: string }) => Promise<Registration>;
  updateRegistration: (regId: string, updates: Partial<Registration>) => Promise<void>;
  deleteRegistration: (regId: string) => Promise<void>;
  inviteUser: (name: string, email: string, role: UserRole, department?: string, password?: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  resetToDefaults: () => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Purge any legacy localStorage data from previous runs to guarantee clean state
if (typeof window !== 'undefined') {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('acadeno_') && !k.startsWith('acadeno_v4_clean_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Storage purge error:', e);
  }
}

const STORAGE_KEY_PREFIX = 'acadeno_v4_clean_';

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
    }
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}screen`) as ScreenId) || '01_login';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem(`${STORAGE_KEY_PREFIX}role`) as UserRole) || 'super_admin';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth_user`);
      if (savedAuth) {
        try {
          return JSON.parse(savedAuth);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [organization, setOrganization] = useState<Organization>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}org`);
    return saved ? JSON.parse(saved) : initialOrganization;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}events`);
    return saved ? JSON.parse(saved) : [];
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}registrations`);
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}selected_event`) || '';
  });

  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}selected_reg`) || null;
  });

  // Wizard state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardDraft, setWizardDraft] = useState<Partial<Event>>(() => {
    return {
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}screen`, currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}registrations`, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (selectedEventId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}selected_event`, selectedEventId);
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (selectedRegistrationId) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}selected_reg`, selectedRegistrationId);
    }
  }, [selectedRegistrationId]);

  // Cloud sync fetch on mount and periodic polling to stay in sync across devices
  useEffect(() => {
    let isMounted = true;

    const syncWithCloud = async () => {
      try {
        const [evtsRes, regsRes] = await Promise.all([
          fetchRemoteEvents(),
          fetchRemoteRegistrations()
        ]);

        if (!isMounted) return;

        if (evtsRes.error) {
          console.warn('[Supabase Cloud Sync Poll Notice - Events]:', evtsRes.error);
        } else if (evtsRes.data) {
          setEvents(prev => {
            const map = new Map<string, Event>();
            // Keep existing local events
            prev.forEach(e => map.set(e.id, e));
            // Overwrite/merge with remote database events
            evtsRes.data!.forEach(re => map.set(re.id, { ...(map.get(re.id) || {}), ...re }));
            return Array.from(map.values());
          });
        }

        if (regsRes.error) {
          console.warn('[Supabase Cloud Sync Poll Notice - Registrations]:', regsRes.error);
        } else if (regsRes.data) {
          setRegistrations(prev => {
            const map = new Map<string, Registration>();
            prev.forEach(r => map.set(r.id, r));
            regsRes.data!.forEach(rr => map.set(rr.id, { ...(map.get(rr.id) || {}), ...rr }));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Cloud sync interval warning:', err);
      }
    };

    syncWithCloud();
    const interval = setInterval(syncWithCloud, 6000); // 6s real-time auto-sync

    const handleFocus = () => syncWithCloud();
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Read URL search params on mount or popstate (?event=slug or ?code=regCode)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUrlRoute = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const eventParam = params.get('event') || params.get('e') || params.get('event_id');
        const codeParam = params.get('code') || params.get('ticket') || params.get('reg');
        const screenParam = params.get('screen') as ScreenId | null;

        if (codeParam) {
          const currentRegs: Registration[] = (() => {
            const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}registrations`);
            return saved ? JSON.parse(saved) : [];
          })();

          let foundReg = currentRegs.find(r => 
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

        if (eventParam || params.get('d') || params.get('data')) {
          const currentEvts: Event[] = (() => {
            const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}events`);
            return saved ? JSON.parse(saved) : [];
          })();

          let foundEvt = currentEvts.find(e => 
            (eventParam && e.slug.toLowerCase() === eventParam.toLowerCase()) || 
            (eventParam && e.id === eventParam) || 
            (eventParam && e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === eventParam.toLowerCase())
          );

          // Decode rich payload or URL parameters
          const decodedEvt = decodeEventFromUrlParams(params, organization.id);

          if (decodedEvt) {
            foundEvt = decodedEvt;
            setEvents(prev => {
              const exists = prev.some(e => e.id === decodedEvt.id || e.slug === decodedEvt.slug);
              if (!exists) {
                return [decodedEvt, ...prev];
              }
              return prev.map(e => (e.id === decodedEvt.id || e.slug === decodedEvt.slug) ? { ...e, ...decodedEvt } : e);
            });
          }

          if (foundEvt) {
            setSelectedEventId(foundEvt.id);
            setCurrentScreen(prev => {
              // Don't override if user is already viewing registration success
              if (prev === '16_registration_success') return prev;
              return foundEvt!.status === 'closed' ? '17_registration_closed' : '15_public_registration';
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
  }, [organization.id, selectedEventId]);

  // Selected event & registrations helper
  const selectedEvent = events.find(e => e.id === selectedEventId) || (events.length > 0 ? events[0] : undefined);
  const selectedRegistration = registrations.find(r => r.id === selectedRegistrationId) || (registrations.length > 0 ? registrations[0] : undefined);
  const eventRegistrations = selectedEvent ? registrations.filter(r => r.event_id === selectedEvent.id) : registrations;

  const setScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const matchedUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchedUser);
    showToast(`Switched role to: ${role.replace('_', ' ').toUpperCase()}`);
  };

  const login = (email: string, passwordInput?: string, role?: UserRole) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (passwordInput && user.password && user.password !== passwordInput) {
        showToast('Incorrect password. Please verify your credentials.');
        return false;
      }
      setCurrentUser(user);
      setCurrentRole(user.role);
      setScreen('02_dashboard');
      showToast(`Welcome back, ${user.name}!`);
      return true;
    } else {
      const fallbackRole = role || 'super_admin';
      const newUser: User = {
        id: `user-${Date.now()}`,
        org_id: organization.id,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        password: passwordInput || 'Acadeno2026!',
        role: fallbackRole,
        status: 'active',
        department: 'Operations',
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      setCurrentRole(fallbackRole);
      setScreen('02_dashboard');
      showToast(`Logged in as ${newUser.name}`);
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
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
    setWizardDraft(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const saveWizardDraft = async (): Promise<Event> => {
    const draftId = (wizardDraft.id && wizardDraft.id.length > 20 && !wizardDraft.id.startsWith('evt-')) 
      ? wizardDraft.id 
      : generateUUID();
    const cleanSlug = wizardDraft.slug || (wizardDraft.name ? wizardDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `event-${Date.now()}`);
    
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
      console.error('[Supabase Cloud Sync Error - Draft]:', error);
      showToast(`⚠️ Cloud save failed: ${error.message || 'Database error'}. Saved to local cache.`);
    } else {
      showToast('Draft saved to Cloud successfully');
    }

    return finalized;
  };

  const publishWizardEvent = async (): Promise<Event> => {
    const draftId = (wizardDraft.id && wizardDraft.id.length > 20 && !wizardDraft.id.startsWith('evt-')) 
      ? wizardDraft.id 
      : generateUUID();
    const cleanSlug = wizardDraft.slug || (wizardDraft.name ? wizardDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `event-${Date.now()}`);

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
        consent_text: 'I agree.'
      }
    };

    setEvents(prev => {
      const idx = prev.findIndex(e => e.id === publishedEvent.id);
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
      console.error('[Supabase Cloud Sync Error - Publish]:', error);
      showToast(`⚠️ Cloud save failed: ${error.message || 'Database error'}. Saved to local cache.`);
    } else {
      showToast(`🎉 "${publishedEvent.name}" is published and live in Cloud!`);
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
        console.error('[Supabase Cloud Sync Error - Update]:', error);
        showToast(`⚠️ Cloud update failed: ${error.message || 'Database error'}. Updated locally.`);
      } else {
        showToast('Event updated in Cloud');
      }
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegistrations(prev => prev.filter(r => r.event_id !== eventId));
    const { error } = await deleteEventFromCloud(eventId);
    if (error) {
      console.error('[Supabase Cloud Sync Error - Delete]:', error);
      showToast(`⚠️ Cloud deletion failed: ${error.message || 'Database error'}`);
    } else {
      showToast('Event deleted from Cloud');
    }
    return true;
  };

  const submitRegistration = async (
    eventId: string,
    formData: { name: string; email: string; phone: string; responses: Record<string, any>; source?: string }
  ): Promise<Registration> => {
    const targetEvt = events.find(e => e.id === eventId);
    const prefix = targetEvt?.name
      ? targetEvt.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3)
      : 'EVT';
    
    const seq = String(registrations.filter(r => r.event_id === eventId).length + 1).padStart(5, '0');
    const year = new Date().getFullYear();
    const regCode = `${prefix}-${year}-${seq}`;

    const newReg: Registration = {
      id: generateUUID(),
      event_id: eventId,
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

    setRegistrations(prev => [newReg, ...prev]);
    setSelectedRegistrationId(newReg.id);

    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, views_count: (e.views_count || 0) + 1 };
      }
      return e;
    }));

    // Await cloud sync for registration and handle error
    const { error } = await syncRegistrationToCloud(newReg);
    if (error) {
      console.error('[Supabase Registration Cloud Sync Error]:', error);
      showToast(`⚠️ Registration pass generated, but Cloud sync failed: ${error.message || 'Database error'}`);
    }

    return newReg;
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
        console.error('[Supabase Registration Update Cloud Sync Error]:', error);
        showToast(`⚠️ Cloud update failed: ${error.message || 'Database error'}`);
      } else {
        showToast('Registration updated in Cloud');
      }
    }
  };

  const deleteRegistration = async (regId: string): Promise<void> => {
    setRegistrations(prev => prev.filter(r => r.id !== regId));
    const { error } = await deleteRegistrationFromCloud(regId);
    if (error) {
      console.error('[Supabase Registration Delete Cloud Sync Error]:', error);
      showToast(`⚠️ Cloud delete failed: ${error.message || 'Database error'}`);
    } else {
      showToast('Registration deleted from Cloud');
    }
  };

  const inviteUser = (
    name: string, 
    email: string, 
    role: UserRole, 
    department?: string,
    password?: string
  ) => {
    const tempPassword = password || 'Acadeno2026!';
    const newUser: User = {
      id: `user-${Date.now()}`,
      org_id: organization.id,
      name,
      email,
      role,
      status: 'active',
      department: department || 'General',
      password: tempPassword,
      created_at: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Staff member "${name}" created with password: ${tempPassword}`);
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role };
      }
      return u;
    }));
    showToast('User role updated');
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
        inviteUser,
        updateUserRole,
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
