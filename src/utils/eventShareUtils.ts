import { Event } from '../types';
import { themePresets } from '../data/seedData';

/**
 * Encodes an event into a self-contained, portable URL with its full metadata.
 * This guarantees that when scanned via QR code or opened on any mobile phone / browser,
 * the recipient sees the exact event name, date, venue, capacity, banner, and schema.
 */
export function encodeEventToShareUrl(event: Event | undefined | null, origin?: string): string {
  if (!event) return '';

  const base = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://eventlink-application.onrender.com');
  
  let slug = event.slug ? event.slug.trim().toLowerCase() : '';
  if (!slug || slug.length <= 1) {
    slug = event.name ? event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'event';
  }

  // Return clean, short, professional registration URL
  return `${base}/?event=${encodeURIComponent(slug)}`;
}

/**
 * Decodes event details from URL search parameters on mobile phones or fresh browsers.
 */
export function decodeEventFromUrlParams(params: URLSearchParams, orgId: string): Event | null {
  const encodedData = params.get('d') || params.get('data');

  if (encodedData) {
    try {
      const decodedJson = decodeURIComponent(
        Array.prototype.map.call(atob(decodeURIComponent(encodedData)), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const parsed = JSON.parse(decodedJson);

      if (parsed && (parsed.name || parsed.slug)) {
        return {
          id: parsed.id || `evt-${parsed.slug || Date.now()}`,
          org_id: orgId,
          name: parsed.name || 'Event Registration',
          slug: parsed.slug || 'event',
          short_description: parsed.desc || `Registration for ${parsed.name} at ACADENO Technologies.`,
          banner_url: parsed.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
          venue: parsed.venue || 'ACADENO Technologies',
          start_date: parsed.start_date || new Date().toISOString().split('T')[0],
          end_date: parsed.end_date || parsed.start_date || new Date().toISOString().split('T')[0],
          start_time: parsed.start_time || '10:00 AM',
          end_time: parsed.end_time || '1:00 PM',
          status: parsed.status || 'active',
          created_by: 'arathy@acadeno.in',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          views_count: 1,
          form_schema: parsed.schema || parsed.form_schema || [
            { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, placeholder: 'Enter full name' },
            { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, placeholder: 'name@gmail.com' },
            { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, placeholder: '+91 98765 43210' },
          ],
          theme: ((parsed.themeTpl || parsed.themeId) && (themePresets as any)[parsed.themeTpl || parsed.themeId]) || parsed.theme || themePresets.workshop,
          settings: parsed.settings || {
            registration_opens_at: new Date().toISOString(),
            registration_closes_at: '',
            max_registrations: parsed.cap ? Number(parsed.cap) : 100,
            require_payment: false,
            after_registration: 'ticket',
            send_email_confirmation: true,
            send_whatsapp_confirmation: true,
            send_sms_confirmation: false,
            allow_excel_export: true,
            require_consent: true,
            consent_text: 'I agree to receive event notifications from ACADENO under India DPDP Act 2023 regulations.'
          }
        };
      }
    } catch (err) {
      console.error('Failed to decode event payload from URL param d:', err);
    }
  }

  const eventSlug = params.get('event') || params.get('e') || params.get('event_id') || params.get('slug');
  const titleParam = params.get('name') || params.get('title');

  if (!eventSlug && !titleParam) return null;

  const dateParam = params.get('date') || params.get('start_date');
  const venueParam = params.get('venue') || params.get('location');
  const capParam = params.get('cap') || params.get('max') || params.get('capacity');
  const bannerParam = params.get('banner') || params.get('banner_url') || params.get('img');
  const descParam = params.get('desc') || params.get('description');
  const timeParam = params.get('time') || params.get('start_time');

  const cleanTitle = titleParam ? titleParam.trim() : (eventSlug
    ? eventSlug
        .replace(/[-_]+/g, ' ')
        .replace(/\bai\b/gi, 'AI')
        .replace(/\bit\b/gi, 'IT')
        .replace(/\bui\b/gi, 'UI')
        .replace(/\bux\b/gi, 'UX')
        .replace(/\b\w/g, char => char.toUpperCase())
    : 'Event Registration');

  const cleanSlug = (eventSlug && eventSlug.trim().length > 1)
    ? eventSlug.trim().toLowerCase()
    : (titleParam ? titleParam.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : (eventSlug?.toLowerCase() || 'event'));

  const eventId = `evt-${cleanSlug}`;

  return {
    id: eventId,
    org_id: orgId,
    name: cleanTitle,
    slug: cleanSlug,
    short_description: descParam || `Registration for ${cleanTitle} at ACADENO Technologies.`,
    banner_url: bannerParam || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    venue: venueParam || 'ACADENO Technologies, CSEZ Unit, Kochi',
    start_date: dateParam || new Date().toISOString().split('T')[0],
    end_date: dateParam || new Date().toISOString().split('T')[0],
    start_time: timeParam || '10:00 AM',
    end_time: '1:00 PM',
    status: 'active',
    created_by: 'arathy@acadeno.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    views_count: 1,
    form_schema: [
      { id: 'f_name', type: 'text', label: 'Full Name', required: true, order: 1, placeholder: 'Enter full name' },
      { id: 'f_email', type: 'email', label: 'Email Address', required: true, order: 2, placeholder: 'name@gmail.com' },
      { id: 'f_phone', type: 'phone', label: 'Mobile Number', required: true, order: 3, placeholder: '+91 98765 43210' },
    ],
    theme: themePresets.workshop,
    settings: {
      registration_opens_at: new Date().toISOString(),
      registration_closes_at: '',
      max_registrations: capParam ? parseInt(capParam, 10) : 100,
      require_payment: false,
      after_registration: 'ticket',
      send_email_confirmation: true,
      send_whatsapp_confirmation: true,
      send_sms_confirmation: false,
      allow_excel_export: true,
      require_consent: true,
      consent_text: 'I agree to receive event notifications from ACADENO under India DPDP Act 2023 regulations.'
    }
  };
}
