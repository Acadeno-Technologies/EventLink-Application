import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Event, Registration } from '../types';

const defaultSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pvsnehkntsbljgqagkbi.supabase.co';
const defaultAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2c25laGtudHNibGpncWFna2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzUyNDcsImV4cCI6MjEwNDYxMTI0N30.ZECkP606S1eGlt_UAq4qhVffuTm66jQlSw8zMOB2rmE';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const url = typeof window !== 'undefined' 
    ? (localStorage.getItem('ACADENO_SUPABASE_URL') || defaultSupabaseUrl)
    : defaultSupabaseUrl;

  const anonKey = typeof window !== 'undefined'
    ? (localStorage.getItem('ACADENO_SUPABASE_ANON_KEY') || defaultAnonKey)
    : defaultAnonKey;

  if (!url || !anonKey) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey);
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ACADENO_SUPABASE_URL', url.trim());
    localStorage.setItem('ACADENO_SUPABASE_ANON_KEY', anonKey.trim());
  }
  supabaseInstance = null; // Re-instantiate on next call
}

/**
 * Fetch all events from Supabase Cloud
 */
export async function fetchRemoteEvents(): Promise<Event[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch events notice:', error.message);
      return null;
    }
    return data as Event[];
  } catch (err) {
    console.warn('Supabase fetch events error:', err);
    return null;
  }
}

/**
 * Save / Upsert an event to Supabase Cloud
 */
export async function syncEventToCloud(event: Event): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('events')
      .upsert({
        id: event.id,
        org_id: event.org_id,
        name: event.name,
        slug: event.slug,
        short_description: event.short_description,
        banner_url: event.banner_url,
        venue: event.venue,
        start_date: event.start_date,
        end_date: event.end_date,
        start_time: event.start_time,
        end_time: event.end_time,
        status: event.status,
        created_by: event.created_by,
        created_at: event.created_at,
        updated_at: new Date().toISOString(),
        settings: event.settings,
        form_schema: event.form_schema,
        theme: event.theme
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync event notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync event error:', err);
    return false;
  }
}

/**
 * Fetch all registrations from Supabase Cloud
 */
export async function fetchRemoteRegistrations(): Promise<Registration[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch registrations notice:', error.message);
      return null;
    }
    return data as Registration[];
  } catch (err) {
    console.warn('Supabase fetch registrations error:', err);
    return null;
  }
}

/**
 * Sync a new registration to Supabase Cloud
 */
export async function syncRegistrationToCloud(reg: Registration): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('registrations')
      .insert({
        id: reg.id,
        event_id: reg.event_id,
        registration_code: reg.registration_code,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        responses: reg.responses,
        status: reg.status,
        payment_status: reg.payment_status,
        attendance_status: reg.attendance_status,
        source: reg.source,
        submitted_at: reg.submitted_at
      });

    if (error) {
      console.warn('Supabase sync registration notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync registration error:', err);
    return false;
  }
}
