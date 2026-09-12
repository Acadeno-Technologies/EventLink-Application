import { Event, Registration } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const DEFAULT_ORG_ID = 'f56b03a9-9097-4638-8c4a-6f68227b2789';
export const DEFAULT_USER_ID = 'd79ebd86-73b7-4f55-9108-cdda19919cf0';
export const SUPABASE_PROJECT_REF = 'neon-ep-proud-resonance';
export const NEON_LABEL = 'Neon Postgres';

async function apiRequest<T>(path: string, options?: RequestInit): Promise<{ data: T | null; error: Error | null }> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { data: null, error: new Error(payload.error || `Neon API ${response.status}`) };
    }

    return { data: payload as T, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: new Error(err?.message || 'Cannot reach Neon API. Start it with npm run dev (API on port 3001).'),
    };
  }
}

if (import.meta.env.DEV) {
  apiRequest<{ ok: boolean; database?: string }>('/api/health').then(({ data, error }) => {
    if (error || !data?.ok) {
      console.warn('[Neon] API health check failed:', error?.message || data);
    } else {
      console.log('[Neon] Connected — events will be stored in Neon Postgres.');
    }
  });
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

export async function fetchRemoteEvents(): Promise<{ data: Event[] | null; error: any }> {
  return apiRequest<Event[]>('/api/events');
}

export async function fetchRemoteEventBySlug(slug: string): Promise<{ data: Event | null; error: any }> {
  return apiRequest<Event>(`/api/events/by-slug/${encodeURIComponent(slug)}`);
}

export async function syncEventToCloud(event: Event): Promise<{ data: Event | null; error: any }> {
  return apiRequest<Event>('/api/events', {
    method: 'PUT',
    body: JSON.stringify(event),
  });
}

export async function fetchRemoteRegistrations(): Promise<{ data: Registration[] | null; error: any }> {
  return apiRequest<Registration[]>('/api/registrations');
}

export async function syncRegistrationToCloud(
  reg: Registration,
  fallbackEvent?: Event
): Promise<{ data: Registration | null; error: any }> {
  return apiRequest<Registration>('/api/registrations', {
    method: 'PUT',
    body: JSON.stringify({ ...reg, event: fallbackEvent }),
  });
}

export async function deleteEventFromCloud(eventId: string): Promise<{ success: boolean; error: any }> {
  const result = await apiRequest<{ success: boolean }>(`/api/events/${eventId}`, { method: 'DELETE' });
  return { success: !result.error, error: result.error };
}

export async function deleteRegistrationFromCloud(regId: string): Promise<{ success: boolean; error: any }> {
  const result = await apiRequest<{ success: boolean }>(`/api/registrations/${regId}`, { method: 'DELETE' });
  return { success: !result.error, error: result.error };
}

export async function fetchRemoteUsers(): Promise<{ data: any[] | null; error: any }> {
  return apiRequest<any[]>('/api/users');
}

export async function syncUserToCloud(user: any): Promise<{ data: any | null; error: any }> {
  return apiRequest<any>('/api/users', {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}

export async function deleteUserFromCloud(userId: string): Promise<{ success: boolean; error: any }> {
  const result = await apiRequest<{ success: boolean }>(`/api/users/${userId}`, { method: 'DELETE' });
  return { success: !result.error, error: result.error };
}

export async function loginRemote(email: string, password: string): Promise<{ data: { ok: boolean; user: any } | null; error: any }> {
  return apiRequest<{ ok: boolean; user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
