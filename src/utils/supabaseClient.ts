import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Event, Registration } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function extractProjectRef(url: string | undefined): string {
  if (!url) return 'unconfigured';
  try {
    const host = new URL(url).hostname;
    return host.split('.')[0] || 'unknown';
  } catch {
    const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/i);
    return match ? match[1] : 'unknown';
  }
}

export const SUPABASE_PROJECT_REF = extractProjectRef(supabaseUrl);
export const DEFAULT_ORG_ID = 'f56b03a9-9097-4638-8c4a-6f68227b2789';
export const DEFAULT_USER_ID = 'd79ebd86-73b7-4f55-9108-cdda19919cf0';

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  const errorMsg = `[Supabase Initialization Error] Missing required environment variables: ${missing.join(', ')}. Please configure them in your environment or render.yaml.`;
  console.error(errorMsg);
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.warn('⚠️ Supabase client running in unconfigured mode due to missing env variables.');
  }
}

// Dev-only initialization diagnostic log & startup seed health check
if (import.meta.env.DEV && supabaseUrl && supabaseAnonKey) {
  console.log(`[Supabase] Project: ${SUPABASE_PROJECT_REF} — ${supabaseUrl}`);

  // Query organizations and users for default seed rows to warn early if seed was never run
  try {
    const healthClient = createClient(supabaseUrl, supabaseAnonKey);
    Promise.all([
      healthClient.from('organizations').select('id').eq('id', DEFAULT_ORG_ID).maybeSingle(),
      healthClient.from('users').select('id').eq('id', DEFAULT_USER_ID).maybeSingle()
    ]).then(([orgRes, userRes]) => {
      const missing = [];
      if (!orgRes.data) missing.push(`Organization ("${DEFAULT_ORG_ID}")`);
      if (!userRes.data) missing.push(`User ("${DEFAULT_USER_ID}")`);

      if (missing.length > 0) {
        console.warn(
          `⚠️ [Supabase Startup Warning] Default organization/user row not found in Supabase — event publishing will fail until you run the seed script (scripts/seed-check.sql).\nMissing: ${missing.join(', ')}`
        );
      } else {
        console.log(`[Supabase Health Check] ✅ Verified default organization & super admin user seed records in database.`);
      }
    }).catch(err => {
      console.warn('[Supabase Startup Health Check Error]:', err);
    });
  } catch (err) {
    console.warn('[Supabase Startup Init Error]:', err);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const url = supabaseUrl || (typeof window !== 'undefined' ? localStorage.getItem('ACADENO_SUPABASE_URL') : null);
  const key = supabaseAnonKey || (typeof window !== 'undefined' ? localStorage.getItem('ACADENO_SUPABASE_ANON_KEY') : null);

  if (!url || !key) {
    throw new Error('Supabase client failed to initialize: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined.');
  }

  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ACADENO_SUPABASE_URL', url.trim());
    localStorage.setItem('ACADENO_SUPABASE_ANON_KEY', anonKey.trim());
  }
  supabaseInstance = null;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidUUID(str: string | undefined | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function ensureValidUUID(id: string | undefined | null, fallbackSeed?: string): string {
  if (id && isValidUUID(id)) return id;
  if (id) {
    let hash = 0;
    const str = id + (fallbackSeed || '');
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex.slice(0, 8)}-4000-8000-0000-${hex.padEnd(12, '0').slice(0, 12)}`;
  }
  return generateUUID();
}

/**
 * Formats Postgres errors (including 23503 foreign_key_violation) into clear, actionable messages.
 */
function formatPostgresError(error: any, context: 'event' | 'registration'): Error {
  if (!error) return new Error('Unknown database error');

  // Postgres Error 23503 = foreign_key_violation
  if (
    error.code === '23503' ||
    (typeof error.message === 'string' && /foreign key|23503/i.test(error.message)) ||
    (typeof error.details === 'string' && /foreign key|is not present in table/i.test(error.details))
  ) {
    if (context === 'event') {
      return new Error(
        'Organization or user record referenced by this event does not exist in the database — run the seed script (scripts/seed-check.sql).'
      );
    }
    if (context === 'registration') {
      return new Error(
        'Event record referenced by this registration does not exist in the database — please ensure the event is published to Supabase first.'
      );
    }
  }

  return new Error(error.message || error.details || 'Database operation failed');
}

/**
 * Fetch all events from Supabase Cloud with attached forms & themes.
 * Returns { data, error } directly instead of swallowing errors.
 */
export async function fetchRemoteEvents(): Promise<{ data: Event[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('events')
      .select(`
        *,
        event_forms ( schema, version ),
        event_themes ( template, colors, typography, layout, logo_url, banner_url )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase fetchRemoteEvents Error]:', error);
      return { data: null, error: formatPostgresError(error, 'event') };
    }

    if (!data) return { data: [], error: null };

    const mappedEvents: Event[] = data.map((row: any): Event => {
      const formRecord = Array.isArray(row.event_forms) ? row.event_forms[0] : row.event_forms;
      const themeRecord = Array.isArray(row.event_themes) ? row.event_themes[0] : row.event_themes;

      return {
        id: row.id,
        org_id: row.org_id || DEFAULT_ORG_ID,
        name: row.name,
        slug: row.slug,
        short_description: row.short_description || '',
        banner_url: row.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        venue: row.venue || 'Virtual / Online',
        start_date: row.start_date,
        end_date: row.end_date || row.start_date,
        start_time: row.start_time || '10:00 AM',
        end_time: row.end_time || '1:00 PM',
        status: row.status || 'active',
        created_by: row.created_by || DEFAULT_USER_ID,
        created_at: row.created_at,
        updated_at: row.updated_at || row.created_at,
        views_count: row.views_count || 1,
        form_schema: formRecord?.schema || [
          { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, placeholder: 'Enter full name' },
          { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, placeholder: 'name@gmail.com' },
          { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, placeholder: '+91 98765 43210' },
        ],
        theme: themeRecord || {
          template: 'workshop',
          colors: { primary: '#2563EB', background: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', button: '#FF7A00', buttonText: '#FFFFFF' },
          typography: { fontFamily: 'Plus Jakarta Sans', headingSize: 'lg', bodySize: 'md' },
          layout: 'centered'
        },
        settings: {
          registration_opens_at: row.registration_opens_at || row.created_at,
          registration_closes_at: row.registration_closes_at || '',
          max_registrations: row.max_registrations || 100,
          require_payment: !!row.require_payment,
          payment_amount: row.payment_amount ? Number(row.payment_amount) : undefined,
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

    return { data: mappedEvents, error: null };
  } catch (err: any) {
    console.error('[Supabase fetchRemoteEvents Exception]:', err);
    return { data: null, error: err };
  }
}

/**
 * Save / Upsert an event and its associated form & theme to Supabase Cloud.
 * Returns { data, error } directly instead of swallowing errors.
 */
export async function syncEventToCloud(event: Event): Promise<{ data: Event | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const eventUuid = isValidUUID(event.id) ? event.id : generateUUID();
    const orgUuid = isValidUUID(event.org_id) ? event.org_id : DEFAULT_ORG_ID;
    const userUuid = isValidUUID(event.created_by) ? event.created_by : DEFAULT_USER_ID;

    // 1. Upsert parent Event row
    const { error: eventError } = await client
      .from('events')
      .upsert({
        id: eventUuid,
        org_id: orgUuid,
        name: event.name || 'Untitled Event',
        slug: event.slug || `event-${Date.now()}`,
        short_description: event.short_description || '',
        banner_url: event.banner_url || null,
        venue: event.venue || 'Virtual / Online',
        start_date: event.start_date || new Date().toISOString().split('T')[0],
        end_date: event.end_date || event.start_date || new Date().toISOString().split('T')[0],
        start_time: event.start_time || '10:00 AM',
        end_time: event.end_time || '1:00 PM',
        status: event.status || 'active',
        max_registrations: event.settings?.max_registrations || 100,
        require_payment: !!event.settings?.require_payment,
        payment_amount: event.settings?.require_payment ? 499 : null,
        created_by: userUuid,
        created_at: event.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (eventError) {
      const formattedErr = formatPostgresError(eventError, 'event');
      console.error('[Supabase syncEventToCloud Error]:', formattedErr.message, eventError);
      return { data: null, error: formattedErr };
    }

    // 2. Upsert child EventForm
    if (event.form_schema && Array.isArray(event.form_schema)) {
      const { error: formError } = await client
        .from('event_forms')
        .upsert({
          id: generateUUID(),
          event_id: eventUuid,
          schema: event.form_schema,
          version: 1,
          updated_at: new Date().toISOString()
        }, { onConflict: 'event_id' });

      if (formError) {
        const formattedErr = formatPostgresError(formError, 'event');
        console.error('[Supabase syncEventToCloud Form Error]:', formattedErr.message, formError);
        return { data: null, error: formattedErr };
      }
    }

    // 3. Upsert child EventTheme
    if (event.theme) {
      const { error: themeError } = await client
        .from('event_themes')
        .upsert({
          id: generateUUID(),
          event_id: eventUuid,
          template: event.theme.template || 'workshop',
          colors: event.theme.colors || {},
          typography: event.theme.typography || {},
          layout: event.theme.layout || 'centered',
          logo_url: event.theme.logo_url || null,
          banner_url: event.theme.banner_url || null
        }, { onConflict: 'event_id' });

      if (themeError) {
        const formattedErr = formatPostgresError(themeError, 'event');
        console.error('[Supabase syncEventToCloud Theme Error]:', formattedErr.message, themeError);
        return { data: null, error: formattedErr };
      }
    }

    const updatedEvent: Event = {
      ...event,
      id: eventUuid,
      org_id: orgUuid,
      created_by: userUuid,
      updated_at: new Date().toISOString()
    };

    return { data: updatedEvent, error: null };
  } catch (err: any) {
    console.error('[Supabase syncEventToCloud Exception]:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch all registrations from Supabase Cloud.
 * Returns { data, error } directly instead of swallowing errors.
 */
export async function fetchRemoteRegistrations(): Promise<{ data: Registration[] | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('[Supabase fetchRemoteRegistrations Error]:', error);
      return { data: null, error: formatPostgresError(error, 'registration') };
    }

    if (!data) return { data: [], error: null };

    const mappedRegs: Registration[] = data.map((row: any): Registration => {
      const resp = row.responses || {};
      return {
        id: row.id,
        event_id: row.event_id,
        registration_code: row.registration_code || `ACAD-${row.id.slice(0, 4).toUpperCase()}`,
        name: resp.name || resp.f_name || resp.fullName || 'Attendee',
        email: resp.email || resp.f_email || '',
        phone: resp.phone || resp.f_phone || '',
        responses: resp,
        status: row.status || 'confirmed',
        payment_status: row.payment_status || 'not_required',
        attendance_status: row.attendance_status || 'not_marked',
        source: row.source || 'direct',
        ip_address: row.ip_address || '',
        submitted_at: row.submitted_at || new Date().toISOString()
      };
    });

    return { data: mappedRegs, error: null };
  } catch (err: any) {
    console.error('[Supabase fetchRemoteRegistrations Exception]:', err);
    return { data: null, error: err };
  }
}

export async function syncRegistrationToCloud(
  reg: Registration,
  fallbackEvent?: Event
): Promise<{ data: Registration | null; error: any }> {
  try {
    const client = getSupabaseClient();
    const regUuid = isValidUUID(reg.id) ? reg.id : generateUUID();
    let eventUuid = isValidUUID(reg.event_id) ? reg.event_id : undefined;

    if (!eventUuid && fallbackEvent) {
      eventUuid = ensureValidUUID(fallbackEvent.id, fallbackEvent.slug || fallbackEvent.name);
    }

    if (!eventUuid) {
      eventUuid = ensureValidUUID(reg.event_id);
    }

    // 1. If fallbackEvent is provided, proactively sync the parent event first to guarantee foreign key exists
    if (fallbackEvent) {
      const eventToSync: Event = {
        ...fallbackEvent,
        id: eventUuid,
      };
      await syncEventToCloud(eventToSync);
    }

    const { error } = await client
      .from('registrations')
      .upsert({
        id: regUuid,
        event_id: eventUuid,
        registration_code: reg.registration_code,
        responses: {
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          ...(reg.responses || {})
        },
        status: reg.status || 'confirmed',
        payment_status: reg.payment_status || 'not_required',
        attendance_status: reg.attendance_status || 'not_marked',
        source: reg.source || 'direct',
        ip_address: reg.ip_address || null,
        submitted_at: reg.submitted_at || new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      // Auto-healing: If foreign key error occurred, attempt to sync the fallback event and retry once
      if (fallbackEvent && (error.code === '23503' || /foreign key/i.test(error.message || ''))) {
        console.log('[Supabase Auto-Healing] Syncing parent event to cloud and retrying registration insert...');
        await syncEventToCloud({ ...fallbackEvent, id: eventUuid });
        const retryRes = await client
          .from('registrations')
          .upsert({
            id: regUuid,
            event_id: eventUuid,
            registration_code: reg.registration_code,
            responses: {
              name: reg.name,
              email: reg.email,
              phone: reg.phone,
              ...(reg.responses || {})
            },
            status: reg.status || 'confirmed',
            payment_status: reg.payment_status || 'not_required',
            attendance_status: reg.attendance_status || 'not_marked',
            source: reg.source || 'direct',
            ip_address: reg.ip_address || null,
            submitted_at: reg.submitted_at || new Date().toISOString()
          }, { onConflict: 'id' });

        if (!retryRes.error) {
          return { data: { ...reg, id: regUuid, event_id: eventUuid }, error: null };
        }
      }

      const formattedErr = formatPostgresError(error, 'registration');
      console.error('[Supabase syncRegistrationToCloud Error]:', formattedErr.message, error);
      return { data: null, error: formattedErr };
    }

    return { data: { ...reg, id: regUuid, event_id: eventUuid }, error: null };
  } catch (err: any) {
    console.error('[Supabase syncRegistrationToCloud Exception]:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete an event from Supabase Cloud.
 */
export async function deleteEventFromCloud(eventId: string): Promise<{ success: boolean; error: any }> {
  try {
    if (!isValidUUID(eventId)) return { success: true, error: null };
    const client = getSupabaseClient();
    const { error } = await client.from('events').delete().eq('id', eventId);
    if (error) {
      console.error('[Supabase deleteEventFromCloud Error]:', error);
      return { success: false, error: formatPostgresError(error, 'event') };
    }
    return { success: true, error: null };
  } catch (err: any) {
    console.error('[Supabase deleteEventFromCloud Exception]:', err);
    return { success: false, error: err };
  }
}

/**
 * Delete a registration from Supabase Cloud.
 */
export async function deleteRegistrationFromCloud(regId: string): Promise<{ success: boolean; error: any }> {
  try {
    if (!isValidUUID(regId)) return { success: true, error: null };
    const client = getSupabaseClient();
    const { error } = await client.from('registrations').delete().eq('id', regId);
    if (error) {
      console.error('[Supabase deleteRegistrationFromCloud Error]:', error);
      return { success: false, error: formatPostgresError(error, 'registration') };
    }
    return { success: true, error: null };
  } catch (err: any) {
    console.error('[Supabase deleteRegistrationFromCloud Exception]:', err);
    return { success: false, error: err };
  }
}
